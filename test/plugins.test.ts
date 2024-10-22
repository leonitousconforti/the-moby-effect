import { expect, layer } from "@effect/vitest";
import { Duration, Effect, Layer } from "effect";
import { Plugins } from "the-moby-effect/MobyEndpoints";
import { testLayer } from "./shared.js";

layer(Layer.fresh(testLayer), { timeout: Duration.minutes(2) })("MobyApi Plugins tests", (it) => {
    it.effect("Should see no plugins", () =>
        Effect.gen(function* () {
            const plugins = yield* Plugins;
            const pluginsList = yield* plugins.list();
            expect(pluginsList).toBeInstanceOf(Array);
            expect(pluginsList).toHaveLength(0);
        })
    );

    it.effect.skip("Should pull a plugin", () =>
        Effect.gen(function* () {
            const plugins = yield* Plugins;
            yield* plugins.pull("docker.io/grafana/loki-docker-driver:main", {
                name: "test-plugin:latest",
            });
            yield* plugins.enable("test-plugin:latest");
        })
    );

    it.effect.skip("Should see one plugin", () =>
        Effect.gen(function* () {
            const plugins = yield* Plugins;
            const pluginsList = yield* plugins.list();
            expect(pluginsList).toBeInstanceOf(Array);
            expect(pluginsList).toHaveLength(1);
        })
    );

    it.effect.skip("Should update a plugin", () =>
        Effect.gen(function* () {
            const plugins = yield* Plugins;
            plugins.upgrade({
                remote: "docker.io/grafana/loki-docker-driver:main",
                name: "test-plugin:latest",
            });
        })
    );

    it.effect.skip("Should disable a plugin", () =>
        Effect.gen(function* () {
            const plugins = yield* Plugins;
            yield* plugins.disable("test-plugin:latest");
        })
    );

    it.effect.skip("Should see no enabled plugins", () =>
        Effect.gen(function* () {
            const plugins = yield* Plugins;
            const pluginsList = yield* plugins.list({ filters: { enable: ["true"] } });
            expect(pluginsList).toBeInstanceOf(Array);
            expect(pluginsList).toHaveLength(0);
        })
    );
});
