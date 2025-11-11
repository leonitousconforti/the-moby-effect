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
     * @category Services
     * @see https://docs.docker.com/reference/api/engine/latest/#tag/Config
     */
    Configs,

    /**
     * Configs are application configurations that can be used by services.
     * Swarm mode must be enabled for these endpoints to work.
     *
     * @since 1.0.0
     * @category HttpApi
     * @see https://docs.docker.com/reference/api/engine/latest/#tag/Config
     */
    ConfigsApi,

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
     * Configs are application configurations that can be used by services.
     * Swarm mode must be enabled for these endpoints to work.
     *
     * @since 1.0.0
     * @category Layers
     * @see https://docs.docker.com/reference/api/engine/latest/#tag/Config
     */
    ConfigsLayerLocalSocket,
} from "./internal/endpoints/configs.ts";

export {
    /**
     * @since 1.0.0
     * @category Services
     * @see https://docs.docker.com/reference/api/engine/latest/#tag/Container
     */
    Containers,

    /**
     * @since 1.0.0
     * @category HttpApi
     * @see https://docs.docker.com/reference/api/engine/latest/#tag/Container
     */
    ContainersApi,

    /**
     * @since 1.0.0
     * @category Layers
     * @see https://docs.docker.com/reference/api/engine/latest/#tag/Container
     */
    ContainersLayer,

    /**
     * @since 1.0.0
     * @category Layers
     * @see https://docs.docker.com/reference/api/engine/latest/#tag/Container
     */
    ContainersLayerLocalSocket,
} from "./internal/endpoints/containers.ts";

export {
    /**
     * @since 1.0.0
     * @category Services
     * @see https://docs.docker.com/reference/api/engine/latest/#tag/Distribution
     */
    Distributions,

    /**
     * @since 1.0.0
     * @category HttpApi
     * @see https://docs.docker.com/reference/api/engine/latest/#tag/Distribution
     */
    DistributionsApi,

    /**
     * @since 1.0.0
     * @category Layers
     * @see https://docs.docker.com/reference/api/engine/latest/#tag/Distribution
     */
    DistributionsLayer,

    /**
     * @since 1.0.0
     * @category Layers
     * @see https://docs.docker.com/reference/api/engine/latest/#tag/Distribution
     */
    DistributionsLayerLocalSocket,
} from "./internal/endpoints/distribution.ts";

export {
    /**
     * @since 1.0.0
     * @category Services
     * @see https://docs.docker.com/reference/api/engine/latest/#tag/Exec
     */
    Execs,

    /**
     * @since 1.0.0
     * @category HttpApi
     * @see https://docs.docker.com/reference/api/engine/latest/#tag/Exec
     */
    ExecsApi,

    /**
     * @since 1.0.0
     * @category Layers
     * @see https://docs.docker.com/reference/api/engine/latest/#tag/Exec
     */
    ExecsLayer,

    /**
     * @since 1.0.0
     * @category Layers
     * @see https://docs.docker.com/reference/api/engine/latest/#tag/Exec
     */
    ExecsLayerLocalSocket,
} from "./internal/endpoints/execs.ts";

export {
    /**
     * @since 1.0.0
     * @category Services
     * @see https://docs.docker.com/reference/api/engine/latest/#tag/Image
     */
    Images,

    /**
     * @since 1.0.0
     * @category HttpApi
     * @see https://docs.docker.com/reference/api/engine/latest/#tag/Image
     */
    ImagesApi,

    /**
     * @since 1.0.0
     * @category Layers
     * @see https://docs.docker.com/reference/api/engine/latest/#tag/Image
     */
    ImagesLayer,

    /**
     * @since 1.0.0
     * @category Layers
     * @see https://docs.docker.com/reference/api/engine/latest/#tag/Image
     */
    ImagesLayerLocalSocket,
} from "./internal/endpoints/images.ts";

