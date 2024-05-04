import * as HttpClient from "@effect/platform/HttpClient";
import * as Schema from "@effect/schema/Schema";
import * as Context from "effect/Context";
import * as Data from "effect/Data";
import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as Layer from "effect/Layer";
import * as Scope from "effect/Scope";
import * as Stream from "effect/Stream";
import * as String from "effect/String";

import {
    IMobyConnectionAgent,
    MobyConnectionAgent,
    MobyConnectionOptions,
    MobyHttpClientLive,
    getAgent,
} from "./agent-helpers.js";
import { addQueryParameter, responseErrorHandler, streamErrorHandler } from "./request-helpers.js";
import {
    BuildInfo,
    BuildPruneResponse,
    ContainerConfig,
    HistoryResponseItem,
    IdResponse,
    ImageDeleteResponseItem,
    ImageInspect,
    ImagePruneResponse,
    ImageSearchResponseItem,
    ImageSummary,
} from "./schemas.js";

export class ImagesError extends Data.TaggedError("ImagesError")<{
    method: string;
    message: string;
}> {}

export interface ImageListOptions {
    /**
     * Show all images. Only images from a final layer (no children) are shown
     * by default.
     */
    readonly all?: boolean;
    /**
     * A JSON encoded value of the filters (a `map[string][]string`) to process
     * on the images list.
     *
     * Available filters:
     *
     * - `before`=(`<image-name>[:<tag>]`, `<image id>` or `<image@digest>`)
     * - `dangling=true`
     * - `label=key` or `label="key=value"` of an image label
     * - `reference`=(`<image-name>[:<tag>]`)
     * - `since`=(`<image-name>[:<tag>]`, `<image id>` or `<image@digest>`)
     * - `until=<timestamp>`
     */
    readonly filters?: string;
    /** Compute and show shared size as a `SharedSize` field on each image. */
    readonly "shared-size"?: boolean;
    /** Show digest information as a `RepoDigests` field on each image. */
    readonly digests?: boolean;
}

