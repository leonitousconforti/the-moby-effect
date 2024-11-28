/**
 * @since 1.0.0
 * @see https://docs.docker.com/reference/api/engine/latest/#tag/Image
 */

import * as PlatformError from "@effect/platform/Error";
import * as HttpBody from "@effect/platform/HttpBody";
import * as HttpClient from "@effect/platform/HttpClient";
import * as HttpClientError from "@effect/platform/HttpClientError";
import * as HttpClientRequest from "@effect/platform/HttpClientRequest";
import * as HttpClientResponse from "@effect/platform/HttpClientResponse";
import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as Layer from "effect/Layer";
import * as Option from "effect/Option";
import * as ParseResult from "effect/ParseResult";
import * as Predicate from "effect/Predicate";
import * as Schema from "effect/Schema";
import * as Stream from "effect/Stream";

import {
    ContainerConfig,
    IDResponse,
    ImageDeleteResponse as ImageDeleteResponseItem,
    ImageHistoryResponseItem,
    ImageInspectResponse as ImageInspect,
    ImagePruneResponse,
    RegistrySearchResponse as ImageSearchResponseItem,
    ImageSummary,
    JSONMessage,
} from "../generated/index.js";
import { maybeAddFilters, maybeAddQueryParameter } from "./Common.js";

/**
 * @since 1.0.0
 * @category Errors
 * @internal
 */
export const ImagesErrorTypeId: unique symbol = Symbol.for(
    "@the-moby-effect/endpoints/ImagesError"
) as ImagesErrorTypeId;

/**
 * @since 1.0.0
 * @category Errors
 * @internal
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
    cause: ParseResult.ParseError | HttpClientError.HttpClientError | HttpBody.HttpBodyError | unknown;
}> {
    get message() {
        return `${this.method}`;
    }
}

/**
 * @since 1.0.0
 * @category Params
 * @see https://docs.docker.com/reference/api/engine/latest/#tag/Image
 */
