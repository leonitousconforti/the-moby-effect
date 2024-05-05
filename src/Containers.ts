import * as HttpClient from "@effect/platform/HttpClient";
import * as Schema from "@effect/schema/Schema";
import * as Context from "effect/Context";
import * as Data from "effect/Data";
import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as Layer from "effect/Layer";
import * as Scope from "effect/Scope";
import * as Stream from "effect/Stream";

import {
    IMobyConnectionAgent,
    MobyConnectionAgent,
    MobyConnectionOptions,
    MobyHttpClientLive,
    getAgent,
} from "./Agent.js";
import { MultiplexedStreamSocket, RawStreamSocket, responseToStreamingSocketOrFail } from "./Demux.js";
import { addQueryParameter, responseErrorHandler, streamErrorHandler } from "./Requests.js";
import {
    ContainerCreateResponse,
    ContainerCreateSpec,
    ContainerInspectResponse,
    ContainerPruneResponse,
    ContainerState_Status,
    ContainerSummary,
    ContainerUpdateResponse,
    ContainerUpdateSpec,
    ContainerWaitResponse,
    FilesystemChange,
    Health_Status,
    HostConfig_1_Isolation,
} from "./Schemas.js";

export class ContainersError extends Data.TaggedError("ContainersError")<{
    method: string;
    message: string;
}> {}

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
        ancestor?: string[] | undefined;
        before?: string[] | undefined;
        expose?: (`${number}/${string}` | `${number}-${number}/${string}`)[] | undefined;
        exited?: number[] | undefined;
        health?: Health_Status[] | undefined;
        id?: string[] | undefined;
        isolation?: HostConfig_1_Isolation[] | undefined;
        "is-task"?: ["true" | "false"] | undefined;
        label?: string[] | undefined;
        name?: string[] | undefined;
        network?: string[] | undefined;
        publish?: (`${number}/${string}` | `${number}-${number}/${string}`)[] | undefined;
        since?: string[] | undefined;
        status?: ContainerState_Status[] | undefined;
        volume?: string[] | undefined;
    };
}

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

export interface ContainerInspectOptions {
    /** ID or name of the container */
    readonly id: string;
    /** Return the size of container as fields `SizeRw` and `SizeRootFs` */
    readonly size?: boolean;
}

export interface ContainerTopOptions {
    /** ID or name of the container */
    readonly id: string;
    /** The arguments to pass to `ps`. For example, `aux` */
    readonly ps_args?: string;
}

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

export interface ContainerChangesOptions {
    /** ID or name of the container */
    readonly id: string;
}

export interface ContainerExportOptions {
    /** ID or name of the container */
    readonly id: string;
}

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

export interface ContainerResizeOptions {
    /** ID or name of the container */
    readonly id: string;
    /** Height of the TTY session in characters */
    readonly h?: number;
    /** Width of the TTY session in characters */
    readonly w?: number;
}

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

export interface ContainerStopOptions {
    /** ID or name of the container */
    readonly id: string;
    /** Signal to send to the container as an integer or string (e.g. `SIGINT`). */
    readonly signal?: string;
    /** Number of seconds to wait before killing the container */
    readonly t?: number;
}

export interface ContainerRestartOptions {
    /** ID or name of the container */
    readonly id: string;
    /** Signal to send to the container as an integer or string (e.g. `SIGINT`). */
    readonly signal?: string;
    /** Number of seconds to wait before killing the container */
    readonly t?: number;
}

export interface ContainerKillOptions {
    /** ID or name of the container */
    readonly id: string;
    /** Signal to send to the container as an integer or string (e.g. `SIGINT`). */
    readonly signal?: string;
}

export interface ContainerUpdateOptions {
    /** ID or name of the container */
    readonly id: string;
    readonly spec: Schema.Schema.Encoded<typeof ContainerUpdateSpec>;
}

export interface ContainerRenameOptions {
    /** ID or name of the container */
    readonly id: string;
    /** New name for the container */
    readonly name: string;
}

export interface ContainerPauseOptions {
    /** ID or name of the container */
    readonly id: string;
}

export interface ContainerUnpauseOptions {
    /** ID or name of the container */
    readonly id: string;
}

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

