import { describe, expect, inject, it } from "@effect/vitest";
import { afterAllEffect, afterAllTimeout, beforeAllEffect, beforeAllTimeout, provideManagedRuntime } from "./shared.js";

import * as FileSystem from "@effect/platform-node/NodeFileSystem";
import * as Path from "@effect/platform/Path";
import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as Layer from "effect/Layer";
import * as ManagedRuntime from "effect/ManagedRuntime";
import * as Match from "effect/Match";
import * as Stream from "effect/Stream";

import * as Images from "the-moby-effect/endpoints/Images";
import * as DindEngine from "the-moby-effect/engines/Dind";

describe("MobyApi Images tests", () => {
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

    const testDindLayer = makePlatformDindLayer({
        dindBaseImage: inject("__DOCKER_ENGINE_VERSION"),
        exposeDindContainerBy: inject("__CONNECTION_VARIANT"),
        connectionOptionsToHost: inject("__DOCKER_HOST_CONNECTION_OPTIONS"),
    });

    const testServices = Layer.mergeAll(Path.layer, FileSystem.layer);
    const testRuntime = ManagedRuntime.make(Layer.provide(testDindLayer, testServices));
    beforeAllEffect(() => provideManagedRuntime(Effect.void, testRuntime), beforeAllTimeout);
    afterAllEffect(() => testRuntime.disposeEffect, afterAllTimeout);

    it("Should search for an image (this test could be flaky depending on docker hub availability and transient network conditions)", async () => {
        const searchResults = await testRuntime.runPromise(
            Images.Images.search({
                term: "alpine",
                limit: 1,
                "is-official": true,
            })
        );
        expect(searchResults).toBeInstanceOf(Array);
        expect(searchResults).toHaveLength(1);
        expect(searchResults[0]!.name).toBe("alpine");
        expect(searchResults[0]!.is_official).toBe(true);
        expect(searchResults[0]!.is_automated).toBe(false);
        expect(searchResults[0]!.description).toBe(
            "A minimal Docker image based on Alpine Linux with a complete package index and only 5 MB in size!"
        );
    });

    it("Should pull an image", async () => {
        await Effect.gen(function* () {
            const pullResponse = yield* Images.Images.create({ fromImage: "docker.io/library/alpine:latest" });
            yield* Stream.runCollect(pullResponse);
        }).pipe(testRuntime.runPromise);
    }, 30_000);

    it.skip("Should inspect an image", async () => {
        const inspectResponse = await testRuntime.runPromise(
            Images.Images.inspect({ name: "docker.io/library/alpine:latest" })
        );
        expect(inspectResponse.Id).toBeDefined();
        expect(inspectResponse.RepoDigests).toBeDefined();
        expect(inspectResponse.RepoTags).toBeDefined();
        expect(inspectResponse.Size).toBeDefined();
    });

    it("Should tag an image", async () => {
        await testRuntime.runPromise(
            Images.Images.tag({
                name: "docker.io/library/alpine:latest",
                repo: "docker.io/person/their-image",
                tag: "test",
            })
        );
    });

    it("Should get the history of an image", async () => {
        const historyResponse = await testRuntime.runPromise(
            Images.Images.history({ name: "docker.io/library/alpine:latest" })
        );
        expect(historyResponse).toBeInstanceOf(Array);
    });

    it.skip("Should prune all images", async () => {
        const pruneResponse = await testRuntime.runPromise(Images.Images.prune({ filters: { dangling: ["true"] } }));
        expect(pruneResponse.CachesDeleted).toBeDefined();
        expect(pruneResponse.SpaceReclaimed).toBeDefined();
    });
});
