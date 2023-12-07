import * as NodeHttp from "@effect/platform-node/HttpClient";
import * as Schema from "@effect/schema/Schema";
import { Data, Effect, Stream } from "effect";

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
    BuildPruneResponse,
    BuildPruneResponseSchema,
    ContainerConfig,
    HistoryResponseItem,
    HistoryResponseItemSchema,
    IdResponse,
    IdResponseSchema,
    ImageDeleteResponseItem,
    ImageDeleteResponseItemSchema,
    ImageInspect,
    ImageInspectSchema,
    ImagePruneResponse,
    ImagePruneResponseSchema,
    ImageSearchResponseItem,
    ImageSearchResponseItemSchema,
    ImageSummary,
    ImageSummarySchema,
} from "./schemas.js";

export class buildPruneError extends Data.TaggedError("buildPruneError")<{ message: string }> {}
export class imageBuildError extends Data.TaggedError("imageBuildError")<{ message: string }> {}
export class imageCommitError extends Data.TaggedError("imageCommitError")<{ message: string }> {}
export class imageCreateError extends Data.TaggedError("imageCreateError")<{ message: string }> {}
export class imageDeleteError extends Data.TaggedError("imageDeleteError")<{ message: string }> {}
export class imageGetError extends Data.TaggedError("imageGetError")<{ message: string }> {}
export class imageGetAllError extends Data.TaggedError("imageGetAllError")<{ message: string }> {}
export class imageHistoryError extends Data.TaggedError("imageHistoryError")<{ message: string }> {}
export class imageInspectError extends Data.TaggedError("imageInspectError")<{ message: string }> {}
export class imageListError extends Data.TaggedError("imageListError")<{ message: string }> {}
export class imageLoadError extends Data.TaggedError("imageLoadError")<{ message: string }> {}
export class imagePruneError extends Data.TaggedError("imagePruneError")<{ message: string }> {}
export class imagePushError extends Data.TaggedError("imagePushError")<{ message: string }> {}
export class imageSearchError extends Data.TaggedError("imageSearchError")<{ message: string }> {}
export class imageTagError extends Data.TaggedError("imageTagError")<{ message: string }> {}

export interface buildPruneOptions {
    /** Amount of disk space in bytes to keep for cache */
    keep_storage?: number;
    /** Remove all types of build cache */
    all?: boolean;
    /**
     * A JSON encoded value of the filters (a `map[string][]string`) to process
     * on the list of build cache objects. Available filters:
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
    filters?: string;
}

export interface imageBuildOptions {
    /**
     * A tar archive compressed with one of the following algorithms: identity
     * (no compression), gzip, bzip2, xz.
     */
    body?: unknown;
    /**
     * Path within the build context to the `Dockerfile`. This is ignored if
     * `remote` is specified and points to an external `Dockerfile`.
     */
    dockerfile?: string;
    /**
     * A name and optional tag to apply to the image in the `name:tag` format.
     * If you omit the tag the default `latest` value is assumed. You can
     * provide several `t` parameters.
     */
    t?: string;
    /** Extra hosts to add to /etc/hosts */
    extrahosts?: string;
    /**
     * A Git repository URI or HTTP/HTTPS context URI. If the URI points to a
     * single text file, the file’s contents are placed into a file called
     * `Dockerfile` and the image is built from that file. If the URI points to
     * a tarball, the file is downloaded by the daemon and the contents therein
     * used as the context for the build. If the URI points to a tarball and the
     * `dockerfile` parameter is also specified, there must be a file with the
     * corresponding path inside the tarball.
     */
    remote?: string;
    /** Suppress verbose build output. */
    q?: boolean;
    /** Do not use the cache when building the image. */
    nocache?: boolean;
    /** JSON array of images used for build cache resolution. */
    cachefrom?: string;
    /** Attempt to pull the image even if an older image exists locally. */
    pull?: string;
    /** Remove intermediate containers after a successful build. */
    rm?: boolean;
    /** Always remove intermediate containers, even upon failure. */
    forcerm?: boolean;
    /** Set memory limit for build. */
    memory?: number;
    /** Total memory (memory + swap). Set as `-1` to disable swap. */
    memswap?: number;
    /** CPU shares (relative weight). */
    cpushares?: number;
    /** CPUs in which to allow execution (e.g., `0-3`, `0,1`). */
    cpusetcpus?: string;
    /** The length of a CPU period in microseconds. */
    cpuperiod?: number;
    /** Microseconds of CPU time that the container can get in a CPU period. */
    cpuquota?: number;
    /**
     * JSON map of string pairs for build-time variables. Users pass these
     * values at build-time. Docker uses the buildargs as the environment
     * context for commands run via the `Dockerfile` RUN instruction, or for
     * variable expansion in other `Dockerfile` instructions. This is not meant
     * for passing secret values. For example, the build arg `FOO=bar` would
     * become `{\"FOO\":\"bar\"}` in JSON. This would result in the query
     * parameter `buildargs={\"FOO\":\"bar\"}`. Note that `{\"FOO\":\"bar\"}`
     * should be URI component encoded. [Read more about the buildargs
     * instruction.](https://docs.docker.com/engine/reference/builder/#arg)
     */
    buildargs?: string;
    /**
     * Size of `/dev/shm` in bytes. The size must be greater than 0. If omitted
     * the system uses 64MB.
     */
    shmsize?: number;
    /**
     * Squash the resulting images layers into a single layer. _(Experimental
     * release only.)_
     */
    squash?: boolean;
    /**
     * Arbitrary key/value labels to set on the image, as a JSON map of string
     * pairs.
     */
    labels?: string;
    /**
     * Sets the networking mode for the run commands during build. Supported
     * standard values are: `bridge`, `host`, `none`, and `container:<name|id>`.
     * Any other value is taken as a custom network's name or ID to which this
     * container should connect to.
     */
    networkmode?: string;
    Content_type?: string;
    /**
     * This is a base64-encoded JSON object with auth configurations for
     * multiple registries that a build may refer to. The key is a registry URL,
     * and the value is an auth configuration object, [as described in the
     * authentication section](#section/Authentication). For example: `{
     * \"docker.example.com\": { \"username\": \"janedoe\", \"password\":
     * \"hunter2\" }, \"https://index.docker.io/v1/\": { \"username\":
     * \"mobydock\", \"password\": \"conta1n3rize14\" } }` Only the registry
     * domain name (and port if not the default 443) are required. However, for
     * legacy reasons, the Docker Hub registry must be specified with both a
     * `https://` prefix and a `/v1/` suffix even though Docker will prefer to
     * use the v2 registry API.
     */
    X_Registry_Config?: string;
    /** Platform in the format os[/arch[/variant]] */
    platform?: string;
    /** Target build stage */
    target?: string;
    /** BuildKit output configuration */
    outputs?: string;
}

export interface imageCommitOptions {
    /** The container configuration */
    body?: ContainerConfig;
    /** The ID or name of the container to commit */
    container?: string;
    /** Repository name for the created image */
    repo?: string;
    /** Tag name for the create image */
    tag?: string;
    /** Commit message */
    comment?: string;
    /** Author of the image (e.g., `John Hannibal Smith <hannibal@a-team.com>`) */
    author?: string;
    /** Whether to pause the container before committing */
    pause?: boolean;
    /** `Dockerfile` instructions to apply while committing */
    changes?: string;
}

