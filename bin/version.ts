import { Console, Effect } from "effect";
import { Command } from "effect/unstable/cli";

import { DockerEngine } from "the-moby-effect";

export const command = Command.make("version", {}, () =>
    Effect.gen(function* () {
        const version = yield* DockerEngine.version();
        yield* Console.log(version);
    })
);
