#!/usr/bin/env node

import * as Cli from "@effect/cli";
import * as NodeContext from "@effect/platform-node/NodeContext";
import * as NodeRuntime from "@effect/platform-node/NodeRuntime";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";

import * as Convey from "the-moby-effect/Convey";
import * as DockerEngine from "the-moby-effect/DockerEngine";
import * as PlatformAgents from "the-moby-effect/PlatformAgents";
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
            const buildStream = DockerEngine.build({
                tag,
                dockerfile,
                context: Convey.packBuildContextIntoTarballStream(context, [dockerfile]),
            });

            yield* Convey.followProgressInConsole(buildStream);
        })
);

const DockerLive = Layer.unwrapEffect(
    Effect.map(PlatformAgents.connectionOptionsFromDockerHostEnvironmentVariable, DockerEngine.layerNodeJS)
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
