// Run with: pnpx tsx examples/effect/container-top.ts

import { Console, Effect, Function, Layer, Stream } from "effect";

import type { MobySchemas } from "the-moby-effect";

import { NodeRuntime } from "@effect/platform-node";
import { DockerEngine, MobyConnection, MobyConvey, MobyEndpoints } from "the-moby-effect";

// Connect to the local docker engine at "/var/run/docker.sock"
// const localDocker: DockerEngine.DockerLayer = DockerEngine.layerNodeJS(
//     MobyConnection.SocketConnectionOptions({
//         socketPath: "/var/run/docker.sock",
//     })
// );
const localDocker = Function.pipe(
    MobyConnection.connectionOptionsFromPlatformSystemSocketDefault,
    Effect.map(DockerEngine.layerNodeJS),
    Layer.unwrap
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
    const containers = yield* MobyEndpoints.Containers;

    // Pull the image, will be removed when the scope is closed
    const pullStream = yield* DockerEngine.pullScoped({ image: "ubuntu:latest" });
    yield* MobyConvey.followProgressInConsole(pullStream);

    const containerInspectResponse: MobySchemas.ContainerInspectResponse = yield* DockerEngine.runScoped({
        Image: "ubuntu:latest",
        Cmd: ["sleep", "infinity"],
    });

    const data: MobySchemas.ContainerTopResponse = yield* containers.top(containerInspectResponse.Id, {
        ps_args: "aux",
    });

    yield* Console.log(data);
    yield* containers.stats(containerInspectResponse.Id, { stream: false }).pipe(Stream.runDrain);
});

program.pipe(Effect.scoped, Effect.provide(localDocker), NodeRuntime.runMain);
