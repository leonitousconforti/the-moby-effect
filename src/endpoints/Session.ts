/**
 * Sessions service
 *
 * @since 1.0.0
 */

import * as NodeSocket from "@effect/platform-node/NodeSocket";
import * as PlatformError from "@effect/platform/Error";
import * as HttpClient from "@effect/platform/HttpClient";
import * as HttpClientError from "@effect/platform/HttpClientError";
import * as HttpClientRequest from "@effect/platform/HttpClientRequest";
import * as Socket from "@effect/platform/Socket";
import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as Layer from "effect/Layer";
import * as Predicate from "effect/Predicate";
import * as Scope from "effect/Scope";

import { IExposeSocketOnEffectClientResponseHack } from "../platforms/Node.js";

/**
 * @since 1.0.0
 * @category Errors
 */
export const SessionsErrorTypeId: unique symbol = Symbol.for("@the-moby-effect/moby/SessionsError");

/**
 * @since 1.0.0
 * @category Errors
 */
export type SessionsErrorTypeId = typeof SessionsErrorTypeId;

/**
 * @since 1.0.0
 * @category Errors
 */
export const isSessionsError = (u: unknown): u is SessionsError => Predicate.hasProperty(u, SessionsErrorTypeId);

/**
 * @since 1.0.0
 * @category Errors
 */
export class SessionsError extends PlatformError.TypeIdError(SessionsErrorTypeId, "SessionsError")<{
    method: string;
    cause: HttpClientError.HttpClientError;
}> {
    get message() {
        return this.method;
    }
}

/**
 * @since 1.0.0
 * @category Tags
 */
export interface SessionsImpl {
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

/**
 * @since 1.0.0
 * @category Services
 */
export const make: Effect.Effect<SessionsImpl, never, HttpClient.HttpClient.Service> = Effect.gen(function* () {
    const defaultClient = yield* HttpClient.HttpClient;
    const client = defaultClient.pipe(HttpClient.filterStatus((status) => status === 101));

    const session_ = (): Effect.Effect<Socket.Socket, SessionsError, Scope.Scope> =>
        Function.pipe(
            HttpClientRequest.post("/session"),
            HttpClientRequest.setHeader("Upgrade", "h2c"),
            HttpClientRequest.setHeader("Connection", "Upgrade"),
            client.execute,
            Effect.map((response) => (response as IExposeSocketOnEffectClientResponseHack).source.socket),
            Effect.flatMap((socket) => NodeSocket.fromDuplex(Effect.sync(() => socket))),
            Effect.mapError((cause) => new SessionsError({ method: "session", cause }))
        );

    return { session: session_ };
});

/**
 * Sessions service
 *
 * @since 1.0.0
 * @category Tags
 */
export class Sessions extends Effect.Tag("@the-moby-effect/endpoints/Session")<Sessions, SessionsImpl>() {}

/**
 * Configs layer that depends on the MobyConnectionAgent
 *
 * @since 1.0.0
 * @category Layers
 */
export const layer: Layer.Layer<Sessions, never, HttpClient.HttpClient.Service> = Layer.effect(Sessions, make);
