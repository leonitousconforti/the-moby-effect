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

    const [a, b] = yield* DockerEngine.execWebsockets({
        containerId,
        command: ["echo", "Hello, World1!"],
    });

    yield* Console.log(`a: ${a}`);
    yield* Console.log(`b: ${b}`);

    const [c, d] = yield* DockerEngine.execWebsockets({
        containerId,
        command: ["echo", "Hello, World2!"],
    });

    yield* Console.log(`c: ${c}`);
    yield* Console.log(`d: ${d}`);
});

program.pipe(Effect.scoped).pipe(Effect.provide(localDocker)).pipe(NodeRuntime.runMain);
