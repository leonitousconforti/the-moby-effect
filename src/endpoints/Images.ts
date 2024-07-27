/**
 * Images service
 *
 * @since 1.0.0
 */

import * as PlatformError from "@effect/platform/Error";
import * as HttpClient from "@effect/platform/HttpClient";
import * as HttpClientRequest from "@effect/platform/HttpClientRequest";
import * as HttpClientResponse from "@effect/platform/HttpClientResponse";
import * as Schema from "@effect/schema/Schema";
import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as Layer from "effect/Layer";
import * as Option from "effect/Option";
import * as Predicate from "effect/Predicate";
import * as Stream from "effect/Stream";
import * as String from "effect/String";

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
 */
export const ImagesErrorTypeId: unique symbol = Symbol.for("@the-moby-effect/moby/ImagesError");

/**
 * @since 1.0.0
 * @category Errors
 */
export type ImagesErrorTypeId = typeof ImagesErrorTypeId;

/**
 * @since 1.0.0
 * @category Errors
 */
export const isDistributionsError = (u: unknown): u is ImagesError => Predicate.hasProperty(u, ImagesErrorTypeId);

/**
 * @since 1.0.0
 * @category Errors
 */
export class ImagesError extends PlatformError.TypeIdError(ImagesErrorTypeId, "ImagesError")<{
    method: string;
    cause: unknown;
    // cause: ParseResult.ParseError | HttpClientError.HttpClientError | HttpBody.HttpBodyError;
}> {
    get message() {
        return this.method;
    }
}

/**
 * @since 1.0.0
 * @category Params
 */
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
    readonly filters?: string | undefined;
    /** Compute and show shared size as a `SharedSize` field on each image. */
    readonly "shared-size"?: boolean | undefined;
    /** Show digest information as a `RepoDigests` field on each image. */
    readonly digests?: boolean | undefined;
}

/**
 * @since 1.0.0
 * @category Params
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
 * @since 1.0.0
 * @category Params
 */
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

/**
 * @since 1.0.0
 * @category Params
 */
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

/**
 * @since 1.0.0
 * @category Params
 */
export interface ImageInspectOptions {
    /** Image name or id */
    readonly name: string;
}

/**
 * @since 1.0.0
 * @category Params
 */
export interface ImageHistoryOptions {
    /** Image name or ID */
    readonly name: string;
}

/**
 * @since 1.0.0
 * @category Params
 */
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

/**
 * @since 1.0.0
 * @category Params
 */
export interface ImageTagOptions {
    /** Image name or ID to tag. */
    readonly name: string;
    /** The repository to tag in. For example, `someuser/someimage`. */
    readonly repo?: string;
    /** The name of the new tag. */
    readonly tag?: string;
}

/**
 * @since 1.0.0
 * @category Params
 */
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

/**
 * @since 1.0.0
 * @category Params
 */
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

/**
 * @since 1.0.0
 * @category Params
 */
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
        label?: Array<string> | undefined;
    };
}

/**
 * @since 1.0.0
 * @category Params
 */
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

/**
 * @since 1.0.0
 * @category Params
 */
export interface ImageGetOptions {
    /** Image name or ID */
    readonly name: string;
}

/**
 * @since 1.0.0
 * @category Params
 */
export interface ImageGetAllOptions {
    /** Image names to filter by */
    readonly names?: Array<string> | undefined;
}

/**
 * @since 1.0.0
 * @category Params
 */
export interface ImageLoadOptions<E1> {
    /** Tar archive containing images */
    readonly imagesTarball: Stream.Stream<Uint8Array, E1, never>;
    /** Suppress progress details during load. */
    readonly quiet?: boolean;
}

/**
 * @since 1.0.0
 * @category Tags
 */