export {
    /**
     * @since 1.0.0
     * @category Services
     * @see https://docs.docker.com/reference/api/engine/latest/#tag/Network
     */
    Networks,

    /**
     * @since 1.0.0
     * @category HttpApi
     * @see https://docs.docker.com/reference/api/engine/latest/#tag/Network
     */
    NetworksApi,

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
} from "./internal/endpoints/networks.ts";

export {
    /**
     * @since 1.0.0
     * @category Services
     * @see https://docs.docker.com/reference/api/engine/latest/#tag/Node
     */
    Nodes,

    /**
     * @since 1.0.0
     * @category HttpApi
     * @see https://docs.docker.com/reference/api/engine/latest/#tag/Node
     */
    NodesApi,

    /**
     * @since 1.0.0
     * @category Layers
     * @see https://docs.docker.com/reference/api/engine/latest/#tag/Node
     */
    NodesLayer,

    /**
     * @since 1.0.0
     * @category Layers
     * @see https://docs.docker.com/reference/api/engine/latest/#tag/Node
     */
    NodesLayerLocalSocket,
} from "./internal/endpoints/nodes.ts";

export {
    /**
     * @since 1.0.0
     * @category Services
     * @see https://docs.docker.com/reference/api/engine/latest/#tag/Plugin
     */
    Plugins,

    /**
     * @since 1.0.0
     * @category HttpApi
     * @see https://docs.docker.com/reference/api/engine/latest/#tag/Plugin
     */
    PluginsApi,

    /**
     * @since 1.0.0
     * @category Layers
     * @see https://docs.docker.com/reference/api/engine/latest/#tag/Plugin
     */
    PluginsLayer,

    /**
     * @since 1.0.0
     * @category Layers
     * @see https://docs.docker.com/reference/api/engine/latest/#tag/Plugin
     */
    PluginsLayerLocalSocket,
} from "./internal/endpoints/plugins.ts";

export {
    /**
     * Secrets are sensitive data that can be used by services. Swarm mode must
     * be enabled for these endpoints to work.
     *
     * @since 1.0.0
     * @category Services
     * @see https://docs.docker.com/reference/api/engine/latest/#tag/Secret
     */
    Secrets,

    /**
     * Secrets are sensitive data that can be used by services. Swarm mode must
     * be enabled for these endpoints to work.
     *
     * @since 1.0.0
     * @category HttpApi
     * @see https://docs.docker.com/reference/api/engine/latest/#tag/Secret
     */
    SecretsApi,

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
     * Secrets are sensitive data that can be used by services. Swarm mode must
     * be enabled for these endpoints to work.
     *
     * @since 1.0.0
     * @category Layers
     * @see https://docs.docker.com/reference/api/engine/latest/#tag/Secret
     */
    SecretsLayerLocalSocket,
} from "./internal/endpoints/secrets.ts";

export {
    /**
     * Services are the definitions of tasks to run on a swarm. Swarm mode must
     * be enabled for these endpoints to work.
     *
     * @since 1.0.0
     * @category Services
     * @see https://docs.docker.com/reference/api/engine/latest/#tag/Service
     */
    Services,

    /**
     * Services are the definitions of tasks to run on a swarm. Swarm mode must
     * be enabled for these endpoints to work.
     *
     * @since 1.0.0
     * @category HttpApi
     * @see https://docs.docker.com/reference/api/engine/latest/#tag/Service
     */
    ServicesApi,

    /**
     * Services are the definitions of tasks to run on a swarm. Swarm mode must
     * be enabled for these endpoints to work.
     *
     * @since 1.0.0
     * @category Layers
     * @see https://docs.docker.com/reference/api/engine/latest/#tag/Service
     */
    ServicesLayer,

    /**
     * Services are the definitions of tasks to run on a swarm. Swarm mode must
     * be enabled for these endpoints to work.
     *
     * @since 1.0.0
     * @category Layers
     * @see https://docs.docker.com/reference/api/engine/latest/#tag/Service
     */
    ServicesLayerLocalSocket,
} from "./internal/endpoints/services.ts";

