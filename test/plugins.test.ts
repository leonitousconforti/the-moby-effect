import { NodeContext } from "@effect/platform-node";
import { describe, expect, layer } from "@effect/vitest";
import { Duration, Effect, Layer, Stream } from "effect";
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

        layer(testLayer, { timeout: Duration.minutes(2) })((it) => {
            describe.sequential("MobyApi Plugins tests", () => {
                it.effect("Should see no plugins", () =>
                    Effect.gen(function* () {
                        const plugins = yield* MobyEndpoints.Plugins;
                        const pluginsList = yield* plugins.list();
                        expect(pluginsList).toBeInstanceOf(Array);
                        expect(pluginsList).toHaveLength(0);
                    })
                );

                it.effect(
                    "Should pull a plugin",
                    () =>
                        Effect.gen(function* () {
                            const plugins = yield* MobyEndpoints.Plugins;
                            const privileges = yield* plugins.getPrivileges(
                                "docker.io/grafana/loki-docker-driver:main"
                            );
                            expect(privileges).toBeInstanceOf(Array);
                            expect(privileges).toHaveLength(1);
                            const pull = plugins.pull("docker.io/grafana/loki-docker-driver:main", {
                                name: "test-plugin:latest",
                                privileges: [
                                    {
                                        Name: privileges[0].Name,
                                        Value: privileges[0].Value,
                                        Description: privileges[0].Description,
                                    },
                                ],
                            });
                            yield* Stream.runDrain(pull);
                            yield* plugins.enable("test-plugin:latest");
                        }),
                    {
                        timeout: Duration.minutes(1).pipe(Duration.toMillis),
                    }
                );

                it.effect("Should see one plugin", () =>
                    Effect.gen(function* () {
                        const plugins = yield* MobyEndpoints.Plugins;
                        const pluginsList = yield* plugins.list();
                        expect(pluginsList).toBeInstanceOf(Array);
                        expect(pluginsList).toHaveLength(1);
                    })
                );

                it.effect("Should disable a plugin", () =>
                    Effect.gen(function* () {
                        const plugins = yield* MobyEndpoints.Plugins;
                        yield* plugins.disable("test-plugin:latest");
                    })
                );

                it.effect("Should update a plugin", () =>
                    Effect.gen(function* () {
                        const plugins = yield* MobyEndpoints.Plugins;
                        const privileges = yield* plugins.getPrivileges("docker.io/grafana/loki-docker-driver:main");
                        yield* plugins.upgrade("test-plugin:latest", "docker.io/grafana/loki-docker-driver:main", [
                            {
                                Name: privileges[0].Name,
                                Value: privileges[0].Value,
                                Description: privileges[0].Description,
                            },
                        ]);
                    })
                );

                it.effect("Should see no enabled plugins", () =>
                    Effect.gen(function* () {
                        const plugins = yield* MobyEndpoints.Plugins;
                        const pluginsList = yield* plugins.list({ enabled: true });
                        expect(pluginsList).toBeInstanceOf(Array);
                        expect(pluginsList).toHaveLength(0);
                    })
                );
            });
        });
    }
);
