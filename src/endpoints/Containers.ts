/**
 * Containers service
 *
 * @since 1.0.0
 */

import * as PlatformError from "@effect/platform/Error";
import * as HttpBody from "@effect/platform/HttpBody";
import * as HttpClient from "@effect/platform/HttpClient";
import * as HttpClientError from "@effect/platform/HttpClientError";
import * as HttpClientRequest from "@effect/platform/HttpClientRequest";
import * as HttpClientResponse from "@effect/platform/HttpClientResponse";
import * as Socket from "@effect/platform/Socket";
import * as ParseResult from "@effect/schema/ParseResult";
import * as Schema from "@effect/schema/Schema";
import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as Layer from "effect/Layer";
import * as Option from "effect/Option";
import * as Predicate from "effect/Predicate";
import * as Scope from "effect/Scope";
import * as Stream from "effect/Stream";
import * as Tuple from "effect/Tuple";

import { responseToStreamingSocketOrFail } from "../demux/Common.js";
import { MultiplexedStreamSocket } from "../demux/Multiplexed.js";
import {
    BidirectionalRawStreamSocket,
    responseToRawStreamSocketOrFail,
    UnidirectionalRawStreamSocket,
} from "../demux/Raw.js";
import {
    ContainerChange,
    ContainerConfig,
    ContainerCreateRequest,
    ContainerCreateResponse,
    ContainerInspectResponse,
    ContainerListResponseItem,
    ContainerPruneResponse,
    ContainerStatsResponse,
    ContainerTopResponse,
    ContainerUpdateResponse,
    ContainerWaitResponse,
} from "../generated/index.js";
import { maybeAddFilters, maybeAddQueryParameter } from "./Common.js";

/**
 * @since 1.0.0
 * @category Errors
 */
export const ContainersErrorTypeId: unique symbol = Symbol.for("@the-moby-effect/moby/ContainersError");

/**
 * @since 1.0.0
 * @category Errors
 */
export type ContainersErrorTypeId = typeof ContainersErrorTypeId;

/**
 * @since 1.0.0
 * @category Errors
 */
export const isContainersError = (u: unknown): u is ContainersError => Predicate.hasProperty(u, ContainersErrorTypeId);

/**
 * @since 1.0.0
 * @category Errors
 */
export class ContainersError extends PlatformError.TypeIdError(ContainersErrorTypeId, "ContainersError")<{
    method: string;
    cause:
        | ParseResult.ParseError
        | HttpClientError.HttpClientError
        | HttpBody.HttpBodyError
        | Socket.SocketError
        | Error;
}> {
    get message() {
        return this.method;
    }
}

/**
 * @since 1.0.0
 * @category Params
 */
export interface ContainerListOptions {
    /** Return all containers. By default, only running containers are shown. */
    readonly all?: boolean | undefined;

    /**
     * Return this number of most recently created containers, including
     * non-running ones.
     */
    readonly limit?: number | undefined;

    /** Return the size of container as fields `SizeRw` and `SizeRootFs`. */
    readonly size?: boolean | undefined;

    /**
     * Available filters:
     *
     * - `ancestor`=(`<image-name>[:<tag>]`, `<image id>`, or `<image@digest>`)
     * - `before`=(`<container id>` or `<container name>`)
     * - `expose`=(`<port>[/<proto>]`|`<startport-endport>/[<proto>]`)
     * - `exited=<int>` containers with exit code of `<int>`
     * - `health`=(`starting`|`healthy`|`unhealthy`|`none`)
     * - `id=<ID>` a container's ID
     * - `isolation=`(`default`|`process`|`hyperv`) (Windows daemon only)
     * - `is-task=`(`true`|`false`)
     * - `label=key` or `label="key=value"` of a container label
     * - `name=<name>` a container's name
     * - `network`=(`<network id>` or `<network name>`)
     * - `publish`=(`<port>[/<proto>]`|`<startport-endport>/[<proto>]`)
     * - `since`=(`<container id>` or `<container name>`)
     * - `status=`(`created`|`restarting`|`running`|`removing`|`paused`|`exited`|`dead`)
     * - `volume`=(`<volume name>` or `<mount point destination>`)
     */
    readonly filters?:
        | {
              ancestor?: string | undefined;
              before?: string | undefined;
              expose?: `${number}/${string}` | `${number}-${number}/${string}` | undefined;
              exited?: number | undefined;
              health?: "starting" | "healthy" | "unhealthy" | "none" | undefined;
              id?: string | undefined;
              isolation?: "default" | "process" | "hyperv" | undefined;
              "is-task"?: true | false | undefined;
              label?: Record<string, string> | undefined;
              name?: string | undefined;
              network?: string | undefined;
              publish?: `${number}/${string}` | `${number}-${number}/${string}` | undefined;
              since?: string | undefined;
              status?: "created" | "restarting" | "running" | "removing" | "paused" | "exited" | "dead" | undefined;
              volume?: string | undefined;
          }
        | undefined;
}

/**
 * @since 1.0.0
 * @category Params
 */
