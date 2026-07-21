import { Console, Effect, Option } from "effect";

import { Command, Flag } from "effect/unstable/cli";
import { DockerEngine } from "the-moby-effect";

export const command = Command.make(
    "search",
    {
        term: Flag.string("term"),
        limit: Flag.integer("limit").pipe(Flag.optional),
        stars: Flag.integer("stars").pipe(Flag.optional),
        onlyOfficial: Flag.boolean("only-official").pipe(Flag.optional),
    },
    ({ limit, onlyOfficial, stars, term }) =>
        Effect.gen(function* () {
            const results = yield* DockerEngine.search({
                term,
                limit: Option.getOrUndefined(limit),
                filters: {
                    stars: Option.getOrUndefined(stars),
                    "is-official": Option.getOrUndefined(onlyOfficial),
                },
            });
            yield* Console.log(results);
        })
);
