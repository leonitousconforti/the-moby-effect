import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";

import * as MobyApi from "../src/index.js";
import { AfterAll, BeforeAll, testEngines } from "./helpers.js";

let dindContainerId: string = undefined!;
let dindStorageVolumeName: string = undefined!;
let testSwarmService: Layer.Layer<never, never, MobyApi.Swarm.Swarms> = undefined!;

describe.each(testEngines)("MobyApi Swarm tests", (image) => {
    afterAll(async () => await AfterAll(dindContainerId, dindStorageVolumeName), 30_000);
    beforeAll(async () => {
        [dindContainerId, dindStorageVolumeName, testSwarmService] = await BeforeAll(
            image,
            MobyApi.Swarm.fromConnectionOptions
        );
    }, 30_000);

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
