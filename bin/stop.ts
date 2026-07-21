import { Effect } from "effect";

import { Command, Flag } from "effect/unstable/cli";
import { DockerEngine, MobySchemas } from "the-moby-effect";

export const command = Command.make(
    "stop",
    {
        container: Flag.string("container"),
    },
    ({ container }) =>
        Effect.gen(function* () {
            const id = yield* MobySchemas.ContainerIdentifier.makeEffect(container);
            yield* DockerEngine.stop(id);
        })
);
