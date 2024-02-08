import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as MobyApi from "../../src/index.js";

describe("MobyApi Distribution tests", () => {
    const testDistributionsService: Layer.Layer<never, never, MobyApi.Distributions.Distributions> = MobyApi.fromUrl(
        globalThis.__THE_MOBY_EFFECT_TEST_URL
    ).pipe(Layer.orDie);

    it("Should inspect an image", async () => {
        const testData: Readonly<MobyApi.Schemas.DistributionInspect> = await Effect.runPromise(
            Effect.provide(
                Effect.flatMap(MobyApi.Distributions.Distributions, (distributions) =>
                    distributions.inspect({ name: "docker.io/library/docker:dind" })
                ),
                testDistributionsService
            )
        );
        expect(testData.Platforms).toBeInstanceOf(Array);
        expect(testData.Platforms).toHaveLength(8);
        expect(testData.Descriptor?.mediaType).toBe("application/vnd.oci.image.index.v1+json");
    });
});
