import * as NodeContext from "@effect/platform-node/NodeContext";
import * as NodeRuntime from "@effect/platform-node/NodeRuntime";
import * as Console from "effect/Console";
import * as Effect from "effect/Effect";

import * as PlatformAgents from "the-moby-effect/PlatformAgents";
import * as System from "the-moby-effect/endpoints/System";
import * as DindEngine from "the-moby-effect/engines/Dind";

const connectionOptions = Effect.runSync(PlatformAgents.connectionOptionsFromPlatformSystemSocketDefault());

const dindLayer = DindEngine.layerNodeJS({
    exposeDindContainerBy: "ssh" as const,
    connectionOptionsToHost: connectionOptions,
    dindBaseImage: "docker.io/library/docker:23-dind" as const,
});

Effect.gen(function* () {
    const result = yield* System.Systems.info();
    yield* Console.log(result);
})
    .pipe(Effect.provide(dindLayer))
    .pipe(Effect.provide(NodeContext.layer))
    .pipe(NodeRuntime.runMain);
