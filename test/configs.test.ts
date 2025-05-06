import { NodeContext } from "@effect/platform-node";
import { describe, expect, layer } from "@effect/vitest";
import { Duration, Effect, Layer } from "effect";
import { MobyConnection, MobyEndpoints } from "the-moby-effect";
import { makePlatformDindLayer } from "./shared-file.js";
import { testMatrix } from "./shared-global.js";

describe.concurrent.each(testMatrix)(
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

        layer(testLayer, { timeout: Duration.minutes(2) })("MobyApi Configs tests", (it) => {
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
                        Data: Buffer.from("aaahhhhh").toString("base64"),
                        Labels: { testLabel: "test" },
                    });
                    expect(configCreateResponse.ID).toBeDefined();
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
                    yield* configs.update(id, {
                        version: configInspectResponse.Version!.Index!,
                        spec: { ...configInspectResponse.Spec, Labels: { testLabel: "test2" } },
                    });
                })
            );

            it.effect("Should see no configs with label testLabel=test", () =>
                Effect.gen(function* () {
                    const configs = yield* MobyEndpoints.Configs;
                    const configsListResponse = yield* configs.list({ filters: { label: { testLabel: "test" } } });
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
                    const id: string = configsListResponse[0]!.ID;
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
    }
);
