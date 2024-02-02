import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";

import * as MobyApi from "../../src/index.js";
import { AfterAll, BeforeAll, testEngines } from "./helpers.js";

let dindContainerId: string = undefined!;
let dindStorageVolumeName: string = undefined!;
let testExecsService: Layer.Layer<never, never, MobyApi.Execs.Execs> = undefined!;

describe.each(testEngines)("MobyApi Exec tests", (image) => {
    afterAll(async () => await AfterAll(dindContainerId, dindStorageVolumeName), 30_000);
    beforeAll(async () => {
        [dindContainerId, dindStorageVolumeName, testExecsService] = await BeforeAll(
            image,
            MobyApi.Execs.fromConnectionOptions
        );
    }, 30_000);

    it("Should do something", async () => {
        await Effect.gen(function* (_: Effect.Adapter) {})
            .pipe(Effect.provide(testExecsService))
            .pipe(Effect.runPromise);
    });
});
