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
import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as Layer from "effect/Layer";
import * as Option from "effect/Option";
import * as Predicate from "effect/Predicate";
import * as Scope from "effect/Scope";
import * as Stream from "effect/Stream";

import { MultiplexedStreamSocket, RawStreamSocket, responseToStreamingSocketOrFail } from "../demux/index.js";
import {
    ContainerCreateResponse,
    ContainerCreateSpec,
    ContainerInspectResponse,
    ContainerPruneResponse,
    ContainerState,
    ContainerSummary,
    ContainerUpdateResponse,
    ContainerUpdateSpec,
    ContainerWaitResponse,
    FilesystemChange,
    Health,
    HostConfig,
} from "../schemas/MobySchemas.js";
import { maybeAddQueryParameter } from "./Common.js";

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
export class ContainersError extends PlatformError.RefailError(ContainersErrorTypeId, "ContainersError")<{
    method: string;
    error: ParseResult.ParseError | HttpClientError.HttpClientError | HttpBody.HttpBodyError | Socket.SocketError;
}> {
    get message() {
        return `${this.method}: ${super.message}`;
    }
}

/**
 * @since 1.0.0
 * @category Params
 */
export interface ContainerListOptions {
    /** Return all containers. By default, only running containers are shown. */
    readonly all?: boolean;

    /**
     * Return this number of most recently created containers, including
     * non-running ones.
     */
    readonly limit?: number;

    /** Return the size of container as fields `SizeRw` and `SizeRootFs`. */
    readonly size?: boolean;

    /**
     * Filters to process on the container list, encoded as JSON (a
     * `map[string][]string`). For example, `{"status": ["paused"]}` will only
     * return paused containers.
     *
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
    readonly filters?: {
        ancestor?: Array<string> | undefined;
        before?: Array<string> | undefined;
        expose?: Array<`${number}/${string}` | `${number}-${number}/${string}`> | undefined;
        exited?: Array<number> | undefined;
        health?: Array<NonNullable<Schema.Schema.Encoded<typeof Health>["Status"]>> | undefined;
        id?: Array<string> | undefined;
        isolation?: Array<NonNullable<Schema.Schema.Encoded<typeof HostConfig>["Isolation"]>> | undefined;
        "is-task"?: ["true" | "false"] | undefined;
        label?: Array<string> | undefined;
        name?: Array<string> | undefined;
        network?: Array<string> | undefined;
        publish?: Array<`${number}/${string}` | `${number}-${number}/${string}`> | undefined;
        since?: Array<string> | undefined;
        status?: Array<NonNullable<Schema.Schema.Encoded<typeof ContainerState>["Status"]>> | undefined;
        volume?: Array<string> | undefined;
    };
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
    readonly name?: string;
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
    readonly platform?: string;
    /** Container to create */
    readonly spec: Schema.Schema.Type<typeof ContainerCreateSpec>;
}

/**
 * @since 1.0.0
 * @category Params
 */
export interface ContainerInspectOptions {
    /** ID or name of the container */
    readonly id: string;
    /** Return the size of container as fields `SizeRw` and `SizeRootFs` */
    readonly size?: boolean;
}

/**
 * @since 1.0.0
 * @category Params
 */
export interface ContainerTopOptions {
    /** ID or name of the container */
    readonly id: string;
    /** The arguments to pass to `ps`. For example, `aux` */
    readonly ps_args?: string;
}

/**
 * @since 1.0.0
 * @category Params
 */
export interface ContainerLogsOptions {
    /** ID or name of the container */
    readonly id: string;
    /** Keep connection after returning logs. */
    readonly follow?: boolean;
    /** Return logs from `stdout` */
    readonly stdout?: boolean;
    /** Return logs from `stderr` */
    readonly stderr?: boolean;
    /** Only return logs since this time, as a UNIX timestamp */
    readonly since?: number;
    /** Only return logs before this time, as a UNIX timestamp */
    readonly until?: number;
    /** Add timestamps to every log line */
    readonly timestamps?: boolean;
    /**
     * Only return this number of log lines from the end of the logs. Specify as
     * an integer or `all` to output all log lines.
     */
    readonly tail?: string;
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
    readonly stream?: boolean;
    /**
     * Only get a single stat instead of waiting for 2 cycles. Must be used with
     * `stream=false`.
     */
    readonly "one-shot"?: boolean;
}

