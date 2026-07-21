import { Effect, Function, Layer } from "effect";

import { NodeRuntime, NodeServices } from "@effect/platform-node";
import { Command } from "effect/unstable/cli";
import { DockerEngine, MobyConnection } from "the-moby-effect";

import { command as buildCommand } from "./build.ts";
import { command as execCommand } from "./exec.ts";
import { command as imagesCommand } from "./images.ts";
import { command as infoCommand } from "./info.ts";
import { command as psCommand } from "./ps.ts";
import { command as pullCommand } from "./pull.ts";
import { command as runCommand } from "./run.ts";
import { command as searchCommand } from "./search.ts";
import { command as stopCommand } from "./stop.ts";
import { command as versionCommand } from "./version.ts";

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

const DockerLive = Function.pipe(
    MobyConnection.connectionOptionsFromDockerHostEnvironmentVariable,
    Effect.map(DockerEngine.layerNodeJS),
    Layer.unwrap
);

const MainLive = Layer.merge(DockerLive, NodeServices.layer);

Command.run(command, { version: "0.0.0" }).pipe(Effect.provide(MainLive), NodeRuntime.runMain);
