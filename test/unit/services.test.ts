import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as MobyApi from "../../src/index.js";

describe("MobyApi Services tests", () => {
    const testServicesService: Layer.Layer<never, never, MobyApi.Services.Services> = MobyApi.fromConnectionOptions(
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

    it("Should see no services", async () => {
        const services: Readonly<MobyApi.Schemas.Service[]> = await Effect.runPromise(
            Effect.provide(
                Effect.flatMap(MobyApi.Services.Services, (services) => services.list()),
                testServicesService
            )
        );
        expect(services).toBeInstanceOf(Array);
        expect(services).toHaveLength(0);
    });
});
