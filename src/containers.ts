import * as NodeHttp from "@effect/platform-node/HttpClient";
import * as Schema from "@effect/schema/Schema";
import { Data, Effect } from "effect";

import {
    IMobyConnectionAgent,
    MobyConnectionAgent,
    WithConnectionAgentProvided,
    addHeader,
    addQueryParameter,
    errorHandler,
    setBody,
} from "./request-helpers.js";

import {
    ContainerCreateResponse,
    ContainerCreateResponseSchema,
    ContainerInspectResponse,
    ContainerInspectResponseSchema,
    ContainerPruneResponse,
    ContainerPruneResponseSchema,
    ContainerSummary,
    ContainerSummarySchema,
    ContainerTopResponse,
    ContainerTopResponseSchema,
    ContainerUpdateResponse,
    ContainerUpdateResponseSchema,
    ContainerWaitResponse,
    ContainerWaitResponseSchema,
    ContainersCreateBody,
    FilesystemChange,
    FilesystemChangeSchema,
    IdUpdateBody,
} from "./schemas.js";

export class containerArchiveError extends Data.TaggedError("containerArchiveError")<{ message: string }> {}
export class containerArchiveInfoError extends Data.TaggedError("containerArchiveInfoError")<{ message: string }> {}
export class containerAttachError extends Data.TaggedError("containerAttachError")<{ message: string }> {}
export class containerAttachWebsocketError extends Data.TaggedError("containerAttachWebsocketError")<{
    message: string;
}> {}
export class containerChangesError extends Data.TaggedError("containerChangesError")<{ message: string }> {}
export class containerCreateError extends Data.TaggedError("containerCreateError")<{ message: string }> {}
export class containerDeleteError extends Data.TaggedError("containerDeleteError")<{ message: string }> {}
export class containerExportError extends Data.TaggedError("containerExportError")<{ message: string }> {}
export class containerInspectError extends Data.TaggedError("containerInspectError")<{ message: string }> {}
export class containerKillError extends Data.TaggedError("containerKillError")<{ message: string }> {}
export class containerListError extends Data.TaggedError("containerListError")<{ message: string }> {}
export class containerLogsError extends Data.TaggedError("containerLogsError")<{ message: string }> {}
export class containerPauseError extends Data.TaggedError("containerPauseError")<{ message: string }> {}
export class containerPruneError extends Data.TaggedError("containerPruneError")<{ message: string }> {}
export class containerRenameError extends Data.TaggedError("containerRenameError")<{ message: string }> {}
export class containerResizeError extends Data.TaggedError("containerResizeError")<{ message: string }> {}
export class containerRestartError extends Data.TaggedError("containerRestartError")<{ message: string }> {}
export class containerStartError extends Data.TaggedError("containerStartError")<{ message: string }> {}
export class containerStatsError extends Data.TaggedError("containerStatsError")<{ message: string }> {}
export class containerStopError extends Data.TaggedError("containerStopError")<{ message: string }> {}
export class containerTopError extends Data.TaggedError("containerTopError")<{ message: string }> {}
export class containerUnpauseError extends Data.TaggedError("containerUnpauseError")<{ message: string }> {}
export class containerUpdateError extends Data.TaggedError("containerUpdateError")<{ message: string }> {}
export class containerWaitError extends Data.TaggedError("containerWaitError")<{ message: string }> {}
export class putContainerArchiveError extends Data.TaggedError("putContainerArchiveError")<{ message: string }> {}

export interface containerArchiveOptions {
    /** ID or name of the container */
    id: string;
    /** Resource in the container’s filesystem to archive. */
    path: string;
}

export interface containerArchiveInfoOptions {
    /** ID or name of the container */
    id: string;
    /** Resource in the container’s filesystem to archive. */
    path: string;
}

export interface containerAttachOptions {
    /** ID or name of the container */
    id: string;
    /**
     * Override the key sequence for detaching a container.Format is a single
     * character `[a-Z]` or `ctrl-<value>` where `<value>` is one of: `a-z`,
     * `@`, `^`, `[`, `,` or `_`.
     */
    detachKeys?: string;
    /**
     * Replay previous logs from the container. This is useful for attaching to
     * a container that has started and you want to output everything since the
     * container started. If `stream` is also enabled, once all the previous
     * output has been returned, it will seamlessly transition into streaming
     * current output.
     */
    logs?: boolean;
    /** Stream attached streams from the time the request was made onwards. */
    stream?: boolean;
    /** Attach to `stdin` */
    stdin?: boolean;
    /** Attach to `stdout` */
    stdout?: boolean;
    /** Attach to `stderr` */
    stderr?: boolean;
}

export interface containerAttachWebsocketOptions {
    /** ID or name of the container */
    id: string;
    /**
     * Override the key sequence for detaching a container.Format is a single
     * character `[a-Z]` or `ctrl-<value>` where `<value>` is one of: `a-z`,
     * `@`, `^`, `[`, `,`, or `_`.
     */
    detachKeys?: string;
    /** Return logs */
    logs?: boolean;
    /** Return stream */
    stream?: boolean;
    /** Attach to `stdin` */
    stdin?: boolean;
    /** Attach to `stdout` */
    stdout?: boolean;
    /** Attach to `stderr` */
    stderr?: boolean;
}

export interface containerChangesOptions {
    /** ID or name of the container */
    id: string;
}

export interface containerCreateOptions {
    /** Container to create */
    body: ContainersCreateBody;
    /**
     * Assign the specified name to the container. Must match
     * `/?[a-zA-Z0-9][a-zA-Z0-9_.-]+`.
     */
    name?: string;
    /**
     * Platform in the format `os[/arch[/variant]]` used for image lookup. When
     * specified, the daemon checks if the requested image is present in the
     * local image cache with the given OS and Architecture, and otherwise
     * returns a `404` status. If the option is not set, the host's native OS
     * and Architecture are used to look up the image in the image cache.
     * However, if no platform is passed and the given image does exist in the
     * local image cache, but its OS or architecture does not match, the
     * container is created with the available image, and a warning is added to
     * the `Warnings` field in the response, for example; WARNING: The requested
     * image's platform (linux/arm64/v8) does not match the detected host
     * platform (linux/amd64) and no specific platform was requested
     */
    platform?: string;
}

export interface containerDeleteOptions {
    /** ID or name of the container */
    id: string;
    /** Remove anonymous volumes associated with the container. */
    v?: boolean;
    /** If the container is running, kill it before removing it. */
    force?: boolean;
    /** Remove the specified link associated with the container. */
    link?: boolean;
}

export interface containerExportOptions {
    /** ID or name of the container */
    id: string;
}

export interface containerInspectOptions {
    /** ID or name of the container */
    id: string;
    /** Return the size of container as fields `SizeRw` and `SizeRootFs` */
    size?: boolean;
}

export interface containerKillOptions {
    /** ID or name of the container */
    id: string;
    /** Signal to send to the container as an integer or string (e.g. `SIGINT`). */
    signal?: string;
}

export interface containerListOptions {
    /** Return all containers. By default, only running containers are shown. */
    all?: boolean;
    /**
     * Return this number of most recently created containers, including
     * non-running ones.
     */
    limit?: number;
    /** Return the size of container as fields `SizeRw` and `SizeRootFs`. */
    size?: boolean;
    /**
     * Filters to process on the container list, encoded as JSON (a
     * `map[string][]string`). For example, `{\"status\": [\"paused\"]}` will
     * only return paused containers. Available filters: -
     * `ancestor`=(`<image-name>[:<tag>]`, `<image id>`, or `<image@digest>`) -
     * `before`=(`<container id>` or `<container name>`) -
     * `expose`=(`<port>[/<proto>]`|`<startport-endport>/[<proto>]`) -
     * `exited=<int>` containers with exit code of `<int>` -
     * `health`=(`starting`|`healthy`|`unhealthy`|`none`) - `id=<ID>` a
     * container's ID - `isolation=`(`default`|`process`|`hyperv`) (Windows
     * daemon only) - `is-task=`(`true`|`false`) - `label=key` or
     * `label=\"key=value\"` of a container label - `name=<name>` a container's
     * name - `network`=(`<network id>` or `<network name>`) -
     * `publish`=(`<port>[/<proto>]`|`<startport-endport>/[<proto>]`) -
     * `since`=(`<container id>` or `<container name>`) -
     * `status=`(`created`|`restarting`|`running`|`removing`|`paused`|`exited`|`dead`)
     *
     * - `volume`=(`<volume name>` or `<mount point destination>`)
     */
    filters?: string;
}

export interface containerLogsOptions {
    /** ID or name of the container */
    id: string;
    /** Keep connection after returning logs. */
    follow?: boolean;
    /** Return logs from `stdout` */
    stdout?: boolean;
    /** Return logs from `stderr` */
    stderr?: boolean;
    /** Only return logs since this time, as a UNIX timestamp */
    since?: number;
    /** Only return logs before this time, as a UNIX timestamp */
    until?: number;
    /** Add timestamps to every log line */
    timestamps?: boolean;
    /**
     * Only return this number of log lines from the end of the logs. Specify as
     * an integer or `all` to output all log lines.
     */
    tail?: string;
}

export interface containerPauseOptions {
    /** ID or name of the container */
    id: string;
}

export interface containerPruneOptions {
    /**
     * Filters to process on the prune list, encoded as JSON (a
     * `map[string][]string`). Available filters: - `until=<timestamp>` Prune
     * containers created before this timestamp. The `<timestamp>` can be Unix
     * timestamps, date formatted timestamps, or Go duration strings (e.g.
     * `10m`, `1h30m`) computed relative to the daemon machine’s time. - `label`
     * (`label=<key>`, `label=<key>=<value>`, `label!=<key>`, or
     * `label!=<key>=<value>`) Prune containers with (or without, in case
     * `label!=...` is used) the specified labels.
     */
    filters?: string;
}

