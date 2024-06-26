import { describe, inject, it } from "@effect/vitest";

import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as MobyApi from "the-moby-effect/Moby";

describe("MobyApi Exec tests", () => {
    const testExecsService: Layer.Layer<MobyApi.Execs.Execs, never, never> = MobyApi.fromConnectionOptions(
        inject("__TEST_CONNECTION_OPTIONS")
    ).pipe(Layer.orDie);

    it("Should do something", async () => {
        await Effect.gen(function* () {})
            .pipe(Effect.provide(testExecsService))
            .pipe(Effect.runPromise);
    });
});
