import * as NodeSocket from "@effect/experimental/Socket/Node";
import * as NodeHttp from "@effect/platform-node/HttpClient";
import * as Context from "effect/Context";
import * as Data from "effect/Data";
import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as Layer from "effect/Layer";
import * as Scope from "effect/Scope";

import {
    IMobyConnectionAgent,
    MobyConnectionAgent,
    MobyConnectionOptions,
    MobyHttpClientLive,
    getAgent,
} from "./agent-helpers.js";
import { IExposeSocketOnEffectClientResponse, responseErrorHandler } from "./request-helpers.js";

export class SessionsError extends Data.TaggedError("SessionsError")<{
    method: string;
    message: string;
}> {}

export interface Sessions {
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
    readonly session: () => Effect.Effect<never, SessionsError, NodeSocket.Socket>;
}

const make: Effect.Effect<IMobyConnectionAgent | NodeHttp.client.Client.Default, never, Sessions> = Effect.gen(
    function* (_: Effect.Adapter) {
        const agent = yield* _(MobyConnectionAgent);
        const defaultClient = yield* _(NodeHttp.client.Client);

        const client = defaultClient.pipe(
            NodeHttp.client.mapRequest(NodeHttp.request.prependUrl(agent.nodeRequestUrl)),
            NodeHttp.client.filterStatus((status) => status === 101)
        );

        const responseHandler = (method: string) =>
            responseErrorHandler((message) => new SessionsError({ method, message }));

        const session_ = (): Effect.Effect<never, SessionsError, NodeSocket.Socket> =>
            Function.pipe(
                NodeHttp.request.post("/session"),
                NodeHttp.request.setHeader("Upgrade", "h2c"),
                NodeHttp.request.setHeader("Connection", "Upgrade"),
                client,
                Effect.map((response) => (response as IExposeSocketOnEffectClientResponse).source.socket),
                Effect.flatMap((socket) => NodeSocket.fromNetSocket(Effect.sync(() => socket))),
                Effect.catchAll(responseHandler("sessions"))
            );

        return { session: session_ };
    }
);

export const Sessions = Context.Tag<Sessions>("the-moby-effect/Sessions");
export const layer = Layer.effect(Sessions, make).pipe(Layer.provide(MobyHttpClientLive));

export const fromAgent = (agent: Effect.Effect<Scope.Scope, never, IMobyConnectionAgent>) =>
    layer.pipe(Layer.provide(Layer.scoped(MobyConnectionAgent, agent)));

export const fromConnectionOptions = (connectionOptions: MobyConnectionOptions) =>
    fromAgent(getAgent(connectionOptions));
