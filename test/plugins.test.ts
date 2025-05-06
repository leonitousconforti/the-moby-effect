import { NodeContext } from "@effect/platform-node";
import { describe, expect, layer } from "@effect/vitest";
import { Duration, Effect, Layer } from "effect";
import { MobyConnection, MobyEndpoints } from "the-moby-effect";
import { makePlatformDindLayer } from "./shared-file.js";
import { testMatrix } from "./shared-global.js";

describe.each(testMatrix)(
    "MobyApi Plugins tests for $exposeDindContainerBy+$dindBaseImage",
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

        layer(testLayer, { timeout: Duration.minutes(2) })("MobyApi Plugins tests", (it) => {
            it.effect("Should see no plugins", () =>
                Effect.gen(function* () {
                    const plugins = yield* MobyEndpoints.Plugins;
                    const pluginsList = yield* plugins.list();
                    expect(pluginsList).toBeInstanceOf(Array);
                    expect(pluginsList).toHaveLength(0);
                })
            );

            it.effect.skip("Should pull a plugin", () =>
                Effect.gen(function* () {
                    const plugins = yield* MobyEndpoints.Plugins;
                    yield* plugins.pull("docker.io/grafana/loki-docker-driver:main", {
                        name: "test-plugin:latest",
                    });
                    yield* plugins.enable("test-plugin:latest");
                })
            );

            it.effect.skip("Should see one plugin", () =>
                Effect.gen(function* () {
                    const plugins = yield* MobyEndpoints.Plugins;
                    const pluginsList = yield* plugins.list();
                    expect(pluginsList).toBeInstanceOf(Array);
                    expect(pluginsList).toHaveLength(1);
                })
            );

            it.effect.skip("Should update a plugin", () =>
                Effect.gen(function* () {
                    const plugins = yield* MobyEndpoints.Plugins;
                    yield* plugins.upgrade({
                        remote: "docker.io/grafana/loki-docker-driver:main",
                        name: "test-plugin:latest",
                    });
                })
            );

            it.effect.skip("Should disable a plugin", () =>
                Effect.gen(function* () {
                    const plugins = yield* MobyEndpoints.Plugins;
                    yield* plugins.disable("test-plugin:latest");
                })
            );

            it.effect.skip("Should see no enabled plugins", () =>
                Effect.gen(function* () {
                    const plugins = yield* MobyEndpoints.Plugins;
                    const pluginsList = yield* plugins.list({ filters: { enable: ["true"] } });
                    expect(pluginsList).toBeInstanceOf(Array);
                    expect(pluginsList).toHaveLength(0);
                })
            );
        });
    }
);
