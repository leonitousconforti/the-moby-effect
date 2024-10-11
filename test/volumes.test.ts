import { expect, layer } from "@effect/vitest";
import { Effect, Layer } from "effect";
import * as Volumes from "the-moby-effect/endpoints/Volumes";
import { testLayer } from "./shared.js";

layer(Layer.fresh(testLayer))("MobyApi Volumes tests", (it) => {
    it.effect("Should see no volumes", () =>
        Effect.gen(function* () {
            const volumes = yield* Volumes.Volumes;
            const testData = yield* volumes.list();
            expect(testData.Warnings).toBeNull();
            expect(testData.Volumes).toBeInstanceOf(Array);
            expect(testData.Volumes).toHaveLength(0);
        })
    );

    it.effect("Should create a volume", () =>
        Effect.gen(function* () {
            const volumes = yield* Volumes.Volumes;
            const testData = yield* volumes.create({ Name: "testVolume" });
            expect(testData.Name).toBe("testVolume");
            expect(testData.CreatedAt).toBeDefined();
            expect(testData.CreatedAt!.getTime()).toBeLessThanOrEqual(Date.now());
        })
    );

    it.effect("Should see one volume", () =>
        Effect.gen(function* () {
            const volumes = yield* Volumes.Volumes;
            const testData = yield* volumes.list();
            expect(testData.Warnings).toBeNull();
            expect(testData.Volumes).toBeInstanceOf(Array);
            expect(testData.Volumes).toHaveLength(1);
        })
    );

    it.effect("Should inspect the volume", () =>
        Effect.gen(function* () {
            const volumes = yield* Volumes.Volumes;
            const testData = yield* volumes.inspect({ name: "testVolume" });
            expect(testData.Name).toBe("testVolume");
            expect(testData.Driver).toBe("local");
            expect(testData.Mountpoint).toContain("/docker/volumes/testVolume/_data");
            expect(testData.Labels).toBeNull();
            expect(testData.Scope).toBe("local");
            expect(testData.Options).toBeNull();
        })
    );

    it.effect("Should remove the volume", () =>
        Effect.gen(function* () {
            const volumes = yield* Volumes.Volumes;
            yield* volumes.delete({ name: "testVolume" });
        })
    );

    it.effect("Should see no volumes", () =>
        Effect.gen(function* () {
            const volumes = yield* Volumes.Volumes;
            const testData = yield* volumes.list();
            expect(testData.Warnings).toBeNull();
            expect(testData.Volumes).toBeInstanceOf(Array);
            expect(testData.Volumes).toHaveLength(0);
        })
    );

    it.effect("Should create a volume with labels", () =>
        Effect.gen(function* () {
            const volumes = yield* Volumes.Volumes;
            const testData = yield* volumes.create({ Name: "testVolume", Labels: { testLabel: "test" } });
            expect(testData.Name).toBe("testVolume");
            expect(testData.CreatedAt).toBeDefined();
            expect(testData.CreatedAt!.getTime()).toBeLessThanOrEqual(Date.now());
            expect(testData.Labels).toEqual({ testLabel: "test" });
        })
    );

    it.effect("Should list volumes with labels", () =>
        Effect.gen(function* () {
            const volumes = yield* Volumes.Volumes;
            const testData = yield* volumes.list({ filters: { label: ["testLabel=test"] } });
            expect(testData.Warnings).toBeNull();
            expect(testData.Volumes).toBeInstanceOf(Array);
            expect(testData.Volumes).toHaveLength(1);
        })
    );

    it.effect("Should list non dangling volumes", () =>
        Effect.gen(function* () {
            const volumes = yield* Volumes.Volumes;
            const testData = yield* volumes.list({ filters: { dangling: ["false"] } });
            expect(testData.Warnings).toBeNull();
            expect(testData.Volumes).toBeInstanceOf(Array);
            expect(testData.Volumes).toHaveLength(0);
        })
    );

    it.effect("Should prune volumes", () =>
        Effect.gen(function* () {
            const volumes = yield* Volumes.Volumes;
            const testData = yield* volumes.prune({ filters: { all: ["true"] } });
            expect(testData.SpaceReclaimed).toBe(0);
            expect(testData.VolumesDeleted).toBeInstanceOf(Array);
            expect(testData.VolumesDeleted).toHaveLength(1);
            expect(testData.VolumesDeleted![0]).toBe("testVolume");
        })
    );

    it.effect("Should see no volumes", () =>
        Effect.gen(function* () {
            const volumes = yield* Volumes.Volumes;
            const testData = yield* volumes.list();
            expect(testData.Warnings).toBeNull();
            expect(testData.Volumes).toBeInstanceOf(Array);
            expect(testData.Volumes).toHaveLength(0);
        })
    );

    it.effect("Should update a volume", () =>
        Effect.gen(function* () {
            const volumes = yield* Volumes.Volumes;
            const testData = yield* volumes.create({ Name: "testVolume2" });
            const spec = testData.ClusterVolume!.Spec!;
            const version = testData.ClusterVolume!.Version!.Index!;
            yield* volumes.update({ name: testData.ClusterVolume!.ID!, version, spec });
        })
    );
});
