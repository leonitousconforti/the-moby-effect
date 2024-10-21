import { expect, layer } from "@effect/vitest";
import { Effect, Layer } from "effect";
import { Swarm } from "the-moby-effect/MobyEndpoints";
import { testLayer } from "./shared.js";

layer(Layer.fresh(testLayer))("MobyApi Swarm tests", (it) => {
    it.effect("Should leave, rejoin, unlock, update, and get the unlock key of the swarm", () =>
        Effect.gen(function* () {
            const swarm = yield* Swarm;
            const inspect = yield* swarm.inspect();

            const spec = inspect.Spec;
            const version = inspect.Version;
            expect(inspect).toBeDefined();
            expect(spec).toBeDefined();
            expect(version).toBeDefined();
            expect(version!.Index).toBeDefined();

            yield* swarm.update({
                spec: spec!,
                version: version!.Index!,
                rotateWorkerToken: true,
                rotateManagerToken: true,
                rotateManagerUnlockKey: true,
            });

            const { UnlockKey } = yield* swarm.unlockkey();
            expect(UnlockKey).toBeDefined();
        })
    );
});
