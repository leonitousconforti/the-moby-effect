import { Console, Effect } from "effect";

import { Command } from "effect/unstable/cli";
import { DockerEngine } from "the-moby-effect";

export const command = Command.make("info", {}, () =>
    Effect.gen(function* () {
        const data = yield* DockerEngine.info();
        yield* Console.log(data);
    })
);
