import { Command } from "@effect/cli";
import { Console, Effect } from "effect";
import { DockerEngine } from "the-moby-effect";

export const command = Command.make("images", {}, () =>
    Effect.gen(function* () {
        const data = yield* DockerEngine.images();
        yield* Console.log(data);
    })
);