export interface ImageBuildOptions<E1> {
    /**
     * A tar archive compressed with one of the following algorithms: identity
     * (no compression), gzip, bzip2, xz.
     */
    readonly context: Stream.Stream<Uint8Array, E1, never>;
    /**
     * Path within the build context to the `Dockerfile`. This is ignored if
     * `remote` is specified and points to an external `Dockerfile`.
     */
    readonly dockerfile?: string | undefined;
    /**
     * A name and optional tag to apply to the image in the `name:tag` format.
     * If you omit the tag the default `latest` value is assumed. You can
     * provide several `t` parameters.
     */
    readonly t?: string | undefined;
    /** Extra hosts to add to /etc/hosts */
    readonly extrahosts?: string | undefined;
    /**
     * A Git repository URI or HTTP/HTTPS context URI. If the URI points to a
     * single text file, the file’s contents are placed into a file called
     * `Dockerfile` and the image is built from that file. If the URI points to
     * a tarball, the file is downloaded by the daemon and the contents therein
     * used as the context for the build. If the URI points to a tarball and the
     * `dockerfile` parameter is also specified, there must be a file with the
     * corresponding path inside the tarball.
     */
    readonly remote?: string | undefined;
    /** Suppress verbose build output. */
    readonly q?: boolean | undefined;
    /** Do not use the cache when building the image. */
    readonly nocache?: boolean | undefined;
    /** JSON array of images used for build cache resolution. */
    readonly cachefrom?: string | undefined;
    /** Attempt to pull the image even if an older image exists locally. */
    readonly pull?: string | undefined;
    /** Remove intermediate containers after a successful build. */
    readonly rm?: boolean | undefined;
    /** Always remove intermediate containers, even upon failure. */
    readonly forcerm?: boolean | undefined;
    /** Set memory limit for build. */
    readonly memory?: number | undefined;
    /** Total memory (memory + swap). Set as `-1` to disable swap. */
    readonly memswap?: number | undefined;
    /** CPU shares (relative weight). */
    readonly cpushares?: number | undefined;
    /** CPUs in which to allow execution (e.g., `0-3`, `0,1`). */
    readonly cpusetcpus?: string | undefined;
    /** The length of a CPU period in microseconds. */
    readonly cpuperiod?: number | undefined;
    /** Microseconds of CPU time that the container can get in a CPU period. */
    readonly cpuquota?: number | undefined;
    /**
     * JSON map of string pairs for build-time variables. Users pass these
     * values at build-time. Docker uses the buildargs as the environment
     * context for commands run via the `Dockerfile` RUN instruction, or for
     * variable expansion in other `Dockerfile` instructions. This is not meant
     * for passing secret values.
     *
     * For example, the build arg `FOO=bar` would become `{"FOO":"bar"}` in
     * JSON. This would result in the query parameter `buildargs={"FOO":"bar"}`.
     * Note that `{"FOO":"bar"}` should be URI component encoded.
     *
     * [Read more about the buildargs
     * instruction.](https://docs.docker.com/engine/reference/builder/#arg)
     */
    readonly buildArgs?: Record<string, string | undefined> | undefined;
    /**
     * Size of `/dev/shm` in bytes. The size must be greater than 0. If omitted
     * the system uses 64MB.
     */
    readonly shmsize?: number | undefined;
    /**
     * Squash the resulting images layers into a single layer. _(Experimental
     * release only.)_
     */
    readonly squash?: boolean | undefined;
    /**
     * Arbitrary key/value labels to set on the image, as a JSON map of string
     * pairs.
     */
    readonly labels?: string | undefined;
    /**
     * Sets the networking mode for the run commands during build. Supported
     * standard values are: `bridge`, `host`, `none`, and `container:<name|id>`.
     * Any other value is taken as a custom network's name or ID to which this
     * container should connect to.
     */
    readonly networkmode?: string | undefined;
    readonly "Content-type"?: string | undefined;
    /**
     * This is a base64-encoded JSON object with auth configurations for
     * multiple registries that a build may refer to.
     *
     * The key is a registry URL, and the value is an auth configuration object,
     * [as described in the authentication section](#section/Authentication).
     * For example:
     *
     *     {
     *         "docker.example.com": {
     *             "username": "janedoe",
     *             "password": "hunter2"
     *         },
     *         "https://index.docker.io/v1/": {
     *             "username": "mobydock",
     *             "password": "conta1n3rize14"
     *         }
     *     }
     *
     * Only the registry domain name (and port if not the default 443) are
     * required. However, for legacy reasons, the Docker Hub registry must be
     * specified with both a `https://` prefix and a `/v1/` suffix even though
     * Docker will prefer to use the v2 registry API.
     */
    readonly "X-Registry-Config"?: string | undefined;
    /** Platform in the format os[/arch[/variant]] */
    readonly platform?: string | undefined;
    /** Target build stage */
    readonly target?: string | undefined;
    /** BuildKit output configuration */
    readonly outputs?: string | undefined;
}

/**
 * Images service
 *
 * @since 1.0.0
 * @category Tags
 */
