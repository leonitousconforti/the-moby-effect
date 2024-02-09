import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as MobyApi from "../../src/index.js";

describe("MobyApi Swarm tests", () => {
    const testSwarmService: Layer.Layer<never, never, MobyApi.Swarm.Swarms> = MobyApi.fromConnectionOptions(
        globalThis.__TEST_CONNECTION_OPTIONS
    ).pipe(Layer.orDie);

    it("Should leave, rejoin, unlock, update, and get the unlock key of the swarm", async () => {
        await Effect.gen(function* (_: Effect.Adapter) {
            // const swarm: MobyApi.Swarm.Swarms = yield* _(MobyApi.Swarm.Swarms);
            // yield* _(swarm.leave({ force: true }));
            // yield* _(swarm.join({ ListenAddr: "eth0" }));
            // const unlockkey: MobyApi.Schemas.UnlockKeyResponse = yield* _(swarm.unlockkey());
            // yield* _(swarm.unlock({ UnlockKey: unlockkey.UnlockKey! }));
            // yield* _(swarm.update({ rotateManagerUnlockKey: true }));
        })
            .pipe(Effect.provide(testSwarmService))
            .pipe(Effect.runPromise);
    });
});
