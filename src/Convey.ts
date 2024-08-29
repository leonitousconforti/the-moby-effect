/**
 * Convenance utilities for Docker input and output streams.
 *
 * @since 1.0.0
 */

import * as sinksInternal from "./convey/Sinks.js";
import * as streamsInternal from "./convey/Streams.js";

/**
 * Tracks the progress stream in the console and returns the result.
 *
 * @since 1.0.0
 * @category Conveyance Sinks
 */
export const followProgressInConsole = sinksInternal.followProgressInConsole;

/**
 * Waits for the progress stream to complete and returns the result.
 *
 * @since 1.0.0
 * @category Conveyance Sinks
 */
export const waitForProgressToComplete = sinksInternal.waitForProgressToComplete;

/**
 * Packs the context into a tarball stream to use with the build endpoint using
 * the tar-fs npm package. Because we read from the filesystem, this will only
 * work in Node.js/Deno/Bun. If you need to pack a build context in the browser,
 * see {@link packBuildContextIntoTarballStream2}.
 *
 * @since 1.0.0
 * @category Conveyance Streams
 */
export const packBuildContextIntoTarballStreamServer = streamsInternal.packBuildContextIntoTarballStreamServer;

/**
 * Packs the context into a tarball stream to use with the build endpoint using
 * an in-memory implementation. This is useful for the browser, where we don't
 * have access to the filesystem.
 *
 * @since 1.0.0
 * @category Conveyance Streams
 */
export const packBuildContextIntoTarballStreamWeb = streamsInternal.packBuildContextIntoTarballStreamWeb;
