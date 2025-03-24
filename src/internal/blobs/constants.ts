/**
 * Docker content constants
 *
 * @since 1.0.0
 */

/**
 * @since 1.0.0
 * @category Constants
 */
export const DefaultDindBaseImage: RecommendedDindBaseImages = "docker.io/library/docker:dind-rootless" as const;

/**
 * @since 1.0.0
 * @category Constants
 */
export type RecommendedDindBaseImages =
    | "docker.io/library/docker:dind-rootless"
    | "docker.io/library/docker:23-dind-rootless"
    | "docker.io/library/docker:24-dind-rootless"
    | "docker.io/library/docker:25-dind-rootless"
    | "docker.io/library/docker:26-dind-rootless"
    | "docker.io/library/docker:27-dind-rootless"
    | "docker.io/library/docker:28-dind-rootless";