export interface containerRenameOptions {
    /** ID or name of the container */
    id: string;
    /** New name for the container */
    name: string;
}

export interface containerResizeOptions {
    /** ID or name of the container */
    id: string;
    /** Height of the TTY session in characters */
    h?: number;
    /** Width of the TTY session in characters */
    w?: number;
}

export interface containerRestartOptions {
    /** ID or name of the container */
    id: string;
    /** Signal to send to the container as an integer or string (e.g. `SIGINT`). */
    signal?: string;
    /** Number of seconds to wait before killing the container */
    t?: number;
}

export interface containerStartOptions {
    /** ID or name of the container */
    id: string;
    /**
     * Override the key sequence for detaching a container. Format is a single
     * character `[a-Z]` or `ctrl-<value>` where `<value>` is one of: `a-z`,
     * `@`, `^`, `[`, `,` or `_`.
     */
    detachKeys?: string;
}

export interface containerStatsOptions {
    /** ID or name of the container */
    id: string;
    /**
     * Stream the output. If false, the stats will be output once and then it
     * will disconnect.
     */
    stream?: boolean;
    /**
     * Only get a single stat instead of waiting for 2 cycles. Must be used with
     * `stream=false`.
     */
    one_shot?: boolean;
}

export interface containerStopOptions {
    /** ID or name of the container */
    id: string;
    /** Signal to send to the container as an integer or string (e.g. `SIGINT`). */
    signal?: string;
    /** Number of seconds to wait before killing the container */
    t?: number;
}

export interface containerTopOptions {
    /** ID or name of the container */
    id: string;
    /** The arguments to pass to `ps`. For example, `aux` */
    ps_args?: string;
}

export interface containerUnpauseOptions {
    /** ID or name of the container */
    id: string;
}

export interface containerUpdateOptions {
    body: IdUpdateBody;
    /** ID or name of the container */
    id: string;
}

export interface containerWaitOptions {
    /** ID or name of the container */
    id: string;
    /**
     * Wait until a container state reaches the given condition. Defaults to
     * `not-running` if omitted or empty.
     */
    condition?: string;
}

export interface putContainerArchiveOptions {
    /**
     * The input stream must be a tar archive compressed with one of the
     * following algorithms: `identity` (no compression), `gzip`, `bzip2`, or
     * `xz`.
     */
    body: unknown;
    /** ID or name of the container */
    id: string;
    /**
     * Path to a directory in the container to extract the archive’s contents
     * into.
     */
    path: string;
    /**
     * If `1`, `true`, or `True` then it will be an error if unpacking the given
     * content would cause an existing directory to be replaced with a
     * non-directory and vice versa.
     */
    noOverwriteDirNonDir?: string;
    /** If `1`, `true`, then it will copy UID/GID maps to the dest file or dir */
    copyUIDGID?: string;
}

/**
 * Get a tar archive of a resource in the filesystem of container id.
 *
 * @param id - ID or name of the container
 * @param path - Resource in the container’s filesystem to archive.
 */
export const containerArchive = (
    options: containerArchiveOptions
): Effect.Effect<IMobyConnectionAgent, containerArchiveError, void> =>
    Effect.gen(function* (_: Effect.Adapter) {
        if (options.id === null || options.id === undefined) {
            yield* _(new containerArchiveError({ message: "Required parameter id was null or undefined" }));
        }

        if (options.path === null || options.path === undefined) {
            yield* _(new containerArchiveError({ message: "Required parameter path was null or undefined" }));
        }

        const endpoint: string = "/containers/{id}/archive";
        const method: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" = "GET";
        const sanitizedEndpoint: string = endpoint.replace(`{${"id"}}`, encodeURIComponent(String(options.id)));

        const agent: IMobyConnectionAgent = yield* _(MobyConnectionAgent);
        const client: NodeHttp.client.Client.Default = yield* _(
            NodeHttp.nodeClient.make.pipe(Effect.provideService(NodeHttp.nodeClient.HttpAgent, agent))
        );

        return NodeHttp.request
            .make(method)(sanitizedEndpoint)
            .pipe(NodeHttp.request.prependUrl("http://0.0.0.0"))
            .pipe(addQueryParameter("path", options.path))
            .pipe(client.pipe(NodeHttp.client.filterStatusOk))
            .pipe(errorHandler(containerArchiveError));
    }).pipe(Effect.flatten);

/**
 * A response header `X-Docker-Container-Path-Stat` is returned, containing a
 * base64 - encoded JSON object with some filesystem header information about
 * the path.
 *
 * @param id - ID or name of the container
 * @param path - Resource in the container’s filesystem to archive.
 */
export const containerArchiveInfo = (
    options: containerArchiveInfoOptions
): Effect.Effect<IMobyConnectionAgent, containerArchiveInfoError, void> =>
    Effect.gen(function* (_: Effect.Adapter) {
        if (options.id === null || options.id === undefined) {
            yield* _(new containerArchiveInfoError({ message: "Required parameter id was null or undefined" }));
        }

        if (options.path === null || options.path === undefined) {
            yield* _(new containerArchiveInfoError({ message: "Required parameter path was null or undefined" }));
        }

        const endpoint: string = "/containers/{id}/archive";
        const method: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" = "HEAD";
        const sanitizedEndpoint: string = endpoint.replace(`{${"id"}}`, encodeURIComponent(String(options.id)));

        const agent: IMobyConnectionAgent = yield* _(MobyConnectionAgent);
        const client: NodeHttp.client.Client.Default = yield* _(
            NodeHttp.nodeClient.make.pipe(Effect.provideService(NodeHttp.nodeClient.HttpAgent, agent))
        );

        return NodeHttp.request
            .make(method)(sanitizedEndpoint)
            .pipe(NodeHttp.request.prependUrl("http://0.0.0.0"))
            .pipe(addQueryParameter("path", options.path))
            .pipe(client.pipe(NodeHttp.client.filterStatusOk))
            .pipe(errorHandler(containerArchiveInfoError));
    }).pipe(Effect.flatten);

/**
 * Attach to a container to read its output or send it input. You can attach to
 * the same container multiple times and you can reattach to containers that
 * have been detached. Either the `stream` or `logs` parameter must be `true`
 * for this endpoint to do anything. See the [documentation for the `docker
 * attach`
 * command](https://docs.docker.com/engine/reference/commandline/attach/) for
 * more details. ### Hijacking This endpoint hijacks the HTTP connection to
 * transport `stdin`, `stdout`, and `stderr` on the same socket. This is the
 * response from the daemon for an attach request: `HTTP/1.1 200 OK
 * Content-Type: application/vnd.docker.raw-stream [STREAM]` After the headers
 * and two new lines, the TCP connection can now be used for raw, bidirectional
 * communication between the client and server. To hint potential proxies about
 * connection hijacking, the Docker client can also optionally send connection
 * upgrade headers. For example, the client sends this request to upgrade the
 * connection: `POST /containers/16253994b7c4/attach?stream=1&stdout=1 HTTP/1.1
 * Upgrade: tcp Connection: Upgrade` The Docker daemon will respond with a `101
 * UPGRADED` response, and will similarly follow with the raw stream: `HTTP/1.1
 * 101 UPGRADED Content-Type: application/vnd.docker.raw-stream Connection:
 * Upgrade Upgrade: tcp [STREAM]` ### Stream format When the TTY setting is
 * disabled in [`POST /containers/create`](#operation/ContainerCreate), the HTTP
 * Content-Type header is set to application/vnd.docker.multiplexed-stream and
 * the stream over the hijacked connected is multiplexed to separate out
 * `stdout` and `stderr`. The stream consists of a series of frames, each
 * containing a header and a payload. The header contains the information which
 * the stream writes (`stdout` or `stderr`). It also contains the size of the
 * associated frame encoded in the last four bytes (`uint32`). It is encoded on
 * the first eight bytes like this: `go header := [8]byte{STREAM_TYPE, 0, 0, 0,
 * SIZE1, SIZE2, SIZE3, SIZE4} ` `STREAM_TYPE` can be: - 0: `stdin` (is written
 * on `stdout`) - 1: `stdout` - 2: `stderr` `SIZE1, SIZE2, SIZE3, SIZE4` are the
 * four bytes of the `uint32` size encoded as big endian. Following the header
 * is the payload, which is the specified number of bytes of `STREAM_TYPE`. The
 * simplest way to implement this protocol is the following: 1. Read 8 bytes. 2.
 * Choose `stdout` or `stderr` depending on the first byte. 3. Extract the frame
 * size from the last four bytes. 4. Read the extracted size and output it on
 * the correct output. 5. Goto 1. ### Stream format when using a TTY When the
 * TTY setting is enabled in [`POST
 * /containers/create`](#operation/ContainerCreate), the stream is not
 * multiplexed. The data exchanged over the hijacked connection is simply the
 * raw data from the process PTY and client's `stdin`.
 *
 * @param id - ID or name of the container
 * @param detachKeys - Override the key sequence for detaching a
 *   container.Format is a single character `[a-Z]` or `ctrl-<value>` where
 *   `<value>` is one of: `a-z`, `@`, `^`, `[`, `,` or `_`.
 * @param logs - Replay previous logs from the container. This is useful for
 *   attaching to a container that has started and you want to output everything
 *   since the container started. If `stream` is also enabled, once all the
 *   previous output has been returned, it will seamlessly transition into
 *   streaming current output.
 * @param stream - Stream attached streams from the time the request was made
 *   onwards.
 * @param stdin - Attach to `stdin`
 * @param stdout - Attach to `stdout`
 * @param stderr - Attach to `stderr`
 */