export interface ImageBuildOptions {
    /**
     * A tar archive compressed with one of the following algorithms: identity
     * (no compression), gzip, bzip2, xz.
     */
    readonly context: Stream.Stream<Uint8Array, ImagesError>;
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
    readonly buildargs?: string | undefined;
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

export interface BuildPruneOptions {
    /** Amount of disk space in bytes to keep for cache */
    readonly "keep-storage"?: number;
    /** Remove all types of build cache */
    readonly all?: boolean;
    /**
     * A JSON encoded value of the filters (a `map[string][]string`) to process
     * on the list of build cache objects.
     *
     * Available filters:
     *
     * - `until=<timestamp>` remove cache older than `<timestamp>`. The
     *   `<timestamp>` can be Unix timestamps, date formatted timestamps, or Go
     *   duration strings (e.g. `10m`, `1h30m`) computed relative to the
     *   daemon's local time.
     * - `id=<id>`
     * - `parent=<id>`
     * - `type=<string>`
     * - `description=<string>`
     * - `inuse`
     * - `shared`
     * - `private`
     */
    readonly filters?: string;
}

export interface ImageCreateOptions {
    /**
     * Name of the image to pull. The name may include a tag or digest. This
     * parameter may only be used when pulling an image. The pull is cancelled
     * if the HTTP connection is closed.
     */
    readonly fromImage?: string | undefined;
    /**
     * Source to import. The value may be a URL from which the image can be
     * retrieved or `-` to read the image from the request body. This parameter
     * may only be used when importing an image.
     */
    readonly fromSrc?: string | undefined;
    /**
     * Repository name given to an image when it is imported. The repo may
     * include a tag. This parameter may only be used when importing an image.
     */
    readonly repo?: string | undefined;
    /**
     * Tag or digest. If empty when pulling an image, this causes all tags for
     * the given image to be pulled.
     */
    readonly tag?: string | undefined;
    /** Set commit message for imported image. */
    readonly message?: string | undefined;
    /**
     * Image content if the value `-` has been specified in fromSrc query
     * parameter
     */
    readonly inputImage?: string | undefined;
    /**
     * A base64url-encoded auth configuration.
     *
     * Refer to the [authentication section](#section/Authentication) for
     * details.
     */
    readonly "X-Registry-Auth"?: string | undefined;
    /**
     * Apply `Dockerfile` instructions to the image that is created, for
     * example: `changes=ENV DEBUG=true`. Note that `ENV DEBUG=true` should be
     * URI component encoded.
     *
     * Supported `Dockerfile` instructions:
     * `CMD`|`ENTRYPOINT`|`ENV`|`EXPOSE`|`ONBUILD`|`USER`|`VOLUME`|`WORKDIR`
     */
    readonly changes?: string | undefined;
    /**
     * Platform in the format os[/arch[/variant]].
     *
     * When used in combination with the `fromImage` option, the daemon checks
     * if the given image is present in the local image cache with the given OS
     * and Architecture, and otherwise attempts to pull the image. If the option
     * is not set, the host's native OS and Architecture are used. If the given
     * image does not exist in the local image cache, the daemon attempts to
     * pull the image with the host's native OS and Architecture. If the given
     * image does exists in the local image cache, but its OS or architecture
     * does not match, a warning is produced.
     *
     * When used with the `fromSrc` option to import an image from an archive,
     * this option sets the platform information for the imported image. If the
     * option is not set, the host's native OS and Architecture are used for the
     * imported image.
     */
    readonly platform?: string | undefined;
}

export interface ImageInspectOptions {
    /** Image name or id */
    readonly name: string;
}

export interface ImageHistoryOptions {
    /** Image name or ID */
    readonly name: string;
}

export interface ImagePushOptions {
    /** Image name or ID. */
    readonly name: string;
    /** The tag to associate with the image on the registry. */
    readonly tag?: string;
    /**
     * A base64url-encoded auth configuration.
     *
     * Refer to the [authentication section](#section/Authentication) for
     * details.
     */
    readonly "X-Registry-Auth": string;
}

export interface ImageTagOptions {
    /** Image name or ID to tag. */
    readonly name: string;
    /** The repository to tag in. For example, `someuser/someimage`. */
    readonly repo?: string;
    /** The name of the new tag. */
    readonly tag?: string;
}

export interface ImageDeleteOptions {
    /** Image name or ID */
    readonly name: string;
    /**
     * Remove the image even if it is being used by stopped containers or has
     * other tags
     */
    readonly force?: boolean;
    /** Do not delete untagged parent images */
    readonly noprune?: boolean;
}

export interface ImageSearchOptions {
    /** Term to search */
    readonly term: string;
    /** Maximum number of results to return */
    readonly limit?: number;
    /**
     * A JSON encoded value of the filters (a `map[string][]string`) to process
     * on the images list. Available filters:
     *
     * - `is-automated=(true|false)` (deprecated, see below)
     * - `is-official=(true|false)`
     * - `stars=<number>` Matches images that has at least 'number' stars.
     *
     * The `is-automated` filter is deprecated. The `is_automated` field has
     * been deprecated by Docker Hub's search API. Consequently, searching for
     * `is-automated=true` will yield no results.
     */
    readonly filters?: string;
}

export interface ImagePruneOptions {
    /**
     * Filters to process on the prune list, encoded as JSON (a
     * `map[string][]string`). Available filters:
     *
     * - `dangling=<boolean>` When set to `true` (or `1`), prune only unused _and_
     *   untagged images. When set to `false` (or `0`), all unused images are
     *   pruned.
     * - `until=<string>` Prune images created before this timestamp. The
     *   `<timestamp>` can be Unix timestamps, date formatted timestamps, or Go
     *   duration strings (e.g. `10m`, `1h30m`) computed relative to the daemon
     *   machine’s time.
     * - `label` (`label=<key>`, `label=<key>=<value>`, `label!=<key>`, or
     *   `label!=<key>=<value>`) Prune images with (or without, in case
     *   `label!=...` is used) the specified labels.
     */
    readonly filters?: {
        dangling?: ["true" | "false"] | undefined;
        until?: [string] | undefined;
        label?: string[] | undefined;
    };
}

export interface ImageCommitOptions {
    /** The container configuration */
    readonly containerConfig: ContainerConfig;
    /** The ID or name of the container to commit */
    readonly container?: string;
    /** Repository name for the created image */
    readonly repo?: string;
    /** Tag name for the create image */
    readonly tag?: string;
    /** Commit message */
    readonly comment?: string;
    /** Author of the image (e.g., `John Hannibal Smith <hannibal@a-team.com>`) */
    readonly author?: string;
    /** Whether to pause the container before committing */
    readonly pause?: boolean;
    /** `Dockerfile` instructions to apply while committing */
    readonly changes?: string;
}

export interface ImageGetOptions {
    /** Image name or ID */
    readonly name: string;
}

export interface ImageGetAllOptions {
    /** Image names to filter by */
    readonly names?: Array<string> | undefined;
}

export interface ImageLoadOptions {
    /** Tar archive containing images */
    readonly imagesTarball: Stream.Stream<Uint8Array>;
    /** Suppress progress details during load. */
    readonly quiet?: boolean;
}

export interface Images {
    /**
     * List Images
     *
     * @param all - Show all images. Only images from a final layer (no
     *   children) are shown by default.
     * @param filters - A JSON encoded value of the filters (a
     *   `map[string][]string`) to process on the images list.
     *
     *   Available filters:
     *
     *   - `before`=(`<image-name>[:<tag>]`, `<image id>` or `<image@digest>`)
     *   - `dangling=true`
     *   - `label=key` or `label="key=value"` of an image label
     *   - `reference`=(`<image-name>[:<tag>]`)
     *   - `since`=(`<image-name>[:<tag>]`, `<image id>` or `<image@digest>`)
     *   - `until=<timestamp>`
     *
     * @param shared-size - Compute and show shared size as a `SharedSize` field
     *   on each image.
     * @param digests - Show digest information as a `RepoDigests` field on each
     *   image.
     */
    readonly list: (
        options?: ImageListOptions | undefined
    ) => Effect.Effect<Readonly<Array<ImageSummary>>, ImagesError>;

