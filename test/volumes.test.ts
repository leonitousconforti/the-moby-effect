import { afterAll, beforeAll, describe, expect, inject, it } from "@effect/vitest";

import * as FileSystem from "@effect/platform-node/NodeFileSystem";
import * as Path from "@effect/platform/Path";
import * as Duration from "effect/Duration";
import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as Layer from "effect/Layer";
import * as ManagedRuntime from "effect/ManagedRuntime";
import * as Match from "effect/Match";

import * as Volumes from "the-moby-effect/endpoints/Volumes";
import * as DindEngine from "the-moby-effect/engines/Dind";

const afterAllTimeout = Duration.seconds(10).pipe(Duration.toMillis);
const beforeAllTimeout = Duration.seconds(60).pipe(Duration.toMillis);

describe("MobyApi Volumes tests", () => {
    const makePlatformDindLayer = Function.pipe(
        Match.value(inject("__PLATFORM_VARIANT")),
        Match.when("bun", () => DindEngine.layerBun),
        Match.when("deno", () => DindEngine.layerDeno),
        Match.whenOr("node-18.x", "node-20.x", "node-22.x", () => DindEngine.layerNodeJS),
        Match.whenOr(
            "node-18.x-undici",
            "node-20.x-undici",
            "node-22.x-undici",
            "deno-undici",
            "bun-undici",
            () => DindEngine.layerUndici
        ),
        Match.exhaustive
    );

    const testDindLayer: DindEngine.DindLayerWithDockerEngineRequirementsProvided = makePlatformDindLayer({
        dindBaseImage: inject("__DOCKER_ENGINE_VERSION"),
        exposeDindContainerBy: inject("__CONNECTION_VARIANT"),
        connectionOptionsToHost: inject("__DOCKER_HOST_CONNECTION_OPTIONS"),
    });

    const testServices = Layer.mergeAll(Path.layer, FileSystem.layer);
    const testRuntime = ManagedRuntime.make(Layer.provide(testDindLayer, testServices));
    beforeAll(() => testRuntime.runPromise(Effect.void).then(() => {}), beforeAllTimeout);
    afterAll(() => testRuntime.dispose().then(() => {}), afterAllTimeout);

    it("Should see no volumes", async () => {
        const testData = await testRuntime.runPromise(Volumes.Volumes.list());
        expect(testData.Warnings).toBeNull();
        expect(testData.Volumes).toBeInstanceOf(Array);
        expect(testData.Volumes).toHaveLength(0);
    });

    it("Should create a volume", async () => {
        const testData = await testRuntime.runPromise(Volumes.Volumes.create({ Name: "testVolume" }));
        expect(testData.Name).toBe("testVolume");
        expect(testData.CreatedAt).toBeDefined();
        expect(testData.CreatedAt!.getTime()).toBeLessThanOrEqual(Date.now());
    });

    it("Should see one volume", async () => {
        const testData = await testRuntime.runPromise(Volumes.Volumes.list());
        expect(testData.Warnings).toBeNull();
        expect(testData.Volumes).toBeInstanceOf(Array);
        expect(testData.Volumes).toHaveLength(1);
    });

    it("Should inspect the volume", async () => {
        const testData = await testRuntime.runPromise(Volumes.Volumes.inspect({ name: "testVolume" }));
        expect(testData.Name).toBe("testVolume");
        expect(testData.Driver).toBe("local");
        expect(testData.Mountpoint).toBe("/var/lib/docker/volumes/testVolume/_data");
        expect(testData.Labels).toBeNull();
        expect(testData.Scope).toBe("local");
        expect(testData.Options).toBeNull();
    });

    it("Should remove the volume", async () => {
        await testRuntime.runPromise(Volumes.Volumes.delete({ name: "testVolume" }));
    });

    it("Should see no volumes", async () => {
        const testData = await testRuntime.runPromise(Volumes.Volumes.list());
        expect(testData.Warnings).toBeNull();
        expect(testData.Volumes).toBeInstanceOf(Array);
        expect(testData.Volumes).toHaveLength(0);
    });

    it("Should create a volume with labels", async () => {
        const testData = await testRuntime.runPromise(
            Volumes.Volumes.create({ Name: "testVolume", Labels: { testLabel: "test" } })
        );
        expect(testData.Name).toBe("testVolume");
        expect(testData.CreatedAt).toBeDefined();
        expect(testData.CreatedAt!.getTime()).toBeLessThanOrEqual(Date.now());
        expect(testData.Labels).toEqual({ testLabel: "test" });
    });

    it("Should list volumes with labels", async () => {
        const testData = await testRuntime.runPromise(Volumes.Volumes.list({ filters: { label: ["testLabel=test"] } }));
        expect(testData.Warnings).toBeNull();
        expect(testData.Volumes).toBeInstanceOf(Array);
        expect(testData.Volumes).toHaveLength(1);
    });

    it("Should list non dangling volumes", async () => {
        const testData = await testRuntime.runPromise(Volumes.Volumes.list({ filters: { dangling: ["false"] } }));
        expect(testData.Warnings).toBeNull();
        expect(testData.Volumes).toBeInstanceOf(Array);
        expect(testData.Volumes).toHaveLength(0);
    });

    it("Should prune volumes", async () => {
        const testData = await testRuntime.runPromise(Volumes.Volumes.prune({ filters: { all: ["true"] } }));
        expect(testData.SpaceReclaimed).toBe(0);
        expect(testData.VolumesDeleted).toBeInstanceOf(Array);
        expect(testData.VolumesDeleted).toHaveLength(1);
        expect(testData.VolumesDeleted![0]).toBe("testVolume");
    });

    it("Should see no volumes", async () => {
        const testData = await testRuntime.runPromise(Volumes.Volumes.list());
        expect(testData.Warnings).toBeNull();
        expect(testData.Volumes).toBeInstanceOf(Array);
        expect(testData.Volumes).toHaveLength(0);
    });

    it.skip("Should update a volume", async () => {
        const testData = await testRuntime.runPromise(Volumes.Volumes.create({ Name: "testVolume2" }));
        const spec = testData.ClusterVolume!.Spec!;
        const version = testData.ClusterVolume!.Version!.Index!;
        await testRuntime.runPromise(Volumes.Volumes.update({ name: testData.ClusterVolume!.ID!, version, spec }));
    });
});
