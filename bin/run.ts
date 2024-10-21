import { Command, Options } from "@effect/cli";
import { Console, Effect } from "effect";
import { DockerEngine } from "the-moby-effect";

export const command = Command.make(
    "run",
    {
        cmd: Options.text("cmd"),
        image: Options.text("image"),
    },
    ({ cmd, image }) =>
        Effect.gen(function* () {
            const { Id } = yield* DockerEngine.run({ spec: { Cmd: [cmd], Image: image } });
            yield* Console.log(Id);
        })
);