export const containerAttach = (
    options: containerAttachOptions
): Effect.Effect<IMobyConnectionAgent, containerAttachError, void> =>
    Effect.gen(function* (_: Effect.Adapter) {
        if (options.id === null || options.id === undefined) {
            yield* _(new containerAttachError({ message: "Required parameter id was null or undefined" }));
        }

        const endpoint: string = "/containers/{id}/attach";
        const method: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" = "POST";
        const sanitizedEndpoint: string = endpoint.replace(`{${"id"}}`, encodeURIComponent(String(options.id)));

        const agent: IMobyConnectionAgent = yield* _(MobyConnectionAgent);
        const client: NodeHttp.client.Client.Default = yield* _(
            NodeHttp.nodeClient.make.pipe(Effect.provideService(NodeHttp.nodeClient.HttpAgent, agent))
        );

        return NodeHttp.request
            .make(method)(sanitizedEndpoint)
            .pipe(NodeHttp.request.prependUrl("http://0.0.0.0"))
            .pipe(addQueryParameter("detachKeys", options.detachKeys))
            .pipe(addQueryParameter("logs", options.logs))
            .pipe(addQueryParameter("stream", options.stream))
            .pipe(addQueryParameter("stdin", options.stdin))
            .pipe(addQueryParameter("stdout", options.stdout))
            .pipe(addQueryParameter("stderr", options.stderr))
            .pipe(client.pipe(NodeHttp.client.filterStatusOk))
            .pipe(errorHandler(containerAttachError));
    }).pipe(Effect.flatten);

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
export const containerAttachWebsocket = (
    options: containerAttachWebsocketOptions
): Effect.Effect<IMobyConnectionAgent, containerAttachWebsocketError, void> =>
    Effect.gen(function* (_: Effect.Adapter) {
        if (options.id === null || options.id === undefined) {
            yield* _(new containerAttachWebsocketError({ message: "Required parameter id was null or undefined" }));
        }

        const endpoint: string = "/containers/{id}/attach/ws";
        const method: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" = "GET";
        const sanitizedEndpoint: string = endpoint.replace(`{${"id"}}`, encodeURIComponent(String(options.id)));

        const agent: IMobyConnectionAgent = yield* _(MobyConnectionAgent);
        const client: NodeHttp.client.Client.Default = yield* _(
            NodeHttp.nodeClient.make.pipe(Effect.provideService(NodeHttp.nodeClient.HttpAgent, agent))
        );

        return NodeHttp.request
            .make(method)(sanitizedEndpoint)
            .pipe(NodeHttp.request.prependUrl("http://0.0.0.0"))
            .pipe(addQueryParameter("detachKeys", options.detachKeys))
            .pipe(addQueryParameter("logs", options.logs))
            .pipe(addQueryParameter("stream", options.stream))
            .pipe(addQueryParameter("stdin", options.stdin))
            .pipe(addQueryParameter("stdout", options.stdout))
            .pipe(addQueryParameter("stderr", options.stderr))
            .pipe(client.pipe(NodeHttp.client.filterStatusOk))
            .pipe(errorHandler(containerAttachWebsocketError));
    }).pipe(Effect.flatten);

/**
 * Returns which files in a container's filesystem have been added, deleted, or
 * modified. The `Kind` of modification can be one of: - `0`: Modified ("C") -
 * `1`: Added ("A") - `2`: Deleted ("D")
 *
 * @param id - ID or name of the container
 */
export const containerChanges = (
    options: containerChangesOptions
): Effect.Effect<IMobyConnectionAgent, containerChangesError, Readonly<Array<FilesystemChange>>> =>
    Effect.gen(function* (_: Effect.Adapter) {
        if (options.id === null || options.id === undefined) {
            yield* _(new containerChangesError({ message: "Required parameter id was null or undefined" }));
        }

        const endpoint: string = "/containers/{id}/changes";
        const method: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" = "GET";
        const sanitizedEndpoint: string = endpoint.replace(`{${"id"}}`, encodeURIComponent(String(options.id)));

        const agent: IMobyConnectionAgent = yield* _(MobyConnectionAgent);
        const client: NodeHttp.client.Client.Default = yield* _(
            NodeHttp.nodeClient.make.pipe(Effect.provideService(NodeHttp.nodeClient.HttpAgent, agent))
        );

        return NodeHttp.request
            .make(method)(sanitizedEndpoint)
            .pipe(NodeHttp.request.prependUrl("http://0.0.0.0"))
            .pipe(client.pipe(NodeHttp.client.filterStatusOk))
            .pipe(Effect.flatMap(NodeHttp.response.schemaBodyJson(Schema.array(FilesystemChangeSchema))))
            .pipe(errorHandler(containerChangesError));
    }).pipe(Effect.flatten);

/**
 * Create a container
 *
 * @param body - Container to create
 * @param name - Assign the specified name to the container. Must match
 *   `/?[a-zA-Z0-9][a-zA-Z0-9_.-]+`.
 * @param platform - Platform in the format `os[/arch[/variant]]` used for image
 *   lookup. When specified, the daemon checks if the requested image is present
 *   in the local image cache with the given OS and Architecture, and otherwise
 *   returns a `404` status. If the option is not set, the host's native OS and
 *   Architecture are used to look up the image in the image cache. However, if
 *   no platform is passed and the given image does exist in the local image
 *   cache, but its OS or architecture does not match, the container is created
 *   with the available image, and a warning is added to the `Warnings` field in
 *   the response, for example; WARNING: The requested image's platform
 *   (linux/arm64/v8) does not match the detected host platform (linux/amd64)
 *   and no specific platform was requested
 */
export const containerCreate = (
    options: containerCreateOptions
): Effect.Effect<IMobyConnectionAgent, containerCreateError, Readonly<ContainerCreateResponse>> =>
    Effect.gen(function* (_: Effect.Adapter) {
        if (options.body === null || options.body === undefined) {
            yield* _(new containerCreateError({ message: "Required parameter body was null or undefined" }));
        }

        const endpoint: string = "/containers/create";
        const method: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" = "POST";
        const sanitizedEndpoint: string = endpoint;

        const agent: IMobyConnectionAgent = yield* _(MobyConnectionAgent);
        const client: NodeHttp.client.Client.Default = yield* _(
            NodeHttp.nodeClient.make.pipe(Effect.provideService(NodeHttp.nodeClient.HttpAgent, agent))
        );

        return NodeHttp.request
            .make(method)(sanitizedEndpoint)
            .pipe(NodeHttp.request.prependUrl("http://0.0.0.0"))
            .pipe(addQueryParameter("name", options.name))
            .pipe(addQueryParameter("platform", options.platform))
            .pipe(addHeader("Content-Type", "application/json"))
            .pipe(setBody(options.body, "ContainersCreateBody1"))
            .pipe(Effect.flatMap(client.pipe(NodeHttp.client.filterStatusOk)))
            .pipe(Effect.flatMap(NodeHttp.response.schemaBodyJson(ContainerCreateResponseSchema)))
            .pipe(errorHandler(containerCreateError));
    }).pipe(Effect.flatten);

/**
 * Remove a container
 *
 * @param id - ID or name of the container
 * @param v - Remove anonymous volumes associated with the container.
 * @param force - If the container is running, kill it before removing it.
 * @param link - Remove the specified link associated with the container.
 */
export const containerDelete = (
    options: containerDeleteOptions
): Effect.Effect<IMobyConnectionAgent, containerDeleteError, void> =>
    Effect.gen(function* (_: Effect.Adapter) {
        if (options.id === null || options.id === undefined) {
            yield* _(new containerDeleteError({ message: "Required parameter id was null or undefined" }));
        }

        const endpoint: string = "/containers/{id}";
        const method: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" = "DELETE";
        const sanitizedEndpoint: string = endpoint.replace(`{${"id"}}`, encodeURIComponent(String(options.id)));

        const agent: IMobyConnectionAgent = yield* _(MobyConnectionAgent);
        const client: NodeHttp.client.Client.Default = yield* _(
            NodeHttp.nodeClient.make.pipe(Effect.provideService(NodeHttp.nodeClient.HttpAgent, agent))
        );

        return NodeHttp.request
            .make(method)(sanitizedEndpoint)
            .pipe(NodeHttp.request.prependUrl("http://0.0.0.0"))
            .pipe(addQueryParameter("v", options.v))
            .pipe(addQueryParameter("force", options.force))
            .pipe(addQueryParameter("link", options.link))
            .pipe(client.pipe(NodeHttp.client.filterStatusOk))
            .pipe(errorHandler(containerDeleteError));
    }).pipe(Effect.flatten);

/**
 * Export the contents of a container as a tarball.
 *
 * @param id - ID or name of the container
 */
export const containerExport = (
    options: containerExportOptions
): Effect.Effect<IMobyConnectionAgent, containerExportError, void> =>
    Effect.gen(function* (_: Effect.Adapter) {
        if (options.id === null || options.id === undefined) {
            yield* _(new containerExportError({ message: "Required parameter id was null or undefined" }));
        }

        const endpoint: string = "/containers/{id}/export";
        const method: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" = "GET";
        const sanitizedEndpoint: string = endpoint.replace(`{${"id"}}`, encodeURIComponent(String(options.id)));

        const agent: IMobyConnectionAgent = yield* _(MobyConnectionAgent);
        const client: NodeHttp.client.Client.Default = yield* _(
            NodeHttp.nodeClient.make.pipe(Effect.provideService(NodeHttp.nodeClient.HttpAgent, agent))
        );

        return NodeHttp.request
            .make(method)(sanitizedEndpoint)
            .pipe(NodeHttp.request.prependUrl("http://0.0.0.0"))
            .pipe(client.pipe(NodeHttp.client.filterStatusOk))
            .pipe(errorHandler(containerExportError));
    }).pipe(Effect.flatten);

