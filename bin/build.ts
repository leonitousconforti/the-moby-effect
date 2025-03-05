import { Args, Command, Options } from "@effect/cli";
import { NodeContext } from "@effect/platform-node";
import { Effect, Stream } from "effect";
import { Tar } from "eftar";
import { DockerEngine, MobyConvey } from "the-moby-effect";

export const command = Command.make(
    "build",
    {
        tag: Options.text("tag"),
        dockerfile: Options.text("dockerfile").pipe(Options.withDefault("Dockerfile")),
        context: Args.directory({ exists: "yes" }),
    },
    ({ context, dockerfile, tag }) =>
        Effect.gen(function* () {
            const contextStream = Stream.provideSomeLayer(
                Tar.tarballFromFilesystem(context, [dockerfile]),
                NodeContext.layer
            );

            const buildStream = DockerEngine.build({
                tag,
                dockerfile,
                context: contextStream,
            });

            yield* MobyConvey.followProgressInConsole(buildStream);
        })
);
