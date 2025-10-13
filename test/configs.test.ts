import { NodeContext } from "@effect/platform-node";
import { describe, expect, layer } from "@effect/vitest";
import { Context, Duration, Effect, Layer } from "effect";
import { MobyConnection, MobyEndpoints } from "the-moby-effect";
import { makePlatformDindLayer } from "./shared-file.js";
import { testMatrix } from "./shared-global.js";

describe.each(testMatrix)(
    "MobyApi Configs tests for $exposeDindContainerBy+$dindBaseImage",
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

        const withSwarmEnabled = Layer.tap(testLayer, (context) => {
            const swarm = Context.get(context, MobyEndpoints.Swarm);
            return swarm.init();
        });

        layer(withSwarmEnabled, { timeout: Duration.minutes(2) })((it) => {
            describe.sequential("MobyApi Configs tests", () => {
                it.effect("Should see no configs", () =>
                    Effect.gen(function* () {
                        const configs = yield* MobyEndpoints.Configs;
                        const configsListResponse = yield* configs.list();
                        expect(configsListResponse).toBeInstanceOf(Array);
                        expect(configsListResponse).toHaveLength(0);
                    })
                );

                it.effect("Should create a config", () =>
                    Effect.gen(function* () {
                        const configs = yield* MobyEndpoints.Configs;
                        const configCreateResponse = yield* configs.create({
                            Name: "testConfig",
                            Data: Buffer.from("aaahhhhh"),
                            Labels: { testLabel: "test" },
                        });
                        expect(configCreateResponse.Id).toBeDefined();
                    })
                );

                it.effect("Should see one config", () =>
                    Effect.gen(function* () {
                        const configs = yield* MobyEndpoints.Configs;
                        const configsListResponse = yield* configs.list();
                        expect(configsListResponse).toBeInstanceOf(Array);
                        expect(configsListResponse).toHaveLength(1);
                    })
                );

                it.effect("Should update a config", () =>
                    Effect.gen(function* () {
                        const configs = yield* MobyEndpoints.Configs;
                        const configsListResponse = yield* configs.list();
                        expect(configsListResponse).toBeInstanceOf(Array);
                        expect(configsListResponse).toHaveLength(1);
                        const id = configsListResponse[0]!.ID;
                        const configInspectResponse = yield* configs.inspect(id);
                        expect(configInspectResponse).toBeDefined();
                        expect(configInspectResponse.Spec).toBeDefined();
                        expect(configInspectResponse.Spec?.Labels).toBeDefined();
                        expect(configInspectResponse.Spec?.Labels?.["testLabel"]).toBe("test");
                        yield* configs.update(id, configInspectResponse.Version!.Index!, {
                            ...configInspectResponse.Spec,
                            Labels: { testLabel: "test2" },
                        });
                    })
                );

                it.effect("Should see no configs with label testLabel=test", () =>
                    Effect.gen(function* () {
                        const configs = yield* MobyEndpoints.Configs;
                        const configsListResponse = yield* configs.list({ label: ["testLabel=test"] });
                        expect(configsListResponse).toBeInstanceOf(Array);
                        expect(configsListResponse).toHaveLength(0);
                    })
                );

                it.effect("Should delete a config", () =>
                    Effect.gen(function* () {
                        const configs = yield* MobyEndpoints.Configs;
                        const configsListResponse = yield* configs.list();
                        expect(configsListResponse).toBeInstanceOf(Array);
                        expect(configsListResponse).toHaveLength(1);
                        const id = configsListResponse[0]!.ID;
                        yield* configs.delete(id);
                    })
                );

                it.effect("Should see no configs", () =>
                    Effect.gen(function* () {
                        const configs = yield* MobyEndpoints.Configs;
                        const configsListResponse = yield* configs.list();
                        expect(configsListResponse).toHaveLength(0);
                    })
                );
            });
        });
    }
);
