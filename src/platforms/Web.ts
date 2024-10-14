/**
 * Http and https connection methods for the web.
 *
 * @since 1.0.0
 */

import * as HttpClient from "@effect/platform/HttpClient";
import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as Layer from "effect/Layer";

import { HttpConnectionOptionsTagged, HttpsConnectionOptionsTagged } from "../Connection.js";
import { makeAgnosticHttpClientLayer } from "./Agnostic.js";

/**
 * Given the moby connection options, it will construct a layer that provides a
 * http client that you could use to connect to your moby instance.
 *
 * This function will dynamically import the `@effect/platform-browser` package.
 *
 * @since 1.0.0
 * @category Browser
 */
export const makeWebHttpClientLayer = (
    connectionOptions: HttpConnectionOptionsTagged | HttpsConnectionOptionsTagged
): Layer.Layer<HttpClient.HttpClient, never, never> => {
    const browserLayer = Function.pipe(
        Effect.promise(() => import("@effect/platform-browser/BrowserHttpClient")),
        Effect.map((browserHttpClientLazy) => browserHttpClientLazy.layerXMLHttpRequest),
        Layer.unwrapEffect
    );
    const agnosticHttpClientLayer = makeAgnosticHttpClientLayer(connectionOptions);
    return Layer.provide(agnosticHttpClientLayer, browserLayer);
};
