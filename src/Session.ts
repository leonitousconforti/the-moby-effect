/**
 * Sessions service
 *
 * @since 1.0.0
 */

import * as HttpClient from "@effect/platform/HttpClient";
import * as Socket from "@effect/platform/Socket";
import * as Context from "effect/Context";
import * as Data from "effect/Data";
import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as Layer from "effect/Layer";
import * as Scope from "effect/Scope";

import { NodeSocket } from "@effect/platform-node";
import {
    IMobyConnectionAgent,
    IMobyConnectionAgentImpl,
    MobyConnectionAgent,
    MobyConnectionOptions,
    MobyHttpClientLive,
    getAgent,
} from "./Agent.js";
import { IExposeSocketOnEffectClientResponse, responseErrorHandler } from "./Requests.js";

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
    readonly session: () => Effect.Effect<Socket.Socket, SessionsError, Scope.Scope>;
}

const make: Effect.Effect<Sessions, never, IMobyConnectionAgent | HttpClient.client.Client.Default> = Effect.gen(
    function* (_: Effect.Adapter) {
        const agent = yield* _(MobyConnectionAgent);
        const defaultClient = yield* _(HttpClient.client.Client);

        const client = defaultClient.pipe(
            HttpClient.client.mapRequest(HttpClient.request.prependUrl(agent.nodeRequestUrl)),
            HttpClient.client.filterStatus((status) => status === 101)
        );

        const responseHandler = (method: string) =>
            responseErrorHandler((message) => new SessionsError({ method, message }));

        const session_ = (): Effect.Effect<Socket.Socket, SessionsError, Scope.Scope> =>
            Function.pipe(
                HttpClient.request.post("/session"),
                HttpClient.request.setHeader("Upgrade", "h2c"),
                HttpClient.request.setHeader("Connection", "Upgrade"),
                client,
                Effect.map((response) => (response as IExposeSocketOnEffectClientResponse).source.socket),
                Effect.flatMap((socket) => NodeSocket.fromNetSocket(Effect.sync(() => socket))),
                Effect.catchAll(responseHandler("sessions"))
            );

        return { session: session_ };
    }
);

export const Sessions = Context.GenericTag<Sessions>("the-moby-effect/Sessions");
export const layer = Layer.effect(Sessions, make).pipe(Layer.provide(MobyHttpClientLive));

export const fromAgent = (agent: Effect.Effect<IMobyConnectionAgentImpl, never, Scope.Scope>) =>
    layer.pipe(Layer.provide(Layer.scoped(MobyConnectionAgent, agent)));

export const fromConnectionOptions = (connectionOptions: MobyConnectionOptions) =>
    fromAgent(getAgent(connectionOptions));
