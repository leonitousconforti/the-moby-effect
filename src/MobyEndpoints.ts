/**
 * Moby endpoints.
 *
 * @since 1.0.0
 */

export {
    /**
     * Configs are application configurations that can be used by services.
     * Swarm mode must be enabled for these endpoints to work.
     *
     * @since 1.0.0
     * @category Layers
     * @see https://docs.docker.com/reference/api/engine/latest/#tag/Config
     */
    Configs,

    /**
     * @since 1.0.0
     * @category Errors
     */
    ConfigsError,

    /**
     * Configs are application configurations that can be used by services.
     * Swarm mode must be enabled for these endpoints to work.
     *
     * @since 1.0.0
     * @category Layers
     * @see https://docs.docker.com/reference/api/engine/latest/#tag/Config
     */
    ConfigsLayer,

    /**
     * @since 1.0.0
     * @category Errors
     */
    isConfigsError,
} from "./internal/endpoints/configs.js";

export {
    /**
     * @since 1.0.0
     * @category Layers
     * @see https://docs.docker.com/reference/api/engine/latest/#tag/Container
     */
    Containers,

    /**
     * @since 1.0.0
     * @category Errors
     */
    ContainersError,

    /**
     * @since 1.0.0
     * @category Layers
     * @see https://docs.docker.com/reference/api/engine/latest/#tag/Container
     */
    ContainersLayer,

    /**
     * @since 1.0.0
     * @category Errors
     */
    isContainersError,
} from "./internal/endpoints/containers.js";

export {
    /**
     * @since 1.0.0
     * @category Layers
     * @see https://docs.docker.com/engine/api/v1.45/#tag/Distribution
     */
    Distributions,

    /**
     * @since 1.0.0
     * @category Errors
     */
    DistributionsError,

    /**
     * @since 1.0.0
     * @category Layers
     * @see https://docs.docker.com/engine/api/v1.45/#tag/Distribution
     */
    DistributionsLayer,

    /**
     * @since 1.0.0
     * @category Errors
     */
    isDistributionsError,
} from "./internal/endpoints/distribution.js";

export {
    /**
     * @since 1.0.0
     * @category Layers
     * @see https://docs.docker.com/reference/api/engine/latest/#tag/Exec
     */
    Execs,

    /**
     * @since 1.0.0
     * @category Errors
     */
    ExecsError,

    /**
     * @since 1.0.0
     * @category Layers
     * @see https://docs.docker.com/reference/api/engine/latest/#tag/Exec
     */
    ExecsLayer,

    /**
     * @since 1.0.0
     * @category Errors
     */
    isExecsError,
} from "./internal/endpoints/execs.js";

export {
    /**
     * @since 1.0.0
     * @category Layers
     * @see https://docs.docker.com/reference/api/engine/latest/#tag/Image
     */
    Images,

    /**
     * @since 1.0.0
     * @category Errors
     */
    ImagesError,

    /**
     * @since 1.0.0
     * @category Layers
     * @see https://docs.docker.com/reference/api/engine/latest/#tag/Image
     */
    ImagesLayer,

    /**
     * @since 1.0.0
     * @category Errors
     */
    isImagesError,
} from "./internal/endpoints/images.js";

export {
    /**
     * @since 1.0.0
     * @category Layers
     * @see https://docs.docker.com/reference/api/engine/latest/#tag/Network
     */
    Networks,

    /**
     * @since 1.0.0
     * @category Layers
     * @see https://docs.docker.com/reference/api/engine/latest/#tag/Network
     */
    NetworksLayer,
    /**
     * @since 1.0.0
     * @category Layers
     * @see https://docs.docker.com/reference/api/engine/latest/#tag/Network
     */
    NetworksLayerLocalSocket,
} from "./internal/endpoints/networks.js";

export {
    /**
     * @since 1.0.0
     * @category Layers
     * @see https://docs.docker.com/engine/api/v1.45/#tag/Node
     */
    Nodes,
    /**
     * @since 1.0.0
     * @category Layers
     * @see https://docs.docker.com/engine/api/v1.45/#tag/Node
     */
    NodesLayer,
    /**
     * @since 1.0.0
     * @category Layers
     * @see https://docs.docker.com/engine/api/v1.45/#tag/Node
     */
    NodesLayerLocalSocket,
} from "./internal/endpoints/nodes.js";

export {
    /**
     * @since 1.0.0
     * @category Errors
     */
    isPluginsError,

    /**
     * @since 1.0.0
     * @category Layers
     * @see https://docs.docker.com/engine/api/v1.45/#tag/Plugin
     */
    Plugins,

    /**
     * @since 1.0.0
     * @category Errors
     */
    PluginsError,

    /**
     * @since 1.0.0
     * @category Layers
     * @see https://docs.docker.com/engine/api/v1.45/#tag/Plugin
     */
    PluginsLayer,
} from "./internal/endpoints/plugins.js";

