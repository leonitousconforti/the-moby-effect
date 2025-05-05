---
title: DockerComposeEngine.ts
nav_order: 3
parent: Modules
---

## DockerComposeEngine.ts overview

Docker compose engine.

Since v1.0.0

---

## Exports Grouped by Category

- [Errors](#errors)
  - [DockerComposeError](#dockercomposeerror)
  - [DockerComposeError (type alias)](#dockercomposeerror-type-alias)
  - [DockerComposeErrorTypeId](#dockercomposeerrortypeid)
  - [DockerComposeErrorTypeId (type alias)](#dockercomposeerrortypeid-type-alias)
  - [isDockerComposeError](#isdockercomposeerror)
- [Layers](#layers)
  - [layer](#layer)
  - [layerProject](#layerproject)
- [Models](#models)
  - [DockerCompose (interface)](#dockercompose-interface)
  - [DockerComposeProject (interface)](#dockercomposeproject-interface)
- [Params](#params)
  - [BuildOptions (interface)](#buildoptions-interface)
  - [ComposeOptions (interface)](#composeoptions-interface)
  - [ConfigOptions (interface)](#configoptions-interface)
  - [CopyOptions (interface)](#copyoptions-interface)
  - [CreateOptions (interface)](#createoptions-interface)
  - [DownOptions (interface)](#downoptions-interface)
  - [EventsOptions (interface)](#eventsoptions-interface)
  - [ExecOptions (interface)](#execoptions-interface)
  - [ImagesOptions (interface)](#imagesoptions-interface)
  - [KillOptions (interface)](#killoptions-interface)
  - [ListOptions (interface)](#listoptions-interface)
  - [LogsOptions (interface)](#logsoptions-interface)
  - [PortOptions (interface)](#portoptions-interface)
  - [PsOptions (interface)](#psoptions-interface)
  - [PullOptions (interface)](#pulloptions-interface)
  - [PushOptions (interface)](#pushoptions-interface)
  - [RestartOptions (interface)](#restartoptions-interface)
  - [RmOptions (interface)](#rmoptions-interface)
  - [RunOptions (interface)](#runoptions-interface)
  - [StopOptions (interface)](#stopoptions-interface)
  - [UpOptions (interface)](#upoptions-interface)
  - [VersionOptions (interface)](#versionoptions-interface)
  - [WaitOptions (interface)](#waitoptions-interface)
- [Tags](#tags)
  - [DockerCompose](#dockercompose)
- [Type id](#type-id)
  - [DockerComposeProjectTypeId](#dockercomposeprojecttypeid)
  - [DockerComposeProjectTypeId (type alias)](#dockercomposeprojecttypeid-type-alias)
  - [TypeId](#typeid)
  - [TypeId (type alias)](#typeid-type-alias)

---

# Errors

## DockerComposeError

**Signature**

```ts
declare const DockerComposeError: typeof internal.DockerComposeError
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerComposeEngine.ts#L48)

Since v1.0.0

## DockerComposeError (type alias)

**Signature**

```ts
type DockerComposeError = internal.DockerComposeError
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerComposeEngine.ts#L42)

Since v1.0.0

## DockerComposeErrorTypeId

**Signature**

```ts
declare const DockerComposeErrorTypeId: unique symbol
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerComposeEngine.ts#L24)

Since v1.0.0

## DockerComposeErrorTypeId (type alias)

**Signature**

```ts
type DockerComposeErrorTypeId = typeof DockerComposeErrorTypeId
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerComposeEngine.ts#L30)

Since v1.0.0

## isDockerComposeError

**Signature**

```ts
declare const isDockerComposeError: (u: unknown) => u is DockerComposeError
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerComposeEngine.ts#L36)

Since v1.0.0

# Layers

## layer

**Signature**

```ts
declare const layer: (
  options?: { dockerEngineSocket?: string | undefined } | undefined
) => Layer.Layer<
  DockerCompose,
  MobyEndpoints.SystemsError | MobyEndpoints.ContainersError,
  Layer.Layer.Success<DockerEngine.DockerLayer>
>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerComposeEngine.ts#L1067)

Since v1.0.0

## layerProject

**Signature**

```ts
declare const layerProject: <E1>(
  project: Stream.Stream<Uint8Array, E1, never>,
  tagIdentifier: string
) => {
  readonly tag: Context.Tag<DockerComposeProject, DockerComposeProject>
  readonly layer: Layer.Layer<
    DockerComposeProject,
    E1 | internal.DockerComposeError | MobyEndpoints.ContainersError,
    DockerCompose
  >
}
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerComposeEngine.ts#L1079)

Since v1.0.0

# Models

## DockerCompose (interface)

**Signature**

```ts
export interface DockerCompose {
  readonly [TypeId]: TypeId

  readonly build: <E1>(
    project: Stream.Stream<Uint8Array, E1, never>,
    services?: Array<string> | undefined,
    options?: BuildOptions | undefined
  ) => Stream.Stream<string, E1 | DockerComposeError, never>

  readonly config: <E1>(
    project: Stream.Stream<Uint8Array, E1, never>,
    services?: Array<string> | undefined,
    options?: ConfigOptions | undefined
  ) => Effect.Effect<string, E1 | DockerComposeError, never>

  readonly cpTo: <E1, E2>(
    project: Stream.Stream<Uint8Array, E1, never>,
    service: string,
    localSrc: Stream.Stream<Uint8Array, E2, never>,
    remoteDestLocation: string,
    options?: CopyOptions | undefined
  ) => Effect.Effect<void, E1 | E2 | DockerComposeError, never>

  readonly cpFrom: <E1>(
    project: Stream.Stream<Uint8Array, E1, never>,
    service: string,
    remoteSrcLocation: string,
    options?: CopyOptions | undefined
  ) => Stream.Stream<Uint8Array, E1 | DockerComposeError, never>

  readonly create: <E1>(
    project: Stream.Stream<Uint8Array, E1, never>,
    services?: Array<string> | undefined,
    options?: CreateOptions | undefined
  ) => Effect.Effect<void, E1 | DockerComposeError, never>

  readonly down: <E1>(
    project: Stream.Stream<Uint8Array, E1, never>,
    services?: Array<string> | undefined,
    options?: DownOptions | undefined
  ) => Effect.Effect<void, E1 | DockerComposeError, never>

  readonly events: <E1>(
    project: Stream.Stream<Uint8Array, E1, never>,
    services?: Array<string> | undefined,
    options?: EventsOptions | undefined
  ) => Stream.Stream<string, E1 | DockerComposeError, never>

  readonly exec: <E1>(
    project: Stream.Stream<Uint8Array, E1, never>,
    service: string,
    command: string,
    args?: Array<string> | undefined,
    options?: ExecOptions | undefined
  ) => Effect.Effect<
    MobyDemux.MultiplexedChannel<never, MobyEndpoints.ContainersError | Socket.SocketError, never>,
    E1 | DockerComposeError,
    Scope.Scope
  >

  readonly images: <E1>(
    project: Stream.Stream<Uint8Array, E1, never>,
    services?: Array<string> | undefined,
    options?: ImagesOptions | undefined
  ) => Stream.Stream<string, E1 | DockerComposeError, never>

  readonly kill: <E1>(
    project: Stream.Stream<Uint8Array, E1, never>,
    services?: Array<string> | undefined,
    options?: KillOptions | undefined
  ) => Effect.Effect<void, E1 | DockerComposeError, never>

  readonly logs: <E1>(
    project: Stream.Stream<Uint8Array, E1, never>,
    services?: Array<string> | undefined,
    options?: LogsOptions | undefined
  ) => Stream.Stream<string, E1 | DockerComposeError, never>

  readonly ls: <E1>(
    project: Stream.Stream<Uint8Array, E1, never>,
    options?: ListOptions | undefined
  ) => Stream.Stream<string, E1 | DockerComposeError, never>

  readonly pause: <E1>(
    project: Stream.Stream<Uint8Array, E1, never>,
    services?: Array<string> | undefined
  ) => Effect.Effect<void, E1 | DockerComposeError, never>

  readonly port: <E1>(
    project: Stream.Stream<Uint8Array, E1, never>,
    service: string,
    privatePort: number,
    options?: PortOptions | undefined
  ) => Effect.Effect<number, E1 | DockerComposeError, never>

  readonly ps: <E1>(
    project: Stream.Stream<Uint8Array, E1, never>,
    services?: Array<string> | undefined,
    options?: PsOptions | undefined
  ) => Stream.Stream<string, E1 | DockerComposeError, never>

  readonly pull: <E1>(
    project: Stream.Stream<Uint8Array, E1, never>,
    services?: Array<string> | undefined,
    options?: PullOptions | undefined
  ) => Stream.Stream<string, E1 | DockerComposeError, never>

  readonly push: <E1>(
    project: Stream.Stream<Uint8Array, E1, never>,
    services?: Array<string> | undefined,
    options?: PushOptions | undefined
  ) => Effect.Effect<void, E1 | DockerComposeError, never>

  readonly restart: <E1>(
    project: Stream.Stream<Uint8Array, E1, never>,
    services?: Array<string> | undefined,
    options?: RestartOptions | undefined
  ) => Effect.Effect<void, E1 | DockerComposeError, never>

  readonly rm: <E1>(
    project: Stream.Stream<Uint8Array, E1, never>,
    services?: Array<string> | undefined,
    options?: RmOptions | undefined
  ) => Effect.Effect<void, E1 | DockerComposeError, never>

  readonly run: <E1>(
    project: Stream.Stream<Uint8Array, E1, never>,
    service: string,
    command: string,
    args?: Array<string> | undefined,
    options?: RunOptions | undefined
  ) => Effect.Effect<
    MobyDemux.MultiplexedChannel<never, MobyEndpoints.ContainersError | Socket.SocketError, never>,
    E1 | DockerComposeError,
    Scope.Scope
  >

  readonly start: <E1>(
    project: Stream.Stream<Uint8Array, E1, never>,
    services?: Array<string> | undefined
  ) => Effect.Effect<void, E1 | DockerComposeError, never>

  readonly stop: <E1>(
    project: Stream.Stream<Uint8Array, E1, never>,
    services?: Array<string> | undefined,
    options?: StopOptions | undefined
  ) => Effect.Effect<void, E1 | DockerComposeError, never>

  readonly top: <E1>(
    project: Stream.Stream<Uint8Array, E1, never>,
    services?: Array<string> | undefined
  ) => Stream.Stream<string, E1 | DockerComposeError, never>

  readonly unpause: <E1>(
    project: Stream.Stream<Uint8Array, E1, never>,
    services?: Array<string> | undefined
  ) => Effect.Effect<void, E1 | DockerComposeError, never>

  readonly up: <E1>(
    project: Stream.Stream<Uint8Array, E1, never>,
    services?: Array<string> | undefined,
    options?: UpOptions | undefined
  ) => Effect.Effect<void, E1 | DockerComposeError, never>

  readonly version: <E1>(
    project: Stream.Stream<Uint8Array, E1, never>,
    options?: VersionOptions | undefined
  ) => Effect.Effect<string, E1 | DockerComposeError, never>

  readonly wait: <E1>(
    project: Stream.Stream<Uint8Array, E1, never>,
    services: Array.NonEmptyReadonlyArray<string>,
    options?: WaitOptions | undefined
  ) => Effect.Effect<void, E1 | DockerComposeError, never>

  readonly forProject: <E1>(
    project: Stream.Stream<Uint8Array, E1, never>
  ) => Effect.Effect<DockerComposeProject, E1 | DockerComposeError | MobyEndpoints.ContainersError, Scope.Scope>
}
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerComposeEngine.ts#L724)

Since v1.0.0

## DockerComposeProject (interface)

**Signature**

```ts
export interface DockerComposeProject {
  readonly [DockerComposeProjectTypeId]: DockerComposeProjectTypeId

  readonly build: (
    services?: Array<string> | undefined,
    options?: BuildOptions | undefined
  ) => Stream.Stream<string, DockerComposeError, never>

  readonly config: (
    services?: Array<string> | undefined,
    options?: ConfigOptions | undefined
  ) => Effect.Effect<string, DockerComposeError, never>

  readonly cpTo: <E1>(
    service: string,
    localSrc: Stream.Stream<Uint8Array, E1, never>,
    remoteDestLocation: string,
    options?: CopyOptions | undefined
  ) => Effect.Effect<void, E1 | DockerComposeError, never>

  readonly cpFrom: (
    service: string,
    remoteSrcLocation: string,
    options?: CopyOptions | undefined
  ) => Stream.Stream<Uint8Array, DockerComposeError, never>

  readonly create: (
    services?: Array<string> | undefined,
    options?: CreateOptions | undefined
  ) => Effect.Effect<void, DockerComposeError, never>

  readonly down: (
    services?: Array<string> | undefined,
    options?: DownOptions | undefined
  ) => Effect.Effect<void, DockerComposeError, never>

  readonly events: (
    services?: Array<string> | undefined,
    options?: EventsOptions | undefined
  ) => Stream.Stream<string, DockerComposeError, never>

  readonly exec: (
    service: string,
    command: string,
    args?: Array<string> | undefined,
    options?: ExecOptions | undefined
  ) => Effect.Effect<
    MobyDemux.MultiplexedChannel<never, MobyEndpoints.ContainersError | Socket.SocketError, never>,
    DockerComposeError,
    Scope.Scope
  >

  readonly images: (
    services?: Array<string> | undefined,
    options?: ImagesOptions | undefined
  ) => Stream.Stream<string, DockerComposeError, never>

  readonly kill: (
    services?: Array<string> | undefined,
    options?: KillOptions | undefined
  ) => Effect.Effect<void, DockerComposeError, never>

  readonly logs: (
    services?: Array<string> | undefined,
    options?: LogsOptions | undefined
  ) => Stream.Stream<string, DockerComposeError, never>

  readonly ls: (options?: ListOptions | undefined) => Stream.Stream<string, DockerComposeError, never>

  readonly pause: (services?: Array<string> | undefined) => Effect.Effect<void, DockerComposeError, never>

  readonly port: (
    service: string,
    privatePort: number,
    options?: PortOptions | undefined
  ) => Effect.Effect<number, DockerComposeError, never>

  readonly ps: (
    services?: Array<string> | undefined,
    options?: PsOptions | undefined
  ) => Stream.Stream<string, DockerComposeError, never>

  readonly pull: (
    services?: Array<string> | undefined,
    options?: PullOptions | undefined
  ) => Stream.Stream<string, DockerComposeError, never>

  readonly push: (
    services?: Array<string> | undefined,
    options?: PushOptions | undefined
  ) => Effect.Effect<void, DockerComposeError, never>

  readonly restart: (
    services?: Array<string> | undefined,
    options?: RestartOptions | undefined
  ) => Effect.Effect<void, DockerComposeError, never>

  readonly rm: (
    services?: Array<string> | undefined,
    options?: RmOptions | undefined
  ) => Effect.Effect<void, DockerComposeError, never>

  readonly run: (
    service: string,
    command: string,
    args?: Array<string> | undefined,
    options?: RunOptions | undefined
  ) => Effect.Effect<
    MobyDemux.MultiplexedChannel<never, MobyEndpoints.ContainersError | Socket.SocketError, never>,
    DockerComposeError,
    Scope.Scope
  >

  readonly start: (services?: Array<string> | undefined) => Effect.Effect<void, DockerComposeError, never>

  readonly stop: (
    services?: Array<string> | undefined,
    options?: StopOptions | undefined
  ) => Effect.Effect<void, DockerComposeError, never>

  readonly top: (services?: Array<string> | undefined) => Stream.Stream<string, DockerComposeError, never>

  readonly unpause: (services?: Array<string> | undefined) => Effect.Effect<void, DockerComposeError, never>

  readonly up: (
    services?: Array<string> | undefined,
    options?: UpOptions | undefined
  ) => Effect.Effect<void, DockerComposeError, never>

  readonly version: (options?: VersionOptions | undefined) => Stream.Stream<string, DockerComposeError, never>

  readonly wait: (
    services: Array.NonEmptyReadonlyArray<string>,
    options?: WaitOptions | undefined
  ) => Effect.Effect<void, DockerComposeError, never>
}
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerComposeEngine.ts#L926)

Since v1.0.0

# Params

## BuildOptions (interface)

**Signature**

```ts
export interface BuildOptions {
  /** Set build-time variables for services. */
  readonly buildArgs?: Record<string, string> | undefined

  /** Set builder to use. */
  readonly builder?: string | undefined

  /** Set memory limit for the build container. Not supported by BuildKit. */
  readonly memoryLimit?: number | undefined

  /** Do not use cache when building the image. */
  readonly noCache?: boolean | undefined

  /** Always attempt to pull a newer version of the image. */
  readonly pull?: boolean | undefined

  /** Push service images. */
  readonly push?: boolean | undefined

  /** Don't print anything to STDOUT. */
  readonly quiet?: boolean | undefined

  /**
   * Set SSH authentications used when building service images. (use 'default'
   * for using your default SSH Agent)
   */
  readonly ssh?: string | undefined

  /** Also build dependencies (transitively). */
  readonly withDependencies?: boolean | undefined
}
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerComposeEngine.ts#L93)

Since v1.0.0

## ComposeOptions (interface)

**Signature**

```ts
export interface ComposeOptions {
  /** Include all resources, even those not used by services */
  readonly allResources?: boolean | undefined

  /** Control when to print ANSI control characters */
  readonly ansi?: "never" | "always" | "auto" | undefined

  /** Run compose in backward compatibility mode */
  readonly compatibility?: boolean | undefined

  /** Execute command in dry run mode */
  readonly dryRun?: boolean | undefined

  /** Specify an alternate environment file */
  readonly envFile?: Array<string> | undefined

  /** Compose configuration files */
  readonly file?: Array<string> | undefined

  /** Control max parallelism, -1 for unlimited (default -1) */
  readonly parallel?: number | undefined

  /** Specify a profile to enable */
  readonly profile?: Array<string> | undefined

  /** Set type of progress output (auto, tty, plain, json, quiet). */
  readonly progress?: "auto" | "tty" | "plain" | "json" | "quiet" | undefined

  /** Specify an alternate working directory */
  readonly projectDirectory?: string | undefined

  /** Project name */
  readonly projectName?: string | undefined
}
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerComposeEngine.ts#L54)

Since v1.0.0

## ConfigOptions (interface)

**Signature**

```ts
export interface ConfigOptions {
  /** Print environment used for interpolation. */
  readonly environment?: boolean | undefined

  /** Format the output. */
  readonly format?: "yaml" | "json" | undefined

  /** Print the service config hash, one per line. */
  readonly hash?: boolean | undefined

  /** Print the image names, one per line. */
  readonly images?: boolean | undefined

  /**
   * Don't check model consistency - warning: may produce invalid Compose
   * output
   */
  readonly noConsistency?: boolean | undefined

  /** Don't interpolate environment variables */
  readonly noInterpolate?: boolean | undefined

  /** Don't normalize compose model */
  readonly noNormalize?: boolean | undefined

  /** Don't resolve file paths */
  readonly noPathResolution?: boolean | undefined

  /** Save to file (default to stdout) */
  readonly output?: string | undefined

  /** Only validate the configuration, don't print anything */
  readonly quiet?: boolean | undefined

  /** Pin image tags to digests */
  readonly resolveImageDigests?: boolean | undefined

  /** Print the service names, one per line. */
  readonly services?: boolean | undefined

  /** Print model variables and default values. */
  readonly variables?: boolean | undefined

  /** Print the volume names, one per line. */
  readonly volumes?: boolean | undefined
}
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerComposeEngine.ts#L129)

Since v1.0.0

## CopyOptions (interface)

**Signature**

```ts
export interface CopyOptions {
  /** Include containers created by the run command */
  readonly all?: boolean | undefined

  /** Archive mode (copy all uid/gid information) */
  readonly archive?: boolean | undefined

  /** Always follow symbol link in SRC_PATH */
  readonly followLink?: boolean | undefined

  /** Index of the container if service has multiple replicas */
  readonly index?: number | undefined
}
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerComposeEngine.ts#L180)

Since v1.0.0

## CreateOptions (interface)

**Signature**

```ts
export interface CreateOptions {
  /** Build images before starting containers */
  readonly build?: boolean | undefined

  /** Recreate containers even if their configuration and image haven't changed */
  readonly forceRecreate?: boolean | undefined

  /** Don't build an image, even if it's policy */
  readonly noBuild?: boolean | undefined

  /**
   * If containers already exist, don't recreate them. Incompatible with
   * --force-recreate.
   */
  readonly noRecreate?: boolean | undefined

  /** Pull image before running ("always"|"missing"|"never"|"build") */
  readonly pullPolicy?: "always" | "missing" | "never" | "build" | undefined

  /** Pull without printing progress information */
  readonly quietPull?: boolean | undefined

  /** Remove containers for services not defined in the Compose file */
  readonly removeOrphans?: boolean | undefined

  /**
   * Scale SERVICE to NUM instances. Overrides the `scale` setting in the
   * Compose file if present.
   */
  readonly scale?: Record<string, number> | undefined

  /** Assume "yes" as answer to all prompts and run non-interactively */
  readonly y?: boolean | undefined
}
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerComposeEngine.ts#L198)

Since v1.0.0

## DownOptions (interface)

**Signature**

```ts
export interface DownOptions {
  /** Remove containers for services not defined in the Compose file. */
  readonly removeOrphans?: boolean | undefined

  /**
   * Remove images used by services. "local" remove only images that don't
   * have a custom tag ("local"|"all").
   */
  readonly rmi?: "all" | "local" | "none" | undefined

  /** Specify a shutdown timeout in seconds. */
  readonly timeout?: number | undefined

  /**
   * Remove named volumes declared in the "volumes" section of the Compose
   * file and anonymous volumes attached to containers.
   */
  readonly volumes?: boolean | undefined
}
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerComposeEngine.ts#L237)

Since v1.0.0

## EventsOptions (interface)

**Signature**

```ts
export interface EventsOptions {
  /** Output events as a stream of json objects */
  readonly json?: boolean | undefined
}
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerComposeEngine.ts#L261)

Since v1.0.0

## ExecOptions (interface)

**Signature**

```ts
export interface ExecOptions {
  /** Detached mode: Run command in the background */
  readonly detach?: boolean | undefined

  /** Set environment variables */
  readonly env?: Record<string, string> | Array<string> | undefined

  /** Index of the container if service has multiple replicas */
  readonly index?: number | undefined

  /**
   * Disable pseudo-TTY allocation. By default `docker compose exec` allocates
   * a TTY.
   *
   * @default true
   */
  readonly noTTY?: boolean | undefined

  /** Give extended privileges to the process */
  readonly privileged?: boolean | undefined

  /** Run the command as this user */
  readonly user?: string | undefined

  /** Path to workdir directory for this command */
  readonly workdir?: string | undefined
}
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerComposeEngine.ts#L270)

Since v1.0.0

## ImagesOptions (interface)

**Signature**

```ts
export interface ImagesOptions {
  /** Format the output. */
  readonly format?: "table" | "json" | undefined

  /** Only display Ids */
  readonly quiet?: boolean | undefined
}
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerComposeEngine.ts#L302)

Since v1.0.0

## KillOptions (interface)

**Signature**

```ts
export interface KillOptions {
  /** Remove containers for services not defined in the Compose file. */
  readonly removeOrphans?: boolean | undefined

  /** SIGNAL to send to the container. */
  readonly signal?: string | undefined
}
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerComposeEngine.ts#L314)

Since v1.0.0

## ListOptions (interface)

**Signature**

```ts
export interface ListOptions {
  /** Show all stopped Compose projects */
  readonly all?: boolean | undefined

  /** Filter output based on conditions provided */
  readonly filter?: string | Record<string, string> | undefined

  /** Format the output. */
  readonly format?: "table" | "json" | undefined

  /** Only display project names */
  readonly quiet?: boolean | undefined
}
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerComposeEngine.ts#L362)

Since v1.0.0

## LogsOptions (interface)

**Signature**

```ts
export interface LogsOptions {
  /** Follow log output */
  readonly follow?: boolean | undefined

  /** Index of the container if service has multiple replicas */
  readonly index?: number | undefined

  /** Produce monochrome output */
  readonly noColor?: boolean | undefined

  /** Don't print prefix in logs */
  readonly noLogPrefix?: boolean | undefined

  /**
   * Show logs since timestamp (e.g. 2013-01-02T13:23:37Z) or relative (e.g.
   * 42m for 42 minutes)
   */
  readonly since?: string | undefined

  /** Number of lines to show from the end of the logs for each container */
  readonly tail?: number | "all" | undefined

  /** Show timestamps */
  readonly timestamps?: boolean | undefined

  /**
   * Show logs before a timestamp (e.g. 2013-01-02T13:23:37Z) or relative
   * (e.g. 42m for 42 minutes)
   */
  readonly until?: string | undefined
}
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerComposeEngine.ts#L326)

Since v1.0.0

## PortOptions (interface)

**Signature**

```ts
export interface PortOptions {
  /** Index of the container if service has multiple replicas. */
  readonly index?: number | undefined

  /** Tcp or udp. */
  readonly protocol?: "tcp" | "udp" | undefined
}
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerComposeEngine.ts#L380)

Since v1.0.0

## PsOptions (interface)

**Signature**

```ts
export interface PsOptions {
  /** Show all stopped containers (including those created by the run command) */
  readonly all?: boolean | undefined

  /** Filter services by a property (supported filters: status) */
  readonly filter?: string | Record<string, string> | undefined

  /**
   * Format output using a custom template: 'table': Print output in table
   * format with column headers (default) 'table TEMPLATE': Print output in
   * table format using the given Go template 'json': Print in JSON format
   * 'TEMPLATE': Print output using the given Go template
   */
  readonly format?: string | undefined

  /** Don't truncate output */
  readonly noTrunc?: boolean | undefined

  /** Include orphaned services (not declared by project) */
  readonly orphans?: boolean | undefined

  /** Only display IDs */
  readonly quiet?: boolean | undefined

  /** Display services */
  readonly services?: boolean | undefined

  /** Filter services by status. */
  readonly status?: "paused" | "restarting" | "removing" | "running" | "dead" | "created" | "exited" | undefined
}
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerComposeEngine.ts#L392)

Since v1.0.0

## PullOptions (interface)

**Signature**

```ts
export interface PullOptions {
  /** Ignore images that can be built. */
  readonly ignoreBuildable?: boolean | undefined

  /** Pull what it can and ignores images with pull failures. */
  readonly ignorePullFailure?: boolean | undefined

  /** Also pull services declared as dependencies. */
  readonly includeDeps?: boolean | undefined

  /** Apply pull policy. */
  readonly policy?: "always" | "missing" | undefined

  /** Pull without printing progress information. */
  readonly quiet?: boolean | undefined
}
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerComposeEngine.ts#L427)

Since v1.0.0

## PushOptions (interface)

**Signature**

```ts
export interface PushOptions {
  /** Push what it can and ignores images with push failures */
  readonly ignorePushFailures?: boolean | undefined

  /** Also push images of services declared as dependencies */
  readonly includeDeps?: boolean | undefined

  /** Push without printing progress information */
  readonly quiet?: boolean | undefined
}
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerComposeEngine.ts#L448)

Since v1.0.0

## RestartOptions (interface)

**Signature**

```ts
export interface RestartOptions {
  /** Don't restart dependent services. */
  readonly noDeps?: boolean | undefined

  /** Specify a shutdown timeout in seconds */
  readonly timeout?: number | undefined
}
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerComposeEngine.ts#L463)

Since v1.0.0

## RmOptions (interface)

**Signature**

```ts
export interface RmOptions {
  /** Don't ask to confirm removal */
  readonly force?: boolean | undefined

  /** Stop the containers, if required, before removing */
  readonly stop?: boolean | undefined

  /** Remove any anonymous volumes attached to containers */
  readonly volumes?: boolean | undefined
}
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerComposeEngine.ts#L475)

Since v1.0.0

## RunOptions (interface)

**Signature**

```ts
export interface RunOptions {
  /** Build image before starting container */
  readonly build?: boolean | undefined

  /** Add Linux capabilities */
  readonly capAdd?: Array<string> | undefined

  /** Drop Linux capabilities */
  readonly capDrop?: Array<string> | undefined

  /** Run container in background and print container ID */
  readonly detach?: boolean | undefined

  /** Override the entrypoint of the image */
  readonly entrypoint?: string | undefined

  /** Set environment variables */
  readonly env?: Array<string> | undefined

  /** Keep STDIN open even if not attached */
  readonly interactive?: boolean | undefined

  /** Add or override a label */
  readonly label?: Array<string> | undefined

  /** Assign a name to the container */
  readonly name?: string | undefined

  /** Disable pseudo-TTY allocation (default: auto-detected) */
  readonly noTTY?: boolean | undefined

  /** Don't start linked services */
  readonly noDeps?: boolean | undefined

  /** Publish a container's port(s) to the host */
  readonly publish?: Array<string> | undefined

  /** Pull image before running ("always"|"missing"|"never") */
  readonly pullPolicy?: "always" | "missing" | "never" | undefined

  /** Pull without printing progress information */
  readonly quietPull?: boolean | undefined

  /** Remove containers for services not defined in the Compose file */
  readonly removeOrphans?: boolean | undefined

  /** Automatically remove the container when it exits */
  readonly rm?: boolean | undefined

  /** Run command with all service's ports enabled and mapped to the host */
  readonly servicePorts?: boolean | undefined

  /**
   * Use the service's network useAliases in the network(s) the container
   * connects to
   */
  readonly useAliases?: boolean | undefined

  /** Run as specified username or uid */
  readonly user?: string | undefined

  /** Bind mount a volume */
  readonly volume?: Array<string> | undefined

  /** Working directory inside the container */
  readonly workdir?: string | undefined
}
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerComposeEngine.ts#L490)

Since v1.0.0

## StopOptions (interface)

**Signature**

```ts
export interface StopOptions {
  /** Specify a shutdown timeout in seconds */
  readonly timeout?: number | undefined
}
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerComposeEngine.ts#L562)

Since v1.0.0

## UpOptions (interface)

**Signature**

```ts
export interface UpOptions {
  /**
   * Stops all containers if any container was stopped. Incompatible with
   * detach.
   */
  readonly abortOnContainerExit?: boolean | undefined

  /**
   * Stops all containers if any container was stopped. Incompatible with
   * detach.
   */
  readonly abortOnContainerFailure?: boolean | undefined

  /** Recreate dependent containers. Incompatible with no-recreate. */
  readonly alwaysRecreateDeps?: boolean | undefined

  /**
   * Restrict attaching to the specified services. Incompatible with
   * attach-dependencies.
   */
  readonly attach?: boolean | undefined

  /** Automatically attach to log output of dependent services. */
  readonly attachDependencies?: boolean | undefined

  /** Build images before starting containers. */
  readonly build?: boolean | undefined

  /** Detached mode: Run containers in the background. */
  readonly detach?: boolean | undefined

  /**
   * Return the exit code of the selected service container. Implies
   * abort-on-container-exit.
   */
  readonly exitCodeFrom?: string | undefined

  /**
   * Recreate containers even if their configuration and image haven't
   * changed.
   */
  readonly forceRecreate?: boolean | undefined

  /**
   * Enable interactive shortcuts when running attached. Incompatible with
   * detach.
   */
  readonly menu?: boolean | undefined

  /** Do not attach (stream logs) to the specified services. */
  readonly noAttach?: boolean | undefined

  /** Don't build an image, even if it's policy. */
  readonly noBuild?: boolean | undefined

  /** Produce monochrome output. */
  readonly noColor?: boolean | undefined

  /** Don't start linked services. */
  readonly noDeps?: boolean | undefined

  /** Don't print prefix in logs. */
  readonly noLogPrefix?: boolean | undefined

  /**
   * If containers already exist, don't recreate them. Incompatible with
   * force-recreate.
   */
  readonly noRecreate?: boolean | undefined

  /** Don't start the services after creating them. */
  readonly noStart?: boolean | undefined

  /** Pull image before running */
  readonly pull?: "always" | "missing" | "never" | undefined

  /** Pull without printing progress information. */
  readonly quietPull?: boolean | undefined

  /** Remove containers for services not defined in the Compose file. */
  readonly removeOrphans?: boolean | undefined

  /**
   * Recreate anonymous volumes instead of retrieving data from the previous
   * containers.
   */
  readonly renewAnonVolumes?: boolean | undefined

  /**
   * Scale SERVICE to NUM instances. Overrides the scale setting in the
   * Compose file if present.
   */
  readonly scale?: string | undefined

  /**
   * Use this timeout in seconds for container shutdown when attached or when
   * containers are already running.
   */
  readonly timeout?: number | undefined

  /** Show timestamps. */
  readonly timestamps?: boolean | undefined

  /** Wait for services to be running|healthy. Implies detached mode. */
  readonly wait?: boolean | string

  /**
   * Maximum duration in seconds to wait for the project to be running or
   * healthy.
   */
  readonly waitTimeout?: number | undefined

  /** Assume "yes" as answer to all prompts and run non-interactively. */
  readonly yes?: boolean | undefined
}
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerComposeEngine.ts#L571)

Since v1.0.0

## VersionOptions (interface)

**Signature**

```ts
export interface VersionOptions {
  /** Format the output. */
  readonly format?: "json" | "pretty"

  /** Shows only Compose's version number */
  readonly short?: boolean | undefined
}
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerComposeEngine.ts#L691)

Since v1.0.0

## WaitOptions (interface)

**Signature**

```ts
export interface WaitOptions {
  /** Drops project when the first container stops */
  readonly downProject?: boolean | undefined
}
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerComposeEngine.ts#L703)

Since v1.0.0

# Tags

## DockerCompose

**Signature**

```ts
declare const DockerCompose: Context.Tag<DockerCompose, DockerCompose>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerComposeEngine.ts#L908)

Since v1.0.0

# Type id

## DockerComposeProjectTypeId

**Signature**

```ts
declare const DockerComposeProjectTypeId: unique symbol
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerComposeEngine.ts#L914)

Since v1.0.0

## DockerComposeProjectTypeId (type alias)

**Signature**

```ts
type DockerComposeProjectTypeId = typeof DockerComposeProjectTypeId
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerComposeEngine.ts#L920)

Since v1.0.0

## TypeId

**Signature**

```ts
declare const TypeId: unique symbol
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerComposeEngine.ts#L712)

Since v1.0.0

## TypeId (type alias)

**Signature**

```ts
type TypeId = typeof TypeId
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerComposeEngine.ts#L718)

Since v1.0.0
