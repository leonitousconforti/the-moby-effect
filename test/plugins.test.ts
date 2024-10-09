import { expect, layer } from "@effect/vitest";
import { Effect, Layer } from "effect";
import * as Plugins from "the-moby-effect/endpoints/Plugins";
import { testLayer } from "./shared.js";

layer(Layer.fresh(testLayer))("MobyApi Plugins tests", (it) => {
    it.effect("Should see no plugins", () =>
        Effect.gen(function* () {
            const plugins = yield* Plugins.Plugins.list();
            expect(plugins).toBeInstanceOf(Array);
            expect(plugins).toHaveLength(0);
        })
    );

    it.effect("Should pull a plugin", () =>
        Effect.gen(function* () {
            yield* Plugins.Plugins.pull({
                remote: "docker.io/grafana/loki-docker-driver:main",
                name: "test-plugin:latest",
            });
            yield* Plugins.Plugins.enable({ name: "test-plugin:latest" });
        })
    );

    it.effect("Should see one plugin", () =>
        Effect.gen(function* () {
            const plugins = yield* Plugins.Plugins.list();
            expect(plugins).toBeInstanceOf(Array);
            expect(plugins).toHaveLength(1);
        })
    );

    it.effect("Should update a plugin", () =>
        Effect.gen(function* () {
            Plugins.Plugins.upgrade({
                remote: "docker.io/grafana/loki-docker-driver:main",
                name: "test-plugin:latest",
            });
        })
    );

    it.effect("Should disable a plugin", () =>
        Effect.gen(function* () {
            yield* Plugins.Plugins.disable({ name: "test-plugin:latest" });
        })
    );

    it.effect("Should see no enabled plugins", () =>
        Effect.gen(function* () {
            const plugins = yield* Plugins.Plugins.list({ filters: { enable: ["true"] } });
            expect(plugins).toBeInstanceOf(Array);
            expect(plugins).toHaveLength(0);
        })
    );
});
