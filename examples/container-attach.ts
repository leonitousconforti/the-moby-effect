// Run with: npx tsx examples/container-attach.ts

import { NodeRuntime } from "@effect/platform-node";
import { Console, Effect, Function, Layer } from "effect";
import {
    DockerEngine,
    Connection as MobyConnection,
    Convey as MobyConvey,
    Demux as MobyDemux,
    Endpoints as MobyEndpoints,
} from "the-moby-effect";

// Connect to the local docker engine at "/var/run/docker.sock"
// const localDocker: DockerEngine.DockerLayer = DockerEngine.layerNodeJS(
//     MobyConnection.SocketConnectionOptions({
//         socketPath: "/var/run/docker.sock",
//     })
// );
const localDocker = Function.pipe(
    MobyConnection.connectionOptionsFromPlatformSystemSocketDefault(),
    Effect.map(DockerEngine.layerNodeJS),
    Layer.unwrapEffect
);

const program = Effect.gen(function* () {
    const containers = yield* MobyEndpoints.Containers;

    // Pull the image, will be removed when the scope is closed
    const image = "docker.io/library/alpine:latest";
    const pullStream = yield* DockerEngine.pullScoped({ image });
    yield* MobyConvey.followProgressInConsole(pullStream);

    // Run the container, will be removed when the scope is closed
    const { Id: containerId } = yield* DockerEngine.runScoped({
        spec: {
            Image: image,
            Entrypoint: ["/bin/sh"],
            Tty: false,
            OpenStdin: true,
            AttachStdin: true,
            AttachStdout: true,
            AttachStderr: true,
        },
    });

    // Attach to the container
    const socket = yield* containers.attach({
        id: containerId,
        stdin: true,
        stdout: true,
        stderr: true,
        stream: true,
        detachKeys: "ctrl-e",
    });

    // Demux the socket to stdin, stdout and stderr
    yield* MobyDemux.demuxSocketFromStdinToStdoutAndStderr(socket);

    // Done
    yield* Console.log("Disconnected from container");
});

program.pipe(Effect.scoped).pipe(Effect.provide(localDocker)).pipe(NodeRuntime.runMain);
