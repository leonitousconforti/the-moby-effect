/**
 * Http, https, ssh, and unix socket connection agents for all platforms.
 *
 * @since 1.0.0
 */

import type * as ssh2 from "ssh2";

import * as Path from "@effect/platform/Path";
import * as ConfigError from "effect/ConfigError";
import * as Data from "effect/Data";
import * as Effect from "effect/Effect";

import * as internal from "./internal/platforms/connection.js";

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
export type MobyConnectionOptions = Data.TaggedEnum<{
    socket: { readonly socketPath: string; readonly version?: string | undefined };
    ssh: {
        readonly remoteSocketPath: string;
        readonly host: string;
        readonly version?: string | undefined;
    } & Exclude<ssh2.ConnectConfig, "host">;
    http: {
        readonly host: string;
        readonly port: number;
        readonly path?: string | undefined;
        readonly version?: string | undefined;
    };
    https: {
        readonly host: string;
        readonly port: number;
        readonly version?: string | undefined;
        readonly path?: string | undefined;
        readonly cert?: string | undefined;
        readonly ca?: string | undefined;
        readonly key?: string | undefined;
        readonly passphrase?: string | undefined;
    };
}>;

/**
 * @since 1.0.0
 * @category Connection Types
 */
export type SocketConnectionOptions = Data.TaggedEnum.Args<MobyConnectionOptions, "socket">;

/**
 * @since 1.0.0
 * @category Connection Types
 */
export type SocketConnectionOptionsTagged = Data.TaggedEnum.Value<MobyConnectionOptions, "socket">;

/**
 * @since 1.0.0
 * @category Connection Types
 */
export type HttpConnectionOptions = Data.TaggedEnum.Args<MobyConnectionOptions, "http">;

/**
 * @since 1.0.0
 * @category Connection Types
 */
export type HttpConnectionOptionsTagged = Data.TaggedEnum.Value<MobyConnectionOptions, "http">;

/**
 * @since 1.0.0
 * @category Connection Types
 */
export type HttpsConnectionOptions = Data.TaggedEnum.Args<MobyConnectionOptions, "https">;

/**
 * @since 1.0.0
 * @category Connection Types
 */
export type HttpsConnectionOptionsTagged = Data.TaggedEnum.Value<MobyConnectionOptions, "https">;

/**
 * @since 1.0.0
 * @category Connection Types
 */
export type SshConnectionOptions = Data.TaggedEnum.Args<MobyConnectionOptions, "ssh">;

/**
 * @since 1.0.0
 * @category Connection Types
 */
export type SshConnectionOptionsTagged = Data.TaggedEnum.Value<MobyConnectionOptions, "ssh">;

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
export const MobyConnectionOptions = internal.MobyConnectionOptions;

/**
 * @since 1.0.0
 * @category Connection Constructors
 * @example
 *     import { SocketConnectionOptions } from "the-moby-effect/MobyConnection";
 *     const connectionOptions = SocketConnectionOptions({
 *         socketPath: "/var/run/docker.sock",
 *     });
 */
export const SocketConnectionOptions = internal.SocketConnectionOptions;

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
export const SshConnectionOptions = internal.SshConnectionOptions;

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
export const HttpConnectionOptions = internal.HttpConnectionOptions;

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
export const HttpsConnectionOptions = internal.HttpsConnectionOptions;

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
export const connectionOptionsFromUrl: (
    dockerHost: string
) => Effect.Effect<MobyConnectionOptions, ConfigError.ConfigError, never> = internal.connectionOptionsFromUrl;

/**
 * Creates a MobyApi layer from the DOCKER_HOST environment variable as a url.
 *
 * @since 1.0.0
 * @category Constructors
 */
export const connectionOptionsFromDockerHostEnvironmentVariable: Effect.Effect<
    MobyConnectionOptions,
    ConfigError.ConfigError,
    never
> = internal.connectionOptionsFromDockerHostEnvironmentVariable;

/**
 * Creates a MobyApi layer from the platform default system socket location.
 *
 * @since 1.0.0
 * @category Constructors
 */
export const connectionOptionsFromPlatformSystemSocketDefault: Effect.Effect<
    MobyConnectionOptions,
    ConfigError.ConfigError,
    never
> = internal.connectionOptionsFromPlatformSystemSocketDefault;

/**
 * Creates a MobyApi layer from the platform default system socket location.
 *
 * @since 1.0.0
 * @category Constructors
 */
export const connectionOptionsFromUserSocketDefault: Effect.Effect<MobyConnectionOptions, never, Path.Path> =
    internal.connectionOptionsFromUserSocketDefault;
