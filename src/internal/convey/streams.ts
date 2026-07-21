import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as Match from "effect/Match";
import * as Predicate from "effect/Predicate";
import * as Stream from "effect/Stream";

import type * as MobySchemas from "../../MobySchemas.ts";

/** @internal */
export const mapError = <E1, R1>(
    stream: Stream.Stream<MobySchemas.JSONMessage, E1, R1>
): Stream.Stream<MobySchemas.JSONMessage, E1 | string, R1> =>
    Stream.mapEffect(stream, (message) => {
        if (Predicate.isNotUndefined(message.error)) {
            const cause: string = Function.pipe(
                Match.value(message.errorDetail!),
                Match.when(
                    { code: Match.undefined, message: Match.undefined },
                    () => "Errored with an unknown reason with an unknown code"
                ),
                Match.when({ message: Match.string }, ({ message }) => `Errored with ${message} and an unknown code`),
                Match.when({ code: Match.number }, ({ code }) => `Errored with an unknown reason and code ${code}`),
                Match.when(
                    { code: Match.number, message: Match.string },
                    ({ code, message }) => `Errored with ${message} and code ${code}`
                ),
                Match.orElseAbsurd
            );

            return Effect.fail(cause);
        } else {
            return Effect.succeed(message);
        }
    });