export interface ContainerCreateOptions {
    /**
     * Assign the specified name to the container. Must match
     * `/?[a-zA-Z0-9][a-zA-Z0-9_.-]+`.
     */
    readonly name?: string | undefined;
    /**
     * Platform in the format `os[/arch[/variant]]` used for image lookup.
     *
     * When specified, the daemon checks if the requested image is present in
     * the local image cache with the given OS and Architecture, and otherwise
     * returns a `404` status.
     *
     * If the option is not set, the host's native OS and Architecture are used
     * to look up the image in the image cache. However, if no platform is
     * passed and the given image does exist in the local image cache, but its
     * OS or architecture does not match, the container is created with the
     * available image, and a warning is added to the `Warnings` field in the
     * response, for example;
     *
     * WARNING: The requested image's platform (linux/arm64/v8) does not match
     * the detected host platform (linux/amd64) and no specific platform was
     * requested
     */
    readonly platform?: string | undefined;
    /** Container to create */
    readonly spec: typeof ContainerCreateRequest.Encoded;
}

/**
 * @since 1.0.0
 * @category Params
 */
export interface ContainerInspectOptions {
    /** ID or name of the container */
    readonly id: string;
    /** Return the size of container as fields `SizeRw` and `SizeRootFs` */
    readonly size?: boolean | undefined;
}

/**
 * @since 1.0.0
 * @category Params
 */
export interface ContainerTopOptions {
    /** ID or name of the container */
    readonly id: string;
    /** The arguments to pass to `ps`. For example, `aux` */
    readonly ps_args?: string | undefined;
}

/**
 * @since 1.0.0
 * @category Params
 */
export interface ContainerLogsOptions {
    /** ID or name of the container */
    readonly id: string;
    /** Keep connection after returning logs. */
    readonly follow?: boolean | undefined;
    /** Return logs from `stdout` */
    readonly stdout?: boolean | undefined;
    /** Return logs from `stderr` */
    readonly stderr?: boolean | undefined;
    /** Only return logs since this time, as a UNIX timestamp */
    readonly since?: number | undefined;
    /** Only return logs before this time, as a UNIX timestamp */
    readonly until?: number | undefined;
    /** Add timestamps to every log line */
    readonly timestamps?: boolean | undefined;
    /**
     * Only return this number of log lines from the end of the logs. Specify as
     * an integer or `all` to output all log lines.
     */
    readonly tail?: string | undefined;
}

/**
 * @since 1.0.0
 * @category Params
 */
export interface ContainerChangesOptions {
    /** ID or name of the container */
    readonly id: string;
}

/**
 * @since 1.0.0
 * @category Params
 */
export interface ContainerExportOptions {
    /** ID or name of the container */
    readonly id: string;
}

/**
 * @since 1.0.0
 * @category Params
 */
export interface ContainerStatsOptions {
    /** ID or name of the container */
    readonly id: string;
    /**
     * Stream the output. If false, the stats will be output once and then it
     * will disconnect.
     */
    readonly stream?: boolean | undefined;
    /**
     * Only get a single stat instead of waiting for 2 cycles. Must be used with
     * `stream=false`.
     */
    readonly "one-shot"?: boolean | undefined;
}

/**
 * @since 1.0.0
 * @category Params
 */
export interface ContainerResizeOptions {
    /** ID or name of the container */
    readonly id: string;
    /** Height of the TTY session in characters */
    readonly h?: number | undefined;
    /** Width of the TTY session in characters */
    readonly w?: number | undefined;
}

/**
 * @since 1.0.0
 * @category Params
 */
export interface ContainerStartOptions {
    /** ID or name of the container */
    readonly id: string;
    /**
     * Override the key sequence for detaching a container. Format is a single
     * character `[a-Z]` or `ctrl-<value>` where `<value>` is one of: `a-z`,
     * `@`, `^`, `[`, `,` or `_`.
     */
    readonly detachKeys?: string | undefined;
}

/**
 * @since 1.0.0
 * @category Params
 */
export interface ContainerStopOptions {
    /** ID or name of the container */
    readonly id: string;
    /** Signal to send to the container as an integer or string (e.g. `SIGINT`). */
    readonly signal?: string | undefined;
    /** Number of seconds to wait before killing the container */
    readonly t?: number | undefined;
}

/**
 * @since 1.0.0
 * @category Params
 */
export interface ContainerRestartOptions {
    /** ID or name of the container */
    readonly id: string;
    /** Signal to send to the container as an integer or string (e.g. `SIGINT`). */
    readonly signal?: string | undefined;
    /** Number of seconds to wait before killing the container */
    readonly t?: number | undefined;
}

/**
 * @since 1.0.0
 * @category Params
 */
export interface ContainerKillOptions {
    /** ID or name of the container */
    readonly id: string;
    /** Signal to send to the container as an integer or string (e.g. `SIGINT`). */
    readonly signal?: string | undefined;
}

/**
 * @since 1.0.0
 * @category Params
 */
export interface ContainerUpdateOptions {
    /** ID or name of the container */
    readonly id: string;
    readonly spec: ContainerConfig;
}

/**
 * @since 1.0.0
 * @category Params
 */
export interface ContainerRenameOptions {
    /** ID or name of the container */
    readonly id: string;
    /** New name for the container */
    readonly name: string;
}

/**
 * @since 1.0.0
 * @category Params
 */
export interface ContainerPauseOptions {
    /** ID or name of the container */
    readonly id: string;
}

/**
 * @since 1.0.0
 * @category Params
 */
export interface ContainerUnpauseOptions {
    /** ID or name of the container */
    readonly id: string;
}

/**
 * @since 1.0.0
 * @category Params
 */
