import { Console, Effect } from "effect";
import { Command, Flag } from "effect/unstable/cli";

import { DockerEngine } from "the-moby-effect";

export const command = Command.make(
    "run",
    {
        cmd: Flag.string("cmd"),
        image: Flag.string("image"),
    },
    ({ cmd, image }) =>
        Effect.gen(function* () {
            const { Id } = yield* DockerEngine.run({ Cmd: [cmd], Image: image });
            yield* Console.log(Id);
        })
);
