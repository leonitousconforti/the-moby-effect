import * as NodeHttp from "@effect/platform-node/HttpClient";
import { Data, Effect } from "effect";

import { errorHandler } from "./request-helpers.js";
import { IMobyConnectionAgent, MobyConnectionAgent, WithConnectionAgentProvided } from "./agent-helpers.js";

export class SessionError extends Data.TaggedError("SessionError")<{ message: string }> {}

/**
 * Start a new interactive session with a server. Session allows server to call
 * back to the client for advanced capabilities. ### Hijacking This endpoint
 * hijacks the HTTP connection to HTTP2 transport that allows the client to
 * expose gPRC services on that connection. For example, the client sends this
 * request to upgrade the connection: `POST /session HTTP/1.1 Upgrade: h2c
 * Connection: Upgrade` The Docker daemon responds with a `101 UPGRADED`
 * response follow with the raw stream: `HTTP/1.1 101 UPGRADED Connection:
 * Upgrade Upgrade: h2c`
 */
export const session = (): Effect.Effect<IMobyConnectionAgent, SessionError, void> =>
    Effect.gen(function* (_: Effect.Adapter) {
        const endpoint: string = "/session";
        const method: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" = "POST";
        const sanitizedEndpoint: string = endpoint;

        const agent: IMobyConnectionAgent = yield* _(MobyConnectionAgent);
        const url: string = `${agent.connectionOptions.protocol === "https" ? "https" : "http"}://0.0.0.0`;
        const client: NodeHttp.client.Client.Default = yield* _(
            NodeHttp.nodeClient.make.pipe(Effect.provideService(NodeHttp.nodeClient.HttpAgent, agent))
        );

        return NodeHttp.request
            .make(method)(sanitizedEndpoint)
            .pipe(NodeHttp.request.prependUrl(url))
            .pipe(client.pipe(NodeHttp.client.filterStatusOk))
            .pipe(errorHandler(SessionError));
    }).pipe(Effect.flatten);

export interface ISessionService {
    /**
     * Start a new interactive session with a server. Session allows server to
     * call back to the client for advanced capabilities. ### Hijacking This
     * endpoint hijacks the HTTP connection to HTTP2 transport that allows the
     * client to expose gPRC services on that connection. For example, the
     * client sends this request to upgrade the connection: `POST /session
     * HTTP/1.1 Upgrade: h2c Connection: Upgrade` The Docker daemon responds
     * with a `101 UPGRADED` response follow with the raw stream: `HTTP/1.1 101
     * UPGRADED Connection: Upgrade Upgrade: h2c`
     */
    session: WithConnectionAgentProvided<typeof session>;
}