/**
 * @since 1.0.0
 * @category Params
 */
export interface ContainerResizeOptions {
    /** ID or name of the container */
    readonly id: string;
    /** Height of the TTY session in characters */
    readonly h?: number;
    /** Width of the TTY session in characters */
    readonly w?: number;
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
    readonly detachKeys?: string;
}

/**
 * @since 1.0.0
 * @category Params
 */
export interface ContainerStopOptions {
    /** ID or name of the container */
    readonly id: string;
    /** Signal to send to the container as an integer or string (e.g. `SIGINT`). */
    readonly signal?: string;
    /** Number of seconds to wait before killing the container */
    readonly t?: number;
}

/**
 * @since 1.0.0
 * @category Params
 */
export interface ContainerRestartOptions {
    /** ID or name of the container */
    readonly id: string;
    /** Signal to send to the container as an integer or string (e.g. `SIGINT`). */
    readonly signal?: string;
    /** Number of seconds to wait before killing the container */
    readonly t?: number;
}

/**
 * @since 1.0.0
 * @category Params
 */
export interface ContainerKillOptions {
    /** ID or name of the container */
    readonly id: string;
    /** Signal to send to the container as an integer or string (e.g. `SIGINT`). */
    readonly signal?: string;
}

/**
 * @since 1.0.0
 * @category Params
 */
export interface ContainerUpdateOptions {
    /** ID or name of the container */
    readonly id: string;
    readonly spec: Schema.Schema.Encoded<typeof ContainerUpdateSpec>;
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
    readonly detachKeys?: string;
    /**
     * Replay previous logs from the container.
     *
     * This is useful for attaching to a container that has started and you want
     * to output everything since the container started.
     *
     * If `stream` is also enabled, once all the previous output has been
     * returned, it will seamlessly transition into streaming current output.
     */
    readonly logs?: boolean;
    /** Stream attached streams from the time the request was made onwards. */
    readonly stream?: boolean;
    /** Attach to `stdin` */
    readonly stdin?: boolean;
    /** Attach to `stdout` */
    readonly stdout?: boolean;
    /** Attach to `stderr` */
    readonly stderr?: boolean;
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
    readonly detachKeys?: string;
    /** Return logs */
    readonly logs?: boolean;
    /** Return stream */
    readonly stream?: boolean;
    /** Attach to `stdin` */
    readonly stdin?: boolean;
    /** Attach to `stdout` */
    readonly stdout?: boolean;
    /** Attach to `stderr` */
    readonly stderr?: boolean;
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
    readonly condition?: string;
}

/**
 * @since 1.0.0
 * @category Params
 */
