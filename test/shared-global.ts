import { Array, pipe } from "effect";

import type { RecommendedDindBaseImages } from "../src/internal/blobs/constants.js";
import type { MobyConnection } from "the-moby-effect";

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
    ),
    // https://github.com/docker/desktop-feedback/issues/303
    Array.filter(({ exposeDindContainerBy }) => exposeDindContainerBy !== "socket" || process.platform === "linux"),
    // The bun layer delegates ssh connections to the node http layer through
    // bun's node compat, which starts refusing ssh tunnels after a few combos
    // on ci - every later dind bootstrap then eats its full layer timeout and
    // the job dies. The other transports use bun's native fetch and work.
    Array.filter(
        ({ exposeDindContainerBy }) => exposeDindContainerBy !== "ssh" || process.env["__PLATFORM_VARIANT"] !== "bun"
    )
);
