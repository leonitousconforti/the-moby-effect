import { expect, layer } from "@effect/vitest";
import { Effect, Layer } from "effect";
import * as Nodes from "the-moby-effect/endpoints/Nodes";
import { testLayer } from "./shared.js";

layer(Layer.fresh(testLayer))("MobyApi Nodes tests", (it) => {
    it("Should see and inspect one node", () =>
        Effect.gen(function* () {
            const nodes = yield* Nodes.Nodes;
            const nodesList = yield* nodes.list();
            expect(nodesList).toBeInstanceOf(Array);
            expect(nodesList).toHaveLength(1);
            yield* nodes.inspect({ id: nodesList[0]!.ID! });
        }));
});
