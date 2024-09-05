import { afterAll, beforeAll, describe, expect, inject, it } from "@effect/vitest";

import * as FileSystem from "@effect/platform-node/NodeFileSystem";
import * as Path from "@effect/platform/Path";
import * as Duration from "effect/Duration";
import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as Layer from "effect/Layer";
import * as ManagedRuntime from "effect/ManagedRuntime";
import * as Match from "effect/Match";

import * as Plugins from "the-moby-effect/endpoints/Plugins";
import * as DindEngine from "the-moby-effect/engines/Dind";

const afterAllTimeout = Duration.seconds(10).pipe(Duration.toMillis);
const beforeAllTimeout = Duration.seconds(60).pipe(Duration.toMillis);

describe.skip("MobyApi Plugins tests", () => {
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

    it("Should see no plugins", async () => {
        const plugins = await testRuntime.runPromise(Plugins.Plugins.list());
        expect(plugins).toBeInstanceOf(Array);
        expect(plugins).toHaveLength(0);
    });

    it("Should pull a plugin", async () => {
        await testRuntime.runPromise(
            Plugins.Plugins.pull({
                remote: "docker.io/grafana/loki-docker-driver:main",
                name: "test-plugin:latest",
            })
        );
        await testRuntime.runPromise(Plugins.Plugins.enable({ name: "test-plugin:latest" }));
    });

    it("Should see one plugin", async () => {
        const plugins = await testRuntime.runPromise(Plugins.Plugins.list());
        expect(plugins).toBeInstanceOf(Array);
        expect(plugins).toHaveLength(1);
    });

    it("Should update a plugin", async () => {
        await testRuntime.runPromise(
            Plugins.Plugins.upgrade({
                remote: "docker.io/grafana/loki-docker-driver:main",
                name: "test-plugin:latest",
            })
        );
    });

    it("Should disable a plugin", async () => {
        await testRuntime.runPromise(Plugins.Plugins.disable({ name: "test-plugin:latest" }));
    });

    it("Should see no enabled plugins", async () => {
        const plugins = await testRuntime.runPromise(Plugins.Plugins.list({ filters: { enable: ["true"] } }));
        expect(plugins).toBeInstanceOf(Array);
        expect(plugins).toHaveLength(0);
    });
});
