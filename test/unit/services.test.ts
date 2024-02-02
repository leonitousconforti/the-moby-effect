import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";

import * as MobyApi from "../../src/index.js";
import { AfterAll, BeforeAll, testEngines } from "./helpers.js";

let dindContainerId: string = undefined!;
let dindStorageVolumeName: string = undefined!;
let testServicesService: Layer.Layer<never, never, MobyApi.Services.Services> = undefined!;

describe.each(testEngines)("MobyApi Services tests", (image) => {
    afterAll(async () => await AfterAll(dindContainerId, dindStorageVolumeName), 30_000);
    beforeAll(async () => {
        [dindContainerId, dindStorageVolumeName, testServicesService] = await BeforeAll(
            image,
            MobyApi.Services.fromConnectionOptions
        );
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
