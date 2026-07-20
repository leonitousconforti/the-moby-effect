import { Effect } from "effect";

import { Command, Options } from "@effect/cli";
import { DockerEngine, MobyConvey } from "the-moby-effect";

export const command = Command.make(
    "pull",
    {
        image: Options.text("image"),
    },
    ({ image }) =>
        Effect.gen(function* () {
            const pullStream = DockerEngine.pull({ image });
            yield* MobyConvey.followProgressInConsole(pullStream);
        })
);
