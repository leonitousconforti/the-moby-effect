import { expect, layer } from "@effect/vitest";
import { Effect, Layer } from "effect";
import { Tasks } from "the-moby-effect/Endpoints";
import { testLayer } from "./shared.js";

layer(Layer.fresh(testLayer))("MobyApi Tasks tests", (it) => {
    it.effect("Should see no tasks", () =>
        Effect.gen(function* () {
            const tasks = yield* Tasks;
            const tasksList = yield* tasks.list();
            expect(tasksList).toBeInstanceOf(Array);
            expect(tasksList).toHaveLength(0);
        })
    );
});
