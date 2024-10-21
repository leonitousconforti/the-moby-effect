import { Command } from "@effect/cli";
import { Console, Effect } from "effect";
import { DockerEngine } from "the-moby-effect";

export const command = Command.make("ps", {}, () =>
    Effect.gen(function* () {
        const data = yield* DockerEngine.ps();
        yield* Console.log(data);
    })
);
