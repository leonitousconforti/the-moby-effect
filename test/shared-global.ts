import type { MobyConnection } from "the-moby-effect";
import type { RecommendedDindBaseImages } from "../src/internal/blobs/constants.js";

import { Array, pipe } from "effect";

export const testMatrix: Array<{
    dindBaseImage: RecommendedDindBaseImages;
    exposeDindContainerBy: MobyConnection.MobyConnectionOptions["_tag"];
}> = pipe(
    Array.cartesian(
        Array.make("http" as const, "https" as const, "ssh" as const, "socket" as const),
        Array.make(
            "docker.io/library/docker:dind-rootless" as const,
            // "docker.io/library/docker:23-dind-rootless" as const
            // "docker.io/library/docker:24-dind-rootless" as const,
            // "docker.io/library/docker:25-dind-rootless" as const,
            "docker.io/library/docker:26-dind-rootless" as const,
            "docker.io/library/docker:27-dind-rootless" as const,
            "docker.io/library/docker:28-dind-rootless" as const
        )
    ),
    Array.map(([exposeDindContainerBy, dindBaseImage]) => ({ dindBaseImage, exposeDindContainerBy })),
    Array.filter(
        ({ dindBaseImage, exposeDindContainerBy }) =>
            !(
                exposeDindContainerBy === "https" &&
                (dindBaseImage === "docker.io/library/docker:28-dind-rootless" ||
                    dindBaseImage === "docker.io/library/docker:dind-rootless")
            )
    )
);
