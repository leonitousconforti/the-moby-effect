import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as Schema from "effect/Schema";
import * as Stream from "effect/Stream";
import * as String from "effect/String";
import * as HttpClient from "effect/unstable/http/HttpClient";
import * as HttpClientResponse from "effect/unstable/http/HttpClientResponse";
import * as Url from "effect/unstable/http/Url";
import * as HttpApi from "effect/unstable/httpapi/HttpApi";
import * as HttpApiClient from "effect/unstable/httpapi/HttpApiClient";
import * as HttpApiEndpoint from "effect/unstable/httpapi/HttpApiEndpoint";
import * as HttpApiError from "effect/unstable/httpapi/HttpApiError";
import * as HttpApiGroup from "effect/unstable/httpapi/HttpApiGroup";
import * as HttpApiSchema from "effect/unstable/httpapi/HttpApiSchema";
import * as Socket from "effect/unstable/socket/Socket";

import { MobyConnectionOptions } from "../../MobyConnection.ts";
import { makeAgnosticHttpClientLayer } from "../../MobyPlatforms.ts";
import { responseToStreamingSocketOrFailUnsafe } from "../demux/hijack.ts";
import { makeRawSocket } from "../demux/raw.ts";
import {
    ArchiveChange,
    ContainerConfig,
    ContainerCreateRequest,
    ContainerHealth,
    ContainerHostConfig,
    ContainerInspectResponse,
    ContainerState,
    ContainerStatsResponse,
    ContainerSummary,
    ContainerTopResponse,
    ContainerWaitResponse,
} from "../generated/index.ts";
import { ContainerIdentifier } from "../schemas/id.ts";
import { DockerError } from "./circular.ts";
import { BadRequest, Conflict, Forbidden, InternalServerError, NotAcceptable, NotFound } from "./errors.ts";

/** @since 1.0.0 */
export const ListFilters = Schema.Struct({
    ancestor: Schema.optional(Schema.Array(Schema.String)),
    before: Schema.optional(Schema.Array(Schema.String)),
    expose: Schema.optional(Schema.Array(Schema.String)),
    exited: Schema.optional(Schema.Array(Schema.NumberFromString)),
    health: Schema.optional(Schema.Array(ContainerHealth.fields["Status"])),
    identifier: Schema.optional(Schema.Array(ContainerIdentifier)),
    // isolation: Schema.optional(Schema.Array(ContainerHostConfig.fields["Isolation"])),
    "is-task": Schema.optional(Schema.Literals(["true", "false"]).transform([true, false])),
    label: Schema.optional(Schema.Array(Schema.String)),
    name: Schema.optional(Schema.Array(Schema.String)),
    network: Schema.optional(Schema.Array(Schema.String)),
    publish: Schema.optional(Schema.Array(Schema.String)),
    since: Schema.optional(Schema.Array(Schema.String)),
    status: Schema.optional(Schema.Array(ContainerState.fields["Status"])),
    volume: Schema.optional(Schema.String),
});

