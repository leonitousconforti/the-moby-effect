/**
 * Docker compose engine shortcut.
 *
 * @since 1.0.0
 */

export {
    /**
     * @since 1.0.0
     * @category Tags
     */
    DockerCompose,

    /**
     * @since 1.0.0
     * @category Errors
     */
    DockerComposeError,

    /**
     * @since 1.0.0
     * @category Errors
     */
    isDockerComposeError,

    /**
     * @since 1.0.0
     * @category Layers
     */
    layer,

    /**
     * @since 1.0.0
     * @category Layers
     */
    layerProject,

    /**
     * @since 1.0.0
     * @category Models
     */
    type DockerComposeProject,
} from "./internal/engines/dockerCompose.js";
