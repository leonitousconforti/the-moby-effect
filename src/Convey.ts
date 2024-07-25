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
 */
export const followProgressInConsole = sinksInternal.followProgressInConsole;

/**
 * Waits for the progress stream to complete and returns the result.
 *
 * @since 1.0.0
 */
export const waitForProgressToComplete = sinksInternal.waitForProgressToComplete;

/**
 * Packs the context into a tarball stream to use with the build endpoint.
 *
 * @since 1.0.0
 */
export const packBuildContextIntoTarballStream = streamsInternal.packBuildContextIntoTarballStream;
