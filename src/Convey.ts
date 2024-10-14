/**
 * Convenance utilities for Docker input and output streams.
 *
 * @since 1.0.0
 */

import * as sinksInternal from "./convey/Sinks.js";
import * as streamsInternal from "./convey/Streams.js";

/**
 * @since 1.0.0
 * @category Conveyance Sinks
 */
export const followProgressInConsole = sinksInternal.followProgressInConsole;

/**
 * @since 1.0.0
 * @category Conveyance Sinks
 */
export const waitForProgressToComplete = sinksInternal.waitForProgressToComplete;

/**
 * @since 1.0.0
 * @category Conveyance Streams
 */
export const packBuildContextIntoTarballStream = streamsInternal.packBuildContextIntoTarballStream;