export interface ContainerArchiveOptions {
    /** ID or name of the container */
    readonly id: string;
    /** Resource in the container’s filesystem to archive. */
    readonly path: string;
}

export interface ContainerArchiveInfoOptions {
    /** ID or name of the container */
    readonly id: string;
    /** Resource in the container’s filesystem to archive. */
    readonly path: string;
}

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
    readonly stream: Stream.Stream<Uint8Array, ContainersError>;
}

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

export interface Containers {
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
    ) => Effect.Effect<Readonly<Array<ContainerSummary>>, ContainersError>;

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
    readonly create: (options: ContainerCreateOptions) => Effect.Effect<ContainerCreateResponse, ContainersError>;

    /**
     * Inspect a container
     *
     * @param id - ID or name of the container
     * @param size - Return the size of container as fields `SizeRw` and
     *   `SizeRootFs`
     */
    readonly inspect: (options: ContainerInspectOptions) => Effect.Effect<ContainerInspectResponse, ContainersError>;

    /**
     * List processes running inside a container
     *
     * @param id - ID or name of the container
     * @param ps_args - The arguments to pass to `ps`. For example, `aux`
     */
    readonly top: (options: ContainerTopOptions) => Effect.Effect<unknown, ContainersError>;

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
    readonly logs: (
        options: ContainerLogsOptions
    ) => Effect.Effect<Stream.Stream<string, ContainersError>, ContainersError>;

    /**
     * Get changes on a container’s filesystem
     *
     * @param id - ID or name of the container
     */
    readonly changes: (
        options: ContainerChangesOptions
    ) => Effect.Effect<Readonly<Array<FilesystemChange>>, ContainersError>;

    /**
     * Export a container
     *
     * @param id - ID or name of the container
     */
    readonly export: (
        options: ContainerExportOptions
    ) => Effect.Effect<Stream.Stream<Uint8Array, ContainersError>, ContainersError>;

    /**
     * Get container stats based on resource usage
     *
     * @param id - ID or name of the container
     * @param stream - Stream the output. If false, the stats will be output
     *   once and then it will disconnect.
     * @param one-shot - Only get a single stat instead of waiting for 2 cycles.
     *   Must be used with `stream=false`.
     */
    readonly stats: (
        options: ContainerStatsOptions
    ) => Effect.Effect<Stream.Stream<string, ContainersError>, ContainersError>;

    /**
     * Resize a container TTY
     *
     * @param id - ID or name of the container
     * @param h - Height of the TTY session in characters
     * @param w - Width of the TTY session in characters
     */
    readonly resize: (options: ContainerResizeOptions) => Effect.Effect<void, ContainersError>;

    /**
     * Start a container
     *
     * @param id - ID or name of the container
     * @param detachKeys - Override the key sequence for detaching a container.
     *   Format is a single character `[a-Z]` or `ctrl-<value>` where `<value>`
     *   is one of: `a-z`, `@`, `^`, `[`, `,` or `_`.
     */
    readonly start: (options: ContainerStartOptions) => Effect.Effect<void, ContainersError>;

    /**
     * Stop a container
     *
     * @param id - ID or name of the container
     * @param signal - Signal to send to the container as an integer or string
     *   (e.g. `SIGINT`).
     * @param t - Number of seconds to wait before killing the container
     */
    readonly stop: (options: ContainerStopOptions) => Effect.Effect<void, ContainersError>;

    /**
     * Restart a container
     *
     * @param id - ID or name of the container
     * @param signal - Signal to send to the container as an integer or string
     *   (e.g. `SIGINT`).
     * @param t - Number of seconds to wait before killing the container
     */
    readonly restart: (options: ContainerRestartOptions) => Effect.Effect<void, ContainersError>;

    /**
     * Kill a container
     *
     * @param id - ID or name of the container
     * @param signal - Signal to send to the container as an integer or string
     *   (e.g. `SIGINT`).
     */
    readonly kill: (options: ContainerKillOptions) => Effect.Effect<void, ContainersError>;

    /**
     * Update a container
     *
     * @param id - ID or name of the container
     * @param spec -
     */
    readonly update: (options: ContainerUpdateOptions) => Effect.Effect<ContainerUpdateResponse, ContainersError>;

    /**
     * Rename a container
     *
     * @param id - ID or name of the container
     * @param name - New name for the container
     */
    readonly rename: (options: ContainerRenameOptions) => Effect.Effect<void, ContainersError>;

    /**
     * Pause a container
     *
     * @param id - ID or name of the container
     */
    readonly pause: (options: ContainerPauseOptions) => Effect.Effect<void, ContainersError>;

    /**
     * Unpause a container
     *
     * @param id - ID or name of the container
     */
    readonly unpause: (options: ContainerUnpauseOptions) => Effect.Effect<void, ContainersError>;

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
    readonly wait: (options: ContainerWaitOptions) => Effect.Effect<ContainerWaitResponse, ContainersError>;

    /**
     * Remove a container
     *
     * @param id - ID or name of the container
     * @param v - Remove anonymous volumes associated with the container.
     * @param force - If the container is running, kill it before removing it.
     * @param link - Remove the specified link associated with the container.
     */
    readonly delete: (options: ContainerDeleteOptions) => Effect.Effect<void, ContainersError>;

    /**
     * Get an archive of a filesystem resource in a container
     *
     * @param id - ID or name of the container
     * @param path - Resource in the container’s filesystem to archive.
     */
    readonly archive: (
        options: ContainerArchiveOptions
    ) => Effect.Effect<Stream.Stream<Uint8Array, ContainersError>, ContainersError>;

    /**
     * Get information about files in a container
     *
     * @param id - ID or name of the container
     * @param path - Resource in the container’s filesystem to archive.
     */
    readonly archiveInfo: (options: ContainerArchiveInfoOptions) => Effect.Effect<void, ContainersError>;

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
    readonly putArchive: (options: PutContainerArchiveOptions) => Effect.Effect<void, ContainersError>;

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
    ) => Effect.Effect<ContainerPruneResponse, ContainersError>;
}

