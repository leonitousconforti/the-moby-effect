/**
 * Http and https connection methods for the web.
 *
 * @since 1.0.0
 */

import * as HttpClient from "@effect/platform/HttpClient";
import * as HttpClientRequest from "@effect/platform/HttpClientRequest";
import * as ConfigError from "effect/ConfigError";
import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";

import { MobyConnectionOptions, getWebRequestUrl } from "./Common.js";

/**
 * Given the moby connection options, it will construct a layer that provides a
 * http client that you could use to connect to your moby instance.
 *
 * @since 1.0.0
 * @category Connection
 */
export const makeBrowserHttpClientLayer = (
    connectionOptions: MobyConnectionOptions
): Layer.Layer<HttpClient.HttpClient.Default, ConfigError.ConfigError, never> =>
    Effect.gen(function* () {
        if (connectionOptions._tag === "socket" || connectionOptions._tag === "ssh") {
            return yield* Effect.fail(
                ConfigError.Unsupported([""], "Web agent does not support socket or ssh connections")
            );
        }

        const browserHttpClientLazy = yield* Effect.promise(() => import("@effect/platform-browser/BrowserHttpClient"));
        const browserHttpClientLayer = browserHttpClientLazy.layerXMLHttpRequest;
        return Layer.map(browserHttpClientLayer, (context) => {
            const oldClient = Context.get(context, HttpClient.HttpClient);
            const requestUrl = getWebRequestUrl(connectionOptions);
            const newClient = HttpClient.mapRequest(oldClient, HttpClientRequest.prependUrl(requestUrl));
            const newContext = Context.make(HttpClient.HttpClient, newClient);
            return newContext;
        });
    }).pipe(Layer.unwrapEffect);
