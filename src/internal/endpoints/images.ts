import {
    HttpApi,
    HttpApiClient,
    HttpApiEndpoint,
    HttpApiError,
    HttpApiGroup,
    HttpApiSchema,
    HttpClient,
    Error as PlatformError,
    type HttpClientError,
} from "@effect/platform";
import { Effect, Predicate, Schema, Stream, type Layer, type ParseResult } from "effect";

import { MobyConnectionOptions } from "../../MobyConnection.js";
import { makeAgnosticHttpClientLayer } from "../../MobyPlatforms.js";
import {
    ContainerCreateRequest,
    ImageDeleteResponse,
    ImageHistoryResponseItem,
    ImageInspectResponse,
    ImageSummary,
    JsonmessageJSONMessage as JSONMessage,
    RegistrySearchResult,
} from "../generated/index.js";
import { HttpApiStreamingBoth, HttpApiStreamingResponse } from "./httpApiHacks.js";

/**
 * @since 1.0.0
 * @category Errors
 */
export const ImagesErrorTypeId: unique symbol = Symbol.for(
    "@the-moby-effect/endpoints/ImagesError"
) as ImagesErrorTypeId;

/**
 * @since 1.0.0
 * @category Errors
 */
export type ImagesErrorTypeId = typeof ImagesErrorTypeId;

/**
 * @since 1.0.0
 * @category Errors
 */
export const isImagesError = (u: unknown): u is ImagesError => Predicate.hasProperty(u, ImagesErrorTypeId);

/**
 * @since 1.0.0
 * @category Errors
 */
export class ImagesError extends PlatformError.TypeIdError(ImagesErrorTypeId, "ImagesError")<{
    method: string;
    cause:
        | HttpApiError.InternalServerError
        | HttpApiError.Conflict
        | HttpApiError.BadRequest
        | HttpApiError.NotFound
        | ParseResult.ParseError
        | HttpClientError.HttpClientError
        | HttpApiError.HttpApiDecodeError;
}> {
    get message() {
        return `${this.method}`;
    }

    static WrapForMethod(method: string) {
        return (cause: ImagesError["cause"]) => new this({ method, cause });
    }
}

