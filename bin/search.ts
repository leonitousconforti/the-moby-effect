import { Command, Options } from "@effect/cli";
import { Console, Effect } from "effect";
import { DockerEngine } from "the-moby-effect";

export const command = Command.make(
    "search",
    {
        term: Options.text("term"),
        limit: Options.integer("limit").pipe(Options.withDefault(undefined)),
        stars: Options.integer("stars").pipe(Options.withDefault(undefined)),
        onlyOfficial: Options.boolean("only-official").pipe(Options.withDefault(undefined)),
    },
    ({ limit, onlyOfficial, stars, term }) =>
        Effect.gen(function* () {
            const version = yield* DockerEngine.search({ limit, stars, term, "is-official": onlyOfficial });
            yield* Console.log(version);
        })
);
