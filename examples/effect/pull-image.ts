// Run with: pnpx tsx examples/effect/pull-image.ts

import type { Stream } from "effect";
import type { MobyEndpoints, MobySchemas } from "the-moby-effect";

import { NodeRuntime } from "@effect/platform-node";
import { Effect, Function, Layer } from "effect";
import { DockerEngine, MobyConnection, MobyConvey } from "the-moby-effect";

// Connect to the local docker engine at "/var/run/docker.sock"
// const localDocker: DockerEngine.DockerLayer = DockerEngine.layerNodeJS(
//     MobyConnection.SocketConnectionOptions({
//         socketPath: "/var/run/docker.sock",
//     })
// );
const localDocker = Function.pipe(
    MobyConnection.connectionOptionsFromPlatformSystemSocketDefault,
    Effect.map(DockerEngine.layerNodeJS),
    Layer.unwrapEffect
);

// Pull the hello world image, will be removed when the scope is closed
const program = Effect.gen(function* () {
    const pullStream: Stream.Stream<MobySchemas.JSONMessage, DockerEngine.DockerError, MobyEndpoints.Images> =
        yield* DockerEngine.pullScoped({
            image: "docker.io/library/hello-world:latest",
        });

    yield* MobyConvey.followProgressInConsole(pullStream);
});

program.pipe(Effect.scoped).pipe(Effect.provide(localDocker)).pipe(NodeRuntime.runMain);
