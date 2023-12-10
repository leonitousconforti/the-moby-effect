import { Effect } from "effect";

import { ContainerInspectResponse, IMobyService, makeMobyLayer } from "../src/main.js";

// Remember passing in no connection options means it will connect to the local docker socket
const [MyLocalMobyClient, MobyServiceLocal] = makeMobyLayer("localMobyClient");

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
    const localService: IMobyService = yield* _(MyLocalMobyClient);

    const containerInspectResponse: ContainerInspectResponse = yield* _(
        localService.run({
            mobyClient: MyLocalMobyClient,
            imageOptions: { kind: "pull", fromImage: "ubuntu:latest" },
            containerOptions: { body: { Image: "ubuntu:latest", Cmd: ["sleep", "infinity"] } },
        })
    );

    const data = yield* _(localService.containerTop({ id: containerInspectResponse.Id!, ps_args: "aux" }));
    yield* _(localService.containerKill({ id: containerInspectResponse.Id! }));
    yield* _(localService.containerDelete({ id: containerInspectResponse.Id! }));
    return data;
})
    .pipe(Effect.scoped)
    .pipe(Effect.provide(MobyServiceLocal))
    .pipe(Effect.tap(console.log))
    .pipe(Effect.runPromise);
