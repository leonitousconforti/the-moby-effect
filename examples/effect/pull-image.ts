// Run with: npx tsx examples/effect/pull-image.ts

import { NodeRuntime } from "@effect/platform-node";
import { Effect, Function, Layer, Stream } from "effect";
import { DockerEngine, MobyConnection, MobyConvey, MobyEndpoints, MobySchemas } from "the-moby-effect";

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
    const pullStream: Stream.Stream<MobySchemas.JSONMessage, MobyEndpoints.ImagesError, MobyEndpoints.Images> =
        yield* DockerEngine.pullScoped({
            image: "docker.io/library/hello-world:latest",
        });

    yield* MobyConvey.followProgressInConsole(pullStream);
});

program.pipe(Effect.scoped).pipe(Effect.provide(localDocker)).pipe(NodeRuntime.runMain);
