// Run with: pnpx tsx examples/effect/info.ts

import { NodeRuntime } from "@effect/platform-node";
import { Effect, Function, Layer } from "effect";
import { DockerEngine, MobyConnection } from "the-moby-effect";

// Connect to the local docker engine at "/var/run/docker.sock"
// const localDocker: DockerEngine.DockerLayer = DockerEngine.layerNodeJS(
//     MobyConnection.SocketConnectionOptions({
//         socketPath: "/var/run/docker.sock",
//     })
// );
const localDocker = Function.pipe(
    MobyConnection.connectionOptionsFromPlatformSystemSocketDefault,
    Effect.map(DockerEngine.layerNodeJS),
    Layer.unwrapEffect
);

const program = Effect.gen(function* () {
    yield* DockerEngine.ping();
    const version = yield* DockerEngine.version();
    yield* Effect.log(version);
    const info = yield* DockerEngine.info();
    yield* Effect.log(info);
});

program.pipe(Effect.provide(localDocker)).pipe(NodeRuntime.runMain);
