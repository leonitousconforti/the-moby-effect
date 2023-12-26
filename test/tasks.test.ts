import { Effect, Layer } from "effect";

import * as MobyApi from "../src/index.js";
import { AfterAll, BeforeAll } from "./helpers.js";

let dindContainerId: string = undefined!;
let testTaskService: Layer.Layer<never, never, MobyApi.Tasks.Tasks> = undefined!;

/** TODO: Figure out how to test Tasks better. */
describe.each(["20-dind", "23-dind", "24-dind", "25-rc-dind", "dind"])("MobyApi Tasks tests", (dindTag) => {
    afterAll(async () => await AfterAll(dindContainerId), 30_000);
    beforeAll(async () => {
        [dindContainerId, testTaskService] = await BeforeAll(dindTag, MobyApi.Tasks.fromConnectionOptions);
    }, 30_000);

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
