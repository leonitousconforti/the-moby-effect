/**
 * Consumes streams from the Docker API.
 *
 * @since 1.0.0
 */

import * as Chunk from "effect/Chunk";
import * as Console from "effect/Console";
import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as Predicate from "effect/Predicate";
import * as Scope from "effect/Scope";
import * as Sink from "effect/Sink";
import * as Stream from "effect/Stream";

import { JSONMessage } from "../generated/JSONMessage.generated.js";

/**
 * Waits for the progress stream to complete and returns the result.
 *
 * @since 1.0.0
 * @category Conveyance Sinks
 */
export const waitForProgressToComplete = <E1, R1>(
    stream: Stream.Stream<JSONMessage, E1, R1>
): Effect.Effect<Chunk.Chunk<JSONMessage>, E1, Exclude<R1, Scope.Scope>> => Stream.run(stream, Sink.collectAll());

/**
 * Consumes the progress stream and logs it to the console.
 *
 * @since 1.0.0
 * @category Conveyance Sinks
 */
export const followProgressSink = Sink.forEach<JSONMessage, void, never, never>((message) =>
    Effect.gen(function* () {
        if (Predicate.isNotUndefined(message.status)) {
            yield* Console.log(`${message.status}${message.progress ? " " : ""}${message.progress ?? ""}`);
        } else if (Predicate.isNotUndefined(message.stream)) {
            yield* Console.log(message.stream);
        } else if (Predicate.isNotUndefined(message.aux)) {
            yield* Console.log(message.aux.ID);
        }
    })
);

/**
 * Tracks the progress stream in the console and returns the result.
 *
 * @since 1.0.0
 * @category Conveyance Sinks
 */
export const followProgressInConsole = <E1, R1>(
    stream: Stream.Stream<JSONMessage, E1, R1>
): Effect.Effect<Chunk.Chunk<JSONMessage>, E1, Exclude<R1, Scope.Scope>> =>
    Function.pipe(stream, Stream.tapSink(followProgressSink), waitForProgressToComplete);
