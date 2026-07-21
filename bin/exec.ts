import { Effect } from "effect";
import { Command, Flag } from "effect/unstable/cli";

import { DockerEngine, MobySchemas } from "the-moby-effect";

export const command = Command.make(
    "exec",
    {
        cmd: Flag.string("cmd"),
        containerId: Flag.string("container"),
    },
    ({ cmd, containerId }) =>
        Effect.gen(function* () {
            const id = yield* MobySchemas.ContainerIdentifier.makeEffect(containerId);
            yield* DockerEngine.exec({ containerId: id, command: cmd.split(" ") });
        })
);
