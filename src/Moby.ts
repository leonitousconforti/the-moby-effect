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

export * from "./Agent.js";
export * as Configs from "./Configs.js";
export * as Containers from "./Containers.js";
export * as DemuxHelpers from "./Demux.js";
export * as Distributions from "./Distribution.js";
export * as DockerCommon from "./Docker.js";
export * as Execs from "./Execs.js";
export * as Images from "./Images.js";
export * as Networks from "./Networks.js";
export * as Nodes from "./Nodes.js";
export * as Plugins from "./Plugins.js";
export * as Schemas from "./Schemas.js";
export * as Secrets from "./Secrets.js";
export * as Services from "./Services.js";
export * as Sessions from "./Session.js";
export * as Swarm from "./Swarm.js";
export * as System from "./System.js";
export * as Tasks from "./Tasks.js";
export * as Volumes from "./Volumes.js";

export type MobyApi = Layer.Layer<
    never,
    never,
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
    | Volumes.Volumes
>;

const layer = Layer.mergeAll(
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

/** Creates a MobyApi layer from the provided connection agent */
export const fromAgent = (agent: Effect.Effect<AgentHelpers.IMobyConnectionAgent, never, Scope.Scope>): MobyApi =>
    layer.pipe(Layer.provide(Layer.scoped(AgentHelpers.MobyConnectionAgent, agent)));

/** Creates a MobyApi layer from the provided connection options */
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

/** Creates a MobyApi layer from the DOCKER_HOST environment variable as a url */
export const fromDockerHostEnvironmentVariable: Layer.Layer<
    Layer.Layer.Success<MobyApi>,
    Layer.Layer.Error<MobyApi> | ConfigError.ConfigError,
    Layer.Layer.Context<MobyApi>
> = Config.secret("DOCKER_HOST")
    .pipe(Config.withDefault(Secret.fromString("unix:///var/run/docker.sock")))
    .pipe(Config.map(Secret.value))
    .pipe(Effect.map(fromUrl))
    .pipe(Layer.unwrapEffect);

/** Creates a MobyApi layer from the platform default socket location. */
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
