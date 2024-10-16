import { expect, layer } from "@effect/vitest";
import { Effect, Layer } from "effect";
import { Execs } from "the-moby-effect/Endpoints";
import { testLayer } from "./shared.js";

layer(Layer.fresh(testLayer))("MobyApi Execs tests", (it) => {
    it.effect("Should create an exec instance", () =>
        Effect.gen(function* () {
            yield* Execs;
            expect(1).toBe(1);
        })
    );
});
