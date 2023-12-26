import { Effect, Layer } from "effect";

import * as MobyApi from "../src/index.js";
import { AfterAll, BeforeAll } from "./helpers.js";

let dindContainerId: string = undefined!;
let testVolumesService: Layer.Layer<never, never, MobyApi.Volumes.Volumes> = undefined!;

// FIXME: either drop 20-dind from all the other test suites or try to fix it here
describe.each(["23-dind", "24-dind", "25-rc-dind", "dind"])("MobyApi Volumes tests", (dindTag) => {
    afterAll(async () => await AfterAll(dindContainerId), 30_000);
    beforeAll(async () => {
        [dindContainerId, testVolumesService] = await BeforeAll(dindTag, MobyApi.Volumes.fromConnectionOptions);
    }, 30_000);

    it("Should see no volumes", async () => {
        const testData: Readonly<MobyApi.Schemas.VolumeListResponse> = await Effect.runPromise(
            Effect.provide(
                Effect.flatMap(MobyApi.Volumes.Volumes, (volumes) => volumes.list()),
                testVolumesService
            )
        );

        expect(testData.Warnings).toBeNull();
        expect(testData.Volumes).toBeInstanceOf(Array);
        expect(testData.Volumes).toHaveLength(0);
    });

    it("Should create a volume", async () => {
        const testData: Readonly<MobyApi.Schemas.Volume> = await Effect.runPromise(
            Effect.provide(
                Effect.flatMap(MobyApi.Volumes.Volumes, (volumes) => volumes.create({ Name: "testVolume" })),
                testVolumesService
            )
        );

        expect(testData.Name).toBe("testVolume");
        expect(testData.CreatedAt).toBeDefined();
        expect(new Date(testData.CreatedAt!).getTime()).toBeLessThanOrEqual(Date.now());
    });

    it("Should see one volume", async () => {
        const testData: Readonly<MobyApi.Schemas.VolumeListResponse> = await Effect.runPromise(
            Effect.provide(
                Effect.flatMap(MobyApi.Volumes.Volumes, (volumes) => volumes.list()),
                testVolumesService
            )
        );

        expect(testData.Warnings).toBeNull();
        expect(testData.Volumes).toBeInstanceOf(Array);
        expect(testData.Volumes).toHaveLength(1);
    });

    it("Should inspect the volume", async () => {
        const testData: Readonly<MobyApi.Schemas.Volume> = await Effect.runPromise(
            Effect.provide(
                Effect.flatMap(MobyApi.Volumes.Volumes, (volumes) => volumes.inspect({ name: "testVolume" })),
                testVolumesService
            )
        );

        expect(testData.Name).toBe("testVolume");
        expect(testData.Driver).toBe("local");
        expect(testData.Mountpoint).toBe("/var/lib/docker/volumes/testVolume/_data");
        expect(testData.Labels).toBeNull();
        expect(testData.Scope).toBe(MobyApi.Schemas.Volume_Scope.LOCAL);
        expect(testData.Options).toBeNull();
    });

    it("Should remove the volume", async () => {
        await Effect.runPromise(
            Effect.provide(
                Effect.flatMap(MobyApi.Volumes.Volumes, (volumes) => volumes.delete({ name: "testVolume" })),
                testVolumesService
            )
        );
    });

    it("Should see no volumes", async () => {
        const testData: Readonly<MobyApi.Schemas.VolumeListResponse> = await Effect.runPromise(
            Effect.provide(
                Effect.flatMap(MobyApi.Volumes.Volumes, (volumes) => volumes.list()),
                testVolumesService
            )
        );

        expect(testData.Warnings).toBeNull();
        expect(testData.Volumes).toBeInstanceOf(Array);
        expect(testData.Volumes).toHaveLength(0);
    });

    it("Should create a volume with labels", async () => {
        const testData: Readonly<MobyApi.Schemas.Volume> = await Effect.runPromise(
            Effect.provide(
                Effect.flatMap(MobyApi.Volumes.Volumes, (volumes) =>
                    volumes.create({ Name: "testVolume", Labels: { testLabel: "test" } })
                ),
                testVolumesService
            )
        );

        expect(testData.Name).toBe("testVolume");
        expect(testData.CreatedAt).toBeDefined();
        expect(new Date(testData.CreatedAt!).getTime()).toBeLessThanOrEqual(Date.now());
        expect(testData.Labels).toEqual({ testLabel: "test" });
    });

    it("Should list volumes with labels", async () => {
        const testData: Readonly<MobyApi.Schemas.VolumeListResponse> = await Effect.runPromise(
            Effect.provide(
                Effect.flatMap(MobyApi.Volumes.Volumes, (volumes) =>
                    volumes.list({ filters: { label: ["testLabel=test"] } })
                ),
                testVolumesService
            )
        );

        expect(testData.Warnings).toBeNull();
        expect(testData.Volumes).toBeInstanceOf(Array);
        expect(testData.Volumes).toHaveLength(1);
    });

    it("Should list non dangling volumes", async () => {
        const testData: Readonly<MobyApi.Schemas.VolumeListResponse> = await Effect.runPromise(
            Effect.provide(
                Effect.flatMap(MobyApi.Volumes.Volumes, (volumes) =>
                    volumes.list({ filters: { dangling: ["false"] } })
                ),
                testVolumesService
            )
        );

        expect(testData.Warnings).toBeNull();
        expect(testData.Volumes).toBeInstanceOf(Array);
        expect(testData.Volumes).toHaveLength(0);
    });

    it("Should prune volumes", async () => {
        const testData: Readonly<MobyApi.Schemas.VolumePruneResponse> = await Effect.runPromise(
            Effect.provide(
                Effect.flatMap(MobyApi.Volumes.Volumes, (volumes) => volumes.prune({ filters: { all: ["true"] } })),
                testVolumesService
            )
        );

        expect(testData.SpaceReclaimed).toBe(0);
        expect(testData.VolumesDeleted).toBeInstanceOf(Array);
        expect(testData.VolumesDeleted).toHaveLength(1);
        expect(testData.VolumesDeleted![0]).toBe("testVolume");
    });

    it("Should see no volumes", async () => {
        const testData: Readonly<MobyApi.Schemas.VolumeListResponse> = await Effect.runPromise(
            Effect.provide(
                Effect.flatMap(MobyApi.Volumes.Volumes, (volumes) => volumes.list()),
                testVolumesService
            )
        );

        expect(testData.Warnings).toBeNull();
        expect(testData.Volumes).toBeInstanceOf(Array);
        expect(testData.Volumes).toHaveLength(0);
    });
});
