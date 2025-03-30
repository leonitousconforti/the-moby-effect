/**
 * Convenance utilities for Docker input and output streams.
 *
 * @since 1.0.0
 */

import type * as Chunk from "effect/Chunk";
import type * as Effect from "effect/Effect";
import type * as Scope from "effect/Scope";
import type * as Sink from "effect/Sink";
import type * as Stream from "effect/Stream";

import * as internal from "./internal/convey/sinks.js";
import { JSONMessage } from "./internal/generated/JSONMessage.generated.js";

/**
 * Waits for the progress stream to complete and returns the result.
 *
 * @since 1.0.0
 * @category Conveyance Sinks
 */
export const waitForProgressToComplete: <E1, R1>(
    stream: Stream.Stream<JSONMessage, E1, R1>
) => Effect.Effect<Chunk.Chunk<JSONMessage>, E1, Exclude<R1, Scope.Scope>> = internal.waitForProgressToComplete;

/**
 * Consumes the progress stream and logs it to the console.
 *
 * @since 1.0.0
 * @category Conveyance Sinks
 */
export const followProgressSink: Sink.Sink<void, JSONMessage, never, never, never> = internal.followProgressSink;

/**
 * Tracks the progress stream in the console and returns the result.
 *
 * @since 1.0.0
 * @category Conveyance Sinks
 */
export const followProgressInConsole: <E1, R1>(
    stream: Stream.Stream<JSONMessage, E1, R1>
) => Effect.Effect<Chunk.Chunk<JSONMessage>, E1, Exclude<R1, Scope.Scope>> = internal.followProgressInConsole;
