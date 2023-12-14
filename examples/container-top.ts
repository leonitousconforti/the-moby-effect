import { Effect } from "effect";

import { ContainerInspectResponse, IMobyService, makeMobyClient } from "../src/main.js";

// Passing in no connection options means it will connect to the local docker socket
const localDocker: IMobyService = makeMobyClient();

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
const main = Effect.gen(function* (_: Effect.Adapter) {
    const containerInspectResponse: ContainerInspectResponse = yield* _(
        localDocker.run({
            imageOptions: { kind: "pull", fromImage: "ubuntu:latest" },
            containerOptions: { body: { Image: "ubuntu:latest", Cmd: ["sleep", "infinity"] } },
        })
    );

    const data = yield* _(localDocker.containerTop({ id: containerInspectResponse.Id!, ps_args: "aux" }));
    yield* _(localDocker.containerKill({ id: containerInspectResponse.Id! }));
    yield* _(localDocker.containerDelete({ id: containerInspectResponse.Id! }));
    return data;
});
