import { expect, layer } from "@effect/vitest";
import { Duration, Effect, Layer } from "effect";
import { Services } from "the-moby-effect/MobyEndpoints";
import { testLayer } from "./shared.js";

layer(Layer.fresh(testLayer), { timeout: Duration.minutes(2) })("MobyApi Services tests", (it) => {
    it.effect("Should see no services", () =>
        Effect.gen(function* () {
            const services = yield* Services;
            const servicesList = yield* services.list();
            expect(servicesList).toBeInstanceOf(Array);
            expect(servicesList).toHaveLength(0);
        })
    );
});