export {
    /**
     * @since 1.0.0
     * @category HttpApi
     * @see https://docs.docker.com/reference/api/engine/latest/#tag/Session
     */
    SessionApi,

    /**
     * @since 1.0.0
     * @category Services
     * @see https://docs.docker.com/reference/api/engine/latest/#tag/Session
     */
    Sessions,

    /**
     * @since 1.0.0
     * @category Layers
     * @see https://docs.docker.com/reference/api/engine/latest/#tag/Session
     */
    SessionsLayer,

    /**
     * @since 1.0.0
     * @category Layers
     * @see https://docs.docker.com/reference/api/engine/latest/#tag/Session
     */
    SessionsLayerLocalSocket,
} from "./internal/endpoints/session.ts";

export {
    /**
     * Engines can be clustered together in a swarm. Refer to the swarm mode
     * documentation for more information.
     *
     * @since 1.0.0
     * @category Services
     * @see https://docs.docker.com/reference/api/engine/latest/#tag/Swarm
     */
    Swarm,

    /**
     * Engines can be clustered together in a swarm. Refer to the swarm mode
     * documentation for more information.
     *
     * @since 1.0.0
     * @category HttpApi
     * @see https://docs.docker.com/reference/api/engine/latest/#tag/Swarm
     */
    SwarmApi,

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
} from "./internal/endpoints/swarm.ts";

export {
    /**
     * @since 1.0.0
     * @category Services
     * @see https://docs.docker.com/reference/api/engine/latest/#tag/System
     */
    System,

    /**
     * @since 1.0.0
     * @category HttpApi
     * @see https://docs.docker.com/reference/api/engine/latest/#tag/System
     */
    SystemApi,

    /**
     * @since 1.0.0
     * @category Layers
     * @see https://docs.docker.com/reference/api/engine/latest/#tag/System
     */
    SystemLayer,

    /**
     * @since 1.0.0
     * @category Layers
     * @see https://docs.docker.com/reference/api/engine/latest/#tag/System
     */
    SystemLayerLocalSocket,
} from "./internal/endpoints/system.ts";

export {
    /**
     * A task is a container running on a swarm. It is the atomic scheduling
     * unit of swarm. Swarm mode must be enabled for these endpoints to work.
     *
     * @since 1.0.0
     * @category Services
     * @see https://docs.docker.com/reference/api/engine/latest/#tag/Task
     */
    Tasks,

    /**
     * A task is a container running on a swarm. It is the atomic scheduling
     * unit of swarm. Swarm mode must be enabled for these endpoints to work.
     *
     * @since 1.0.0
     * @category HttpApi
     * @see https://docs.docker.com/reference/api/engine/latest/#tag/Task
     */
    TasksApi,

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
     * A task is a container running on a swarm. It is the atomic scheduling
     * unit of swarm. Swarm mode must be enabled for these endpoints to work.
     *
     * @since 1.0.0
     * @category Layers
     * @see https://docs.docker.com/reference/api/engine/latest/#tag/Task
     */
    TasksLayerLocalSocket,
} from "./internal/endpoints/tasks.ts";

export {
    /**
     * @since 1.0.0
     * @category Services
     * @see https://docs.docker.com/reference/api/engine/latest/#tag/Volume
     */
    Volumes,

    /**
     * @since 1.0.0
     * @category HttpApi
     * @see https://docs.docker.com/reference/api/engine/latest/#tag/Volume
     */
    VolumesApi,

    /**
     * @since 1.0.0
     * @category Layers
     * @see https://docs.docker.com/reference/api/engine/latest/#tag/Volume
     */
    VolumesLayer,

    /**
     * @since 1.0.0
     * @category Layers
     * @see https://docs.docker.com/reference/api/engine/latest/#tag/Volume
     */
    VolumesLayerLocalSocket,
} from "./internal/endpoints/volumes.ts";
