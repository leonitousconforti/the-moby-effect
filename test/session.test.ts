import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";

import * as MobyApi from "../src/index.js";
import { AfterAll, BeforeAll, testEngines } from "./helpers.js";

let dindContainerId: string = undefined!;
let dindStorageVolumeName: string = undefined!;
let testSessionService: Layer.Layer<never, never, MobyApi.Sessions.Sessions> = undefined!;

describe.each(testEngines)("MobyApi Session tests", (image) => {
    afterAll(async () => await AfterAll(dindContainerId, dindStorageVolumeName), 30_000);
    beforeAll(async () => {
        [dindContainerId, dindStorageVolumeName, testSessionService] = await BeforeAll(
            image,
            MobyApi.Sessions.fromConnectionOptions
        );
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