const make: Effect.Effect<Containers, never, IMobyConnectionAgent | HttpClient.client.Client.Default> = Effect.gen(
    function* (_: Effect.Adapter) {
        const agent = yield* _(MobyConnectionAgent);
        const defaultClient = yield* _(HttpClient.client.Client);

        const client = defaultClient.pipe(
            HttpClient.client.mapRequest(HttpClient.request.prependUrl(`${agent.nodeRequestUrl}/containers`)),
            HttpClient.client.filterStatusOk
        );

        const voidClient = client.pipe(HttpClient.client.transform(Effect.asVoid));
        const unknownClient = client.pipe(
            HttpClient.client.mapEffect(HttpClient.response.schemaBodyJson(Schema.unknown))
        );
        const ContainerSummariesClient = client.pipe(
            HttpClient.client.mapEffect(HttpClient.response.schemaBodyJson(Schema.array(ContainerSummary)))
        );
        const ContainerCreateResponseClient = client.pipe(
            HttpClient.client.mapEffect(HttpClient.response.schemaBodyJson(ContainerCreateResponse))
        );
        const ContainerInspectResponseClient = client.pipe(
            HttpClient.client.mapEffect(HttpClient.response.schemaBodyJson(ContainerInspectResponse))
        );
        const FilesystemChangesClient = client.pipe(
            HttpClient.client.mapEffect(
                HttpClient.response.schemaBodyJson(Schema.NullOr(Schema.Array(FilesystemChange)))
            )
        );
        const ContainerUpdateResponseClient = client.pipe(
            HttpClient.client.mapEffect(HttpClient.response.schemaBodyJson(ContainerUpdateResponse))
        );
        const ContainerWaitResponseClient = client.pipe(
            HttpClient.client.mapEffect(HttpClient.response.schemaBodyJson(ContainerWaitResponse))
        );
        const ContainerPruneResponseClient = client.pipe(
            HttpClient.client.mapEffect(HttpClient.response.schemaBodyJson(ContainerPruneResponse))
        );

        const streamHandler = (method: string) =>
            streamErrorHandler((message) => new ContainersError({ method, message }));
        const responseHandler = (method: string) =>
            responseErrorHandler((message) => new ContainersError({ method, message }));

        const list_ = (
            options?: ContainerListOptions | undefined
        ): Effect.Effect<Readonly<Array<ContainerSummary>>, ContainersError> =>
            Function.pipe(
                HttpClient.request.get("/json"),
                addQueryParameter("all", options?.all),
                addQueryParameter("limit", options?.limit),
                addQueryParameter("size", options?.size),
                addQueryParameter("filters", JSON.stringify(options?.filters)),
                ContainerSummariesClient,
                Effect.catchAll(responseHandler("list")),
                Effect.scoped
            );

        const create_ = (options: ContainerCreateOptions): Effect.Effect<ContainerCreateResponse, ContainersError> =>
            Function.pipe(
                HttpClient.request.post("/create"),
                addQueryParameter("name", options.name),
                addQueryParameter("platform", options.platform),
                HttpClient.request.schemaBody(ContainerCreateSpec)(
                    Schema.decodeSync(ContainerCreateSpec)(options.spec)
                ),
                Effect.flatMap(ContainerCreateResponseClient),
                Effect.catchAll(responseHandler("create")),
                Effect.scoped
            );

        const inspect_ = (options: ContainerInspectOptions): Effect.Effect<ContainerInspectResponse, ContainersError> =>
            Function.pipe(
                HttpClient.request.get("/{id}/json".replace("{id}", encodeURIComponent(options.id))),
                addQueryParameter("size", options.size),
                ContainerInspectResponseClient,
                Effect.catchAll(responseHandler("inspect")),
                Effect.scoped
            );

        const top_ = (options: ContainerTopOptions): Effect.Effect<unknown, ContainersError> =>
            Function.pipe(
                HttpClient.request.get("/{id}/top".replace("{id}", encodeURIComponent(options.id))),
                addQueryParameter("ps_args", options.ps_args),
                unknownClient,
                Effect.catchAll(responseHandler("top")),
                Effect.scoped
            );

        const logs_ = (
            options: ContainerLogsOptions
        ): Effect.Effect<Stream.Stream<string, ContainersError>, ContainersError> =>
            Function.pipe(
                HttpClient.request.get("/{id}/logs".replace("{id}", encodeURIComponent(options.id))),
                addQueryParameter("follow", options.follow),
                addQueryParameter("stdout", options.stdout),
                addQueryParameter("stderr", options.stderr),
                addQueryParameter("since", options.since),
                addQueryParameter("until", options.until),
                addQueryParameter("timestamps", options.timestamps),
                addQueryParameter("tail", options.tail),
                client,
                Effect.map((response) => response.stream),
                Effect.map(Stream.decodeText("utf8")),
                Effect.map(Stream.catchAll(streamHandler("logs"))),
                Effect.catchAll(responseHandler("logs")),
                Effect.scoped
            );

        const changes_ = (
            options: ContainerChangesOptions
        ): Effect.Effect<Readonly<Array<FilesystemChange>>, ContainersError> =>
            Function.pipe(
                HttpClient.request.get("/{id}/changes".replace("{id}", encodeURIComponent(options.id))),
                FilesystemChangesClient,
                Effect.map((response) => response ?? []),
                Effect.catchAll(responseHandler("changes")),
                Effect.scoped
            );

        const export_ = (
            options: ContainerExportOptions
        ): Effect.Effect<Stream.Stream<Uint8Array, ContainersError>, ContainersError> =>
            Function.pipe(
                HttpClient.request.get("/{id}/export".replace("{id}", encodeURIComponent(options.id))),
                client,
                Effect.map((response) => response.stream),
                Effect.map(Stream.catchAll(streamHandler("export"))),
                Effect.catchAll(responseHandler("export")),
                Effect.scoped
            );

        const stats_ = (
            options: ContainerStatsOptions
        ): Effect.Effect<Stream.Stream<string, ContainersError>, ContainersError> =>
            Function.pipe(
                HttpClient.request.get("/{id}/stats".replace("{id}", encodeURIComponent(options.id))),
                addQueryParameter("stream", options.stream),
                addQueryParameter("one-shot", options["one-shot"]),
                client,
                Effect.map((response) => response.stream),
                Effect.map(Stream.decodeText("utf8")),
                Effect.map(Stream.catchAll(streamHandler("stats"))),
                Effect.catchAll(responseHandler("stats")),
                Effect.scoped
            );

        const resize_ = (options: ContainerResizeOptions): Effect.Effect<void, ContainersError> =>
            Function.pipe(
                HttpClient.request.post("/{id}/resize".replace("{id}", encodeURIComponent(options.id))),
                addQueryParameter("h", options.h),
                addQueryParameter("w", options.w),
                voidClient,
                Effect.catchAll(responseHandler("resize")),
                Effect.scoped
            );

        const start_ = (options: ContainerStartOptions): Effect.Effect<void, ContainersError> =>
            Function.pipe(
                HttpClient.request.post("/{id}/start".replace("{id}", encodeURIComponent(options.id))),
                addQueryParameter("detachKeys", options.detachKeys),
                voidClient,
                Effect.catchAll(responseHandler("start")),
                Effect.scoped
            );

        const stop_ = (options: ContainerStopOptions): Effect.Effect<void, ContainersError> =>
            Function.pipe(
                HttpClient.request.post("/{id}/stop".replace("{id}", encodeURIComponent(options.id))),
                addQueryParameter("signal", options.signal),
                addQueryParameter("t", options.t),
                voidClient,
                Effect.catchAll(responseHandler("stop")),
                Effect.scoped
            );

        const restart_ = (options: ContainerRestartOptions): Effect.Effect<void, ContainersError> =>
            Function.pipe(
                HttpClient.request.post("/{id}/restart".replace("{id}", encodeURIComponent(options.id))),
                addQueryParameter("signal", options.signal),
                addQueryParameter("t", options.t),
                voidClient,
                Effect.catchAll(responseHandler("restart")),
                Effect.scoped
            );

        const kill_ = (options: ContainerKillOptions): Effect.Effect<void, ContainersError> =>
            Function.pipe(
                HttpClient.request.post("/{id}/kill".replace("{id}", encodeURIComponent(options.id))),
                addQueryParameter("signal", options.signal),
                voidClient,
                Effect.catchAll(responseHandler("kill")),
                Effect.scoped
            );

        const update_ = (options: ContainerUpdateOptions): Effect.Effect<ContainerUpdateResponse, ContainersError> =>
            Function.pipe(
                HttpClient.request.post("/{id}/update".replace("{id}", encodeURIComponent(options.id))),
                HttpClient.request.schemaBody(ContainerUpdateSpec)(new ContainerUpdateSpec(options.spec)),
                Effect.flatMap(ContainerUpdateResponseClient),
                Effect.catchAll(responseHandler("update")),
                Effect.scoped
            );

        const rename_ = (options: ContainerRenameOptions): Effect.Effect<void, ContainersError> =>
            Function.pipe(
                HttpClient.request.post("/{id}/rename".replace("{id}", encodeURIComponent(options.id))),
                addQueryParameter("name", options.name),
                voidClient,
                Effect.catchAll(responseHandler("rename")),
                Effect.scoped
            );

        const pause_ = (options: ContainerPauseOptions): Effect.Effect<void, ContainersError> =>
            Function.pipe(
                HttpClient.request.post("/{id}/pause".replace("{id}", encodeURIComponent(options.id))),
                voidClient,
                Effect.catchAll(responseHandler("pause")),
                Effect.scoped
            );

        const unpause_ = (options: ContainerUnpauseOptions): Effect.Effect<void, ContainersError> =>
            Function.pipe(
                HttpClient.request.post("/{id}/unpause".replace("{id}", encodeURIComponent(options.id))),
                voidClient,
                Effect.catchAll(responseHandler("unpause")),
                Effect.scoped
            );

        const attach_ = (
            options: ContainerAttachOptions
        ): Effect.Effect<RawStreamSocket | MultiplexedStreamSocket, ContainersError, Scope.Scope> =>
            Function.pipe(
                HttpClient.request.post("/{id}/attach".replace("{id}", encodeURIComponent(options.id))),
                addQueryParameter("detachKeys", options.detachKeys),
                addQueryParameter("logs", options.logs),
                addQueryParameter("stream", options.stream),
                addQueryParameter("stdin", options.stdin),
                addQueryParameter("stdout", options.stdout),
                addQueryParameter("stderr", options.stderr),
                client,
                Effect.flatMap(responseToStreamingSocketOrFail),
                Effect.catchAll(responseHandler("attach"))
            );

        const attachWebsocket_ = (
            options: ContainerAttachWebsocketOptions
        ): Effect.Effect<void, ContainersError, Scope.Scope> =>
            Function.pipe(
                HttpClient.request.get("/{id}/attach/ws".replace("{id}", encodeURIComponent(options.id))),
                addQueryParameter("detachKeys", options.detachKeys),
                addQueryParameter("logs", options.logs),
                addQueryParameter("stream", options.stream),
                addQueryParameter("stdin", options.stdin),
                addQueryParameter("stdout", options.stdout),
                addQueryParameter("stderr", options.stderr),
                voidClient,
                Effect.catchAll(responseHandler("attachWebsocket")),
                Effect.scoped
            );

        const wait_ = (options: ContainerWaitOptions): Effect.Effect<ContainerWaitResponse, ContainersError> =>
            Function.pipe(
                HttpClient.request.post("/{id}/wait".replace("{id}", encodeURIComponent(options.id))),
                addQueryParameter("condition", options.condition),
                ContainerWaitResponseClient,
                Effect.catchAll(responseHandler("wait")),
                Effect.scoped
            );

        const delete_ = (options: ContainerDeleteOptions): Effect.Effect<void, ContainersError> =>
            Function.pipe(
                HttpClient.request.del("/{id}".replace("{id}", encodeURIComponent(options.id))),
                addQueryParameter("v", options.v),
                addQueryParameter("force", options.force),
                addQueryParameter("link", options.link),
                voidClient,
                Effect.catchAll(responseHandler("delete")),
                Effect.scoped
            );

        const archive_ = (
            options: ContainerArchiveOptions
        ): Effect.Effect<Stream.Stream<Uint8Array, ContainersError>, ContainersError> =>
            Function.pipe(
                HttpClient.request.get("/{id}/archive".replace("{id}", encodeURIComponent(options.id))),
                addQueryParameter("path", options.path),
                client,
                Effect.map((response) => response.stream),
                Effect.map(Stream.catchAll(streamHandler("archive"))),
                Effect.catchAll(responseHandler("archive")),
                Effect.scoped
            );

        const archiveInfo_ = (options: ContainerArchiveInfoOptions): Effect.Effect<void, ContainersError> =>
            Function.pipe(
                HttpClient.request.head("/{id}/archive".replace("{id}", encodeURIComponent(options.id))),
                addQueryParameter("path", options.path),
                voidClient,
                Effect.catchAll(responseHandler("archiveInfo")),
                Effect.scoped
            );

        const putArchive_ = (options: PutContainerArchiveOptions): Effect.Effect<void, ContainersError> =>
            Function.pipe(
                HttpClient.request.put("/{id}/archive".replace("{id}", encodeURIComponent(options.id))),
                addQueryParameter("path", options.path),
                addQueryParameter("noOverwriteDirNonDir", options.noOverwriteDirNonDir),
                addQueryParameter("copyUIDGID", options.copyUIDGID),
                HttpClient.request.streamBody(
                    Stream.mapError(
                        options.stream,
                        (error) =>
                            new HttpClient.error.RequestError({
                                reason: "Encode",
                                error: error,
                                request: {} as unknown as HttpClient.request.ClientRequest,
                            })
                    )
                ),
                voidClient,
                Effect.catchAll(responseHandler("putArchive")),
                Effect.scoped
            );

        const prune_ = (
            options?: ContainerPruneOptions | undefined
        ): Effect.Effect<ContainerPruneResponse, ContainersError> =>
            Function.pipe(
                HttpClient.request.post("/prune"),
                addQueryParameter("filters", options?.filters),
                ContainerPruneResponseClient,
                Effect.catchAll(responseHandler("prune")),
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
    }
);

export const Containers = Context.GenericTag<Containers>("the-moby-effect/Containers");
export const layer = Layer.effect(Containers, make).pipe(Layer.provide(MobyHttpClientLive));

export const fromAgent = (agent: Effect.Effect<IMobyConnectionAgent, never, Scope.Scope>) =>
    layer.pipe(Layer.provide(Layer.scoped(MobyConnectionAgent, agent)));

export const fromConnectionOptions = (connectionOptions: MobyConnectionOptions) =>
    fromAgent(getAgent(connectionOptions));