/**
 * Return low-level information about a container.
 *
 * @param id - ID or name of the container
 * @param size - Return the size of container as fields `SizeRw` and
 *   `SizeRootFs`
 */
export const containerInspect = (
    options: containerInspectOptions
): Effect.Effect<IMobyConnectionAgent, containerInspectError, Readonly<ContainerInspectResponse>> =>
    Effect.gen(function* (_: Effect.Adapter) {
        if (options.id === null || options.id === undefined) {
            yield* _(new containerInspectError({ message: "Required parameter id was null or undefined" }));
        }

        const endpoint: string = "/containers/{id}/json";
        const method: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" = "GET";
        const sanitizedEndpoint: string = endpoint.replace(`{${"id"}}`, encodeURIComponent(String(options.id)));

        const agent: IMobyConnectionAgent = yield* _(MobyConnectionAgent);
        const client: NodeHttp.client.Client.Default = yield* _(
            NodeHttp.nodeClient.make.pipe(Effect.provideService(NodeHttp.nodeClient.HttpAgent, agent))
        );

        return NodeHttp.request
            .make(method)(sanitizedEndpoint)
            .pipe(NodeHttp.request.prependUrl("http://0.0.0.0"))
            .pipe(addQueryParameter("size", options.size))
            .pipe(client.pipe(NodeHttp.client.filterStatusOk))
            .pipe(Effect.flatMap(NodeHttp.response.schemaBodyJson(ContainerInspectResponseSchema)))
            .pipe(errorHandler(containerInspectError));
    }).pipe(Effect.flatten);

/**
 * Send a POSIX signal to a container, defaulting to killing to the container.
 *
 * @param id - ID or name of the container
 * @param signal - Signal to send to the container as an integer or string (e.g.
 *   `SIGINT`).
 */
export const containerKill = (
    options: containerKillOptions
): Effect.Effect<IMobyConnectionAgent, containerKillError, void> =>
    Effect.gen(function* (_: Effect.Adapter) {
        if (options.id === null || options.id === undefined) {
            yield* _(new containerKillError({ message: "Required parameter id was null or undefined" }));
        }

        const endpoint: string = "/containers/{id}/kill";
        const method: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" = "POST";
        const sanitizedEndpoint: string = endpoint.replace(`{${"id"}}`, encodeURIComponent(String(options.id)));

        const agent: IMobyConnectionAgent = yield* _(MobyConnectionAgent);
        const client: NodeHttp.client.Client.Default = yield* _(
            NodeHttp.nodeClient.make.pipe(Effect.provideService(NodeHttp.nodeClient.HttpAgent, agent))
        );

        return NodeHttp.request
            .make(method)(sanitizedEndpoint)
            .pipe(NodeHttp.request.prependUrl("http://0.0.0.0"))
            .pipe(addQueryParameter("signal", options.signal))
            .pipe(client.pipe(NodeHttp.client.filterStatusOk))
            .pipe(errorHandler(containerKillError));
    }).pipe(Effect.flatten);

/**
 * Returns a list of containers. For details on the format, see the [inspect
 * endpoint](#operation/ContainerInspect). Note that it uses a different,
 * smaller representation of a container than inspecting a single container. For
 * example, the list of linked containers is not propagated .
 *
 * @param all - Return all containers. By default, only running containers are
 *   shown.
 * @param limit - Return this number of most recently created containers,
 *   including non-running ones.
 * @param size - Return the size of container as fields `SizeRw` and
 *   `SizeRootFs`.
 * @param filters - Filters to process on the container list, encoded as JSON (a
 *   `map[string][]string`). For example, `{\"status\": [\"paused\"]}` will only
 *   return paused containers. Available filters: -
 *   `ancestor`=(`<image-name>[:<tag>]`, `<image id>`, or `<image@digest>`) -
 *   `before`=(`<container id>` or `<container name>`) -
 *   `expose`=(`<port>[/<proto>]`|`<startport-endport>/[<proto>]`) -
 *   `exited=<int>` containers with exit code of `<int>` -
 *   `health`=(`starting`|`healthy`|`unhealthy`|`none`) - `id=<ID>` a
 *   container's ID - `isolation=`(`default`|`process`|`hyperv`) (Windows daemon
 *   only) - `is-task=`(`true`|`false`) - `label=key` or `label=\"key=value\"`
 *   of a container label - `name=<name>` a container's name -
 *   `network`=(`<network id>` or `<network name>`) -
 *   `publish`=(`<port>[/<proto>]`|`<startport-endport>/[<proto>]`) -
 *   `since`=(`<container id>` or `<container name>`) -
 *   `status=`(`created`|`restarting`|`running`|`removing`|`paused`|`exited`|`dead`)
 *
 *   - `volume`=(`<volume name>` or `<mount point destination>`)
 */
export const containerList = (
    options: containerListOptions
): Effect.Effect<IMobyConnectionAgent, containerListError, Readonly<Array<ContainerSummary>>> =>
    Effect.gen(function* (_: Effect.Adapter) {
        const endpoint: string = "/containers/json";
        const method: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" = "GET";
        const sanitizedEndpoint: string = endpoint;

        const agent: IMobyConnectionAgent = yield* _(MobyConnectionAgent);
        const client: NodeHttp.client.Client.Default = yield* _(
            NodeHttp.nodeClient.make.pipe(Effect.provideService(NodeHttp.nodeClient.HttpAgent, agent))
        );

        return NodeHttp.request
            .make(method)(sanitizedEndpoint)
            .pipe(NodeHttp.request.prependUrl("http://0.0.0.0"))
            .pipe(addQueryParameter("all", options.all))
            .pipe(addQueryParameter("limit", options.limit))
            .pipe(addQueryParameter("size", options.size))
            .pipe(addQueryParameter("filters", options.filters))
            .pipe(client.pipe(NodeHttp.client.filterStatusOk))
            .pipe(Effect.flatMap(NodeHttp.response.schemaBodyJson(Schema.array(ContainerSummarySchema))))
            .pipe(errorHandler(containerListError));
    }).pipe(Effect.flatten);

/**
 * Get `stdout` and `stderr` logs from a container. Note: This endpoint works
 * only for containers with the `json-file` or `journald` logging driver.
 *
 * @param id - ID or name of the container
 * @param follow - Keep connection after returning logs.
 * @param stdout - Return logs from `stdout`
 * @param stderr - Return logs from `stderr`
 * @param since - Only return logs since this time, as a UNIX timestamp
 * @param until - Only return logs before this time, as a UNIX timestamp
 * @param timestamps - Add timestamps to every log line
 * @param tail - Only return this number of log lines from the end of the logs.
 *   Specify as an integer or `all` to output all log lines.
 */
export const containerLogs = (
    options: containerLogsOptions
): Effect.Effect<IMobyConnectionAgent, containerLogsError, Readonly<Blob>> =>
    Effect.gen(function* (_: Effect.Adapter) {
        if (options.id === null || options.id === undefined) {
            yield* _(new containerLogsError({ message: "Required parameter id was null or undefined" }));
        }

        const endpoint: string = "/containers/{id}/logs";
        const method: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" = "GET";
        const sanitizedEndpoint: string = endpoint.replace(`{${"id"}}`, encodeURIComponent(String(options.id)));

        const agent: IMobyConnectionAgent = yield* _(MobyConnectionAgent);
        const client: NodeHttp.client.Client.Default = yield* _(
            NodeHttp.nodeClient.make.pipe(Effect.provideService(NodeHttp.nodeClient.HttpAgent, agent))
        );

        return NodeHttp.request
            .make(method)(sanitizedEndpoint)
            .pipe(NodeHttp.request.prependUrl("http://0.0.0.0"))
            .pipe(addQueryParameter("follow", options.follow))
            .pipe(addQueryParameter("stdout", options.stdout))
            .pipe(addQueryParameter("stderr", options.stderr))
            .pipe(addQueryParameter("since", options.since))
            .pipe(addQueryParameter("until", options.until))
            .pipe(addQueryParameter("timestamps", options.timestamps))
            .pipe(addQueryParameter("tail", options.tail))
            .pipe(client.pipe(NodeHttp.client.filterStatusOk))
            .pipe(Effect.flatMap((clientResponse) => clientResponse.text))
            .pipe(Effect.map((responseText) => new Blob([responseText])))
            .pipe(errorHandler(containerLogsError));
    }).pipe(Effect.flatten);

/**
 * Use the freezer cgroup to suspend all processes in a container.
 * Traditionally, when suspending a process the `SIGSTOP` signal is used, which
 * is observable by the process being suspended. With the freezer cgroup the
 * process is unaware, and unable to capture, that it is being suspended, and
 * subsequently resumed.
 *
 * @param id - ID or name of the container
 */
