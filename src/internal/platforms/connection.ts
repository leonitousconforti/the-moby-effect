/**
 * Http, https, ssh, and unix socket connection agents for all platforms.
 *
 * @since 1.0.0
 */

import * as Path from "@effect/platform/Path";
import * as Config from "effect/Config";
import * as ConfigError from "effect/ConfigError";
import * as Data from "effect/Data";
import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as Match from "effect/Match";
import * as Redacted from "effect/Redacted";

import type * as MobyConnection from "../../MobyConnection.js";

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
export const MobyConnectionOptions = Data.taggedEnum<MobyConnection.MobyConnectionOptions>();

/**
 * @since 1.0.0
 * @category Connection Constructors
 * @example
 *     import { SocketConnectionOptions } from "the-moby-effect/MobyConnection";
 *     const connectionOptions = SocketConnectionOptions({
 *         socketPath: "/var/run/docker.sock",
 *     });
 */
export const SocketConnectionOptions = MobyConnectionOptions.socket;

/**
 * Connects to a remote machine over ssh. This specific ssh implementation uses
 * the OpenSSH extension "ForwardOutLocalStream" (so you must being running an
 * OpenSSH server or something that implements the "ForwardOutLocalStream"
 * extension) that opens a connection to a UNIX domain socket at socketPath on
 * the server.
 *
 * @since 1.0.0
 * @category Connection Constructors
 * @example
 *     import { SshConnectionOptions } from "the-moby-effect/MobyConnection";
 *     const connectionOptions = SshConnectionOptions({
 *         host: "host.domain.com",
 *         port: 2222,
 *         username: "user",
 *         password: "password",
 *         remoteSocketPath: "/var/run/docker.sock",
 *     });
 */
export const SshConnectionOptions = MobyConnectionOptions.ssh;

/**
 * @since 1.0.0
 * @category Connection Constructors
 * @example
 *     import { HttpConnectionOptions } from "the-moby-effect/MobyConnection";
 *     const connectionOptions = HttpConnectionOptions({
 *         host: "host.domain.com",
 *         port: 2375,
 *         path: "/proxy-path",
 *     });
 */
export const HttpConnectionOptions = MobyConnectionOptions.http;

/**
 * @since 1.0.0
 * @category Connection Constructors
 * @example
 *     import { HttpsConnectionOptions } from "the-moby-effect/MobyConnection";
 *     const connectionOptions = HttpsConnectionOptions({
 *         host: "host.domain.com",
 *         port: 2375,
 *         path: "/proxy-path",
 *         // passphrase: "password",
 *         // ca: fs.readFileSync("ca.pem"),
 *         // key: fs.readFileSync("key.pem"),
 *         // cert: fs.readFileSync("cert.pem"),
 *     });
 */
export const HttpsConnectionOptions = MobyConnectionOptions.https;

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
): Effect.Effect<MobyConnection.MobyConnectionOptions, ConfigError.ConfigError, never> => {
    const url: URL = new URL(dockerHost);

    if (url.protocol === "unix:") {
        return Effect.succeed(SocketConnectionOptions({ socketPath: url.pathname }));
    }

    if (url.protocol === "ssh:") {
        return Effect.succeed(
            SshConnectionOptions({
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
            HttpConnectionOptions({
                host: url.hostname ?? "127.0.0.1",
                port: url.port ? Number.parseInt(url.port) : 2375,
                path: url.pathname,
            })
        );
    }

    if (url.protocol === "https:") {
        return Effect.succeed(
            HttpConnectionOptions({
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
            return Effect.succeed(HttpsConnectionOptions({ host, port, path }));
        } else {
            return Effect.succeed(HttpConnectionOptions({ host, port, path }));
        }
    }

    // Any other protocols are not supported
    return Effect.fail(ConfigError.InvalidData([], `Unsupported protocol ${url.protocol}`));
};

/**
 * Creates a MobyApi layer from the DOCKER_HOST environment variable as a url.
 *
 * @since 1.0.0
 * @category Constructors
 */
export const connectionOptionsFromDockerHostEnvironmentVariable: Effect.Effect<
    MobyConnection.MobyConnectionOptions,
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
export const connectionOptionsFromPlatformSystemSocketDefault: Effect.Effect<
    MobyConnection.MobyConnectionOptions,
    ConfigError.ConfigError,
    never
> = Function.pipe(
    Match.value(process.platform),
    Match.when("linux", () => Effect.succeed(SocketConnectionOptions({ socketPath: "/var/run/docker.sock" }))),
    Match.when("darwin", () => Effect.succeed(SocketConnectionOptions({ socketPath: "/var/run/docker.sock" }))),
    Match.when("win32", () => Effect.succeed(SocketConnectionOptions({ socketPath: "//./pipe/docker_engine" }))),
    Match.orElse(() => Effect.fail(ConfigError.InvalidData([], `Unsupported platform ${process.platform}`)))
);

/**
 * Creates a MobyApi layer from the platform default system socket location.
 *
 * @since 1.0.0
 * @category Constructors
 */
export const connectionOptionsFromUserSocketDefault: Effect.Effect<
    MobyConnection.MobyConnectionOptions,
    never,
    Path.Path
> = Function.pipe(
    Effect.all(
        {
            pathLazy: Path.Path,
            osLazy: Effect.promise(() => import("node:os")),
        },
        { concurrency: 2 }
    ),
    Effect.map(({ osLazy, pathLazy }) =>
        SocketConnectionOptions({
            socketPath: pathLazy.join(osLazy.homedir(), ".docker", "run", "docker.sock"),
        })
    )
);