    /**
     * Build an image
     *
     * @param context - A tar archive compressed with one of the following
     *   algorithms: identity (no compression), gzip, bzip2, xz.
     * @param dockerfile - Path within the build context to the `Dockerfile`.
     *   This is ignored if `remote` is specified and points to an external
     *   `Dockerfile`.
     * @param t - A name and optional tag to apply to the image in the
     *   `name:tag` format. If you omit the tag the default `latest` value is
     *   assumed. You can provide several `t` parameters.
     * @param extrahosts - Extra hosts to add to /etc/hosts
     * @param remote - A Git repository URI or HTTP/HTTPS context URI. If the
     *   URI points to a single text file, the file’s contents are placed into a
     *   file called `Dockerfile` and the image is built from that file. If the
     *   URI points to a tarball, the file is downloaded by the daemon and the
     *   contents therein used as the context for the build. If the URI points
     *   to a tarball and the `dockerfile` parameter is also specified, there
     *   must be a file with the corresponding path inside the tarball.
     * @param q - Suppress verbose build output.
     * @param nocache - Do not use the cache when building the image.
     * @param cachefrom - JSON array of images used for build cache resolution.
     * @param pull - Attempt to pull the image even if an older image exists
     *   locally.
     * @param rm - Remove intermediate containers after a successful build.
     * @param forcerm - Always remove intermediate containers, even upon
     *   failure.
     * @param memory - Set memory limit for build.
     * @param memswap - Total memory (memory + swap). Set as `-1` to disable
     *   swap.
     * @param cpushares - CPU shares (relative weight).
     * @param cpusetcpus - CPUs in which to allow execution (e.g., `0-3`,
     *   `0,1`).
     * @param cpuperiod - The length of a CPU period in microseconds.
     * @param cpuquota - Microseconds of CPU time that the container can get in
     *   a CPU period.
     * @param buildargs - JSON map of string pairs for build-time variables.
     *   Users pass these values at build-time. Docker uses the buildargs as the
     *   environment context for commands run via the `Dockerfile` RUN
     *   instruction, or for variable expansion in other `Dockerfile`
     *   instructions. This is not meant for passing secret values.
     *
     *   For example, the build arg `FOO=bar` would become `{"FOO":"bar"}` in
     *   JSON. This would result in the query parameter
     *   `buildargs={"FOO":"bar"}`. Note that `{"FOO":"bar"}` should be URI
     *   component encoded.
     *
     *   [Read more about the buildargs
     *   instruction.](https://docs.docker.com/engine/reference/builder/#arg)
     * @param shmsize - Size of `/dev/shm` in bytes. The size must be greater
     *   than 0. If omitted the system uses 64MB.
     * @param squash - Squash the resulting images layers into a single layer.
     *   _(Experimental release only.)_
     * @param labels - Arbitrary key/value labels to set on the image, as a JSON
     *   map of string pairs.
     * @param networkmode - Sets the networking mode for the run commands during
     *   build. Supported standard values are: `bridge`, `host`, `none`, and
     *   `container:<name|id>`. Any other value is taken as a custom network's
     *   name or ID to which this container should connect to.
     * @param Content-type -
     * @param X-Registry-Config - This is a base64-encoded JSON object with auth
     *   configurations for multiple registries that a build may refer to.
     *
     *   The key is a registry URL, and the value is an auth configuration object,
     *   [as described in the authentication section](#section/Authentication).
     *   For example:
     *
     *       {
     *           "docker.example.com": {
     *               "username": "janedoe",
     *               "password": "hunter2"
     *           },
     *           "https://index.docker.io/v1/": {
     *               "username": "mobydock",
     *               "password": "conta1n3rize14"
     *           }
     *       }
     *
     *   Only the registry domain name (and port if not the default 443) are
     *   required. However, for legacy reasons, the Docker Hub registry must be
     *   specified with both a `https://` prefix and a `/v1/` suffix even though
     *   Docker will prefer to use the v2 registry API.
     * @param platform - Platform in the format os[/arch[/variant]]
     * @param target - Target build stage
     * @param outputs - BuildKit output configuration
     */
    readonly build: (options: ImageBuildOptions) => Effect.Effect<Stream.Stream<BuildInfo, ImagesError>, ImagesError>;