export const containerPause = (
    options: containerPauseOptions
): Effect.Effect<IMobyConnectionAgent, containerPauseError, void> =>
    Effect.gen(function* (_: Effect.Adapter) {
        if (options.id === null || options.id === undefined) {
            yield* _(new containerPauseError({ message: "Required parameter id was null or undefined" }));
        }

        const endpoint: string = "/containers/{id}/pause";
        const method: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" = "POST";
        const sanitizedEndpoint: string = endpoint.replace(`{${"id"}}`, encodeURIComponent(String(options.id)));

        const agent: IMobyConnectionAgent = yield* _(MobyConnectionAgent);
        const client: NodeHttp.client.Client.Default = yield* _(
            NodeHttp.nodeClient.make.pipe(Effect.provideService(NodeHttp.nodeClient.HttpAgent, agent))
        );

        return NodeHttp.request
            .make(method)(sanitizedEndpoint)
            .pipe(NodeHttp.request.prependUrl("http://0.0.0.0"))
            .pipe(client.pipe(NodeHttp.client.filterStatusOk))
            .pipe(errorHandler(containerPauseError));
    }).pipe(Effect.flatten);

/**
 * Delete stopped containers
 *
 * @param filters - Filters to process on the prune list, encoded as JSON (a
 *   `map[string][]string`). Available filters: - `until=<timestamp>` Prune
 *   containers created before this timestamp. The `<timestamp>` can be Unix
 *   timestamps, date formatted timestamps, or Go duration strings (e.g. `10m`,
 *   `1h30m`) computed relative to the daemon machine’s time. - `label`
 *   (`label=<key>`, `label=<key>=<value>`, `label!=<key>`, or
 *   `label!=<key>=<value>`) Prune containers with (or without, in case
 *   `label!=...` is used) the specified labels.
 */
export const containerPrune = (
    options: containerPruneOptions
): Effect.Effect<IMobyConnectionAgent, containerPruneError, Readonly<ContainerPruneResponse>> =>
    Effect.gen(function* (_: Effect.Adapter) {
        const endpoint: string = "/containers/prune";
        const method: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" = "POST";
        const sanitizedEndpoint: string = endpoint;

        const agent: IMobyConnectionAgent = yield* _(MobyConnectionAgent);
        const client: NodeHttp.client.Client.Default = yield* _(
            NodeHttp.nodeClient.make.pipe(Effect.provideService(NodeHttp.nodeClient.HttpAgent, agent))
        );

        return NodeHttp.request
            .make(method)(sanitizedEndpoint)
            .pipe(NodeHttp.request.prependUrl("http://0.0.0.0"))
            .pipe(addQueryParameter("filters", options.filters))
            .pipe(client.pipe(NodeHttp.client.filterStatusOk))
            .pipe(Effect.flatMap(NodeHttp.response.schemaBodyJson(ContainerPruneResponseSchema)))
            .pipe(errorHandler(containerPruneError));
    }).pipe(Effect.flatten);

/**
 * Rename a container
 *
 * @param id - ID or name of the container
 * @param name - New name for the container
 */
export const containerRename = (
    options: containerRenameOptions
): Effect.Effect<IMobyConnectionAgent, containerRenameError, void> =>
    Effect.gen(function* (_: Effect.Adapter) {
        if (options.id === null || options.id === undefined) {
            yield* _(new containerRenameError({ message: "Required parameter id was null or undefined" }));
        }

        if (options.name === null || options.name === undefined) {
            yield* _(new containerRenameError({ message: "Required parameter name was null or undefined" }));
        }

        const endpoint: string = "/containers/{id}/rename";
        const method: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" = "POST";
        const sanitizedEndpoint: string = endpoint.replace(`{${"id"}}`, encodeURIComponent(String(options.id)));

        const agent: IMobyConnectionAgent = yield* _(MobyConnectionAgent);
        const client: NodeHttp.client.Client.Default = yield* _(
            NodeHttp.nodeClient.make.pipe(Effect.provideService(NodeHttp.nodeClient.HttpAgent, agent))
        );

        return NodeHttp.request
            .make(method)(sanitizedEndpoint)
            .pipe(NodeHttp.request.prependUrl("http://0.0.0.0"))
            .pipe(addQueryParameter("name", options.name))
            .pipe(client.pipe(NodeHttp.client.filterStatusOk))
            .pipe(errorHandler(containerRenameError));
    }).pipe(Effect.flatten);

/**
 * Resize the TTY for a container.
 *
 * @param id - ID or name of the container
 * @param h - Height of the TTY session in characters
 * @param w - Width of the TTY session in characters
 */
export const containerResize = (
    options: containerResizeOptions
): Effect.Effect<IMobyConnectionAgent, containerResizeError, void> =>
    Effect.gen(function* (_: Effect.Adapter) {
        if (options.id === null || options.id === undefined) {
            yield* _(new containerResizeError({ message: "Required parameter id was null or undefined" }));
        }

        const endpoint: string = "/containers/{id}/resize";
        const method: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" = "POST";
        const sanitizedEndpoint: string = endpoint.replace(`{${"id"}}`, encodeURIComponent(String(options.id)));

        const agent: IMobyConnectionAgent = yield* _(MobyConnectionAgent);
        const client: NodeHttp.client.Client.Default = yield* _(
            NodeHttp.nodeClient.make.pipe(Effect.provideService(NodeHttp.nodeClient.HttpAgent, agent))
        );

        return NodeHttp.request
            .make(method)(sanitizedEndpoint)
            .pipe(NodeHttp.request.prependUrl("http://0.0.0.0"))
            .pipe(addQueryParameter("h", options.h))
            .pipe(addQueryParameter("w", options.w))
            .pipe(client.pipe(NodeHttp.client.filterStatusOk))
            .pipe(errorHandler(containerResizeError));
    }).pipe(Effect.flatten);

/**
 * Restart a container
 *
 * @param id - ID or name of the container
 * @param signal - Signal to send to the container as an integer or string (e.g.
 *   `SIGINT`).
 * @param t - Number of seconds to wait before killing the container
 */
export const containerRestart = (
    options: containerRestartOptions
): Effect.Effect<IMobyConnectionAgent, containerRestartError, void> =>
    Effect.gen(function* (_: Effect.Adapter) {
        if (options.id === null || options.id === undefined) {
            yield* _(new containerRestartError({ message: "Required parameter id was null or undefined" }));
        }

        const endpoint: string = "/containers/{id}/restart";
        const method: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" = "POST";
        const sanitizedEndpoint: string = endpoint.replace(`{${"id"}}`, encodeURIComponent(String(options.id)));

        const agent: IMobyConnectionAgent = yield* _(MobyConnectionAgent);
        const client: NodeHttp.client.Client.Default = yield* _(
            NodeHttp.nodeClient.make.pipe(Effect.provideService(NodeHttp.nodeClient.HttpAgent, agent))
        );

        return NodeHttp.request
            .make(method)(sanitizedEndpoint)
            .pipe(NodeHttp.request.prependUrl("http://0.0.0.0"))
            .pipe(addQueryParameter("signal", options.signal))
            .pipe(addQueryParameter("t", options.t))
            .pipe(client.pipe(NodeHttp.client.filterStatusOk))
            .pipe(errorHandler(containerRestartError));
    }).pipe(Effect.flatten);

/**
 * Start a container
 *
 * @param id - ID or name of the container
 * @param detachKeys - Override the key sequence for detaching a container.
 *   Format is a single character `[a-Z]` or `ctrl-<value>` where `<value>` is
 *   one of: `a-z`, `@`, `^`, `[`, `,` or `_`.
 */
export const containerStart = (
    options: containerStartOptions
): Effect.Effect<IMobyConnectionAgent, containerStartError, void> =>
    Effect.gen(function* (_: Effect.Adapter) {
        if (options.id === null || options.id === undefined) {
            yield* _(new containerStartError({ message: "Required parameter id was null or undefined" }));
        }

        const endpoint: string = "/containers/{id}/start";
        const method: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" = "POST";
        const sanitizedEndpoint: string = endpoint.replace(`{${"id"}}`, encodeURIComponent(String(options.id)));

        const agent: IMobyConnectionAgent = yield* _(MobyConnectionAgent);
        const client: NodeHttp.client.Client.Default = yield* _(
            NodeHttp.nodeClient.make.pipe(Effect.provideService(NodeHttp.nodeClient.HttpAgent, agent))
        );

        return NodeHttp.request
            .make(method)(sanitizedEndpoint)
            .pipe(NodeHttp.request.prependUrl("http://0.0.0.0"))
            .pipe(addQueryParameter("detachKeys", options.detachKeys))
            .pipe(client.pipe(NodeHttp.client.filterStatusOk))
            .pipe(errorHandler(containerStartError));
    }).pipe(Effect.flatten);

/**
 * This endpoint returns a live stream of a container’s resource usage
 * statistics. The `precpu_stats` is the CPU statistic of the _previous_ read,
 * and is used to calculate the CPU usage percentage. It is not an exact copy of
 * the `cpu_stats` field. If either `precpu_stats.online_cpus` or
 * `cpu_stats.online_cpus` is nil then for compatibility with older daemons the
 * length of the corresponding `cpu_usage.percpu_usage` array should be used. On
 * a cgroup v2 host, the following fields are not set * `blkio_stats`: all
 * fields other than `io_service_bytes_recursive` * `cpu_stats`:
 * `cpu_usage.percpu_usage` * `memory_stats`: `max_usage` and `failcnt` Also,
 * `memory_stats.stats` fields are incompatible with cgroup v1. To calculate the
 * values shown by the `stats` command of the docker cli tool the following
 * formulas can be used: * used_memory = `memory_stats.usage -
 * memory_stats.stats.cache` * available_memory = `memory_stats.limit` * Memory
 * usage % = `(used_memory / available_memory) * 100.0` * cpu_delta =
 * `cpu_stats.cpu_usage.total_usage - precpu_stats.cpu_usage.total_usage` *
 * system_cpu_delta = `cpu_stats.system_cpu_usage -
 * precpu_stats.system_cpu_usage` * number_cpus =
 * `length(cpu_stats.cpu_usage.percpu_usage)` or `cpu_stats.online_cpus` * CPU
 * usage % = `(cpu_delta / system_cpu_delta) * number_cpus * 100.0`
 *
 * @param id - ID or name of the container
 * @param stream - Stream the output. If false, the stats will be output once
 *   and then it will disconnect.
 * @param one_shot - Only get a single stat instead of waiting for 2 cycles.
 *   Must be used with `stream=false`.
 */
