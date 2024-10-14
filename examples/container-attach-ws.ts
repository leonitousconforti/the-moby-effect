// Run with: tsx examples/container-attach.ts

import * as NodeRuntime from "@effect/platform-node/NodeRuntime";
import * as NodeSocket from "@effect/platform-node/NodeSocket";
import * as Console from "effect/Console";
import * as Effect from "effect/Effect";

import * as Convey from "the-moby-effect/Convey";
import * as DemuxStdio from "the-moby-effect/demux/Stdio";
import * as DockerEngine from "the-moby-effect/DockerEngine";
import * as Containers from "the-moby-effect/endpoints/Containers";
import * as Platforms from "the-moby-effect/Platforms";

// Connect to the local docker engine at "/var/run/docker.sock"
const localDocker: DockerEngine.DockerLayer = DockerEngine.layerNodeJS(
    Platforms.SocketConnectionOptions({
        socketPath: "/var/run/docker.sock",
    })
);

const program = Effect.gen(function* () {
    const containers = yield* Containers.Containers;

    // Pull the image, will be removed when the scope is closed
    const image = "docker.io/library/alpine:latest";
    const pullStream = yield* DockerEngine.pullScoped({ image });
    yield* Convey.followProgressInConsole(pullStream);

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
    const stdin = yield* containers.attachWebsocket({
        id: containerId,
        stdin: true,
        stream: true,
    });
    const stdout = yield* containers.attachWebsocket({
        id: containerId,
        stdout: true,
        stream: true,
    });
    const stderr = yield* containers.attachWebsocket({
        id: containerId,
        stderr: true,
        stream: true,
    });

    // Demux the socket to stdin, stdout and stderr
    yield* DemuxStdio.demuxSocketFromStdinToStdoutAndStderr({ stdin, stdout, stderr });

    // Done
    yield* Console.log("Disconnected from container");
});

program
    .pipe(Effect.scoped)
    .pipe(Effect.provide(localDocker))
    .pipe(Effect.provide(NodeSocket.layerWebSocketConstructor))
    .pipe(NodeRuntime.runMain);