/** @since 1.0.0 */
export class ListFilters extends Schema.parseJson(
    Schema.Struct({
        before: Schema.optional(Schema.Array(Schema.String)),
        dangling: Schema.optional(Schema.BooleanFromString),
        label: Schema.optional(Schema.Array(Schema.String)),
        reference: Schema.optional(Schema.Array(Schema.String)),
        since: Schema.optional(Schema.Array(Schema.String)),
        until: Schema.optional(Schema.String),
    })
) {}

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Image/operation/ImageList */
const listImagesEndpoint = HttpApiEndpoint.get("list", "/json")
    .setUrlParams(
        Schema.Struct({
            filters: Schema.optional(ListFilters),
            all: Schema.optional(Schema.BooleanFromString),
            digests: Schema.optional(Schema.BooleanFromString),
            "shared-size": Schema.optional(Schema.BooleanFromString),
        })
    )
    .addSuccess(Schema.Array(ImageSummary), { status: 200 });

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Image/operation/ImageBuild */
const buildImageEndpoint = HttpApiEndpoint.post("build", "/build")
    .setUrlParams(
        Schema.Struct({
            dockerfile: Schema.optional(Schema.String),
            t: Schema.optional(Schema.String),
            extrahosts: Schema.optional(Schema.String),
            remote: Schema.optional(Schema.String),
            q: Schema.optional(Schema.BooleanFromString),
            nocache: Schema.optional(Schema.BooleanFromString),
            cachefrom: Schema.optional(Schema.String),
            pull: Schema.optional(Schema.String),
            rm: Schema.optional(Schema.BooleanFromString),
            forcerm: Schema.optional(Schema.BooleanFromString),
            memory: Schema.optional(Schema.NumberFromString),
            memswap: Schema.optional(Schema.NumberFromString),
            cpushares: Schema.optional(Schema.NumberFromString),
            cpusetcpus: Schema.optional(Schema.String),
            cpuperiod: Schema.optional(Schema.NumberFromString),
            cpuquota: Schema.optional(Schema.NumberFromString),
            buildargs: Schema.optional(
                Schema.parseJson(
                    Schema.Record({
                        key: Schema.String,
                        value: Schema.NullishOr(Schema.String),
                    })
                )
            ),
            shmsize: Schema.optional(Schema.NumberFromString),
            squash: Schema.optional(Schema.BooleanFromString),
            labels: Schema.optional(Schema.String),
            networkmode: Schema.optional(Schema.String),
            platform: Schema.optional(Schema.String),
            target: Schema.optional(Schema.String),
            outputs: Schema.optional(Schema.String),
            version: Schema.optional(Schema.Literal("1")),
        })
    )
    .setHeaders(
        Schema.Struct({
            "Content-type": Schema.optional(Schema.String),
            "X-Registry-Config": Schema.optional(Schema.String),
        })
    )
    .addSuccess(HttpApiSchema.Empty(200))
    .addError(HttpApiError.BadRequest); // 400 Bad parameter

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Image/operation/BuildPrune */
const buildPruneEndpoint = HttpApiEndpoint.post("buildPrune", "/build/prune")
    .setUrlParams(
        Schema.Struct({
            "keep-storage": Schema.optional(Schema.NumberFromString),
            all: Schema.optional(Schema.BooleanFromString),
            filters: Schema.optional(Schema.String),
        })
    )
    .addSuccess(
        Schema.Struct({
            SpaceReclaimed: Schema.Number,
            CachesDeleted: Schema.Array(Schema.String),
        }),
        { status: 200 }
    );

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Image/operation/ImageCreate */
const createImageEndpoint = HttpApiEndpoint.post("create", "/images/create")
    .setUrlParams(
        Schema.Struct({
            fromImage: Schema.optional(Schema.String),
            fromSrc: Schema.optional(Schema.String),
            repo: Schema.optional(Schema.String),
            tag: Schema.optional(Schema.String),
            message: Schema.optional(Schema.String),
            changes: Schema.optional(Schema.String),
            platform: Schema.optional(Schema.String),
        })
    )
    .setHeaders(Schema.Struct({ "X-Registry-Auth": Schema.optional(Schema.String) }))
    .addSuccess(HttpApiSchema.Empty(200))
    .addError(HttpApiError.NotFound); // 404 Repository not found or no read access

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Image/operation/ImageInspect */
const inspectImageEndpoint = HttpApiEndpoint.get("inspect", "/:name/json")
    .setPath(Schema.Struct({ name: Schema.String }))
    .setUrlParams(Schema.Struct({ manifests: Schema.optional(Schema.BooleanFromString) }))
    .addSuccess(ImageInspectResponse, { status: 200 })
    .addError(HttpApiError.NotFound); // 404 No such image

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Image/operation/ImageHistory */
const historyImageEndpoint = HttpApiEndpoint.get("history", "/:name/history")
    .setPath(Schema.Struct({ name: Schema.String }))
    .setUrlParams(Schema.Struct({ platform: Schema.optional(Schema.String) }))
    .addSuccess(Schema.Array(ImageHistoryResponseItem), { status: 200 })
    .addError(HttpApiError.NotFound); // 404 No such image

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Image/operation/ImagePush */
const pushImageEndpoint = HttpApiEndpoint.post("push", "/:name/push")
    .setPath(Schema.Struct({ name: Schema.String }))
    .setUrlParams(Schema.Struct({ tag: Schema.optional(Schema.String), platform: Schema.optional(Schema.String) }))
    .setHeaders(Schema.Struct({ "X-Registry-Auth": Schema.String }))
    .addSuccess(HttpApiSchema.Empty(200))
    .addError(HttpApiError.NotFound); // 404 No such image

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Image/operation/ImageTag */
const tagImageEndpoint = HttpApiEndpoint.post("tag", "/:name/tag")
    .setPath(Schema.Struct({ name: Schema.String }))
    .setUrlParams(Schema.Struct({ repo: Schema.optional(Schema.String), tag: Schema.optional(Schema.String) }))
    .addSuccess(HttpApiSchema.Empty(201))
    .addError(HttpApiError.BadRequest) // 400 Bad parameter
    .addError(HttpApiError.NotFound) // 404 No such image
    .addError(HttpApiError.Conflict); // 409 Conflict

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Image/operation/ImageDelete */
const deleteImageEndpoint = HttpApiEndpoint.del("delete", "/:name")
    .setPath(Schema.Struct({ name: Schema.String }))
    .setUrlParams(
        Schema.Struct({
            force: Schema.optional(Schema.BooleanFromString),
            noprune: Schema.optional(Schema.BooleanFromString),
            platforms: Schema.optional(Schema.Array(Schema.String)),
        })
    )
    .addSuccess(Schema.Array(ImageDeleteResponse), { status: 200 })
    .addError(HttpApiError.NotFound) // 404 No such image
    .addError(HttpApiError.Conflict); // 409 Conflict

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Image/operation/ImageSearch */
const searchImagesEndpoint = HttpApiEndpoint.get("search", "/search")
    .setUrlParams(
        Schema.Struct({
            term: Schema.String,
            limit: Schema.optional(Schema.NumberFromString),
            filters: Schema.optional(Schema.String),
        })
    )
    .addSuccess(Schema.Array(RegistrySearchResult), { status: 200 });

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Image/operation/ImagePrune */
const pruneImagesEndpoint = HttpApiEndpoint.post("prune", "/prune")
    .setUrlParams(
        Schema.Struct({
            filters: Schema.optional(Schema.String),
        })
    )
    .addSuccess(
        Schema.Struct({
            SpaceReclaimed: Schema.Number,
            ImagesDeleted: Schema.optional(Schema.Array(ImageDeleteResponse)),
        }),
        { status: 200 }
    );

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Image/operation/ImageCommit */
const commitImageEndpoint = HttpApiEndpoint.post("commit", "/commit")
    .setUrlParams(
        Schema.Struct({
            container: Schema.String,
            repo: Schema.optional(Schema.String),
            tag: Schema.optional(Schema.String),
            comment: Schema.optional(Schema.String),
            author: Schema.optional(Schema.String),
            pause: Schema.optional(Schema.BooleanFromString),
            changes: Schema.optional(Schema.String),
        })
    )
    .setPayload(ContainerCreateRequest)
    .addSuccess(ImageInspectResponse, { status: 201 })
    .addError(HttpApiError.NotFound); // 404 No such container

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Image/operation/ImageGet */
const exportImageEndpoint = HttpApiEndpoint.get("export", "/:name/get")
    .setPath(Schema.Struct({ name: Schema.String }))
    .setUrlParams(Schema.Struct({ platform: Schema.optional(Schema.String) }))
    .addSuccess(HttpApiSchema.Empty(200))
    .addError(HttpApiError.NotFound); // 404 No such image

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Image/operation/ImageGetAll */
const exportManyImagesEndpoint = HttpApiEndpoint.get("exportMany", "/get")
    .setUrlParams(Schema.Struct({ names: Schema.optional(Schema.String) }))
    .setUrlParams(Schema.Struct({ platform: Schema.optional(Schema.String) }))
    .addSuccess(HttpApiSchema.Empty(200))
    .addError(HttpApiError.NotFound); // 404 No such image

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Image/operation/ImageLoad */
const importImageEndpoint = HttpApiEndpoint.post("import", "/import")
    .setUrlParams(
        Schema.Struct({
            platform: Schema.optional(Schema.String),
            quiet: Schema.optional(Schema.BooleanFromString),
        })
    )
    .addSuccess(HttpApiSchema.Empty(200))
    .addError(HttpApiError.BadRequest); // 400 Bad parameter

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Image */
const ImagesGroup = HttpApiGroup.make("images")
    .add(listImagesEndpoint)
    .add(buildImageEndpoint)
    .add(buildPruneEndpoint)
    .add(createImageEndpoint)
    .add(inspectImageEndpoint)
    .add(historyImageEndpoint)
    .add(pushImageEndpoint)
    .add(tagImageEndpoint)
    .add(deleteImageEndpoint)
    .add(searchImagesEndpoint)
    .add(pruneImagesEndpoint)
    .add(commitImageEndpoint)
    .add(exportImageEndpoint)
    .add(exportManyImagesEndpoint)
    .add(importImageEndpoint)
    .addError(HttpApiError.InternalServerError)
    .prefix("/images");