export interface imageCreateOptions {
    /**
     * Image content if the value `-` has been specified in fromSrc query
     * parameter
     */
    body?: string;
    /**
     * Name of the image to pull. The name may include a tag or digest. This
     * parameter may only be used when pulling an image. The pull is cancelled
     * if the HTTP connection is closed.
     */
    fromImage?: string;
    /**
     * Source to import. The value may be a URL from which the image can be
     * retrieved or `-` to read the image from the request body. This parameter
     * may only be used when importing an image.
     */
    fromSrc?: string;
    /**
     * Repository name given to an image when it is imported. The repo may
     * include a tag. This parameter may only be used when importing an image.
     */
    repo?: string;
    /**
     * Tag or digest. If empty when pulling an image, this causes all tags for
     * the given image to be pulled.
     */
    tag?: string;
    /** Set commit message for imported image. */
    message?: string;
    /**
     * A base64url-encoded auth configuration. Refer to the [authentication
     * section](#section/Authentication) for details.
     */
    X_Registry_Auth?: string;
    /**
     * Apply `Dockerfile` instructions to the image that is created, for
     * example: `changes=ENV DEBUG=true`. Note that `ENV DEBUG=true` should be
     * URI component encoded. Supported `Dockerfile` instructions:
     * `CMD`|`ENTRYPOINT`|`ENV`|`EXPOSE`|`ONBUILD`|`USER`|`VOLUME`|`WORKDIR`
     */
    changes?: Array<string>;
    /**
     * Platform in the format os[/arch[/variant]]. When used in combination with
     * the `fromImage` option, the daemon checks if the given image is present
     * in the local image cache with the given OS and Architecture, and
     * otherwise attempts to pull the image. If the option is not set, the
     * host's native OS and Architecture are used. If the given image does not
     * exist in the local image cache, the daemon attempts to pull the image
     * with the host's native OS and Architecture. If the given image does
     * exists in the local image cache, but its OS or architecture does not
     * match, a warning is produced. When used with the `fromSrc` option to
     * import an image from an archive, this option sets the platform
     * information for the imported image. If the option is not set, the host's
     * native OS and Architecture are used for the imported image.
     */
    platform?: string;
}

export interface imageDeleteOptions {
    /** Image name or ID */
    name: string;
    /**
     * Remove the image even if it is being used by stopped containers or has
     * other tags
     */
    force?: boolean;
    /** Do not delete untagged parent images */
    noprune?: boolean;
}

export interface imageGetOptions {
    /** Image name or ID */
    name: string;
}

export interface imageGetAllOptions {
    /** Image names to filter by */
    names?: Array<string>;
}

export interface imageHistoryOptions {
    /** Image name or ID */
    name: string;
}

export interface imageInspectOptions {
    /** Image name or id */
    name: string;
}

export interface imageListOptions {
    /**
     * Show all images. Only images from a final layer (no children) are shown
     * by default.
     */
    all?: boolean;
    /**
     * A JSON encoded value of the filters (a `map[string][]string`) to process
     * on the images list. Available filters:
     *
     * - `before`=(`<image-name>[:<tag>]`, `<image id>` or `<image@digest>`) -
     *   `dangling=true`
     * - `label=key` or `label=\"key=value\"` of an image label
     * - `reference`=(`<image-name>[:<tag>]`) - `since`=(`<image-name>[:<tag>]`,
     *   `<image id>` or `<image@digest>`)
     */
    filters?: string;
    /** Compute and show shared size as a `SharedSize` field on each image. */
    shared_size?: boolean;
    /** Show digest information as a `RepoDigests` field on each image. */
    digests?: boolean;
}

export interface imageLoadOptions {
    /** Tar archive containing images */
    body?: unknown;
    /** Suppress progress details during load. */
    quiet?: boolean;
}

export interface imagePruneOptions {
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
    filters?: string;
}

export interface imagePushOptions {
    /** Image name or ID. */
    name: string;
    /**
     * A base64url-encoded auth configuration. Refer to the [authentication
     * section](#section/Authentication) for details.
     */
    X_Registry_Auth: string;
    /** The tag to associate with the image on the registry. */
    tag?: string;
}

export interface imageSearchOptions {
    /** Term to search */
    term: string;
    /** Maximum number of results to return */
    limit?: number;
    /**
     * A JSON encoded value of the filters (a `map[string][]string`) to process
     * on the images list. Available filters:
     *
     * - `is-automated=(true|false)`
     * - `is-official=(true|false)`
     * - `stars=<number>` Matches images that has at least 'number' stars.
     */
    filters?: string;
}

export interface imageTagOptions {
    /** Image name or ID to tag. */
    name: string;
    /** The repository to tag in. For example, `someuser/someimage`. */
    repo?: string;
    /** The name of the new tag. */
    tag?: string;
}

/**
 * Delete builder cache
 *
 * @param keep_storage - Amount of disk space in bytes to keep for cache
 * @param all - Remove all types of build cache
 * @param filters - A JSON encoded value of the filters (a
 *   `map[string][]string`) to process on the list of build cache objects.
 *   Available filters:
 *
 *   - `until=<timestamp>` remove cache older than `<timestamp>`. The `<timestamp>`
 *       can be Unix timestamps, date formatted timestamps, or Go duration
 *       strings (e.g. `10m`, `1h30m`) computed relative to the daemon's local
 *       time.
 *   - `id=<id>`
 *   - `parent=<id>`
 *   - `type=<string>`
 *   - `description=<string>`
 *   - `inuse`
 *   - `shared`
 *   - `private`
 */
export const buildPrune = (
    options: buildPruneOptions
): Effect.Effect<IMobyConnectionAgent, buildPruneError, Readonly<BuildPruneResponse>> =>
    Effect.gen(function* (_: Effect.Adapter) {
        const endpoint: string = "/build/prune";
        const method: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" = "POST";
        const sanitizedEndpoint: string = endpoint;

        const agent: IMobyConnectionAgent = yield* _(MobyConnectionAgent);
        const client: NodeHttp.client.Client.Default = yield* _(
            NodeHttp.nodeClient.make.pipe(Effect.provideService(NodeHttp.nodeClient.HttpAgent, agent))
        );

        return NodeHttp.request
            .make(method)(sanitizedEndpoint)
            .pipe(NodeHttp.request.prependUrl("http://0.0.0.0"))
            .pipe(addQueryParameter("keep-storage", options.keep_storage))
            .pipe(addQueryParameter("all", options.all))
            .pipe(addQueryParameter("filters", options.filters))
            .pipe(client.pipe(NodeHttp.client.filterStatusOk))
            .pipe(Effect.flatMap(NodeHttp.response.schemaBodyJson(BuildPruneResponseSchema)))
            .pipe(errorHandler(buildPruneError));
    }).pipe(Effect.flatten);

