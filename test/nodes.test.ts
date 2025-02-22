import { expect, layer } from "@effect/vitest";
import { Duration, Effect, Layer } from "effect";
import { Nodes } from "the-moby-effect/MobyEndpoints";
import { testLayer } from "./shared.js";

layer(Layer.fresh(testLayer), { timeout: Duration.minutes(2) })("MobyApi Nodes tests", (it) => {
    it("Should see and inspect one node", () =>
        Effect.gen(function* () {
            const nodes = yield* Nodes;
            const nodesList = yield* nodes.list();
            expect(nodesList).toBeInstanceOf(Array);
            expect(nodesList).toHaveLength(1);
            yield* nodes.inspect(nodesList[0]!.ID);
        }));
});
