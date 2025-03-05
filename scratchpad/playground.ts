import { NodeRuntime } from "@effect/platform-node";
import { Console, Effect, Function, Layer } from "effect";
import { DindEngine, DockerEngine, MobyConnection } from "the-moby-effect";

const layer = Function.pipe(
    MobyConnection.connectionOptionsFromPlatformSystemSocketDefault,
    Effect.map((connectionOptionsToHost) =>
        DindEngine.layerNodeJS({
            connectionOptionsToHost,
            exposeDindContainerBy: "ssh" as const,
            dindBaseImage: "docker.io/library/docker:25-dind-rootless" as const,
        })
    ),
    Layer.unwrapEffect
);

Effect.gen(function* () {
    const data = yield* DockerEngine.version();
    yield* Console.log(data);
})
    .pipe(Effect.provide(layer))
    .pipe(NodeRuntime.runMain);
