---
title: endpoints/Containers.ts
nav_order: 21
parent: Modules
---

## Containers overview

Containers service

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Errors](#errors)
  - [ContainersError (class)](#containerserror-class)
  - [ContainersErrorTypeId](#containerserrortypeid)
  - [ContainersErrorTypeId (type alias)](#containerserrortypeid-type-alias)
  - [isContainersError](#iscontainerserror)
- [Layers](#layers)
  - [layer](#layer)
- [Params](#params)
  - [ContainerArchiveInfoOptions (interface)](#containerarchiveinfooptions-interface)
  - [ContainerArchiveOptions (interface)](#containerarchiveoptions-interface)
  - [ContainerAttachOptions (interface)](#containerattachoptions-interface)
  - [ContainerAttachWebsocketOptions (interface)](#containerattachwebsocketoptions-interface)
  - [ContainerChangesOptions (interface)](#containerchangesoptions-interface)
  - [ContainerCreateOptions (interface)](#containercreateoptions-interface)
  - [ContainerDeleteOptions (interface)](#containerdeleteoptions-interface)
  - [ContainerExportOptions (interface)](#containerexportoptions-interface)
  - [ContainerInspectOptions (interface)](#containerinspectoptions-interface)
  - [ContainerKillOptions (interface)](#containerkilloptions-interface)
  - [ContainerListOptions (interface)](#containerlistoptions-interface)
  - [ContainerLogsOptions (interface)](#containerlogsoptions-interface)
  - [ContainerPauseOptions (interface)](#containerpauseoptions-interface)
  - [ContainerPruneOptions (interface)](#containerpruneoptions-interface)
  - [ContainerRenameOptions (interface)](#containerrenameoptions-interface)
  - [ContainerResizeOptions (interface)](#containerresizeoptions-interface)
  - [ContainerRestartOptions (interface)](#containerrestartoptions-interface)
  - [ContainerStartOptions (interface)](#containerstartoptions-interface)
  - [ContainerStatsOptions (interface)](#containerstatsoptions-interface)
  - [ContainerStopOptions (interface)](#containerstopoptions-interface)
  - [ContainerTopOptions (interface)](#containertopoptions-interface)
  - [ContainerUnpauseOptions (interface)](#containerunpauseoptions-interface)
  - [ContainerUpdateOptions (interface)](#containerupdateoptions-interface)
  - [ContainerWaitOptions (interface)](#containerwaitoptions-interface)
  - [PutContainerArchiveOptions (interface)](#putcontainerarchiveoptions-interface)
- [Services](#services)
  - [make](#make)
- [Tags](#tags)
  - [Containers (class)](#containers-class)
  - [ContainersImpl (interface)](#containersimpl-interface)

---

# Errors

## ContainersError (class)

**Signature**

```ts
export declare class ContainersError
```

Added in v1.0.0

## ContainersErrorTypeId

**Signature**

```ts
export declare const ContainersErrorTypeId: typeof ContainersErrorTypeId
```

Added in v1.0.0

## ContainersErrorTypeId (type alias)

**Signature**

```ts
export type ContainersErrorTypeId = typeof ContainersErrorTypeId
```

Added in v1.0.0

## isContainersError

**Signature**

```ts
export declare const isContainersError: (u: unknown) => u is ContainersError
```

Added in v1.0.0

# Layers

## layer

Containers layer that depends on a Moby connection agent

**Signature**

```ts
export declare const layer: Layer.Layer<Containers, never, HttpClient.HttpClient.Default>
```

Added in v1.0.0

# Params

## ContainerArchiveInfoOptions (interface)

**Signature**

```ts
export interface ContainerArchiveInfoOptions {
  /** ID or name of the container */
  readonly id: string
  /** Resource in the container’s filesystem to archive. */
  readonly path: string
}
```

Added in v1.0.0

## ContainerArchiveOptions (interface)

**Signature**

```ts
export interface ContainerArchiveOptions {
  /** ID or name of the container */
  readonly id: string
  /** Resource in the container’s filesystem to archive. */
  readonly path: string
}
```

Added in v1.0.0

## ContainerAttachOptions (interface)

**Signature**

```ts
export interface ContainerAttachOptions {
  /** ID or name of the container */
  readonly id: string
  /**
   * Override the key sequence for detaching a container.Format is a single
   * character `[a-Z]` or `ctrl-<value>` where `<value>` is one of: `a-z`,
   * `@`, `^`, `[`, `,` or `_`.
   */
  readonly detachKeys?: string | undefined
  /**
   * Replay previous logs from the container.
   *
   * This is useful for attaching to a container that has started and you want
   * to output everything since the container started.
   *
   * If `stream` is also enabled, once all the previous output has been
   * returned, it will seamlessly transition into streaming current output.
   */
  readonly logs?: boolean | undefined
  /** Stream attached streams from the time the request was made onwards. */
  readonly stream?: boolean | undefined
  /** Attach to `stdin` */
  readonly stdin?: boolean | undefined
  /** Attach to `stdout` */
  readonly stdout?: boolean | undefined
  /** Attach to `stderr` */
  readonly stderr?: boolean | undefined
}
```

Added in v1.0.0

## ContainerAttachWebsocketOptions (interface)

**Signature**

```ts
export interface ContainerAttachWebsocketOptions {
  /** ID or name of the container */
  readonly id: string
  /**
   * Override the key sequence for detaching a container.Format is a single
   * character `[a-Z]` or `ctrl-<value>` where `<value>` is one of: `a-z`,
   * `@`, `^`, `[`, `,`, or `_`.
   */
  readonly detachKeys?: string | undefined
  /** Return logs */
  readonly logs?: boolean | undefined
  /** Return stream */
  readonly stream?: boolean | undefined
  /** Attach to `stdin` */
  readonly stdin?: boolean | undefined
  /** Attach to `stdout` */
  readonly stdout?: boolean | undefined
  /** Attach to `stderr` */
  readonly stderr?: boolean | undefined
}
```

Added in v1.0.0

## ContainerChangesOptions (interface)

**Signature**

```ts
export interface ContainerChangesOptions {
  /** ID or name of the container */
  readonly id: string
}
```

Added in v1.0.0

## ContainerCreateOptions (interface)

**Signature**

```ts
export interface ContainerCreateOptions {
  /**
   * Assign the specified name to the container. Must match
   * `/?[a-zA-Z0-9][a-zA-Z0-9_.-]+`.
   */
  readonly name?: string | undefined
  /**
   * Platform in the format `os[/arch[/variant]]` used for image lookup.
   *
   * When specified, the daemon checks if the requested image is present in
   * the local image cache with the given OS and Architecture, and otherwise
   * returns a `404` status.
   *
   * If the option is not set, the host's native OS and Architecture are used
   * to look up the image in the image cache. However, if no platform is
   * passed and the given image does exist in the local image cache, but its
   * OS or architecture does not match, the container is created with the
   * available image, and a warning is added to the `Warnings` field in the
   * response, for example;
   *
   * WARNING: The requested image's platform (linux/arm64/v8) does not match
   * the detected host platform (linux/amd64) and no specific platform was
   * requested
   */
  readonly platform?: string | undefined
  /** Container to create */
  readonly spec: typeof ContainerCreateRequest.Encoded
}
```

Added in v1.0.0

## ContainerDeleteOptions (interface)

**Signature**

```ts
export interface ContainerDeleteOptions {
  /** ID or name of the container */
  readonly id: string
  /** Remove anonymous volumes associated with the container. */
  readonly v?: boolean | undefined
  /** If the container is running, kill it before removing it. */
  readonly force?: boolean | undefined
  /** Remove the specified link associated with the container. */
  readonly link?: boolean | undefined
}
```

Added in v1.0.0

## ContainerExportOptions (interface)

**Signature**

```ts
export interface ContainerExportOptions {
  /** ID or name of the container */
  readonly id: string
}
```

Added in v1.0.0

## ContainerInspectOptions (interface)

**Signature**

```ts
export interface ContainerInspectOptions {
  /** ID or name of the container */
  readonly id: string
  /** Return the size of container as fields `SizeRw` and `SizeRootFs` */
  readonly size?: boolean | undefined
}
```

Added in v1.0.0

## ContainerKillOptions (interface)

**Signature**

```ts
export interface ContainerKillOptions {
  /** ID or name of the container */
  readonly id: string
  /** Signal to send to the container as an integer or string (e.g. `SIGINT`). */
  readonly signal?: string | undefined
}
```

Added in v1.0.0

## ContainerListOptions (interface)

**Signature**

```ts
export interface ContainerListOptions {
  /** Return all containers. By default, only running containers are shown. */
  readonly all?: boolean | undefined

  /**
   * Return this number of most recently created containers, including
   * non-running ones.
   */
  readonly limit?: number | undefined

  /** Return the size of container as fields `SizeRw` and `SizeRootFs`. */
  readonly size?: boolean | undefined

  /**
   * Available filters:
   *
   * - `ancestor`=(`<image-name>[:<tag>]`, `<image id>`, or `<image@digest>`)
   * - `before`=(`<container id>` or `<container name>`)
   * - `expose`=(`<port>[/<proto>]`|`<startport-endport>/[<proto>]`)
   * - `exited=<int>` containers with exit code of `<int>`
   * - `health`=(`starting`|`healthy`|`unhealthy`|`none`)
   * - `id=<ID>` a container's ID
   * - `isolation=`(`default`|`process`|`hyperv`) (Windows daemon only)
   * - `is-task=`(`true`|`false`)
   * - `label=key` or `label="key=value"` of a container label
   * - `name=<name>` a container's name
   * - `network`=(`<network id>` or `<network name>`)
   * - `publish`=(`<port>[/<proto>]`|`<startport-endport>/[<proto>]`)
   * - `since`=(`<container id>` or `<container name>`)
   * - `status=`(`created`|`restarting`|`running`|`removing`|`paused`|`exited`|`dead`)
   * - `volume`=(`<volume name>` or `<mount point destination>`)
   */
  readonly filters?:
    | {
        ancestor?: string | undefined
        before?: string | undefined
        expose?: `${number}/${string}` | `${number}-${number}/${string}` | undefined
        exited?: number | undefined
        health?: "starting" | "healthy" | "unhealthy" | "none" | undefined
        id?: string | undefined
        isolation?: "default" | "process" | "hyperv" | undefined
        "is-task"?: true | false | undefined
        label?: Record<string, string> | undefined
        name?: string | undefined
        network?: string | undefined
        publish?: `${number}/${string}` | `${number}-${number}/${string}` | undefined
        since?: string | undefined
        status?: "created" | "restarting" | "running" | "removing" | "paused" | "exited" | "dead" | undefined
        volume?: string | undefined
      }
    | undefined
}
```

Added in v1.0.0

## ContainerLogsOptions (interface)

**Signature**

```ts
export interface ContainerLogsOptions {
  /** ID or name of the container */
  readonly id: string
  /** Keep connection after returning logs. */
  readonly follow?: boolean | undefined
  /** Return logs from `stdout` */
  readonly stdout?: boolean | undefined
  /** Return logs from `stderr` */
  readonly stderr?: boolean | undefined
  /** Only return logs since this time, as a UNIX timestamp */
  readonly since?: number | undefined
  /** Only return logs before this time, as a UNIX timestamp */
  readonly until?: number | undefined
  /** Add timestamps to every log line */
  readonly timestamps?: boolean | undefined
  /**
   * Only return this number of log lines from the end of the logs. Specify as
   * an integer or `all` to output all log lines.
   */
  readonly tail?: string | undefined
}
```

Added in v1.0.0

## ContainerPauseOptions (interface)

**Signature**

```ts
export interface ContainerPauseOptions {
  /** ID or name of the container */
  readonly id: string
}
```

Added in v1.0.0

## ContainerPruneOptions (interface)

**Signature**

```ts
export interface ContainerPruneOptions {
  /**
   * Available filters:
   *
   * - `until=<timestamp>` Prune containers created before this timestamp. The
   *   `<timestamp>` can be Unix timestamps, date formatted timestamps, or Go
   *   duration strings (e.g. `10m`, `1h30m`) computed relative to the daemon
   *   machine’s time.
   * - `label` (`label=<key>`, `label=<key>=<value>`, `label!=<key>`, or
   *   `label!=<key>=<value>`) Prune containers with (or without, in case
   *   `label!=...` is used) the specified labels.
   */
  readonly filters?:
    | {
        until?: string
        label?: Record<string, string> | undefined
      }
    | undefined
}
```

Added in v1.0.0

## ContainerRenameOptions (interface)

**Signature**

```ts
export interface ContainerRenameOptions {
  /** ID or name of the container */
  readonly id: string
  /** New name for the container */
  readonly name: string
}
```

Added in v1.0.0

## ContainerResizeOptions (interface)

**Signature**

```ts
export interface ContainerResizeOptions {
  /** ID or name of the container */
  readonly id: string
  /** Height of the TTY session in characters */
  readonly h?: number | undefined
  /** Width of the TTY session in characters */
  readonly w?: number | undefined
}
```

Added in v1.0.0

## ContainerRestartOptions (interface)

**Signature**

```ts
export interface ContainerRestartOptions {
  /** ID or name of the container */
  readonly id: string
  /** Signal to send to the container as an integer or string (e.g. `SIGINT`). */
  readonly signal?: string | undefined
  /** Number of seconds to wait before killing the container */
  readonly t?: number | undefined
}
```

Added in v1.0.0

## ContainerStartOptions (interface)

**Signature**

```ts
export interface ContainerStartOptions {
  /** ID or name of the container */
  readonly id: string
  /**
   * Override the key sequence for detaching a container. Format is a single
   * character `[a-Z]` or `ctrl-<value>` where `<value>` is one of: `a-z`,
   * `@`, `^`, `[`, `,` or `_`.
   */
  readonly detachKeys?: string | undefined
}
```

Added in v1.0.0

## ContainerStatsOptions (interface)

**Signature**

```ts
export interface ContainerStatsOptions {
  /** ID or name of the container */
  readonly id: string
  /**
   * Stream the output. If false, the stats will be output once and then it
   * will disconnect.
   */
  readonly stream?: boolean | undefined
  /**
   * Only get a single stat instead of waiting for 2 cycles. Must be used with
   * `stream=false`.
   */
  readonly "one-shot"?: boolean | undefined
}
```

Added in v1.0.0

## ContainerStopOptions (interface)

**Signature**

```ts
export interface ContainerStopOptions {
  /** ID or name of the container */
  readonly id: string
  /** Signal to send to the container as an integer or string (e.g. `SIGINT`). */
  readonly signal?: string | undefined
  /** Number of seconds to wait before killing the container */
  readonly t?: number | undefined
}
```

Added in v1.0.0

## ContainerTopOptions (interface)

**Signature**

```ts
export interface ContainerTopOptions {
  /** ID or name of the container */
  readonly id: string
  /** The arguments to pass to `ps`. For example, `aux` */
  readonly ps_args?: string | undefined
}
```

Added in v1.0.0

## ContainerUnpauseOptions (interface)

**Signature**

```ts
export interface ContainerUnpauseOptions {
  /** ID or name of the container */
  readonly id: string
}
```

Added in v1.0.0

## ContainerUpdateOptions (interface)

**Signature**

```ts
export interface ContainerUpdateOptions {
  /** ID or name of the container */
  readonly id: string
  readonly spec: ContainerConfig
}
```

Added in v1.0.0

## ContainerWaitOptions (interface)

**Signature**

```ts
export interface ContainerWaitOptions {
  /** ID or name of the container */
  readonly id: string
  /**
   * Wait until a container state reaches the given condition.
   *
   * Defaults to `not-running` if omitted or empty.
   */
  readonly condition?: string | undefined
}
```

Added in v1.0.0

## PutContainerArchiveOptions (interface)

**Signature**

```ts
export interface PutContainerArchiveOptions<E1> {
  /** ID or name of the container */
  readonly id: string
  /**
   * Path to a directory in the container to extract the archive’s contents
   * into.
   */
  readonly path: string
  /**
   * If `1`, `true`, or `True` then it will be an error if unpacking the given
   * content would cause an existing directory to be replaced with a
   * non-directory and vice versa.
   */
  readonly noOverwriteDirNonDir?: string | undefined
  /** If `1`, `true`, then it will copy UID/GID maps to the dest file or dir */
  readonly copyUIDGID?: string | undefined
  /**
   * The input stream must be a tar archive compressed with one of the
   * following algorithms: `identity` (no compression), `gzip`, `bzip2`, or
   * `xz`.
   */
  readonly stream: Stream.Stream<Uint8Array, E1, never>
}
```

Added in v1.0.0

# Services

## make

**Signature**

```ts
export declare const make: Effect.Effect<ContainersImpl, never, HttpClient.HttpClient.Default>
```

Added in v1.0.0

# Tags

## Containers (class)

Containers service

**Signature**

```ts
export declare class Containers
```

Added in v1.0.0

## ContainersImpl (interface)

**Signature**

```ts
export interface ContainersImpl {
  /**
   * List containers
   *
   * @param all - Return all containers. By default, only running containers
   *   are shown.
   * @param limit - Return this number of most recently created containers,
   *   including non-running ones.
   * @param size - Return the size of container as fields `SizeRw` and
   *   `SizeRootFs`.
   * @param filters - Filters to process on the container list
   *
   *   Available filters:
   *
   *   - `ancestor`=(`<image-name>[:<tag>]`, `<image id>`, or `<image@digest>`)
   *   - `before`=(`<container id>` or `<container name>`)
   *   - `expose`=(`<port>[/<proto>]`|`<startport-endport>/[<proto>]`)
   *   - `exited=<int>` containers with exit code of `<int>`
   *   - `health`=(`starting`|`healthy`|`unhealthy`|`none`)
   *   - `id=<ID>` a container's ID
   *   - `isolation=`(`default`|`process`|`hyperv`) (Windows daemon only)
   *   - `is-task=`(`true`|`false`)
   *   - `label=key` or `label="key=value"` of a container label
   *   - `name=<name>` a container's name
   *   - `network`=(`<network id>` or `<network name>`)
   *   - `publish`=(`<port>[/<proto>]`|`<startport-endport>/[<proto>]`)
   *   - `since`=(`<container id>` or `<container name>`)
   *   - `status=`(`created`|`restarting`|`running`|`removing`|`paused`|`exited`|`dead`)
   *   - `volume`=(`<volume name>` or `<mount point destination>`)
   */
  readonly list: (
    options?: ContainerListOptions | undefined
  ) => Effect.Effect<ReadonlyArray<ContainerListResponseItem>, ContainersError, never>

  /**
   * Create a container
   *
   * @param name - Assign the specified name to the container. Must match
   *   `/?[a-zA-Z0-9][a-zA-Z0-9_.-]+`.
   * @param platform - Platform in the format `os[/arch[/variant]]` used for
   *   image lookup.
   *
   *   When specified, the daemon checks if the requested image is present in
   *   the local image cache with the given OS and Architecture, and otherwise
   *   returns a `404` status.
   *
   *   If the option is not set, the host's native OS and Architecture are used
   *   to look up the image in the image cache. However, if no platform is
   *   passed and the given image does exist in the local image cache, but its
   *   OS or architecture does not match, the container is created with the
   *   available image, and a warning is added to the `Warnings` field in the
   *   response, for example;
   *
   *   WARNING: The requested image's platform (linux/arm64/v8) does not match
   *   the detected host platform (linux/amd64) and no specific platform was
   *   requested
   * @param spec - Container to create
   */
  readonly create: (options: ContainerCreateOptions) => Effect.Effect<ContainerCreateResponse, ContainersError, never>

  /**
   * Inspect a container
   *
   * @param id - ID or name of the container
   * @param size - Return the size of container as fields `SizeRw` and
   *   `SizeRootFs`
   */
  readonly inspect: (
    options: ContainerInspectOptions
  ) => Effect.Effect<ContainerInspectResponse, ContainersError, never>

  /**
   * List processes running inside a container
   *
   * @param id - ID or name of the container
   * @param ps_args - The arguments to pass to `ps`. For example, `aux`
   */
  readonly top: (options: ContainerTopOptions) => Effect.Effect<ContainerTopResponse, ContainersError, never>

  /**
   * Get container logs
   *
   * @param id - ID or name of the container
   * @param follow - Keep connection after returning logs.
   * @param stdout - Return logs from `stdout`
   * @param stderr - Return logs from `stderr`
   * @param since - Only return logs since this time, as a UNIX timestamp
   * @param until - Only return logs before this time, as a UNIX timestamp
   * @param timestamps - Add timestamps to every log line
   * @param tail - Only return this number of log lines from the end of the
   *   logs. Specify as an integer or `all` to output all log lines.
   */
  readonly logs: (options: ContainerLogsOptions) => Stream.Stream<string, ContainersError, never>

  /**
   * Get changes on a container’s filesystem
   *
   * @param id - ID or name of the container
   */
  readonly changes: (
    options: ContainerChangesOptions
  ) => Effect.Effect<ReadonlyArray<ContainerChange> | null, ContainersError, never>

  /**
   * Export a container
   *
   * @param id - ID or name of the container
   */
  readonly export: (options: ContainerExportOptions) => Stream.Stream<Uint8Array, ContainersError, never>

  /**
   * Get container stats based on resource usage
   *
   * @param id - ID or name of the container
   * @param stream - Stream the output. If false, the stats will be output
   *   once and then it will disconnect.
   * @param one-shot - Only get a single stat instead of waiting for 2 cycles.
   *   Must be used with `stream=false`.
   */
  readonly stats: (options: ContainerStatsOptions) => Stream.Stream<ContainerStatsResponse, ContainersError, never>

  /**
   * Resize a container TTY
   *
   * @param id - ID or name of the container
   * @param h - Height of the TTY session in characters
   * @param w - Width of the TTY session in characters
   */
  readonly resize: (options: ContainerResizeOptions) => Effect.Effect<void, ContainersError, never>

  /**
   * Start a container
   *
   * @param id - ID or name of the container
   * @param detachKeys - Override the key sequence for detaching a container.
   *   Format is a single character `[a-Z]` or `ctrl-<value>` where `<value>`
   *   is one of: `a-z`, `@`, `^`, `[`, `,` or `_`.
   */
  readonly start: (options: ContainerStartOptions) => Effect.Effect<void, ContainersError, never>

  /**
   * Stop a container
   *
   * @param id - ID or name of the container
   * @param signal - Signal to send to the container as an integer or string
   *   (e.g. `SIGINT`).
   * @param t - Number of seconds to wait before killing the container
   */
  readonly stop: (options: ContainerStopOptions) => Effect.Effect<void, ContainersError, never>

  /**
   * Restart a container
   *
   * @param id - ID or name of the container
   * @param signal - Signal to send to the container as an integer or string
   *   (e.g. `SIGINT`).
   * @param t - Number of seconds to wait before killing the container
   */
  readonly restart: (options: ContainerRestartOptions) => Effect.Effect<void, ContainersError, never>

  /**
   * Kill a container
   *
   * @param id - ID or name of the container
   * @param signal - Signal to send to the container as an integer or string
   *   (e.g. `SIGINT`).
   */
  readonly kill: (options: ContainerKillOptions) => Effect.Effect<void, ContainersError, never>

  /**
   * Update a container
   *
   * @param id - ID or name of the container
   * @param spec -
   */
  readonly update: (options: ContainerUpdateOptions) => Effect.Effect<ContainerUpdateResponse, ContainersError, never>

  /**
   * Rename a container
   *
   * @param id - ID or name of the container
   * @param name - New name for the container
   */
  readonly rename: (options: ContainerRenameOptions) => Effect.Effect<void, ContainersError, never>

  /**
   * Pause a container
   *
   * @param id - ID or name of the container
   */
  readonly pause: (options: ContainerPauseOptions) => Effect.Effect<void, ContainersError, never>

  /**
   * Unpause a container
   *
   * @param id - ID or name of the container
   */
  readonly unpause: (options: ContainerUnpauseOptions) => Effect.Effect<void, ContainersError, never>

  /**
   * Attach to a container
   *
   * @param id - ID or name of the container
   * @param detachKeys - Override the key sequence for detaching a
   *   container.Format is a single character `[a-Z]` or `ctrl-<value>` where
   *   `<value>` is one of: `a-z`, `@`, `^`, `[`, `,` or `_`.
   * @param logs - Replay previous logs from the container.
   *
   *   This is useful for attaching to a container that has started and you want
   *   to output everything since the container started.
   *
   *   If `stream` is also enabled, once all the previous output has been
   *   returned, it will seamlessly transition into streaming current output.
   * @param stream - Stream attached streams from the time the request was
   *   made onwards.
   * @param stdin - Attach to `stdin`
   * @param stdout - Attach to `stdout`
   * @param stderr - Attach to `stderr`
   */
  readonly attach: (
    options: ContainerAttachOptions
  ) => Effect.Effect<BidirectionalRawStreamSocket | MultiplexedStreamSocket, ContainersError, Scope.Scope>

  /**
   * Attach to a container via a websocket
   *
   * @param id - ID or name of the container
   * @param detachKeys - Override the key sequence for detaching a
   *   container.Format is a single character `[a-Z]` or `ctrl-<value>` where
   *   `<value>` is one of: `a-z`, `@`, `^`, `[`, `,`, or `_`.
   * @param logs - Return logs
   * @param stream - Return stream
   * @param stdin - Attach to `stdin`
   * @param stdout - Attach to `stdout`
   * @param stderr - Attach to `stderr`
   */
  readonly attachWebsocket: (
    options: ContainerAttachWebsocketOptions
  ) => Effect.Effect<UnidirectionalRawStreamSocket, ContainersError, Scope.Scope>

  /**
   * Wait for a container
   *
   * @param id - ID or name of the container
   * @param condition - Wait until a container state reaches the given
   *   condition.
   *
   *   Defaults to `not-running` if omitted or empty.
   */
  readonly wait: (options: ContainerWaitOptions) => Effect.Effect<ContainerWaitResponse, ContainersError, never>

  /**
   * Remove a container
   *
   * @param id - ID or name of the container
   * @param v - Remove anonymous volumes associated with the container.
   * @param force - If the container is running, kill it before removing it.
   * @param link - Remove the specified link associated with the container.
   */
  readonly delete: (options: ContainerDeleteOptions) => Effect.Effect<void, ContainersError, never>

  /**
   * Get an archive of a filesystem resource in a container
   *
   * @param id - ID or name of the container
   * @param path - Resource in the container’s filesystem to archive.
   */
  readonly archive: (options: ContainerArchiveOptions) => Stream.Stream<Uint8Array, ContainersError, never>

  /**
   * Get information about files in a container
   *
   * @param id - ID or name of the container
   * @param path - Resource in the container’s filesystem to archive.
   */
  readonly archiveInfo: (options: ContainerArchiveInfoOptions) => Effect.Effect<void, ContainersError, never>

  /**
   * Extract an archive of files or folders to a directory in a container
   *
   * @param id - ID or name of the container
   * @param path - Path to a directory in the container to extract the
   *   archive’s contents into.
   * @param noOverwriteDirNonDir - If `1`, `true`, or `True` then it will be
   *   an error if unpacking the given content would cause an existing
   *   directory to be replaced with a non-directory and vice versa.
   * @param copyUIDGID - If `1`, `true`, then it will copy UID/GID maps to the
   *   dest file or dir
   * @param stream - The input stream must be a tar archive compressed with
   *   one of the following algorithms: `identity` (no compression), `gzip`,
   *   `bzip2`, or `xz`.
   */
  readonly putArchive: <E1>(options: PutContainerArchiveOptions<E1>) => Effect.Effect<void, ContainersError, never>

  /**
   * Delete stopped containers
   *
   * @param filters - Filters to process on the prune list. Available filters:
   *
   *   - `until=<timestamp>` Prune containers created before this timestamp. The
   *       `<timestamp>` can be Unix timestamps, date formatted timestamps, or
   *       Go duration strings (e.g. `10m`, `1h30m`) computed relative to the
   *       daemon machine’s time.
   *   - `label` (`label=<key>`, `label=<key>=<value>`, `label!=<key>`, or
   *       `label!=<key>=<value>`) Prune containers with (or without, in case
   *       `label!=...` is used) the specified labels.
   */
  readonly prune: (
    options?: ContainerPruneOptions | undefined
  ) => Effect.Effect<ContainerPruneResponse, ContainersError, never>
}
```

Added in v1.0.0
