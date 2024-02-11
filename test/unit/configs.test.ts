import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as MobyApi from "../../src/index.js";

describe("MobyApi Configs tests", () => {
    const testConfigsService: Layer.Layer<never, never, MobyApi.Configs.Configs> = MobyApi.fromConnectionOptions(
        globalThis.__TEST_CONNECTION_OPTIONS
    ).pipe(Layer.orDie);
    const testSwarmsService: Layer.Layer<never, never, MobyApi.Swarm.Swarms> = MobyApi.fromConnectionOptions(
        globalThis.__TEST_CONNECTION_OPTIONS
    ).pipe(Layer.orDie);

    beforeAll(async () =>
        Effect.provide(
            Effect.flatMap(MobyApi.Swarm.Swarms, (swarm) => swarm.init({ ListenAddr: "eth0" })),
            testSwarmsService
        ).pipe(Effect.runPromise)
    );

    afterAll(async () =>
        Effect.provide(
            Effect.flatMap(MobyApi.Swarm.Swarms, (swarm) => swarm.leave({ force: true })),
            testSwarmsService
        ).pipe(Effect.runPromise)
    );

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
