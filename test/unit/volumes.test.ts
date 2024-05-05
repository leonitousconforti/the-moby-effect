import { afterAll, beforeAll, describe, expect, it } from "@effect/vitest";

import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as MobyApi from "the-moby-effect/Moby";

describe("MobyApi Volumes tests", () => {
    const testVolumesService: Layer.Layer<MobyApi.Volumes.Volumes, never, never> = MobyApi.fromConnectionOptions(
        globalThis.__TEST_CONNECTION_OPTIONS
    ).pipe(Layer.orDie);
    const testSwarmsService: Layer.Layer<MobyApi.Swarm.Swarms, never, never> = MobyApi.fromConnectionOptions(
        globalThis.__TEST_CONNECTION_OPTIONS
    ).pipe(Layer.orDie);

    beforeAll(async () => {
        await Effect.provide(
            Effect.flatMap(MobyApi.Swarm.Swarms, (swarm) => swarm.init({ ListenAddr: "eth0" })),
            testSwarmsService
        ).pipe(Effect.runPromise);
    });

    afterAll(async () => {
        await Effect.provide(
            Effect.flatMap(MobyApi.Swarm.Swarms, (swarm) => swarm.leave({ force: true })),
            testSwarmsService
        ).pipe(Effect.runPromise);
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
        expect(testData.Scope).toBe("local");
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

    it("Should update a volume", async () => {
        const testData: Readonly<MobyApi.Schemas.Volume> = await Effect.runPromise(
            Effect.provide(
                Effect.flatMap(MobyApi.Volumes.Volumes, (volumes) =>
                    volumes.create({
                        Name: "testVolume2",
                        ClusterVolumeSpec: new MobyApi.Schemas.ClusterVolumeSpec({
                            AccessMode: {
                                MountVolume: {},
                            },
                        }),
                    })
                ),
                testVolumesService
            )
        );

        const spec = testData.ClusterVolume!.Spec!;
        const version = testData.ClusterVolume!.Version!.Index!;
        await Effect.runPromise(
            Effect.provide(
                Effect.flatMap(MobyApi.Volumes.Volumes, (volumes) =>
                    volumes.update({ name: testData.ClusterVolume!.ID!, version, spec })
                ),
                testVolumesService
            )
        );
    });
});
