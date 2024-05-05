/**
 * Generic Moby helpers
 *
 * @since 1.0.0
 */

import * as Config from "effect/Config";
import * as ConfigError from "effect/ConfigError";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as Scope from "effect/Scope";
import * as Secret from "effect/Secret";

import * as AgentHelpers from "./Agent.js";
import * as Configs from "./Configs.js";
import * as Containers from "./Containers.js";
import * as Distributions from "./Distribution.js";
import * as Execs from "./Execs.js";
import * as Images from "./Images.js";
import * as Networks from "./Networks.js";
import * as Nodes from "./Nodes.js";
import * as Plugins from "./Plugins.js";
import * as Secrets from "./Secrets.js";
import * as Services from "./Services.js";
import * as Sessions from "./Session.js";
import * as Swarm from "./Swarm.js";
import * as System from "./System.js";
import * as Tasks from "./Tasks.js";
import * as Volumes from "./Volumes.js";

/** @since 1.0.0 */
export * from "./Agent.js";

/** @since 1.0.0 */
export * as Configs from "./Configs.js";

/** @since 1.0.0 */
export * as Containers from "./Containers.js";

/** @since 1.0.0 */
export * as DemuxHelpers from "./Demux.js";

/** @since 1.0.0 */
export * as Distributions from "./Distribution.js";

/** @since 1.0.0 */
export * as DockerCommon from "./Docker.js";

/** @since 1.0.0 */
export * as Execs from "./Execs.js";

/** @since 1.0.0 */
export * as Images from "./Images.js";

/** @since 1.0.0 */
export * as Networks from "./Networks.js";

/** @since 1.0.0 */
export * as Nodes from "./Nodes.js";

/** @since 1.0.0 */
export * as Plugins from "./Plugins.js";

/** @since 1.0.0 */
export * as Schemas from "./Schemas.js";

/** @since 1.0.0 */
export * as Secrets from "./Secrets.js";

/** @since 1.0.0 */
export * as Services from "./Services.js";

/** @since 1.0.0 */
export * as Sessions from "./Session.js";

/** @since 1.0.0 */
export * as Swarm from "./Swarm.js";

/** @since 1.0.0 */
export * as System from "./System.js";

/** @since 1.0.0 */
export * as Tasks from "./Tasks.js";

/** @since 1.0.0 */
export * as Volumes from "./Volumes.js";

/**
 * Merges all the layers into a single layer
 *
 * @since 1.0.0
 * @category Layers
 */
export type MobyApi = Layer.Layer<
    | Configs.Configs
    | Containers.Containers
    | Distributions.Distributions
    | Execs.Execs
    | Images.Images
    | Networks.Networks
    | Nodes.Nodes
    | Plugins.Plugins
    | Secrets.Secrets
    | Services.Services
    | Sessions.Sessions
    | Swarm.Swarms
    | System.Systems
    | Tasks.Tasks
    | Volumes.Volumes,
    never,
    never
>;

/**
 * Merges all the layers into a single layer
 *
 * @since 1.0.0
 * @category Layers
 */
export const layer = Layer.mergeAll(
    Configs.layer,
    Containers.layer,
    Distributions.layer,
    Execs.layer,
    Images.layer,
    Networks.layer,
    Nodes.layer,
    Plugins.layer,
    Secrets.layer,
    Services.layer,
    Sessions.layer,
    Swarm.layer,
    System.layer,
    Tasks.layer,
    Volumes.layer
);

/**
 * Creates a MobyApi layer from the provided connection agent
 *
 * @since 1.0.0
 * @category Constructors
 */
export const fromAgent = (agent: Effect.Effect<AgentHelpers.IMobyConnectionAgentImpl, never, Scope.Scope>): MobyApi =>
    layer.pipe(Layer.provide(Layer.scoped(AgentHelpers.MobyConnectionAgent, agent)));

/**
 * Creates a MobyApi layer from the provided connection options
 *
 * @since 1.0.0
 * @category Constructors
 */
export const fromConnectionOptions = (connectionOptions: AgentHelpers.MobyConnectionOptions): MobyApi =>
    fromAgent(AgentHelpers.getAgent(connectionOptions));