/** @since 1.0.0 */
export const PruneFilters = Schema.Struct({
    until: Schema.optional(Schema.String),
    label: Schema.optional(Schema.Array(Schema.String)),
});

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Container/operation/ContainerList */
const listContainersEndpoint = HttpApiEndpoint.get("list", "/json", {
    query: {
        all: Schema.optional(Schema.Boolean),
        limit: Schema.optional(Schema.Number),
        size: Schema.optional(Schema.Boolean),
        filters: Schema.optional(ListFilters),
    },
    success: Schema.Array(ContainerSummary), // 200 OK
    error: [
        BadRequest, // 400 Bad parameter
        InternalServerError,
    ],
});

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Container/operation/ContainerCreate */
const createContainerEndpoint = HttpApiEndpoint.post("create", "/create", {
    query: {
        platform: Schema.optional(Schema.String),
        name: Schema.String.pipe(Schema.check(Schema.isPattern(/^[a-zA-Z0-9][a-zA-Z0-9_.-]+/)), Schema.optional),
    },
    payload: ContainerCreateRequest,
    success: Schema.Struct({
        Id: ContainerIdentifier,
        Warnings: Schema.NullOr(Schema.Array(Schema.String)),
    }).pipe(HttpApiSchema.status(201)), // 201 Created
    error: [
        BadRequest, // 400 Bad parameter
        Forbidden, // 403 Forbidden
        NotFound, // 404 Not Found
        NotAcceptable, // 406 Not Acceptable
        Conflict, // 409 Name conflicts
        InternalServerError,
    ],
});

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Container/operation/ContainerInspect */
const inspectContainerEndpoint = HttpApiEndpoint.get("inspect", "/:identifier/json", {
    params: { identifier: ContainerIdentifier },
    query: { size: Schema.optional(Schema.Boolean) },
    success: ContainerInspectResponse, // 200 OK
    error: [
        NotFound, // 404 Not Found
        InternalServerError,
    ],
});

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Container/operation/ContainerTop */
const topContainerEndpoint = HttpApiEndpoint.get("top", "/:identifier/top", {
    params: { identifier: ContainerIdentifier },
    query: { ps_args: Schema.optional(Schema.String) },
    success: ContainerTopResponse, // 200 OK
    error: [
        NotFound, // 404 Not Found
        InternalServerError,
    ],
});

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Container/operation/ContainerLogs */
const logsContainerEndpoint = HttpApiEndpoint.get("logs", "/:identifier/logs", {
    params: { identifier: ContainerIdentifier },
    query: {
        follow: Schema.optional(Schema.Boolean),
        stdout: Schema.optional(Schema.Boolean),
        stderr: Schema.optional(Schema.Boolean),
        since: Schema.optional(Schema.Number),
        until: Schema.optional(Schema.Number),
        timestamps: Schema.optional(Schema.Boolean),
        tail: Schema.optional(Schema.String),
    },
    success: HttpApiSchema.StreamUint8Array(), // 200 OK (streaming response)
    error: [
        NotFound, // 404 Not Found
        InternalServerError,
    ],
});

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Container/operation/ContainerChanges */
const changesContainerEndpoint = HttpApiEndpoint.get("changes", "/:identifier/changes", {
    params: { identifier: ContainerIdentifier },
    success: Schema.NullOr(Schema.Array(ArchiveChange)), // 200 OK
    error: [
        NotFound, // 404 Not Found
        InternalServerError,
    ],
});

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Container/operation/ContainerExport */
const exportContainerEndpoint = HttpApiEndpoint.get("export", "/:identifier/export", {
    params: { identifier: ContainerIdentifier },
    success: HttpApiSchema.StreamUint8Array(), // 200 OK (streaming response)
    error: [
        NotFound, // 404 Not Found
        InternalServerError,
    ],
});

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Container/operation/ContainerStats */
const statsContainerEndpoint = HttpApiEndpoint.get("stats", "/:identifier/stats", {
    params: { identifier: ContainerIdentifier },
    query: {
        stream: Schema.optional(Schema.Boolean),
        "one-shot": Schema.optional(Schema.Boolean),
    },
    success: HttpApiSchema.StreamUint8Array(), // 200 OK (streaming response)
    error: [
        NotFound, // 404 Not Found
        InternalServerError,
    ],
});

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Container/operation/ContainerResize */
const resizeContainerEndpoint = HttpApiEndpoint.post("resize", "/:identifier/resize", {
    params: { identifier: ContainerIdentifier },
    query: {
        h: Schema.optional(Schema.Number),
        w: Schema.optional(Schema.Number),
    },
    success: HttpApiSchema.Empty(200), // 200 OK
    error: [
        NotFound, // 404 Not Found
        InternalServerError,
    ],
});

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Container/operation/ContainerStart */
const startContainerEndpoint = HttpApiEndpoint.post("start", "/:identifier/start", {
    params: { identifier: ContainerIdentifier },
    query: {
        detachKeys: Schema.optional(Schema.String),
    },
    success: [
        HttpApiSchema.Empty(204), // 204 No Content
        HttpApiSchema.Empty(304), // 304 Container already started
    ],
    error: [
        NotFound, // 404 Not Found
        InternalServerError,
    ],
});

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Container/operation/ContainerStop */
const stopContainerEndpoint = HttpApiEndpoint.post("stop", "/:identifier/stop", {
    params: { identifier: ContainerIdentifier },
    query: {
        signal: Schema.optional(Schema.String),
        t: Schema.optional(Schema.Number),
    },
    success: [
        HttpApiSchema.Empty(204), // 204 No Content
        HttpApiSchema.Empty(304), // 304 Container already stopped
    ],
    error: [
        NotFound, // 404 Not Found
        InternalServerError,
    ],
});

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Container/operation/ContainerRestart */
const restartContainerEndpoint = HttpApiEndpoint.post("restart", "/:identifier/restart", {
    params: { identifier: ContainerIdentifier },
    query: {
        signal: Schema.optional(Schema.String),
        t: Schema.optional(Schema.Number),
    },
    success: HttpApiSchema.Empty(204), // 204 No Content
    error: [
        NotFound, // 404 Not Found
        InternalServerError,
    ],
});

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Container/operation/ContainerKill */
const killContainerEndpoint = HttpApiEndpoint.post("kill", "/:identifier/kill", {
    params: { identifier: ContainerIdentifier },
    query: {
        signal: Schema.optional(Schema.String),
    },
    success: HttpApiSchema.Empty(204), // 204 No Content
    error: [
        NotFound, // 404 Not Found
        Conflict, // 409 Container is not running
        InternalServerError,
    ],
});

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Container/operation/ContainerUpdate */
const updateContainerEndpoint = HttpApiEndpoint.post("update", "/:identifier/update", {
    params: { identifier: ContainerIdentifier },
    payload: ContainerConfig,
    success: Schema.Struct({ Warnings: Schema.NullOr(Schema.Array(Schema.String)) }), // 200 OK
    error: [
        NotFound, // 404 Not Found
        InternalServerError,
    ],
});

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Container/operation/ContainerRename */
const renameContainerEndpoint = HttpApiEndpoint.post("rename", "/:identifier/rename", {
    params: { identifier: ContainerIdentifier },
    query: { name: Schema.String },
    success: HttpApiSchema.Empty(204), // 204 No Content
    error: [
        NotFound, // 404 Not Found
        Conflict, // 409 Name already in use
        InternalServerError,
    ],
});

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Container/operation/ContainerPause */
const pauseContainerEndpoint = HttpApiEndpoint.post("pause", "/:identifier/pause", {
    params: { identifier: ContainerIdentifier },
    success: HttpApiSchema.Empty(204), // 204 No Content
    error: [
        NotFound, // 404 Not Found
        InternalServerError,
    ],
});

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Container/operation/ContainerUnpause */
const unpauseContainerEndpoint = HttpApiEndpoint.post("unpause", "/:identifier/unpause", {
    params: { identifier: ContainerIdentifier },
    success: HttpApiSchema.Empty(204), // 204 No Content
    error: [
        NotFound, // 404 Not Found
        InternalServerError,
    ],
});

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Container/operation/ContainerAttach */
const attachContainerEndpoint = HttpApiEndpoint.post("attach", "/:identifier/attach", {
    params: { identifier: ContainerIdentifier },
    query: {
        detachKeys: Schema.optional(Schema.String),
        logs: Schema.optional(Schema.Boolean),
        stream: Schema.optional(Schema.Boolean),
        stdin: Schema.optional(Schema.Boolean),
        stdout: Schema.optional(Schema.Boolean),
        stderr: Schema.optional(Schema.Boolean),
    },
    headers: {
        Upgrade: Schema.Literal("tcp"),
        Connection: Schema.Literal("Upgrade"),
    },
    success: [
        HttpApiSchema.Empty(101), // 101 Switching Protocols
        HttpApiSchema.Empty(200), // 200 OK
    ],
    error: [
        BadRequest, // 400 Bad parameter
        NotFound, // 404 Not Found
        InternalServerError,
    ],
});

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Container/operation/ContainerAttachWebsocket */
const attachWebsocketContainerEndpoint = HttpApiEndpoint.get("attachWebsocket", "/:identifier/attach/ws", {
    params: { identifier: ContainerIdentifier },
    query: {
        detachKeys: Schema.optional(Schema.String),
        logs: Schema.optional(Schema.Boolean),
        stream: Schema.optional(Schema.Boolean),
        stdin: Schema.optional(Schema.Boolean),
        stdout: Schema.optional(Schema.Boolean),
        stderr: Schema.optional(Schema.Boolean),
    },
    success: [
        HttpApiSchema.Empty(101), // 101 Switching Protocols
        HttpApiSchema.Empty(200), // 200 OK
    ],
    error: [
        BadRequest, // 400 Bad parameter
        NotFound, // 404 Not Found
        InternalServerError,
    ],
});

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Container/operation/ContainerWait */
const waitContainerEndpoint = HttpApiEndpoint.post("wait", "/:identifier/wait", {
    params: { identifier: ContainerIdentifier },
    query: { condition: Schema.optional(Schema.String) },
    success: ContainerWaitResponse, // 200 OK
    error: [
        BadRequest, // 400 Bad parameter
        NotFound, // 404 Not Found
        InternalServerError,
    ],
});

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Container/operation/ContainerDelete */
const deleteContainerEndpoint = HttpApiEndpoint.delete("delete", "/:identifier", {
    params: { identifier: ContainerIdentifier },
    query: {
        v: Schema.optional(Schema.Boolean),
        force: Schema.optional(Schema.Boolean),
        link: Schema.optional(Schema.Boolean),
    },
    success: HttpApiSchema.Empty(204), // 204 No Content
    error: [
        BadRequest, // 400 Bad parameter
        NotFound, // 404 Not Found
        Conflict, // 409 Conflict
        InternalServerError,
    ],
});

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Container/operation/ContainerArchive */
const archiveContainerEndpoint = HttpApiEndpoint.get("archive", "/:identifier/archive", {
    params: { identifier: ContainerIdentifier },
    query: { path: Schema.String },
    success: HttpApiSchema.StreamUint8Array(), // 200 OK (streaming response)
    error: [
        BadRequest, // 400 Bad parameter
        NotFound, // 404 Not Found
        InternalServerError,
    ],
});

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Container/operation/ContainerArchiveInfo */
const archiveInfoContainerEndpoint = HttpApiEndpoint.head("archiveInfo", "/:identifier/archive", {
    params: { identifier: ContainerIdentifier },
    query: { path: Schema.String },
    success: HttpApiSchema.Empty(200), // 200 OK
    error: [
        BadRequest, // 400 Bad parameter
        NotFound, // 404 Not Found
        InternalServerError,
    ],
});

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Container/operation/PutContainerArchive */
const putArchiveContainerEndpoint = HttpApiEndpoint.put("putArchive", "/:identifier/archive", {
    params: { identifier: ContainerIdentifier },
    payload: HttpApiSchema.StreamUint8Array(),
    query: {
        path: Schema.String,
        noOverwriteDirNonDir: Schema.optional(Schema.String),
        copyUIDGidentifier: Schema.optional(Schema.String),
    },
    success: HttpApiSchema.Empty(200), // 200 OK
    error: [
        BadRequest, // 400 Bad parameter
        Forbidden, // 403 Forbidden
        NotFound, // 404 Not Found
        InternalServerError,
    ],
});

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Container/operation/ContainerPrune */
const pruneContainersEndpoint = HttpApiEndpoint.post("prune", "/prune", {
    query: { filters: Schema.optional(PruneFilters) },
    success: Schema.Struct({
        ContainersDeleted: Schema.NullOr(Schema.Array(ContainerIdentifier)),
        SpaceReclaimed: Schema.BigIntFromString.check(Schema.isBetweenBigInt({ minimum: 0n, maximum: 2n ** 64n - 1n })),
    }), // 200 OK
    error: [InternalServerError],
});

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Container */
const ContainersGroup = HttpApiGroup.make("containers")
    .add(
        listContainersEndpoint,
        createContainerEndpoint,
        inspectContainerEndpoint,
        topContainerEndpoint,
        logsContainerEndpoint,
        changesContainerEndpoint,
        exportContainerEndpoint,
        statsContainerEndpoint,
        resizeContainerEndpoint,
        startContainerEndpoint,
        stopContainerEndpoint,
        restartContainerEndpoint,
        killContainerEndpoint,
        updateContainerEndpoint,
        renameContainerEndpoint,
        pauseContainerEndpoint,
        unpauseContainerEndpoint,
        attachContainerEndpoint,
        attachWebsocketContainerEndpoint,
        waitContainerEndpoint,
        deleteContainerEndpoint,
        archiveContainerEndpoint,
        archiveInfoContainerEndpoint,
        putArchiveContainerEndpoint,
        pruneContainersEndpoint
    )
    .prefix("/containers");

