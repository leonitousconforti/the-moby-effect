import { Config, ConfigError, Effect, Layer, Scope, Secret } from "effect";

import * as AgentHelpers from "./agent-helpers.js";
import * as Configs from "./configs.js";
import * as Containers from "./containers.js";
import * as Distributions from "./distribution.js";
import * as Execs from "./execs.js";
import * as Images from "./images.js";
import * as Networks from "./networks.js";
import * as Nodes from "./nodes.js";
import * as Plugins from "./plugins.js";
import * as Secrets from "./secrets.js";
import * as Services from "./services.js";
import * as Sessions from "./session.js";
import * as Swarm from "./swarm.js";
import * as System from "./system.js";
import * as Tasks from "./tasks.js";
import * as Volumes from "./volumes.js";

export type { MobyConnectionOptions } from "./agent-helpers.js";
export { run } from "./custom-helpers.js";

export * as Configs from "./configs.js";
export * as Containers from "./containers.js";
export * as Distributions from "./distribution.js";
export * as Execs from "./execs.js";
export * as Images from "./images.js";
export * as Networks from "./networks.js";
export * as Nodes from "./nodes.js";
export * as Plugins from "./plugins.js";
export * as Schemas from "./schemas.js";
export * as Secrets from "./secrets.js";
export * as Services from "./services.js";
export * as Sessions from "./session.js";
export * as Swarm from "./swarm.js";
export * as System from "./system.js";
export * as Tasks from "./tasks.js";
export * as Volumes from "./volumes.js";

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
export const fromAgent = (agent: Effect.Effect<Scope.Scope, never, AgentHelpers.IMobyConnectionAgent>): MobyApi =>
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
    Layer.Layer.Context<MobyApi> | never,
    Layer.Layer.Error<MobyApi> | ConfigError.ConfigError,
    Layer.Layer.Success<MobyApi>
> => {
    const url: URL = new URL(dockerHost);

    if (url.protocol === "unix") {
        return fromConnectionOptions({ connection: "unix", socketPath: url.pathname });
    }

    if (url.protocol === "ssh") {
        return fromConnectionOptions({
            connection: "ssh",
            host: url.hostname,
            username: url.username,
            password: url.password,
            remoteSocketPath: url.pathname,
            port: url.port ? Number.parseInt(url.port) : 22,
        });
    }

    if (url.protocol === "http") {
        return fromConnectionOptions({
            connection: "http",
            host: url.hostname ?? "127.0.0.1",
            port: url.port ? Number.parseInt(url.port) : 2375,
            path: url.pathname,
        });
    }

    if (url.protocol === "https") {
        return fromConnectionOptions({
            connection: "https",
            host: url.hostname ?? "127.0.0.1",
            port: url.port ? Number.parseInt(url.port) : 2376,
            path: url.pathname,
        });
    }

    if (url.protocol === "tcp") {
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
    Layer.Layer.Context<MobyApi>,
    Layer.Layer.Error<MobyApi> | ConfigError.ConfigError,
    Layer.Layer.Success<MobyApi>
> = Config.secret("DOCKER_HOST")
    .pipe(Config.withDefault(Secret.fromString("unix:///var/run/docker.sock")))
    .pipe(Config.map(Secret.value))
    .pipe(Effect.map(fromUrl))
    .pipe(Layer.unwrapEffect);