    /**
     * Delete builder cache
     *
     * @param keep-storage - Amount of disk space in bytes to keep for cache
     * @param all - Remove all types of build cache
     * @param filters - A JSON encoded value of the filters (a
     *   `map[string][]string`) to process on the list of build cache objects.
     *
     *   Available filters:
     *
     *   - `until=<timestamp>` remove cache older than `<timestamp>`. The
     *       `<timestamp>` can be Unix timestamps, date formatted timestamps, or
     *       Go duration strings (e.g. `10m`, `1h30m`) computed relative to the
     *       daemon's local time.
     *   - `id=<id>`
     *   - `parent=<id>`
     *   - `type=<string>`
     *   - `description=<string>`
     *   - `inuse`
     *   - `shared`
     *   - `private`
     */
    readonly buildPrune: (options: BuildPruneOptions) => Effect.Effect<BuildPruneResponse, ImagesError>;

    /**
     * Create an image
     *
     * @param fromImage - Name of the image to pull. The name may include a tag
     *   or digest. This parameter may only be used when pulling an image. The
     *   pull is cancelled if the HTTP connection is closed.
     * @param fromSrc - Source to import. The value may be a URL from which the
     *   image can be retrieved or `-` to read the image from the request body.
     *   This parameter may only be used when importing an image.
     * @param repo - Repository name given to an image when it is imported. The
     *   repo may include a tag. This parameter may only be used when importing
     *   an image.
     * @param tag - Tag or digest. If empty when pulling an image, this causes
     *   all tags for the given image to be pulled.
     * @param message - Set commit message for imported image.
     * @param inputImage - Image content if the value `-` has been specified in
     *   fromSrc query parameter
     * @param X-Registry-Auth - A base64url-encoded auth configuration.
     *
     *   Refer to the [authentication section](#section/Authentication) for
     *   details.
     * @param changes - Apply `Dockerfile` instructions to the image that is
     *   created, for example: `changes=ENV DEBUG=true`. Note that `ENV
     *   DEBUG=true` should be URI component encoded.
     *
     *   Supported `Dockerfile` instructions:
     *   `CMD`|`ENTRYPOINT`|`ENV`|`EXPOSE`|`ONBUILD`|`USER`|`VOLUME`|`WORKDIR`
     * @param platform - Platform in the format os[/arch[/variant]].
     *
     *   When used in combination with the `fromImage` option, the daemon checks
     *   if the given image is present in the local image cache with the given
     *   OS and Architecture, and otherwise attempts to pull the image. If the
     *   option is not set, the host's native OS and Architecture are used. If
     *   the given image does not exist in the local image cache, the daemon
     *   attempts to pull the image with the host's native OS and Architecture.
     *   If the given image does exists in the local image cache, but its OS or
     *   architecture does not match, a warning is produced.
     *
     *   When used with the `fromSrc` option to import an image from an archive,
     *   this option sets the platform information for the imported image. If
     *   the option is not set, the host's native OS and Architecture are used
     *   for the imported image.
     */
    readonly create: (options: ImageCreateOptions) => Effect.Effect<Stream.Stream<BuildInfo, ImagesError>, ImagesError>;

