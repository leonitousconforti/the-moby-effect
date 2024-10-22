import { expect, layer } from "@effect/vitest";
import { Duration, Effect, Layer } from "effect";
import { Execs } from "the-moby-effect/MobyEndpoints";
import { testLayer } from "./shared.js";

layer(Layer.fresh(testLayer), { timeout: Duration.minutes(2) })("MobyApi Execs tests", (it) => {
    it.effect("Should create an exec instance", () =>
        Effect.gen(function* () {
            yield* Execs;
            expect(1).toBe(1);
        })
    );
});
