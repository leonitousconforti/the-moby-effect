#!/usr/bin/env node

import * as Cli from "@effect/cli";
import * as NodeContext from "@effect/platform-node/NodeContext";
import * as NodeRuntime from "@effect/platform-node/NodeRuntime";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";

import * as Connection from "the-moby-effect/Connection";
import * as Convey from "the-moby-effect/Convey";
import * as DockerEngine from "the-moby-effect/DockerEngine";
import PackageJson from "../package.json" assert { type: "json" };

export const command = Cli.Command.make(
    "pull",
    {
        image: Cli.Options.text("image"),
    },
    ({ image }) =>
        Effect.gen(function* () {
            const pullStream = DockerEngine.pull({ image });
            yield* Convey.followProgressInConsole(pullStream);
        })
);

const DockerLive = Layer.unwrapEffect(
    Effect.map(Connection.connectionOptionsFromDockerHostEnvironmentVariable, DockerEngine.layerNodeJS)
);

const cli = Cli.Command.run(command, {
    name: "pull",
    version: PackageJson.version,
});

Effect.suspend(() => cli(process.argv.slice(2))).pipe(
    Effect.provide(DockerLive),
    Effect.provide(NodeContext.layer),
    NodeRuntime.runMain
);
