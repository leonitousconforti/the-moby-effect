import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as MobyApi from "../../src/index.js";

describe("MobyApi Nodes tests", () => {
    const testNodesService: Layer.Layer<never, never, MobyApi.Nodes.Nodes> = MobyApi.fromUrl(
        globalThis.__THE_MOBY_EFFECT_TEST_URL
    ).pipe(Layer.orDie);

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
