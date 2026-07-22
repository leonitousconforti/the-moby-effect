import { Duration, Effect, Layer, Stream } from "effect";

import { NodeServices } from "@effect/platform-node";
import { describe, expect, layer } from "@effect/vitest";
import { MobyConnection, MobyEndpoints } from "the-moby-effect";

import { makePlatformDindLayer } from "./shared-file.js";
import { testMatrix } from "./shared-global.js";

describe.each(testMatrix)(
    "MobyApi Plugins tests for $exposeDindContainerBy+$dindBaseImage",
    ({ dindBaseImage, exposeDindContainerBy }) => {
        const testLayer = MobyConnection.connectionOptionsFromPlatformSystemSocketDefault.pipe(
            Effect.map((connectionOptionsToHost) =>
                makePlatformDindLayer({
                    dindBaseImage,
                    exposeDindContainerBy,
                    connectionOptionsToHost,
                })
            ),
            Layer.unwrap,
            Layer.provide(NodeServices.layer)
        );

        // Enabling a plugin requires the daemon to actually run the plugin
        // binary - grafana/loki-docker-driver only ships linux/amd64, and
        // even a plain `docker plugin install` of it fails on Docker Desktop
        // (dial unix .../loki.sock: no such file or directory). Linux only.
        const daemonCanRunPlugins = process.platform === "linux";

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

                it.effect.skipIf(!daemonCanRunPlugins)(
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
                                        Name: privileges[0]!.Name,
                                        Value: privileges[0]!.Value,
                                        Description: privileges[0]!.Description,
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

                it.effect.skipIf(!daemonCanRunPlugins)("Should see one plugin", () =>
                    Effect.gen(function* () {
                        const plugins = yield* MobyEndpoints.Plugins;
                        const pluginsList = yield* plugins.list();
                        expect(pluginsList).toBeInstanceOf(Array);
                        expect(pluginsList).toHaveLength(1);
                    })
                );

                it.effect.skipIf(!daemonCanRunPlugins)("Should disable a plugin", () =>
                    Effect.gen(function* () {
                        const plugins = yield* MobyEndpoints.Plugins;
                        yield* plugins.disable("test-plugin:latest");
                    })
                );

                it.effect.skipIf(!daemonCanRunPlugins)("Should update a plugin", () =>
                    Effect.gen(function* () {
                        const plugins = yield* MobyEndpoints.Plugins;
                        const privileges = yield* plugins.getPrivileges("docker.io/grafana/loki-docker-driver:main");
                        yield* plugins.upgrade("test-plugin:latest", "docker.io/grafana/loki-docker-driver:main", [
                            {
                                Name: privileges[0]!.Name,
                                Value: privileges[0]!.Value,
                                Description: privileges[0]!.Description,
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
