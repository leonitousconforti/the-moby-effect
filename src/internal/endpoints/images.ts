import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as Option from "effect/Option";
import * as Schema from "effect/Schema";
import * as SchemaGetter from "effect/SchemaGetter";
import * as SchemaIssue from "effect/SchemaIssue";
import * as Stream from "effect/Stream";
import * as HttpClient from "effect/unstable/http/HttpClient";
import * as HttpApi from "effect/unstable/httpapi/HttpApi";
import * as HttpApiClient from "effect/unstable/httpapi/HttpApiClient";
import * as HttpApiEndpoint from "effect/unstable/httpapi/HttpApiEndpoint";
import * as HttpApiGroup from "effect/unstable/httpapi/HttpApiGroup";
import * as HttpApiSchema from "effect/unstable/httpapi/HttpApiSchema";

import { MobyConnectionOptions } from "../../MobyConnection.ts";
import { makeAgnosticHttpClientLayer } from "../../MobyPlatforms.ts";
import {
    ContainerCreateRequest,
    ImageDeleteResponse,
    ImageHistoryResponseItem,
    ImageInspectResponse,
    ImageSummary,
    JSONMessage,
    RegistrySearchResult,
} from "../generated/index.ts";
import { WithRegistryAuthHeader } from "./auth.ts";
import { DockerError } from "./circular.ts";
import { BadRequest, Conflict, InternalServerError, NotFound } from "./errors.ts";

/** @since 1.0.0 */
export const ListFilters = Schema.Struct({
    before: Schema.optional(Schema.Array(Schema.String)),
    dangling: Schema.optional(Schema.Literals(["true", "false"]).transform([true, false])),
    label: Schema.optional(Schema.Array(Schema.String)),
    reference: Schema.optional(Schema.Array(Schema.String)),
    since: Schema.optional(Schema.Array(Schema.String)),
    until: Schema.optional(Schema.String),
});

/** @internal */
const BooleanFromStringTuple = (filterName: string) =>
    Schema.Tuple([Schema.String]).pipe(
        Schema.decodeTo(Schema.Boolean, {
            decode: SchemaGetter.transformOrFail((fromA: readonly [string]) =>
                Effect.fail(
                    new SchemaIssue.InvalidValue(Option.some(fromA), {
                        message: `Decoding '${filterName}' filter is not supported`,
                    })
                )
            ),
            encode: SchemaGetter.transform((bool: boolean) => [bool ? "true" : "false"] as const),
        })
    );

