import { Effect, Layer } from "effect";

import * as MobyApi from "../src/index.js";
import { cooldown, warmup } from "./helpers.js";

let dindContainerId: string = undefined!;
let testServicesService: Layer.Layer<never, never, MobyApi.Services.Services> = undefined!;

describe("MobyApi Services tests", () => {
    afterAll(async () => await cooldown(dindContainerId), 30_000);
    beforeAll(async () => {
        [dindContainerId, testServicesService] = await warmup(MobyApi.Services.fromConnectionOptions);
    }, 30_000);

    it("Should see no services", async () => {
        const services: Readonly<MobyApi.Schemas.Service[]> = await Effect.runPromise(
            Effect.provide(
                Effect.flatMap(MobyApi.Services.Services, (services) => services.list()),
                testServicesService
            )
        );
        expect(services).toBeInstanceOf(Array);
        expect(services).toHaveLength(0);
    });
});
