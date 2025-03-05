/**
 * Convenance utilities for Docker input and output streams.
 *
 * @since 1.0.0
 */

import * as sinksInternal from "./convey/Sinks.js";

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