/**
 * Build an image from a tar archive with a `Dockerfile` in it. The `Dockerfile`
 * specifies how the image is built from the tar archive. It is typically in the
 * archive's root, but can be at a different path or have a different name by
 * specifying the `dockerfile` parameter. [See the `Dockerfile` reference for
 * more information](https://docs.docker.com/engine/reference/builder/). The
 * Docker daemon performs a preliminary validation of the `Dockerfile` before
 * starting the build, and returns an error if the syntax is incorrect. After
 * that, each instruction is run one-by-one until the ID of the new image is
 * output. The build is canceled if the client drops the connection by quitting
 * or being killed.
 *
 * @param body - A tar archive compressed with one of the following algorithms:
 *   identity (no compression), gzip, bzip2, xz.
 * @param dockerfile - Path within the build context to the `Dockerfile`. This
 *   is ignored if `remote` is specified and points to an external
 *   `Dockerfile`.
 * @param t - A name and optional tag to apply to the image in the `name:tag`
 *   format. If you omit the tag the default `latest` value is assumed. You can
 *   provide several `t` parameters.
 * @param extrahosts - Extra hosts to add to /etc/hosts
 * @param remote - A Git repository URI or HTTP/HTTPS context URI. If the URI
 *   points to a single text file, the file’s contents are placed into a file
 *   called `Dockerfile` and the image is built from that file. If the URI
 *   points to a tarball, the file is downloaded by the daemon and the contents
 *   therein used as the context for the build. If the URI points to a tarball
 *   and the `dockerfile` parameter is also specified, there must be a file with
 *   the corresponding path inside the tarball.
 * @param q - Suppress verbose build output.
 * @param nocache - Do not use the cache when building the image.
 * @param cachefrom - JSON array of images used for build cache resolution.
 * @param pull - Attempt to pull the image even if an older image exists
 *   locally.
 * @param rm - Remove intermediate containers after a successful build.
 * @param forcerm - Always remove intermediate containers, even upon failure.
 * @param memory - Set memory limit for build.
 * @param memswap - Total memory (memory + swap). Set as `-1` to disable swap.
 * @param cpushares - CPU shares (relative weight).
 * @param cpusetcpus - CPUs in which to allow execution (e.g., `0-3`, `0,1`).
 * @param cpuperiod - The length of a CPU period in microseconds.
 * @param cpuquota - Microseconds of CPU time that the container can get in a
 *   CPU period.
 * @param buildargs - JSON map of string pairs for build-time variables. Users
 *   pass these values at build-time. Docker uses the buildargs as the
 *   environment context for commands run via the `Dockerfile` RUN instruction,
 *   or for variable expansion in other `Dockerfile` instructions. This is not
 *   meant for passing secret values. For example, the build arg `FOO=bar` would
 *   become `{\"FOO\":\"bar\"}` in JSON. This would result in the query
 *   parameter `buildargs={\"FOO\":\"bar\"}`. Note that `{\"FOO\":\"bar\"}`
 *   should be URI component encoded. [Read more about the buildargs
 *   instruction.](https://docs.docker.com/engine/reference/builder/#arg)
 * @param shmsize - Size of `/dev/shm` in bytes. The size must be greater than
 *   0. If omitted the system uses 64MB.
 * @param squash - Squash the resulting images layers into a single layer.
 *   _(Experimental release only.)_
 * @param labels - Arbitrary key/value labels to set on the image, as a JSON map
 *   of string pairs.
 * @param networkmode - Sets the networking mode for the run commands during
 *   build. Supported standard values are: `bridge`, `host`, `none`, and
 *   `container:<name|id>`. Any other value is taken as a custom network's name
 *   or ID to which this container should connect to.
 * @param Content_type -
 * @param X_Registry_Config - This is a base64-encoded JSON object with auth
 *   configurations for multiple registries that a build may refer to. The key
 *   is a registry URL, and the value is an auth configuration object, [as
 *   described in the authentication section](#section/Authentication). For
 *   example: `{ \"docker.example.com\": { \"username\": \"janedoe\",
 *   \"password\": \"hunter2\" }, \"https://index.docker.io/v1/\": {
 *   \"username\": \"mobydock\", \"password\": \"conta1n3rize14\" } }` Only the
 *   registry domain name (and port if not the default 443) are required.
 *   However, for legacy reasons, the Docker Hub registry must be specified with
 *   both a `https://` prefix and a `/v1/` suffix even though Docker will prefer
 *   to use the v2 registry API.
 * @param platform - Platform in the format os[/arch[/variant]]
 * @param target - Target build stage
 * @param outputs - BuildKit output configuration
 */
export const imageBuild = (options: imageBuildOptions): Effect.Effect<IMobyConnectionAgent, imageBuildError, void> =>
    Effect.gen(function* (_: Effect.Adapter) {
        const endpoint: string = "/build";
        const method: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" = "POST";
        const sanitizedEndpoint: string = endpoint;

        const agent: IMobyConnectionAgent = yield* _(MobyConnectionAgent);
        const client: NodeHttp.client.Client.Default = yield* _(
            NodeHttp.nodeClient.make.pipe(Effect.provideService(NodeHttp.nodeClient.HttpAgent, agent))
        );

        return NodeHttp.request
            .make(method)(sanitizedEndpoint)
            .pipe(NodeHttp.request.prependUrl("http://0.0.0.0"))
            .pipe(addHeader("Content-type", String(options.Content_type)))
            .pipe(addHeader("X-Registry-Config", String(options.X_Registry_Config)))
            .pipe(addQueryParameter("dockerfile", options.dockerfile))
            .pipe(addQueryParameter("t", options.t))
            .pipe(addQueryParameter("extrahosts", options.extrahosts))
            .pipe(addQueryParameter("remote", options.remote))
            .pipe(addQueryParameter("q", options.q))
            .pipe(addQueryParameter("nocache", options.nocache))
            .pipe(addQueryParameter("cachefrom", options.cachefrom))
            .pipe(addQueryParameter("pull", options.pull))
            .pipe(addQueryParameter("rm", options.rm))
            .pipe(addQueryParameter("forcerm", options.forcerm))
            .pipe(addQueryParameter("memory", options.memory))
            .pipe(addQueryParameter("memswap", options.memswap))
            .pipe(addQueryParameter("cpushares", options.cpushares))
            .pipe(addQueryParameter("cpusetcpus", options.cpusetcpus))
            .pipe(addQueryParameter("cpuperiod", options.cpuperiod))
            .pipe(addQueryParameter("cpuquota", options.cpuquota))
            .pipe(addQueryParameter("buildargs", options.buildargs))
            .pipe(addQueryParameter("shmsize", options.shmsize))
            .pipe(addQueryParameter("squash", options.squash))
            .pipe(addQueryParameter("labels", options.labels))
            .pipe(addQueryParameter("networkmode", options.networkmode))
            .pipe(addQueryParameter("platform", options.platform))
            .pipe(addQueryParameter("target", options.target))
            .pipe(addQueryParameter("outputs", options.outputs))
            .pipe(addHeader("Content-Type", "application/octet-stream"))
            .pipe(setBody(options.body, "unknown"))
            .pipe(Effect.flatMap(client.pipe(NodeHttp.client.filterStatusOk)))
            .pipe(errorHandler(imageBuildError));
    }).pipe(Effect.flatten);

/**
 * Create a new image from a container
 *
 * @param body - The container configuration
 * @param container - The ID or name of the container to commit
 * @param repo - Repository name for the created image
 * @param tag - Tag name for the create image
 * @param comment - Commit message
 * @param author - Author of the image (e.g., `John Hannibal Smith
 *   <hannibal@a-team.com>`)
 * @param pause - Whether to pause the container before committing
 * @param changes - `Dockerfile` instructions to apply while committing
 */
