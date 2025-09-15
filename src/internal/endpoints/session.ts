import type * as HttpClientError from "@effect/platform/HttpClientError";
import type * as Socket from "@effect/platform/Socket";
import type * as Layer from "effect/Layer";

import * as HttpClient from "@effect/platform/HttpClient";
import * as HttpClientRequest from "@effect/platform/HttpClientRequest";
import * as Effect from "effect/Effect";
import * as Function from "effect/Function";

import { MobyConnectionOptions } from "../../MobyConnection.js";
import { makeAgnosticHttpClientLayer } from "../../MobyPlatforms.js";
import { hijackResponseUnsafe } from "../demux/hijack.js";

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
        const client = HttpClient.filterStatus(httpClient, (status) => status === 101);

        /**
         * Start a new interactive session with a server. Session allows server
         * to call back to the client for advanced capabilities. This endpoint
         * hijacks the HTTP connection to HTTP2 transport that allows the client
         * to expose gPRC services on that connection. For example, the client
         * sends this request to upgrade the connection: `POST /session HTTP/1.1
         * Upgrade: h2c Connection: Upgrade` The Docker daemon responds with a
         * `101 UPGRADED` response follow with the raw stream: `HTTP/1.1 101
         * UPGRADED Connection: Upgrade Upgrade: h2c`
         *
         * @see https://docs.docker.com/reference/api/engine/latest/#tag/Session/operation/Session
         */
        const session_ = (): Effect.Effect<
            Socket.Socket,
            HttpClientError.HttpClientError | Socket.SocketError,
            never
        > =>
            Function.pipe(
                HttpClientRequest.post("/session"),
                HttpClientRequest.setHeader("Upgrade", "h2c"),
                HttpClientRequest.setHeader("Connection", "Upgrade"),
                client.execute,
                Effect.flatMap(hijackResponseUnsafe)
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
