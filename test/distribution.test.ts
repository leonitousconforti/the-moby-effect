import { Duration, Effect, Layer } from "effect";

import { NodeServices } from "@effect/platform-node";
import { describe, expect, layer } from "@effect/vitest";
import { MobyConnection, MobyEndpoints } from "the-moby-effect";

import { makePlatformDindLayer } from "./shared-file.js";
import { testMatrix } from "./shared-global.js";

describe.each(testMatrix)(
    "MobyApi Distributions tests for $exposeDindContainerBy+$dindBaseImage",
    ({ dindBaseImage, exposeDindContainerBy }) => {
        const testLayer = MobyConnection.connectionOptionsFromPlatformSystemSocketDefault.pipe(
            Effect.map((connectionOptionsToHost) =>
                makePlatformDindLayer({
                    dindBaseImage,
                    exposeDindContainerBy,
                    connectionOptionsToHost,
                })
            ),
            Layer.unwrap,
            Layer.provide(NodeServices.layer)
        );

        layer(testLayer, { timeout: Duration.minutes(2) })("MobyApi Distribution tests", (it) => {
            it.effect("Should inspect an image", () =>
                Effect.gen(function* () {
                    const distribution = yield* MobyEndpoints.Distributions;
                    const testData = yield* distribution.inspect("docker.io/library/docker:dind");
                    expect(testData.Platforms).toBeInstanceOf(Array);
                    expect(testData.Platforms).toHaveLength(8);
                    expect(testData.Descriptor?.mediaType).toBe("application/vnd.oci.image.index.v1+json");
                })
            );
        });
    }
);
