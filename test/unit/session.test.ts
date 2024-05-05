import { describe, expect, inject, it } from "@effect/vitest";

import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as MobyApi from "the-moby-effect/Moby";

describe("MobyApi Session tests", () => {
    const testSessionService: Layer.Layer<MobyApi.Sessions.Sessions, never, never> = MobyApi.fromConnectionOptions(
        inject("__TEST_CONNECTION_OPTIONS")
    ).pipe(Layer.orDie);

    it("Should be able to request a session", async () => {
        const socket = await Effect.runPromise(
            Effect.provide(
                Effect.flatMap(MobyApi.Sessions.Sessions, (sessions) => sessions.session()),
                testSessionService
            ).pipe(Effect.scoped)
        );
        expect(socket).toBeDefined();
    });
});