export const containerStats = (
    options: containerStatsOptions
): Effect.Effect<IMobyConnectionAgent, containerStatsError, Readonly<unknown>> =>
    Effect.gen(function* (_: Effect.Adapter) {
        if (options.id === null || options.id === undefined) {
            yield* _(new containerStatsError({ message: "Required parameter id was null or undefined" }));
        }

        const endpoint: string = "/containers/{id}/stats";
        const method: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" = "GET";
        const sanitizedEndpoint: string = endpoint.replace(`{${"id"}}`, encodeURIComponent(String(options.id)));

        const agent: IMobyConnectionAgent = yield* _(MobyConnectionAgent);
        const client: NodeHttp.client.Client.Default = yield* _(
            NodeHttp.nodeClient.make.pipe(Effect.provideService(NodeHttp.nodeClient.HttpAgent, agent))
        );

        return NodeHttp.request
            .make(method)(sanitizedEndpoint)
            .pipe(NodeHttp.request.prependUrl("http://0.0.0.0"))
            .pipe(addQueryParameter("stream", options.stream))
            .pipe(addQueryParameter("one-shot", options.one_shot))
            .pipe(client.pipe(NodeHttp.client.filterStatusOk))
            .pipe(Effect.flatMap(NodeHttp.response.schemaBodyJson(Schema.any)))
            .pipe(errorHandler(containerStatsError));
    }).pipe(Effect.flatten);

/**
 * Stop a container
 *
 * @param id - ID or name of the container
 * @param signal - Signal to send to the container as an integer or string (e.g.
 *   `SIGINT`).
 * @param t - Number of seconds to wait before killing the container
 */
export const containerStop = (
    options: containerStopOptions
): Effect.Effect<IMobyConnectionAgent, containerStopError, void> =>
    Effect.gen(function* (_: Effect.Adapter) {
        if (options.id === null || options.id === undefined) {
            yield* _(new containerStopError({ message: "Required parameter id was null or undefined" }));
        }

        const endpoint: string = "/containers/{id}/stop";
        const method: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" = "POST";
        const sanitizedEndpoint: string = endpoint.replace(`{${"id"}}`, encodeURIComponent(String(options.id)));

        const agent: IMobyConnectionAgent = yield* _(MobyConnectionAgent);
        const client: NodeHttp.client.Client.Default = yield* _(
            NodeHttp.nodeClient.make.pipe(Effect.provideService(NodeHttp.nodeClient.HttpAgent, agent))
        );

        return NodeHttp.request
            .make(method)(sanitizedEndpoint)
            .pipe(NodeHttp.request.prependUrl("http://0.0.0.0"))
            .pipe(addQueryParameter("signal", options.signal))
            .pipe(addQueryParameter("t", options.t))
            .pipe(client.pipe(NodeHttp.client.filterStatusOk))
            .pipe(errorHandler(containerStopError));
    }).pipe(Effect.flatten);

/**
 * On Unix systems, this is done by running the `ps` command. This endpoint is
 * not supported on Windows.
 *
 * @param id - ID or name of the container
 * @param ps_args - The arguments to pass to `ps`. For example, `aux`
 */
export const containerTop = (
    options: containerTopOptions
): Effect.Effect<IMobyConnectionAgent, containerTopError, Readonly<ContainerTopResponse>> =>
    Effect.gen(function* (_: Effect.Adapter) {
        if (options.id === null || options.id === undefined) {
            yield* _(new containerTopError({ message: "Required parameter id was null or undefined" }));
        }

        const endpoint: string = "/containers/{id}/top";
        const method: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" = "GET";
        const sanitizedEndpoint: string = endpoint.replace(`{${"id"}}`, encodeURIComponent(String(options.id)));

        const agent: IMobyConnectionAgent = yield* _(MobyConnectionAgent);
        const client: NodeHttp.client.Client.Default = yield* _(
            NodeHttp.nodeClient.make.pipe(Effect.provideService(NodeHttp.nodeClient.HttpAgent, agent))
        );

        return NodeHttp.request
            .make(method)(sanitizedEndpoint)
            .pipe(NodeHttp.request.prependUrl("http://0.0.0.0"))
            .pipe(addQueryParameter("ps_args", options.ps_args))
            .pipe(client.pipe(NodeHttp.client.filterStatusOk))
            .pipe(Effect.flatMap(NodeHttp.response.schemaBodyJson(ContainerTopResponseSchema)))
            .pipe(errorHandler(containerTopError));
    }).pipe(Effect.flatten);

/**
 * Resume a container which has been paused.
 *
 * @param id - ID or name of the container
 */
export const containerUnpause = (
    options: containerUnpauseOptions
): Effect.Effect<IMobyConnectionAgent, containerUnpauseError, void> =>
    Effect.gen(function* (_: Effect.Adapter) {
        if (options.id === null || options.id === undefined) {
            yield* _(new containerUnpauseError({ message: "Required parameter id was null or undefined" }));
        }

        const endpoint: string = "/containers/{id}/unpause";
        const method: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" = "POST";
        const sanitizedEndpoint: string = endpoint.replace(`{${"id"}}`, encodeURIComponent(String(options.id)));

        const agent: IMobyConnectionAgent = yield* _(MobyConnectionAgent);
        const client: NodeHttp.client.Client.Default = yield* _(
            NodeHttp.nodeClient.make.pipe(Effect.provideService(NodeHttp.nodeClient.HttpAgent, agent))
        );

        return NodeHttp.request
            .make(method)(sanitizedEndpoint)
            .pipe(NodeHttp.request.prependUrl("http://0.0.0.0"))
            .pipe(client.pipe(NodeHttp.client.filterStatusOk))
            .pipe(errorHandler(containerUnpauseError));
    }).pipe(Effect.flatten);

/**
 * Change various configuration options of a container without having to
 * recreate it.
 *
 * @param body -
 * @param id - ID or name of the container
 */
export const containerUpdate = (
    options: containerUpdateOptions
): Effect.Effect<IMobyConnectionAgent, containerUpdateError, Readonly<ContainerUpdateResponse>> =>
    Effect.gen(function* (_: Effect.Adapter) {
        if (options.body === null || options.body === undefined) {
            yield* _(new containerUpdateError({ message: "Required parameter body was null or undefined" }));
        }

        if (options.id === null || options.id === undefined) {
            yield* _(new containerUpdateError({ message: "Required parameter id was null or undefined" }));
        }

        const endpoint: string = "/containers/{id}/update";
        const method: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" = "POST";
        const sanitizedEndpoint: string = endpoint.replace(`{${"id"}}`, encodeURIComponent(String(options.id)));

        const agent: IMobyConnectionAgent = yield* _(MobyConnectionAgent);
        const client: NodeHttp.client.Client.Default = yield* _(
            NodeHttp.nodeClient.make.pipe(Effect.provideService(NodeHttp.nodeClient.HttpAgent, agent))
        );

        return NodeHttp.request
            .make(method)(sanitizedEndpoint)
            .pipe(NodeHttp.request.prependUrl("http://0.0.0.0"))
            .pipe(addHeader("Content-Type", "application/json"))
            .pipe(setBody(options.body, "IdUpdateBody"))
            .pipe(Effect.flatMap(client.pipe(NodeHttp.client.filterStatusOk)))
            .pipe(Effect.flatMap(NodeHttp.response.schemaBodyJson(ContainerUpdateResponseSchema)))
            .pipe(errorHandler(containerUpdateError));
    }).pipe(Effect.flatten);

/**
 * Block until a container stops, then returns the exit code.
 *
 * @param id - ID or name of the container
 * @param condition - Wait until a container state reaches the given condition.
 *   Defaults to `not-running` if omitted or empty.
 */
export const containerWait = (
    options: containerWaitOptions
): Effect.Effect<IMobyConnectionAgent, containerWaitError, Readonly<ContainerWaitResponse>> =>
    Effect.gen(function* (_: Effect.Adapter) {
        if (options.id === null || options.id === undefined) {
            yield* _(new containerWaitError({ message: "Required parameter id was null or undefined" }));
        }

        const endpoint: string = "/containers/{id}/wait";
        const method: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" = "POST";
        const sanitizedEndpoint: string = endpoint.replace(`{${"id"}}`, encodeURIComponent(String(options.id)));

        const agent: IMobyConnectionAgent = yield* _(MobyConnectionAgent);
        const client: NodeHttp.client.Client.Default = yield* _(
            NodeHttp.nodeClient.make.pipe(Effect.provideService(NodeHttp.nodeClient.HttpAgent, agent))
        );

        return NodeHttp.request
            .make(method)(sanitizedEndpoint)
            .pipe(NodeHttp.request.prependUrl("http://0.0.0.0"))
            .pipe(addQueryParameter("condition", options.condition))
            .pipe(client.pipe(NodeHttp.client.filterStatusOk))
            .pipe(Effect.flatMap(NodeHttp.response.schemaBodyJson(ContainerWaitResponseSchema)))
            .pipe(errorHandler(containerWaitError));
    }).pipe(Effect.flatten);

