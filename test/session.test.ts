import { inject, layer } from "@effect/vitest";
import { Effect, Layer } from "effect";
import * as Sessions from "the-moby-effect/endpoints/Session";
import { testLayer } from "./shared.js";

layer(Layer.fresh(testLayer))("MobyApi Session tests", (it) => {
    it.scoped.skipIf(inject("__PLATFORM_VARIANT").includes("undici"))("Should be able to request a session", () =>
        Effect.gen(function* () {
            const sessions = yield* Sessions.Sessions;
            yield* sessions.session();
        })
    );
});