/**
 * @since 1.0.0
 * @category HttpApi
 * @see https://docs.docker.com/reference/api/engine/latest/#tag/Container
 */
export const ContainersApi = HttpApi.make("ContainersApi").add(ContainersGroup);

/**
 * @since 1.0.0
 * @category Services
 * @see https://docs.docker.com/reference/api/engine/latest/#tag/Container
 */
export class Containers extends Context.Service<Containers>()("@the-moby-effect/endpoints/Containers", {
    make: Effect.gen(function* () {
        type ContainersEndpoints = HttpApiGroup.Endpoints<typeof ContainersGroup>;
        type Options<Name extends ContainersEndpoints["identifier"]> = HttpApiEndpoint.WithIdentifier<
            ContainersEndpoints,
            Name
        >["~Query"]["Type"];

        const httpClient = yield* HttpClient.HttpClient;
        const ContainersError = DockerError.WrapForModule("containers");
        const websocketConstructor = yield* Socket.WebSocketConstructor;
        const client = yield* HttpApiClient.group(ContainersApi, {
            httpClient,
            group: "containers",
        });

        const list_ = (options?: Options<"list"> | undefined) =>
            Effect.mapError(
                client.list({
                    query: {
                        all: options?.all,
                        limit: options?.limit,
                        size: options?.size,
                        filters: options?.filters,
                    },
                }),
                ContainersError("list")
            );
        const create_ = (
            options: Omit<(typeof ContainerCreateRequest)["~type.make.in"], "HostConfig"> & {
                readonly Name?: string | undefined;
                readonly Platform?: string | undefined;
                readonly HostConfig?: (typeof ContainerHostConfig)["~type.make.in"] | undefined;
            }
        ) =>
            Effect.mapError(
                client.create({
                    query: { name: options.Name, platform: options.Platform },
                    payload: new ContainerCreateRequest({
                        ...options,
                        HostConfig: options.HostConfig ? new ContainerHostConfig(options.HostConfig) : undefined,
                    }),
                }),
                ContainersError("create")
            );
        const inspect_ = (identifier: ContainerIdentifier, options?: Options<"inspect">) =>
            Effect.mapError(
                client.inspect({ params: { identifier }, query: { ...options } }),
                ContainersError("inspect")
            );
        const top_ = (identifier: ContainerIdentifier, options?: Options<"top">) =>
            Effect.mapError(client.top({ params: { identifier }, query: { ...options } }), ContainersError("top"));
        const logs_ = (identifier: ContainerIdentifier, options?: Options<"logs">) =>
            client
                .logs({ params: { identifier }, query: { ...options } })
                .pipe(Stream.unwrap, Stream.decodeText(), Stream.splitLines, Stream.mapError(ContainersError("logs")));
        const changes_ = (identifier: ContainerIdentifier) =>
            Effect.mapError(client.changes({ params: { identifier } }), ContainersError("changes"));
        const export_ = (identifier: ContainerIdentifier) =>
            client.export({ params: { identifier } }).pipe(Stream.unwrap, Stream.mapError(ContainersError("export")));
        const stats_ = (identifier: ContainerIdentifier, options?: Options<"stats">) =>
            client.stats({ params: { identifier }, query: { ...options } }).pipe(
                Stream.unwrap,
                Stream.decodeText(),
                Stream.splitLines,
                Stream.mapEffect((line) => Schema.decodeEffect(Schema.fromJsonString(ContainerStatsResponse))(line)),
                Stream.mapError(ContainersError("stats"))
            );

        const resize_ = (identifier: ContainerIdentifier, options?: Options<"resize">) =>
            Effect.mapError(
                client.resize({ params: { identifier }, query: { ...options } }),
                ContainersError("resize")
            );
        const start_ = (identifier: ContainerIdentifier, options?: Options<"start">) =>
            Effect.mapError(client.start({ params: { identifier }, query: { ...options } }), ContainersError("start"));
        const stop_ = (identifier: ContainerIdentifier, options?: Options<"stop">) =>
            Effect.mapError(client.stop({ params: { identifier }, query: { ...options } }), ContainersError("stop"));
        const restart_ = (identifier: ContainerIdentifier, options?: Options<"restart">) =>
            Effect.mapError(
                client.restart({ params: { identifier }, query: { ...options } }),
                ContainersError("restart")
            );
        const kill_ = (identifier: ContainerIdentifier, options?: Options<"kill">) =>
            Effect.mapError(client.kill({ params: { identifier }, query: { ...options } }), ContainersError("kill"));
        const update_ = (identifier: ContainerIdentifier, config: (typeof ContainerConfig)["~type.make.in"]) =>
            Effect.mapError(
                client.update({ params: { identifier }, payload: new ContainerConfig(config) }),
                ContainersError("update")
            );
        const rename_ = (identifier: ContainerIdentifier, name: string) =>
            Effect.mapError(client.rename({ params: { identifier }, query: { name } }), ContainersError("rename"));
        const pause_ = (identifier: ContainerIdentifier) =>
            Effect.mapError(client.pause({ params: { identifier } }), ContainersError("pause"));
        const unpause_ = (identifier: ContainerIdentifier) =>
            Effect.mapError(client.unpause({ params: { identifier } }), ContainersError("unpause"));
        const attach_ = (identifier: ContainerIdentifier, options?: Options<"attach">) =>
            client
                .attach({
                    params: { identifier },
                    query: { ...options },
                    headers: { Connection: "Upgrade", Upgrade: "tcp" }, // FIXME: Broken on undici
                    responseMode: "response-only",
                })
                .pipe(
                    Effect.flatMap(responseToStreamingSocketOrFailUnsafe),
                    Effect.mapError(ContainersError("attach"))
                );
        const attachWebsocket_ = (identifier: ContainerIdentifier, options?: Options<"attachWebsocket">) =>
            Effect.gen(function* () {
                const baseUrl = "ws://0.0.0.0";
                const stripBaseUrl = String.replace(baseUrl, String.empty);
                const emptyResponse = new Response(undefined, { status: 200 });
                const noopHttpClient = HttpClient.make((request) =>
                    Effect.succeed(HttpClientResponse.fromWeb(request, emptyResponse))
                );

                const client = yield* HttpApiClient.endpoint(ContainersApi, {
                    endpoint: "attachWebsocket",
                    httpClient: noopHttpClient,
                    group: "containers",
                    baseUrl,
                });

                const response = yield* client({
                    responseMode: "response-only",
                    params: { identifier },
                    query: { ...options },
                });

                const { hash, url, urlParams } = response.request;
                const wsUrl = yield* Url.make(url, urlParams, hash.valueOrUndefined).pipe(
                    Effect.fromResult,
                    Effect.mapError((_cause) => new HttpApiError.BadRequest()),
                    Effect.map((url) => url.toString()),
                    Effect.map(stripBaseUrl)
                );

                const websocket = yield* Effect.provideService(
                    Socket.makeWebSocket(wsUrl),
                    Socket.WebSocketConstructor,
                    websocketConstructor
                );

                return makeRawSocket(websocket);
            }).pipe(Effect.mapError(ContainersError("attachWebsocket")));
        const wait_ = (identifier: ContainerIdentifier, options?: Options<"wait">) =>
            Effect.mapError(client.wait({ params: { identifier }, query: { ...options } }), ContainersError("wait"));
        const delete_ = (identifier: ContainerIdentifier, options?: Options<"delete">) =>
            Effect.mapError(
                client.delete({ params: { identifier }, query: { ...options } }),
                ContainersError("delete")
            );
        const archive_ = (identifier: ContainerIdentifier, options: Options<"archive">) =>
            client
                .archive({ params: { identifier }, query: { ...options } })
                .pipe(Stream.unwrap, Stream.mapError(ContainersError("archive")));
        const archiveInfo_ = (identifier: ContainerIdentifier, options: Options<"archiveInfo">) =>
            client.archiveInfo({ params: { identifier }, query: { ...options }, responseMode: "response-only" }).pipe(
                Effect.flatMap(
                    HttpClientResponse.schemaHeaders(
                        Schema.Struct({
                            "x-docker-container-path-stat": Schema.StringFromBase64.pipe(
                                Schema.decodeTo(Schema.UnknownFromJsonString),
                                Schema.optional
                            ),
                        })
                    )
                ),
                Effect.map(({ "x-docker-container-path-stat": pathStat }) => pathStat),
                Effect.mapError(ContainersError("archiveInfo"))
            );
        const putArchive_ = <E, R>(
            identifier: ContainerIdentifier,
            stream: Stream.Stream<Uint8Array, E, R>,
            options: Options<"putArchive">
        ) =>
            Effect.contextWith((context: Context.Context<R>) =>
                client.putArchive({
                    params: { identifier },
                    query: { ...options },
                    payload: Stream.provideContext(stream, context),
                })
            ).pipe(Effect.mapError(ContainersError("putArchive")));
        const prune_ = (filters?: Schema.Schema.Type<typeof PruneFilters> | undefined) =>
            Effect.mapError(client.prune({ query: { filters } }), ContainersError("prune"));

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
    }),
}) {}

/**
 * @since 1.0.0
 * @category Layers
 * @see https://docs.docker.com/reference/api/engine/latest/#tag/Container
 */
export const ContainersLayer: Layer.Layer<Containers, never, HttpClient.HttpClient | Socket.WebSocketConstructor> =
    Layer.effect(Containers, Containers.make);

/**
 * @since 1.0.0
 * @category Layers
 * @see https://docs.docker.com/reference/api/engine/latest/#tag/Container
 */
export const ContainersLayerLocalSocket: Layer.Layer<
    Containers,
    never,
    HttpClient.HttpClient | Socket.WebSocketConstructor
> = ContainersLayer.pipe(
    Layer.provide(
        makeAgnosticHttpClientLayer(
            MobyConnectionOptions.socket({
                socketPath: "/var/run/docker.sock",
            })
        )
    )
);