export interface ImagesImpl {
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
    ) => Effect.Effect<ReadonlyArray<ImageSummary>, ImagesError, never>;

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
    readonly build: <E1>(options: ImageBuildOptions<E1>) => Stream.Stream<JSONMessage, ImagesError, never>;

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
    readonly buildPrune: (options: BuildPruneOptions) => Effect.Effect<ImagePruneResponse, ImagesError>;

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
    readonly create: (options: ImageCreateOptions) => Stream.Stream<JSONMessage, ImagesError, never>;

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
    ) => Effect.Effect<ReadonlyArray<ImageHistoryResponseItem>, ImagesError, never>;

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
    readonly push: (options: ImagePushOptions) => Stream.Stream<string, ImagesError, never>;

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
    readonly commit: (options: ImageCommitOptions) => Effect.Effect<Readonly<IDResponse>, ImagesError>;

    /**
     * Export an image
     *
     * @param name - Image name or ID
     */
    readonly get: (options: ImageGetOptions) => Stream.Stream<string, ImagesError, never>;

    /**
     * Export several images
     *
     * @param names - Image names to filter by
     */
    readonly getall: (options: ImageGetAllOptions) => Stream.Stream<string, ImagesError, never>;

    /**
     * Import images
     *
     * @param imagesTarball - Tar archive containing images
     * @param quiet - Suppress progress details during load.
     */
    readonly load: <E1>(options: ImageLoadOptions<E1>) => Effect.Effect<void, ImagesError>;
}

/**
 * @since 1.0.0
 * @category Services
 */