export interface ContainerAttachOptions {
    /** ID or name of the container */
    readonly id: string;
    /**
     * Override the key sequence for detaching a container.Format is a single
     * character `[a-Z]` or `ctrl-<value>` where `<value>` is one of: `a-z`,
     * `@`, `^`, `[`, `,` or `_`.
     */
    readonly detachKeys?: string | undefined;
    /**
     * Replay previous logs from the container.
     *
     * This is useful for attaching to a container that has started and you want
     * to output everything since the container started.
     *
     * If `stream` is also enabled, once all the previous output has been
     * returned, it will seamlessly transition into streaming current output.
     */
    readonly logs?: boolean | undefined;
    /** Stream attached streams from the time the request was made onwards. */
    readonly stream?: boolean | undefined;
    /** Attach to `stdin` */
    readonly stdin?: boolean | undefined;
    /** Attach to `stdout` */
    readonly stdout?: boolean | undefined;
    /** Attach to `stderr` */
    readonly stderr?: boolean | undefined;
}

/**
 * @since 1.0.0
 * @category Params
 */
export interface ContainerAttachWebsocketOptions {
    /** ID or name of the container */
    readonly id: string;
    /**
     * Override the key sequence for detaching a container.Format is a single
     * character `[a-Z]` or `ctrl-<value>` where `<value>` is one of: `a-z`,
     * `@`, `^`, `[`, `,`, or `_`.
     */
    readonly detachKeys?: string | undefined;
    /** Return logs */
    readonly logs?: boolean | undefined;
    /** Return stream */
    readonly stream?: boolean | undefined;
    /** Attach to `stdin` */
    readonly stdin?: boolean | undefined;
    /** Attach to `stdout` */
    readonly stdout?: boolean | undefined;
    /** Attach to `stderr` */
    readonly stderr?: boolean | undefined;
}

/**
 * @since 1.0.0
 * @category Params
 */
export interface ContainerWaitOptions {
    /** ID or name of the container */
    readonly id: string;
    /**
     * Wait until a container state reaches the given condition.
     *
     * Defaults to `not-running` if omitted or empty.
     */
    readonly condition?: string | undefined;
}

/**
 * @since 1.0.0
 * @category Params
 */
export interface ContainerDeleteOptions {
    /** ID or name of the container */
    readonly id: string;
    /** Remove anonymous volumes associated with the container. */
    readonly v?: boolean | undefined;
    /** If the container is running, kill it before removing it. */
    readonly force?: boolean | undefined;
    /** Remove the specified link associated with the container. */
    readonly link?: boolean | undefined;
}

/**
 * @since 1.0.0
 * @category Params
 */
export interface ContainerArchiveOptions {
    /** ID or name of the container */
    readonly id: string;
    /** Resource in the container’s filesystem to archive. */
    readonly path: string;
}

/**
 * @since 1.0.0
 * @category Params
 */
export interface ContainerArchiveInfoOptions {
    /** ID or name of the container */
    readonly id: string;
    /** Resource in the container’s filesystem to archive. */
    readonly path: string;
}

/**
 * @since 1.0.0
 * @category Params
 */
export interface PutContainerArchiveOptions<E1> {
    /** ID or name of the container */
    readonly id: string;
    /**
     * Path to a directory in the container to extract the archive’s contents
     * into.
     */
    readonly path: string;
    /**
     * If `1`, `true`, or `True` then it will be an error if unpacking the given
     * content would cause an existing directory to be replaced with a
     * non-directory and vice versa.
     */
    readonly noOverwriteDirNonDir?: string | undefined;
    /** If `1`, `true`, then it will copy UID/GID maps to the dest file or dir */
    readonly copyUIDGID?: string | undefined;
    /**
     * The input stream must be a tar archive compressed with one of the
     * following algorithms: `identity` (no compression), `gzip`, `bzip2`, or
     * `xz`.
     */
    readonly stream: Stream.Stream<Uint8Array, E1, never>;
}

/**
 * @since 1.0.0
 * @category Params
 */
export interface ContainerPruneOptions {
    /**
     * Available filters:
     *
     * - `until=<timestamp>` Prune containers created before this timestamp. The
     *   `<timestamp>` can be Unix timestamps, date formatted timestamps, or Go
     *   duration strings (e.g. `10m`, `1h30m`) computed relative to the daemon
     *   machine’s time.
     * - `label` (`label=<key>`, `label=<key>=<value>`, `label!=<key>`, or
     *   `label!=<key>=<value>`) Prune containers with (or without, in case
     *   `label!=...` is used) the specified labels.
     */
    readonly filters?:
        | {
              until?: string;
              label?: Record<string, string> | undefined;
          }
        | undefined;
}

/**
 * @since 1.0.0
 * @category Tags
 */
