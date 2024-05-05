import * as NodeRuntime from "@effect/platform-node/NodeRuntime";
import * as Console from "effect/Console";
import * as Effect from "effect/Effect";

import * as Containers from "the-moby-effect/Containers";
import * as DockerCommon from "the-moby-effect/Docker";
import * as MobyApi from "the-moby-effect/Moby";
import * as Schemas from "the-moby-effect/Schemas";

const localDocker: MobyApi.MobyApi = MobyApi.fromConnectionOptions({
    connection: "socket",
    socketPath: "/var/run/docker.sock",
});

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
    const containers: Containers.Containers = yield* Containers.Containers;

    const containerInspectResponse: Schemas.ContainerInspectResponse = yield* DockerCommon.run({
        imageOptions: { kind: "pull", fromImage: "ubuntu:latest" },
        containerOptions: {
            spec: { Image: "ubuntu:latest", Cmd: ["sleep", "infinity"] },
        },
    });

    const data: unknown = yield* containers.top({ id: containerInspectResponse.Id!, ps_args: "aux" });
    yield* containers.kill({ id: containerInspectResponse.Id! });
    yield* containers.delete({ id: containerInspectResponse.Id! });
    return data;
});

program.pipe(Effect.tap(Console.log)).pipe(Effect.provide(localDocker)).pipe(Effect.scoped).pipe(NodeRuntime.runMain);
