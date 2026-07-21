import { Effect, Stream } from "effect";

import { NodeServices } from "@effect/platform-node";
import { Tar } from "eftar";
import { Argument, Command, Flag } from "effect/unstable/cli";
import { DockerEngine, MobyConvey } from "the-moby-effect";

export const command = Command.make(
    "build",
    {
        tag: Flag.string("tag"),
        dockerfile: Flag.string("dockerfile").pipe(Flag.withDefault("Dockerfile")),
        context: Argument.directory("context", { mustExist: true }),
    },
    ({ context, dockerfile, tag }) =>
        Effect.gen(function* () {
            const contextStream = Stream.provide(Tar.tarballFromFilesystem(context, [dockerfile]), NodeServices.layer);

            const buildStream = DockerEngine.build({
                tag,
                dockerfile,
                context: contextStream,
            });

            yield* MobyConvey.followProgressInConsole(buildStream);
        })
);
