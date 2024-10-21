/**
 * Http client layers for all platforms.
 *
 * @since 1.0.0
 */

import * as agnosticInternal from "./platforms/Agnostic.js";
import * as bunInternal from "./platforms/Bun.js";
import * as denoInternal from "./platforms/Deno.js";
import * as nodeInternal from "./platforms/Node.js";
import * as undiciInternal from "./platforms/Undici.js";
import * as webInternal from "./platforms/Web.js";

/**
 * Given the moby connection options, it will construct a layer that provides a
 * http client that you could use to connect to your moby instance.
 *
 * @since 1.0.0
 * @category Connection
 */
export const makeAgnosticHttpClientLayer = agnosticInternal.makeAgnosticHttpClientLayer;

/**
 * Given the moby connection options, it will construct a layer that provides a
 * http client that you could use to connect to your moby instance. This is no
 * different than the Node implementation currently.
 *
 * @since 1.0.0
 * @category Connection
 */
export const makeBunHttpClientLayer = bunInternal.makeBunHttpClientLayer;

/**
 * Given the moby connection options, it will construct a layer that provides a
 * http client that you could use to connect to your moby instance. This is no
 * different than the Node implementation currently.
 *
 * @since 1.0.0
 * @category Connection
 */
export const makeDenoHttpClientLayer = denoInternal.makeDenoHttpClientLayer;

/**
 * Given the moby connection options, it will construct a layer that provides a
 * http client that you could use to connect to your moby instance.
 *
 * @since 1.0.0
 * @category Connection
 */
export const makeNodeHttpClientLayer = nodeInternal.makeNodeHttpClientLayer;

/**
 * Given the moby connection options, it will construct a layer that provides a
 * http client that you could use to connect to your moby instance.
 *
 * @since 1.0.0
 * @category Connection
 */
export const makeUndiciHttpClientLayer = undiciInternal.makeUndiciHttpClientLayer;

/**
 * Given the moby connection options, it will construct a layer that provides a
 * http client that you could use to connect to your moby instance.
 *
 * @since 1.0.0
 * @category Connection
 */
export const makeWebHttpClientLayer = webInternal.makeWebHttpClientLayer;
