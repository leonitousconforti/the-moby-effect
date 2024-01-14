import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";

import * as MobyApi from "../src/index.js";
import { AfterAll, BeforeAll, testEngines } from "./helpers.js";

let dindContainerId: string = undefined!;
let dindStorageVolumeName: string = undefined!;
let testPluginsService: Layer.Layer<never, never, MobyApi.Plugins.Plugins> = undefined!;

describe.skip.each(testEngines)("MobyApi Plugins tests", (image) => {
    afterAll(async () => await AfterAll(dindContainerId, dindStorageVolumeName), 30_000);
    beforeAll(async () => {
        [dindContainerId, dindStorageVolumeName, testPluginsService] = await BeforeAll(
            image,
            MobyApi.Plugins.fromConnectionOptions
        );
    }, 30_000);

    it("Should see no plugins", async () => {
        const plugins: Readonly<MobyApi.Schemas.Plugin[]> = await Effect.runPromise(
            Effect.provide(
                Effect.flatMap(MobyApi.Plugins.Plugins, (plugins) => plugins.list()),
                testPluginsService
            )
        );
        expect(plugins).toBeInstanceOf(Array);
        expect(plugins).toHaveLength(0);
    });

    it("Should pull a plugin", async () => {
        await Effect.runPromise(
            Effect.provide(
                Effect.flatMap(MobyApi.Plugins.Plugins, (plugins) =>
                    plugins.pull({
                        remote: "docker.io/grafana/loki-docker-driver:main",
                        name: "test-plugin:latest",
                    })
                ),
                testPluginsService
            )
        );
        await Effect.runPromise(
            Effect.provide(
                Effect.flatMap(MobyApi.Plugins.Plugins, (plugins) => plugins.enable({ name: "test-plugin:latest" })),
                testPluginsService
            )
        );
    });

    it("Should see one plugin", async () => {
        const plugins: Readonly<MobyApi.Schemas.Plugin[]> = await Effect.runPromise(
            Effect.provide(
                Effect.flatMap(MobyApi.Plugins.Plugins, (plugins) => plugins.list()),
                testPluginsService
            )
        );
        expect(plugins).toBeInstanceOf(Array);
        expect(plugins).toHaveLength(1);
    });

    it("Should update a plugin", async () => {
        await Effect.runPromise(
            Effect.provide(
                Effect.flatMap(MobyApi.Plugins.Plugins, (plugins) =>
                    plugins.upgrade({
                        remote: "docker.io/grafana/loki-docker-driver:main",
                        name: "test-plugin:latest",
                    })
                ),
                testPluginsService
            )
        );
    });

    it("Should disable a plugin", async () => {
        await Effect.runPromise(
            Effect.provide(
                Effect.flatMap(MobyApi.Plugins.Plugins, (plugins) => plugins.disable({ name: "test-plugin:latest" })),
                testPluginsService
            )
        );
    });

    it("Should see no enabled plugins", async () => {
        const plugins: Readonly<MobyApi.Schemas.Plugin[]> = await Effect.runPromise(
            Effect.provide(
                Effect.flatMap(MobyApi.Plugins.Plugins, (plugins) => plugins.list({ filters: { enable: ["true"] } })),
                testPluginsService
            )
        );
        expect(plugins).toBeInstanceOf(Array);
        expect(plugins).toHaveLength(0);
    });
});