/**
 * @since 1.0.0
 * @category HttpApi
 * @see https://docs.docker.com/reference/api/engine/latest/#tag/Image
 */
export const ImagesApi = HttpApi.make("ImagesApi").add(ImagesGroup);

/**
 * @since 1.0.0
 * @category Services
 * @see https://docs.docker.com/reference/api/engine/latest/#tag/Image
 */
export class Images extends Effect.Service<Images>()("@the-moby-effect/endpoints/Images", {
    accessors: false,
    dependencies: [
        makeAgnosticHttpClientLayer(
            MobyConnectionOptions.socket({
                socketPath: "/var/run/docker.sock",
            })
        ),
    ],

    effect: Effect.gen(function* () {
        type Options<Name extends (typeof ImagesGroup.endpoints)[number]["name"]> =
            HttpApiEndpoint.HttpApiEndpoint.UrlParams<
                HttpApiEndpoint.HttpApiEndpoint.WithName<(typeof ImagesGroup.endpoints)[number], Name>
            >;

        const httpClient = yield* HttpClient.HttpClient;
        const client = yield* HttpApiClient.group(ImagesApi, { group: "images", httpClient });

        const list_ = (options?: Options<"list">) =>
            Effect.mapError(client.list({ urlParams: { ...options } }), ImagesError.WrapForMethod("list"));
        const build_ = <E1>(context: Stream.Stream<Uint8Array, E1, never>, options?: Options<"build">) =>
            HttpApiStreamingBoth(
                ImagesApi,
                "images",
                "build",
                httpClient,
                context
            )({
                urlParams: { ...options },
                headers: { "Content-type": "application/tar" },
            })
                .pipe(Stream.decodeText())
                .pipe(Stream.splitLines)
                .pipe(Stream.mapEffect(Schema.decode(Schema.parseJson(JSONMessage))))
                .pipe(Stream.mapError(ImagesError.WrapForMethod("build")));
        const buildPrune_ = (options?: Options<"buildPrune">) =>
            Effect.mapError(client.buildPrune({ urlParams: { ...options } }), ImagesError.WrapForMethod("buildPrune"));
        const create_ = (options?: Options<"create">) =>
            HttpApiStreamingResponse(
                ImagesApi,
                "images",
                "create",
                httpClient
            )({
                urlParams: { ...options },
                headers: { "X-Registry-Auth": "" },
            })
                .pipe(Stream.decodeText())
                .pipe(Stream.splitLines)
                .pipe(Stream.mapEffect(Schema.decode(Schema.parseJson(JSONMessage))))
                .pipe(Stream.mapError(ImagesError.WrapForMethod("create")));
        const inspect_ = (name: string, options?: Options<"inspect">) =>
            Effect.mapError(
                client.inspect({ path: { name }, urlParams: { ...options } }),
                ImagesError.WrapForMethod("inspect")
            );
        const history_ = (name: string, options?: Options<"history">) =>
            Effect.mapError(
                client.history({ path: { name }, urlParams: { ...options } }),
                ImagesError.WrapForMethod("history")
            );
        const push_ = (name: string, options?: Options<"push">) =>
            HttpApiStreamingResponse(
                ImagesApi,
                "images",
                "push",
                httpClient
            )({
                path: { name },
                urlParams: { ...options },
                headers: { "X-Registry-Auth": "" },
            })
                .pipe(Stream.decodeText())
                .pipe(Stream.splitLines)
                .pipe(Stream.mapEffect(Schema.decode(Schema.parseJson(JSONMessage))))
                .pipe(Stream.mapError(ImagesError.WrapForMethod("push")));
        const tag_ = (name: string, options?: Options<"tag">) =>
            Effect.mapError(
                client.tag({ path: { name }, urlParams: { ...options } }),
                ImagesError.WrapForMethod("tag")
            );
        const delete_ = (name: string, options?: Options<"delete">) =>
            Effect.mapError(
                client.delete({ path: { name }, urlParams: { ...options } }),
                ImagesError.WrapForMethod("delete")
            );
        const search_ = (options: Options<"search">) =>
            Effect.mapError(client.search({ urlParams: { ...options } }), ImagesError.WrapForMethod("search"));
        const prune_ = (options?: Options<"prune">) =>
            Effect.mapError(client.prune({ urlParams: { ...options } }), ImagesError.WrapForMethod("prune"));
        const commit_ = (payload: ContainerCreateRequest, options: Options<"commit">) =>
            Effect.mapError(client.commit({ urlParams: { ...options }, payload }), ImagesError.WrapForMethod("commit"));
        const export_ = (name: string, options?: Options<"export">) =>
            Stream.mapError(
                HttpApiStreamingResponse(
                    ImagesApi,
                    "images",
                    "export",
                    httpClient
                )({ path: { name }, urlParams: { ...options } }),
                ImagesError.WrapForMethod("export")
            );
        const exportMany_ = (options?: Options<"exportMany">) =>
            Stream.mapError(
                HttpApiStreamingResponse(ImagesApi, "images", "exportMany", httpClient)({ urlParams: { ...options } }),
                ImagesError.WrapForMethod("exportMany")
            );
        const import_ = <E>(context: Stream.Stream<Uint8Array, E, never>, options?: Options<"import">) =>
            Stream.mapError(
                HttpApiStreamingBoth(ImagesApi, "images", "import", httpClient, context)({ urlParams: { ...options } }),
                ImagesError.WrapForMethod("import")
            );

        return {
            list: list_,
            build: build_,
            buildPrune: buildPrune_,
            create: create_,
            inspect: inspect_,
            history: history_,
            push: push_,
            tag: tag_,
            delete: delete_,
            search: search_,
            prune: prune_,
            commit: commit_,
            export: export_,
            exportMany: exportMany_,
            import: import_,
        };
    }),
}) {}

/**
 * @since 1.0.0
 * @category Services
 * @see https://docs.docker.com/reference/api/engine/latest/#tag/Image
 */
export const ImagesLayerLocalSocket: Layer.Layer<Images, never, HttpClient.HttpClient> = Images.Default;

/**
 * @since 1.0.0
 * @category Services
 * @see https://docs.docker.com/reference/api/engine/latest/#tag/Image
 */
export const ImagesLayer: Layer.Layer<Images, never, HttpClient.HttpClient> = Images.DefaultWithoutDependencies;
