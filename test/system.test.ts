import { expect, layer } from "@effect/vitest";
import { Duration, Effect, Layer, Stream } from "effect";
import { Systems } from "the-moby-effect/MobyEndpoints";
import { testLayer } from "./shared.js";

layer(Layer.fresh(testLayer), { timeout: Duration.minutes(2) })("MobyApi System tests", (it) => {
    it.effect("Should ping the docker daemon", () =>
        Effect.gen(function* () {
            const system = yield* Systems;
            yield* system.ping();
        })
    );

    it.effect("Should see the docker version", () =>
        Effect.gen(function* () {
            const system = yield* Systems;
            const versionResponse = yield* system.version();
            expect(versionResponse).toBeDefined();
        })
    );

    it.effect("Should see the docker info", () =>
        Effect.gen(function* () {
            const system = yield* Systems;
            const infoResponse = yield* system.info();
            expect(infoResponse).toBeDefined();
        })
    );

    it.effect("Should see the docker system data usage", () =>
        Effect.gen(function* () {
            const system = yield* Systems;
            const dataUsageResponse = yield* system.dataUsage();
            expect(dataUsageResponse).toBeDefined();
        })
    );

    it.effect.skip("Should see docker events", () =>
        Effect.gen(function* () {
            const system = yield* Systems;
            yield* Stream.runHead(system.events({ since: "0" }));
        })
    );
});
