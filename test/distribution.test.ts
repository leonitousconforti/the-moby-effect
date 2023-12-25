import { Effect, Layer } from "effect";

import * as MobyApi from "../src/index.js";
import { AfterAll, BeforeAll } from "./helpers.js";

let dindContainerId: string = undefined!;
let testDistributionsService: Layer.Layer<never, never, MobyApi.Distributions.Distributions> = undefined!;

describe("MobyApi Distribution tests", () => {
    afterAll(async () => await AfterAll(dindContainerId), 30_000);
    beforeAll(async () => {
        [dindContainerId, testDistributionsService] = await BeforeAll(MobyApi.Distributions.fromConnectionOptions);
    }, 30_000);

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
