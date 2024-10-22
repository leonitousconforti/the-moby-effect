/**
 * @since 1.0.0
 * @see https://docs.docker.com/reference/api/engine/version/v1.47/#tag/Container
 */

import * as PlatformError from "@effect/platform/Error";
import * as HttpBody from "@effect/platform/HttpBody";
import * as HttpClient from "@effect/platform/HttpClient";
import * as HttpClientError from "@effect/platform/HttpClientError";
import * as HttpClientRequest from "@effect/platform/HttpClientRequest";
import * as HttpClientResponse from "@effect/platform/HttpClientResponse";
import * as Socket from "@effect/platform/Socket";
import * as UrlParams from "@effect/platform/UrlParams";
import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as Layer from "effect/Layer";
import * as Option from "effect/Option";
import * as ParseResult from "effect/ParseResult";
import * as Predicate from "effect/Predicate";
import * as Schema from "effect/Schema";
import * as Scope from "effect/Scope";
import * as Stream from "effect/Stream";
import * as Tuple from "effect/Tuple";

import { responseToStreamingSocketOrFailUnsafe } from "../demux/Hijack.js";
import { MultiplexedStreamSocket } from "../demux/Multiplexed.js";
import { RawStreamSocket, makeRawStreamSocket } from "../demux/Raw.js";
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
import {
    HttpClientRequestExtension,
    HttpClientRequestHttpUrl,
    HttpClientRequestWebsocketUrl,
} from "../platforms/Agnostic.js";
import { maybeAddFilters, maybeAddQueryParameter } from "./Common.js";

/**
 * @since 1.0.0
 * @category Errors
 * @internal
 */
export const ContainersErrorTypeId: unique symbol = Symbol.for("@the-moby-effect/endpoints/ContainersError");

/**
 * @since 1.0.0
 * @category Errors
 * @internal
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
        | unknown;
}> {
    get message() {
        return `${this.method}`;
    }
}

/**
 * @since 1.0.0
 * @category Services
 * @see https://docs.docker.com/reference/api/engine/version/v1.47/#tag/Container
 */
