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
import * as Function from "effect/Function";
import * as Layer from "effect/Layer";
import * as Predicate from "effect/Predicate";

import * as AgentCommon from "./Common.js";

/**
 * @since 1.0.0
 * @category Connection
 */
export const getWebRequestUrl: (
    connectionOptions: AgentCommon.MobyConnectionOptions
) => string | ConfigError.ConfigError = AgentCommon.MobyConnectionOptions.$match({
    ssh: () => ConfigError.Unsupported([], "Unsupported platform"),
    socket: () => ConfigError.Unsupported([], "Unsupported platform"),
    http: (options) => `http://0.0.0.0${options.path ?? ""}`,
    https: (options) => `https://0.0.0.0${options.path ?? ""}`,
});

/**
 * Given the moby connection options, it will construct a layer that provides a
 * http client that you could use to connect to your moby instance.
 *
 * @since 1.0.0
 * @category Connection
 */
export const makeBrowserHttpClientLayer = (
    connectionOptions: AgentCommon.MobyConnectionOptions
): Layer.Layer<HttpClient.HttpClient.Default, ConfigError.ConfigError, never> =>
    Function.pipe(
        Effect.promise(() => import("@effect/platform-browser/BrowserHttpClient")),
        Effect.map((browserHttpClientLazy) => browserHttpClientLazy.layerXMLHttpRequest),
        Layer.unwrapEffect,
        Layer.flatMap((context) => {
            const oldClient = Context.get(context, HttpClient.HttpClient);
            const maybeRequestUrl = getWebRequestUrl(connectionOptions);
            if (!Predicate.isString(maybeRequestUrl)) {
                return Layer.fail(maybeRequestUrl);
            }
            const newClient = HttpClient.mapRequest(oldClient, HttpClientRequest.prependUrl(maybeRequestUrl));
            const newContext = Context.make(HttpClient.HttpClient, newClient);
            return Layer.succeedContext(newContext);
        })
    );
