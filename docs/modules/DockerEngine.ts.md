---
title: DockerEngine.ts
nav_order: 4
parent: Modules
---

## DockerEngine.ts overview

Docker engine.

Since v1.0.0

---

## Exports Grouped by Category

- [Auth](#auth)
  - [RegistryAuth](#registryauth)
- [Docker](#docker)
  - [build](#build)
  - [buildScoped](#buildscoped)
  - [exec](#exec)
  - [execNonBlocking](#execnonblocking)
  - [execWebsockets](#execwebsockets)
  - [execWebsocketsNonBlocking](#execwebsocketsnonblocking)
  - [images](#images)
  - [info](#info)
  - [ping](#ping)
  - [pingHead](#pinghead)
  - [ps](#ps)
  - [pull](#pull)
  - [pullScoped](#pullscoped)
  - [push](#push)
  - [run](#run)
  - [runScoped](#runscoped)
  - [search](#search)
  - [start](#start)
  - [stop](#stop)
  - [version](#version)
- [Errors](#errors)
  - [DockerError](#dockererror)
  - [DockerError (type alias)](#dockererror-type-alias)
  - [DockerErrorTypeId](#dockererrortypeid)
  - [DockerErrorTypeId (type alias)](#dockererrortypeid-type-alias)
  - [isDockerError](#isdockererror)
- [Layers](#layers)
  - [DockerLayer (type alias)](#dockerlayer-type-alias)
  - [DockerLayerWithoutHttpClientOrWebsocketConstructor (type alias)](#dockerlayerwithouthttpclientorwebsocketconstructor-type-alias)
  - [layerAgnostic](#layeragnostic)
  - [layerBun](#layerbun)
  - [layerDeno](#layerdeno)
  - [layerFetch](#layerfetch)
  - [layerNodeJS](#layernodejs)
  - [layerUndici](#layerundici)
  - [layerWeb](#layerweb)
  - [layerWithoutHttpCLient](#layerwithouthttpclient)

---

# Auth

## RegistryAuth

**See**

- https://docs.docker.com/reference/api/engine/version/v1.51/#section/Authentication

**Signature**

```ts
declare const RegistryAuth: typeof RegistryAuth
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerEngine.ts#L186)

Since v1.0.0

# Docker

## build

Implements the `docker build` command. It doesn't have all the flags that the
images build endpoint exposes.

**Signature**

```ts
declare const build: <E1>({
  buildargs,
  context,
  dockerfile,
  platform,
  tag
}: {
  tag: string
  platform?: string | undefined
  dockerfile?: string | undefined
  context: Stream.Stream<Uint8Array, E1, never>
  buildargs?: Record<string, string | undefined> | undefined
}) => Stream.Stream<MobySchemas.JSONMessage, DockerError, MobyEndpoints.Images>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerEngine.ts#L196)

Since v1.0.0

## buildScoped

Implements the `docker build` command as a scoped effect. When the scope is
closed, the built image is removed. It doesn't have all the flags that the
images build endpoint exposes.

**Signature**

```ts
declare const buildScoped: <E1>({
  buildargs,
  context,
  dockerfile,
  platform,
  tag
}: {
  tag: string
  platform?: string | undefined
  dockerfile?: string | undefined
  buildargs?: Record<string, string | undefined> | undefined
  context: Stream.Stream<Uint8Array, E1, never>
}) => Effect.Effect<
  Stream.Stream<MobySchemas.JSONMessage, DockerError, never>,
  never,
  Scope.Scope | MobyEndpoints.Images
>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerEngine.ts#L218)

Since v1.0.0

## exec

Implements the `docker exec` command in a blocking fashion. Incompatible with
web.

**Signature**

```ts
declare const exec: ({
  command,
  containerId
}: {
  command: string | Array<string>
  containerId: IdSchemas.ContainerIdentifier
}) => Effect.Effect<
  [exitCode: bigint, output: string],
  Socket.SocketError | Schema.SchemaError | DockerError,
  MobyEndpoints.Execs
>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerEngine.ts#L243)

Since v1.0.0

## execNonBlocking

Implements the `docker exec` command in a non blocking fashion. Incompatible
with web when not detached.

**Signature**

```ts
declare const execNonBlocking: <const T extends boolean = false>({
  command,
  containerId,
  detach
}: {
  detach: T
  command: string | Array<string>
  containerId: IdSchemas.ContainerIdentifier
}) => Effect.Effect<
  [[T] extends [false] ? MobyDemux.RawSocket | MobyDemux.MultiplexedSocket : void, IdSchemas.ExecIdentifier],
  Socket.SocketError | Schema.SchemaError | DockerError,
  MobyEndpoints.Execs
>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerEngine.ts#L262)

Since v1.0.0

## execWebsockets

Implements the `docker exec` command in a blocking fashion with websockets as
the underlying transport instead of the docker engine exec apis so that is
can be compatible with web.

**Signature**

```ts
declare const execWebsockets: ({
  command,
  containerId
}: {
  command: string | Array<string>
  containerId: IdSchemas.ContainerIdentifier
}) => Effect.Effect<
  readonly [stdout: string, stderr: string],
  Socket.SocketError | Schema.SchemaError | DockerError,
  MobyEndpoints.Containers
>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerEngine.ts#L284)

Since v1.0.0

## execWebsocketsNonBlocking

Implements the `docker exec` command in a non blocking fashion with
websockets as the underlying transport instead of the docker engine exec apis
so that is can be compatible with web.

**Signature**

```ts
declare const execWebsocketsNonBlocking: ({
  command,
  containerId,
  cwd
}: {
  command: string | Array<string>
  containerId: IdSchemas.ContainerIdentifier
  cwd?: string | undefined
}) => Effect.Effect<
  MobyDemux.MultiplexedChannel<never, Socket.SocketError | DockerError, never>,
  never,
  MobyEndpoints.Containers
>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerEngine.ts#L304)

Since v1.0.0

## images

Implements the `docker images` command.

**Signature**

```ts
declare const images: (
  options?: Parameters<MobyEndpoints.Images["Service"]["list"]>[0]
) => Effect.Effect<ReadonlyArray<MobySchemas.ImageSummary>, DockerError, MobyEndpoints.Images>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerEngine.ts#L324)

Since v1.0.0

## info

Implements the `docker info` command.

**Signature**

```ts
declare const info: () => Effect.Effect<MobySchemas.SystemInfo, DockerError, MobyEndpoints.System>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerEngine.ts#L334)

Since v1.0.0

## ping

Implements the `docker ping` command.

**Signature**

```ts
declare const ping: () => Effect.Effect<void, DockerError, MobyEndpoints.System>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerEngine.ts#L342)

Since v1.0.0

## pingHead

Implements the `docker ping` command.

**Signature**

```ts
declare const pingHead: () => Effect.Effect<void, DockerError, MobyEndpoints.System>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerEngine.ts#L350)

Since v1.0.0

## ps

Implements the `docker ps` command.

**Signature**

```ts
declare const ps: (
  options?: Parameters<MobyEndpoints.Containers["Service"]["list"]>[0]
) => Effect.Effect<ReadonlyArray<MobySchemas.ContainerSummary>, DockerError, MobyEndpoints.Containers>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerEngine.ts#L358)

Since v1.0.0

## pull

Implements the `docker pull` command. It does not have all the flags that the
images create endpoint exposes.

**Signature**

```ts
declare const pull: ({
  image,
  platform
}: {
  image: string
  platform?: string | undefined
}) => Stream.Stream<MobySchemas.JSONMessage, DockerError, MobyEndpoints.Images>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerEngine.ts#L370)

Since v1.0.0

## pullScoped

Implements the `docker pull` command as a scoped effect. When the scope is
closed, the pulled image is removed. It doesn't have all the flag =
internalDocker.flags that the images create endpoint exposes.

**Signature**

```ts
declare const pullScoped: ({
  image,
  platform
}: {
  image: string
  platform?: string | undefined
}) => Effect.Effect<
  Stream.Stream<MobySchemas.JSONMessage, DockerError, never>,
  never,
  MobyEndpoints.Images | Scope.Scope
>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerEngine.ts#L386)

Since v1.0.0

## push

Implements the `docker push` command.

**Signature**

```ts
declare const push: (
  name: string,
  options: Parameters<MobyEndpoints.Images["Service"]["push"]>[1]
) => Stream.Stream<MobySchemas.JSONMessage, DockerError, MobyEndpoints.Images>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerEngine.ts#L404)

Since v1.0.0

## run

Implements `docker run` command.

**Signature**

```ts
declare const run: (
  options: Omit<(typeof MobySchemas.ContainerCreateRequest)["~type.make.in"], "HostConfig"> & {
    readonly name?: string | undefined
    readonly platform?: string | undefined
    readonly HostConfig?: (typeof MobySchemas.ContainerHostConfig)["~type.make.in"] | undefined
  }
) => Effect.Effect<MobySchemas.ContainerInspectResponse, DockerError, MobyEndpoints.Containers>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerEngine.ts#L415)

Since v1.0.0

## runScoped

Implements `docker run` command as a scoped effect. When the scope is closed,
both the image and the container is removed = internalDocker.removed.

**Signature**

```ts
declare const runScoped: (
  options: Omit<(typeof MobySchemas.ContainerCreateRequest)["~type.make.in"], "HostConfig"> & {
    readonly name?: string | undefined
    readonly platform?: string | undefined
    readonly HostConfig?: (typeof MobySchemas.ContainerHostConfig)["~type.make.in"] | undefined
  }
) => Effect.Effect<MobySchemas.ContainerInspectResponse, DockerError, Scope.Scope | MobyEndpoints.Containers>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerEngine.ts#L430)

Since v1.0.0

## search

Implements the `docker search` command.

**Signature**

```ts
declare const search: (
  options: Parameters<MobyEndpoints.Images["Service"]["search"]>[0]
) => Effect.Effect<ReadonlyArray<MobySchemas.RegistrySearchResult>, DockerError, MobyEndpoints.Images>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerEngine.ts#L445)

Since v1.0.0

## start

Implements the `docker start` command.

**Signature**

```ts
declare const start: (
  containerId: IdSchemas.ContainerIdentifier
) => Effect.Effect<void, DockerError, MobyEndpoints.Containers>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerEngine.ts#L456)

Since v1.0.0

## stop

Implements the `docker stop` command.

**Signature**

```ts
declare const stop: (
  containerId: IdSchemas.ContainerIdentifier
) => Effect.Effect<void, DockerError, MobyEndpoints.Containers>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerEngine.ts#L466)

Since v1.0.0

## version

Implements the `docker version` command.

**Signature**

```ts
declare const version: () => Effect.Effect<MobySchemas.TypesVersion, DockerError, MobyEndpoints.System>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerEngine.ts#L476)

Since v1.0.0

# Errors

## DockerError

**Signature**

```ts
declare const DockerError: typeof internalCircular.DockerError
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerEngine.ts#L55)

Since v1.0.0

## DockerError (type alias)

**Signature**

```ts
type DockerError = internalCircular.DockerError
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerEngine.ts#L49)

Since v1.0.0

## DockerErrorTypeId

**Signature**

```ts
declare const DockerErrorTypeId: unique symbol
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerEngine.ts#L31)

Since v1.0.0

## DockerErrorTypeId (type alias)

**Signature**

```ts
type DockerErrorTypeId = typeof DockerErrorTypeId
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerEngine.ts#L37)

Since v1.0.0

## isDockerError

**Signature**

```ts
declare const isDockerError: (u: unknown) => u is DockerError
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerEngine.ts#L43)

Since v1.0.0

# Layers

## DockerLayer (type alias)

**Signature**

```ts
type DockerLayer = Layer.Layer<
  | MobyEndpoints.Configs
  | MobyEndpoints.Containers
  | MobyEndpoints.Distributions
  | MobyEndpoints.Execs
  | MobyEndpoints.Images
  | MobyEndpoints.Networks
  | MobyEndpoints.Nodes
  | MobyEndpoints.Plugins
  | MobyEndpoints.Secrets
  | MobyEndpoints.Services
  | MobyEndpoints.Sessions
  | MobyEndpoints.Swarm
  | MobyEndpoints.System
  | MobyEndpoints.Tasks
  | MobyEndpoints.Volumes,
  never,
  never
>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerEngine.ts#L61)

Since v1.0.0

## DockerLayerWithoutHttpClientOrWebsocketConstructor (type alias)

**Signature**

```ts
type DockerLayerWithoutHttpClientOrWebsocketConstructor = Layer.Layer<
  Layer.Success<DockerLayer>,
  Layer.Error<DockerLayer>,
  Layer.Services<DockerLayer> | HttpClient.HttpClient | Socket.WebSocketConstructor
>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerEngine.ts#L85)

Since v1.0.0

## layerAgnostic

**Signature**

```ts
declare const layerAgnostic: (
  connectionOptions: MobyConnection.HttpConnectionOptionsTagged | MobyConnection.HttpsConnectionOptionsTagged
) => DockerLayerWithoutHttpClientOrWebsocketConstructor
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerEngine.ts#L173)

Since v1.0.0

## layerBun

**Signature**

```ts
declare const layerBun: (connectionOptions: MobyConnection.MobyConnectionOptions) => DockerLayer
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerEngine.ts#L126)

Since v1.0.0

## layerDeno

**Signature**

```ts
declare const layerDeno: (connectionOptions: MobyConnection.MobyConnectionOptions) => DockerLayer
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerEngine.ts#L135)

Since v1.0.0

## layerFetch

**Signature**

```ts
declare const layerFetch: (
  connectionOptions: MobyConnection.HttpConnectionOptionsTagged | MobyConnection.HttpsConnectionOptionsTagged
) => DockerLayer
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerEngine.ts#L163)

Since v1.0.0

## layerNodeJS

**Signature**

```ts
declare const layerNodeJS: (connectionOptions: MobyConnection.MobyConnectionOptions) => DockerLayer
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerEngine.ts#L117)

Since v1.0.0

## layerUndici

**Signature**

```ts
declare const layerUndici: (connectionOptions: MobyConnection.MobyConnectionOptions) => DockerLayer
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerEngine.ts#L144)

Since v1.0.0

## layerWeb

**Signature**

```ts
declare const layerWeb: (
  connectionOptions: MobyConnection.HttpConnectionOptionsTagged | MobyConnection.HttpsConnectionOptionsTagged
) => DockerLayer
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerEngine.ts#L153)

Since v1.0.0

## layerWithoutHttpCLient

**Signature**

```ts
declare const layerWithoutHttpCLient: DockerLayerWithoutHttpClientOrWebsocketConstructor
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerEngine.ts#L95)

Since v1.0.0
