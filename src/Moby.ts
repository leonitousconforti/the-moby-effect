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

import * as AgentCommon from "./agents/index.js";
import * as Configs from "./endpoints/Configs.js";
import * as Containers from "./endpoints/Containers.js";
import * as Distributions from "./endpoints/Distribution.js";
import * as Execs from "./endpoints/Execs.js";
import * as Images from "./endpoints/Images.js";
import * as Networks from "./endpoints/Networks.js";
import * as Nodes from "./endpoints/Nodes.js";
import * as Plugins from "./endpoints/Plugins.js";
import * as Secrets from "./endpoints/Secrets.js";
import * as Services from "./endpoints/Services.js";
import * as Sessions from "./endpoints/Session.js";
import * as Swarm from "./endpoints/Swarm.js";
import * as System from "./endpoints/System.js";
import * as Tasks from "./endpoints/Tasks.js";
import * as Volumes from "./endpoints/Volumes.js";

/** @since 1.0.0 */
export * as Configs from "./endpoints/Configs.js";

/** @since 1.0.0 */
export * as Containers from "./endpoints/Containers.js";

/** @since 1.0.0 */
export * as Distribution from "./endpoints/Distribution.js";

/** @since 1.0.0 */
export * as Execs from "./endpoints/Execs.js";

/** @since 1.0.0 */
export * as Images from "./endpoints/Images.js";

/** @since 1.0.0 */
export * as Networks from "./endpoints/Networks.js";

/** @since 1.0.0 */
export * as Nodes from "./endpoints/Nodes.js";

/** @since 1.0.0 */
export * as Plugins from "./endpoints/Plugins.js";

/** @since 1.0.0 */
export * as Secrets from "./endpoints/Secrets.js";

/** @since 1.0.0 */
export * as Services from "./endpoints/Services.js";

/** @since 1.0.0 */
export * as Session from "./endpoints/Session.js";

/** @since 1.0.0 */
export * as Swarm from "./endpoints/Swarm.js";

/** @since 1.0.0 */
export * as System from "./endpoints/System.js";

/** @since 1.0.0 */
export * as Tasks from "./endpoints/Tasks.js";

/** @since 1.0.0 */
export * as Volumes from "./endpoints/Volumes.js";

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
 * Creates a MobyApi layer from the provided connection options
 *
 * @since 1.0.0
 * @category Constructors
 */
export const fromConnectionOptions = (connectionOptions: AgentCommon.MobyConnectionOptions): MobyApi =>
    Layer.provide(layer, AgentCommon.makeUndiciHttpClientLayer(connectionOptions));

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
        return fromConnectionOptions(AgentCommon.SocketConnectionOptions({ socketPath: url.pathname }));
    }

    if (url.protocol === "ssh:") {
        return fromConnectionOptions(
            AgentCommon.SshConnectionOptions({
                host: url.hostname,
                username: url.username,
                password: url.password,
                remoteSocketPath: url.pathname,
                port: url.port ? Number.parseInt(url.port) : 22,
            })
        );
    }

    if (url.protocol === "http:") {
        return fromConnectionOptions(
            AgentCommon.HttpConnectionOptions({
                host: url.hostname ?? "127.0.0.1",
                port: url.port ? Number.parseInt(url.port) : 2375,
                path: url.pathname,
            })
        );
    }

    if (url.protocol === "https:") {
        return fromConnectionOptions(
            AgentCommon.HttpConnectionOptions({
                host: url.hostname ?? "127.0.0.1",
                port: url.port ? Number.parseInt(url.port) : 2376,
                path: url.pathname,
            })
        );
    }

    if (url.protocol === "tcp:") {
        const path: string = url.pathname;
        const host: string = url.hostname ?? "127.0.0.0.1";
        const port: number = url.port ? Number.parseInt(url.port) : 2375;
        if (port === 2376) {
            return fromConnectionOptions(AgentCommon.HttpsConnectionOptions({ host, port, path }));
        } else {
            return fromConnectionOptions(AgentCommon.HttpConnectionOptions({ host, port, path }));
        }
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
            return fromConnectionOptions(AgentCommon.SocketConnectionOptions({ socketPath: "/var/run/docker.sock" }));
        }
        case "win32": {
            return fromConnectionOptions(AgentCommon.SocketConnectionOptions({ socketPath: "//./pipe/docker_engine" }));
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
        return fromConnectionOptions(
            AgentCommon.SocketConnectionOptions({
                socketPath: path.join(os.homedir(), ".docker", "run", "docker.sock"),
            })
        );
    }).pipe(Layer.unwrapEffect);