export const imageCommit = (
    options: imageCommitOptions
): Effect.Effect<IMobyConnectionAgent, imageCommitError, Readonly<IdResponse>> =>
    Effect.gen(function* (_: Effect.Adapter) {
        const endpoint: string = "/commit";
        const method: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" = "POST";
        const sanitizedEndpoint: string = endpoint;

        const agent: IMobyConnectionAgent = yield* _(MobyConnectionAgent);
        const client: NodeHttp.client.Client.Default = yield* _(
            NodeHttp.nodeClient.make.pipe(Effect.provideService(NodeHttp.nodeClient.HttpAgent, agent))
        );

        return NodeHttp.request
            .make(method)(sanitizedEndpoint)
            .pipe(NodeHttp.request.prependUrl("http://0.0.0.0"))
            .pipe(addQueryParameter("container", options.container))
            .pipe(addQueryParameter("repo", options.repo))
            .pipe(addQueryParameter("tag", options.tag))
            .pipe(addQueryParameter("comment", options.comment))
            .pipe(addQueryParameter("author", options.author))
            .pipe(addQueryParameter("pause", options.pause))
            .pipe(addQueryParameter("changes", options.changes))
            .pipe(addHeader("Content-Type", "application/json"))
            .pipe(setBody(options.body, "ContainerConfig"))
            .pipe(Effect.flatMap(client.pipe(NodeHttp.client.filterStatusOk)))
            .pipe(Effect.flatMap(NodeHttp.response.schemaBodyJson(IdResponseSchema)))
            .pipe(errorHandler(imageCommitError));
    }).pipe(Effect.flatten);

/**
 * Create an image by either pulling it from a registry or importing it.
 *
 * @param body - Image content if the value `-` has been specified in fromSrc
 *   query parameter
 * @param fromImage - Name of the image to pull. The name may include a tag or
 *   digest. This parameter may only be used when pulling an image. The pull is
 *   cancelled if the HTTP connection is closed.
 * @param fromSrc - Source to import. The value may be a URL from which the
 *   image can be retrieved or `-` to read the image from the request body. This
 *   parameter may only be used when importing an image.
 * @param repo - Repository name given to an image when it is imported. The repo
 *   may include a tag. This parameter may only be used when importing an
 *   image.
 * @param tag - Tag or digest. If empty when pulling an image, this causes all
 *   tags for the given image to be pulled.
 * @param message - Set commit message for imported image.
 * @param X_Registry_Auth - A base64url-encoded auth configuration. Refer to the
 *   [authentication section](#section/Authentication) for details.
 * @param changes - Apply `Dockerfile` instructions to the image that is
 *   created, for example: `changes=ENV DEBUG=true`. Note that `ENV DEBUG=true`
 *   should be URI component encoded. Supported `Dockerfile` instructions:
 *   `CMD`|`ENTRYPOINT`|`ENV`|`EXPOSE`|`ONBUILD`|`USER`|`VOLUME`|`WORKDIR`
 * @param platform - Platform in the format os[/arch[/variant]]. When used in
 *   combination with the `fromImage` option, the daemon checks if the given
 *   image is present in the local image cache with the given OS and
 *   Architecture, and otherwise attempts to pull the image. If the option is
 *   not set, the host's native OS and Architecture are used. If the given image
 *   does not exist in the local image cache, the daemon attempts to pull the
 *   image with the host's native OS and Architecture. If the given image does
 *   exists in the local image cache, but its OS or architecture does not match,
 *   a warning is produced. When used with the `fromSrc` option to import an
 *   image from an archive, this option sets the platform information for the
 *   imported image. If the option is not set, the host's native OS and
 *   Architecture are used for the imported image.
 */
export const imageCreate = (
    options: imageCreateOptions
): Effect.Effect<IMobyConnectionAgent, imageCreateError, Stream.Stream<never, NodeHttp.error.ResponseError, string>> =>
    Effect.gen(function* (_: Effect.Adapter) {
        const endpoint: string = "/images/create";
        const method: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" = "POST";
        const sanitizedEndpoint: string = endpoint;

        const agent: IMobyConnectionAgent = yield* _(MobyConnectionAgent);
        const client: NodeHttp.client.Client.Default = yield* _(
            NodeHttp.nodeClient.make.pipe(Effect.provideService(NodeHttp.nodeClient.HttpAgent, agent))
        );

        return NodeHttp.request
            .make(method)(sanitizedEndpoint)
            .pipe(NodeHttp.request.prependUrl("http://0.0.0.0"))
            .pipe(addHeader("X-Registry-Auth", String(options.X_Registry_Auth)))
            .pipe(addQueryParameter("fromImage", options.fromImage))
            .pipe(addQueryParameter("fromSrc", options.fromSrc))
            .pipe(addQueryParameter("repo", options.repo))
            .pipe(addQueryParameter("tag", options.tag))
            .pipe(addQueryParameter("message", options.message))
            .pipe(addQueryParameter("changes", options.changes?.join(",")))
            .pipe(addQueryParameter("platform", options.platform))
            .pipe(addHeader("Content-Type", "text/plain"))
            .pipe(setBody(options.body, "string"))
            .pipe(Effect.flatMap(client.pipe(NodeHttp.client.filterStatusOk)))
            .pipe(Effect.map((response) => response.stream))
            .pipe(Effect.map(Stream.decodeText("utf8")))
            .pipe(errorHandler(imageCreateError));
    }).pipe(Effect.flatten);

/**
 * Remove an image, along with any untagged parent images that were referenced
 * by that image. Images can't be removed if they have descendant images, are
 * being used by a running container or are being used by a build.
 *
 * @param name - Image name or ID
 * @param force - Remove the image even if it is being used by stopped
 *   containers or has other tags
 * @param noprune - Do not delete untagged parent images
 */
export const imageDelete = (
    options: imageDeleteOptions
): Effect.Effect<IMobyConnectionAgent, imageDeleteError, Readonly<Array<ImageDeleteResponseItem>>> =>
    Effect.gen(function* (_: Effect.Adapter) {
        if (options.name === null || options.name === undefined) {
            yield* _(new imageDeleteError({ message: "Required parameter name was null or undefined" }));
        }

        const endpoint: string = "/images/{name}";
        const method: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" = "DELETE";
        const sanitizedEndpoint: string = endpoint.replace(`{${"name"}}`, encodeURIComponent(String(options.name)));

        const agent: IMobyConnectionAgent = yield* _(MobyConnectionAgent);
        const client: NodeHttp.client.Client.Default = yield* _(
            NodeHttp.nodeClient.make.pipe(Effect.provideService(NodeHttp.nodeClient.HttpAgent, agent))
        );

        return NodeHttp.request
            .make(method)(sanitizedEndpoint)
            .pipe(NodeHttp.request.prependUrl("http://0.0.0.0"))
            .pipe(addQueryParameter("force", options.force))
            .pipe(addQueryParameter("noprune", options.noprune))
            .pipe(client.pipe(NodeHttp.client.filterStatusOk))
            .pipe(Effect.flatMap(NodeHttp.response.schemaBodyJson(Schema.array(ImageDeleteResponseItemSchema))))
            .pipe(errorHandler(imageDeleteError));
    }).pipe(Effect.flatten);

/**
 * Get a tarball containing all images and metadata for a repository. If `name`
 * is a specific name and tag (e.g. `ubuntu:latest`), then only that image (and
 * its parents) are returned. If `name` is an image ID, similarly only that
 * image (and its parents) are returned, but with the exclusion of the
 * `repositories` file in the tarball, as there were no image names referenced.
 *
 * ### Image tarball format An image tarball contains one directory per image
 *
 * Layer (named using its long ID), each containing these files:
 *
 * - `VERSION`: currently `1.0`
 * - The file format version - `json`: detailed layer information, similar to
 *   `docker inspect layer_id`
 * - `layer.tar`: A tarfile containing the filesystem changes in this layer The
 *   `layer.tar` file contains `aufs` style `.wh..wh.aufs` files and directories
 *   for storing attribute changes and deletions. If the tarball defines a
 *   repository, the tarball should also include a `repositories` file at the
 *   root that contains a list of repository and tag names mapped to layer IDs.
 *   `json { \"hello-world\": { \"latest\":
 *   \"565a9d68a73f6706862bfe8409a7f659776d4d60a8d096eb4a3cbce6999cc2a1\" } } `
 *
 * @param name - Image name or ID
 */
