import { afterAll, beforeAll, describe, expect, it } from "@effect/vitest";

import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as MobyApi from "the-moby-effect/Moby";

describe("MobyApi Tasks tests", () => {
    const testTaskService: Layer.Layer<MobyApi.Tasks.Tasks, never, never> = MobyApi.fromConnectionOptions(
        globalThis.__TEST_CONNECTION_OPTIONS
    ).pipe(Layer.orDie);
    const testSwarmsService: Layer.Layer<MobyApi.Swarm.Swarms, never, never> = MobyApi.fromConnectionOptions(
        globalThis.__TEST_CONNECTION_OPTIONS
    ).pipe(Layer.orDie);

    beforeAll(async () => {
        await Effect.provide(
            Effect.flatMap(MobyApi.Swarm.Swarms, (swarm) => swarm.init({ ListenAddr: "eth0" })),
            testSwarmsService
        ).pipe(Effect.runPromise);
    });

    afterAll(async () =>
        Effect.provide(
            Effect.flatMap(MobyApi.Swarm.Swarms, (swarm) => swarm.leave({ force: true })),
            testSwarmsService
        ).pipe(Effect.runPromise)
    );

    it("Should see no tasks", async () => {
        const tasks: ReadonlyArray<MobyApi.Schemas.Task> = await Effect.runPromise(
            Effect.provide(
                Effect.flatMap(MobyApi.Tasks.Tasks, (tasks) => tasks.list()),
                testTaskService
            )
        );

        expect(tasks).toBeInstanceOf(Array);
        expect(tasks).toHaveLength(0);
    });
});
