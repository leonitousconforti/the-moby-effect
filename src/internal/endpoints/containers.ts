import {
    HttpApi,
    HttpApiClient,
    HttpApiEndpoint,
    HttpApiError,
    HttpApiGroup,
    HttpApiSchema,
    HttpClient,
    HttpClientResponse,
    Error as PlatformError,
    type HttpClientError,
    type Socket,
} from "@effect/platform";
import { Effect, Predicate, Schema, Stream, Tuple, type Layer, type ParseResult } from "effect";

import { MobyConnectionOptions } from "../../MobyConnection.js";
import { makeAgnosticHttpClientLayer } from "../../MobyPlatforms.js";
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
} from "../generated/index.js";
import { ContainerIdentifier } from "../schemas/id.js";
import { Int64 } from "../schemas/int64.js";
import { HttpApiSocket, HttpApiStreamingRequest, HttpApiStreamingResponse, HttpApiWebsocket } from "./httpApiHacks.js";

/**
 * @since 1.0.0
 * @category Errors
 */
export const ContainersErrorTypeId: unique symbol = Symbol.for(
    "@the-moby-effect/endpoints/ContainersError"
) as ContainersErrorTypeId;

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
        | Socket.SocketError
        | HttpApiError.InternalServerError
        | HttpApiError.BadRequest
        | HttpApiError.Forbidden
        | HttpApiError.Conflict
        | HttpApiError.NotAcceptable
        | HttpApiError.NotFound
        | ParseResult.ParseError
        | HttpClientError.HttpClientError
        | HttpApiError.HttpApiDecodeError;
}> {
    get message() {
        return `${this.method}`;
    }

    static WrapForMethod(method: string) {
        return (cause: ContainersError["cause"]) => new this({ method, cause });
    }
}

/** @since 1.0.0 */
export class ListFilters extends Schema.parseJson(
    Schema.Struct({
        ancestor: Schema.optional(Schema.Array(Schema.String)),
        before: Schema.optional(Schema.Array(Schema.String)),
        expose: Schema.optional(Schema.Array(Schema.String)),
        exited: Schema.optional(Schema.Array(Schema.NumberFromString)),
        health: Schema.optional(Schema.Array(ContainerHealth.fields["Status"])),
        identifier: Schema.optional(Schema.Array(ContainerIdentifier)),
        isolation: Schema.optional(Schema.Array(ContainerHostConfig.fields["Isolation"])),
        "is-task": Schema.optional(Schema.BooleanFromString),
        label: Schema.optional(Schema.Array(Schema.String)),
        name: Schema.optional(Schema.Array(Schema.String)),
        network: Schema.optional(Schema.Array(Schema.String)),
        publish: Schema.optional(Schema.Array(Schema.String)),
        since: Schema.optional(Schema.Array(Schema.String)),
        status: Schema.optional(Schema.Array(ContainerState.fields["Status"])),
        volume: Schema.optional(Schema.String),
    })
) {}

