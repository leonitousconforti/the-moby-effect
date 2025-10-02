// Run with: npx tsx examples/effect/container-attach-ws.ts

import { NodeRuntime } from "@effect/platform-node";
import { Console, Effect, Function, Layer } from "effect";
import { DockerEngine, MobyConnection, MobyConvey, MobyDemux, MobyEndpoints } from "the-moby-effect";

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

// const localDocker = MobyConnection.connectionOptionsFromPlatformSystemSocketDefault
//     .pipe(
//         Effect.map((connectionOptionsToHost) =>
//             DindEngine.layerNodeJS({
//                 exposeDindContainerBy: "ssh",
//                 dindBaseImage: "docker.io/library/docker:28-dind-rootless",
//                 connectionOptionsToHost,
//             })
//         )
//     )
//     .pipe(Layer.unwrapEffect)
//     .pipe(Layer.provide(NodeContext.layer));

const program = Effect.gen(function* () {
    const containers = yield* MobyEndpoints.Containers;

    // Pull the image, will be removed when the scope is closed
    const image = "docker.io/library/alpine:latest";
    const pullStream = yield* DockerEngine.pullScoped({ image });
    yield* MobyConvey.followProgressInConsole(pullStream);

    // Run the container, will be removed when the scope is closed
    const { Id: containerId } = yield* DockerEngine.runScoped({
        Image: image,
        // Entrypoint: ["/bin/sh"],
        Cmd: ["sh", "-c", "while true; do date; sleep 1; done"],
        Tty: false,
        OpenStdin: true,
        AttachStdin: true,
        AttachStdout: true,
        AttachStderr: true,
    });

    // Attach to the container
    const stdin = yield* containers.attachWebsocket(containerId, { stdin: true, stream: true });
    const stdout = yield* containers.attachWebsocket(containerId, { stdout: true, stream: true });
    const stderr = yield* containers.attachWebsocket(containerId, { stderr: true, stream: true });

    // Pack the three websockets into a single multiplexed socket
    const packed = yield* MobyDemux.pack({ stdin, stdout, stderr }, { requestedCapacity: 16 });

    // Demux the socket to stdin, stdout and stderr
    yield* MobyDemux.demuxFromStdinToStdoutAndStderr(packed);

    // Done
    yield* Console.log("Disconnected from container");
});

program.pipe(Effect.scoped).pipe(Effect.provide(localDocker)).pipe(NodeRuntime.runMain);
