import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as MobyApi from "../../src/index.js";

describe.skip("MobyApi Plugins tests", () => {
    const testPluginsService: Layer.Layer<never, never, MobyApi.Plugins.Plugins> = MobyApi.fromUrl(
        globalThis.__THE_MOBY_EFFECT_TEST_URL
    ).pipe(Layer.orDie);

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
