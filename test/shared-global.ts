import type { MobyConnection } from "the-moby-effect";
import type { RecommendedDindBaseImages } from "../src/internal/blobs/constants.js";

import { Array } from "effect";

export const testMatrix: Array<{
    dindBaseImage: RecommendedDindBaseImages;
    exposeDindContainerBy: MobyConnection.MobyConnectionOptions["_tag"];
}> = Array.map(
    Array.cartesian(
        Array.make("socket" as const, "http" as const, "https" as const, "ssh" as const),
        Array.make(
            "docker.io/library/docker:dind-rootless" as const,
            "docker.io/library/docker:23-dind-rootless" as const,
            "docker.io/library/docker:24-dind-rootless" as const,
            "docker.io/library/docker:25-dind-rootless" as const,
            "docker.io/library/docker:26-dind-rootless" as const,
            "docker.io/library/docker:27-dind-rootless" as const,
            "docker.io/library/docker:28-dind-rootless" as const
        )
    ),
    ([exposeDindContainerBy, dindBaseImage]) => ({ dindBaseImage, exposeDindContainerBy })
);
