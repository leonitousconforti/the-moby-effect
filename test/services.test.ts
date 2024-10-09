import { expect, layer } from "@effect/vitest";
import { Effect, Layer } from "effect";
import * as Services from "the-moby-effect/endpoints/Services";
import { testLayer } from "./shared.js";

layer(Layer.fresh(testLayer))("MobyApi Services tests", (it) => {
    it.effect("Should see no services", () =>
        Effect.gen(function* () {
            const services = yield* Services.Services.list();
            expect(services).toBeInstanceOf(Array);
            expect(services).toHaveLength(0);
        })
    );
});
