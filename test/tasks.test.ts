import { expect, layer } from "@effect/vitest";
import { Effect, Layer } from "effect";
import * as Tasks from "the-moby-effect/endpoints/Tasks";
import { testLayer } from "./shared.js";

layer(Layer.fresh(testLayer))("MobyApi Tasks tests", (it) => {
    it.effect("Should see no tasks", () =>
        Effect.gen(function* () {
            const tasks = yield* Tasks.Tasks.list();
            expect(tasks).toBeInstanceOf(Array);
            expect(tasks).toHaveLength(0);
        })
    );
});