export const imageGet = (
    options: imageGetOptions
): Effect.Effect<IMobyConnectionAgent, imageGetError, Readonly<Blob>> =>
    Effect.gen(function* (_: Effect.Adapter) {
        if (options.name === null || options.name === undefined) {
            yield* _(new imageGetError({ message: "Required parameter name was null or undefined" }));
        }

        const endpoint: string = "/images/{name}/get";
        const method: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" = "GET";
        const sanitizedEndpoint: string = endpoint.replace(`{${"name"}}`, encodeURIComponent(String(options.name)));

        const agent: IMobyConnectionAgent = yield* _(MobyConnectionAgent);
        const client: NodeHttp.client.Client.Default = yield* _(
            NodeHttp.nodeClient.make.pipe(Effect.provideService(NodeHttp.nodeClient.HttpAgent, agent))
        );

        return NodeHttp.request
            .make(method)(sanitizedEndpoint)
            .pipe(NodeHttp.request.prependUrl("http://0.0.0.0"))
            .pipe(client.pipe(NodeHttp.client.filterStatusOk))
            .pipe(Effect.flatMap((clientResponse) => clientResponse.text))
            .pipe(Effect.map((responseText) => new Blob([responseText])))
            .pipe(errorHandler(imageGetError));
    }).pipe(Effect.flatten);

/**
 * Get a tarball containing all images and metadata for several image
 * repositories. For each value of the `names` parameter: if it is a specific
 * name and tag (e.g. `ubuntu:latest`), then only that image (and its parents)
 * are returned; if it is an image ID, similarly only that image (and its
 * parents) are returned and there would be no names referenced in the
 * 'repositories' file for this image ID. For details on the format, see the
 * [export image endpoint](#operation/ImageGet).
 *
 * @param names - Image names to filter by
 */
export const imageGetAll = (
    options: imageGetAllOptions
): Effect.Effect<IMobyConnectionAgent, imageGetAllError, Readonly<Blob>> =>
    Effect.gen(function* (_: Effect.Adapter) {
        const endpoint: string = "/images/get";
        const method: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" = "GET";
        const sanitizedEndpoint: string = endpoint;

        const agent: IMobyConnectionAgent = yield* _(MobyConnectionAgent);
        const client: NodeHttp.client.Client.Default = yield* _(
            NodeHttp.nodeClient.make.pipe(Effect.provideService(NodeHttp.nodeClient.HttpAgent, agent))
        );

        return NodeHttp.request
            .make(method)(sanitizedEndpoint)
            .pipe(NodeHttp.request.prependUrl("http://0.0.0.0"))
            .pipe(addQueryParameter("names", options.names?.join(",")))
            .pipe(client.pipe(NodeHttp.client.filterStatusOk))
            .pipe(Effect.flatMap((clientResponse) => clientResponse.text))
            .pipe(Effect.map((responseText) => new Blob([responseText])))
            .pipe(errorHandler(imageGetAllError));
    }).pipe(Effect.flatten);

/**
 * Return parent layers of an image.
 *
 * @param name - Image name or ID
 */
export const imageHistory = (
    options: imageHistoryOptions
): Effect.Effect<IMobyConnectionAgent, imageHistoryError, Readonly<Array<HistoryResponseItem>>> =>
    Effect.gen(function* (_: Effect.Adapter) {
        if (options.name === null || options.name === undefined) {
            yield* _(new imageHistoryError({ message: "Required parameter name was null or undefined" }));
        }

        const endpoint: string = "/images/{name}/history";
        const method: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" = "GET";
        const sanitizedEndpoint: string = endpoint.replace(`{${"name"}}`, encodeURIComponent(String(options.name)));

        const agent: IMobyConnectionAgent = yield* _(MobyConnectionAgent);
        const client: NodeHttp.client.Client.Default = yield* _(
            NodeHttp.nodeClient.make.pipe(Effect.provideService(NodeHttp.nodeClient.HttpAgent, agent))
        );

        return NodeHttp.request
            .make(method)(sanitizedEndpoint)
            .pipe(NodeHttp.request.prependUrl("http://0.0.0.0"))
            .pipe(client.pipe(NodeHttp.client.filterStatusOk))
            .pipe(Effect.flatMap(NodeHttp.response.schemaBodyJson(Schema.array(HistoryResponseItemSchema))))
            .pipe(errorHandler(imageHistoryError));
    }).pipe(Effect.flatten);

/**
 * Return low-level information about an image.
 *
 * @param name - Image name or id
 */
export const imageInspect = (
    options: imageInspectOptions
): Effect.Effect<IMobyConnectionAgent, imageInspectError, Readonly<ImageInspect>> =>
    Effect.gen(function* (_: Effect.Adapter) {
        if (options.name === null || options.name === undefined) {
            yield* _(new imageInspectError({ message: "Required parameter name was null or undefined" }));
        }

        const endpoint: string = "/images/{name}/json";
        const method: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" = "GET";
        const sanitizedEndpoint: string = endpoint.replace(`{${"name"}}`, encodeURIComponent(String(options.name)));

        const agent: IMobyConnectionAgent = yield* _(MobyConnectionAgent);
        const client: NodeHttp.client.Client.Default = yield* _(
            NodeHttp.nodeClient.make.pipe(Effect.provideService(NodeHttp.nodeClient.HttpAgent, agent))
        );

        return NodeHttp.request
            .make(method)(sanitizedEndpoint)
            .pipe(NodeHttp.request.prependUrl("http://0.0.0.0"))
            .pipe(client.pipe(NodeHttp.client.filterStatusOk))
            .pipe(Effect.flatMap(NodeHttp.response.schemaBodyJson(ImageInspectSchema)))
            .pipe(errorHandler(imageInspectError));
    }).pipe(Effect.flatten);

/**
 * Returns a list of images on the server. Note that it uses a different,
 * smaller representation of an image than inspecting a single image.
 *
 * @param all - Show all images. Only images from a final layer (no children)
 *   are shown by default.
 * @param filters - A JSON encoded value of the filters (a
 *   `map[string][]string`) to process on the images list. Available filters:
 *
 *   - `before`=(`<image-name>[:<tag>]`, `<image id>` or `<image@digest>`)
 *   - `dangling=true`
 *   - `label=key` or `label=\"key=value\"` of an image label
 *   - `reference`=(`<image-name>[:<tag>]`)
 *   - `since`=(`<image-name>[:<tag>]`, `<image id>` or `<image@digest>`)
 *
 * @param shared_size - Compute and show shared size as a `SharedSize` field on
 *   each image.
 * @param digests - Show digest information as a `RepoDigests` field on each
 *   image.
 */
export const imageList = (
    options: imageListOptions
): Effect.Effect<IMobyConnectionAgent, imageListError, Readonly<Array<ImageSummary>>> =>
    Effect.gen(function* (_: Effect.Adapter) {
        const endpoint: string = "/images/json";
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
            .pipe(addQueryParameter("filters", options.filters))
            .pipe(addQueryParameter("shared-size", options.shared_size))
            .pipe(addQueryParameter("digests", options.digests))
            .pipe(client.pipe(NodeHttp.client.filterStatusOk))
            .pipe(Effect.flatMap(NodeHttp.response.schemaBodyJson(Schema.array(ImageSummarySchema))))
            .pipe(errorHandler(imageListError));
    }).pipe(Effect.flatten);

