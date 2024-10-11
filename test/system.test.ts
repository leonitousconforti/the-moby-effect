import { expect, layer } from "@effect/vitest";
import { Effect, Layer, Stream } from "effect";
import * as System from "the-moby-effect/endpoints/System";
import { testLayer } from "./shared.js";

layer(Layer.fresh(testLayer))("MobyApi System tests", (it) => {
    it.effect("Should ping the docker daemon", () =>
        Effect.gen(function* () {
            const system = yield* System.Systems;
            yield* system.ping();
        })
    );

    it.effect("Should see the docker version", () =>
        Effect.gen(function* () {
            const system = yield* System.Systems;
            const versionResponse = yield* system.version();
            expect(versionResponse).toBeDefined();
        })
    );

    it.effect("Should see the docker info", () =>
        Effect.gen(function* () {
            const system = yield* System.Systems;
            const infoResponse = yield* system.info();
            expect(infoResponse).toBeDefined();
        })
    );

    it.effect("Should see the docker system data usage", () =>
        Effect.gen(function* () {
            const system = yield* System.Systems;
            const dataUsageResponse = yield* system.dataUsage();
            expect(dataUsageResponse).toBeDefined();
        })
    );

    it.effect("Should see docker events", () =>
        Effect.gen(function* () {
            const system = yield* System.Systems;
            yield* Stream.runHead(system.events({ since: "0" }));
        })
    );
});
