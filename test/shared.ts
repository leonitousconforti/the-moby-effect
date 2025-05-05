import type { Array } from "effect";
import type { MobyConnection } from "the-moby-effect";
import type { RecommendedDindBaseImages } from "../src/internal/blobs/constants.js";

import { inject } from "@effect/vitest";
import { Function, Match } from "effect";
import { DindEngine } from "the-moby-effect";

export const makePlatformDindLayer = Function.pipe(
    Match.value(inject("__PLATFORM_VARIANT")),
    Match.when("bun", () => DindEngine.layerBun),
    Match.when("deno", () => DindEngine.layerDeno),
    Match.whenOr("node-18.x", "node-20.x", "node-22.x", () => DindEngine.layerNodeJS),
    Match.whenOr("node-20.x-undici", "node-22.x-undici", "deno-undici", "bun-undici", () => DindEngine.layerUndici),
    Match.orElse(() => DindEngine.layerNodeJS)
);

export const testMatrix = [
    {
        exposeDindContainerBy: "socket" as const,
        dindBaseImage: "docker.io/library/docker:dind-rootless",
    },
] as Array.NonEmptyReadonlyArray<{
    dindBaseImage: RecommendedDindBaseImages;
    exposeDindContainerBy: MobyConnection.MobyConnectionOptions["_tag"];
}>;

// export const testLayer: Layer.Layer<
//     Layer.Layer.Success<DockerEngine.DockerLayer>,
//     | MobyEndpoints.ContainersError
//     | MobyEndpoints.ImagesError
//     | MobyEndpoints.SwarmsError
//     | MobyEndpoints.SystemsError
//     | MobyEndpoints.VolumesError
//     | ParseResult.ParseError
//     | PlatformError.PlatformError,
//     never
// > = Layer.tap(Layer.provide(testDindLayer, testServices), (context) => {
//     const swarm = Context.get(context, MobyEndpoints.Swarm);
//     return swarm.init({ ListenAddr: "0.0.0.0" });
// });
