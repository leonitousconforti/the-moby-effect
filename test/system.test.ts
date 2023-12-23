import { Effect, Layer } from "effect";

import * as MobyApi from "../src/index.js";
import { cooldown, warmup } from "./helpers.js";

let dindContainerId: string = undefined!;
let testSystemService: Layer.Layer<never, never, MobyApi.System.Systems> = undefined!;

describe("MobyApi System tests", () => {
    afterAll(async () => await cooldown(dindContainerId), 30_000);
    beforeAll(async () => {
        [dindContainerId, testSystemService] = await warmup(MobyApi.System.fromConnectionOptions);
    }, 30_000);

    it("Should ping the docker daemon", async () => {
        await Effect.runPromise(
            Effect.provide(
                Effect.flatMap(MobyApi.System.Systems, (systems) => systems.ping()),
                testSystemService
            )
        );
    });

    it("Should see the docker version", async () => {
        const versionResponse: Readonly<MobyApi.Schemas.SystemVersion> = await Effect.runPromise(
            Effect.provide(
                Effect.flatMap(MobyApi.System.Systems, (systems) => systems.version()),
                testSystemService
            )
        );
        expect(versionResponse).toBeDefined();
    });

    it("Should see the docker info", async () => {
        const infoResponse: Readonly<MobyApi.Schemas.SystemInfo> = await Effect.runPromise(
            Effect.provide(
                Effect.flatMap(MobyApi.System.Systems, (systems) => systems.info()),
                testSystemService
            )
        );
        expect(infoResponse).toBeDefined();
    });

    it("Should see the docker system data usage", async () => {
        const dataUsageResponse: Readonly<MobyApi.Schemas.SystemDataUsageResponse> = await Effect.runPromise(
            Effect.provide(
                Effect.flatMap(MobyApi.System.Systems, (systems) => systems.dataUsage()),
                testSystemService
            )
        );
        expect(dataUsageResponse).toBeDefined();
    });
});
