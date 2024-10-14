/**
 * Http, https, ssh, and unix socket connection agents for all platforms.
 *
 * @since 1.0.0
 */

import * as AgnosticInternal from "./platforms/Agnostic.js";
import * as BunInternal from "./platforms/Bun.js";
import * as DenoInternal from "./platforms/Deno.js";
import * as NodeInternal from "./platforms/Node.js";
import * as UndiciInternal from "./platforms/Undici.js";
import * as WebInternal from "./platforms/Web.js";

/**
 * Given the moby connection options, it will construct a layer that provides a
 * http client that you could use to connect to your moby instance. This is no
 * different than the Node implementation currently.
 *
 * @since 1.0.0
 * @category Connection
 */
export const makeBunHttpClientLayer = BunInternal.makeBunHttpClientLayer;

/**
 * Given the moby connection options, it will construct a layer that provides a
 * http client that you could use to connect to your moby instance. This is no
 * different than the Node implementation currently.
 *
 * @since 1.0.0
 * @category Connection
 */
export const makeDenoHttpClientLayer = DenoInternal.makeDenoHttpClientLayer;

/**
 * Given the moby connection options, it will construct a layer that provides a
 * http client that you could use to connect to your moby instance.
 *
 * @since 1.0.0
 * @category Connection
 */
export const makeNodeHttpClientLayer = NodeInternal.makeNodeHttpClientLayer;

/**
 * Given the moby connection options, it will construct a layer that provides a
 * http client that you could use to connect to your moby instance.
 *
 * @since 1.0.0
 * @category Connection
 */
export const makeUndiciHttpClientLayer = UndiciInternal.makeUndiciHttpClientLayer;

/**
 * Given the moby connection options, it will construct a layer that provides a
 * http client that you could use to connect to your moby instance.
 *
 * @since 1.0.0
 * @category Connection
 */
export const makeWebHttpClientLayer = WebInternal.makeWebHttpClientLayer;

/**
 * Given the moby connection options, it will construct a layer that provides a
 * http client that you could use to connect to your moby instance.
 *
 * @since 1.0.0
 * @category Connection
 */
export const makeAgnosticHttpClientLayer = AgnosticInternal.makeAgnosticHttpClientLayer;
