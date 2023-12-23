import { Effect, Layer } from "effect";

import * as MobyApi from "../src/index.js";
import { ContainerInspectResponse } from "../src/schemas.js";

const localContainers: Layer.Layer<never, never, MobyApi.Containers.Containers> =
    MobyApi.Containers.fromConnectionOptions({
        connection: "unix",
        socketPath: "/var/run/docker.sock",
    });

const localImages: Layer.Layer<never, never, MobyApi.Images.Images> = MobyApi.Images.fromConnectionOptions({
    connection: "unix",
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
await Effect.gen(function* (_: Effect.Adapter) {
    const containers: MobyApi.Containers.Containers = yield* _(MobyApi.Containers.Containers);

    const containerInspectResponse: ContainerInspectResponse = yield* _(
        MobyApi.run({
            imageOptions: { kind: "pull", fromImage: "ubuntu:latest" },
            containerOptions: {
                spec: {
                    Image: "ubuntu:latest",
                    Cmd: ["sleep", "infinity"],
                    HostConfig: {
                        PortBindings: { "2375/tcp": [{ HostPort: "0" }], "2376/tcp": [{ HostPort: "0" }] },
                    },
                },
            },
        })
    );

    const data: unknown = yield* _(containers.top({ id: containerInspectResponse.Id!, ps_args: "aux" }));
    yield* _(containers.kill({ id: containerInspectResponse.Id! }));
    yield* _(containers.delete({ id: containerInspectResponse.Id! }));
    return data;
})
    .pipe(Effect.provide(localImages))
    .pipe(Effect.provide(localContainers))
    .pipe(Effect.runPromise);