/**
 * Load a set of images and tags into a repository. For details on the format,
 * see the [export image endpoint](#operation/ImageGet).
 *
 * @param body - Tar archive containing images
 * @param quiet - Suppress progress details during load.
 */
export const imageLoad = (options: imageLoadOptions): Effect.Effect<IMobyConnectionAgent, imageLoadError, void> =>
    Effect.gen(function* (_: Effect.Adapter) {
        const endpoint: string = "/images/load";
        const method: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" = "POST";
        const sanitizedEndpoint: string = endpoint;

        const agent: IMobyConnectionAgent = yield* _(MobyConnectionAgent);
        const client: NodeHttp.client.Client.Default = yield* _(
            NodeHttp.nodeClient.make.pipe(Effect.provideService(NodeHttp.nodeClient.HttpAgent, agent))
        );

        return NodeHttp.request
            .make(method)(sanitizedEndpoint)
            .pipe(NodeHttp.request.prependUrl("http://0.0.0.0"))
            .pipe(addQueryParameter("quiet", options.quiet))
            .pipe(addHeader("Content-Type", "application/x-tar"))
            .pipe(setBody(options.body, "unknown"))
            .pipe(Effect.flatMap(client.pipe(NodeHttp.client.filterStatusOk)))
            .pipe(errorHandler(imageLoadError));
    }).pipe(Effect.flatten);

/**
 * Delete unused images
 *
 * @param filters - Filters to process on the prune list, encoded as JSON (a
 *   `map[string][]string`). Available filters:
 *
 *   - `dangling=<boolean>` When set to `true` (or `1`), prune only unused _and_
 *       untagged images. When set to `false` (or `0`), all unused images are
 *       pruned.
 *   - `until=<string>` Prune images created before this timestamp. The
 *       `<timestamp>` can be Unix timestamps, date formatted timestamps, or Go
 *       duration strings (e.g. `10m`, `1h30m`) computed relative to the daemon
 *       machine’s time.
 *   - `label` (`label=<key>`, `label=<key>=<value>`, `label!=<key>`, or
 *       `label!=<key>=<value>`) Prune images with (or without, in case
 *       `label!=...` is used) the specified labels.
 */
export const imagePrune = (
    options: imagePruneOptions
): Effect.Effect<IMobyConnectionAgent, imagePruneError, Readonly<ImagePruneResponse>> =>
    Effect.gen(function* (_: Effect.Adapter) {
        const endpoint: string = "/images/prune";
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
            .pipe(Effect.flatMap(NodeHttp.response.schemaBodyJson(ImagePruneResponseSchema)))
            .pipe(errorHandler(imagePruneError));
    }).pipe(Effect.flatten);

/**
 * Push an image to a registry. If you wish to push an image on to a private
 * registry, that image must already have a tag which references the registry.
 * For example, `registry.example.com/myimage:latest`. The push is cancelled if
 * the HTTP connection is closed.
 *
 * @param name - Image name or ID.
 * @param X_Registry_Auth - A base64url-encoded auth configuration. Refer to the
 *   [authentication section](#section/Authentication) for details.
 * @param tag - The tag to associate with the image on the registry.
 */
export const imagePush = (options: imagePushOptions): Effect.Effect<IMobyConnectionAgent, imagePushError, void> =>
    Effect.gen(function* (_: Effect.Adapter) {
        if (options.name === null || options.name === undefined) {
            yield* _(new imagePushError({ message: "Required parameter name was null or undefined" }));
        }

        if (options.X_Registry_Auth === null || options.X_Registry_Auth === undefined) {
            yield* _(new imagePushError({ message: "Required parameter X_Registry_Auth was null or undefined" }));
        }

        const endpoint: string = "/images/{name}/push";
        const method: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" = "POST";
        const sanitizedEndpoint: string = endpoint.replace(`{${"name"}}`, encodeURIComponent(String(options.name)));

        const agent: IMobyConnectionAgent = yield* _(MobyConnectionAgent);
        const client: NodeHttp.client.Client.Default = yield* _(
            NodeHttp.nodeClient.make.pipe(Effect.provideService(NodeHttp.nodeClient.HttpAgent, agent))
        );

        return NodeHttp.request
            .make(method)(sanitizedEndpoint)
            .pipe(NodeHttp.request.prependUrl("http://0.0.0.0"))
            .pipe(addHeader("X-Registry-Auth", String(options.X_Registry_Auth)))
            .pipe(addQueryParameter("tag", options.tag))
            .pipe(client.pipe(NodeHttp.client.filterStatusOk))
            .pipe(errorHandler(imagePushError));
    }).pipe(Effect.flatten);

/**
 * Search for an image on Docker Hub.
 *
 * @param term - Term to search
 * @param limit - Maximum number of results to return
 * @param filters - A JSON encoded value of the filters (a
 *   `map[string][]string`) to process on the images list. Available filters:
 *
 *   - `is-automated=(true|false)`
 *   - `is-official=(true|false)`
 *   - `stars=<number>` Matches images that has at least 'number' stars.
 */
export const imageSearch = (
    options: imageSearchOptions
): Effect.Effect<IMobyConnectionAgent, imageSearchError, Readonly<Array<ImageSearchResponseItem>>> =>
    Effect.gen(function* (_: Effect.Adapter) {
        if (options.term === null || options.term === undefined) {
            yield* _(new imageSearchError({ message: "Required parameter term was null or undefined" }));
        }

        const endpoint: string = "/images/search";
        const method: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" = "GET";
        const sanitizedEndpoint: string = endpoint;

        const agent: IMobyConnectionAgent = yield* _(MobyConnectionAgent);
        const client: NodeHttp.client.Client.Default = yield* _(
            NodeHttp.nodeClient.make.pipe(Effect.provideService(NodeHttp.nodeClient.HttpAgent, agent))
        );

        return NodeHttp.request
            .make(method)(sanitizedEndpoint)
            .pipe(NodeHttp.request.prependUrl("http://0.0.0.0"))
            .pipe(addQueryParameter("term", options.term))
            .pipe(addQueryParameter("limit", options.limit))
            .pipe(addQueryParameter("filters", options.filters))
            .pipe(client.pipe(NodeHttp.client.filterStatusOk))
            .pipe(Effect.flatMap(NodeHttp.response.schemaBodyJson(Schema.array(ImageSearchResponseItemSchema))))
            .pipe(errorHandler(imageSearchError));
    }).pipe(Effect.flatten);

/**
 * Tag an image so that it becomes part of a repository.
 *
 * @param name - Image name or ID to tag.
 * @param repo - The repository to tag in. For example, `someuser/someimage`.
 * @param tag - The name of the new tag.
 */
export const imageTag = (options: imageTagOptions): Effect.Effect<IMobyConnectionAgent, imageTagError, void> =>
    Effect.gen(function* (_: Effect.Adapter) {
        if (options.name === null || options.name === undefined) {
            yield* _(new imageTagError({ message: "Required parameter name was null or undefined" }));
        }

        const endpoint: string = "/images/{name}/tag";
        const method: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" = "POST";
        const sanitizedEndpoint: string = endpoint.replace(`{${"name"}}`, encodeURIComponent(String(options.name)));

        const agent: IMobyConnectionAgent = yield* _(MobyConnectionAgent);
        const client: NodeHttp.client.Client.Default = yield* _(
            NodeHttp.nodeClient.make.pipe(Effect.provideService(NodeHttp.nodeClient.HttpAgent, agent))
        );

        return NodeHttp.request
            .make(method)(sanitizedEndpoint)
            .pipe(NodeHttp.request.prependUrl("http://0.0.0.0"))
            .pipe(addQueryParameter("repo", options.repo))
            .pipe(addQueryParameter("tag", options.tag))
            .pipe(client.pipe(NodeHttp.client.filterStatusOk))
            .pipe(errorHandler(imageTagError));
    }).pipe(Effect.flatten);

