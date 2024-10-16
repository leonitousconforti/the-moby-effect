import { expect, layer } from "@effect/vitest";
import { Effect, Layer } from "effect";
import { Distributions } from "the-moby-effect/Endpoints";
import { testLayer } from "./shared.js";

layer(Layer.fresh(testLayer))("MobyApi Distribution tests", (it) => {
    it.effect("Should inspect an image", () =>
        Effect.gen(function* () {
            const distribution = yield* Distributions;
            const testData = yield* distribution.inspect({ name: "docker.io/library/docker:dind" });
            expect(testData.Platforms).toBeInstanceOf(Array);
            expect(testData.Platforms).toHaveLength(8);
            expect(testData.Descriptor?.mediaType).toBe("application/vnd.oci.image.index.v1+json");
        })
    );
});
