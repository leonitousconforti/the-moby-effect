import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as MobyApi from "../../src/index.js";

describe("MobyApi Tasks tests", () => {
    const testTaskService: Layer.Layer<never, never, MobyApi.Tasks.Tasks> = MobyApi.fromConnectionOptions(
        globalThis.__TEST_CONNECTION_OPTIONS
    ).pipe(Layer.orDie);
    const testSwarmsService: Layer.Layer<never, never, MobyApi.Swarm.Swarms> = MobyApi.fromConnectionOptions(
        globalThis.__TEST_CONNECTION_OPTIONS
    ).pipe(Layer.orDie);

    beforeAll(async () =>
        Effect.provide(
            Effect.flatMap(MobyApi.Swarm.Swarms, (swarm) => swarm.init({})),
            testSwarmsService
        ).pipe(Effect.runPromise)
    );

    afterAll(async () =>
        Effect.provide(
            Effect.flatMap(MobyApi.Swarm.Swarms, (swarm) => swarm.leave({ force: true })),
            testSwarmsService
        ).pipe(Effect.runPromise)
    );

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
