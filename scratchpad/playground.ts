import { NodeContext, NodeRuntime } from "@effect/platform-node";
import { Console, Effect, Function, Layer } from "effect";
import { Engines, MobyConnection } from "the-moby-effect";

const layer = Function.pipe(
    MobyConnection.connectionOptionsFromPlatformSystemSocketDefault,
    Effect.map((connectionOptionsToHost) =>
        Engines.DindEngine.layerNodeJS({
            connectionOptionsToHost,
            exposeDindContainerBy: "socket" as const,
            dindBaseImage: "docker.io/library/docker:25-dind-rootless" as const,
        })
    ),
    Layer.unwrapEffect,
    Layer.provideMerge(NodeContext.layer)
);

Effect.gen(function* () {
    const data = yield* Engines.DockerEngine.version();
    yield* Console.log(data);
})
    .pipe(Effect.provide(layer))
    .pipe(NodeRuntime.runMain);
