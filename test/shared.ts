import { Array, Function, Match } from "effect";
import type { MobyConnection } from "the-moby-effect";
import type { RecommendedDindBaseImages } from "../src/internal/blobs/constants.js";

import { inject } from "@effect/vitest";
import { DindEngine } from "the-moby-effect";

export const makePlatformDindLayer = Function.pipe(
    Match.value(inject("__PLATFORM_VARIANT")),
    Match.when("bun", () => DindEngine.layerBun),
    Match.when("deno", () => DindEngine.layerDeno),
    Match.whenOr("node-18.x", "node-20.x", "node-22.x", () => DindEngine.layerNodeJS),
    Match.whenOr("node-20.x-undici", "node-22.x-undici", "deno-undici", "bun-undici", () => DindEngine.layerUndici),
    Match.orElse(() => DindEngine.layerNodeJS)
);

export const testMatrix: Array<{
    dindBaseImage: RecommendedDindBaseImages;
    exposeDindContainerBy: MobyConnection.MobyConnectionOptions["_tag"];
}> = Array.cartesianWith(
    Array.make("socket" as const, "http" as const, "https" as const, "ssh" as const),
    Array.make(
        "docker.io/library/docker:dind-rootless" as const,
        "docker.io/library/docker:23-dind-rootless" as const,
        "docker.io/library/docker:24-dind-rootless" as const,
        "docker.io/library/docker:25-dind-rootless" as const,
        "docker.io/library/docker:26-dind-rootless" as const,
        "docker.io/library/docker:27-dind-rootless" as const,
        "docker.io/library/docker:28-dind-rootless" as const
    ),
    (exposeDindContainerBy, dindBaseImage) => ({ dindBaseImage, exposeDindContainerBy })
);
