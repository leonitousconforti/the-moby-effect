import { inject, layer } from "@effect/vitest";
import { Duration, Effect, Layer } from "effect";
import { Sessions } from "the-moby-effect/MobyEndpoints";
import { testLayer } from "./shared.js";

layer(Layer.fresh(testLayer), { timeout: Duration.minutes(2) })("MobyApi Session tests", (it) => {
    it.scoped.skipIf(inject("__PLATFORM_VARIANT").includes("undici"))("Should be able to request a session", () =>
        Effect.gen(function* () {
            const sessions = yield* Sessions;
            yield* sessions.session();
        })
    );
});
