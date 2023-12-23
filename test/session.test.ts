import { Effect, Layer } from "effect";

import * as MobyApi from "../src/index.js";
import { cooldown, warmup } from "./helpers.js";

let dindContainerId: string = undefined!;
let testSessionService: Layer.Layer<never, never, MobyApi.Sessions.Sessions> = undefined!;

describe("MobyApi Session tests", () => {
    afterAll(async () => await cooldown(dindContainerId), 30_000);
    beforeAll(async () => {
        [dindContainerId, testSessionService] = await warmup(MobyApi.Sessions.fromConnectionOptions);
    }, 30_000);

    it("Should be able to request a session", async () => {
        const socket = await Effect.runPromise(
            Effect.provide(
                Effect.flatMap(MobyApi.Sessions.Sessions, (sessions) => sessions.session()),
                testSessionService
            )
        );
        expect(socket).toBeDefined();
    });
});
