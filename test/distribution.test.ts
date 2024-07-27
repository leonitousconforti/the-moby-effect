import { afterAll, describe, expect, inject, it } from "@effect/vitest";

import * as Path from "@effect/platform/Path";
import * as Function from "effect/Function";
import * as Layer from "effect/Layer";
import * as ManagedRuntime from "effect/ManagedRuntime";
import * as Match from "effect/Match";

import * as Distribution from "the-moby-effect/endpoints/Distribution";
import * as DindEngine from "the-moby-effect/engines/Dind";

describe("MobyApi Distribution tests", () => {
    const makePlatformDindLayer = Function.pipe(
        Match.value(inject("__PLATFORM_VARIANT")),
        Match.when("bun", () => DindEngine.layerBun),
        Match.when("deno", () => DindEngine.layerDeno),
        Match.when("node", () => DindEngine.layerNodeJS),
        Match.whenOr("node-undici", "deno-undici", "bun-undici", () => DindEngine.layerUndici),
        Match.exhaustive
    );

    const testServices: DindEngine.DindLayer = makePlatformDindLayer({
        exposeDindContainerBy: inject("__CONNECTION_VARIANT"),
        connectionOptionsToHost: inject("__DOCKER_HOST_CONNECTION_OPTIONS"),
    });

    const testRuntime = ManagedRuntime.make(Layer.provide(testServices, Path.layer));
    afterAll(() => testRuntime.dispose().then(() => {}));

    it("Should inspect an image", async () => {
        const testData = await testRuntime.runPromise(
            Distribution.Distributions.inspect({ name: "docker.io/library/docker:dind" })
        );
        expect(testData.Platforms).toBeInstanceOf(Array);
        expect(testData.Platforms).toHaveLength(8);
        expect(testData.Descriptor?.mediaType).toBe("application/vnd.oci.image.index.v1+json");
    });
});