    /**
     * Inspect an image
     *
     * @param name - Image name or id
     */
    readonly inspect: (options: ImageInspectOptions) => Effect.Effect<Readonly<ImageInspect>, ImagesError>;

    /**
     * Get the history of an image
     *
     * @param name - Image name or ID
     */
    readonly history: (
        options: ImageHistoryOptions
    ) => Effect.Effect<Schema.Schema.Type<typeof HistoryResponseItem>, ImagesError>;

    /**
     * Push an image
     *
     * @param name - Image name or ID.
     * @param tag - The tag to associate with the image on the registry.
     * @param X-Registry-Auth - A base64url-encoded auth configuration.
     *
     *   Refer to the [authentication section](#section/Authentication) for
     *   details.
     */
    readonly push: (options: ImagePushOptions) => Effect.Effect<Stream.Stream<string, ImagesError>, ImagesError>;

    /**
     * Tag an image
     *
     * @param name - Image name or ID to tag.
     * @param repo - The repository to tag in. For example,
     *   `someuser/someimage`.
     * @param tag - The name of the new tag.
     */
    readonly tag: (options: ImageTagOptions) => Effect.Effect<void, ImagesError>;

    /**
     * Remove an image
     *
     * @param name - Image name or ID
     * @param force - Remove the image even if it is being used by stopped
     *   containers or has other tags
     * @param noprune - Do not delete untagged parent images
     */
    readonly delete: (
        options: ImageDeleteOptions
    ) => Effect.Effect<Readonly<Array<ImageDeleteResponseItem>>, ImagesError>;

    /**
     * Search images
     *
     * @param term - Term to search
     * @param limit - Maximum number of results to return
     * @param filters - A JSON encoded value of the filters (a
     *   `map[string][]string`) to process on the images list. Available
     *   filters:
     *
     *   - `is-automated=(true|false)` (deprecated, see below)
     *   - `is-official=(true|false)`
     *   - `stars=<number>` Matches images that has at least 'number' stars.
     *
     *   The `is-automated` filter is deprecated. The `is_automated` field has
     *   been deprecated by Docker Hub's search API. Consequently, searching for
     *   `is-automated=true` will yield no results.
     */
    readonly search: (
        options: ImageSearchOptions
    ) => Effect.Effect<Schema.Schema.Type<typeof ImageSearchResponseItem>, ImagesError>;

    /**
     * Delete unused images
     *
     * @param filters - Filters to process on the prune list, encoded as JSON (a
     *   `map[string][]string`). Available filters:
     *
     *   - `dangling=<boolean>` When set to `true` (or `1`), prune only unused _and_
     *       untagged images. When set to `false` (or `0`), all unused images
     *       are pruned.
     *   - `until=<string>` Prune images created before this timestamp. The
     *       `<timestamp>` can be Unix timestamps, date formatted timestamps, or
     *       Go duration strings (e.g. `10m`, `1h30m`) computed relative to the
     *       daemon machine’s time.
     *   - `label` (`label=<key>`, `label=<key>=<value>`, `label!=<key>`, or
     *       `label!=<key>=<value>`) Prune images with (or without, in case
     *       `label!=...` is used) the specified labels.
     */
    readonly prune: (options?: ImagePruneOptions | undefined) => Effect.Effect<ImagePruneResponse, ImagesError>;

    /**
     * Create a new image from a container
     *
     * @param containerConfig - The container configuration
     * @param container - The ID or name of the container to commit
     * @param repo - Repository name for the created image
     * @param tag - Tag name for the create image
     * @param comment - Commit message
     * @param author - Author of the image (e.g., `John Hannibal Smith
     *   <hannibal@a-team.com>`)
     * @param pause - Whether to pause the container before committing
     * @param changes - `Dockerfile` instructions to apply while committing
     */
    readonly commit: (options: ImageCommitOptions) => Effect.Effect<Readonly<IdResponse>, ImagesError>;

    /**
     * Export an image
     *
     * @param name - Image name or ID
     */
    readonly get: (options: ImageGetOptions) => Effect.Effect<Stream.Stream<string, ImagesError>, ImagesError>;