/**
 * Upload a tar archive to be extracted to a path in the filesystem of container
 * id. `path` parameter is asserted to be a directory. If it exists as a file,
 * 400 error will be returned with message "not a directory".
 *
 * @param body - The input stream must be a tar archive compressed with one of
 *   the following algorithms: `identity` (no compression), `gzip`, `bzip2`, or
 *   `xz`.
 * @param id - ID or name of the container
 * @param path - Path to a directory in the container to extract the archive’s
 *   contents into.
 * @param noOverwriteDirNonDir - If `1`, `true`, or `True` then it will be an
 *   error if unpacking the given content would cause an existing directory to
 *   be replaced with a non-directory and vice versa.
 * @param copyUIDGID - If `1`, `true`, then it will copy UID/GID maps to the
 *   dest file or dir
 */
export const putContainerArchive = (
    options: putContainerArchiveOptions
): Effect.Effect<IMobyConnectionAgent, putContainerArchiveError, void> =>
    Effect.gen(function* (_: Effect.Adapter) {
        if (options.body === null || options.body === undefined) {
            yield* _(new putContainerArchiveError({ message: "Required parameter body was null or undefined" }));
        }

        if (options.id === null || options.id === undefined) {
            yield* _(new putContainerArchiveError({ message: "Required parameter id was null or undefined" }));
        }

        if (options.path === null || options.path === undefined) {
            yield* _(new putContainerArchiveError({ message: "Required parameter path was null or undefined" }));
        }

        const endpoint: string = "/containers/{id}/archive";
        const method: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" = "PUT";
        const sanitizedEndpoint: string = endpoint.replace(`{${"id"}}`, encodeURIComponent(String(options.id)));

        const agent: IMobyConnectionAgent = yield* _(MobyConnectionAgent);
        const client: NodeHttp.client.Client.Default = yield* _(
            NodeHttp.nodeClient.make.pipe(Effect.provideService(NodeHttp.nodeClient.HttpAgent, agent))
        );

        return NodeHttp.request
            .make(method)(sanitizedEndpoint)
            .pipe(NodeHttp.request.prependUrl("http://0.0.0.0"))
            .pipe(addQueryParameter("path", options.path))
            .pipe(addQueryParameter("noOverwriteDirNonDir", options.noOverwriteDirNonDir))
            .pipe(addQueryParameter("copyUIDGID", options.copyUIDGID))
            .pipe(addHeader("Content-Type", "application/x-tar"))
            .pipe(setBody(options.body, "unknown"))
            .pipe(Effect.flatMap(client.pipe(NodeHttp.client.filterStatusOk)))
            .pipe(errorHandler(putContainerArchiveError));
    }).pipe(Effect.flatten);

/**
 * Get a tar archive of a resource in the filesystem of container id.
 *
 * @param id - ID or name of the container
 * @param path - Resource in the container’s filesystem to archive.
 */
export type containerArchiveWithConnectionAgentProvided = WithConnectionAgentProvided<typeof containerArchive>;

/**
 * A response header `X-Docker-Container-Path-Stat` is returned, containing a
 * base64 - encoded JSON object with some filesystem header information about
 * the path.
 *
 * @param id - ID or name of the container
 * @param path - Resource in the container’s filesystem to archive.
 */
export type containerArchiveInfoWithConnectionAgentProvided = WithConnectionAgentProvided<typeof containerArchiveInfo>;

/**
 * Attach to a container to read its output or send it input. You can attach to
 * the same container multiple times and you can reattach to containers that
 * have been detached. Either the `stream` or `logs` parameter must be `true`
 * for this endpoint to do anything. See the [documentation for the `docker
 * attach`
 * command](https://docs.docker.com/engine/reference/commandline/attach/) for
 * more details. ### Hijacking This endpoint hijacks the HTTP connection to
 * transport `stdin`, `stdout`, and `stderr` on the same socket. This is the
 * response from the daemon for an attach request: `HTTP/1.1 200 OK
 * Content-Type: application/vnd.docker.raw-stream [STREAM]` After the headers
 * and two new lines, the TCP connection can now be used for raw, bidirectional
 * communication between the client and server. To hint potential proxies about
 * connection hijacking, the Docker client can also optionally send connection
 * upgrade headers. For example, the client sends this request to upgrade the
 * connection: `POST /containers/16253994b7c4/attach?stream=1&stdout=1 HTTP/1.1
 * Upgrade: tcp Connection: Upgrade` The Docker daemon will respond with a `101
 * UPGRADED` response, and will similarly follow with the raw stream: `HTTP/1.1
 * 101 UPGRADED Content-Type: application/vnd.docker.raw-stream Connection:
 * Upgrade Upgrade: tcp [STREAM]` ### Stream format When the TTY setting is
 * disabled in [`POST /containers/create`](#operation/ContainerCreate), the HTTP
 * Content-Type header is set to application/vnd.docker.multiplexed-stream and
 * the stream over the hijacked connected is multiplexed to separate out
 * `stdout` and `stderr`. The stream consists of a series of frames, each
 * containing a header and a payload. The header contains the information which
 * the stream writes (`stdout` or `stderr`). It also contains the size of the
 * associated frame encoded in the last four bytes (`uint32`). It is encoded on
 * the first eight bytes like this: `go header := [8]byte{STREAM_TYPE, 0, 0, 0,
 * SIZE1, SIZE2, SIZE3, SIZE4} ` `STREAM_TYPE` can be: - 0: `stdin` (is written
 * on `stdout`) - 1: `stdout` - 2: `stderr` `SIZE1, SIZE2, SIZE3, SIZE4` are the
 * four bytes of the `uint32` size encoded as big endian. Following the header
 * is the payload, which is the specified number of bytes of `STREAM_TYPE`. The
 * simplest way to implement this protocol is the following: 1. Read 8 bytes. 2.
 * Choose `stdout` or `stderr` depending on the first byte. 3. Extract the frame
 * size from the last four bytes. 4. Read the extracted size and output it on
 * the correct output. 5. Goto 1. ### Stream format when using a TTY When the
 * TTY setting is enabled in [`POST
 * /containers/create`](#operation/ContainerCreate), the stream is not
 * multiplexed. The data exchanged over the hijacked connection is simply the
 * raw data from the process PTY and client's `stdin`.
 *
 * @param id - ID or name of the container
 * @param detachKeys - Override the key sequence for detaching a
 *   container.Format is a single character `[a-Z]` or `ctrl-<value>` where
 *   `<value>` is one of: `a-z`, `@`, `^`, `[`, `,` or `_`.
 * @param logs - Replay previous logs from the container. This is useful for
 *   attaching to a container that has started and you want to output everything
 *   since the container started. If `stream` is also enabled, once all the
 *   previous output has been returned, it will seamlessly transition into
 *   streaming current output.
 * @param stream - Stream attached streams from the time the request was made
 *   onwards.
 * @param stdin - Attach to `stdin`
 * @param stdout - Attach to `stdout`
 * @param stderr - Attach to `stderr`
 */
export type containerAttachWithConnectionAgentProvided = WithConnectionAgentProvided<typeof containerAttach>;

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
export type containerAttachWebsocketWithConnectionAgentProvided = WithConnectionAgentProvided<
    typeof containerAttachWebsocket
>;

/**
 * Returns which files in a container's filesystem have been added, deleted, or
 * modified. The `Kind` of modification can be one of: - `0`: Modified ("C") -
 * `1`: Added ("A") - `2`: Deleted ("D")
 *
 * @param id - ID or name of the container
 */
export type containerChangesWithConnectionAgentProvided = WithConnectionAgentProvided<typeof containerChanges>;

/**
 * Create a container
 *
 * @param body - Container to create
 * @param name - Assign the specified name to the container. Must match
 *   `/?[a-zA-Z0-9][a-zA-Z0-9_.-]+`.
 * @param platform - Platform in the format `os[/arch[/variant]]` used for image
 *   lookup. When specified, the daemon checks if the requested image is present
 *   in the local image cache with the given OS and Architecture, and otherwise
 *   returns a `404` status. If the option is not set, the host's native OS and
 *   Architecture are used to look up the image in the image cache. However, if
 *   no platform is passed and the given image does exist in the local image
 *   cache, but its OS or architecture does not match, the container is created
 *   with the available image, and a warning is added to the `Warnings` field in
 *   the response, for example; WARNING: The requested image's platform
 *   (linux/arm64/v8) does not match the detected host platform (linux/amd64)
 *   and no specific platform was requested
 */
export type containerCreateWithConnectionAgentProvided = WithConnectionAgentProvided<typeof containerCreate>;

/**
 * Remove a container
 *
 * @param id - ID or name of the container
 * @param v - Remove anonymous volumes associated with the container.
 * @param force - If the container is running, kill it before removing it.
 * @param link - Remove the specified link associated with the container.
 */
export type containerDeleteWithConnectionAgentProvided = WithConnectionAgentProvided<typeof containerDelete>;

/**
 * Export the contents of a container as a tarball.
 *
 * @param id - ID or name of the container
 */
export type containerExportWithConnectionAgentProvided = WithConnectionAgentProvided<typeof containerExport>;

/**
 * Return low-level information about a container.
 *
 * @param id - ID or name of the container
 * @param size - Return the size of container as fields `SizeRw` and
 *   `SizeRootFs`
 */
export type containerInspectWithConnectionAgentProvided = WithConnectionAgentProvided<typeof containerInspect>;