export interface ContainersImpl {
    /**
     * List containers
     *
     * @param all - Return all containers. By default, only running containers
     *   are shown.
     * @param limit - Return this number of most recently created containers,
     *   including non-running ones.
     * @param size - Return the size of container as fields `SizeRw` and
     *   `SizeRootFs`.
     * @param filters - Filters to process on the container list
     *
     *   Available filters:
     *
     *   - `ancestor`=(`<image-name>[:<tag>]`, `<image id>`, or `<image@digest>`)
     *   - `before`=(`<container id>` or `<container name>`)
     *   - `expose`=(`<port>[/<proto>]`|`<startport-endport>/[<proto>]`)
     *   - `exited=<int>` containers with exit code of `<int>`
     *   - `health`=(`starting`|`healthy`|`unhealthy`|`none`)
     *   - `id=<ID>` a container's ID
     *   - `isolation=`(`default`|`process`|`hyperv`) (Windows daemon only)
     *   - `is-task=`(`true`|`false`)
     *   - `label=key` or `label="key=value"` of a container label
     *   - `name=<name>` a container's name
     *   - `network`=(`<network id>` or `<network name>`)
     *   - `publish`=(`<port>[/<proto>]`|`<startport-endport>/[<proto>]`)
     *   - `since`=(`<container id>` or `<container name>`)
     *   - `status=`(`created`|`restarting`|`running`|`removing`|`paused`|`exited`|`dead`)
     *   - `volume`=(`<volume name>` or `<mount point destination>`)
     */
    readonly list: (
        options?: ContainerListOptions | undefined
    ) => Effect.Effect<ReadonlyArray<ContainerListResponseItem>, ContainersError, never>;

    /**
     * Create a container
     *
     * @param name - Assign the specified name to the container. Must match
     *   `/?[a-zA-Z0-9][a-zA-Z0-9_.-]+`.
     * @param platform - Platform in the format `os[/arch[/variant]]` used for
     *   image lookup.
     *
     *   When specified, the daemon checks if the requested image is present in
     *   the local image cache with the given OS and Architecture, and otherwise
     *   returns a `404` status.
     *
     *   If the option is not set, the host's native OS and Architecture are used
     *   to look up the image in the image cache. However, if no platform is
     *   passed and the given image does exist in the local image cache, but its
     *   OS or architecture does not match, the container is created with the
     *   available image, and a warning is added to the `Warnings` field in the
     *   response, for example;
     *
     *   WARNING: The requested image's platform (linux/arm64/v8) does not match
     *   the detected host platform (linux/amd64) and no specific platform was
     *   requested
     * @param spec - Container to create
     */
    readonly create: (
        options: ContainerCreateOptions
    ) => Effect.Effect<ContainerCreateResponse, ContainersError, never>;

    /**
     * Inspect a container
     *
     * @param id - ID or name of the container
     * @param size - Return the size of container as fields `SizeRw` and
     *   `SizeRootFs`
     */
    readonly inspect: (
        options: ContainerInspectOptions
    ) => Effect.Effect<ContainerInspectResponse, ContainersError, never>;

    /**
     * List processes running inside a container
     *
     * @param id - ID or name of the container
     * @param ps_args - The arguments to pass to `ps`. For example, `aux`
     */
    readonly top: (options: ContainerTopOptions) => Effect.Effect<ContainerTopResponse, ContainersError, never>;

    /**
     * Get container logs
     *
     * @param id - ID or name of the container
     * @param follow - Keep connection after returning logs.
     * @param stdout - Return logs from `stdout`
     * @param stderr - Return logs from `stderr`
     * @param since - Only return logs since this time, as a UNIX timestamp
     * @param until - Only return logs before this time, as a UNIX timestamp
     * @param timestamps - Add timestamps to every log line
     * @param tail - Only return this number of log lines from the end of the
     *   logs. Specify as an integer or `all` to output all log lines.
     */
    readonly logs: (options: ContainerLogsOptions) => Stream.Stream<string, ContainersError, never>;

    /**
     * Get changes on a container’s filesystem
     *
     * @param id - ID or name of the container
     */
    readonly changes: (
        options: ContainerChangesOptions
    ) => Effect.Effect<ReadonlyArray<ContainerChange> | null, ContainersError, never>;

    /**
     * Export a container
     *
     * @param id - ID or name of the container
     */
    readonly export: (options: ContainerExportOptions) => Stream.Stream<Uint8Array, ContainersError, never>;

    /**
     * Get container stats based on resource usage
     *
     * @param id - ID or name of the container
     * @param stream - Stream the output. If false, the stats will be output
     *   once and then it will disconnect.
     * @param one-shot - Only get a single stat instead of waiting for 2 cycles.
     *   Must be used with `stream=false`.
     */
    readonly stats: (options: ContainerStatsOptions) => Stream.Stream<ContainerStatsResponse, ContainersError, never>;

    /**
     * Resize a container TTY
     *
     * @param id - ID or name of the container
     * @param h - Height of the TTY session in characters
     * @param w - Width of the TTY session in characters
     */
    readonly resize: (options: ContainerResizeOptions) => Effect.Effect<void, ContainersError, never>;

    /**
     * Start a container
     *
     * @param id - ID or name of the container
     * @param detachKeys - Override the key sequence for detaching a container.
     *   Format is a single character `[a-Z]` or `ctrl-<value>` where `<value>`
     *   is one of: `a-z`, `@`, `^`, `[`, `,` or `_`.
     */
    readonly start: (options: ContainerStartOptions) => Effect.Effect<void, ContainersError, never>;

    /**
     * Stop a container
     *
     * @param id - ID or name of the container
     * @param signal - Signal to send to the container as an integer or string
     *   (e.g. `SIGINT`).
     * @param t - Number of seconds to wait before killing the container
     */
    readonly stop: (options: ContainerStopOptions) => Effect.Effect<void, ContainersError, never>;

    /**
     * Restart a container
     *
     * @param id - ID or name of the container
     * @param signal - Signal to send to the container as an integer or string
     *   (e.g. `SIGINT`).
     * @param t - Number of seconds to wait before killing the container
     */
    readonly restart: (options: ContainerRestartOptions) => Effect.Effect<void, ContainersError, never>;

