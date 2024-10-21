import { layer } from "@effect/vitest";
import { Effect, Layer } from "effect";
import { Networks } from "the-moby-effect/MobyEndpoints";
import { testLayer } from "./shared.js";

layer(Layer.fresh(testLayer))("MobyApi Networks tests", (it) => {
    it.effect("Should list all the networks", () =>
        Effect.gen(function* () {
            const networks = yield* Networks;
            yield* networks.list();
        })
    );
});
