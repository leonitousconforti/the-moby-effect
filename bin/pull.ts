import { Effect } from "effect";

import { Command, Flag } from "effect/unstable/cli";
import { DockerEngine, MobyConvey } from "the-moby-effect";

export const command = Command.make(
    "pull",
    {
        image: Flag.string("image"),
    },
    ({ image }) =>
        Effect.gen(function* () {
            const pullStream = DockerEngine.pull({ image });
            yield* MobyConvey.followProgressInConsole(pullStream);
        })
);