    /**
     * Kill a container
     *
     * @param id - ID or name of the container
     * @param signal - Signal to send to the container as an integer or string
     *   (e.g. `SIGINT`).
     */
    readonly kill: (options: ContainerKillOptions) => Effect.Effect<void, ContainersError, never>;

    /**
     * Update a container
     *
     * @param id - ID or name of the container
     * @param spec -
     */
    readonly update: (
        options: ContainerUpdateOptions
    ) => Effect.Effect<ContainerUpdateResponse, ContainersError, never>;

    /**
     * Rename a container
     *
     * @param id - ID or name of the container
     * @param name - New name for the container
     */
    readonly rename: (options: ContainerRenameOptions) => Effect.Effect<void, ContainersError, never>;

    /**
     * Pause a container
     *
     * @param id - ID or name of the container
     */
    readonly pause: (options: ContainerPauseOptions) => Effect.Effect<void, ContainersError, never>;

    /**
     * Unpause a container
     *
     * @param id - ID or name of the container
     */
    readonly unpause: (options: ContainerUnpauseOptions) => Effect.Effect<void, ContainersError, never>;

    /**
     * Attach to a container
     *
     * @param id - ID or name of the container
     * @param detachKeys - Override the key sequence for detaching a
     *   container.Format is a single character `[a-Z]` or `ctrl-<value>` where
     *   `<value>` is one of: `a-z`, `@`, `^`, `[`, `,` or `_`.
     * @param logs - Replay previous logs from the container.
     *
     *   This is useful for attaching to a container that has started and you want
     *   to output everything since the container started.
     *
     *   If `stream` is also enabled, once all the previous output has been
     *   returned, it will seamlessly transition into streaming current output.
     * @param stream - Stream attached streams from the time the request was
     *   made onwards.
     * @param stdin - Attach to `stdin`
     * @param stdout - Attach to `stdout`
     * @param stderr - Attach to `stderr`
     */
    readonly attach: (
        options: ContainerAttachOptions
    ) => Effect.Effect<BidirectionalRawStreamSocket | MultiplexedStreamSocket, ContainersError, Scope.Scope>;

    /**
     * Attach to a container via a websocket
     *
     * @param id - ID or name of the container
     * @param detachKeys - Override the key sequence for detaching a
     *   container.Format is a single character `[a-Z]` or `ctrl-<value>` where
     *   `<value>` is one of: `a-z`, `@`, `^`, `[`, `,`, or `_`.
     * @param logs - Return logs
     * @param stream - Return stream
     * @param stdin - Attach to `stdin`
     * @param stdout - Attach to `stdout`
     * @param stderr - Attach to `stderr`
     */
    readonly attachWebsocket: (
        options: ContainerAttachWebsocketOptions
    ) => Effect.Effect<void, ContainersError, Scope.Scope>;

    /**
     * Wait for a container
     *
     * @param id - ID or name of the container
     * @param condition - Wait until a container state reaches the given
     *   condition.
     *
     *   Defaults to `not-running` if omitted or empty.
     */
    readonly wait: (options: ContainerWaitOptions) => Effect.Effect<ContainerWaitResponse, ContainersError, never>;

    /**
     * Remove a container
     *
     * @param id - ID or name of the container
     * @param v - Remove anonymous volumes associated with the container.
     * @param force - If the container is running, kill it before removing it.
     * @param link - Remove the specified link associated with the container.
     */
    readonly delete: (options: ContainerDeleteOptions) => Effect.Effect<void, ContainersError, never>;

    /**
     * Get an archive of a filesystem resource in a container
     *
     * @param id - ID or name of the container
     * @param path - Resource in the container’s filesystem to archive.
     */
    readonly archive: (options: ContainerArchiveOptions) => Stream.Stream<Uint8Array, ContainersError, never>;

    /**
     * Get information about files in a container
     *
     * @param id - ID or name of the container
     * @param path - Resource in the container’s filesystem to archive.
     */
    readonly archiveInfo: (options: ContainerArchiveInfoOptions) => Effect.Effect<void, ContainersError, never>;

    /**
     * Extract an archive of files or folders to a directory in a container
     *
     * @param id - ID or name of the container
     * @param path - Path to a directory in the container to extract the
     *   archive’s contents into.
     * @param noOverwriteDirNonDir - If `1`, `true`, or `True` then it will be
     *   an error if unpacking the given content would cause an existing
     *   directory to be replaced with a non-directory and vice versa.
     * @param copyUIDGID - If `1`, `true`, then it will copy UID/GID maps to the
     *   dest file or dir
     * @param stream - The input stream must be a tar archive compressed with
     *   one of the following algorithms: `identity` (no compression), `gzip`,
     *   `bzip2`, or `xz`.
     */
    readonly putArchive: <E1>(options: PutContainerArchiveOptions<E1>) => Effect.Effect<void, ContainersError, never>;

    /**
     * Delete stopped containers
     *
     * @param filters - Filters to process on the prune list. Available filters:
     *
     *   - `until=<timestamp>` Prune containers created before this timestamp. The
     *       `<timestamp>` can be Unix timestamps, date formatted timestamps, or
     *       Go duration strings (e.g. `10m`, `1h30m`) computed relative to the
     *       daemon machine’s time.
     *   - `label` (`label=<key>`, `label=<key>=<value>`, `label!=<key>`, or
     *       `label!=<key>=<value>`) Prune containers with (or without, in case
     *       `label!=...` is used) the specified labels.
     */
    readonly prune: (
        options?: ContainerPruneOptions | undefined
    ) => Effect.Effect<ContainerPruneResponse, ContainersError, never>;
}

