import { describe, inject, it } from "@effect/vitest";

import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as MobyApi from "the-moby-effect/Moby";

describe("MobyApi Networks tests", () => {
    const testNetworksService: Layer.Layer<MobyApi.Networks.Networks, never, never> = MobyApi.fromConnectionOptions(
        inject("__TEST_CONNECTION_OPTIONS")
    ).pipe(Layer.orDie);

    it("Should list all the networks", async () => {
        await Effect.gen(function* () {
            const networks: MobyApi.Networks.Networks = yield* MobyApi.Networks.Networks;
            yield* networks.list();
        })
            .pipe(Effect.provide(testNetworksService))
            .pipe(Effect.runPromise);
    });
});