    /**
     * Export several images
     *
     * @param names - Image names to filter by
     */
    readonly getall: (options: ImageGetAllOptions) => Effect.Effect<Stream.Stream<string, ImagesError>, ImagesError>;

    /**
     * Import images
     *
     * @param imagesTarball - Tar archive containing images
     * @param quiet - Suppress progress details during load.
     */
    readonly load: (options: ImageLoadOptions) => Effect.Effect<void, ImagesError>;
}

const make: Effect.Effect<Images, never, IMobyConnectionAgent | HttpClient.client.Client.Default> = Effect.gen(
    function* (_: Effect.Adapter) {
        const agent = yield* _(MobyConnectionAgent);
        const defaultClient = yield* _(HttpClient.client.Client);

        const client = defaultClient.pipe(
            HttpClient.client.mapRequest(HttpClient.request.prependUrl(`${agent.nodeRequestUrl}/images`)),
            HttpClient.client.filterStatusOk
        );

        const voidClient = client.pipe(HttpClient.client.transform(Effect.asUnit));
        const IdResponseClient = client.pipe(
            HttpClient.client.mapEffect(HttpClient.response.schemaBodyJson(IdResponse))
        );
        const ImageInspectClient = client.pipe(
            HttpClient.client.mapEffect(HttpClient.response.schemaBodyJson(ImageInspect))
        );
        const ImageSummariesClient = client.pipe(
            HttpClient.client.mapEffect(HttpClient.response.schemaBodyJson(Schema.array(ImageSummary)))
        );
        const BuildPruneResponseClient = client.pipe(
            HttpClient.client.mapEffect(HttpClient.response.schemaBodyJson(BuildPruneResponse))
        );
        const HistoryResponseItemsClient = client.pipe(
            HttpClient.client.mapEffect(HttpClient.response.schemaBodyJson(HistoryResponseItem))
        );
        const ImageDeleteResponseItemsClient = client.pipe(
            HttpClient.client.mapEffect(HttpClient.response.schemaBodyJson(Schema.array(ImageDeleteResponseItem)))
        );
        const ImageSearchResponseItemsClient = client.pipe(
            HttpClient.client.mapEffect(HttpClient.response.schemaBodyJson(ImageSearchResponseItem))
        );
        const ImagePruneResponseClient = client.pipe(
            HttpClient.client.mapEffect(HttpClient.response.schemaBodyJson(ImagePruneResponse))
        );

        const streamHandler = (method: string) => streamErrorHandler((message) => new ImagesError({ method, message }));
        const responseHandler = (method: string) =>
            responseErrorHandler((message) => new ImagesError({ method, message }));

        const list_ = (
            options?: ImageListOptions | undefined
        ): Effect.Effect<Readonly<Array<ImageSummary>>, ImagesError> =>
            Function.pipe(
                HttpClient.request.get("/json"),
                addQueryParameter("all", options?.all),
                addQueryParameter("filters", options?.filters),
                addQueryParameter("shared-size", options?.["shared-size"]),
                addQueryParameter("digests", options?.digests),
                ImageSummariesClient,
                Effect.catchAll(responseHandler("list")),
                Effect.scoped
            );

        const build_ = (
            options: ImageBuildOptions
        ): Effect.Effect<Stream.Stream<BuildInfo, ImagesError>, ImagesError> =>
            Function.pipe(
                HttpClient.request.post(`${agent.nodeRequestUrl}/build`),
                HttpClient.request.setHeader("Content-type", ""),
                HttpClient.request.setHeader("X-Registry-Config", ""),
                addQueryParameter("dockerfile", options.dockerfile),
                addQueryParameter("t", options.t),
                addQueryParameter("extrahosts", options.extrahosts),
                addQueryParameter("remote", options.remote),
                addQueryParameter("q", options.q),
                addQueryParameter("nocache", options.nocache),
                addQueryParameter("cachefrom", options.cachefrom),
                addQueryParameter("pull", options.pull),
                addQueryParameter("rm", options.rm),
                addQueryParameter("forcerm", options.forcerm),
                addQueryParameter("memory", options.memory),
                addQueryParameter("memswap", options.memswap),
                addQueryParameter("cpushares", options.cpushares),
                addQueryParameter("cpusetcpus", options.cpusetcpus),
                addQueryParameter("cpuperiod", options.cpuperiod),
                addQueryParameter("cpuquota", options.cpuquota)
            ).pipe(
                addQueryParameter("buildargs", options.buildargs),
                addQueryParameter("shmsize", options.shmsize),
                addQueryParameter("squash", options.squash),
                addQueryParameter("labels", options.labels),
                addQueryParameter("networkmode", options.networkmode),
                addQueryParameter("platform", options.platform),
                addQueryParameter("target", options.target),
                addQueryParameter("outputs", options.outputs),
                HttpClient.request.streamBody(
                    Stream.mapError(
                        options.context,
                        (error) =>
                            new HttpClient.error.RequestError({
                                reason: "Encode",
                                error: error,
                                request: {} as unknown as HttpClient.request.ClientRequest,
                            })
                    )
                ),
                Effect.map((response) => response.stream),
                Effect.map(Stream.decodeText("utf8")),
                Effect.map(Stream.map(String.linesIterator)),
                Effect.map(Stream.flattenIterables),
                Effect.map(Stream.map(Schema.decode(Schema.parseJson(BuildInfo)))),
                Effect.map((stream) => Stream.flattenEffect(stream)),
                Effect.map(Stream.catchAll(streamHandler("build"))),
                Effect.catchAll(responseHandler("build"))
            );

        const buildPrune_ = (options: BuildPruneOptions): Effect.Effect<BuildPruneResponse, ImagesError> =>
            Function.pipe(
                HttpClient.request.post("/build/prune"),
                addQueryParameter("keep-storage", options["keep-storage"]),
                addQueryParameter("all", options.all),
                addQueryParameter("filters", options.filters),
                BuildPruneResponseClient,
                Effect.catchAll(responseHandler("buildPrune")),
                Effect.scoped
            );

        const create_ = (
            options: ImageCreateOptions
        ): Effect.Effect<Stream.Stream<BuildInfo, ImagesError>, ImagesError> =>
            Function.pipe(
                HttpClient.request.post("/create"),
                HttpClient.request.setHeader("X-Registry-Auth", options["X-Registry-Auth"] || ""),
                addQueryParameter("fromImage", options.fromImage),
                addQueryParameter("fromSrc", options.fromSrc),
                addQueryParameter("repo", options.repo),
                addQueryParameter("tag", options.tag),
                addQueryParameter("message", options.message),
                addQueryParameter("changes", options.changes),
                addQueryParameter("platform", options.platform),
                HttpClient.request.schemaBody(Schema.string)(options.inputImage ?? ""),
                Effect.flatMap(client),
                Effect.map((response) => response.stream),
                Effect.map(Stream.decodeText("utf8")),
                Effect.map(Stream.map(String.linesIterator)),
                Effect.map(Stream.flattenIterables),
                Effect.map(Stream.map(Schema.decode(Schema.parseJson(BuildInfo)))),
                Effect.map(Stream.catchAll(streamHandler("create"))),
                Effect.catchAll(responseHandler("create")),
                Effect.scoped
            );

        const inspect_ = (options: ImageInspectOptions): Effect.Effect<Readonly<ImageInspect>, ImagesError> =>
            Function.pipe(
                HttpClient.request.get("/{name}/json".replace("{name}", encodeURIComponent(options.name))),
                ImageInspectClient,
                Effect.catchAll(responseHandler("inspect")),
                Effect.scoped
            );

        const history_ = (
            options: ImageHistoryOptions
        ): Effect.Effect<Schema.Schema.To<typeof HistoryResponseItem>, ImagesError> =>
            Function.pipe(
                HttpClient.request.get("/{name}/history".replace("{name}", encodeURIComponent(options.name))),
                HistoryResponseItemsClient,
                Effect.catchAll(responseHandler("history")),
                Effect.scoped
            );

        const push_ = (options: ImagePushOptions): Effect.Effect<Stream.Stream<string, ImagesError>, ImagesError> =>
            Function.pipe(
                HttpClient.request.post("/{name}/push".replace("{name}", encodeURIComponent(options.name))),
                HttpClient.request.setHeader("X-Registry-Auth", options["X-Registry-Auth"]),
                addQueryParameter("tag", options.tag),
                client,
                Effect.map((response) => response.stream),
                Effect.map(Stream.decodeText("utf8")),
                Effect.map(Stream.catchAll(streamHandler("push"))),
                Effect.catchAll(responseHandler("push")),
                Effect.scoped
            );

        const tag_ = (options: ImageTagOptions): Effect.Effect<void, ImagesError> =>
            Function.pipe(
                HttpClient.request.post("/{name}/tag".replace("{name}", encodeURIComponent(options.name))),
                addQueryParameter("repo", options.repo),
                addQueryParameter("tag", options.tag),
                voidClient,
                Effect.catchAll(responseHandler("tag")),
                Effect.scoped
            );

        const delete_ = (
            options: ImageDeleteOptions
        ): Effect.Effect<Readonly<Array<ImageDeleteResponseItem>>, ImagesError> =>
            Function.pipe(
                HttpClient.request.del("/{name}".replace("{name}", encodeURIComponent(options.name))),
                addQueryParameter("force", options.force),
                addQueryParameter("noprune", options.noprune),
                ImageDeleteResponseItemsClient,
                Effect.catchAll(responseHandler("delete")),
                Effect.scoped
            );

        const search_ = (
            options: ImageSearchOptions
        ): Effect.Effect<Schema.Schema.To<typeof ImageSearchResponseItem>, ImagesError> =>
            Function.pipe(
                HttpClient.request.get("/search"),
                addQueryParameter("term", options.term),
                addQueryParameter("limit", options.limit),
                addQueryParameter("filters", options.filters),
                ImageSearchResponseItemsClient,
                Effect.catchAll(responseHandler("search")),
                Effect.scoped
            );

        const prune_ = (options?: ImagePruneOptions | undefined): Effect.Effect<ImagePruneResponse, ImagesError> =>
            Function.pipe(
                HttpClient.request.post("/prune"),
                addQueryParameter("filters", JSON.stringify(options?.filters)),
                ImagePruneResponseClient,
                Effect.catchAll(responseHandler("prune")),
                Effect.scoped
            );

        const commit_ = (options: ImageCommitOptions): Effect.Effect<Readonly<IdResponse>, ImagesError> =>
            Function.pipe(
                HttpClient.request.post("/commit"),
                addQueryParameter("container", options.container),
                addQueryParameter("repo", options.repo),
                addQueryParameter("tag", options.tag),
                addQueryParameter("comment", options.comment),
                addQueryParameter("author", options.author),
                addQueryParameter("pause", options.pause),
                addQueryParameter("changes", options.changes),
                HttpClient.request.schemaBody(ContainerConfig)(options.containerConfig),
                Effect.flatMap(IdResponseClient),
                Effect.catchAll(responseHandler("commit")),
                Effect.scoped
            );

        const get_ = (options: ImageGetOptions): Effect.Effect<Stream.Stream<string, ImagesError>, ImagesError> =>
            Function.pipe(
                HttpClient.request.get("/{name}/get".replace("{name}", encodeURIComponent(options.name))),
                client,
                Effect.map((response) => response.stream),
                Effect.map(Stream.decodeText("utf8")),
                Effect.map(Stream.catchAll(streamHandler("get"))),
                Effect.catchAll(responseHandler("get")),
                Effect.scoped
            );

        const getall_ = (options: ImageGetAllOptions): Effect.Effect<Stream.Stream<string, ImagesError>, ImagesError> =>
            Function.pipe(
                HttpClient.request.get("/get"),
                addQueryParameter("names", options.names),
                client,
                Effect.map((response) => response.stream),
                Effect.map(Stream.decodeText("utf8")),
                Effect.map(Stream.catchAll(streamHandler("getall"))),
                Effect.catchAll(responseHandler("getall")),
                Effect.scoped
            );

        const load_ = (options: ImageLoadOptions): Effect.Effect<void, ImagesError> =>
            Function.pipe(
                HttpClient.request.post("/load"),
                addQueryParameter("quiet", options.quiet),
                HttpClient.request.streamBody(options.imagesTarball),
                voidClient,
                Effect.catchAll(responseHandler("load")),
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
    }
);

export const Images = Context.GenericTag<Images>("the-moby-effect/Images");
export const layer = Layer.effect(Images, make).pipe(Layer.provide(MobyHttpClientLive));

export const fromAgent = (agent: Effect.Effect<IMobyConnectionAgent, never, Scope.Scope>) =>
    layer.pipe(Layer.provide(Layer.scoped(MobyConnectionAgent, agent)));

export const fromConnectionOptions = (connectionOptions: MobyConnectionOptions) =>
    fromAgent(getAgent(connectionOptions));
