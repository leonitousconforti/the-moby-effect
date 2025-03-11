// Run with: npx tsx examples/effect/exec.ts

import { NodeRuntime } from "@effect/platform-node";
import { Console, Effect, Function, Layer } from "effect";
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

const program = Effect.gen(function* () {
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

    const [stderr, stdout] = yield* DockerEngine.execWebsockets({ containerId, command: ["echo", "Hello, World!"] });
    yield* Console.log(`stderr: ${stderr}`);
    yield* Console.log(`stdout: ${stdout}`);

    // // Attach to the container
    // const stdin = yield* containers.attachWebsocket(containerId, { stdin: true, stream: true });
    // const stdout = yield* containers.attachWebsocket(containerId, { stdout: true, stream: true });
    // const stderr = yield* containers.attachWebsocket(containerId, { stderr: true, stream: true });

    // // Demux the socket to stdin, stdout and stderr
    // yield* MobyDemux.demuxSocketFromStdinToStdoutAndStderr({ stdin, stdout, stderr });

    // // Done
    // yield* Console.log("Disconnected from container");
});

program.pipe(Effect.scoped).pipe(Effect.provide(localDocker)).pipe(NodeRuntime.runMain);
