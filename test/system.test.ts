import { expect, layer } from "@effect/vitest";
import { Effect, Layer, Stream } from "effect";
import * as System from "the-moby-effect/endpoints/System";
import { testLayer } from "./shared.js";

layer(Layer.fresh(testLayer))("MobyApi System tests", (it) => {
    it.effect("Should ping the docker daemon", () =>
        Effect.gen(function* () {
            yield* System.Systems.ping();
        })
    );

    it.effect("Should see the docker version", () =>
        Effect.gen(function* () {
            const versionResponse = yield* System.Systems.version();
            expect(versionResponse).toBeDefined();
        })
    );

    it.effect("Should see the docker info", () =>
        Effect.gen(function* () {
            const infoResponse = yield* System.Systems.info();
            expect(infoResponse).toBeDefined();
        })
    );

    it.effect("Should see the docker system data usage", () =>
        Effect.gen(function* () {
            const dataUsageResponse = yield* System.Systems.dataUsage();
            expect(dataUsageResponse).toBeDefined();
        })
    );

    it.effect("Should see docker events", () =>
        Effect.gen(function* () {
            yield* Effect.flatMap(System.Systems.events({ since: "0" }), Stream.runHead);
        })
    );
});