/** @since 1.0.0 */
export class PruneFilters extends Schema.parseJson(
    Schema.Struct({
        until: Schema.optional(Schema.String),
        label: Schema.optional(Schema.Array(Schema.String)),
    })
) {}

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Container/operation/ContainerList */
const listContainersEndpoint = HttpApiEndpoint.get("list", "/json")
    .setUrlParams(
        Schema.Struct({
            all: Schema.optional(Schema.BooleanFromString),
            limit: Schema.optional(Schema.NumberFromString),
            size: Schema.optional(Schema.BooleanFromString),
            filters: Schema.optional(ListFilters),
        })
    )
    .addSuccess(Schema.Array(ContainerSummary), { status: 200 }) // 200 OK
    .addError(HttpApiError.BadRequest); // 400 Bad parameter

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Container/operation/ContainerCreate */
const createContainerEndpoint = HttpApiEndpoint.post("create", "/create")
    .setUrlParams(
        Schema.Struct({
            name: Schema.pattern(/^[a-zA-Z0-9][a-zA-Z0-9_.-]+/)(Schema.String),
            platform: Schema.optionalWith(Schema.String, { default: () => "" }),
        })
    )
    .setPayload(ContainerCreateRequest)
    .addSuccess(
        Schema.Struct({
            Id: ContainerIdentifier,
            Warnings: Schema.NullOr(Schema.Array(Schema.String)),
        }),
        { status: 201 }
    ) // 201 Created
    .addError(HttpApiError.BadRequest) // 400 Bad parameter
    .addError(HttpApiError.Forbidden) // 403 Forbidden
    .addError(HttpApiError.NotFound) // 404 Not Found
    .addError(HttpApiError.NotAcceptable) // 406 Not Acceptable
    .addError(HttpApiError.Conflict); // 409 Name conflicts

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Container/operation/ContainerInspect */
const inspectContainerEndpoint = HttpApiEndpoint.get("inspect", "/:id/json")
    .setPath(Schema.Struct({ identifier: ContainerIdentifier }))
    .setUrlParams(Schema.Struct({ size: Schema.optional(Schema.BooleanFromString) }))
    .addSuccess(ContainerInspectResponse) // 200 OK
    .addError(HttpApiError.NotFound); // 404 Not Found

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Container/operation/ContainerTop */
const topContainerEndpoint = HttpApiEndpoint.get("top", "/:id/top")
    .setPath(Schema.Struct({ identifier: ContainerIdentifier }))
    .setUrlParams(Schema.Struct({ ps_args: Schema.optional(Schema.String) }))
    .addSuccess(ContainerTopResponse) // 200 OK
    .addError(HttpApiError.NotFound); // 404 Not Found

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Container/operation/ContainerLogs */
const logsContainerEndpoint = HttpApiEndpoint.get("logs", "/:id/logs")
    .setPath(Schema.Struct({ identifier: ContainerIdentifier }))
    .setUrlParams(
        Schema.Struct({
            follow: Schema.optional(Schema.BooleanFromString),
            stdout: Schema.optional(Schema.BooleanFromString),
            stderr: Schema.optional(Schema.BooleanFromString),
            since: Schema.optional(Schema.NumberFromString),
            until: Schema.optional(Schema.NumberFromString),
            timestamps: Schema.optional(Schema.BooleanFromString),
            tail: Schema.optional(Schema.String),
        })
    )
    .addSuccess(HttpApiSchema.Empty(200)) // 200 OK
    .addError(HttpApiError.NotFound); // 404 Not Found

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Container/operation/ContainerChanges */
const changesContainerEndpoint = HttpApiEndpoint.get("changes", "/:id/changes")
    .setPath(Schema.Struct({ identifier: ContainerIdentifier }))
    .addSuccess(Schema.NullOr(Schema.Array(ArchiveChange)), { status: 200 }) // 200 OK
    .addError(HttpApiError.NotFound); // 404 Not Found

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Container/operation/ContainerExport */
const exportContainerEndpoint = HttpApiEndpoint.get("export", "/:id/export")
    .setPath(Schema.Struct({ identifier: ContainerIdentifier }))
    .addSuccess(HttpApiSchema.Empty(200)) // 200 OK
    .addError(HttpApiError.NotFound); // 404 Not Found

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Container/operation/ContainerStats */
const statsContainerEndpoint = HttpApiEndpoint.get("stats", "/:id/stats")
    .setPath(Schema.Struct({ identifier: ContainerIdentifier }))
    .setUrlParams(
        Schema.Struct({
            stream: Schema.optional(Schema.BooleanFromString),
            "one-shot": Schema.optional(Schema.BooleanFromString),
        })
    )
    .addSuccess(HttpApiSchema.Empty(200)) // 200 OK
    .addError(HttpApiError.NotFound); // 404 Not Found

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Container/operation/ContainerResize */
const resizeContainerEndpoint = HttpApiEndpoint.post("resize", "/:id/resize")
    .setPath(Schema.Struct({ identifier: ContainerIdentifier }))
    .setUrlParams(
        Schema.Struct({
            h: Schema.optional(Schema.NumberFromString),
            w: Schema.optional(Schema.NumberFromString),
        })
    )
    .addSuccess(HttpApiSchema.Empty(200)) // 200 OK
    .addError(HttpApiError.NotFound); // 404 Not Found

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Container/operation/ContainerStart */
const startContainerEndpoint = HttpApiEndpoint.post("start", "/:id/start")
    .setPath(Schema.Struct({ identifier: ContainerIdentifier }))
    .setUrlParams(
        Schema.Struct({
            detachKeys: Schema.optional(Schema.String),
        })
    )
    .addSuccess(HttpApiSchema.NoContent) // 204 No Content
    .addSuccess(HttpApiSchema.Empty(304)) // 304 Container already started
    .addError(HttpApiError.NotFound); // 404 Not Found

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Container/operation/ContainerStop */
const stopContainerEndpoint = HttpApiEndpoint.post("stop", "/:id/stop")
    .setPath(Schema.Struct({ identifier: ContainerIdentifier }))
    .setUrlParams(
        Schema.Struct({
            signal: Schema.optional(Schema.String),
            t: Schema.optional(Schema.NumberFromString),
        })
    )
    .addSuccess(HttpApiSchema.NoContent) // 204 No Content
    .addSuccess(HttpApiSchema.Empty(304)) // 304 Container already stopped
    .addError(HttpApiError.NotFound); // 404 Not Found

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Container/operation/ContainerRestart */
const restartContainerEndpoint = HttpApiEndpoint.post("restart", "/:id/restart")
    .setPath(Schema.Struct({ identifier: ContainerIdentifier }))
    .setUrlParams(
        Schema.Struct({
            signal: Schema.optional(Schema.String),
            t: Schema.optional(Schema.NumberFromString),
        })
    )
    .addSuccess(HttpApiSchema.NoContent) // 204 No Content
    .addError(HttpApiError.NotFound); // 404 Not Found

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Container/operation/ContainerKill */
const killContainerEndpoint = HttpApiEndpoint.post("kill", "/:id/kill")
    .setPath(Schema.Struct({ identifier: ContainerIdentifier }))
    .setUrlParams(
        Schema.Struct({
            signal: Schema.optional(Schema.String),
        })
    )
    .addSuccess(HttpApiSchema.NoContent) // 204 No Content
    .addError(HttpApiError.NotFound) // 404 Not Found
    .addError(HttpApiError.Conflict); // 409 Container is not running

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Container/operation/ContainerUpdate */
const updateContainerEndpoint = HttpApiEndpoint.post("update", "/:id/update")
    .setPath(Schema.Struct({ identifier: ContainerIdentifier }))
    .setPayload(ContainerConfig)
    .addSuccess(Schema.Struct({ Warnings: Schema.NullOr(Schema.Array(Schema.String)) }), { status: 200 }) // 200 OK
    .addError(HttpApiError.NotFound); // 404 Not Found

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Container/operation/ContainerRename */
const renameContainerEndpoint = HttpApiEndpoint.post("rename", "/:id/rename")
    .setPath(Schema.Struct({ identifier: ContainerIdentifier }))
    .setUrlParams(Schema.Struct({ name: Schema.String }))
    .addSuccess(HttpApiSchema.NoContent) // 204 No Content
    .addError(HttpApiError.NotFound) // 404 Not Found
    .addError(HttpApiError.Conflict); // 409 Name already in use

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Container/operation/ContainerPause */
const pauseContainerEndpoint = HttpApiEndpoint.post("pause", "/:id/pause")
    .setPath(Schema.Struct({ identifier: ContainerIdentifier }))
    .addSuccess(HttpApiSchema.NoContent) // 204 No Content
    .addError(HttpApiError.NotFound); // 404 Not Found

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Container/operation/ContainerUnpause */
const unpauseContainerEndpoint = HttpApiEndpoint.post("unpause", "/:id/unpause")
    .setPath(Schema.Struct({ identifier: ContainerIdentifier }))
    .addSuccess(HttpApiSchema.NoContent) // 204 No Content
    .addError(HttpApiError.NotFound); // 404 Not Found

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Container/operation/ContainerAttach */
const attachContainerEndpoint = HttpApiEndpoint.post("attach", "/:id/attach")
    .setPath(Schema.Struct({ identifier: ContainerIdentifier }))
    .setUrlParams(
        Schema.Struct({
            detachKeys: Schema.optional(Schema.String),
            logs: Schema.optional(Schema.BooleanFromString),
            stream: Schema.optional(Schema.BooleanFromString),
            stdin: Schema.optional(Schema.BooleanFromString),
            stdout: Schema.optional(Schema.BooleanFromString),
            stderr: Schema.optional(Schema.BooleanFromString),
        })
    )
    .setHeaders(
        Schema.Struct({
            Upgrade: Schema.Literal("tcp"),
            Connection: Schema.Literal("Upgrade"),
        })
    )
    .addSuccess(HttpApiSchema.Empty(101)) // 101 Switching Protocols
    .addSuccess(HttpApiSchema.Empty(200)) // 200 OK
    .addError(HttpApiError.BadRequest) // 400 Bad parameter
    .addError(HttpApiError.NotFound); // 404 Not Found

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Container/operation/ContainerAttachWebsocket */
const attachWebsocketContainerEndpoint = HttpApiEndpoint.get("attachWebsocket", "/:id/attach/ws")
    .setPath(Schema.Struct({ identifier: ContainerIdentifier }))
    .setUrlParams(
        Schema.Struct({
            detachKeys: Schema.optional(Schema.String),
            logs: Schema.optional(Schema.BooleanFromString),
            stream: Schema.optional(Schema.BooleanFromString),
            stdin: Schema.optional(Schema.BooleanFromString),
            stdout: Schema.optional(Schema.BooleanFromString),
            stderr: Schema.optional(Schema.BooleanFromString),
        })
    )
    .addSuccess(HttpApiSchema.Empty(101)) // 101 Switching Protocols
    .addSuccess(HttpApiSchema.Empty(200)) // 200 OK
    .addError(HttpApiError.BadRequest) // 400 Bad parameter
    .addError(HttpApiError.NotFound); // 404 Not Found

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Container/operation/ContainerWait */
const waitContainerEndpoint = HttpApiEndpoint.post("wait", "/:id/wait")
    .setPath(Schema.Struct({ identifier: ContainerIdentifier }))
    .setUrlParams(Schema.Struct({ condition: Schema.optional(Schema.String) }))
    .addSuccess(ContainerWaitResponse, { status: 200 }) // 200 OK
    .addError(HttpApiError.BadRequest) // 400 Bad parameter
    .addError(HttpApiError.NotFound); // 404 Not Found

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Container/operation/ContainerDelete */
const deleteContainerEndpoint = HttpApiEndpoint.del("delete", "/:id")
    .setPath(Schema.Struct({ identifier: ContainerIdentifier }))
    .setUrlParams(
        Schema.Struct({
            v: Schema.optional(Schema.BooleanFromString),
            force: Schema.optional(Schema.BooleanFromString),
            link: Schema.optional(Schema.BooleanFromString),
        })
    )
    .addSuccess(HttpApiSchema.NoContent) // 204 No Content
    .addError(HttpApiError.BadRequest) // 400 Bad parameter
    .addError(HttpApiError.NotFound) // 404 Not Found
    .addError(HttpApiError.Conflict); // 409 Conflict

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Container/operation/ContainerArchive */
const archiveContainerEndpoint = HttpApiEndpoint.get("archive", "/:id/archive")
    .setPath(Schema.Struct({ identifier: ContainerIdentifier }))
    .setUrlParams(Schema.Struct({ path: Schema.String }))
    .addSuccess(HttpApiSchema.Empty(200)) // 200 OK
    .addError(HttpApiError.BadRequest) // 400 Bad parameter
    .addError(HttpApiError.NotFound); // 404 Not Found

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Container/operation/ContainerArchiveInfo */
const archiveInfoContainerEndpoint = HttpApiEndpoint.head("archiveInfo", "/:id/archive")
    .setPath(Schema.Struct({ identifier: ContainerIdentifier }))
    .setUrlParams(Schema.Struct({ path: Schema.String }))
    .addSuccess(HttpApiSchema.Empty(200)) // 200 OK
    .addError(HttpApiError.BadRequest) // 400 Bad parameter
    .addError(HttpApiError.NotFound); // 404 Not Found

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Container/operation/PutContainerArchive */
const putArchiveContainerEndpoint = HttpApiEndpoint.put("putArchive", "/:id/archive")
    .setPath(Schema.Struct({ identifier: ContainerIdentifier }))
    .setUrlParams(
        Schema.Struct({
            path: Schema.String,
            noOverwriteDirNonDir: Schema.optional(Schema.String),
            copyUIDGidentifier: Schema.optional(Schema.String),
        })
    )
    .addSuccess(HttpApiSchema.Empty(200)) // 200 OK
    .addError(HttpApiError.BadRequest) // 400 Bad parameter
    .addError(HttpApiError.Forbidden) // 403 Forbidden
    .addError(HttpApiError.NotFound); // 404 Not Found

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Container/operation/ContainerPrune */
const pruneContainersEndpoint = HttpApiEndpoint.post("prune", "/prune")
    .setUrlParams(Schema.Struct({ filters: Schema.optional(PruneFilters) }))
    .addSuccess(
        Schema.Struct({
            ContainersDeleted: Schema.NullOr(Schema.Array(ContainerIdentifier)),
            SpaceReclaimed: Int64,
        }),
        { status: 200 }
    ); // 200 OK

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Container */
const ContainersGroup = HttpApiGroup.make("containers")
    .add(listContainersEndpoint)
    .add(createContainerEndpoint)
    .add(inspectContainerEndpoint)
    .add(topContainerEndpoint)
    .add(logsContainerEndpoint)
    .add(changesContainerEndpoint)
    .add(exportContainerEndpoint)
    .add(statsContainerEndpoint)
    .add(resizeContainerEndpoint)
    .add(startContainerEndpoint)
    .add(stopContainerEndpoint)
    .add(restartContainerEndpoint)
    .add(killContainerEndpoint)
    .add(updateContainerEndpoint)
    .add(renameContainerEndpoint)
    .add(pauseContainerEndpoint)
    .add(unpauseContainerEndpoint)
    .add(attachContainerEndpoint)
    .add(attachWebsocketContainerEndpoint)
    .add(waitContainerEndpoint)
    .add(deleteContainerEndpoint)
    .add(archiveContainerEndpoint)
    .add(archiveInfoContainerEndpoint)
    .add(putArchiveContainerEndpoint)
    .add(pruneContainersEndpoint)
    .addError(HttpApiError.InternalServerError)
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
export class Containers extends Effect.Service<Containers>()("@the-moby-effect/endpoints/Containers", {
    accessors: false,
    dependencies: [
        makeAgnosticHttpClientLayer(
            MobyConnectionOptions.socket({
                socketPath: "/var/run/docker.sock",
            })
        ),
    ],

    effect: Effect.gen(function* () {
        type Options<Name extends (typeof ContainersGroup.endpoints)[number]["name"]> =
            HttpApiEndpoint.HttpApiEndpoint.UrlParams<
                HttpApiEndpoint.HttpApiEndpoint.WithName<(typeof ContainersGroup.endpoints)[number], Name>
            >;

        const httpClient = yield* HttpClient.HttpClient;
        const context = yield* Effect.context<Socket.WebSocketConstructor>();
        const client = yield* HttpApiClient.group(ContainersApi, {
            httpClient,
            group: "containers",
        });

        const list_ = (filters?: Schema.Schema.Type<ListFilters> | undefined) =>
            Effect.mapError(client.list({ urlParams: { filters } }), ContainersError.WrapForMethod("list"));
        const create_ = (name: string, platform: string, container: ContainerCreateRequest) =>
            Effect.mapError(
                client.create({ urlParams: { name, platform }, payload: container }),
                ContainersError.WrapForMethod("create")
            );
        const inspect_ = (identifier: ContainerIdentifier, options?: Options<"inspect">) =>
            Effect.mapError(
                client.inspect({ path: { identifier }, urlParams: { ...options } }),
                ContainersError.WrapForMethod("inspect")
            );
        const top_ = (identifier: ContainerIdentifier, options?: Options<"top">) =>
            Effect.mapError(
                client.top({ path: { identifier }, urlParams: { ...options } }),
                ContainersError.WrapForMethod("top")
            );
        const logs_ = (identifier: ContainerIdentifier, options?: Options<"logs">) =>
            HttpApiStreamingResponse(
                ContainersApi,
                "containers",
                "logs",
                httpClient
            )({ path: { identifier }, urlParams: { ...options } })
                .pipe(Stream.decodeText())
                .pipe(Stream.splitLines)
                .pipe(Stream.mapError(ContainersError.WrapForMethod("logs")));
        const changes_ = (identifier: ContainerIdentifier) =>
            Effect.mapError(client.changes({ path: { identifier } }), ContainersError.WrapForMethod("changes"));
        const export_ = (identifier: ContainerIdentifier) =>
            Stream.mapError(
                HttpApiStreamingResponse(ContainersApi, "containers", "export", httpClient)({ path: { identifier } }),
                ContainersError.WrapForMethod("export")
            );
        const stats_ = (identifier: ContainerIdentifier, options?: Options<"stats">) =>
            HttpApiStreamingResponse(
                ContainersApi,
                "containers",
                "stats",
                httpClient
            )({ path: { identifier }, urlParams: { ...options } })
                .pipe(Stream.decodeText())
                .pipe(Stream.splitLines)
                .pipe(Stream.mapEffect(Schema.decode(Schema.parseJson(ContainerStatsResponse))))
                .pipe(Stream.mapError(ContainersError.WrapForMethod("stats")));
        const resize_ = (identifier: ContainerIdentifier, options?: Options<"resize">) =>
            Effect.mapError(
                client.resize({ path: { identifier }, urlParams: { ...options } }),
                ContainersError.WrapForMethod("resize")
            );
        const start_ = (identifier: ContainerIdentifier, options?: Options<"start">) =>
            Effect.mapError(
                client.start({ path: { identifier }, urlParams: { ...options } }),
                ContainersError.WrapForMethod("start")
            );
        const stop_ = (identifier: ContainerIdentifier, options?: Options<"stop">) =>
            Effect.mapError(
                client.stop({ path: { identifier }, urlParams: { ...options } }),
                ContainersError.WrapForMethod("stop")
            );
        const restart_ = (identifier: ContainerIdentifier, options?: Options<"restart">) =>
            Effect.mapError(
                client.restart({ path: { identifier }, urlParams: { ...options } }),
                ContainersError.WrapForMethod("restart")
            );
        const kill_ = (identifier: ContainerIdentifier, options?: Options<"kill">) =>
            Effect.mapError(
                client.kill({ path: { identifier }, urlParams: { ...options } }),
                ContainersError.WrapForMethod("kill")
            );
        const update_ = (identifier: ContainerIdentifier, config: ContainerConfig) =>
            Effect.mapError(
                client.update({ path: { identifier }, payload: config }),
                ContainersError.WrapForMethod("update")
            );
        const rename_ = (identifier: ContainerIdentifier, name: string) =>
            Effect.mapError(
                client.rename({ path: { identifier }, urlParams: { name } }),
                ContainersError.WrapForMethod("rename")
            );
        const pause_ = (identifier: ContainerIdentifier) =>
            Effect.mapError(client.pause({ path: { identifier } }), ContainersError.WrapForMethod("pause"));
        const unpause_ = (identifier: ContainerIdentifier) =>
            Effect.mapError(client.unpause({ path: { identifier } }), ContainersError.WrapForMethod("unpause"));
        const attach_ = (identifier: ContainerIdentifier, options?: Options<"attach">) =>
            Effect.mapError(
                HttpApiSocket(
                    ContainersApi,
                    "containers",
                    "attach",
                    httpClient
                )({
                    path: { identifier },
                    urlParams: { ...options },
                    headers: { Connection: "Upgrade", Upgrade: "tcp" },
                }),
                ContainersError.WrapForMethod("attach")
            );
        const attachWebsocket_ = (identifier: ContainerIdentifier, options?: Options<"attachWebsocket">) =>
            Effect.mapError(
                HttpApiWebsocket(
                    ContainersApi,
                    "containers",
                    "attachWebsocket"
                )({ path: { identifier }, urlParams: { ...options } }).pipe(Effect.provide(context)),
                ContainersError.WrapForMethod("attachWebsocket")
            );
        const wait_ = (identifier: ContainerIdentifier, options?: Options<"wait">) =>
            Effect.mapError(
                client.wait({ path: { identifier }, urlParams: { ...options } }),
                ContainersError.WrapForMethod("wait")
            );
        const delete_ = (identifier: ContainerIdentifier, options?: Options<"delete">) =>
            Effect.mapError(
                client.delete({ path: { identifier }, urlParams: { ...options } }),
                ContainersError.WrapForMethod("delete")
            );
        const archive_ = (identifier: ContainerIdentifier, options: Options<"archive">) =>
            client
                .archive({ path: { identifier }, urlParams: { ...options }, withResponse: true })
                .pipe(Effect.map(Tuple.getSecond))
                .pipe(
                    Effect.flatMap(
                        HttpClientResponse.schemaHeaders(
                            Schema.Struct({
                                "X-Docker-Container-Path-Stat": Schema.compose(
                                    Schema.StringFromBase64,
                                    Schema.parseJson()
                                ),
                            })
                        )
                    )
                )
                .pipe(Effect.map(({ "X-Docker-Container-Path-Stat": pathStat }) => pathStat))
                .pipe(Effect.mapError(ContainersError.WrapForMethod("archive")));
        const archiveInfo_ = (identifier: ContainerIdentifier, options: Options<"archiveInfo">) =>
            Stream.mapError(
                HttpApiStreamingResponse(
                    ContainersApi,
                    "containers",
                    "archiveInfo",
                    httpClient
                )({ path: { identifier }, urlParams: { ...options } }),
                ContainersError.WrapForMethod("archiveInfo")
            );
        const putArchive_ = <E>(
            identifier: ContainerIdentifier,
            stream: Stream.Stream<Uint8Array, E, never>,
            options: Options<"putArchive">
        ) =>
            Stream.mapError(
                HttpApiStreamingRequest(
                    ContainersApi,
                    "containers",
                    "putArchive",
                    httpClient,
                    stream
                )({ path: { identifier }, urlParams: { ...options } }),
                ContainersError.WrapForMethod("putArchive")
            );
        const prune_ = (filters?: Schema.Schema.Type<PruneFilters> | undefined) =>
            Effect.mapError(client.prune({ urlParams: { filters } }), ContainersError.WrapForMethod("prune"));

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
export const ContainersLayerLocalSocket: Layer.Layer<Containers, never, HttpClient.HttpClient> = Containers.Default;

/**
 * @since 1.0.0
 * @category Layers
 * @see https://docs.docker.com/reference/api/engine/latest/#tag/Container
 */
export const ContainersLayer: Layer.Layer<Containers, never, HttpClient.HttpClient | Socket.WebSocketConstructor> =
    Containers.DefaultWithoutDependencies;
