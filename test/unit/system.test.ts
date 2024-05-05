import { describe, expect, it } from "@effect/vitest";

import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as MobyApi from "the-moby-effect/Moby";

describe("MobyApi System tests", () => {
    const testSystemService: Layer.Layer<MobyApi.System.Systems, never, never> = MobyApi.fromConnectionOptions(
        globalThis.__TEST_CONNECTION_OPTIONS
    ).pipe(Layer.orDie);

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

    it("Should see docker events", async () => {
        await Effect.runPromise(
            Effect.provide(
                Effect.flatMap(MobyApi.System.Systems, (systems) => systems.events()),
                testSystemService
            )
        );
    });
});
