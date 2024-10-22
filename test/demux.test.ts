import { layer } from "@effect/vitest";
import { Duration, Effect, Layer } from "effect";
import { testLayer } from "./shared.js";

layer(Layer.fresh(testLayer), { timeout: Duration.minutes(2) })("MobyApi Demux tests", (it) => {
    it.effect("Should inspect an image", () => Effect.gen(function* () {}));
});