/**
 * Delete builder cache
 *
 * @param keep_storage - Amount of disk space in bytes to keep for cache
 * @param all - Remove all types of build cache
 * @param filters - A JSON encoded value of the filters (a
 *   `map[string][]string`) to process on the list of build cache objects.
 *   Available filters:
 *
 *   - `until=<timestamp>` remove cache older than `<timestamp>`. The `<timestamp>`
 *       can be Unix timestamps, date formatted timestamps, or Go duration
 *       strings (e.g. `10m`, `1h30m`) computed relative to the daemon's local
 *       time.
 *   - `id=<id>`
 *   - `parent=<id>`
 *   - `type=<string>`
 *   - `description=<string>`
 *   - `inuse`
 *   - `shared`
 *   - `private`
 */
export type buildPruneWithConnectionAgentProvided = WithConnectionAgentProvided<typeof buildPrune>;

/**
 * Build an image from a tar archive with a `Dockerfile` in it. The `Dockerfile`
 * specifies how the image is built from the tar archive. It is typically in the
 * archive's root, but can be at a different path or have a different name by
 * specifying the `dockerfile` parameter. [See the `Dockerfile` reference for
 * more information](https://docs.docker.com/engine/reference/builder/). The
 * Docker daemon performs a preliminary validation of the `Dockerfile` before
 * starting the build, and returns an error if the syntax is incorrect. After
 * that, each instruction is run one-by-one until the ID of the new image is
 * output. The build is canceled if the client drops the connection by quitting
 * or being killed.
 *
 * @param body - A tar archive compressed with one of the following algorithms:
 *   identity (no compression), gzip, bzip2, xz.
 * @param dockerfile - Path within the build context to the `Dockerfile`. This
 *   is ignored if `remote` is specified and points to an external
 *   `Dockerfile`.
 * @param t - A name and optional tag to apply to the image in the `name:tag`
 *   format. If you omit the tag the default `latest` value is assumed. You can
 *   provide several `t` parameters.
 * @param extrahosts - Extra hosts to add to /etc/hosts
 * @param remote - A Git repository URI or HTTP/HTTPS context URI. If the URI
 *   points to a single text file, the file’s contents are placed into a file
 *   called `Dockerfile` and the image is built from that file. If the URI
 *   points to a tarball, the file is downloaded by the daemon and the contents
 *   therein used as the context for the build. If the URI points to a tarball
 *   and the `dockerfile` parameter is also specified, there must be a file with
 *   the corresponding path inside the tarball.
 * @param q - Suppress verbose build output.
 * @param nocache - Do not use the cache when building the image.
 * @param cachefrom - JSON array of images used for build cache resolution.
 * @param pull - Attempt to pull the image even if an older image exists
 *   locally.
 * @param rm - Remove intermediate containers after a successful build.
 * @param forcerm - Always remove intermediate containers, even upon failure.
 * @param memory - Set memory limit for build.
 * @param memswap - Total memory (memory + swap). Set as `-1` to disable swap.
 * @param cpushares - CPU shares (relative weight).
 * @param cpusetcpus - CPUs in which to allow execution (e.g., `0-3`, `0,1`).
 * @param cpuperiod - The length of a CPU period in microseconds.
 * @param cpuquota - Microseconds of CPU time that the container can get in a
 *   CPU period.
 * @param buildargs - JSON map of string pairs for build-time variables. Users
 *   pass these values at build-time. Docker uses the buildargs as the
 *   environment context for commands run via the `Dockerfile` RUN instruction,
 *   or for variable expansion in other `Dockerfile` instructions. This is not
 *   meant for passing secret values. For example, the build arg `FOO=bar` would
 *   become `{\"FOO\":\"bar\"}` in JSON. This would result in the query
 *   parameter `buildargs={\"FOO\":\"bar\"}`. Note that `{\"FOO\":\"bar\"}`
 *   should be URI component encoded. [Read more about the buildargs
 *   instruction.](https://docs.docker.com/engine/reference/builder/#arg)
 * @param shmsize - Size of `/dev/shm` in bytes. The size must be greater than
 *   0. If omitted the system uses 64MB.
 * @param squash - Squash the resulting images layers into a single layer.
 *   _(Experimental release only.)_
 * @param labels - Arbitrary key/value labels to set on the image, as a JSON map
 *   of string pairs.
 * @param networkmode - Sets the networking mode for the run commands during
 *   build. Supported standard values are: `bridge`, `host`, `none`, and
 *   `container:<name|id>`. Any other value is taken as a custom network's name
 *   or ID to which this container should connect to.
 * @param Content_type -
 * @param X_Registry_Config - This is a base64-encoded JSON object with auth
 *   configurations for multiple registries that a build may refer to. The key
 *   is a registry URL, and the value is an auth configuration object, [as
 *   described in the authentication section](#section/Authentication). For
 *   example: `{ \"docker.example.com\": { \"username\": \"janedoe\",
 *   \"password\": \"hunter2\" }, \"https://index.docker.io/v1/\": {
 *   \"username\": \"mobydock\", \"password\": \"conta1n3rize14\" } }` Only the
 *   registry domain name (and port if not the default 443) are required.
 *   However, for legacy reasons, the Docker Hub registry must be specified with
 *   both a `https://` prefix and a `/v1/` suffix even though Docker will prefer
 *   to use the v2 registry API.
 * @param platform - Platform in the format os[/arch[/variant]]
 * @param target - Target build stage
 * @param outputs - BuildKit output configuration
 */
export type imageBuildWithConnectionAgentProvided = WithConnectionAgentProvided<typeof imageBuild>;

/**
 * Create a new image from a container
 *
 * @param body - The container configuration
 * @param container - The ID or name of the container to commit
 * @param repo - Repository name for the created image
 * @param tag - Tag name for the create image
 * @param comment - Commit message
 * @param author - Author of the image (e.g., `John Hannibal Smith
 *   <hannibal@a-team.com>`)
 * @param pause - Whether to pause the container before committing
 * @param changes - `Dockerfile` instructions to apply while committing
 */
export type imageCommitWithConnectionAgentProvided = WithConnectionAgentProvided<typeof imageCommit>;

/**
 * Create an image by either pulling it from a registry or importing it.
 *
 * @param body - Image content if the value `-` has been specified in fromSrc
 *   query parameter
 * @param fromImage - Name of the image to pull. The name may include a tag or
 *   digest. This parameter may only be used when pulling an image. The pull is
 *   cancelled if the HTTP connection is closed.
 * @param fromSrc - Source to import. The value may be a URL from which the
 *   image can be retrieved or `-` to read the image from the request body. This
 *   parameter may only be used when importing an image.
 * @param repo - Repository name given to an image when it is imported. The repo
 *   may include a tag. This parameter may only be used when importing an
 *   image.
 * @param tag - Tag or digest. If empty when pulling an image, this causes all
 *   tags for the given image to be pulled.
 * @param message - Set commit message for imported image.
 * @param X_Registry_Auth - A base64url-encoded auth configuration. Refer to the
 *   [authentication section](#section/Authentication) for details.
 * @param changes - Apply `Dockerfile` instructions to the image that is
 *   created, for example: `changes=ENV DEBUG=true`. Note that `ENV DEBUG=true`
 *   should be URI component encoded. Supported `Dockerfile` instructions:
 *   `CMD`|`ENTRYPOINT`|`ENV`|`EXPOSE`|`ONBUILD`|`USER`|`VOLUME`|`WORKDIR`
 * @param platform - Platform in the format os[/arch[/variant]]. When used in
 *   combination with the `fromImage` option, the daemon checks if the given
 *   image is present in the local image cache with the given OS and
 *   Architecture, and otherwise attempts to pull the image. If the option is
 *   not set, the host's native OS and Architecture are used. If the given image
 *   does not exist in the local image cache, the daemon attempts to pull the
 *   image with the host's native OS and Architecture. If the given image does
 *   exists in the local image cache, but its OS or architecture does not match,
 *   a warning is produced. When used with the `fromSrc` option to import an
 *   image from an archive, this option sets the platform information for the
 *   imported image. If the option is not set, the host's native OS and
 *   Architecture are used for the imported image.
 */
