import { NodeContext } from "@effect/platform-node";
import { describe, expect, layer } from "@effect/vitest";
import { Duration, Effect, Layer } from "effect";
import { MobyConnection, MobyEndpoints } from "the-moby-effect";
import { makePlatformDindLayer, testMatrix } from "./shared.js";

describe.concurrent.each(testMatrix)(
    "MobyApi Volumes tests for $exposeDindContainerBy+$dindBaseImage",
    ({ dindBaseImage, exposeDindContainerBy }) => {
        const testLayer = MobyConnection.connectionOptionsFromPlatformSystemSocketDefault
            .pipe(
                Effect.map((connectionOptionsToHost) =>
                    makePlatformDindLayer({
                        dindBaseImage,
                        exposeDindContainerBy,
                        connectionOptionsToHost,
                    })
                )
            )
            .pipe(Layer.unwrapEffect)
            .pipe(Layer.provide(NodeContext.layer));

        layer(testLayer, { timeout: Duration.minutes(2) })("MobyApi Volumes tests", (it) => {
            it.effect("Should see no volumes", () =>
                Effect.gen(function* () {
                    const volumes = yield* MobyEndpoints.Volumes;
                    const testData = yield* volumes.list();
                    expect(testData.Warnings).toBeNull();
                    expect(testData.Volumes).toBeInstanceOf(Array);
                    expect(testData.Volumes).toHaveLength(0);
                })
            );

            it.effect("Should create a volume", () =>
                Effect.gen(function* () {
                    const volumes = yield* MobyEndpoints.Volumes;
                    const testData = yield* volumes.create({ Name: "testVolume" });
                    expect(testData.Name).toBe("testVolume");
                    expect(testData.CreatedAt).toBeDefined();
                    expect(testData.CreatedAt!.getTime()).toBeLessThanOrEqual(Date.now());
                })
            );

            it.effect("Should see one volume", () =>
                Effect.gen(function* () {
                    const volumes = yield* MobyEndpoints.Volumes;
                    const testData = yield* volumes.list();
                    expect(testData.Warnings).toBeNull();
                    expect(testData.Volumes).toBeInstanceOf(Array);
                    expect(testData.Volumes).toHaveLength(1);
                })
            );

            it.effect("Should inspect the volume", () =>
                Effect.gen(function* () {
                    const volumes = yield* MobyEndpoints.Volumes;
                    const testData = yield* volumes.inspect("testVolume");
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
                    const volumes = yield* MobyEndpoints.Volumes;
                    yield* volumes.delete("testVolume");
                })
            );

            it.effect("Should see no volumes", () =>
                Effect.gen(function* () {
                    const volumes = yield* MobyEndpoints.Volumes;
                    const testData = yield* volumes.list();
                    expect(testData.Warnings).toBeNull();
                    expect(testData.Volumes).toBeInstanceOf(Array);
                    expect(testData.Volumes).toHaveLength(0);
                })
            );

            it.effect("Should create a volume with labels", () =>
                Effect.gen(function* () {
                    const volumes = yield* MobyEndpoints.Volumes;
                    const testData = yield* volumes.create({ Name: "testVolume", Labels: { testLabel: "test" } });
                    expect(testData.Name).toBe("testVolume");
                    expect(testData.CreatedAt).toBeDefined();
                    expect(testData.CreatedAt!.getTime()).toBeLessThanOrEqual(Date.now());
                    expect(testData.Labels).toEqual({ testLabel: "test" });
                })
            );

            it.effect("Should list volumes with labels", () =>
                Effect.gen(function* () {
                    const volumes = yield* MobyEndpoints.Volumes;
                    const testData = yield* volumes.list({ filters: { label: ["testLabel=test"] } });
                    expect(testData.Warnings).toBeNull();
                    expect(testData.Volumes).toBeInstanceOf(Array);
                    expect(testData.Volumes).toHaveLength(1);
                })
            );

            it.effect("Should list non dangling volumes", () =>
                Effect.gen(function* () {
                    const volumes = yield* MobyEndpoints.Volumes;
                    const testData = yield* volumes.list({ filters: { dangling: ["false"] } });
                    expect(testData.Warnings).toBeNull();
                    expect(testData.Volumes).toBeInstanceOf(Array);
                    expect(testData.Volumes).toHaveLength(0);
                })
            );

            it.effect("Should prune volumes", () =>
                Effect.gen(function* () {
                    const volumes = yield* MobyEndpoints.Volumes;
                    const testData = yield* volumes.prune({ filters: { all: ["true"] } });
                    expect(testData.SpaceReclaimed).toBe(0);
                    expect(testData.VolumesDeleted).toBeInstanceOf(Array);
                    expect(testData.VolumesDeleted).toHaveLength(1);
                    expect(testData.VolumesDeleted![0]).toBe("testVolume");
                })
            );

            it.effect("Should see no volumes", () =>
                Effect.gen(function* () {
                    const volumes = yield* MobyEndpoints.Volumes;
                    const testData = yield* volumes.list();
                    expect(testData.Warnings).toBeNull();
                    expect(testData.Volumes).toBeInstanceOf(Array);
                    expect(testData.Volumes).toHaveLength(0);
                })
            );
        });
    }
);
