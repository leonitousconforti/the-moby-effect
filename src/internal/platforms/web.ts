import type * as HttpClient from "@effect/platform/HttpClient";
import type * as MobyConnection from "../../MobyConnection.js";

import * as Socket from "@effect/platform/Socket";
import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as Layer from "effect/Layer";
import * as internalAgnostic from "./agnostic.js";

/** @internal */
export const makeWebHttpClientLayer = (
    connectionOptions: MobyConnection.HttpConnectionOptionsTagged | MobyConnection.HttpsConnectionOptionsTagged
): Layer.Layer<HttpClient.HttpClient | Socket.WebSocketConstructor, never, never> => {
    const browserLayer = Function.pipe(
        Effect.promise(() => import("@effect/platform-browser/BrowserHttpClient")),
        Effect.map((browserHttpClientLazy) => browserHttpClientLazy.layerXMLHttpRequest),
        Layer.unwrapEffect
    );
    const agnosticHttpClientLayer = internalAgnostic.makeAgnosticHttpClientLayer(connectionOptions);
    return agnosticHttpClientLayer
        .pipe(Layer.merge(Socket.layerWebSocketConstructorGlobal))
        .pipe(Layer.provide(browserLayer));
};
