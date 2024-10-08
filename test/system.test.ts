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

import * as System from "the-moby-effect/endpoints/System";
import * as DindEngine from "the-moby-effect/engines/Dind";

describe("MobyApi System tests", () => {
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

    it("Should ping the docker daemon", async () => {
        await testRuntime.runPromise(System.Systems.ping());
    });

    it("Should see the docker version", async () => {
        const versionResponse = await testRuntime.runPromise(System.Systems.version());
        expect(versionResponse).toBeDefined();
    });

    it("Should see the docker info", async () => {
        const infoResponse = await testRuntime.runPromise(System.Systems.info());
        expect(infoResponse).toBeDefined();
    });

    it("Should see the docker system data usage", async () => {
        const dataUsageResponse = await testRuntime.runPromise(System.Systems.dataUsage());
        expect(dataUsageResponse).toBeDefined();
    });

    it.skip("Should see docker events", async () => {
        await testRuntime.runPromise(Effect.flatMap(System.Systems.events({ since: "0" }), Stream.runHead));
    });
});
