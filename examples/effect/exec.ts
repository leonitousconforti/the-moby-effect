// Run with: npx tsx examples/effect/exec.ts

import { NodeRuntime } from "@effect/platform-node";
import { Effect, Function, Layer, Sink, Stream } from "effect";
import * as assert from "node:assert";
import { DockerEngine, MobyConnection, MobyConvey, MobyDemux } from "the-moby-effect";
import { demuxMultiplexedToSeparateSinks, isMultiplexedSocket } from "the-moby-effect/MobyDemux";

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
        spec: {
            Image: image,
            Entrypoint: ["/bin/bash"],
            Tty: false,
            OpenStdin: true,
        },
    });

    const [multiplexed] = yield* DockerEngine.execNonBlocking({
        containerId,
        command: ["echo", "Hello, World!"],
    });

    assert.ok(isMultiplexedSocket(multiplexed));

    const fanned = yield* MobyDemux.fan(multiplexed, { requestedCapacity: 16 });

    // const [data1, data2] = yield* demuxRawSockets(fanned, {
    //     stdin: Stream.make("ah\n"),
    //     stdout: Sink.mkString,
    //     stderr: Sink.mkString,
    // });

    const packed = yield* MobyDemux.pack(fanned, { requestedCapacity: 16 });

    const [data1, data2] = yield* demuxMultiplexedToSeparateSinks(
        packed,
        // Stream.make("ah\n").pipe(Stream.concat(Stream.make(new Socket.CloseEvent()))),
        Stream.empty,
        Sink.mkString,
        Sink.mkString
    );

    console.log(`data1: ${data1}`);
    console.log(`data2: ${data2}`);

    // console.log(multiplexed);

    // const data1 = yield* DockerEngine.execWebsockets({
    //     containerId,
    //     command: ["echo", "Hello, World1!"],
    // });

    // yield* Console.log(`data1: ${data1}`);

    // const data2 = yield* DockerEngine.execWebsockets({
    //     containerId,
    //     command: ["echo", "Hello, World2!"],
    // });

    // yield* Console.log(`data2: ${data2}`);
});

program.pipe(Effect.scoped).pipe(Effect.provide(localDocker)).pipe(NodeRuntime.runMain);
