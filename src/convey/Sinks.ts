/**
 * Consumes streams from the Docker API.
 *
 * @since 1.0.0
 */

import * as Chunk from "effect/Chunk";
import * as Effect from "effect/Effect";
import * as Scope from "effect/Scope";
import * as Sink from "effect/Sink";
import * as Stream from "effect/Stream";
import * as Tuple from "effect/Tuple";

import { ContainersError } from "../endpoints/Containers.js";
import { JSONMessage } from "../generated/JSONMessage.generated.js";

/**
 * Waits for the progress stream to complete and returns the result.
 *
 * @since 1.0.0
 */
export const waitForProgressToComplete = <R1>(
    stream: Stream.Stream<JSONMessage, ContainersError, R1>
): Effect.Effect<Chunk.Chunk<JSONMessage>, ContainersError, Exclude<R1, Scope.Scope>> =>
    Stream.run(stream, Sink.collectAll());

/**
 * Consumes the progress stream and logs it to the console.
 *
 * @since 1.0.0
 */
export const followProgressSink = Sink.forEach<JSONMessage, void, never, never>((message) => Effect.void);

/**
 * Tracks the progress stream in the console and returns the result.
 *
 * @since 1.0.0
 */
export const followProgressInConsole = <R1>(
    stream: Stream.Stream<JSONMessage, ContainersError, R1>
): Effect.Effect<Chunk.Chunk<JSONMessage>, ContainersError, R1> =>
    Effect.gen(function* () {
        const firstStream = stream;
        const secondStream = yield* Stream.broadcastDynamic(stream, 16);
        const effects = Tuple.make(
            waitForProgressToComplete(firstStream),
            Stream.run(secondStream, followProgressSink)
        );
        return yield* Effect.all(effects, { concurrency: 2 });
    })
        .pipe(Effect.map(Tuple.getFirst))
        .pipe(Effect.scoped);
