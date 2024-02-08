import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as MobyApi from "../../src/index.js";

describe("MobyApi Session tests", () => {
    const testSessionService: Layer.Layer<never, never, MobyApi.Sessions.Sessions> = MobyApi.fromUrl(
        globalThis.__THE_MOBY_EFFECT_TEST_URL
    ).pipe(Layer.orDie);

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
