/**
 * Http, https, ssh, and unix socket connection agents for all platforms.
 *
 * @since 1.0.0
 */

import * as os from "node:os";

import * as Path from "@effect/platform/Path";
import * as Config from "effect/Config";
import * as ConfigError from "effect/ConfigError";
import * as Effect from "effect/Effect";
import * as Redacted from "effect/Redacted";

import * as AgentCommon from "./platforms/Common.js";

export { makeBunHttpClientLayer } from "./platforms/Bun.js";
export {
    HttpConnectionOptions,
    HttpsConnectionOptions,
    MobyConnectionOptions,
    SocketConnectionOptions,
    SshConnectionOptions,
} from "./platforms/Common.js";
export { makeDenoHttpClientLayer } from "./platforms/Deno.js";
export { makeNodeHttpClientLayer } from "./platforms/Node.js";
export { makeUndiciHttpClientLayer } from "./platforms/Undici.js";
export { makeBrowserHttpClientLayer } from "./platforms/Web.js";

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
export const connectionOptionsFromUrl = (
    dockerHost: string
): Effect.Effect<AgentCommon.MobyConnectionOptions, ConfigError.ConfigError, never> => {
    // TODO: Is this NodeJS only?!?
    const url: URL = new URL(dockerHost);

    if (url.protocol === "unix:") {
        return Effect.succeed(AgentCommon.SocketConnectionOptions({ socketPath: url.pathname }));
    }

    if (url.protocol === "ssh:") {
        return Effect.succeed(
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
        return Effect.succeed(
            AgentCommon.HttpConnectionOptions({
                host: url.hostname ?? "127.0.0.1",
                port: url.port ? Number.parseInt(url.port) : 2375,
                path: url.pathname,
            })
        );
    }

    if (url.protocol === "https:") {
        return Effect.succeed(
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
            return Effect.succeed(AgentCommon.HttpsConnectionOptions({ host, port, path }));
        } else {
            return Effect.succeed(AgentCommon.HttpConnectionOptions({ host, port, path }));
        }
    }

    // Any other protocols are not supported
    return Effect.fail(ConfigError.InvalidData([""], `Unsupported protocol ${url.protocol}`));
};

/**
 * Creates a MobyApi layer from the DOCKER_HOST environment variable as a url.
 *
 * @since 1.0.0
 * @category Constructors
 */
export const connectionOptionsFromDockerHostEnvironmentVariable: Effect.Effect<
    AgentCommon.MobyConnectionOptions,
    ConfigError.ConfigError,
    never
> = Config.redacted("DOCKER_HOST")
    .pipe(Config.withDefault(Redacted.make("unix:///var/run/docker.sock")))
    .pipe(Config.map(Redacted.value))
    .pipe(Effect.flatMap(connectionOptionsFromUrl));

/**
 * Creates a MobyApi layer from the platform default system socket location.
 *
 * @since 1.0.0
 * @category Constructors
 */
export const connectionOptionsFromPlatformSystemSocketDefault = (): Effect.Effect<
    AgentCommon.MobyConnectionOptions,
    ConfigError.ConfigError,
    never
> => {
    switch (process.platform) {
        case "linux":
        case "darwin": {
            return Effect.succeed(AgentCommon.SocketConnectionOptions({ socketPath: "/var/run/docker.sock" }));
        }
        case "win32": {
            return Effect.succeed(AgentCommon.SocketConnectionOptions({ socketPath: "//./pipe/docker_engine" }));
        }
        default: {
            return Effect.fail(ConfigError.InvalidData([""], `Unsupported platform ${process.platform}`));
        }
    }
};

/**
 * Creates a MobyApi layer from the platform default system socket location.
 *
 * @since 1.0.0
 * @category Constructors
 */
export const fromUserSocketDefault = (): Effect.Effect<AgentCommon.MobyConnectionOptions, never, Path.Path> =>
    Effect.map(Path.Path, (path) =>
        AgentCommon.SocketConnectionOptions({
            socketPath: path.join(os.homedir(), ".docker", "run", "docker.sock"),
        })
    );
