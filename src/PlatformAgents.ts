/**
 * Http, https, ssh, and unix socket connection agents for all platforms.
 *
 * @since 1.0.0
 */

import * as Path from "@effect/platform/Path";
import * as Config from "effect/Config";
import * as ConfigError from "effect/ConfigError";
import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as Redacted from "effect/Redacted";

import * as BunInternal from "./platforms/Bun.js";
import * as CommonInternal from "./platforms/Common.js";
import * as DenoInternal from "./platforms/Deno.js";
import * as NodeInternal from "./platforms/Node.js";
import * as UndiciInternal from "./platforms/Undici.js";
import * as WebInternal from "./platforms/Web.js";

/**
 * Given the moby connection options, it will construct a layer that provides a
 * http client that you could use to connect to your moby instance. This is no
 * different than the Node implementation currently.
 *
 * @since 1.0.0
 * @category Connection
 */
export const makeBunHttpClientLayer = BunInternal.makeBunHttpClientLayer;

/**
 * Given the moby connection options, it will construct a layer that provides a
 * http client that you could use to connect to your moby instance. This is no
 * different than the Node implementation currently.
 *
 * @since 1.0.0
 * @category Connection
 */
export const makeDenoHttpClientLayer = DenoInternal.makeDenoHttpClientLayer;

/**
 * Given the moby connection options, it will construct a layer that provides a
 * http client that you could use to connect to your moby instance.
 *
 * @since 1.0.0
 * @category Connection
 */
export const makeNodeHttpClientLayer = NodeInternal.makeNodeHttpClientLayer;

/**
 * Given the moby connection options, it will construct a layer that provides a
 * http client that you could use to connect to your moby instance.
 *
 * @since 1.0.0
 * @category Connection
 */
export const makeUndiciHttpClientLayer = UndiciInternal.makeUndiciHttpClientLayer;

/**
 * Given the moby connection options, it will construct a layer that provides a
 * http client that you could use to connect to your moby instance.
 *
 * @since 1.0.0
 * @category Connection
 */
export const makeWebHttpClientLayer = WebInternal.makeWebHttpClientLayer;

/**
 * @since 1.0.0
 * @category Connection Types
 */
export const HttpConnectionOptions = CommonInternal.HttpConnectionOptions;

/**
 * @since 1.0.0
 * @category Connection Types
 */
export const HttpsConnectionOptions = CommonInternal.HttpsConnectionOptions;

/**
 * @since 1.0.0
 * @category Connection Types
 */
export const SocketConnectionOptions = CommonInternal.SocketConnectionOptions;

/**
 * @since 1.0.0
 * @category Connection Types
 */
export const SshConnectionOptions = CommonInternal.SshConnectionOptions;

/**
 * @since 1.0.0
 * @category Connection Types
 */
export type MobyConnectionOptions = CommonInternal.MobyConnectionOptions;

/**
 * Connection options for how to connect to your moby/docker instance. Can be a
 * unix socket on the current machine. Can be an ssh connection to a remote
 * machine with a remote user, remote machine, remote port, and remote socket
 * path. Can be an http connection to a remote machine with a host, port, and
 * path. Or it can be an https connection to a remote machine with a host, port,
 * path, cert, ca, key, and passphrase.
 *
 * @since 1.0.0
 * @category Connection Types
 */
export const MobyConnectionOptions = CommonInternal.MobyConnectionOptions;

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
): Effect.Effect<CommonInternal.MobyConnectionOptions, ConfigError.ConfigError, never> => {
    // TODO: Is this NodeJS only?!?
    const url: URL = new URL(dockerHost);

    if (url.protocol === "unix:") {
        return Effect.succeed(CommonInternal.SocketConnectionOptions({ socketPath: url.pathname }));
    }

    if (url.protocol === "ssh:") {
        return Effect.succeed(
            CommonInternal.SshConnectionOptions({
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
            CommonInternal.HttpConnectionOptions({
                host: url.hostname ?? "127.0.0.1",
                port: url.port ? Number.parseInt(url.port) : 2375,
                path: url.pathname,
            })
        );
    }

    if (url.protocol === "https:") {
        return Effect.succeed(
            CommonInternal.HttpConnectionOptions({
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
            return Effect.succeed(CommonInternal.HttpsConnectionOptions({ host, port, path }));
        } else {
            return Effect.succeed(CommonInternal.HttpConnectionOptions({ host, port, path }));
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
    CommonInternal.MobyConnectionOptions,
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
    CommonInternal.MobyConnectionOptions,
    ConfigError.ConfigError,
    never
> => {
    switch (process.platform) {
        case "linux":
        case "darwin": {
            return Effect.succeed(CommonInternal.SocketConnectionOptions({ socketPath: "/var/run/docker.sock" }));
        }
        case "win32": {
            return Effect.succeed(CommonInternal.SocketConnectionOptions({ socketPath: "//./pipe/docker_engine" }));
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
export const fromUserSocketDefault = (): Effect.Effect<CommonInternal.MobyConnectionOptions, never, Path.Path> =>
    Function.pipe(
        Effect.all(
            {
                pathLazy: Path.Path,
                osLazy: Effect.promise(() => import("node:os")),
            },
            { concurrency: 2 }
        ),
        Effect.map(({ osLazy, pathLazy }) =>
            CommonInternal.SocketConnectionOptions({
                socketPath: pathLazy.join(osLazy.homedir(), ".docker", "run", "docker.sock"),
            })
        )
    );