export const make: Effect.Effect<ImagesImpl, never, HttpClient.HttpClient.Default> = Effect.gen(function* () {
    const defaultClient = yield* HttpClient.HttpClient;
    const buildClient = defaultClient.pipe(HttpClient.filterStatusOk);
    const client = defaultClient.pipe(
        // HttpClient.mapRequest(HttpClientRequest.appendUrl("/images")),
        HttpClient.filterStatusOk
    );
    const voidClient = client.pipe(HttpClient.transform(Effect.asVoid));

    const IdResponseClient = client.pipe(HttpClient.mapEffect(HttpClientResponse.schemaBodyJson(IDResponse)));
    const ImageInspectClient = client.pipe(HttpClient.mapEffect(HttpClientResponse.schemaBodyJson(ImageInspect)));
    const ImageSummariesClient = client.pipe(
        HttpClient.transformResponse(HttpClientResponse.schemaBodyJsonScoped(Schema.Array(ImageSummary)))
    );
    const HistoryResponseItemsClient = client.pipe(
        HttpClient.mapEffect(HttpClientResponse.schemaBodyJson(Schema.Array(ImageHistoryResponseItem)))
    );
    const ImageDeleteResponseItemsClient = client.pipe(
        HttpClient.mapEffect(HttpClientResponse.schemaBodyJson(Schema.Array(ImageDeleteResponseItem)))
    );
    const ImageSearchResponseItemsClient = client.pipe(
        HttpClient.mapEffect(HttpClientResponse.schemaBodyJson(ImageSearchResponseItem))
    );
    const ImagePruneResponseClient = client.pipe(
        HttpClient.mapEffect(HttpClientResponse.schemaBodyJson(ImagePruneResponse))
    );

    const list_ = (
        options?: ImageListOptions | undefined
    ): Effect.Effect<ReadonlyArray<ImageSummary>, ImagesError, never> =>
        Function.pipe(
            HttpClientRequest.get("/json"),
            maybeAddQueryParameter("all", Option.fromNullable(options?.all)),
            maybeAddQueryParameter("filters", Option.fromNullable(options?.filters)),
            maybeAddQueryParameter("shared-size", Option.fromNullable(options?.["shared-size"])),
            maybeAddQueryParameter("digests", Option.fromNullable(options?.digests)),
            ImageSummariesClient,
            Effect.mapError((cause) => new ImagesError({ method: "list", cause }))
        );

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
            // FIXME: aaaahhhhhh
            maybeAddQueryParameter("buildargs", Option.fromNullable(JSON.stringify(options.buildArgs))),
            maybeAddQueryParameter("shmsize", Option.fromNullable(options.shmsize)),
            maybeAddQueryParameter("squash", Option.fromNullable(options.squash)),
            maybeAddQueryParameter("labels", Option.fromNullable(options.labels)),
            maybeAddQueryParameter("networkmode", Option.fromNullable(options.networkmode)),
            maybeAddQueryParameter("platform", Option.fromNullable(options.platform)),
            maybeAddQueryParameter("target", Option.fromNullable(options.target)),
            maybeAddQueryParameter("outputs", Option.fromNullable(options.outputs)),
            maybeAddQueryParameter("version", Option.some("1")),
            HttpClientRequest.streamBody(options.context),
            buildClient,
            HttpClientResponse.stream,
            Stream.decodeText("utf8"),
            Stream.map(String.linesIterator),
            Stream.flattenIterables,
            Stream.mapEffect(Schema.decode(Schema.parseJson(JSONMessage)), { unordered: false }),
            Stream.mapError((cause) => new ImagesError({ method: "build", cause }))
        );

    const buildPrune_ = (
        options?: BuildPruneOptions | undefined
    ): Effect.Effect<ImagePruneResponse, ImagesError, never> =>
        Function.pipe(
            HttpClientRequest.post("/build/prune"),
            maybeAddQueryParameter("keep-storage", Option.fromNullable(options?.["keep-storage"])),
            maybeAddQueryParameter("all", Option.fromNullable(options?.all)),
            maybeAddFilters(options?.filters),
            buildClient,
            HttpClientResponse.schemaBodyJsonScoped(ImagePruneResponse),
            Effect.mapError((cause) => new ImagesError({ method: "buildPrune", cause }))
        );

    const create_ = (options: ImageCreateOptions): Stream.Stream<JSONMessage, ImagesError, never> =>
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
            HttpClientRequest.schemaBody(Schema.String)(options.inputImage ?? ""),
            Effect.flatMap(client),
            HttpClientResponse.stream,
            Stream.decodeText("utf8"),
            Stream.map(String.linesIterator),
            Stream.flattenIterables,
            Stream.mapEffect(Schema.decode(Schema.parseJson(JSONMessage))),
            Stream.mapError((cause) => new ImagesError({ method: "create", cause }))
        );

    const inspect_ = (options: ImageInspectOptions): Effect.Effect<Readonly<ImageInspect>, ImagesError, never> =>
        Function.pipe(
            HttpClientRequest.get(`/${encodeURIComponent(options.name)}/json`),
            ImageInspectClient,
            Effect.mapError((cause) => new ImagesError({ method: "inspect", cause })),
            Effect.scoped
        );

    const history_ = (
        options: ImageHistoryOptions
    ): Effect.Effect<ReadonlyArray<ImageHistoryResponseItem>, ImagesError, never> =>
        Function.pipe(
            HttpClientRequest.get(`/${encodeURIComponent(options.name)}/history`),
            HistoryResponseItemsClient,
            Effect.mapError((cause) => new ImagesError({ method: "history", cause })),
            Effect.scoped
        );

    const push_ = (options: ImagePushOptions): Stream.Stream<string, ImagesError, never> =>
        Function.pipe(
            HttpClientRequest.post(`/${encodeURIComponent(options.name)}/push`),
            HttpClientRequest.setHeader("X-Registry-Auth", options["X-Registry-Auth"]),
            maybeAddQueryParameter("tag", Option.fromNullable(options.tag)),
            client,
            HttpClientResponse.stream,
            Stream.decodeText("utf8"),
            Stream.mapError((cause) => new ImagesError({ method: "push", cause }))
        );

    const tag_ = (options: ImageTagOptions): Effect.Effect<void, ImagesError, never> =>
        Function.pipe(
            HttpClientRequest.post(`/${encodeURIComponent(options.name)}/tag`),
            maybeAddQueryParameter("repo", Option.fromNullable(options.repo)),
            maybeAddQueryParameter("tag", Option.fromNullable(options.tag)),
            voidClient,
            Effect.mapError((cause) => new ImagesError({ method: "tag", cause })),
            Effect.scoped
        );

    const delete_ = (
        options: ImageDeleteOptions
    ): Effect.Effect<ReadonlyArray<ImageDeleteResponseItem>, ImagesError, never> =>
        Function.pipe(
            HttpClientRequest.del(`/images/${encodeURIComponent(options.name)}`),
            maybeAddQueryParameter("force", Option.fromNullable(options.force)),
            maybeAddQueryParameter("noprune", Option.fromNullable(options.noprune)),
            ImageDeleteResponseItemsClient,
            Effect.mapError((cause) => new ImagesError({ method: "delete", cause })),
            Effect.scoped
        );

    const search_ = (options: ImageSearchOptions): Effect.Effect<ImageSearchResponseItem, ImagesError, never> =>
        Function.pipe(
            HttpClientRequest.get("/search"),
            maybeAddQueryParameter("term", Option.some(options.term)),
            maybeAddQueryParameter("limit", Option.fromNullable(options.limit)),
            maybeAddQueryParameter(
                "filters",
                Function.pipe(options.filters, Option.fromNullable, Option.map(JSON.stringify))
            ),
            ImageSearchResponseItemsClient,
            Effect.mapError((cause) => new ImagesError({ method: "search", cause })),
            Effect.scoped
        );

    const prune_ = (options?: ImagePruneOptions | undefined): Effect.Effect<ImagePruneResponse, ImagesError, never> =>
        Function.pipe(
            HttpClientRequest.post("/prune"),
            maybeAddQueryParameter(
                "filters",
                Function.pipe(options?.filters, Option.fromNullable, Option.map(JSON.stringify))
            ),
            ImagePruneResponseClient,
            Effect.mapError((cause) => new ImagesError({ method: "prune", cause })),
            Effect.scoped
        );

    const commit_ = (options: ImageCommitOptions): Effect.Effect<Readonly<IDResponse>, ImagesError, never> =>
        Function.pipe(
            HttpClientRequest.post("/commit"),
            maybeAddQueryParameter("container", Option.fromNullable(options.container)),
            maybeAddQueryParameter("repo", Option.fromNullable(options.repo)),
            maybeAddQueryParameter("tag", Option.fromNullable(options.tag)),
            maybeAddQueryParameter("comment", Option.fromNullable(options.comment)),
            maybeAddQueryParameter("author", Option.fromNullable(options.author)),
            maybeAddQueryParameter("pause", Option.fromNullable(options.pause)),
            maybeAddQueryParameter("changes", Option.fromNullable(options.changes)),
            HttpClientRequest.schemaBody(ContainerConfig)(options.containerConfig),
            Effect.flatMap(IdResponseClient),
            Effect.mapError((cause) => new ImagesError({ method: "commit", cause })),
            Effect.scoped
        );

    const get_ = (options: ImageGetOptions): Stream.Stream<string, ImagesError, never> =>
        Function.pipe(
            HttpClientRequest.get(`/${encodeURIComponent(options.name)}/get`),
            client,
            HttpClientResponse.stream,
            Stream.decodeText("utf8"),
            Stream.mapError((cause) => new ImagesError({ method: "get", cause }))
        );

    const getall_ = (options?: ImageGetAllOptions | undefined): Stream.Stream<string, ImagesError, never> =>
        Function.pipe(
            HttpClientRequest.get("/get"),
            maybeAddQueryParameter("names", Option.fromNullable(options?.names)),
            client,
            HttpClientResponse.stream,
            Stream.decodeText("utf8"),
            Stream.mapError((cause) => new ImagesError({ method: "getall", cause }))
        );

    const load_ = <E1>(options: ImageLoadOptions<E1>): Effect.Effect<void, ImagesError, never> =>
        Function.pipe(
            HttpClientRequest.post("/load"),
            maybeAddQueryParameter("quiet", Option.fromNullable(options?.quiet)),
            HttpClientRequest.streamBody(options.imagesTarball),
            voidClient,
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
});

/**
 * Images service
 *
 * @since 1.0.0
 * @category Tags
 */
export class Images extends Effect.Tag("@the-moby-effect/endpoints/Images")<Images, ImagesImpl>() {}

/**
 * Configs layer that depends on the MobyConnectionAgent
 *
 * @since 1.0.0
 * @category Layers
 */
export const layer: Layer.Layer<Images, never, HttpClient.HttpClient.Default> = Layer.effect(Images, make);