export class Containers extends Effect.Service<Containers>()("@the-moby-effect/endpoints/Containers", {
    accessors: false,
    dependencies: [],

    effect: Effect.gen(function* () {
        const contextClient = yield* HttpClient.HttpClient;
        const client = contextClient.pipe(HttpClient.filterStatusOk);
        const maybeUpgradedClient = contextClient.pipe(
            HttpClient.filterStatus((status) => (status >= 200 && status < 300) || status === 101)
        );

        /** @see https://docs.docker.com/reference/api/engine/version/v1.47/#tag/Container/operation/ContainerList */
        const list_ = (
            options?:
                | {
                      readonly all?: boolean | undefined;
                      readonly limit?: number | undefined;
                      readonly size?: boolean | undefined;
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
                                status?:
                                    | "created"
                                    | "restarting"
                                    | "running"
                                    | "removing"
                                    | "paused"
                                    | "exited"
                                    | "dead"
                                    | undefined;
                                volume?: string | undefined;
                            }
                          | undefined;
                  }
                | undefined
        ): Effect.Effect<ReadonlyArray<ContainerListResponseItem>, ContainersError, never> =>
            Function.pipe(
                HttpClientRequest.get("/containers/json"),
                maybeAddQueryParameter("all", Option.fromNullable(options?.all)),
                maybeAddQueryParameter("limit", Option.fromNullable(options?.limit)),
                maybeAddQueryParameter("size", Option.fromNullable(options?.size)),
                maybeAddFilters(options?.filters),
                client.execute,
                Effect.flatMap(HttpClientResponse.schemaBodyJson(Schema.Array(ContainerListResponseItem))),
                Effect.mapError((cause) => new ContainersError({ method: "list", cause })),
                Effect.scoped
            );

        /** @see https://docs.docker.com/reference/api/engine/version/v1.47/#tag/Container/operation/ContainerCreate */
        const create_ = (options: {
            readonly name?: string | undefined;
            readonly platform?: string | undefined;
            readonly spec: typeof ContainerCreateRequest.Encoded;
        }): Effect.Effect<ContainerCreateResponse, ContainersError, never> =>
            Function.pipe(
                Schema.decode(ContainerCreateRequest)(options.spec),
                Effect.map((body) => Tuple.make(HttpClientRequest.post("/containers/create"), body)),
                Effect.map(Tuple.mapFirst(maybeAddQueryParameter("name", Option.fromNullable(options.name)))),
                Effect.map(Tuple.mapFirst(maybeAddQueryParameter("platform", Option.fromNullable(options.platform)))),
                Effect.flatMap(Function.tupled(HttpClientRequest.schemaBodyJson(ContainerCreateRequest))),
                Effect.flatMap(client.execute),
                Effect.flatMap(HttpClientResponse.schemaBodyJson(ContainerCreateResponse)),
                Effect.mapError((cause) => new ContainersError({ method: "create", cause })),
                Effect.scoped
            );

        /** @see https://docs.docker.com/reference/api/engine/version/v1.47/#tag/Container/operation/ContainerInspect */
        const inspect_ = (options: {
            readonly id: string;
            readonly size?: boolean | undefined;
        }): Effect.Effect<ContainerInspectResponse, ContainersError, never> =>
            Function.pipe(
                HttpClientRequest.get(`/containers/${encodeURIComponent(options.id)}/json`),
                maybeAddQueryParameter("size", Option.fromNullable(options.size)),
                client.execute,
                Effect.flatMap(HttpClientResponse.schemaBodyJson(ContainerInspectResponse)),
                Effect.mapError((cause) => new ContainersError({ method: "inspect", cause })),
                Effect.scoped
            );

        /** @see https://docs.docker.com/reference/api/engine/version/v1.47/#tag/Container/operation/ContainerTop */
        const top_ = (options: {
            readonly id: string;
            readonly ps_args?: string | undefined;
        }): Effect.Effect<ContainerTopResponse, ContainersError, never> =>
            Function.pipe(
                HttpClientRequest.get(`/containers/${encodeURIComponent(options.id)}/top`),
                maybeAddQueryParameter("ps_args", Option.fromNullable(options.ps_args)),
                client.execute,
                Effect.flatMap(HttpClientResponse.schemaBodyJson(ContainerTopResponse)),
                Effect.mapError((cause) => new ContainersError({ method: "top", cause })),
                Effect.scoped
            );

        /** @see https://docs.docker.com/reference/api/engine/version/v1.47/#tag/Container/operation/ContainerLogs */
        const logs_ = (options: {
            readonly id: string;
            readonly follow?: boolean | undefined;
            readonly stdout?: boolean | undefined;
            readonly stderr?: boolean | undefined;
            readonly since?: number | undefined;
            readonly until?: number | undefined;
            readonly timestamps?: boolean | undefined;
            readonly tail?: string | undefined;
        }): Stream.Stream<string, ContainersError, never> =>
            Function.pipe(
                HttpClientRequest.get(`/containers/${encodeURIComponent(options.id)}/logs`),
                maybeAddQueryParameter("follow", Option.fromNullable(options.follow)),
                maybeAddQueryParameter("stdout", Option.fromNullable(options.stdout)),
                maybeAddQueryParameter("stderr", Option.fromNullable(options.stderr)),
                maybeAddQueryParameter("since", Option.fromNullable(options.since)),
                maybeAddQueryParameter("until", Option.fromNullable(options.until)),
                maybeAddQueryParameter("timestamps", Option.fromNullable(options.timestamps)),
                maybeAddQueryParameter("tail", Option.fromNullable(options.tail)),
                client.execute,
                HttpClientResponse.stream,
                Stream.decodeText(),
                Stream.mapError((cause) => new ContainersError({ method: "logs", cause }))
            );

        /** @see https://docs.docker.com/reference/api/engine/version/v1.47/#tag/Container/operation/ContainerChanges */
        const changes_ = (options: {
            readonly id: string;
        }): Effect.Effect<ReadonlyArray<ContainerChange> | null, ContainersError> =>
            Function.pipe(
                HttpClientRequest.get(`/containers/${encodeURIComponent(options.id)}/changes`),
                client.execute,
                Effect.flatMap(HttpClientResponse.schemaBodyJson(Schema.NullOr(Schema.Array(ContainerChange)))),
                Effect.mapError((cause) => new ContainersError({ method: "changes", cause })),
                Effect.scoped
            );

        /** @see https://docs.docker.com/reference/api/engine/version/v1.47/#tag/Container/operation/ContainerExport */
        const export_ = (options: { readonly id: string }): Stream.Stream<Uint8Array, ContainersError, never> =>
            Function.pipe(
                HttpClientRequest.get(`/containers/${encodeURIComponent(options.id)}/export`),
                client.execute,
                HttpClientResponse.stream,
                Stream.mapError((cause) => new ContainersError({ method: "export", cause }))
            );

        /** @see https://docs.docker.com/reference/api/engine/version/v1.47/#tag/Container/operation/ContainerStats */
        const stats_ = (options: {
            readonly id: string;
            readonly stream?: boolean | undefined;
            readonly "one-shot"?: boolean | undefined;
        }): Stream.Stream<ContainerStatsResponse, ContainersError, never> =>
            Function.pipe(
                HttpClientRequest.get(`/containers/${encodeURIComponent(options.id)}/stats`),
                maybeAddQueryParameter("stream", Option.fromNullable(options.stream)),
                maybeAddQueryParameter("one-shot", Option.fromNullable(options["one-shot"])),
                client.execute,
                HttpClientResponse.stream,
                Stream.decodeText(),
                Stream.mapEffect(Schema.decode(Schema.parseJson(ContainerStatsResponse))),
                Stream.mapError((cause) => new ContainersError({ method: "stats", cause }))
            );

        /** @see https://docs.docker.com/reference/api/engine/version/v1.47/#tag/Container/operation/ContainerResize */
        const resize_ = (options: {
            readonly id: string;
            readonly h?: number | undefined;
            readonly w?: number | undefined;
        }): Effect.Effect<void, ContainersError, never> =>
            Function.pipe(
                HttpClientRequest.post(`/containers/${encodeURIComponent(options.id)}/resize`),
                maybeAddQueryParameter("h", Option.fromNullable(options.h)),
                maybeAddQueryParameter("w", Option.fromNullable(options.w)),
                client.execute,
                Effect.asVoid,
                Effect.mapError((cause) => new ContainersError({ method: "resize", cause })),
                Effect.scoped
            );

        /** @see https://docs.docker.com/reference/api/engine/version/v1.47/#tag/Container/operation/ContainerStart */
        const start_ = (options: {
            readonly id: string;
            readonly detachKeys?: string | undefined;
        }): Effect.Effect<void, ContainersError, never> =>
            Function.pipe(
                HttpClientRequest.post(`/containers/${encodeURIComponent(options.id)}/start`),
                maybeAddQueryParameter("detachKeys", Option.fromNullable(options.detachKeys)),
                client.execute,
                Effect.asVoid,
                Effect.mapError((cause) => new ContainersError({ method: "start", cause })),
                Effect.scoped
            );

        /** @see https://docs.docker.com/reference/api/engine/version/v1.47/#tag/Container/operation/ContainerStop */
        const stop_ = (options: {
            readonly id: string;
            readonly signal?: string | undefined;
            readonly t?: number | undefined;
        }): Effect.Effect<void, ContainersError, never> =>
            Function.pipe(
                HttpClientRequest.post(`/containers/${encodeURIComponent(options.id)}/stop`),
                maybeAddQueryParameter("signal", Option.fromNullable(options.signal)),
                maybeAddQueryParameter("t", Option.fromNullable(options.t)),
                client.execute,
                Effect.asVoid,
                Effect.mapError((cause) => new ContainersError({ method: "stop", cause })),
                Effect.scoped
            );

        /** @see https://docs.docker.com/reference/api/engine/version/v1.47/#tag/Container/operation/ContainerRestart */
        const restart_ = (options: {
            readonly id: string;
            readonly signal?: string | undefined;
            readonly t?: number | undefined;
        }): Effect.Effect<void, ContainersError, never> =>
            Function.pipe(
                HttpClientRequest.post(`/containers/${encodeURIComponent(options.id)}/restart`),
                maybeAddQueryParameter("signal", Option.fromNullable(options.signal)),
                maybeAddQueryParameter("t", Option.fromNullable(options.t)),
                client.execute,
                Effect.asVoid,
                Effect.mapError((cause) => new ContainersError({ method: "restart", cause })),
                Effect.scoped
            );

        /** @see https://docs.docker.com/reference/api/engine/version/v1.47/#tag/Container/operation/ContainerKill */
        const kill_ = (options: {
            readonly id: string;
            readonly signal?: string | undefined;
        }): Effect.Effect<void, ContainersError, never> =>
            Function.pipe(
                HttpClientRequest.post(`/containers/${encodeURIComponent(options.id)}/kill`),
                maybeAddQueryParameter("signal", Option.fromNullable(options.signal)),
                client.execute,
                Effect.asVoid,
                Effect.mapError((cause) => new ContainersError({ method: "kill", cause })),
                Effect.scoped
            );

        /** @see https://docs.docker.com/reference/api/engine/version/v1.47/#tag/Container/operation/ContainerUpdate */
        const update_ = (options: {
            readonly id: string;
            readonly spec: ContainerConfig;
        }): Effect.Effect<ContainerUpdateResponse, ContainersError, never> =>
            Function.pipe(
                HttpClientRequest.post(`/containers/${encodeURIComponent(options.id)}/update`),
                HttpClientRequest.schemaBodyJson(ContainerConfig)(options.spec),
                Effect.flatMap(client.execute),
                Effect.flatMap(HttpClientResponse.schemaBodyJson(ContainerUpdateResponse)),
                Effect.mapError((cause) => new ContainersError({ method: "update", cause })),
                Effect.scoped
            );

        /** @see https://docs.docker.com/reference/api/engine/version/v1.47/#tag/Container/operation/ContainerRename */
        const rename_ = (options: {
            readonly id: string;
            readonly name: string;
        }): Effect.Effect<void, ContainersError, never> =>
            Function.pipe(
                HttpClientRequest.post(`/containers/${encodeURIComponent(options.id)}/rename`),
                maybeAddQueryParameter("name", Option.fromNullable(options.name)),
                client.execute,
                Effect.asVoid,
                Effect.mapError((cause) => new ContainersError({ method: "rename", cause })),
                Effect.scoped
            );

        /** @see https://docs.docker.com/reference/api/engine/version/v1.47/#tag/Container/operation/ContainerPause */
        const pause_ = (options: { readonly id: string }): Effect.Effect<void, ContainersError, never> =>
            Function.pipe(
                HttpClientRequest.post(`/containers/${encodeURIComponent(options.id)}/pause`),
                client.execute,
                Effect.asVoid,
                Effect.mapError((cause) => new ContainersError({ method: "pause", cause })),
                Effect.scoped
            );

        /** @see https://docs.docker.com/reference/api/engine/version/v1.47/#tag/Container/operation/ContainerUnpause */
        const unpause_ = (options: { readonly id: string }): Effect.Effect<void, ContainersError, never> =>
            Function.pipe(
                HttpClientRequest.post(`/containers/${encodeURIComponent(options.id)}/unpause`),
                client.execute,
                Effect.asVoid,
                Effect.mapError((cause) => new ContainersError({ method: "unpause", cause })),
                Effect.scoped
            );

        /**
         * Attach to a container
         *
         * @param options.id - ID or name of the container
         * @param detachKeys - Override the key sequence for detaching a
         *   container.Format is a single character `[a-Z]` or `ctrl-<value>`
         *   where `<value>` is one of: `a-z`, `@`, `^`, `[`, `,` or `_`.
         * @param logs - Replay previous logs from the container.
         *
         *   This is useful for attaching to a container that has started and you
         *   want to output everything since the container started.
         *
         *   If `stream` is also enabled, once all the previous output has been
         *   returned, it will seamlessly transition into streaming current
         *   output.
         * @param stream - Stream attached streams from the time the request was
         *   made onwards.
         * @param stdin - Attach to `stdin`
         * @param stdout - Attach to `stdout`
         * @param stderr - Attach to `stderr`
         * @see https://docs.docker.com/reference/api/engine/version/v1.47/#tag/Container/operation/ContainerAttach
         */
        const attach_ = (options: {
            readonly id: string;
            readonly detachKeys?: string | undefined;
            readonly logs?: boolean | undefined;
            readonly stream?: boolean | undefined;
            readonly stdin?: boolean | undefined;
            readonly stdout?: boolean | undefined;
            readonly stderr?: boolean | undefined;
        }): Effect.Effect<RawStreamSocket | MultiplexedStreamSocket, ContainersError, Scope.Scope> =>
            Function.pipe(
                HttpClientRequest.post(`/containers/${encodeURIComponent(options.id)}/attach`),
                HttpClientRequest.setHeader("Upgrade", "tcp"),
                HttpClientRequest.setHeader("Connection", "Upgrade"),
                maybeAddQueryParameter("detachKeys", Option.fromNullable(options.detachKeys)),
                maybeAddQueryParameter("logs", Option.fromNullable(options.logs)),
                maybeAddQueryParameter("stream", Option.fromNullable(options.stream)),
                maybeAddQueryParameter("stdin", Option.fromNullable(options.stdin)),
                maybeAddQueryParameter("stdout", Option.fromNullable(options.stdout)),
                maybeAddQueryParameter("stderr", Option.fromNullable(options.stderr)),
                maybeUpgradedClient.execute,
                Effect.flatMap(responseToStreamingSocketOrFailUnsafe),
                Effect.mapError((cause) => new ContainersError({ method: "attach", cause }))
            );

        /** @see https://docs.docker.com/reference/api/engine/version/v1.47/#tag/Container/operation/ContainerAttachWebsocket */
        const attachWebsocket_ = (options: {
            readonly id: string;
            readonly detachKeys?: string | undefined;
            readonly logs?: boolean | undefined;
            readonly stream?: boolean | undefined;
            readonly stdin?: boolean | undefined;
            readonly stdout?: boolean | undefined;
            readonly stderr?: boolean | undefined;
        }): Effect.Effect<RawStreamSocket, ContainersError, Socket.WebSocketConstructor> =>
            Function.pipe(
                HttpClientRequest.get(`/containers/${encodeURIComponent(options.id)}/attach/ws`),
                maybeAddQueryParameter("detachKeys", Option.fromNullable(options.detachKeys)),
                maybeAddQueryParameter("logs", Option.fromNullable(options.logs)),
                maybeAddQueryParameter("stream", Option.fromNullable(options.stream)),
                maybeAddQueryParameter("stdin", Option.fromNullable(options.stdin)),
                maybeAddQueryParameter("stdout", Option.fromNullable(options.stdout)),
                maybeAddQueryParameter("stderr", Option.fromNullable(options.stderr)),
                (
                    client as HttpClient.HttpClient<HttpClientError.HttpClientError, Scope.Scope> & {
                        preprocess: (
                            request: HttpClientRequest.HttpClientRequest
                        ) => Effect.Effect<HttpClientRequestExtension>;
                    }
                ).preprocess as (
                    request: HttpClientRequest.HttpClientRequest
                ) => Effect.Effect<HttpClientRequestExtension>,
                Effect.flatMap(
                    ({
                        hash,
                        url,
                        urlParams,
                        [HttpClientRequestHttpUrl]: httpUrl,
                        [HttpClientRequestWebsocketUrl]: websocketUrl,
                    }) => UrlParams.makeUrl(`${url.replace(httpUrl, websocketUrl)}`, urlParams, hash)
                ),
                Effect.map((url) => url.toString()),
                Effect.flatMap(Socket.makeWebSocket),
                Effect.map(makeRawStreamSocket),
                Effect.mapError((cause) => new ContainersError({ method: "attachWebsocket", cause }))
            );

        /** @see https://docs.docker.com/reference/api/engine/version/v1.47/#tag/Container/operation/ContainerWait */
        const wait_ = (options: {
            readonly id: string;
            readonly condition?: string | undefined;
        }): Effect.Effect<ContainerWaitResponse, ContainersError, never> =>
            Function.pipe(
                HttpClientRequest.post(`/containers/${encodeURIComponent(options.id)}/wait`),
                maybeAddQueryParameter("condition", Option.fromNullable(options.condition)),
                client.execute,
                Effect.flatMap(HttpClientResponse.schemaBodyJson(ContainerWaitResponse)),
                Effect.mapError((cause) => new ContainersError({ method: "wait", cause })),
                Effect.scoped
            );

        /** @see https://docs.docker.com/reference/api/engine/version/v1.47/#tag/Container/operation/ContainerDelete */
        const delete_ = (options: {
            readonly id: string;
            readonly v?: boolean | undefined;
            readonly force?: boolean | undefined;
            readonly link?: boolean | undefined;
        }): Effect.Effect<void, ContainersError, never> =>
            Function.pipe(
                HttpClientRequest.del(`/containers/${encodeURIComponent(options.id)}`),
                maybeAddQueryParameter("v", Option.fromNullable(options.v)),
                maybeAddQueryParameter("force", Option.fromNullable(options.force)),
                maybeAddQueryParameter("link", Option.fromNullable(options.link)),
                client.execute,
                Effect.asVoid,
                Effect.mapError((cause) => new ContainersError({ method: "delete", cause })),
                Effect.scoped
            );

        /** @see https://docs.docker.com/reference/api/engine/version/v1.47/#tag/Container/operation/ContainerArchive */
        const archive_ = (options: {
            readonly id: string;
            readonly path: string;
        }): Stream.Stream<Uint8Array, ContainersError, never> =>
            Function.pipe(
                HttpClientRequest.get(`/containers/${encodeURIComponent(options.id)}/archive`),
                maybeAddQueryParameter("path", Option.some(options.path)),
                client.execute,
                HttpClientResponse.stream,
                Stream.mapError((cause) => new ContainersError({ method: "archive", cause }))
            );

        /** @see https://docs.docker.com/reference/api/engine/version/v1.47/#tag/Container/operation/ContainerArchiveInfo */
        const archiveInfo_ = (options: {
            readonly id: string;
            readonly path: string;
        }): Effect.Effect<void, ContainersError, never> =>
            Function.pipe(
                HttpClientRequest.head(`/containers/${encodeURIComponent(options.id)}/archive`),
                maybeAddQueryParameter("path", Option.some(options.path)),
                client.execute,
                Effect.asVoid,
                Effect.mapError((cause) => new ContainersError({ method: "archiveInfo", cause })),
                Effect.scoped
            );

        /** @see https://docs.docker.com/reference/api/engine/version/v1.47/#tag/Container/operation/PutContainerArchive */
        const putArchive_ = <E1>(options: {
            readonly id: string;
            readonly path: string;
            readonly noOverwriteDirNonDir?: string | undefined;
            readonly copyUIDGID?: string | undefined;
            readonly stream: Stream.Stream<Uint8Array, E1, never>;
        }): Effect.Effect<void, ContainersError, never> =>
            Function.pipe(
                HttpClientRequest.put(`/containers/${encodeURIComponent(options.id)}/archive`),
                maybeAddQueryParameter("path", Option.some(options.path)),
                maybeAddQueryParameter("noOverwriteDirNonDir", Option.fromNullable(options.noOverwriteDirNonDir)),
                maybeAddQueryParameter("copyUIDGID", Option.fromNullable(options.copyUIDGID)),
                HttpClientRequest.bodyStream(options.stream),
                client.execute,
                Effect.asVoid,
                Effect.mapError((cause) => new ContainersError({ method: "putArchive", cause })),
                Effect.scoped
            );

        /** @see https://docs.docker.com/reference/api/engine/version/v1.47/#tag/Container/operation/ContainerPrune */
        const prune_ = (
            options?:
                | {
                      readonly filters?:
                          | {
                                until?: string;
                                label?: Record<string, string> | undefined;
                            }
                          | undefined;
                  }
                | undefined
        ): Effect.Effect<ContainerPruneResponse, ContainersError, never> =>
            Function.pipe(
                HttpClientRequest.post("/containers/prune"),
                maybeAddFilters(options?.filters),
                client.execute,
                Effect.flatMap(HttpClientResponse.schemaBodyJson(ContainerPruneResponse)),
                Effect.mapError((cause) => new ContainersError({ method: "prune", cause })),
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
    }),
}) {}

/**
 * @since 1.0.0
 * @category Layers
 * @see https://docs.docker.com/reference/api/engine/version/v1.47/#tag/Container
 */
export const ContainersLayer: Layer.Layer<Containers, never, HttpClient.HttpClient> = Containers.Default;
