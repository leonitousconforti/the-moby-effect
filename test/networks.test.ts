import { Effect, Layer } from "effect";

import * as MobyApi from "../src/index.js";
import { AfterAll, BeforeAll, testEngines } from "./helpers.js";

let dindContainerId: string = undefined!;
let dindStorageVolumeName: string = undefined!;
let testNetworksService: Layer.Layer<never, never, MobyApi.Networks.Networks> = undefined!;

describe.each(testEngines)("MobyApi Networks tests", (image) => {
    afterAll(async () => await AfterAll(dindContainerId, dindStorageVolumeName), 30_000);
    beforeAll(async () => {
        [dindContainerId, dindStorageVolumeName, testNetworksService] = await BeforeAll(
            image,
            MobyApi.Networks.fromConnectionOptions
        );
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
