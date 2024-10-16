import { expect, layer } from "@effect/vitest";
import { Effect, Layer } from "effect";
import * as Plugins from "the-moby-effect/endpoints/Plugins";
import { testLayer } from "./shared.js";

layer(Layer.fresh(testLayer))("MobyApi Plugins tests", (it) => {
    it.effect("Should see no plugins", () =>
        Effect.gen(function* () {
            const plugins = yield* Plugins.Plugins;
            const pluginsList = yield* plugins.list();
            expect(pluginsList).toBeInstanceOf(Array);
            expect(pluginsList).toHaveLength(0);
        })
    );

    it.effect.skip("Should pull a plugin", () =>
        Effect.gen(function* () {
            const plugins = yield* Plugins.Plugins;
            yield* plugins.pull({
                remote: "docker.io/grafana/loki-docker-driver:main",
                name: "test-plugin:latest",
            });
            yield* plugins.enable({ name: "test-plugin:latest" });
        })
    );

    it.effect.skip("Should see one plugin", () =>
        Effect.gen(function* () {
            const plugins = yield* Plugins.Plugins;
            const pluginsList = yield* plugins.list();
            expect(pluginsList).toBeInstanceOf(Array);
            expect(pluginsList).toHaveLength(1);
        })
    );

    it.effect.skip("Should update a plugin", () =>
        Effect.gen(function* () {
            const plugins = yield* Plugins.Plugins;
            plugins.upgrade({
                remote: "docker.io/grafana/loki-docker-driver:main",
                name: "test-plugin:latest",
            });
        })
    );

    it.effect.skip("Should disable a plugin", () =>
        Effect.gen(function* () {
            const plugins = yield* Plugins.Plugins;
            yield* plugins.disable({ name: "test-plugin:latest" });
        })
    );

    it.effect.skip("Should see no enabled plugins", () =>
        Effect.gen(function* () {
            const plugins = yield* Plugins.Plugins;
            const pluginsList = yield* plugins.list({ filters: { enable: ["true"] } });
            expect(pluginsList).toBeInstanceOf(Array);
            expect(pluginsList).toHaveLength(0);
        })
    );
});
