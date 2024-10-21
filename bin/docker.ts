import { Command } from "@effect/cli";
import { NodeContext, NodeRuntime } from "@effect/platform-node";
import { Effect, Function, Layer } from "effect";
import { DockerEngine, MobyConnection } from "the-moby-effect";

import { command as buildCommand } from "./build.js";
import { command as execCommand } from "./exec.js";
import { command as imagesCommand } from "./images.js";
import { command as infoCommand } from "./info.js";
import { command as psCommand } from "./ps.js";
import { command as pullCommand } from "./pull.js";
import { command as runCommand } from "./run.js";
import { command as searchCommand } from "./search.js";
import { command as stopCommand } from "./stop.js";
import { command as versionCommand } from "./version.js";

const command = Command.make("docker").pipe(
    Command.withSubcommands([
        buildCommand,
        execCommand,
        imagesCommand,
        infoCommand,
        psCommand,
        pullCommand,
        runCommand,
        stopCommand,
        searchCommand,
        versionCommand,
    ])
);

const cli = Command.run(command, {
    name: "Docker CLI",
    version: "0.0.0",
});

const DockerLive = Function.pipe(
    MobyConnection.connectionOptionsFromDockerHostEnvironmentVariable,
    Effect.map(DockerEngine.layerNodeJS),
    Layer.unwrapEffect
);

const MainLive = Layer.merge(DockerLive, NodeContext.layer);

cli(process.argv).pipe(Effect.provide(MainLive), NodeRuntime.runMain);
