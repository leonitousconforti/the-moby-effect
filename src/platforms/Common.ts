/**
 * Common connection options for all agents
 *
 * @since 1.0.0
 */

import type ssh2 from "ssh2";

import * as Data from "effect/Data";
import * as Match from "effect/Match";

/**
 * @since 1.0.0
 * @category Connection Types
 */
export type MobyConnectionOptions = Data.TaggedEnum<{
    socket: { readonly socketPath: string };
    ssh: { readonly remoteSocketPath: string } & ssh2.ConnectConfig;
    http: { readonly host: string; readonly port: number; readonly path?: string | undefined };
    https: {
        readonly host: string;
        readonly port: number;
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
export const MobyConnectionOptions = Data.taggedEnum<MobyConnectionOptions>();

/**
 * @since 1.0.0
 * @category Connection Constructors
 * @code
 *     import { SocketConnectionOptions } from "@the-moby-effect/Agent";
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
 * @code
 *     import { SshConnectionOptions } from "@the-moby-effect/Agent";
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
 * @code
 *     import { HttpConnectionOptions } from "@the-moby-effect/Agent";
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
 * @code
 *     import { HttpsConnectionOptions } from "@the-moby-effect/Agent";
 *     const connectionOptions = HttpsConnectionOptions({
 *         host: "host.domain.com",
 *         port: 2375,
 *         path: "/proxy-path",
 *         cert: fs.readFileSync("cert.pem"),
 *         ca: fs.readFileSync("ca.pem"),
 *         key: fs.readFileSync("key.pem"),
 *         passphrase: "password",
 *     });
 */
export const HttpsConnectionOptions = MobyConnectionOptions.https;

/**
 * @since 1.0.0
 * @category Helpers
 */
export const getNodeRequestUrl: (connectionOptions: MobyConnectionOptions) => string = MobyConnectionOptions.$match({
    ssh: () => "http://0.0.0.0" as const,
    socket: () => "http://0.0.0.0" as const,
    http: (options) => `http://0.0.0.0:${options.port}${options.path ?? ""}` as const,
    https: (options) => `https://0.0.0.0:${options.port}${options.path ?? ""}` as const,
});

/**
 * @since 1.0.0
 * @category Helpers
 */
export const getWebRequestUrl: (
    connectionOptions: HttpConnectionOptionsTagged | HttpsConnectionOptionsTagged
) => string = Match.typeTags<HttpConnectionOptionsTagged | HttpsConnectionOptionsTagged>()({
    http: (options) => `http://0.0.0.0${options.path ?? ""}`,
    https: (options) => `https://0.0.0.0${options.path ?? ""}`,
});

/**
 * @since 1.0.0
 * @category Helpers
 */
export const getAgnosticRequestUrl = (
    connectionOptions: HttpConnectionOptionsTagged | HttpsConnectionOptionsTagged
): string =>
    `${connectionOptions._tag}://${connectionOptions.host}:${connectionOptions.port}${connectionOptions.path ?? ""}` as const;
