import { Effect, Layer } from "effect";

import * as MobyApi from "../src/index.js";
import { cooldown, warmup } from "./helpers.js";

let dindContainerId: string = undefined!;
let testExecsService: Layer.Layer<never, never, MobyApi.Execs.Execs> = undefined!;

/** TODO: Figure out how to test Exec. */
describe("MobyApi Exec tests", () => {
    afterAll(async () => await cooldown(dindContainerId), 30_000);
    beforeAll(async () => {
        [dindContainerId, testExecsService] = await warmup(MobyApi.Execs.fromConnectionOptions);
    }, 30_000);

    it("Should do something", async () => {
        await Effect.gen(function* (_: Effect.Adapter) {})
            .pipe(Effect.provide(testExecsService))
            .pipe(Effect.runPromise);
    });
});
