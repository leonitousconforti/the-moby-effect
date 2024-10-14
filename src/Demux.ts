/**
 * Demux utilities for different types of docker streams.
 *
 * @since 1.0.0
 */

import * as demuxInternal from "./demux/Demux.js";

/**
 * @since 1.0.0
 * @category Demux
 */
export const demuxToSingleSink = demuxInternal.demuxToSingleSink;

/**
 * @since 1.0.0
 * @category Demux
 */
export const demuxToSeparateSinks = demuxInternal.demuxToSeparateSinks;

/**
 * @since 1.0.0
 * @category Demux
 */
export const demuxUnknownToSeparateSinks = demuxInternal.demuxUnknownToSeparateSinks;