/**
 * Send a POSIX signal to a container, defaulting to killing to the container.
 *
 * @param id - ID or name of the container
 * @param signal - Signal to send to the container as an integer or string (e.g.
 *   `SIGINT`).
 */
export type containerKillWithConnectionAgentProvided = WithConnectionAgentProvided<typeof containerKill>;

/**
 * Returns a list of containers. For details on the format, see the [inspect
 * endpoint](#operation/ContainerInspect). Note that it uses a different,
 * smaller representation of a container than inspecting a single container. For
 * example, the list of linked containers is not propagated .
 *
 * @param all - Return all containers. By default, only running containers are
 *   shown.
 * @param limit - Return this number of most recently created containers,
 *   including non-running ones.
 * @param size - Return the size of container as fields `SizeRw` and
 *   `SizeRootFs`.
 * @param filters - Filters to process on the container list, encoded as JSON (a
 *   `map[string][]string`). For example, `{\"status\": [\"paused\"]}` will only
 *   return paused containers. Available filters: -
 *   `ancestor`=(`<image-name>[:<tag>]`, `<image id>`, or `<image@digest>`) -
 *   `before`=(`<container id>` or `<container name>`) -
 *   `expose`=(`<port>[/<proto>]`|`<startport-endport>/[<proto>]`) -
 *   `exited=<int>` containers with exit code of `<int>` -
 *   `health`=(`starting`|`healthy`|`unhealthy`|`none`) - `id=<ID>` a
 *   container's ID - `isolation=`(`default`|`process`|`hyperv`) (Windows daemon
 *   only) - `is-task=`(`true`|`false`) - `label=key` or `label=\"key=value\"`
 *   of a container label - `name=<name>` a container's name -
 *   `network`=(`<network id>` or `<network name>`) -
 *   `publish`=(`<port>[/<proto>]`|`<startport-endport>/[<proto>]`) -
 *   `since`=(`<container id>` or `<container name>`) -
 *   `status=`(`created`|`restarting`|`running`|`removing`|`paused`|`exited`|`dead`)
 *
 *   - `volume`=(`<volume name>` or `<mount point destination>`)
 */
export type containerListWithConnectionAgentProvided = WithConnectionAgentProvided<typeof containerList>;

/**
 * Get `stdout` and `stderr` logs from a container. Note: This endpoint works
 * only for containers with the `json-file` or `journald` logging driver.
 *
 * @param id - ID or name of the container
 * @param follow - Keep connection after returning logs.
 * @param stdout - Return logs from `stdout`
 * @param stderr - Return logs from `stderr`
 * @param since - Only return logs since this time, as a UNIX timestamp
 * @param until - Only return logs before this time, as a UNIX timestamp
 * @param timestamps - Add timestamps to every log line
 * @param tail - Only return this number of log lines from the end of the logs.
 *   Specify as an integer or `all` to output all log lines.
 */
export type containerLogsWithConnectionAgentProvided = WithConnectionAgentProvided<typeof containerLogs>;

/**
 * Use the freezer cgroup to suspend all processes in a container.
 * Traditionally, when suspending a process the `SIGSTOP` signal is used, which
 * is observable by the process being suspended. With the freezer cgroup the
 * process is unaware, and unable to capture, that it is being suspended, and
 * subsequently resumed.
 *
 * @param id - ID or name of the container
 */
export type containerPauseWithConnectionAgentProvided = WithConnectionAgentProvided<typeof containerPause>;

/**
 * Delete stopped containers
 *
 * @param filters - Filters to process on the prune list, encoded as JSON (a
 *   `map[string][]string`). Available filters: - `until=<timestamp>` Prune
 *   containers created before this timestamp. The `<timestamp>` can be Unix
 *   timestamps, date formatted timestamps, or Go duration strings (e.g. `10m`,
 *   `1h30m`) computed relative to the daemon machine’s time. - `label`
 *   (`label=<key>`, `label=<key>=<value>`, `label!=<key>`, or
 *   `label!=<key>=<value>`) Prune containers with (or without, in case
 *   `label!=...` is used) the specified labels.
 */
export type containerPruneWithConnectionAgentProvided = WithConnectionAgentProvided<typeof containerPrune>;

/**
 * Rename a container
 *
 * @param id - ID or name of the container
 * @param name - New name for the container
 */
export type containerRenameWithConnectionAgentProvided = WithConnectionAgentProvided<typeof containerRename>;

/**
 * Resize the TTY for a container.
 *
 * @param id - ID or name of the container
 * @param h - Height of the TTY session in characters
 * @param w - Width of the TTY session in characters
 */
export type containerResizeWithConnectionAgentProvided = WithConnectionAgentProvided<typeof containerResize>;

/**
 * Restart a container
 *
 * @param id - ID or name of the container
 * @param signal - Signal to send to the container as an integer or string (e.g.
 *   `SIGINT`).
 * @param t - Number of seconds to wait before killing the container
 */
export type containerRestartWithConnectionAgentProvided = WithConnectionAgentProvided<typeof containerRestart>;

/**
 * Start a container
 *
 * @param id - ID or name of the container
 * @param detachKeys - Override the key sequence for detaching a container.
 *   Format is a single character `[a-Z]` or `ctrl-<value>` where `<value>` is
 *   one of: `a-z`, `@`, `^`, `[`, `,` or `_`.
 */
export type containerStartWithConnectionAgentProvided = WithConnectionAgentProvided<typeof containerStart>;

/**
 * This endpoint returns a live stream of a container’s resource usage
 * statistics. The `precpu_stats` is the CPU statistic of the _previous_ read,
 * and is used to calculate the CPU usage percentage. It is not an exact copy of
 * the `cpu_stats` field. If either `precpu_stats.online_cpus` or
 * `cpu_stats.online_cpus` is nil then for compatibility with older daemons the
 * length of the corresponding `cpu_usage.percpu_usage` array should be used. On
 * a cgroup v2 host, the following fields are not set * `blkio_stats`: all
 * fields other than `io_service_bytes_recursive` * `cpu_stats`:
 * `cpu_usage.percpu_usage` * `memory_stats`: `max_usage` and `failcnt` Also,
 * `memory_stats.stats` fields are incompatible with cgroup v1. To calculate the
 * values shown by the `stats` command of the docker cli tool the following
 * formulas can be used: * used_memory = `memory_stats.usage -
 * memory_stats.stats.cache` * available_memory = `memory_stats.limit` * Memory
 * usage % = `(used_memory / available_memory) * 100.0` * cpu_delta =
 * `cpu_stats.cpu_usage.total_usage - precpu_stats.cpu_usage.total_usage` *
 * system_cpu_delta = `cpu_stats.system_cpu_usage -
 * precpu_stats.system_cpu_usage` * number_cpus =
 * `length(cpu_stats.cpu_usage.percpu_usage)` or `cpu_stats.online_cpus` * CPU
 * usage % = `(cpu_delta / system_cpu_delta) * number_cpus * 100.0`
 *
 * @param id - ID or name of the container
 * @param stream - Stream the output. If false, the stats will be output once
 *   and then it will disconnect.
 * @param one_shot - Only get a single stat instead of waiting for 2 cycles.
 *   Must be used with `stream=false`.
 */
export type containerStatsWithConnectionAgentProvided = WithConnectionAgentProvided<typeof containerStats>;

/**
 * Stop a container
 *
 * @param id - ID or name of the container
 * @param signal - Signal to send to the container as an integer or string (e.g.
 *   `SIGINT`).
 * @param t - Number of seconds to wait before killing the container
 */
export type containerStopWithConnectionAgentProvided = WithConnectionAgentProvided<typeof containerStop>;

/**
 * On Unix systems, this is done by running the `ps` command. This endpoint is
 * not supported on Windows.
 *
 * @param id - ID or name of the container
 * @param ps_args - The arguments to pass to `ps`. For example, `aux`
 */
export type containerTopWithConnectionAgentProvided = WithConnectionAgentProvided<typeof containerTop>;

/**
 * Resume a container which has been paused.
 *
 * @param id - ID or name of the container
 */
export type containerUnpauseWithConnectionAgentProvided = WithConnectionAgentProvided<typeof containerUnpause>;

/**
 * Change various configuration options of a container without having to
 * recreate it.
 *
 * @param body -
 * @param id - ID or name of the container
 */
export type containerUpdateWithConnectionAgentProvided = WithConnectionAgentProvided<typeof containerUpdate>;

/**
 * Block until a container stops, then returns the exit code.
 *
 * @param id - ID or name of the container
 * @param condition - Wait until a container state reaches the given condition.
 *   Defaults to `not-running` if omitted or empty.
 */
export type containerWaitWithConnectionAgentProvided = WithConnectionAgentProvided<typeof containerWait>;

/**
 * Upload a tar archive to be extracted to a path in the filesystem of container
 * id. `path` parameter is asserted to be a directory. If it exists as a file,
 * 400 error will be returned with message "not a directory".
 *
 * @param body - The input stream must be a tar archive compressed with one of
 *   the following algorithms: `identity` (no compression), `gzip`, `bzip2`, or
 *   `xz`.
 * @param id - ID or name of the container
 * @param path - Path to a directory in the container to extract the archive’s
 *   contents into.
 * @param noOverwriteDirNonDir - If `1`, `true`, or `True` then it will be an
 *   error if unpacking the given content would cause an existing directory to
 *   be replaced with a non-directory and vice versa.
 * @param copyUIDGID - If `1`, `true`, then it will copy UID/GID maps to the
 *   dest file or dir
 */
export type putContainerArchiveWithConnectionAgentProvided = WithConnectionAgentProvided<typeof putContainerArchive>;
