import { Effect, Layer } from "effect";

import * as MobyApi from "../src/index.js";
import { AfterAll, BeforeAll } from "./helpers.js";

let dindContainerId: string = undefined!;
let testNetworksService: Layer.Layer<never, never, MobyApi.Networks.Networks> = undefined!;

describe.each(["20-dind", "23-dind", "24-dind", "25-rc-dind", "dind"])("MobyApi Networks tests", (dindTag) => {
    afterAll(async () => await AfterAll(dindContainerId), 30_000);
    beforeAll(async () => {
        [dindContainerId, testNetworksService] = await BeforeAll(dindTag, MobyApi.Networks.fromConnectionOptions);
    }, 30_000);

    it("Should list all the networks", async () => {
        await Effect.gen(function* (_: Effect.Adapter) {
            const networks: MobyApi.Networks.Networks = yield* _(MobyApi.Networks.Networks);
            yield* _(networks.list());
        })
            .pipe(Effect.provide(testNetworksService))
            .pipe(Effect.runPromise);
    });
});
