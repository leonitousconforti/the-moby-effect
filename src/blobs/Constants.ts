/**
 * Docker content constants
 *
 * @since 1.0.0
 */

/**
 * @since 1.0.0
 * @category Constants
 * @internal
 */
export const DefaultDindBaseImage: string = "docker.io/library/docker:dind" as const;

/**
 * @since 1.0.0
 * @category Constants
 * @internal
 */
export type RecommendedDindBaseImages =
    | "docker.io/library/docker:23-dind"
    | "docker.io/library/docker:24-dind"
    | "docker.io/library/docker:25-dind"
    | "docker.io/library/docker:26-dind"
    | "docker.io/library/docker:27-dind";
