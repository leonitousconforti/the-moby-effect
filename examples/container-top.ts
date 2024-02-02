import * as NodeRuntime from "@effect/platform-node/Runtime";
import * as Console from "effect/Console";
import * as Effect from "effect/Effect";

import * as MobyApi from "../src/index.js";

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
const program = Effect.gen(function* (_: Effect.Adapter) {
    const containers: MobyApi.Containers.Containers = yield* _(MobyApi.Containers.Containers);

    const containerInspectResponse: MobyApi.Schemas.ContainerInspectResponse = yield* _(
        MobyApi.DockerCommon.run({
            imageOptions: { kind: "pull", fromImage: "ubuntu:latest" },
            containerOptions: {
                spec: { Image: "ubuntu:latest", Cmd: ["sleep", "infinity"] },
            },
        })
    );

    const data: unknown = yield* _(containers.top({ id: containerInspectResponse.Id!, ps_args: "aux" }));
    yield* _(containers.kill({ id: containerInspectResponse.Id! }));
    yield* _(containers.delete({ id: containerInspectResponse.Id! }));
    return data;
});

program.pipe(Effect.tap(Console.log)).pipe(Effect.provide(localDocker)).pipe(NodeRuntime.runMain);
