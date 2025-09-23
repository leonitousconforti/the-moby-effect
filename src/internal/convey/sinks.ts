import type * as Chunk from "effect/Chunk";
import type * as Scope from "effect/Scope";
import type * as MobySchemas from "../generated/index.js";

import * as Console from "effect/Console";
import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as Predicate from "effect/Predicate";
import * as Sink from "effect/Sink";
import * as Stream from "effect/Stream";

/** @internal */
export const waitForProgressToComplete = <E1, R1>(
    stream: Stream.Stream<MobySchemas.JSONMessage, E1, R1>
): Effect.Effect<Chunk.Chunk<MobySchemas.JSONMessage>, E1, Exclude<R1, Scope.Scope>> =>
    Stream.run(stream, Sink.collectAll());

/** @internal */
export const followProgressSink = Sink.forEach<MobySchemas.JSONMessage, void, never, never>(
    Effect.fnUntraced(function* (message) {
        if (Predicate.isNotUndefined(message.status)) {
            yield* Console.log(`${message.status}${message.progress ? " " : ""}${message.progress ?? ""}`);
        } else if (Predicate.isNotUndefined(message.stream)) {
            yield* Console.log(message.stream);
        }
    })
);

/** @internal */
export const followProgressInConsole = <E1, R1>(
    stream: Stream.Stream<MobySchemas.JSONMessage, E1, R1>
): Effect.Effect<Chunk.Chunk<MobySchemas.JSONMessage>, E1, Exclude<R1, Scope.Scope>> =>
    Function.pipe(stream, Stream.tapSink(followProgressSink), waitForProgressToComplete);
