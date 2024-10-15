import * as NodeRuntime from "@effect/platform-node/NodeRuntime";
import * as NodeSocket from "@effect/platform-node/NodeSocket";
import * as Console from "effect/Console";
import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as Layer from "effect/Layer";

import * as Connection from "the-moby-effect/Connection";
import * as DockerEngine from "the-moby-effect/engines/Docker";

const layer = Function.pipe(
    Connection.connectionOptionsFromPlatformSystemSocketDefault(),
    Effect.map(DockerEngine.layerNodeJS),
    Layer.unwrapEffect
);

Effect.gen(function* () {
    yield* Console.log(void 0);
})
    .pipe(Effect.scoped)
    .pipe(Effect.provide(layer))
    .pipe(Effect.provide(NodeSocket.layerWebSocketConstructor))
    .pipe(NodeRuntime.runMain);