/**
 * @since 1.0.0
 * @category Services
 */
export const make: Effect.Effect<ContainersImpl, never, HttpClient.HttpClient.Default> = Effect.gen(function* () {
    const contextClient = yield* HttpClient.HttpClient;
    const client = contextClient.pipe(HttpClient.filterStatusOk);
    const voidClient = client.pipe(HttpClient.transform(Effect.asVoid));

    const list_ = (
        options?: ContainerListOptions | undefined
    ): Effect.Effect<ReadonlyArray<ContainerListResponseItem>, ContainersError, never> =>
        Function.pipe(
            HttpClientRequest.get("/containers/json"),
            maybeAddQueryParameter("all", Option.fromNullable(options?.all)),
            maybeAddQueryParameter("limit", Option.fromNullable(options?.limit)),
            maybeAddQueryParameter("size", Option.fromNullable(options?.size)),
            maybeAddFilters(options?.filters),
            client,
            HttpClientResponse.schemaBodyJsonScoped(Schema.Array(ContainerListResponseItem)),
            Effect.mapError((cause) => new ContainersError({ method: "list", cause }))
        );

    const create_ = (options: ContainerCreateOptions): Effect.Effect<ContainerCreateResponse, ContainersError, never> =>
        Function.pipe(
            Schema.decode(ContainerCreateRequest)(options.spec),
            Effect.map((body) => Tuple.make(HttpClientRequest.post("/containers/create"), body)),
            Effect.map(Tuple.mapFirst(maybeAddQueryParameter("name", Option.fromNullable(options.name)))),
            Effect.map(Tuple.mapFirst(maybeAddQueryParameter("platform", Option.fromNullable(options.platform)))),
            Effect.flatMap(Function.tupled(HttpClientRequest.schemaBody(ContainerCreateRequest))),
            Effect.flatMap(client),
            HttpClientResponse.schemaBodyJsonScoped(ContainerCreateResponse),
            Effect.mapError((cause) => new ContainersError({ method: "create", cause }))
        );

    const inspect_ = (
        options: ContainerInspectOptions
    ): Effect.Effect<ContainerInspectResponse, ContainersError, never> =>
        Function.pipe(
            HttpClientRequest.get(`/containers/${encodeURIComponent(options.id)}/json`),
            maybeAddQueryParameter("size", Option.fromNullable(options.size)),
            client,
            HttpClientResponse.schemaBodyJsonScoped(ContainerInspectResponse),
            Effect.mapError((cause) => new ContainersError({ method: "inspect", cause })),
            Effect.scoped
        );

    const top_ = (options: ContainerTopOptions): Effect.Effect<ContainerTopResponse, ContainersError, never> =>
        Function.pipe(
            HttpClientRequest.get(`/containers/${encodeURIComponent(options.id)}/top`),
            maybeAddQueryParameter("ps_args", Option.fromNullable(options.ps_args)),
            client,
            HttpClientResponse.schemaBodyJsonScoped(ContainerTopResponse),
            Effect.mapError((cause) => new ContainersError({ method: "top", cause })),
            Effect.scoped
        );

    const logs_ = (options: ContainerLogsOptions): Stream.Stream<string, ContainersError, never> =>
        Function.pipe(
            HttpClientRequest.get(`/containers/${encodeURIComponent(options.id)}/logs`),
            maybeAddQueryParameter("follow", Option.fromNullable(options.follow)),
            maybeAddQueryParameter("stdout", Option.fromNullable(options.stdout)),
            maybeAddQueryParameter("stderr", Option.fromNullable(options.stderr)),
            maybeAddQueryParameter("since", Option.fromNullable(options.since)),
            maybeAddQueryParameter("until", Option.fromNullable(options.until)),
            maybeAddQueryParameter("timestamps", Option.fromNullable(options.timestamps)),
            maybeAddQueryParameter("tail", Option.fromNullable(options.tail)),
            client,
            HttpClientResponse.stream,
            Stream.decodeText("utf8"),
            Stream.mapError((cause) => new ContainersError({ method: "logs", cause }))
        );

    const changes_ = (
        options: ContainerChangesOptions
    ): Effect.Effect<ReadonlyArray<ContainerChange> | null, ContainersError> =>
        Function.pipe(
            HttpClientRequest.get(`/containers/${encodeURIComponent(options.id)}/changes`),
            client,
            HttpClientResponse.schemaBodyJsonScoped(Schema.NullOr(Schema.Array(ContainerChange))),
            Effect.mapError((cause) => new ContainersError({ method: "changes", cause })),
            Effect.scoped
        );

    const export_ = (options: ContainerExportOptions): Stream.Stream<Uint8Array, ContainersError, never> =>
        Function.pipe(
            HttpClientRequest.get(`/containers/${encodeURIComponent(options.id)}/export`),
            client,
            HttpClientResponse.stream,
            Stream.mapError((cause) => new ContainersError({ method: "export", cause }))
        );

    const stats_ = (options: ContainerStatsOptions): Stream.Stream<ContainerStatsResponse, ContainersError, never> =>
        Function.pipe(
            HttpClientRequest.get(`/containers/${encodeURIComponent(options.id)}/stats`),
            maybeAddQueryParameter("stream", Option.fromNullable(options.stream)),
            maybeAddQueryParameter("one-shot", Option.fromNullable(options["one-shot"])),
            client,
            HttpClientResponse.stream,
            Stream.decodeText("utf8"),
            Stream.mapEffect(Schema.decode(Schema.parseJson(ContainerStatsResponse))),
            Stream.mapError((cause) => new ContainersError({ method: "stats", cause }))
        );

    const resize_ = (options: ContainerResizeOptions): Effect.Effect<void, ContainersError, never> =>
        Function.pipe(
            HttpClientRequest.post(`/containers/${encodeURIComponent(options.id)}/resize`),
            maybeAddQueryParameter("h", Option.fromNullable(options.h)),
            maybeAddQueryParameter("w", Option.fromNullable(options.w)),
            voidClient,
            Effect.mapError((cause) => new ContainersError({ method: "resize", cause })),
            Effect.scoped
        );

    const start_ = (options: ContainerStartOptions): Effect.Effect<void, ContainersError, never> =>
        Function.pipe(
            HttpClientRequest.post(`/containers/${encodeURIComponent(options.id)}/start`),
            maybeAddQueryParameter("detachKeys", Option.fromNullable(options.detachKeys)),
            voidClient,
            Effect.mapError((cause) => new ContainersError({ method: "start", cause })),
            Effect.scoped
        );

    const stop_ = (options: ContainerStopOptions): Effect.Effect<void, ContainersError, never> =>
        Function.pipe(
            HttpClientRequest.post(`/containers/${encodeURIComponent(options.id)}/stop`),
            maybeAddQueryParameter("signal", Option.fromNullable(options.signal)),
            maybeAddQueryParameter("t", Option.fromNullable(options.t)),
            voidClient,
            Effect.mapError((cause) => new ContainersError({ method: "stop", cause })),
            Effect.scoped
        );

    const restart_ = (options: ContainerRestartOptions): Effect.Effect<void, ContainersError, never> =>
        Function.pipe(
            HttpClientRequest.post(`/containers/${encodeURIComponent(options.id)}/restart`),
            maybeAddQueryParameter("signal", Option.fromNullable(options.signal)),
            maybeAddQueryParameter("t", Option.fromNullable(options.t)),
            voidClient,
            Effect.mapError((cause) => new ContainersError({ method: "restart", cause })),
            Effect.scoped
        );

    const kill_ = (options: ContainerKillOptions): Effect.Effect<void, ContainersError, never> =>
        Function.pipe(
            HttpClientRequest.post(`/containers/${encodeURIComponent(options.id)}/kill`),
            maybeAddQueryParameter("signal", Option.fromNullable(options.signal)),
            voidClient,
            Effect.mapError((cause) => new ContainersError({ method: "kill", cause })),
            Effect.scoped
        );

    const update_ = (options: ContainerUpdateOptions): Effect.Effect<ContainerUpdateResponse, ContainersError, never> =>
        Function.pipe(
            HttpClientRequest.post(`/containers/${encodeURIComponent(options.id)}/update`),
            HttpClientRequest.schemaBody(ContainerConfig)(options.spec),
            Effect.flatMap(client),
            HttpClientResponse.schemaBodyJsonScoped(ContainerUpdateResponse),
            Effect.mapError((cause) => new ContainersError({ method: "update", cause })),
            Effect.scoped
        );

    const rename_ = (options: ContainerRenameOptions): Effect.Effect<void, ContainersError, never> =>
        Function.pipe(
            HttpClientRequest.post(`/containers/${encodeURIComponent(options.id)}/rename`),
            maybeAddQueryParameter("name", Option.fromNullable(options.name)),
            voidClient,
            Effect.mapError((cause) => new ContainersError({ method: "rename", cause })),
            Effect.scoped
        );

    const pause_ = (options: ContainerPauseOptions): Effect.Effect<void, ContainersError, never> =>
        Function.pipe(
            HttpClientRequest.post(`/containers/${encodeURIComponent(options.id)}/pause`),
            voidClient,
            Effect.mapError((cause) => new ContainersError({ method: "pause", cause })),
            Effect.scoped
        );

    const unpause_ = (options: ContainerUnpauseOptions): Effect.Effect<void, ContainersError, never> =>
        Function.pipe(
            HttpClientRequest.post(`/containers/${encodeURIComponent(options.id)}/unpause`),
            voidClient,
            Effect.mapError((cause) => new ContainersError({ method: "unpause", cause })),
            Effect.scoped
        );

    const attach_ = (
        options: ContainerAttachOptions
    ): Effect.Effect<BidirectionalRawStreamSocket | MultiplexedStreamSocket, ContainersError, Scope.Scope> =>
        Function.pipe(
            HttpClientRequest.post(`/containers/${encodeURIComponent(options.id)}/attach`),
            maybeAddQueryParameter("detachKeys", Option.fromNullable(options.detachKeys)),
            maybeAddQueryParameter("logs", Option.fromNullable(options.logs)),
            maybeAddQueryParameter("stream", Option.fromNullable(options.stream)),
            maybeAddQueryParameter("stdin", Option.fromNullable(options.stdin)),
            maybeAddQueryParameter("stdout", Option.fromNullable(options.stdout)),
            maybeAddQueryParameter("stderr", Option.fromNullable(options.stderr)),
            client,
            Effect.flatMap((response) => responseToStreamingSocketOrFail(response)),
            Effect.mapError((cause) => new ContainersError({ method: "attach", cause }))
        );

    const attachWebsocket_ = (
        options: ContainerAttachWebsocketOptions
    ): Effect.Effect<UnidirectionalRawStreamSocket, ContainersError, Scope.Scope> =>
        Function.pipe(
            // FIXME: needs to be a websocket
            HttpClientRequest.get(`/containers/${encodeURIComponent(options.id)}/attach/ws`),
            maybeAddQueryParameter("detachKeys", Option.fromNullable(options.detachKeys)),
            maybeAddQueryParameter("logs", Option.fromNullable(options.logs)),
            maybeAddQueryParameter("stream", Option.fromNullable(options.stream)),
            maybeAddQueryParameter("stdin", Option.fromNullable(options.stdin)),
            maybeAddQueryParameter("stdout", Option.fromNullable(options.stdout)),
            maybeAddQueryParameter("stderr", Option.fromNullable(options.stderr)),
            client,
            Effect.flatMap(responseToRawStreamSocketOrFail({ sourceIsKnownUnidirectional: true })),
            Effect.mapError((cause) => new ContainersError({ method: "attachWebsocket", cause }))
        );

    const wait_ = (options: ContainerWaitOptions): Effect.Effect<ContainerWaitResponse, ContainersError, never> =>
        Function.pipe(
            HttpClientRequest.post(`/containers/${encodeURIComponent(options.id)}/wait`),
            maybeAddQueryParameter("condition", Option.fromNullable(options.condition)),
            client,
            HttpClientResponse.schemaBodyJsonScoped(ContainerWaitResponse),
            Effect.mapError((cause) => new ContainersError({ method: "wait", cause }))
        );

    const delete_ = (options: ContainerDeleteOptions): Effect.Effect<void, ContainersError, never> =>
        Function.pipe(
            HttpClientRequest.del(`/containers/${encodeURIComponent(options.id)}`),
            maybeAddQueryParameter("v", Option.fromNullable(options.v)),
            maybeAddQueryParameter("force", Option.fromNullable(options.force)),
            maybeAddQueryParameter("link", Option.fromNullable(options.link)),
            voidClient,
            Effect.mapError((cause) => new ContainersError({ method: "delete", cause })),
            Effect.scoped
        );

    const archive_ = (options: ContainerArchiveOptions): Stream.Stream<Uint8Array, ContainersError, never> =>
        Function.pipe(
            HttpClientRequest.get(`/containers/${encodeURIComponent(options.id)}/archive`),
            maybeAddQueryParameter("path", Option.some(options.path)),
            client,
            HttpClientResponse.stream,
            Stream.mapError((cause) => new ContainersError({ method: "archive", cause }))
        );

    const archiveInfo_ = (options: ContainerArchiveInfoOptions): Effect.Effect<void, ContainersError, never> =>
        Function.pipe(
            HttpClientRequest.head(`/containers/${encodeURIComponent(options.id)}/archive`),
            maybeAddQueryParameter("path", Option.some(options.path)),
            client,
            Effect.mapError((cause) => new ContainersError({ method: "archiveInfo", cause })),
            Effect.scoped
        );

    const putArchive_ = <E1>(options: PutContainerArchiveOptions<E1>): Effect.Effect<void, ContainersError, never> =>
        Function.pipe(
            HttpClientRequest.put(`/containers/${encodeURIComponent(options.id)}/archive`),
            maybeAddQueryParameter("path", Option.some(options.path)),
            maybeAddQueryParameter("noOverwriteDirNonDir", Option.fromNullable(options.noOverwriteDirNonDir)),
            maybeAddQueryParameter("copyUIDGID", Option.fromNullable(options.copyUIDGID)),
            HttpClientRequest.streamBody(options.stream),
            client,
            Effect.mapError((cause) => new ContainersError({ method: "putArchive", cause })),
            Effect.scoped
        );

    const prune_ = (
        options?: ContainerPruneOptions | undefined
    ): Effect.Effect<ContainerPruneResponse, ContainersError, never> =>
        Function.pipe(
            HttpClientRequest.post("/containers/prune"),
            maybeAddFilters(options?.filters),
            client,
            HttpClientResponse.schemaBodyJsonScoped(ContainerPruneResponse),
            Effect.mapError((cause) => new ContainersError({ method: "prune", cause }))
        );

    return {
        list: list_,
        create: create_,
        inspect: inspect_,
        top: top_,
        logs: logs_,
        changes: changes_,
        export: export_,
        stats: stats_,
        resize: resize_,
        start: start_,
        stop: stop_,
        restart: restart_,
        kill: kill_,
        update: update_,
        rename: rename_,
        pause: pause_,
        unpause: unpause_,
        attach: attach_,
        attachWebsocket: attachWebsocket_,
        wait: wait_,
        delete: delete_,
        archive: archive_,
        archiveInfo: archiveInfo_,
        putArchive: putArchive_,
        prune: prune_,
    };
});

/**
 * Containers service
 *
 * @since 1.0.0
 * @category Tags
 */
export class Containers extends Effect.Tag("@the-moby-effect/endpoints/Containers")<Containers, ContainersImpl>() {}

/**
 * Containers layer that depends on a Moby connection agent
 *
 * @since 1.0.0
 * @category Layers
 */
export const layer: Layer.Layer<Containers, never, HttpClient.HttpClient.Default> = Layer.effect(Containers, make);
