import * as NodeRuntime from "@effect/platform-node/NodeRuntime";
import * as Console from "effect/Console";
import * as Effect from "effect/Effect";

import * as Convey from "the-moby-effect/Convey";
import * as DockerEngine from "the-moby-effect/DockerEngine";
import * as Containers from "the-moby-effect/endpoints/Containers";
import * as PlatformAgents from "the-moby-effect/PlatformAgents";
import * as Schemas from "the-moby-effect/Schemas";

const localDocker: DockerEngine.DockerLayer = DockerEngine.layerNodeJS(
    PlatformAgents.SocketConnectionOptions({
        socketPath: "/var/run/docker.sock",
    })
);

// {
//   Titles: [
//     'USER',    'PID',
//     '%CPU',    '%MEM',
//     'VSZ',     'RSS',
//     'TTY',     'STAT',
//     'START',   'TIME',
//     'COMMAND'
//   ],
//   Processes: [
//     [
//       'root',           '19886',
//       '3.0',            '0.0',
//       '2788',           '1020',
//       '?',              'Ss',
//       '22:26',          '0:00',
//       'sleep infinity'
//     ]
//   ]
// }
const program = Effect.gen(function* () {
    const containers: Containers.ContainersImpl = yield* Containers.Containers;

    // Pull the image, will be removed when the scope is closed
    const pullStream = DockerEngine.pull({ image: "ubuntu:latest" });
    yield* Convey.followProgressInConsole(pullStream);

    const containerInspectResponse: Schemas.ContainerInspectResponse = yield* DockerEngine.runScoped({
        spec: {
            Image: "ubuntu:latest",
            Cmd: ["sleep", "infinity"],
            Entrypoint: [],

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
            Volumes: {},
            OnBuild: [],
            Labels: {},
        },
    });

    const data: Schemas.ContainerTopResponse = yield* containers.top({
        id: containerInspectResponse.Id,
        ps_args: "aux",
    });

    yield* Console.log(data);
});

program.pipe(Effect.provide(localDocker)).pipe(Effect.scoped).pipe(NodeRuntime.runMain);