export type imageCreateWithConnectionAgentProvided = WithConnectionAgentProvided<typeof imageCreate>;

/**
 * Remove an image, along with any untagged parent images that were referenced
 * by that image. Images can't be removed if they have descendant images, are
 * being used by a running container or are being used by a build.
 *
 * @param name - Image name or ID
 * @param force - Remove the image even if it is being used by stopped
 *   containers or has other tags
 * @param noprune - Do not delete untagged parent images
 */
export type imageDeleteWithConnectionAgentProvided = WithConnectionAgentProvided<typeof imageDelete>;

/**
 * Get a tarball containing all images and metadata for a repository. If `name`
 * is a specific name and tag (e.g. `ubuntu:latest`), then only that image (and
 * its parents) are returned. If `name` is an image ID, similarly only that
 * image (and its parents) are returned, but with the exclusion of the
 * `repositories` file in the tarball, as there were no image names referenced.
 *
 * ### Image tarball format An image tarball contains one directory per image
 *
 * Layer (named using its long ID), each containing these files:
 *
 * - `VERSION`: currently `1.0`
 * - The file format version - `json`: detailed layer information, similar to
 *   `docker inspect layer_id`
 * - `layer.tar`: A tarfile containing the filesystem changes in this layer The
 *   `layer.tar` file contains `aufs` style `.wh..wh.aufs` files and directories
 *   for storing attribute changes and deletions. If the tarball defines a
 *   repository, the tarball should also include a `repositories` file at the
 *   root that contains a list of repository and tag names mapped to layer IDs.
 *   `json { \"hello-world\": { \"latest\":
 *   \"565a9d68a73f6706862bfe8409a7f659776d4d60a8d096eb4a3cbce6999cc2a1\" } } `
 *
 * @param name - Image name or ID
 */
export type imageGetWithConnectionAgentProvided = WithConnectionAgentProvided<typeof imageGet>;

/**
 * Get a tarball containing all images and metadata for several image
 * repositories. For each value of the `names` parameter: if it is a specific
 * name and tag (e.g. `ubuntu:latest`), then only that image (and its parents)
 * are returned; if it is an image ID, similarly only that image (and its
 * parents) are returned and there would be no names referenced in the
 * 'repositories' file for this image ID. For details on the format, see the
 * [export image endpoint](#operation/ImageGet).
 *
 * @param names - Image names to filter by
 */
export type imageGetAllWithConnectionAgentProvided = WithConnectionAgentProvided<typeof imageGetAll>;

/**
 * Return parent layers of an image.
 *
 * @param name - Image name or ID
 */
export type imageHistoryWithConnectionAgentProvided = WithConnectionAgentProvided<typeof imageHistory>;

/**
 * Return low-level information about an image.
 *
 * @param name - Image name or id
 */
export type imageInspectWithConnectionAgentProvided = WithConnectionAgentProvided<typeof imageInspect>;

/**
 * Returns a list of images on the server. Note that it uses a different,
 * smaller representation of an image than inspecting a single image.
 *
 * @param all - Show all images. Only images from a final layer (no children)
 *   are shown by default.
 * @param filters - A JSON encoded value of the filters (a
 *   `map[string][]string`) to process on the images list. Available filters:
 *
 *   - `before`=(`<image-name>[:<tag>]`, `<image id>` or `<image@digest>`)
 *   - `dangling=true`
 *   - `label=key` or `label=\"key=value\"` of an image label -
 *       `reference`=(`<image-name>[:<tag>]`) - `since`=(`<image-name>[:<tag>]`,
 *       `<image id>` or `<image@digest>`)
 *
 * @param shared_size - Compute and show shared size as a `SharedSize` field on
 *   each image.
 * @param digests - Show digest information as a `RepoDigests` field on each
 *   image.
 */
export type imageListWithConnectionAgentProvided = WithConnectionAgentProvided<typeof imageList>;

/**
 * Load a set of images and tags into a repository. For details on the format,
 * see the [export image endpoint](#operation/ImageGet).
 *
 * @param body - Tar archive containing images
 * @param quiet - Suppress progress details during load.
 */
export type imageLoadWithConnectionAgentProvided = WithConnectionAgentProvided<typeof imageLoad>;

/**
 * Delete unused images
 *
 * @param filters - Filters to process on the prune list, encoded as JSON (a
 *   `map[string][]string`). Available filters:
 *
 *   - `dangling=<boolean>` When set to `true` (or `1`), prune only unused _and_
 *       untagged images. When set to `false` (or `0`), all unused images are
 *       pruned.
 *   - `until=<string>` Prune images created before this timestamp. The
 *       `<timestamp>` can be Unix timestamps, date formatted timestamps, or Go
 *       duration strings (e.g. `10m`, `1h30m`) computed relative to the daemon
 *       machine’s time.
 *   - `label` (`label=<key>`, `label=<key>=<value>`, `label!=<key>`, or
 *       `label!=<key>=<value>`) Prune images with (or without, in case
 *       `label!=...` is used) the specified labels.
 */
export type imagePruneWithConnectionAgentProvided = WithConnectionAgentProvided<typeof imagePrune>;

/**
 * Push an image to a registry. If you wish to push an image on to a private
 * registry, that image must already have a tag which references the registry.
 * For example, `registry.example.com/myimage:latest`. The push is cancelled if
 * the HTTP connection is closed.
 *
 * @param name - Image name or ID.
 * @param X_Registry_Auth - A base64url-encoded auth configuration. Refer to the
 *   [authentication section](#section/Authentication) for details.
 * @param tag - The tag to associate with the image on the registry.
 */
export type imagePushWithConnectionAgentProvided = WithConnectionAgentProvided<typeof imagePush>;

/**
 * Search for an image on Docker Hub.
 *
 * @param term - Term to search
 * @param limit - Maximum number of results to return
 * @param filters - A JSON encoded value of the filters (a
 *   `map[string][]string`) to process on the images list. Available filters:
 *
 *   - `is-automated=(true|false)`
 *   - `is-official=(true|false)`
 *   - `stars=<number>` Matches images that has at least 'number' stars.
 */
export type imageSearchWithConnectionAgentProvided = WithConnectionAgentProvided<typeof imageSearch>;

/**
 * Tag an image so that it becomes part of a repository.
 *
 * @param name - Image name or ID to tag.
 * @param repo - The repository to tag in. For example, `someuser/someimage`.
 * @param tag - The name of the new tag.
 */
export type imageTagWithConnectionAgentProvided = WithConnectionAgentProvided<typeof imageTag>;
