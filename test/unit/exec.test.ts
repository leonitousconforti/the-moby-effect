import { describe, it } from "@effect/vitest";

import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as MobyApi from "the-moby-effect/Moby";

describe("MobyApi Exec tests", () => {
    const testExecsService: Layer.Layer<never, never, MobyApi.Execs.Execs> = MobyApi.fromConnectionOptions(
        globalThis.__TEST_CONNECTION_OPTIONS
    ).pipe(Layer.orDie);

    it("Should do something", async () => {
        await Effect.gen(function* (_: Effect.Adapter) {})
            .pipe(Effect.provide(testExecsService))
            .pipe(Effect.runPromise);
    });
});
