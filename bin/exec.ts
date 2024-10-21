import { Command, Options } from "@effect/cli";
import { Effect } from "effect";
import { DockerEngine } from "the-moby-effect";

export const command = Command.make(
    "exec",
    {
        cmd: Options.text("cmd"),
        containerId: Options.text("container"),
    },
    ({ cmd, containerId }) =>
        Effect.gen(function* () {
            yield* DockerEngine.exec({ containerId, command: cmd.split(" ") });
        })
);
