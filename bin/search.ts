#!/usr/bin/env node

import * as Cli from "@effect/cli";
import * as NodeContext from "@effect/platform-node/NodeContext";
import * as NodeRuntime from "@effect/platform-node/NodeRuntime";
import * as Console from "effect/Console";
import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as Layer from "effect/Layer";

import * as DockerEngine from "the-moby-effect/DockerEngine";
import * as MobyConnection from "the-moby-effect/MobyConnection";
import PackageJson from "../package.json" assert { type: "json" };

export const command = Cli.Command.make(
    "search",
    {
        term: Cli.Options.text("term"),
        limit: Cli.Options.integer("limit").pipe(Cli.Options.withDefault(undefined)),
        stars: Cli.Options.integer("stars").pipe(Cli.Options.withDefault(undefined)),
        onlyOfficial: Cli.Options.boolean("only-official").pipe(Cli.Options.withDefault(undefined)),
    },
    ({ limit, onlyOfficial, stars, term }) =>
        Effect.gen(function* () {
            const version = yield* DockerEngine.search({ limit, stars, term, "is-official": onlyOfficial });
            yield* Console.log(version);
        })
);

const DockerLive = Function.pipe(
    MobyConnection.connectionOptionsFromDockerHostEnvironmentVariable,
    Effect.map(DockerEngine.layerNodeJS),
    Layer.unwrapEffect
);

const cli = Cli.Command.run(command, {
    name: "search",
    version: PackageJson.version,
});

Effect.suspend(() => cli(process.argv.slice(2))).pipe(
    Effect.provide(DockerLive),
    Effect.provide(NodeContext.layer),
    NodeRuntime.runMain
);
