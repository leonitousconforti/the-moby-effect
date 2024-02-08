import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as MobyApi from "../../src/index.js";

describe("MobyApi Tasks tests", () => {
    const testTaskService: Layer.Layer<never, never, MobyApi.Tasks.Tasks> = MobyApi.fromUrl(
        globalThis.__THE_MOBY_EFFECT_TEST_URL
    ).pipe(Layer.orDie);

    it("Should see no tasks", async () => {
        const tasks: Readonly<MobyApi.Schemas.Task[]> = await Effect.runPromise(
            Effect.provide(
                Effect.flatMap(MobyApi.Tasks.Tasks, (tasks) => tasks.list()),
                testTaskService
            )
        );

        expect(tasks).toBeInstanceOf(Array);
        expect(tasks).toHaveLength(0);
    });
});
