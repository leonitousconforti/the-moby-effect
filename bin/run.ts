#!/usr/bin/env node

import * as Cli from "@effect/cli";
import * as NodeContext from "@effect/platform-node/NodeContext";
import * as NodeRuntime from "@effect/platform-node/NodeRuntime";
import * as Console from "effect/Console";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";

import * as DockerEngine from "the-moby-effect/DockerEngine";
import * as PlatformAgents from "the-moby-effect/PlatformAgents";
import PackageJson from "../package.json" assert { type: "json" };

export const command = Cli.Command.make(
    "run",
    {
        cmd: Cli.Options.text("cmd"),
        image: Cli.Options.text("image"),
    },
    ({ cmd, image }) =>
        Effect.gen(function* () {
            const { Id } = yield* DockerEngine.run({ spec: { Cmd: [cmd], Image: image } });
            yield* Console.log(Id);
        })
);

const DockerLive = Layer.unwrapEffect(
    Effect.map(PlatformAgents.connectionOptionsFromDockerHostEnvironmentVariable, DockerEngine.layerNodeJS)
);

const cli = Cli.Command.run(command, {
    name: "run",
    version: PackageJson.version,
});

Effect.suspend(() => cli(process.argv.slice(2))).pipe(
    Effect.provide(DockerLive),
    Effect.provide(NodeContext.layer),
    NodeRuntime.runMain
);
