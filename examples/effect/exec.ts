// Run with: pnpx tsx examples/effect/exec.ts

import { NodeRuntime } from "@effect/platform-node";
import { Console, Effect, Function, Layer, Sink, Stream } from "effect";
import { DockerEngine, MobyConnection, MobyConvey, MobyDemux } from "the-moby-effect";

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

const program = Effect.gen(function* () {
    // Pull the image, will be removed when the scope is closed
    const image = "docker.io/library/ubuntu:latest";
    const pullStream = DockerEngine.pull({ image });
    yield* MobyConvey.followProgressInConsole(pullStream);

    // Run the container, will be removed when the scope is closed
    const { Id: containerId } = yield* DockerEngine.runScoped({
        Image: image,
        OpenStdin: true,
        AttachStdin: true,
        AttachStdout: true,
        AttachStderr: true,
        Entrypoint: ["/bin/bash"],
    });

    const multiplexed = yield* DockerEngine.execWebsocketsNonBlocking({
        containerId,
        command: ["read", "-p", '">"', "ah", "&&", "echo", "$ah"],
    });

    const fanned = yield* MobyDemux.fan(multiplexed, { requestedCapacity: 16 });
    const packed = yield* MobyDemux.pack(fanned, { requestedCapacity: 16 });

    const [data1, data2] = yield* MobyDemux.demuxMultiplexedToSeparateSinks(
        packed,
        Stream.make("ah\n"),
        Sink.mkString,
        Sink.mkString
    );

    yield* Console.log(`data1: ${data1}`);
    yield* Console.log(`data2: ${data2}`);
});

program.pipe(Effect.scoped).pipe(Effect.provide(localDocker)).pipe(NodeRuntime.runMain);
