import * as NodeContext from "@effect/platform-node/NodeContext";
import * as NodeRuntime from "@effect/platform-node/NodeRuntime";
import * as Console from "effect/Console";
import * as Effect from "effect/Effect";

import * as Platforms from "the-moby-effect/Platforms";
import * as System from "the-moby-effect/endpoints/System";
import * as DindEngine from "the-moby-effect/engines/Dind";

const connectionOptions = Effect.runSync(Platforms.connectionOptionsFromPlatformSystemSocketDefault());

const dindLayer = DindEngine.layerNodeJS({
    exposeDindContainerBy: "socket" as const,
    connectionOptionsToHost: connectionOptions,
    dindBaseImage: "docker.io/library/docker:23-dind-rootless" as const,
});

Effect.gen(function* () {
    const result = yield* System.Systems.info();
    yield* Console.log(result);
})
    .pipe(Effect.provide(dindLayer))
    .pipe(Effect.provide(NodeContext.layer))
    .pipe(NodeRuntime.runMain);
