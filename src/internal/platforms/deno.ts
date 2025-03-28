/**
 * Http, https, ssh, and unix socket connection agents for Deno.
 *
 * @since 1.0.0
 */

import * as HttpClient from "@effect/platform/HttpClient";
import * as Socket from "@effect/platform/Socket";
import * as Layer from "effect/Layer";

import type { MobyConnectionOptions } from "../../MobyConnection.js";
import { makeNodeHttpClientLayer } from "./node.js";

/**
 * Given the moby connection options, it will construct a layer that provides a
 * http client that you could use to connect to your moby instance. This is no
 * different than the Node implementation currently.
 *
 * This function will dynamically import the `@effect/platform-node` package.
 *
 * FIXME: https://github.com/denoland/deno/issues/21436?
 *
 * Will fallback to using undici for now because that seems to work
 *
 * @since 1.0.0
 * @category Deno
 */
export const makeDenoHttpClientLayer: (
    connectionOptions: MobyConnectionOptions
) => Layer.Layer<HttpClient.HttpClient | Socket.WebSocketConstructor, never, never> = makeNodeHttpClientLayer;
