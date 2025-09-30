import { HttpApi, HttpApiClient, HttpApiEndpoint, HttpApiGroup, HttpApiSchema, HttpClient } from "@effect/platform";
import { Effect, Schema, type Layer } from "effect";

import { MobyConnectionOptions } from "../../MobyConnection.js";
import { makeAgnosticHttpClientLayer } from "../../MobyPlatforms.js";
import { DockerError } from "./circular.ts";
import { HttpApiSocket } from "./httpApiHacks.js";

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
        const SessionsError = DockerError.WrapForModule("session");
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
                SessionsError("session")
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