export class Images extends Effect.Service<Images>()("@the-moby-effect/endpoints/Images", {
    accessors: false,
    dependencies: [],

    effect: Effect.gen(function* () {
        const defaultClient = yield* HttpClient.HttpClient;
        const client = defaultClient.pipe(HttpClient.filterStatusOk);

        /** @see https://docs.docker.com/reference/api/engine/latest/#tag/Image/operation/ImageList */
        const list_ = (
            options?:
                | {
                      /**
                       * Show all images. Only images from a final layer (no
                       * children) are shown by default.
                       */
                      readonly all?: boolean;
                      /**
                       * A JSON encoded value of the filters (a
                       * `map[string][]string`) to process on the images list.
                       *
                       * Available filters:
                       *
                       * - `before`=(`<image-name>[:<tag>]`, `<image id>` or
                       *   `<image@digest>`)
                       * - `dangling=true`
                       * - `label=key` or `label="key=value"` of an image label
                       * - `reference`=(`<image-name>[:<tag>]`)
                       * - `since`=(`<image-name>[:<tag>]`, `<image id>` or
                       *   `<image@digest>`)
                       * - `until=<timestamp>`
                       */
                      readonly filters?: string | undefined;
                      /**
                       * Compute and show shared size as a `SharedSize` field on
                       * each image.
                       */
                      readonly "shared-size"?: boolean | undefined;
                      /**
                       * Show digest information as a `RepoDigests` field on
                       * each image.
                       */
                      readonly digests?: boolean | undefined;
                  }
                | undefined
        ): Effect.Effect<ReadonlyArray<ImageSummary>, ImagesError, never> =>
            Function.pipe(
                HttpClientRequest.get("/images/json"),
                maybeAddQueryParameter("all", Option.fromNullable(options?.all)),
                maybeAddQueryParameter("filters", Option.fromNullable(options?.filters)),
                maybeAddQueryParameter("shared-size", Option.fromNullable(options?.["shared-size"])),
                maybeAddQueryParameter("digests", Option.fromNullable(options?.digests)),
                client.execute,
                Effect.flatMap(HttpClientResponse.schemaBodyJson(Schema.Array(ImageSummary))),
                Effect.mapError((cause) => new ImagesError({ method: "list", cause })),
                Effect.scoped
            );

        /**
         * TODO: This needs to error if the build failed
         *
         * @see https://docs.docker.com/reference/api/engine/latest/#tag/Image/operation/ImageBuild
         */
        const build_ = <E1>(options: ImageBuildOptions<E1>): Stream.Stream<JSONMessage, ImagesError, never> =>
            Function.pipe(
                HttpClientRequest.post(`/build`),
                HttpClientRequest.setHeader("Content-type", options["Content-type"] ?? "application/x-tar"),
                HttpClientRequest.setHeader("X-Registry-Config", options["X-Registry-Config"] ?? ""),
                maybeAddQueryParameter("dockerfile", Option.fromNullable(options.dockerfile)),
                maybeAddQueryParameter("t", Option.fromNullable(options.t)),
                maybeAddQueryParameter("extrahosts", Option.fromNullable(options.extrahosts)),
                maybeAddQueryParameter("remote", Option.fromNullable(options.remote)),
                maybeAddQueryParameter("q", Option.fromNullable(options.q)),
                maybeAddQueryParameter("nocache", Option.fromNullable(options.nocache)),
                maybeAddQueryParameter("cachefrom", Option.fromNullable(options.cachefrom)),
                maybeAddQueryParameter("pull", Option.fromNullable(options.pull)),
                maybeAddQueryParameter("rm", Option.fromNullable(options.rm)),
                maybeAddQueryParameter("forcerm", Option.fromNullable(options.forcerm)),
                maybeAddQueryParameter("memory", Option.fromNullable(options.memory)),
                maybeAddQueryParameter("memswap", Option.fromNullable(options.memswap)),
                maybeAddQueryParameter("cpushares", Option.fromNullable(options.cpushares)),
                maybeAddQueryParameter("cpusetcpus", Option.fromNullable(options.cpusetcpus)),
                maybeAddQueryParameter("cpuperiod", Option.fromNullable(options.cpuperiod)),
                maybeAddQueryParameter("cpuquota", Option.fromNullable(options.cpuquota))
            ).pipe(
                maybeAddQueryParameter("buildargs", Option.fromNullable(JSON.stringify(options.buildArgs))),
                maybeAddQueryParameter("shmsize", Option.fromNullable(options.shmsize)),
                maybeAddQueryParameter("squash", Option.fromNullable(options.squash)),
                maybeAddQueryParameter("labels", Option.fromNullable(options.labels)),
                maybeAddQueryParameter("networkmode", Option.fromNullable(options.networkmode)),
                maybeAddQueryParameter("platform", Option.fromNullable(options.platform)),
                maybeAddQueryParameter("target", Option.fromNullable(options.target)),
                maybeAddQueryParameter("outputs", Option.fromNullable(options.outputs)),
                maybeAddQueryParameter("version", Option.some("1")),
                HttpClientRequest.bodyStream(options.context),
                client.execute,
                HttpClientResponse.stream,
                Stream.decodeText(),
                Stream.splitLines,
                Stream.mapEffect(Schema.decode(Schema.parseJson(JSONMessage))),
                Stream.mapError((cause) => new ImagesError({ method: "build", cause }))
            );

        /** @see https://docs.docker.com/reference/api/engine/latest/#tag/Image/operation/BuildPrune */
        const buildPrune_ = (
            options?:
                | {
                      readonly "keep-storage"?: number;
                      readonly all?: boolean;
                      readonly filters?:
                          | {
                                until?: string | undefined;
                                id?: string | undefined;
                                parent?: string | undefined;
                                type?: string | undefined;
                                description?: string | undefined;
                                inuse?: boolean | undefined;
                                shared?: boolean | undefined;
                                private?: boolean | undefined;
                            }
                          | undefined;
                  }
                | undefined
        ): Effect.Effect<ImagePruneResponse, ImagesError, never> =>
            Function.pipe(
                HttpClientRequest.post("/build/prune"),
                maybeAddQueryParameter("keep-storage", Option.fromNullable(options?.["keep-storage"])),
                maybeAddQueryParameter("all", Option.fromNullable(options?.all)),
                maybeAddFilters(options?.filters),
                client.execute,
                Effect.flatMap(HttpClientResponse.schemaBodyJson(ImagePruneResponse)),
                Effect.mapError((cause) => new ImagesError({ method: "buildPrune", cause })),
                Effect.scoped
            );

        /** @see https://docs.docker.com/reference/api/engine/latest/#tag/Image/operation/ImageCreate */
        const create_ = (options: {
            /**
             * Name of the image to pull. The name may include a tag or digest.
             * This parameter may only be used when pulling an image. The pull
             * is cancelled if the HTTP connection is closed.
             */
            readonly fromImage?: string | undefined;
            /**
             * Source to import. The value may be a URL from which the image can
             * be retrieved or `-` to read the image from the request body. This
             * parameter may only be used when importing an image.
             */
            readonly fromSrc?: string | undefined;
            /**
             * Repository name given to an image when it is imported. The repo
             * may include a tag. This parameter may only be used when importing
             * an image.
             */
            readonly repo?: string | undefined;
            /**
             * Tag or digest. If empty when pulling an image, this causes all
             * tags for the given image to be pulled.
             */
            readonly tag?: string | undefined;
            /** Set commit message for imported image. */
            readonly message?: string | undefined;
            /**
             * Image content if the value `-` has been specified in fromSrc
             * query parameter
             */
            readonly inputImage?: string | undefined;
            /**
             * A base64url-encoded auth configuration.
             *
             * Refer to the [authentication section](#section/Authentication)
             * for details.
             */
            readonly "X-Registry-Auth"?: string | undefined;
            /**
             * Apply `Dockerfile` instructions to the image that is created, for
             * example: `changes=ENV DEBUG=true`. Note that `ENV DEBUG=true`
             * should be URI component encoded.
             *
             * Supported `Dockerfile` instructions:
             * `CMD`|`ENTRYPOINT`|`ENV`|`EXPOSE`|`ONBUILD`|`USER`|`VOLUME`|`WORKDIR`
             */
            readonly changes?: string | undefined;
            /**
             * Platform in the format os[/arch[/variant]].
             *
             * When used in combination with the `fromImage` option, the daemon
             * checks if the given image is present in the local image cache
             * with the given OS and Architecture, and otherwise attempts to
             * pull the image. If the option is not set, the host's native OS
             * and Architecture are used. If the given image does not exist in
             * the local image cache, the daemon attempts to pull the image with
             * the host's native OS and Architecture. If the given image does
             * exists in the local image cache, but its OS or architecture does
             * not match, a warning is produced.
             *
             * When used with the `fromSrc` option to import an image from an
             * archive, this option sets the platform information for the
             * imported image. If the option is not set, the host's native OS
             * and Architecture are used for the imported image.
             */
            readonly platform?: string | undefined;
        }): Stream.Stream<JSONMessage, ImagesError, never> =>
            Function.pipe(
                HttpClientRequest.post("/images/create"),
                HttpClientRequest.setHeader("X-Registry-Auth", options["X-Registry-Auth"] || ""),
                maybeAddQueryParameter("fromImage", Option.fromNullable(options.fromImage)),
                maybeAddQueryParameter("fromSrc", Option.fromNullable(options.fromSrc)),
                maybeAddQueryParameter("repo", Option.fromNullable(options.repo)),
                maybeAddQueryParameter("tag", Option.fromNullable(options.tag)),
                maybeAddQueryParameter("message", Option.fromNullable(options.message)),
                maybeAddQueryParameter("changes", Option.fromNullable(options.changes)),
                maybeAddQueryParameter("platform", Option.fromNullable(options.platform)),
                HttpClientRequest.bodyText(options.inputImage ?? ""),
                client.execute,
                HttpClientResponse.stream,
                Stream.decodeText(),
                Stream.splitLines,
                Stream.mapEffect(Schema.decode(Schema.parseJson(JSONMessage))),
                Stream.mapError((cause) => new ImagesError({ method: "create", cause }))
            );

        /** @see https://docs.docker.com/reference/api/engine/latest/#tag/Image/operation/ImageInspect */
        const inspect_ = (options: {
            readonly name: string;
        }): Effect.Effect<Readonly<ImageInspect>, ImagesError, never> =>
            Function.pipe(
                HttpClientRequest.get(`/images/${encodeURIComponent(options.name)}/json`),
                client.execute,
                Effect.flatMap(HttpClientResponse.schemaBodyJson(ImageInspect)),
                Effect.mapError((cause) => new ImagesError({ method: "inspect", cause })),
                Effect.scoped
            );

        /** @see https://docs.docker.com/reference/api/engine/latest/#tag/Image/operation/ImageHistory */
        const history_ = (options: {
            readonly name: string;
        }): Effect.Effect<ReadonlyArray<ImageHistoryResponseItem>, ImagesError, never> =>
            Function.pipe(
                HttpClientRequest.get(`/images/${encodeURIComponent(options.name)}/history`),
                client.execute,
                Effect.flatMap(HttpClientResponse.schemaBodyJson(Schema.Array(ImageHistoryResponseItem))),
                Effect.mapError((cause) => new ImagesError({ method: "history", cause })),
                Effect.scoped
            );

        /** @see https://docs.docker.com/reference/api/engine/latest/#tag/Image/operation/ImagePush */
        const push_ = (options: {
            readonly name: string;
            readonly tag?: string;
            readonly "X-Registry-Auth": string;
        }): Stream.Stream<string, ImagesError, never> =>
            Function.pipe(
                HttpClientRequest.post(`/images/${encodeURIComponent(options.name)}/push`),
                HttpClientRequest.setHeader("X-Registry-Auth", options["X-Registry-Auth"]),
                maybeAddQueryParameter("tag", Option.fromNullable(options.tag)),
                client.execute,
                HttpClientResponse.stream,
                Stream.decodeText(),
                Stream.mapError((cause) => new ImagesError({ method: "push", cause }))
            );

        /** @see https://docs.docker.com/reference/api/engine/latest/#tag/Image/operation/ImageTag */
        const tag_ = (options: {
            readonly name: string;
            readonly repo?: string;
            readonly tag?: string;
        }): Effect.Effect<void, ImagesError, never> =>
            Function.pipe(
                HttpClientRequest.post(`/images/${encodeURIComponent(options.name)}/tag`),
                maybeAddQueryParameter("repo", Option.fromNullable(options.repo)),
                maybeAddQueryParameter("tag", Option.fromNullable(options.tag)),
                client.execute,
                Effect.asVoid,
                Effect.mapError((cause) => new ImagesError({ method: "tag", cause })),
                Effect.scoped
            );

        /** @see https://docs.docker.com/reference/api/engine/latest/#tag/Image/operation/ImageDelete */
        const delete_ = (options: {
            readonly name: string;
            readonly force?: boolean;
            readonly noprune?: boolean;
        }): Effect.Effect<ReadonlyArray<ImageDeleteResponseItem>, ImagesError, never> =>
            Function.pipe(
                HttpClientRequest.del(`/images/${encodeURIComponent(options.name)}`),
                maybeAddQueryParameter("force", Option.fromNullable(options.force)),
                maybeAddQueryParameter("noprune", Option.fromNullable(options.noprune)),
                client.execute,
                Effect.flatMap(HttpClientResponse.schemaBodyJson(Schema.Array(ImageDeleteResponseItem))),
                Effect.mapError((cause) => new ImagesError({ method: "delete", cause })),
                Effect.scoped
            );

        /** @see https://docs.docker.com/reference/api/engine/latest/#tag/Image/operation/ImageSearch */
        const search_ = (options: {
            readonly term: string;
            readonly limit?: number | undefined;
            readonly stars?: number | undefined;
            readonly "is-official"?: boolean | undefined;
        }): Effect.Effect<ReadonlyArray<ImageSearchResponseItem>, ImagesError, never> =>
            Function.pipe(
                HttpClientRequest.get("/images/search"),
                maybeAddQueryParameter("term", Option.some(options.term)),
                maybeAddQueryParameter("limit", Option.fromNullable(options.limit)),
                maybeAddFilters({ stars: options.stars, "is-official": options["is-official"] }),
                client.execute,
                Effect.flatMap(HttpClientResponse.schemaBodyJson(Schema.Array(ImageSearchResponseItem))),
                Effect.mapError((cause) => new ImagesError({ method: "search", cause })),
                Effect.scoped
            );

        /** @see https://docs.docker.com/reference/api/engine/latest/#tag/Image/operation/ImagePrune */
        const prune_ = (
            options?:
                | {
                      readonly filters?: {
                          dangling?: ["true" | "false"] | undefined;
                          until?: [string] | undefined;
                          label?: Array<string> | undefined;
                      };
                  }
                | undefined
        ): Effect.Effect<ImagePruneResponse, ImagesError, never> =>
            Function.pipe(
                HttpClientRequest.post("/images/prune"),
                maybeAddQueryParameter(
                    "filters",
                    Function.pipe(options?.filters, Option.fromNullable, Option.map(JSON.stringify))
                ),
                client.execute,
                Effect.flatMap(HttpClientResponse.schemaBodyJson(ImagePruneResponse)),
                Effect.mapError((cause) => new ImagesError({ method: "prune", cause })),
                Effect.scoped
            );

        /** @see https://docs.docker.com/reference/api/engine/latest/#tag/Image/operation/ImageCommit */
        const commit_ = (options: {
            readonly containerConfig: ContainerConfig;
            readonly container?: string;
            readonly repo?: string;
            readonly tag?: string;
            readonly comment?: string;
            readonly author?: string;
            readonly pause?: boolean;
            readonly changes?: string;
        }): Effect.Effect<Readonly<IDResponse>, ImagesError, never> =>
            Function.pipe(
                HttpClientRequest.post("/images/commit"),
                maybeAddQueryParameter("container", Option.fromNullable(options.container)),
                maybeAddQueryParameter("repo", Option.fromNullable(options.repo)),
                maybeAddQueryParameter("tag", Option.fromNullable(options.tag)),
                maybeAddQueryParameter("comment", Option.fromNullable(options.comment)),
                maybeAddQueryParameter("author", Option.fromNullable(options.author)),
                maybeAddQueryParameter("pause", Option.fromNullable(options.pause)),
                maybeAddQueryParameter("changes", Option.fromNullable(options.changes)),
                HttpClientRequest.schemaBodyJson(ContainerConfig)(options.containerConfig),
                Effect.flatMap(client.execute),
                Effect.flatMap(HttpClientResponse.schemaBodyJson(IDResponse)),
                Effect.mapError((cause) => new ImagesError({ method: "commit", cause })),
                Effect.scoped
            );

        /** @see https://docs.docker.com/reference/api/engine/latest/#tag/Image/operation/ImageGet */
        const get_ = (options: { readonly name: string }): Stream.Stream<string, ImagesError, never> =>
            Function.pipe(
                HttpClientRequest.get(`/images/${encodeURIComponent(options.name)}/get`),
                client.execute,
                HttpClientResponse.stream,
                Stream.decodeText(),
                Stream.mapError((cause) => new ImagesError({ method: "get", cause }))
            );

        /** @see https://docs.docker.com/reference/api/engine/latest/#tag/Image/operation/ImageGetAll */
        const getall_ = (
            options?: { readonly names?: Array<string> | undefined } | undefined
        ): Stream.Stream<string, ImagesError, never> =>
            Function.pipe(
                HttpClientRequest.get("/images/get"),
                maybeAddQueryParameter("names", Option.fromNullable(options?.names)),
                client.execute,
                HttpClientResponse.stream,
                Stream.decodeText(),
                Stream.mapError((cause) => new ImagesError({ method: "getall", cause }))
            );

        /** @see https://docs.docker.com/reference/api/engine/latest/#tag/Image/operation/ImageLoad */
        const load_ = <E1>(options: {
            readonly imagesTarball: Stream.Stream<Uint8Array, E1, never>;
            readonly quiet?: boolean;
        }): Effect.Effect<void, ImagesError, never> =>
            Function.pipe(
                HttpClientRequest.post("/images/load"),
                maybeAddQueryParameter("quiet", Option.fromNullable(options?.quiet)),
                HttpClientRequest.bodyStream(options.imagesTarball),
                client.execute,
                Effect.asVoid,
                Effect.mapError((cause) => new ImagesError({ method: "load", cause })),
                Effect.scoped
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
            get: get_,
            getall: getall_,
            load: load_,
        };
    }),
}) {}

/**
 * @since 1.0.0
 * @category Layers
 * @see https://docs.docker.com/reference/api/engine/latest/#tag/Image
 */
export const ImagesLayer: Layer.Layer<Images, never, HttpClient.HttpClient> = Images.Default;
