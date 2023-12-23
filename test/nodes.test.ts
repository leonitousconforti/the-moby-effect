import { Effect, Layer } from "effect";

import * as MobyApi from "../src/index.js";
import { cooldown, warmup } from "./helpers.js";

let dindContainerId: string = undefined!;
let testNodesService: Layer.Layer<never, never, MobyApi.Nodes.Nodes> = undefined!;

describe("MobyApi Nodes tests", () => {
    afterAll(async () => await cooldown(dindContainerId), 30_000);
    beforeAll(async () => {
        [dindContainerId, testNodesService] = await warmup(MobyApi.Nodes.fromConnectionOptions);
    }, 30_000);

    it("Should see and inspect one node", async () => {
        const nodes: Readonly<MobyApi.Schemas.Node[]> = await Effect.runPromise(
            Effect.provide(
                Effect.flatMap(MobyApi.Nodes.Nodes, (nodes) => nodes.list()),
                testNodesService
            )
        );
        expect(nodes).toBeInstanceOf(Array);
        expect(nodes).toHaveLength(1);

        await Effect.runPromise(
            Effect.provide(
                Effect.flatMap(MobyApi.Nodes.Nodes, (_nodes) => _nodes.inspect({ id: nodes[0]!.ID! })),
                testNodesService
            )
        );
    });
});
