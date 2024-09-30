// Run with: tsx examples/container-attach.ts

import * as NodeRuntime from "@effect/platform-node/NodeRuntime";
import * as Console from "effect/Console";
import * as Effect from "effect/Effect";

import * as Convey from "the-moby-effect/Convey";
import * as Demux from "the-moby-effect/Demux";
import * as DockerEngine from "the-moby-effect/DockerEngine";
import * as Platforms from "the-moby-effect/Platforms";
import * as Containers from "the-moby-effect/endpoints/Containers";

// Connect to the local docker engine at "/var/run/docker.sock"
const localDocker: DockerEngine.DockerLayer = DockerEngine.layerNodeJS(
    Platforms.SocketConnectionOptions({
        socketPath: "/var/run/docker.sock",
    })
);

const program = Effect.gen(function* () {
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
    const stdin = yield* Containers.Containers.attachWebsocket({
        id: containerId,
        stdin: true,
        stream: true,
    });
    const stdout = yield* Containers.Containers.attachWebsocket({
        id: containerId,
        stdout: true,
        stream: true,
    });
    const stderr = yield* Containers.Containers.attachWebsocket({
        id: containerId,
        stderr: true,
        stream: true,
    });

    // Demux the socket to stdin, stdout and stderr
    yield* Demux.demuxSocketFromStdinToStdoutAndStderr({
        stdin,
        stdout,
        stderr,
    });

    // Done
    yield* Console.log("Disconnected from container");
});

program.pipe(Effect.scoped).pipe(Effect.provide(localDocker)).pipe(NodeRuntime.runMain);
