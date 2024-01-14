import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";

import * as MobyApi from "../src/index.js";
import { AfterAll, BeforeAll, testEngines } from "./helpers.js";

let dindContainerId: string = undefined!;
let dindStorageVolumeName: string = undefined!;
let testTaskService: Layer.Layer<never, never, MobyApi.Tasks.Tasks> = undefined!;

describe.each(testEngines)("MobyApi Tasks tests", (image) => {
    afterAll(async () => await AfterAll(dindContainerId, dindStorageVolumeName), 30_000);
    beforeAll(async () => {
        [dindContainerId, dindStorageVolumeName, testTaskService] = await BeforeAll(
            image,
            MobyApi.Tasks.fromConnectionOptions
        );
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
