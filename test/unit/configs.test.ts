import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";

import * as MobyApi from "../../src/index.js";
import { AfterAll, BeforeAll, testEngines } from "./helpers.js";

let dindContainerId: string = undefined!;
let dindStorageVolumeName: string = undefined!;
let testConfigsService: Layer.Layer<never, never, MobyApi.Configs.Configs> = undefined!;

describe.each(testEngines)("MobyApi Configs tests", (image) => {
    afterAll(async () => await AfterAll(dindContainerId, dindStorageVolumeName), 30_000);
    beforeAll(async () => {
        [dindContainerId, dindStorageVolumeName, testConfigsService] = await BeforeAll(
            image,
            MobyApi.Configs.fromConnectionOptions
        );
    }, 30_000);

    it("Should see no configs", async () => {
        const configs: Readonly<MobyApi.Schemas.Config[]> = await Effect.runPromise(
            Effect.provide(
                Effect.flatMap(MobyApi.Configs.Configs, (configs) => configs.list()),
                testConfigsService
            )
        );
        expect(configs).toHaveLength(0);
    });

    it("Should create a config", async () => {
        const configCreateResponse: Readonly<MobyApi.Schemas.IDResponse> = await Effect.runPromise(
            Effect.provide(
                Effect.flatMap(MobyApi.Configs.Configs, (configs) =>
                    configs.create({
                        Name: "testConfig",
                        Data: Buffer.from("aaahhhhh").toString("base64"),
                        Labels: { testLabel: "test" },
                    })
                ),
                testConfigsService
            )
        );
        expect(configCreateResponse.ID).toBeDefined();
    });

    it("Should see one config", async () => {
        const configs: readonly MobyApi.Schemas.Config[] = await Effect.runPromise(
            Effect.provide(
                Effect.flatMap(MobyApi.Configs.Configs, (configs) => configs.list()),
                testConfigsService
            )
        );
        expect(configs).toBeInstanceOf(Array);
        expect(configs).toHaveLength(1);
    });

    it("Should update a config", async () => {
        const configs: readonly MobyApi.Schemas.Config[] = await Effect.runPromise(
            Effect.provide(
                Effect.flatMap(MobyApi.Configs.Configs, (configs) => configs.list()),
                testConfigsService
            )
        );
        expect(configs).toBeInstanceOf(Array);
        expect(configs).toHaveLength(1);

        const id: string = configs[0]!.ID!;
        const configInspectResponse: Readonly<MobyApi.Schemas.Config> = await Effect.runPromise(
            Effect.provide(
                Effect.flatMap(MobyApi.Configs.Configs, (configs) => configs.inspect({ id })),
                testConfigsService
            )
        );
        expect(configInspectResponse).toBeDefined();
        expect(configInspectResponse.Spec).toBeDefined();
        expect(configInspectResponse.Spec?.Labels).toBeDefined();
        expect(configInspectResponse.Spec?.Labels?.["testLabel"]).toBe("test");

        await Effect.runPromise(
            Effect.provide(
                Effect.flatMap(MobyApi.Configs.Configs, (configs) =>
                    configs.update({
                        id,
                        version: configInspectResponse.Version!.Index!,
                        spec: { ...configInspectResponse.Spec, Labels: { testLabel: "test2" } },
                    })
                ),
                testConfigsService
            )
        );
    });

    it("Should see no configs with label testLabel=test", async () => {
        const configs: readonly MobyApi.Schemas.Config[] = await Effect.runPromise(
            Effect.provide(
                Effect.flatMap(MobyApi.Configs.Configs, (configs) =>
                    configs.list({ filters: { label: ["testLabel=test"] } })
                ),
                testConfigsService
            )
        );
        expect(configs).toBeInstanceOf(Array);
        expect(configs).toHaveLength(0);
    });

    it("Should delete a config", async () => {
        const configs: readonly MobyApi.Schemas.Config[] = await Effect.runPromise(
            Effect.provide(
                Effect.flatMap(MobyApi.Configs.Configs, (configs) => configs.list()),
                testConfigsService
            )
        );
        expect(configs).toBeInstanceOf(Array);
        expect(configs).toHaveLength(1);

        const id: string = configs[0]!.ID!;
        await Effect.runPromise(
            Effect.provide(
                Effect.flatMap(MobyApi.Configs.Configs, (configs) => configs.delete({ id })),
                testConfigsService
            )
        );
    });

    it("Should see no configs", async () => {
        const configs = await Effect.runPromise(
            Effect.provide(
                Effect.flatMap(MobyApi.Configs.Configs, (configs) => configs.list()),
                testConfigsService
            )
        );
        expect(configs).toHaveLength(0);
    });
});
