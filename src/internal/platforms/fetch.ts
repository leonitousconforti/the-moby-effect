import type * as HttpClient from "effect/unstable/http/HttpClient";

import * as Layer from "effect/Layer";
import * as FetchHttpClient from "effect/unstable/http/FetchHttpClient";
import * as Socket from "effect/unstable/socket/Socket";

import type * as MobyConnection from "../../MobyConnection.js";

import * as internalAgnostic from "./agnostic.js";

/** @internal */
export const makeFetchHttpClientLayer = (
    connectionOptions: MobyConnection.HttpConnectionOptionsTagged | MobyConnection.HttpsConnectionOptionsTagged
): Layer.Layer<HttpClient.HttpClient | Socket.WebSocketConstructor, never, never> =>
    internalAgnostic
        .makeAgnosticHttpClientLayer(connectionOptions)
        .pipe(Layer.merge(Socket.layerWebSocketConstructorGlobal), Layer.provide(FetchHttpClient.layer));
