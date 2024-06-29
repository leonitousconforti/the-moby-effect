/**
 * Generic Moby helpers
 *
 * @since 1.0.0
 */

import * as os from "node:os";

import * as Path from "@effect/platform/Path";
import * as Config from "effect/Config";
import * as ConfigError from "effect/ConfigError";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as Redacted from "effect/Redacted";
import * as Scope from "effect/Scope";

import * as AgentHelpers from "./Agent.js";
import * as Configs from "./moby/Configs.js";
import * as Containers from "./moby/Containers.js";
import * as Distributions from "./moby/Distribution.js";
import * as Execs from "./moby/Execs.js";
import * as Images from "./moby/Images.js";
import * as Networks from "./moby/Networks.js";
import * as Nodes from "./moby/Nodes.js";
import * as Plugins from "./moby/Plugins.js";
import * as Secrets from "./moby/Secrets.js";
import * as Services from "./moby/Services.js";
import * as Sessions from "./moby/Session.js";
import * as Swarm from "./moby/Swarm.js";
import * as System from "./moby/System.js";
import * as Tasks from "./moby/Tasks.js";
import * as Volumes from "./moby/Volumes.js";

/** @since 1.0.0 */
export * as Configs from "./moby/Configs.js";

/** @since 1.0.0 */
export * as Containers from "./moby/Containers.js";

/** @since 1.0.0 */
export * as Distribution from "./moby/Distribution.js";

/** @since 1.0.0 */
export * as Execs from "./moby/Execs.js";

/** @since 1.0.0 */
export * as Images from "./moby/Images.js";

/** @since 1.0.0 */
export * as Networks from "./moby/Networks.js";

/** @since 1.0.0 */
export * as Nodes from "./moby/Nodes.js";

/** @since 1.0.0 */
export * as Plugins from "./moby/Plugins.js";

/** @since 1.0.0 */
export * as Secrets from "./moby/Secrets.js";

/** @since 1.0.0 */
export * as Services from "./moby/Services.js";

/** @since 1.0.0 */
export * as Session from "./moby/Session.js";

/** @since 1.0.0 */
export * as Swarm from "./moby/Swarm.js";

/** @since 1.0.0 */
export * as System from "./moby/System.js";

/** @since 1.0.0 */
export * as Tasks from "./moby/Tasks.js";

/** @since 1.0.0 */
export * as Volumes from "./moby/Volumes.js";

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
> = Config.redacted("DOCKER_HOST")
    .pipe(Config.withDefault(Redacted.make("unix:///var/run/docker.sock")))
    .pipe(Config.map(Redacted.value))
    .pipe(Effect.map(fromUrl))
    .pipe(Layer.unwrapEffect);

/**
 * Creates a MobyApi layer from the platform default system socket location.
 *
 * @since 1.0.0
 * @category Constructors
 */
export const fromPlatformSystemSocketDefault = (): Layer.Layer<
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

/**
 * Creates a MobyApi layer from the platform default system socket location.
 *
 * @since 1.0.0
 * @category Constructors
 */
export const fromUserSocketDefault = (): Layer.Layer<
    Layer.Layer.Success<MobyApi>,
    Layer.Layer.Error<MobyApi> | ConfigError.ConfigError,
    Layer.Layer.Context<MobyApi> | Path.Path
> =>
    Effect.gen(function* () {
        const path = yield* Path.Path;
        return fromConnectionOptions({
            connection: "socket",
            socketPath: path.join(os.homedir(), ".docker", "run", "docker.sock"),
        });
    }).pipe(Layer.unwrapEffect);