/**
 * From
 * https://docs.docker.com/engine/reference/commandline/dockerd/#daemon-socket-option
 *
 * "The Docker client will honor the DOCKER_HOST environment variable to set the
 * -H flag for the client"
 *
 * And then from
 * https://docs.docker.com/engine/reference/commandline/dockerd/#bind-docker-to-another-hostport-or-a-unix-socket
 *
 * "-H accepts host and port assignment in the following format:
 * `tcp://[host]:[port][path]` or `unix://path`
 *
 * For example:
 *
 * - `unix://path/to/socket` -> Unix socket located at path/to/socket
 * - When -H is empty, it will default to the same value as when no -H was passed
 *   in
 * - `http://host:port/path` -> HTTP connection on host:port and prepend path to
 *   all requests
 * - `https://host:port/path` -> HTTPS connection on host:port and prepend path to
 *   all requests
 * - `ssh://me@example.com:22/var/run/docker.sock` -> SSH connection to
 *   example.com on port 22
 *
 * @since 1.0.0
 * @category Constructors
 */
export const fromUrl = (
    dockerHost: string
): Layer.Layer<
    Layer.Layer.Success<MobyApi>,
    Layer.Layer.Error<MobyApi> | ConfigError.ConfigError,
    Layer.Layer.Context<MobyApi> | never
> => {
    const url: URL = new URL(dockerHost);

    if (url.protocol === "unix:") {
        return fromConnectionOptions({ connection: "socket", socketPath: url.pathname });
    }

    if (url.protocol === "ssh:") {
        return fromConnectionOptions({
            connection: "ssh",
            host: url.hostname,
            username: url.username,
            password: url.password,
            remoteSocketPath: url.pathname,
            port: url.port ? Number.parseInt(url.port) : 22,
        });
    }

    if (url.protocol === "http:") {
        return fromConnectionOptions({
            connection: "http",
            host: url.hostname ?? "127.0.0.1",
            port: url.port ? Number.parseInt(url.port) : 2375,
            path: url.pathname,
        });
    }

    if (url.protocol === "https:") {
        return fromConnectionOptions({
            connection: "https",
            host: url.hostname ?? "127.0.0.1",
            port: url.port ? Number.parseInt(url.port) : 2376,
            path: url.pathname,
        });
    }

    if (url.protocol === "tcp:") {
        const path: string = url.pathname;
        const host: string = url.hostname ?? "127.0.0.0.1";
        const port: number = url.port ? Number.parseInt(url.port) : 2375;
        return fromConnectionOptions({ connection: port === 2376 ? "https" : "http", host, port, path });
    }

    // Any other protocols are not supported
    return Layer.fail(ConfigError.InvalidData([""], `Unsupported protocol ${url.protocol}`));
};

/**
 * Creates a MobyApi layer from the DOCKER_HOST environment variable as a url.
 *
 * @since 1.0.0
 * @category Constructors
 */
export const fromDockerHostEnvironmentVariable: Layer.Layer<
    Layer.Layer.Success<MobyApi>,
    Layer.Layer.Error<MobyApi> | ConfigError.ConfigError,
    Layer.Layer.Context<MobyApi>
> = Config.secret("DOCKER_HOST")
    .pipe(Config.withDefault(Secret.fromString("unix:///var/run/docker.sock")))
    .pipe(Config.map(Secret.value))
    .pipe(Effect.map(fromUrl))
    .pipe(Layer.unwrapEffect);

/**
 * Creates a MobyApi layer from the platform default socket location.
 *
 * @since 1.0.0
 * @category Constructors
 */
export const fromPlatformDefault = (): Layer.Layer<
    Layer.Layer.Success<MobyApi>,
    Layer.Layer.Error<MobyApi> | ConfigError.ConfigError,
    Layer.Layer.Context<MobyApi>
> => {
    switch (process.platform) {
        case "linux":
        case "darwin": {
            return fromConnectionOptions({ connection: "socket", socketPath: "/var/run/docker.sock" });
        }
        case "win32": {
            return fromConnectionOptions({ connection: "socket", socketPath: "//./pipe/docker_engine" });
        }
        default: {
            return Layer.fail(ConfigError.InvalidData([""], `Unsupported platform ${process.platform}`));
        }
    }
};
