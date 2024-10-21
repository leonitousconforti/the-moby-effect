#!/usr/bin/env node

import * as Cli from "@effect/cli";
import * as NodeContext from "@effect/platform-node/NodeContext";
import * as NodeRuntime from "@effect/platform-node/NodeRuntime";
import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as Layer from "effect/Layer";
import * as Stream from "effect/Stream";

import * as DockerEngine from "the-moby-effect/DockerEngine";
import * as MobyConnection from "the-moby-effect/MobyConnection";
import * as MobyConvey from "the-moby-effect/MobyConvey";
import PackageJson from "../package.json" assert { type: "json" };

export const command = Cli.Command.make(
    "build",
    {
        tag: Cli.Options.text("tag"),
        dockerfile: Cli.Options.text("dockerfile").pipe(Cli.Options.withDefault("Dockerfile")),
        context: Cli.Args.directory({ exists: "yes" }),
    },
    ({ context, dockerfile, tag }) =>
        Effect.gen(function* () {
            const context2 = Stream.provideSomeLayer(
                MobyConvey.packBuildContextIntoTarballStream(context, [dockerfile]),
                NodeContext.layer
            );
            const buildStream = DockerEngine.build({
                tag,
                dockerfile,
                context: context2,
            });

            yield* MobyConvey.followProgressInConsole(buildStream);
        })
);

const DockerLive = Function.pipe(
    MobyConnection.connectionOptionsFromDockerHostEnvironmentVariable,
    Effect.map(DockerEngine.layerNodeJS),
    Layer.unwrapEffect
);

const cli = Cli.Command.run(command, {
    name: "build",
    version: PackageJson.version,
});

Effect.suspend(() => cli(process.argv.slice(2))).pipe(
    Effect.provide(DockerLive),
    Effect.provide(NodeContext.layer),
    NodeRuntime.runMain
);
