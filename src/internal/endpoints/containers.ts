import {
    HttpApi,
    HttpApiClient,
    HttpApiEndpoint,
    HttpApiError,
    HttpApiGroup,
    HttpApiSchema,
    HttpClient,
    HttpClientRequest,
    HttpClientResponse,
    Socket,
    UrlParams,
} from "@effect/platform";
import { Effect, Either, Schema, Stream, Tuple, type Layer } from "effect";

import { MobyConnectionOptions } from "../../MobyConnection.js";
import { makeRawSocket, responseToStreamingSocketOrFailUnsafe } from "../../MobyDemux.js";
import { makeAgnosticHttpClientLayer } from "../../MobyPlatforms.js";
import {
    ContainerChange,
    ContainerConfig,
    ContainerCreateRequest,
    ContainerCreateResponse,
    ContainerHostConfig,
    ContainerInspectResponse,
    ContainerListResponseItem,
    ContainerPruneResponse,
    ContainerTopResponse,
    ContainerUpdateResponse,
    ContainerWaitResponse,
    Health,
    State,
} from "../generated/index.js";
import { ContainerId } from "../schemas/id.js";

/** @since 1.0.0 */
export class ListFilters extends Schema.parseJson(
    Schema.Struct({
        ancestor: Schema.optional(Schema.Array(Schema.String)),
        before: Schema.optional(Schema.Array(Schema.String)),
        expose: Schema.optional(Schema.Array(Schema.String)),
        exited: Schema.optional(Schema.Array(Schema.NumberFromString)),
        health: Schema.optional(Schema.Array(Health.fields["Status"])),
        id: Schema.optional(Schema.Array(ContainerId)),
        isolation: Schema.optional(Schema.Array(ContainerHostConfig.fields["Isolation"])),
        "is-task": Schema.optional(Schema.BooleanFromString),
        label: Schema.optional(Schema.Array(Schema.String)),
        name: Schema.optional(Schema.Array(Schema.String)),
        network: Schema.optional(Schema.Array(Schema.String)),
        publish: Schema.optional(Schema.Array(Schema.String)),
        since: Schema.optional(Schema.Array(Schema.String)),
        status: Schema.optional(Schema.Array(State.fields["Status"])),
        volume: Schema.optional(Schema.BooleanFromString),
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
    .addSuccess(Schema.Array(ContainerListResponseItem), { status: 200 }) // 200 OK
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
    .addSuccess(ContainerCreateResponse, { status: 201 }) // 201 Created
    .addError(HttpApiError.BadRequest) // 400 Bad parameter
    .addError(HttpApiError.Forbidden) // 403 Forbidden
    .addError(HttpApiError.NotFound) // 404 Not Found
    .addError(HttpApiError.NotAcceptable) // 406 Not Acceptable
    .addError(HttpApiError.Conflict); // 409 Name conflicts

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Container/operation/ContainerInspect */
const inspectContainerEndpoint = HttpApiEndpoint.get("inspect", "/:id/json")
    .setPath(Schema.Struct({ id: ContainerId }))
    .setUrlParams(Schema.Struct({ size: Schema.optional(Schema.BooleanFromString) }))
    .addSuccess(ContainerInspectResponse) // 200 OK
    .addError(HttpApiError.NotFound); // 404 Not Found

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Container/operation/ContainerTop */
const topContainerEndpoint = HttpApiEndpoint.get("top", "/:id/top")
    .setPath(Schema.Struct({ id: ContainerId }))
    .setUrlParams(Schema.Struct({ ps_args: Schema.optional(Schema.String) }))
    .addSuccess(ContainerTopResponse) // 200 OK
    .addError(HttpApiError.NotFound); // 404 Not Found

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Container/operation/ContainerLogs */
const logsContainerEndpoint = HttpApiEndpoint.get("logs", "/:id/logs")
    .setPath(Schema.Struct({ id: ContainerId }))
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
    .setPath(Schema.Struct({ id: ContainerId }))
    .addSuccess(Schema.NullOr(Schema.Array(ContainerChange)), { status: 200 }) // 200 OK
    .addError(HttpApiError.NotFound); // 404 Not Found

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Container/operation/ContainerExport */
const exportContainerEndpoint = HttpApiEndpoint.get("export", "/:id/export")
    .setPath(Schema.Struct({ id: ContainerId }))
    .addSuccess(HttpApiSchema.Empty(200)) // 200 OK
    .addError(HttpApiError.NotFound); // 404 Not Found

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Container/operation/ContainerStats */
const statsContainerEndpoint = HttpApiEndpoint.get("stats", "/:id/stats")
    .setPath(Schema.Struct({ id: ContainerId }))
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
    .setPath(Schema.Struct({ id: ContainerId }))
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
    .setPath(Schema.Struct({ id: ContainerId }))
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
    .setPath(Schema.Struct({ id: ContainerId }))
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
    .setPath(Schema.Struct({ id: ContainerId }))
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
    .setPath(Schema.Struct({ id: ContainerId }))
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
    .setPath(Schema.Struct({ id: ContainerId }))
    .setPayload(ContainerConfig)
    .addSuccess(ContainerUpdateResponse, { status: 200 }) // 200 OK
    .addError(HttpApiError.NotFound); // 404 Not Found

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Container/operation/ContainerRename */
const renameContainerEndpoint = HttpApiEndpoint.post("rename", "/:id/rename")
    .setPath(Schema.Struct({ id: ContainerId }))
    .setUrlParams(Schema.Struct({ name: Schema.String }))
    .addSuccess(HttpApiSchema.NoContent) // 204 No Content
    .addError(HttpApiError.NotFound) // 404 Not Found
    .addError(HttpApiError.Conflict); // 409 Name already in use

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Container/operation/ContainerPause */
const pauseContainerEndpoint = HttpApiEndpoint.post("pause", "/:id/pause")
    .setPath(Schema.Struct({ id: ContainerId }))
    .addSuccess(HttpApiSchema.NoContent) // 204 No Content
    .addError(HttpApiError.NotFound); // 404 Not Found

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Container/operation/ContainerUnpause */
const unpauseContainerEndpoint = HttpApiEndpoint.post("unpause", "/:id/unpause")
    .setPath(Schema.Struct({ id: ContainerId }))
    .addSuccess(HttpApiSchema.NoContent) // 204 No Content
    .addError(HttpApiError.NotFound); // 404 Not Found

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Container/operation/ContainerAttach */
const attachContainerEndpoint = HttpApiEndpoint.post("attach", "/:id/attach")
    .setPath(Schema.Struct({ id: ContainerId }))
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
    .setPath(Schema.Struct({ id: ContainerId }))
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
    .setPath(Schema.Struct({ id: ContainerId }))
    .setUrlParams(Schema.Struct({ condition: Schema.optional(Schema.String) }))
    .addSuccess(ContainerWaitResponse, { status: 200 }) // 200 OK
    .addError(HttpApiError.BadRequest) // 400 Bad parameter
    .addError(HttpApiError.NotFound); // 404 Not Found

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Container/operation/ContainerDelete */
const deleteContainerEndpoint = HttpApiEndpoint.del("delete", "/:id")
    .setPath(Schema.Struct({ id: ContainerId }))
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
    .setPath(Schema.Struct({ id: ContainerId }))
    .setUrlParams(Schema.Struct({ path: Schema.String }))
    .addSuccess(HttpApiSchema.Empty(200)) // 200 OK
    .addError(HttpApiError.BadRequest) // 400 Bad parameter
    .addError(HttpApiError.NotFound); // 404 Not Found

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Container/operation/ContainerArchiveInfo */
const archiveInfoContainerEndpoint = HttpApiEndpoint.head("archiveInfo", "/:id/archive")
    .setPath(Schema.Struct({ id: ContainerId }))
    .setUrlParams(Schema.Struct({ path: Schema.String }))
    .addSuccess(HttpApiSchema.Empty(200)) // 200 OK
    .addError(HttpApiError.BadRequest) // 400 Bad parameter
    .addError(HttpApiError.NotFound); // 404 Not Found

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Container/operation/PutContainerArchive */
const putArchiveContainerEndpoint = HttpApiEndpoint.put("putArchive", "/:id/archive")
    .setPath(Schema.Struct({ id: ContainerId }))
    .setUrlParams(
        Schema.Struct({
            path: Schema.String,
            noOverwriteDirNonDir: Schema.optional(Schema.String),
            copyUIDGID: Schema.optional(Schema.String),
        })
    )
    // .setPayload(
    //     Schema.Uint8ArrayFromSelf.pipe(
    //         HttpApiSchema.withEncoding({
    //             kind: "Uint8Array",
    //             contentType: "application/x-tar",
    //         })
    //     )
    // )
    .addSuccess(HttpApiSchema.Empty(200)) // 200 OK
    .addError(HttpApiError.BadRequest) // 400 Bad parameter
    .addError(HttpApiError.Forbidden) // 403 Forbidden
    .addError(HttpApiError.NotFound); // 404 Not Found

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Container/operation/ContainerPrune */
const pruneContainersEndpoint = HttpApiEndpoint.post("prune", "/prune")
    .setUrlParams(Schema.Struct({ filters: Schema.optional(Schema.String) }))
    .addSuccess(ContainerPruneResponse, { status: 200 }); // 200 OK

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
export class ContainersService extends Effect.Service<ContainersService>()("@the-moby-effect/endpoints/Containers", {
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
        const context = yield* Effect.context<HttpClient.HttpClient | Socket.WebSocketConstructor>();

        // Regular http client for "normal" rest endpoints
        const client = yield* HttpApiClient.group(ContainersApi, {
            httpClient,
            group: "containers",
        });

        const emptyResponse = new Response(undefined, { status: 200 });
        const noopHttpClient = HttpClient.make((request) =>
            Effect.succeed(HttpClientResponse.fromWeb(request, emptyResponse))
        );
        const websocketClient = yield* HttpApiClient.group(ContainersApi, {
            group: "containers",
            httpClient: noopHttpClient,
        });

        const list_ = (filters?: Schema.Schema.Type<ListFilters> | undefined) =>
            client.list({ urlParams: { filters } });
        const create_ = (name: string, platform: string, container: ContainerCreateRequest) =>
            client.create({ urlParams: { name, platform }, payload: container });
        const inspect_ = (id: ContainerId, options?: Options<"inspect">) =>
            client.inspect({ path: { id }, urlParams: { ...options } });
        const top_ = (id: ContainerId, options?: Options<"top">) =>
            client.top({ path: { id }, urlParams: { ...options } });
        const logs_ = (id: ContainerId, options?: Options<"logs">) =>
            client.logs({ path: { id }, urlParams: { ...options } });
        const changes_ = (id: ContainerId) => client.changes({ path: { id } });
        const export_ = (id: ContainerId) => client.export({ path: { id } });
        const stats_ = (id: ContainerId, options?: Options<"stats">) =>
            client
                .stats({ path: { id }, urlParams: { ...options }, withResponse: true })
                .pipe(Effect.map(Tuple.getSecond))
                .pipe(Effect.map((response) => response.stream))
                .pipe(Stream.unwrap);
        const resize_ = (id: ContainerId, options?: Options<"resize">) =>
            client.resize({ path: { id }, urlParams: { ...options } });
        const start_ = (id: ContainerId, options?: Options<"start">) =>
            client.start({ path: { id }, urlParams: { ...options } });
        const stop_ = (id: ContainerId, options?: Options<"stop">) =>
            client.stop({ path: { id }, urlParams: { ...options } });
        const restart_ = (id: ContainerId, options?: Options<"restart">) =>
            client.restart({ path: { id }, urlParams: { ...options } });
        const kill_ = (id: ContainerId, options?: Options<"kill">) =>
            client.kill({ path: { id }, urlParams: { ...options } });
        const update_ = (id: ContainerId, config: ContainerConfig) => client.update({ path: { id }, payload: config });
        const rename_ = (id: ContainerId, name: string) => client.rename({ path: { id }, urlParams: { name } });
        const pause_ = (id: ContainerId) => client.pause({ path: { id } });
        const unpause_ = (id: ContainerId) => client.unpause({ path: { id } });
        const attach_ = (id: ContainerId, options?: Options<"attach">) =>
            client
                .attach({
                    path: { id },
                    urlParams: { ...options },
                    headers: { Connection: "Upgrade", Upgrade: "tcp" },
                    withResponse: true,
                })
                .pipe(Effect.map(Tuple.getSecond))
                .pipe(Effect.flatMap(responseToStreamingSocketOrFailUnsafe));
        const attachWebsocket_ = (id: ContainerId, options?: Options<"attachWebsocket">) =>
            websocketClient
                .attachWebsocket({ path: { id }, urlParams: { ...options }, withResponse: true })
                .pipe(Effect.map(Tuple.getSecond))
                .pipe(
                    Effect.flatMap(({ request: { hash, url, urlParams } }) =>
                        Either.mapLeft(
                            UrlParams.makeUrl(url, urlParams, hash),
                            (_cause) => new HttpApiError.BadRequest()
                        )
                    )
                )
                .pipe(Effect.map((url) => url.toString()))
                .pipe(Effect.flatMap(Socket.makeWebSocket))
                .pipe(Effect.map(makeRawSocket))
                .pipe(Effect.provide(context));
        const wait_ = (id: ContainerId, options?: Options<"wait">) =>
            client.wait({ path: { id }, urlParams: { ...options } });
        const delete_ = (id: ContainerId, options?: Options<"delete">) =>
            client.delete({ path: { id }, urlParams: { ...options } });
        const archive_ = (id: ContainerId, options: Options<"archive">) =>
            client.archive({ path: { id }, urlParams: { ...options } });
        const archiveInfo_ = (id: ContainerId, options: Options<"archiveInfo">) =>
            client.archiveInfo({ path: { id }, urlParams: { ...options } });
        const putArchive_ = <E>(
            id: ContainerId,
            stream: Stream.Stream<Uint8Array, E, never>,
            options: Options<"putArchive">
        ) =>
            Effect.flatMap(
                HttpApiClient.endpoint(ContainersApi, {
                    httpClient,
                    group: "containers",
                    endpoint: "putArchive",
                    transformClient: HttpClient.mapRequest(HttpClientRequest.bodyStream(stream)),
                }),
                (client) => client({ path: { id }, urlParams: { ...options } })
            );
        const prune_ = (filters?: string | undefined) => client.prune({ urlParams: { filters } });

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
export const ContainersLayerLocalSocket: Layer.Layer<ContainersService, never, HttpClient.HttpClient> =
    ContainersService.Default;

/**
 * @since 1.0.0
 * @category Layers
 * @see https://docs.docker.com/reference/api/engine/latest/#tag/Container
 */
export const ContainersLayer: Layer.Layer<
    ContainersService,
    never,
    HttpClient.HttpClient | Socket.WebSocketConstructor
> = ContainersService.DefaultWithoutDependencies;
