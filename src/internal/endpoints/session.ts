import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as Schema from "effect/Schema";
import * as HttpClient from "effect/unstable/http/HttpClient";
import * as HttpApi from "effect/unstable/httpapi/HttpApi";
import * as HttpApiClient from "effect/unstable/httpapi/HttpApiClient";
import * as HttpApiEndpoint from "effect/unstable/httpapi/HttpApiEndpoint";
import * as HttpApiGroup from "effect/unstable/httpapi/HttpApiGroup";
import * as HttpApiSchema from "effect/unstable/httpapi/HttpApiSchema";

import { MobyConnectionOptions } from "../../MobyConnection.js";
import { makeAgnosticHttpClientLayer } from "../../MobyPlatforms.js";
import { hijackResponseUnsafe } from "../demux/hijack.ts";
import { DockerError } from "./circular.ts";

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Session/operation/Session */
const sessionEndpoint = HttpApiEndpoint.post("session", "/session", {
    headers: {
        Upgrade: Schema.Literal("h2c"),
        Connection: Schema.Literal("Upgrade"),
    },
    success: [
        HttpApiSchema.Empty(101), // 101 Switching Protocols
        HttpApiSchema.Empty(200), // 200 OK
    ],
});

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
export class Sessions extends Context.Service<Sessions>()("@the-moby-effect/endpoints/Session", {
    make: Effect.gen(function* () {
        const httpClient = yield* HttpClient.HttpClient;
        const SessionsError = DockerError.WrapForModule("session");
        const client = yield* HttpApiClient.group(SessionApi, { group: "session", httpClient });

        const session_ = () =>
            client
                .session({
                    headers: {
                        Upgrade: "h2c",
                        Connection: "Upgrade",
                    },
                    responseMode: "response-only",
                })
                .pipe(Effect.map(hijackResponseUnsafe), Effect.mapError(SessionsError("session")));

        return { session: session_ };
    }),
}) {}

/**
 * @since 1.0.0
 * @category Layers
 * @see https://docs.docker.com/reference/api/engine/latest/#tag/Session
 */
export const SessionsLayer: Layer.Layer<Sessions, never, HttpClient.HttpClient> = Layer.effect(Sessions, Sessions.make);

/**
 * @since 1.0.0
 * @category Layers
 * @see https://docs.docker.com/reference/api/engine/latest/#tag/Session
 */
export const SessionsLayerLocalSocket: Layer.Layer<Sessions, never, HttpClient.HttpClient> = SessionsLayer.pipe(
    Layer.provide(
        makeAgnosticHttpClientLayer(
            MobyConnectionOptions.socket({
                socketPath: "/var/run/docker.sock",
            })
        )
    )
);