/** @since 1.0.0 */
export const SearchFilters = Schema.Struct({
    "is-official": BooleanFromStringTuple("is-official").pipe(Schema.optional),
    "is-automated": BooleanFromStringTuple("is-automated").pipe(Schema.optional),
    stars: Schema.optional(Schema.NumberFromString),
});

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Image/operation/ImageList */
const listImagesEndpoint = HttpApiEndpoint.get("list", "/images/json", {
    query: {
        filters: Schema.optional(ListFilters),
        all: Schema.optional(Schema.Boolean),
        digests: Schema.optional(Schema.Boolean),
        "shared-size": Schema.optional(Schema.Boolean),
    },
    success: Schema.Array(ImageSummary), // 200 OK
    error: [InternalServerError],
});

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Image/operation/ImageBuild */
const buildImageEndpoint = HttpApiEndpoint.post("build", "/build", {
    query: {
        dockerfile: Schema.optional(Schema.String),
        t: Schema.optional(Schema.String),
        extrahosts: Schema.optional(Schema.String),
        remote: Schema.optional(Schema.String),
        q: Schema.optional(Schema.Boolean),
        nocache: Schema.optional(Schema.Boolean),
        cachefrom: Schema.optional(Schema.String),
        pull: Schema.optional(Schema.String),
        rm: Schema.optional(Schema.Boolean),
        forcerm: Schema.optional(Schema.Boolean),
        memory: Schema.optional(Schema.Number),
        memswap: Schema.optional(Schema.Number),
        cpushares: Schema.optional(Schema.Number),
        cpusetcpus: Schema.optional(Schema.String),
        cpuperiod: Schema.optional(Schema.Number),
        cpuquota: Schema.optional(Schema.Number),
        buildargs: Schema.optional(Schema.Record(Schema.String, Schema.NullishOr(Schema.String))),
        shmsize: Schema.optional(Schema.Number),
        squash: Schema.optional(Schema.Boolean),
        labels: Schema.optional(Schema.String),
        networkmode: Schema.optional(Schema.String),
        platform: Schema.optional(Schema.String),
        target: Schema.optional(Schema.String),
        outputs: Schema.optional(Schema.String),
        version: Schema.optional(Schema.Literal("1")),
    },
    headers: {
        "Content-type": Schema.optional(Schema.String),
        "X-Registry-Config": Schema.optional(Schema.String),
    },
    payload: HttpApiSchema.StreamUint8Array(),
    success: HttpApiSchema.StreamUint8Array(), // 200 OK (streaming response)
    error: [
        BadRequest, // 400 Bad parameter
        InternalServerError,
    ],
});

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Image/operation/BuildPrune */
const buildPruneEndpoint = HttpApiEndpoint.post("buildPrune", "/build/prune", {
    query: {
        "keep-storage": Schema.optional(Schema.Number),
        all: Schema.optional(Schema.Boolean),
        filters: Schema.optional(Schema.String),
    },
    success: Schema.Struct({
        SpaceReclaimed: Schema.Number,
        CachesDeleted: Schema.Array(Schema.String),
    }), // 200 OK
    error: [InternalServerError],
});

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Image/operation/ImageCreate */
const createImageEndpoint = HttpApiEndpoint.post("create", "/images/create", {
    query: {
        fromImage: Schema.optional(Schema.String),
        fromSrc: Schema.optional(Schema.String),
        repo: Schema.optional(Schema.String),
        tag: Schema.optional(Schema.String),
        message: Schema.optional(Schema.String),
        changes: Schema.optional(Schema.String),
        platform: Schema.optional(Schema.String),
    },
    headers: { "X-Registry-Auth": Schema.optional(Schema.String) },
    success: HttpApiSchema.StreamUint8Array(), // 200 OK (streaming response)
    error: [
        NotFound, // 404 Repository not found or no read access
        InternalServerError,
    ],
});

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Image/operation/ImageInspect */
const inspectImageEndpoint = HttpApiEndpoint.get("inspect", "/images/:name/json", {
    params: { name: Schema.String },
    query: { manifests: Schema.optional(Schema.Boolean) },
    success: ImageInspectResponse, // 200 OK
    error: [
        NotFound, // 404 No such image
        InternalServerError,
    ],
});

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Image/operation/ImageHistory */
const historyImageEndpoint = HttpApiEndpoint.get("history", "/images/:name/history", {
    params: { name: Schema.String },
    query: { platform: Schema.optional(Schema.String) },
    success: Schema.Array(ImageHistoryResponseItem), // 200 OK
    error: [
        NotFound, // 404 No such image
        InternalServerError,
    ],
});

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Image/operation/ImagePush */
const pushImageEndpoint = HttpApiEndpoint.post("push", "/images/:name/push", {
    params: { name: Schema.String },
    query: { tag: Schema.optional(Schema.String), platform: Schema.optional(Schema.String) },
    headers: { "X-Registry-Auth": Schema.optional(Schema.String) },
    success: HttpApiSchema.StreamUint8Array(), // 200 OK (streaming response)
    error: [
        NotFound, // 404 No such image
        InternalServerError,
    ],
});

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Image/operation/ImageTag */
const tagImageEndpoint = HttpApiEndpoint.post("tag", "/images/:name/tag", {
    params: { name: Schema.String },
    query: { repo: Schema.optional(Schema.String), tag: Schema.optional(Schema.String) },
    success: HttpApiSchema.Empty(201), // 201 Created
    error: [
        BadRequest, // 400 Bad parameter
        NotFound, // 404 No such image
        Conflict, // 409 Conflict
        InternalServerError,
    ],
});

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Image/operation/ImageDelete */
const deleteImageEndpoint = HttpApiEndpoint.delete("delete", "/images/:name", {
    params: { name: Schema.String },
    query: {
        force: Schema.optional(Schema.Boolean),
        noprune: Schema.optional(Schema.Boolean),
        platforms: Schema.optional(Schema.Array(Schema.String)),
    },
    success: Schema.Array(ImageDeleteResponse), // 200 OK
    error: [
        NotFound, // 404 No such image
        Conflict, // 409 Conflict
        InternalServerError,
    ],
});

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Image/operation/ImageSearch */
const searchImagesEndpoint = HttpApiEndpoint.get("search", "/images/search", {
    query: {
        term: Schema.String,
        limit: Schema.optional(Schema.Number),
        filters: Schema.optional(SearchFilters),
    },
    success: Schema.Array(RegistrySearchResult), // 200 OK
    error: [InternalServerError],
});

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Image/operation/ImagePrune */
const pruneImagesEndpoint = HttpApiEndpoint.post("prune", "/images/prune", {
    query: {
        filters: Schema.optional(Schema.String),
    },
    success: Schema.Struct({
        SpaceReclaimed: Schema.Number,
        ImagesDeleted: Schema.NullishOr(Schema.Array(ImageDeleteResponse)),
    }), // 200 OK
    error: [InternalServerError],
});

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Image/operation/ImageCommit */
const commitImageEndpoint = HttpApiEndpoint.post("commit", "/images/commit", {
    query: {
        container: Schema.String,
        repo: Schema.optional(Schema.String),
        tag: Schema.optional(Schema.String),
        comment: Schema.optional(Schema.String),
        author: Schema.optional(Schema.String),
        pause: Schema.optional(Schema.Boolean),
        changes: Schema.optional(Schema.String),
    },
    payload: ContainerCreateRequest,
    success: ImageInspectResponse.pipe(HttpApiSchema.status(201)), // 201 Created
    error: [
        NotFound, // 404 No such container
        InternalServerError,
    ],
});

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Image/operation/ImageGet */
const exportImageEndpoint = HttpApiEndpoint.get("export", "/images/:name/get", {
    params: { name: Schema.String },
    query: { platform: Schema.optional(Schema.String) },
    success: HttpApiSchema.StreamUint8Array(), // 200 OK (streaming response)
    error: [
        NotFound, // 404 No such image
        InternalServerError,
    ],
});

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Image/operation/ImageGetAll */
const exportManyImagesEndpoint = HttpApiEndpoint.get("exportMany", "/images/get", {
    query: {
        names: Schema.optional(Schema.String),
        platform: Schema.optional(Schema.String),
    },
    success: HttpApiSchema.StreamUint8Array(), // 200 OK (streaming response)
    error: [
        NotFound, // 404 No such image
        InternalServerError,
    ],
});

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Image/operation/ImageLoad */
const importImageEndpoint = HttpApiEndpoint.post("import", "/images/load", {
    query: {
        platform: Schema.optional(Schema.String),
        quiet: Schema.optional(Schema.Boolean),
    },
    payload: HttpApiSchema.StreamUint8Array(),
    success: HttpApiSchema.StreamUint8Array(), // 200 OK (streaming response)
    error: [
        BadRequest, // 400 Bad parameter
        InternalServerError,
    ],
});

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Image */
const ImagesGroup = HttpApiGroup.make("images").add(
    listImagesEndpoint,
    buildImageEndpoint,
    buildPruneEndpoint,
    createImageEndpoint,
    inspectImageEndpoint,
    historyImageEndpoint,
    pushImageEndpoint,
    tagImageEndpoint,
    deleteImageEndpoint,
    searchImagesEndpoint,
    pruneImagesEndpoint,
    commitImageEndpoint,
    exportImageEndpoint,
    exportManyImagesEndpoint,
    importImageEndpoint
);

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
export class Images extends Context.Service<Images>()("@the-moby-effect/endpoints/Images", {
    make: Effect.gen(function* () {
        type ImagesEndpoints = HttpApiGroup.Endpoints<typeof ImagesGroup>;
        type Options<Name extends ImagesEndpoints["identifier"]> = HttpApiEndpoint.WithIdentifier<
            ImagesEndpoints,
            Name
        >["~Query"]["Type"];

        const httpClient = yield* Effect.map(
            HttpClient.HttpClient,
            WithRegistryAuthHeader(buildImageEndpoint, createImageEndpoint, pushImageEndpoint)
        );

        const ImagesError = DockerError.WrapForModule("images");
        const client = yield* HttpApiClient.group(ImagesApi, { group: "images", httpClient });
        const decodeJsonMessage = Schema.decodeEffect(Schema.fromJsonString(JSONMessage));

        const list_ = (options?: Options<"list">) =>
            Effect.mapError(client.list({ query: { ...options } }), ImagesError("list"));
        const build_ = <E, R>(build: Stream.Stream<Uint8Array, E, R>, options?: Options<"build">) =>
            Effect.contextWith((context: Context.Context<R>) =>
                client.build({
                    query: { ...options },
                    headers: { "Content-type": "application/tar" },
                    payload: Stream.provideContext(build, context),
                })
            ).pipe(
                Stream.unwrap,
                Stream.decodeText(),
                Stream.splitLines,
                Stream.mapEffect((line) => decodeJsonMessage(line)),
                Stream.mapError(ImagesError("build"))
            );
        const buildPrune_ = (options?: Options<"buildPrune">) =>
            Effect.mapError(client.buildPrune({ query: { ...options } }), ImagesError("buildPrune"));
        const create_ = (options?: Options<"create">) =>
            client.create({ headers: {}, query: { ...options } }).pipe(
                Stream.unwrap,
                Stream.decodeText(),
                Stream.splitLines,
                Stream.mapEffect((line) => decodeJsonMessage(line)),
                Stream.mapError(ImagesError("create"))
            );
        const inspect_ = (name: string, options?: Options<"inspect">) =>
            Effect.mapError(client.inspect({ params: { name }, query: { ...options } }), ImagesError("inspect"));
        const history_ = (name: string, options?: Options<"history">) =>
            Effect.mapError(client.history({ params: { name }, query: { ...options } }), ImagesError("history"));
        const push_ = (name: string, options?: Options<"push">) =>
            client.push({ params: { name }, query: { ...options }, headers: {} }).pipe(
                Stream.unwrap,
                Stream.decodeText(),
                Stream.splitLines,
                Stream.mapEffect((line) => decodeJsonMessage(line)),
                Stream.mapError(ImagesError("push"))
            );
        const tag_ = (name: string, options?: Options<"tag">) =>
            Effect.mapError(client.tag({ params: { name }, query: { ...options } }), ImagesError("tag"));
        const delete_ = (name: string, options?: Options<"delete">) =>
            Effect.mapError(client.delete({ params: { name }, query: { ...options } }), ImagesError("delete"));
        const search_ = (options: Options<"search">) =>
            Effect.mapError(client.search({ query: { ...options } }), ImagesError("search"));
        const prune_ = (options?: Options<"prune">) =>
            Effect.mapError(client.prune({ query: { ...options } }), ImagesError("prune"));
        const commit_ = (
            payload: ConstructorParameters<typeof ContainerCreateRequest>[0],
            options: Options<"commit">
        ) =>
            Effect.mapError(
                client.commit({ query: { ...options }, payload: new ContainerCreateRequest(payload) }),
                ImagesError("commit")
            );
        const export_ = (name: string, options?: Options<"export">) =>
            client.export({ params: { name }, query: { ...options } }).pipe(
                Stream.unwrap,
                Stream.decodeText(),
                Stream.splitLines,
                Stream.mapEffect((line) => decodeJsonMessage(line)),
                Stream.mapError(ImagesError("export"))
            );
        const exportMany_ = (options?: Options<"exportMany">) =>
            client.exportMany({ query: { ...options } }).pipe(
                Stream.unwrap,
                Stream.decodeText(),
                Stream.splitLines,
                Stream.mapEffect((line) => decodeJsonMessage(line)),
                Stream.mapError(ImagesError("exportMany"))
            );
        const import_ = <E, R>(build: Stream.Stream<Uint8Array, E, R>, options?: Options<"import">) =>
            Effect.contextWith((context: Context.Context<R>) =>
                client.import({ query: { ...options }, payload: Stream.provideContext(build, context) })
            ).pipe(
                Stream.unwrap,
                Stream.decodeText(),
                Stream.splitLines,
                Stream.mapEffect((line) => decodeJsonMessage(line)),
                Stream.mapError(ImagesError("import"))
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
export const ImagesLayer: Layer.Layer<Images, never, HttpClient.HttpClient> = Layer.effect(Images, Images.make);

/**
 * @since 1.0.0
 * @category Services
 * @see https://docs.docker.com/reference/api/engine/latest/#tag/Image
 */
export const ImagesLayerLocalSocket: Layer.Layer<Images, never, HttpClient.HttpClient> = ImagesLayer.pipe(
    Layer.provide(
        makeAgnosticHttpClientLayer(
            MobyConnectionOptions.socket({
                socketPath: "/var/run/docker.sock",
            })
        )
    )
);
