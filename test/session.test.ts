import { Effect, Layer } from "effect";

import * as MobyApi from "../src/index.js";
import { AfterAll, BeforeAll } from "./helpers.js";

let dindContainerId: string = undefined!;
let testSessionService: Layer.Layer<never, never, MobyApi.Sessions.Sessions> = undefined!;

describe.each(["20-dind", "23-dind", "24-dind", "25-rc-dind", "dind"])("MobyApi Session tests", (dindTag) => {
    afterAll(async () => await AfterAll(dindContainerId), 30_000);
    beforeAll(async () => {
        [dindContainerId, testSessionService] = await BeforeAll(dindTag, MobyApi.Sessions.fromConnectionOptions);
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
