/**
 * Http, https, ssh, and unix socket connection agents for Deno.
 *
 * @since 1.0.0
 */

import * as HttpClient from "@effect/platform/HttpClient";
import * as Layer from "effect/Layer";

import { MobyConnectionOptions } from "../MobyConnection.js";
import { makeNodeHttpClientLayer } from "./Node.js";

/**
 * Given the moby connection options, it will construct a layer that provides a
 * http client that you could use to connect to your moby instance. This is no
 * different than the Node implementation currently.
 *
 * This function will dynamically import the `@effect/platform-node` package.
 *
 * @since 1.0.0
 * @category Deno
 */
export const makeDenoHttpClientLayer: (
    connectionOptions: MobyConnectionOptions
) => Layer.Layer<HttpClient.HttpClient, never, never> = makeNodeHttpClientLayer;
