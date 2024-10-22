---
title: endpoints/Images.ts
nav_order: 14
parent: Modules
---

## Images overview

Images service

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Errors](#errors)
  - [ImagesError (class)](#imageserror-class)
  - [isImagesError](#isimageserror)
- [Layers](#layers)
  - [ImagesLayer](#imageslayer)
- [Params](#params)
  - [ImageBuildOptions (interface)](#imagebuildoptions-interface)
- [Tags](#tags)
  - [Images (class)](#images-class)

---

# Errors

## ImagesError (class)

**Signature**

```ts
export declare class ImagesError
```

Added in v1.0.0

## isImagesError

**Signature**

```ts
export declare const isImagesError: (u: unknown) => u is ImagesError
```

Added in v1.0.0

# Layers

## ImagesLayer

**Signature**

```ts
export declare const ImagesLayer: Layer.Layer<
  Images,
  never,
  HttpClient.HttpClient<HttpClientError.HttpClientError, Scope>
>
```

Added in v1.0.0

# Params

## ImageBuildOptions (interface)

**Signature**

```ts
export interface ImageBuildOptions<E1> {
  /**
   * A tar archive compressed with one of the following algorithms: identity
   * (no compression), gzip, bzip2, xz.
   */
  readonly context: Stream.Stream<Uint8Array, E1, never>
  /**
   * Path within the build context to the `Dockerfile`. This is ignored if
   * `remote` is specified and points to an external `Dockerfile`.
   */
  readonly dockerfile?: string | undefined
  /**
   * A name and optional tag to apply to the image in the `name:tag` format.
   * If you omit the tag the default `latest` value is assumed. You can
   * provide several `t` parameters.
   */
  readonly t?: string | undefined
  /** Extra hosts to add to /etc/hosts */
  readonly extrahosts?: string | undefined
  /**
   * A Git repository URI or HTTP/HTTPS context URI. If the URI points to a
   * single text file, the file’s contents are placed into a file called
   * `Dockerfile` and the image is built from that file. If the URI points to
   * a tarball, the file is downloaded by the daemon and the contents therein
   * used as the context for the build. If the URI points to a tarball and the
   * `dockerfile` parameter is also specified, there must be a file with the
   * corresponding path inside the tarball.
   */
  readonly remote?: string | undefined
  /** Suppress verbose build output. */
  readonly q?: boolean | undefined
  /** Do not use the cache when building the image. */
  readonly nocache?: boolean | undefined
  /** JSON array of images used for build cache resolution. */
  readonly cachefrom?: string | undefined
  /** Attempt to pull the image even if an older image exists locally. */
  readonly pull?: string | undefined
  /** Remove intermediate containers after a successful build. */
  readonly rm?: boolean | undefined
  /** Always remove intermediate containers, even upon failure. */
  readonly forcerm?: boolean | undefined
  /** Set memory limit for build. */
  readonly memory?: number | undefined
  /** Total memory (memory + swap). Set as `-1` to disable swap. */
  readonly memswap?: number | undefined
  /** CPU shares (relative weight). */
  readonly cpushares?: number | undefined
  /** CPUs in which to allow execution (e.g., `0-3`, `0,1`). */
  readonly cpusetcpus?: string | undefined
  /** The length of a CPU period in microseconds. */
  readonly cpuperiod?: number | undefined
  /** Microseconds of CPU time that the container can get in a CPU period. */
  readonly cpuquota?: number | undefined
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
  readonly buildArgs?: Record<string, string | undefined> | undefined
  /**
   * Size of `/dev/shm` in bytes. The size must be greater than 0. If omitted
   * the system uses 64MB.
   */
  readonly shmsize?: number | undefined
  /**
   * Squash the resulting images layers into a single layer. _(Experimental
   * release only.)_
   */
  readonly squash?: boolean | undefined
  /**
   * Arbitrary key/value labels to set on the image, as a JSON map of string
   * pairs.
   */
  readonly labels?: string | undefined
  /**
   * Sets the networking mode for the run commands during build. Supported
   * standard values are: `bridge`, `host`, `none`, and `container:<name|id>`.
   * Any other value is taken as a custom network's name or ID to which this
   * container should connect to.
   */
  readonly networkmode?: string | undefined
  readonly "Content-type"?: string | undefined
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
  readonly "X-Registry-Config"?: string | undefined
  /** Platform in the format os[/arch[/variant]] */
  readonly platform?: string | undefined
  /** Target build stage */
  readonly target?: string | undefined
  /** BuildKit output configuration */
  readonly outputs?: string | undefined
}
```

Added in v1.0.0

# Tags

## Images (class)

Images service

**Signature**

```ts
export declare class Images
```

Added in v1.0.0
