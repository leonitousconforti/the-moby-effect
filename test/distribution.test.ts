import { expect, layer } from "@effect/vitest";
import { Effect, Layer } from "effect";
import * as Distribution from "the-moby-effect/endpoints/Distribution";
import { testLayer } from "./shared.js";

layer(Layer.fresh(testLayer))("MobyApi Distribution tests", (it) => {
    it.effect("Should inspect an image", () =>
        Effect.gen(function* () {
            const distribution = yield* Distribution.Distributions;
            const testData = yield* distribution.inspect({ name: "docker.io/library/docker:dind" });
            expect(testData.Platforms).toBeInstanceOf(Array);
            expect(testData.Platforms).toHaveLength(8);
            expect(testData.Descriptor?.mediaType).toBe("application/vnd.oci.image.index.v1+json");
        })
    );
});
