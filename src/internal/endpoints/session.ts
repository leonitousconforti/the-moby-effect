import {
    HttpApi,
    HttpApiClient,
    HttpApiEndpoint,
    HttpApiGroup,
    HttpApiSchema,
    HttpClient,
    Error as PlatformError,
    type HttpApiError,
    type HttpClientError,
    type Socket,
} from "@effect/platform";
import { Effect, Predicate, Schema, String, type Layer, type ParseResult } from "effect";

import { MobyConnectionOptions } from "../../MobyConnection.js";
import { makeAgnosticHttpClientLayer } from "../../MobyPlatforms.js";
import { HttpApiSocket } from "./httpApiHacks.js";

/**
 * @since 1.0.0
 * @category Errors
 */
export const SessionsErrorTypeId: unique symbol = Symbol.for(
    "@the-moby-effect/endpoints/SessionsError"
) as SessionsErrorTypeId;

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
    cause:
        | Socket.SocketError
        | ParseResult.ParseError
        | HttpClientError.HttpClientError
        | HttpApiError.HttpApiDecodeError;
}> {
    public override get message() {
        return `${String.capitalize(this.method)} ${this.cause._tag}`;
    }

    public static WrapForMethod(method: string) {
        return (cause: SessionsError["cause"]) => new this({ method, cause });
    }
}

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Session/operation/Session */
const sessionEndpoint = HttpApiEndpoint.post("session", "/session")
    .setHeaders(
        Schema.Struct({
            Upgrade: Schema.Literal("h2c"),
            Connection: Schema.Literal("Upgrade"),
        })
    )
    .addSuccess(HttpApiSchema.Empty(101)) // 101 Switching Protocols
    .addSuccess(HttpApiSchema.Empty(200)); // 200 OK

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Session */
const SessionGroup = HttpApiGroup.make("session").add(sessionEndpoint);

/**
 * @since 1.0.0
 * @category HttpApi
 * @see https://docs.docker.com/reference/api/engine/latest/#tag/Session
 */
export const SessionApi = HttpApi.make("SessionApi").add(SessionGroup);

/**
 * @since 1.0.0
 * @category Services
 * @see https://docs.docker.com/reference/api/engine/latest/#tag/Session
 */
export class Sessions extends Effect.Service<Sessions>()("@the-moby-effect/endpoints/Session", {
    accessors: false,
    dependencies: [
        makeAgnosticHttpClientLayer(
            MobyConnectionOptions.socket({
                socketPath: "/var/run/docker.sock",
            })
        ),
    ],

    effect: Effect.gen(function* () {
        const httpClient = yield* HttpClient.HttpClient;
        yield* HttpApiClient.group(SessionApi, { group: "session", httpClient });

        const session_ = () =>
            Effect.mapError(
                HttpApiSocket(
                    SessionApi,
                    "session",
                    "session",
                    httpClient
                )({
                    headers: {
                        Upgrade: "h2c",
                        Connection: "Upgrade",
                    },
                }),
                SessionsError.WrapForMethod("session")
            );

        return { session: session_ };
    }),
}) {}

/**
 * @since 1.0.0
 * @category Layers
 * @see https://docs.docker.com/reference/api/engine/latest/#tag/Session
 */
export const SessionsLayerLocalSocket: Layer.Layer<Sessions, never, HttpClient.HttpClient> = Sessions.Default;

/**
 * @since 1.0.0
 * @category Layers
 * @see https://docs.docker.com/reference/api/engine/latest/#tag/Session
 */
export const SessionsLayer: Layer.Layer<Sessions, never, HttpClient.HttpClient> = Sessions.DefaultWithoutDependencies;