export interface ContainerDeleteOptions {
    /** ID or name of the container */
    readonly id: string;
    /** Remove anonymous volumes associated with the container. */
    readonly v?: boolean;
    /** If the container is running, kill it before removing it. */
    readonly force?: boolean;
    /** Remove the specified link associated with the container. */
    readonly link?: boolean;
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
export interface PutContainerArchiveOptions {
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
    readonly noOverwriteDirNonDir?: string;
    /** If `1`, `true`, then it will copy UID/GID maps to the dest file or dir */
    readonly copyUIDGID?: string;
    /**
     * The input stream must be a tar archive compressed with one of the
     * following algorithms: `identity` (no compression), `gzip`, `bzip2`, or
     * `xz`.
     */
    readonly stream: Stream.Stream<Uint8Array, ContainersError, never>;
}

/**
 * @since 1.0.0
 * @category Params
 */
export interface ContainerPruneOptions {
    /**
     * Filters to process on the prune list, encoded as JSON (a
     * `map[string][]string`).
     *
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
    readonly filters?: string;
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
     * @param filters - Filters to process on the container list, encoded as
     *   JSON (a `map[string][]string`). For example, `{"status": ["paused"]}`
     *   will only return paused containers.
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
    ) => Effect.Effect<Readonly<Array<ContainerSummary>>, ContainersError, never>;

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
    readonly top: (options: ContainerTopOptions) => Effect.Effect<unknown, ContainersError, never>;

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
    ) => Effect.Effect<Readonly<Array<FilesystemChange>>, ContainersError, never>;

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
    readonly stats: (options: ContainerStatsOptions) => Stream.Stream<unknown, ContainersError, never>;

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
    ) => Effect.Effect<RawStreamSocket | MultiplexedStreamSocket, ContainersError, Scope.Scope>;

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
    readonly putArchive: (options: PutContainerArchiveOptions) => Effect.Effect<void, ContainersError, never>;

    /**
     * Delete stopped containers
     *
     * @param filters - Filters to process on the prune list, encoded as JSON (a
     *   `map[string][]string`).
     *
     *   Available filters:
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
    const defaultClient = yield* HttpClient.HttpClient;

    const client = defaultClient.pipe(
        HttpClient.mapRequest(HttpClientRequest.prependUrl("/containers")),
        HttpClient.filterStatusOk
    );

    const voidClient = client.pipe(HttpClient.transform(Effect.asVoid));
    const unknownClient = client.pipe(HttpClient.mapEffect(HttpClientResponse.schemaBodyJson(Schema.Unknown)));
    const ContainerSummariesClient = client.pipe(
        HttpClient.mapEffect(HttpClientResponse.schemaBodyJson(Schema.Array(ContainerSummary)))
    );
    const ContainerCreateResponseClient = client.pipe(
        HttpClient.mapEffect(HttpClientResponse.schemaBodyJson(ContainerCreateResponse))
    );
    const ContainerInspectResponseClient = client.pipe(
        HttpClient.mapEffect(HttpClientResponse.schemaBodyJson(ContainerInspectResponse))
    );
    const FilesystemChangesClient = client.pipe(
        HttpClient.mapEffect(HttpClientResponse.schemaBodyJson(Schema.NullOr(Schema.Array(FilesystemChange))))
    );
    const ContainerUpdateResponseClient = client.pipe(
        HttpClient.mapEffect(HttpClientResponse.schemaBodyJson(ContainerUpdateResponse))
    );
    const ContainerWaitResponseClient = client.pipe(
        HttpClient.mapEffect(HttpClientResponse.schemaBodyJson(ContainerWaitResponse))
    );
    const ContainerPruneResponseClient = client.pipe(
        HttpClient.mapEffect(HttpClientResponse.schemaBodyJson(ContainerPruneResponse))
    );

    const list_ = (
        options?: ContainerListOptions | undefined
    ): Effect.Effect<Readonly<Array<ContainerSummary>>, ContainersError, never> =>
        Function.pipe(
            HttpClientRequest.get("/json"),
            maybeAddQueryParameter("all", Option.fromNullable(options?.all)),
            maybeAddQueryParameter("limit", Option.fromNullable(options?.limit)),
            maybeAddQueryParameter("size", Option.fromNullable(options?.size)),
            maybeAddQueryParameter(
                "filters",
                Function.pipe(options?.filters, Option.fromNullable, Option.map(JSON.stringify))
            ),
            ContainerSummariesClient,
            Effect.mapError((error) => new ContainersError({ method: "list", error })),
            Effect.scoped
        );

    const create_ = (options: ContainerCreateOptions): Effect.Effect<ContainerCreateResponse, ContainersError, never> =>
        Function.pipe(
            HttpClientRequest.post("/create"),
            maybeAddQueryParameter("name", Option.fromNullable(options.name)),
            maybeAddQueryParameter("platform", Option.fromNullable(options.platform)),
            // FIXME: !!!!
            HttpClientRequest.schemaBody(ContainerCreateSpec)(Schema.decodeSync(ContainerCreateSpec)(options.spec)),
            Effect.flatMap(ContainerCreateResponseClient),
            Effect.mapError((error) => new ContainersError({ method: "create", error })),
            Effect.scoped
        );

    const inspect_ = (
        options: ContainerInspectOptions
    ): Effect.Effect<ContainerInspectResponse, ContainersError, never> =>
        Function.pipe(
            HttpClientRequest.get(`/${encodeURIComponent(options.id)}/json`),
            maybeAddQueryParameter("size", Option.fromNullable(options.size)),
            ContainerInspectResponseClient,
            Effect.mapError((error) => new ContainersError({ method: "inspect", error })),
            Effect.scoped
        );

    const top_ = (options: ContainerTopOptions): Effect.Effect<unknown, ContainersError, never> =>
        Function.pipe(
            HttpClientRequest.get(`/${encodeURIComponent(options.id)}/top`),
            maybeAddQueryParameter("ps_args", Option.fromNullable(options.ps_args)),
            unknownClient,
            Effect.mapError((error) => new ContainersError({ method: "top", error })),
            Effect.scoped
        );

    const logs_ = (options: ContainerLogsOptions): Stream.Stream<string, ContainersError, never> =>
        Function.pipe(
            HttpClientRequest.get(`/${encodeURIComponent(options.id)}/logs`),
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
            Stream.mapError((error) => new ContainersError({ method: "logs", error }))
        );

    const changes_ = (
        options: ContainerChangesOptions
    ): Effect.Effect<ReadonlyArray<FilesystemChange>, ContainersError> =>
        Function.pipe(
            HttpClientRequest.get(`/${encodeURIComponent(options.id)}/changes`),
            FilesystemChangesClient,
            Effect.map((response) => response ?? []),
            Effect.mapError((error) => new ContainersError({ method: "changes", error })),
            Effect.scoped
        );

    const export_ = (options: ContainerExportOptions): Stream.Stream<Uint8Array, ContainersError, never> =>
        Function.pipe(
            HttpClientRequest.get(`/${encodeURIComponent(options.id)}/export`),
            client,
            HttpClientResponse.stream,
            Stream.mapError((error) => new ContainersError({ method: "export", error }))
        );

    const stats_ = (options: ContainerStatsOptions): Stream.Stream<unknown, ContainersError, never> =>
        Function.pipe(
            HttpClientRequest.get(`/${encodeURIComponent(options.id)}/stats`),
            maybeAddQueryParameter("stream", Option.fromNullable(options.stream)),
            maybeAddQueryParameter("one-shot", Option.fromNullable(options["one-shot"])),
            client,
            HttpClientResponse.stream,
            Stream.decodeText("utf8"),
            Stream.mapEffect(Schema.decode(Schema.parseJson(Schema.Unknown))),
            Stream.mapError((error) => new ContainersError({ method: "stats", error }))
        );

    const resize_ = (options: ContainerResizeOptions): Effect.Effect<void, ContainersError, never> =>
        Function.pipe(
            HttpClientRequest.post(`/${encodeURIComponent(options.id)}/resize`),
            maybeAddQueryParameter("h", Option.fromNullable(options.h)),
            maybeAddQueryParameter("w", Option.fromNullable(options.w)),
            voidClient,
            Effect.mapError((error) => new ContainersError({ method: "resize", error })),
            Effect.scoped
        );

    const start_ = (options: ContainerStartOptions): Effect.Effect<void, ContainersError, never> =>
        Function.pipe(
            HttpClientRequest.post(`/${encodeURIComponent(options.id)}/start`),
            maybeAddQueryParameter("detachKeys", Option.fromNullable(options.detachKeys)),
            voidClient,
            Effect.mapError((error) => new ContainersError({ method: "start", error })),
            Effect.scoped
        );

    const stop_ = (options: ContainerStopOptions): Effect.Effect<void, ContainersError, never> =>
        Function.pipe(
            HttpClientRequest.post(`/${encodeURIComponent(options.id)}/stop`),
            maybeAddQueryParameter("signal", Option.fromNullable(options.signal)),
            maybeAddQueryParameter("t", Option.fromNullable(options.t)),
            voidClient,
            Effect.mapError((error) => new ContainersError({ method: "stop", error })),
            Effect.scoped
        );

    const restart_ = (options: ContainerRestartOptions): Effect.Effect<void, ContainersError, never> =>
        Function.pipe(
            HttpClientRequest.post(`/${encodeURIComponent(options.id)}/restart`),
            maybeAddQueryParameter("signal", Option.fromNullable(options.signal)),
            maybeAddQueryParameter("t", Option.fromNullable(options.t)),
            voidClient,
            Effect.mapError((error) => new ContainersError({ method: "restart", error })),
            Effect.scoped
        );

    const kill_ = (options: ContainerKillOptions): Effect.Effect<void, ContainersError, never> =>
        Function.pipe(
            HttpClientRequest.post(`/${encodeURIComponent(options.id)}/kill`),
            maybeAddQueryParameter("signal", Option.fromNullable(options.signal)),
            voidClient,
            Effect.mapError((error) => new ContainersError({ method: "kill", error })),
            Effect.scoped
        );

    const update_ = (options: ContainerUpdateOptions): Effect.Effect<ContainerUpdateResponse, ContainersError, never> =>
        Function.pipe(
            HttpClientRequest.post(`/${encodeURIComponent(options.id)}/update`),
            HttpClientRequest.schemaBody(ContainerUpdateSpec)(new ContainerUpdateSpec(options.spec)),
            Effect.flatMap(ContainerUpdateResponseClient),
            Effect.mapError((error) => new ContainersError({ method: "update", error })),
            Effect.scoped
        );

    const rename_ = (options: ContainerRenameOptions): Effect.Effect<void, ContainersError, never> =>
        Function.pipe(
            HttpClientRequest.post(`/${encodeURIComponent(options.id)}/rename`),
            maybeAddQueryParameter("name", Option.fromNullable(options.name)),
            voidClient,
            Effect.mapError((error) => new ContainersError({ method: "rename", error })),
            Effect.scoped
        );

    const pause_ = (options: ContainerPauseOptions): Effect.Effect<void, ContainersError, never> =>
        Function.pipe(
            HttpClientRequest.post(`/${encodeURIComponent(options.id)}/pause`),
            voidClient,
            Effect.mapError((error) => new ContainersError({ method: "pause", error })),
            Effect.scoped
        );

    const unpause_ = (options: ContainerUnpauseOptions): Effect.Effect<void, ContainersError, never> =>
        Function.pipe(
            HttpClientRequest.post(`/${encodeURIComponent(options.id)}/unpause`),
            voidClient,
            Effect.mapError((error) => new ContainersError({ method: "unpause", error })),
            Effect.scoped
        );

    const attach_ = (
        options: ContainerAttachOptions
    ): Effect.Effect<RawStreamSocket | MultiplexedStreamSocket, ContainersError, Scope.Scope> =>
        Function.pipe(
            HttpClientRequest.post(`/${encodeURIComponent(options.id)}/attach`),
            maybeAddQueryParameter("detachKeys", Option.fromNullable(options.detachKeys)),
            maybeAddQueryParameter("logs", Option.fromNullable(options.logs)),
            maybeAddQueryParameter("stream", Option.fromNullable(options.stream)),
            maybeAddQueryParameter("stdin", Option.fromNullable(options.stdin)),
            maybeAddQueryParameter("stdout", Option.fromNullable(options.stdout)),
            maybeAddQueryParameter("stderr", Option.fromNullable(options.stderr)),
            client,
            Effect.flatMap(responseToStreamingSocketOrFail),
            Effect.mapError((error) => new ContainersError({ method: "attach", error }))
        );

    const attachWebsocket_ = (
        options: ContainerAttachWebsocketOptions
    ): Effect.Effect<void, ContainersError, Scope.Scope> =>
        Function.pipe(
            HttpClientRequest.get(`/${encodeURIComponent(options.id)}/attach/ws`),
            maybeAddQueryParameter("detachKeys", Option.fromNullable(options.detachKeys)),
            maybeAddQueryParameter("logs", Option.fromNullable(options.logs)),
            maybeAddQueryParameter("stream", Option.fromNullable(options.stream)),
            maybeAddQueryParameter("stdin", Option.fromNullable(options.stdin)),
            maybeAddQueryParameter("stdout", Option.fromNullable(options.stdout)),
            maybeAddQueryParameter("stderr", Option.fromNullable(options.stderr)),
            voidClient,
            Effect.mapError((error) => new ContainersError({ method: "attachWebsocket", error }))
        );

    const wait_ = (options: ContainerWaitOptions): Effect.Effect<ContainerWaitResponse, ContainersError, never> =>
        Function.pipe(
            HttpClientRequest.post(`/${encodeURIComponent(options.id)}/wait`),
            maybeAddQueryParameter("condition", Option.fromNullable(options.condition)),
            ContainerWaitResponseClient,
            Effect.mapError((error) => new ContainersError({ method: "wait", error })),
            Effect.scoped
        );

    const delete_ = (options: ContainerDeleteOptions): Effect.Effect<void, ContainersError, never> =>
        Function.pipe(
            HttpClientRequest.del(`/${encodeURIComponent(options.id)}`),
            maybeAddQueryParameter("v", Option.fromNullable(options.v)),
            maybeAddQueryParameter("force", Option.fromNullable(options.force)),
            maybeAddQueryParameter("link", Option.fromNullable(options.link)),
            voidClient,
            Effect.mapError((error) => new ContainersError({ method: "delete", error })),
            Effect.scoped
        );

    const archive_ = (options: ContainerArchiveOptions): Stream.Stream<Uint8Array, ContainersError, never> =>
        Function.pipe(
            HttpClientRequest.get(`/${encodeURIComponent(options.id)}/archive`),
            maybeAddQueryParameter("path", Option.some(options.path)),
            client,
            HttpClientResponse.stream,
            Stream.mapError((error) => new ContainersError({ method: "archive", error }))
        );

    const archiveInfo_ = (options: ContainerArchiveInfoOptions): Effect.Effect<void, ContainersError, never> =>
        Function.pipe(
            HttpClientRequest.head(`/${encodeURIComponent(options.id)}/archive`),
            maybeAddQueryParameter("path", Option.some(options.path)),
            voidClient,
            Effect.mapError((error) => new ContainersError({ method: "archiveInfo", error })),
            Effect.scoped
        );

    const putArchive_ = (options: PutContainerArchiveOptions): Effect.Effect<void, ContainersError, never> =>
        Function.pipe(
            HttpClientRequest.put(`/${encodeURIComponent(options.id)}/archive`),
            maybeAddQueryParameter("path", Option.some(options.path)),
            maybeAddQueryParameter("noOverwriteDirNonDir", Option.fromNullable(options.noOverwriteDirNonDir)),
            maybeAddQueryParameter("copyUIDGID", Option.fromNullable(options.copyUIDGID)),
            HttpClientRequest.streamBody(options.stream),
            voidClient,
            Effect.mapError((error) => new ContainersError({ method: "putArchive", error })),
            Effect.scoped
        );

    const prune_ = (
        options?: ContainerPruneOptions | undefined
    ): Effect.Effect<ContainerPruneResponse, ContainersError, never> =>
        Function.pipe(
            HttpClientRequest.post("/prune"),
            maybeAddQueryParameter(
                "filters",
                Function.pipe(options?.filters, Option.fromNullable, Option.map(JSON.stringify))
            ),
            ContainerPruneResponseClient,
            Effect.mapError((error) => new ContainersError({ method: "prune", error })),
            Effect.scoped
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
 * @since 1.0.0
 * @category Tags
 */
export interface Containers {
    readonly _: unique symbol;
}

/**
 * Containers service
 *
 * @since 1.0.0
 * @category Tags
 */
export const Containers: Context.Tag<Containers, ContainersImpl> = Context.GenericTag<Containers, ContainersImpl>(
    "@the-moby-effect/Containers"
);

/**
 * Containers layer that depends on a Moby connection agent
 *
 * @since 1.0.0
 * @category Layers
 */
export const layer: Layer.Layer<Containers, never, HttpClient.HttpClient.Default> = Layer.effect(Containers, make);
