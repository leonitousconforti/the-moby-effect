import * as NodeRuntime from "@effect/platform-node/NodeRuntime";
import * as Console from "effect/Console";
import * as Effect from "effect/Effect";

import * as Convey from "the-moby-effect/Convey";
import * as Demux from "the-moby-effect/Demux";
import * as DockerEngine from "the-moby-effect/Docker";
import * as PlatformAgents from "the-moby-effect/PlatformAgents";
import * as Containers from "the-moby-effect/endpoints/Containers";

const localDocker: DockerEngine.DockerLayer = DockerEngine.layerNodeJS(
    PlatformAgents.SocketConnectionOptions({
        socketPath: "/var/run/docker.sock",
    })
);

const program = Effect.gen(function* () {
    const containers: Containers.ContainersImpl = yield* Containers.Containers;

    // Pull the image, will be removed when the scope is closed
    const pullStream = DockerEngine.pull({ image: "docker.io/library/alpine:latest" });
    yield* Convey.followProgressInConsole(pullStream);

    // Run the container, will be removed when the scope is closed
    const { Id: id } = yield* DockerEngine.runScoped({
        spec: {
            Image: "docker.io/library/alpine:latest",
            Entrypoint: ["/bin/sh"],
            Tty: true,
            OpenStdin: true,
            AttachStdin: true,
            AttachStdout: true,
            AttachStderr: true,

            Hostname: "",
            Domainname: "",
            User: "",
            StdinOnce: false,
            WorkingDir: "",
            Env: [],
            Cmd: [],
            Volumes: {},
            OnBuild: [],
            Labels: {},
        },
    });

    // Attach to the container
    const socket = yield* containers.attach({
        id,
        stdin: true,
        stdout: true,
        stderr: false,
        stream: true,
        detachKeys: "ctrl-e",
    });

    // Demux the socket to stdin, stdout and stderr (blocking)
    yield* Demux.demuxSocketFromStdinToStdoutAndStderr(socket);

    // Done
    yield* Console.log("Disconnected from container");
});

program.pipe(Effect.provide(localDocker)).pipe(Effect.scoped).pipe(NodeRuntime.runMain);
