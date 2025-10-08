import type * as HttpClient from "@effect/platform/HttpClient";
import type * as MobyConnection from "../../MobyConnection.js";

import * as FetchHttpClient from "@effect/platform/FetchHttpClient";
import * as Socket from "@effect/platform/Socket";
import * as Layer from "effect/Layer";
import * as internalAgnostic from "./agnostic.js";

/** @internal */
export const makeFetchHttpClientLayer = (
    connectionOptions: MobyConnection.HttpConnectionOptionsTagged | MobyConnection.HttpsConnectionOptionsTagged
): Layer.Layer<HttpClient.HttpClient | Socket.WebSocketConstructor, never, never> =>
    internalAgnostic
        .makeAgnosticHttpClientLayer(connectionOptions)
        .pipe(Layer.merge(Socket.layerWebSocketConstructorGlobal))
        .pipe(Layer.provide(FetchHttpClient.layer));
