import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as MobyApi from "../../src/index.js";

describe("MobyApi Networks tests", () => {
    const testNetworksService: Layer.Layer<never, never, MobyApi.Networks.Networks> = MobyApi.fromConnectionOptions(
        globalThis.__TEST_CONNECTION_OPTIONS
    ).pipe(Layer.orDie);

    it("Should list all the networks", async () => {
        await Effect.gen(function* (_: Effect.Adapter) {
            const networks: MobyApi.Networks.Networks = yield* _(MobyApi.Networks.Networks);
            yield* _(networks.list());
        })
            .pipe(Effect.provide(testNetworksService))
            .pipe(Effect.runPromise);
    });
});