export {
    /**
     * Secrets are sensitive data that can be used by services. Swarm mode must
     * be enabled for these endpoints to work.
     *
     * @since 1.0.0
     * @category Layers
     * @see https://docs.docker.com/reference/api/engine/latest/#tag/Secret
     */
    Secrets,

    /**
     * Secrets are sensitive data that can be used by services. Swarm mode must
     * be enabled for these endpoints to work.
     *
     * @since 1.0.0
     * @category Layers
     * @see https://docs.docker.com/reference/api/engine/latest/#tag/Secret
     */
    SecretsLayer,
    /**
     * @since 1.0.0
     * @category Layers
     * @see https://docs.docker.com/reference/api/engine/latest/#tag/Secret
     */
    SecretsLayerLocalSocket,
} from "./internal/endpoints/secrets.js";

export {
    /**
     * @since 1.0.0
     * @category Errors
     */
    isServicesError,

    /**
     * Services are the definitions of tasks to run on a swarm. Swarm mode must
     * be enabled for these endpoints to work.
     *
     * @since 1.0.0
     * @category Layers
     * @see https://docs.docker.com/reference/api/engine/latest/#tag/Service
     */
    Services,

    /**
     * @since 1.0.0
     * @category Errors
     */
    ServicesError,

    /**
     * Services are the definitions of tasks to run on a swarm. Swarm mode must
     * be enabled for these endpoints to work.
     *
     * @since 1.0.0
     * @category Layers
     * @see https://docs.docker.com/reference/api/engine/latest/#tag/Service
     */
    ServicesLayer,
} from "./internal/endpoints/services.js";

export {
    /**
     * @since 1.0.0
     * @category Errors
     */
    isSessionsError,

    /**
     * @since 1.0.0
     * @category Layers
     * @see https://docs.docker.com/reference/api/engine/latest/#tag/Session
     */
    Sessions,

    /**
     * @since 1.0.0
     * @category Errors
     */
    SessionsError,

    /**
     * @since 1.0.0
     * @category Layers
     * @see https://docs.docker.com/reference/api/engine/latest/#tag/Session
     */
    SessionsLayer,
} from "./internal/endpoints/session.js";

export {
    /**
     * Engines can be clustered together in a swarm. Refer to the swarm mode
     * documentation for more information.
     *
     * @since 1.0.0
     * @category Layers
     * @see https://docs.docker.com/reference/api/engine/latest/#tag/Swarm
     */
    Swarm,

    /**
     * Engines can be clustered together in a swarm. Refer to the swarm mode
     * documentation for more information.
     *
     * @since 1.0.0
     * @category Layers
     * @see https://docs.docker.com/reference/api/engine/latest/#tag/Swarm
     */
    SwarmLayer,
    /**
     * @since 1.0.0
     * @category Layers
     * @see https://docs.docker.com/reference/api/engine/latest/#tag/Swarm
     */
    SwarmLayerLocalSocket,
} from "./internal/endpoints/swarm.js";

export {
    /**
     * @since 1.0.0
     * @category Errors
     */
    isSystemsError,

    /**
     * @since 1.0.0
     * @category Layers
     * @see https://docs.docker.com/reference/api/engine/latest/#tag/System
     */
    Systems,

    /**
     * @since 1.0.0
     * @category Errors
     */
    SystemsError,

    /**
     * @since 1.0.0
     * @category Layers
     * @see https://docs.docker.com/reference/api/engine/latest/#tag/System
     */
    SystemsLayer,
} from "./internal/endpoints/system.js";

export {
    /**
     * A task is a container running on a swarm. It is the atomic scheduling
     * unit of swarm. Swarm mode must be enabled for these endpoints to work.
     *
     * @since 1.0.0
     * @category Layers
     * @see https://docs.docker.com/reference/api/engine/latest/#tag/Task
     */
    Tasks,

    /**
     * A task is a container running on a swarm. It is the atomic scheduling
     * unit of swarm. Swarm mode must be enabled for these endpoints to work.
     *
     * @since 1.0.0
     * @category Layers
     * @see https://docs.docker.com/reference/api/engine/latest/#tag/Task
     */
    TasksLayer,
    /**
     * @since 1.0.0
     * @category Layers
     * @see https://docs.docker.com/reference/api/engine/latest/#tag/Task
     */
    TasksLayerLocalSocket,
} from "./internal/endpoints/tasks.js";

export {
    /**
     * @since 1.0.0
     * @category Errors
     */
    isVolumesError,

    /**
     * @since 1.0.0
     * @category Layers
     * @see https://docs.docker.com/reference/api/engine/latest/#tag/Volume
     */
    Volumes,

    /**
     * @since 1.0.0
     * @category Errors
     */
    VolumesError,

    /**
     * @since 1.0.0
     * @category Layers
     * @see https://docs.docker.com/reference/api/engine/latest/#tag/Volume
     */
    VolumesLayer,
} from "./internal/endpoints/volumes.js";
