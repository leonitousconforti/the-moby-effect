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

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerEngine.ts#L188)

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

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerEngine.ts#L210)

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
  [exitCode: Schema.Schema.Type<Schemas.Number.I64>, output: string],
  Socket.SocketError | ParseResult.ParseError | DockerError,
  MobyEndpoints.Execs
>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerEngine.ts#L235)

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
  Socket.SocketError | ParseResult.ParseError | DockerError,
  MobyEndpoints.Execs
>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerEngine.ts#L254)

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
  Socket.SocketError | ParseResult.ParseError | DockerError,
  MobyEndpoints.Containers
>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerEngine.ts#L276)

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

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerEngine.ts#L296)

Since v1.0.0

## images

Implements the `docker images` command.

**Signature**

```ts
declare const images: (
  options?: Parameters<MobyEndpoints.Images["list"]>[0]
) => Effect.Effect<ReadonlyArray<MobySchemas.ImageSummary>, DockerError, MobyEndpoints.Images>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerEngine.ts#L316)

Since v1.0.0

## info

Implements the `docker info` command.

**Signature**

```ts
declare const info: () => Effect.Effect<MobySchemas.SystemInfo, DockerError, MobyEndpoints.System>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerEngine.ts#L326)

Since v1.0.0

## ping

Implements the `docker ping` command.

**Signature**

```ts
declare const ping: () => Effect.Effect<void, DockerError, MobyEndpoints.System>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerEngine.ts#L334)

Since v1.0.0

## pingHead

Implements the `docker ping` command.

**Signature**

```ts
declare const pingHead: () => Effect.Effect<void, DockerError, MobyEndpoints.System>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerEngine.ts#L342)

Since v1.0.0

## ps

Implements the `docker ps` command.

**Signature**

```ts
declare const ps: (
  options?: Parameters<MobyEndpoints.Containers["list"]>[0]
) => Effect.Effect<ReadonlyArray<MobySchemas.ContainerSummary>, DockerError, MobyEndpoints.Containers>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerEngine.ts#L350)

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

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerEngine.ts#L362)

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

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerEngine.ts#L378)

Since v1.0.0

## push

Implements the `docker push` command.

**Signature**

```ts
declare const push: (
  name: string,
  options: Parameters<MobyEndpoints.Images["push"]>[1]
) => Stream.Stream<MobySchemas.JSONMessage, DockerError, MobyEndpoints.Images>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerEngine.ts#L396)

Since v1.0.0

## run

Implements `docker run` command.

**Signature**

```ts
declare const run: (
  options: Omit<ConstructorParameters<typeof MobySchemas.ContainerCreateRequest>[0], "HostConfig"> & {
    readonly name?: string | undefined
    readonly platform?: string | undefined
    readonly HostConfig?: ConstructorParameters<typeof MobySchemas.ContainerHostConfig>[0] | undefined
  }
) => Effect.Effect<MobySchemas.ContainerInspectResponse, DockerError, MobyEndpoints.Containers>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerEngine.ts#L407)

Since v1.0.0

## runScoped

Implements `docker run` command as a scoped effect. When the scope is closed,
both the image and the container is removed = internalDocker.removed.

**Signature**

```ts
declare const runScoped: (
  options: Omit<ConstructorParameters<typeof MobySchemas.ContainerCreateRequest>[0], "HostConfig"> & {
    readonly name?: string | undefined
    readonly platform?: string | undefined
    readonly HostConfig?: ConstructorParameters<typeof MobySchemas.ContainerHostConfig>[0] | undefined
  }
) => Effect.Effect<MobySchemas.ContainerInspectResponse, DockerError, Scope.Scope | MobyEndpoints.Containers>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerEngine.ts#L422)

Since v1.0.0

## search

Implements the `docker search` command.

**Signature**

```ts
declare const search: (
  options: Parameters<MobyEndpoints.Images["search"]>[0]
) => Effect.Effect<ReadonlyArray<MobySchemas.RegistrySearchResult>, DockerError, MobyEndpoints.Images>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerEngine.ts#L437)

Since v1.0.0

## start

Implements the `docker start` command.

**Signature**

```ts
declare const start: (
  containerId: IdSchemas.ContainerIdentifier
) => Effect.Effect<void, DockerError, MobyEndpoints.Containers>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerEngine.ts#L448)

Since v1.0.0

## stop

Implements the `docker stop` command.

**Signature**

```ts
declare const stop: (
  containerId: IdSchemas.ContainerIdentifier
) => Effect.Effect<void, DockerError, MobyEndpoints.Containers>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerEngine.ts#L458)

Since v1.0.0

## version

Implements the `docker version` command.

**Signature**

```ts
declare const version: () => Effect.Effect<MobySchemas.TypesVersion, DockerError, MobyEndpoints.System>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerEngine.ts#L468)

Since v1.0.0

# Errors

## DockerError

**Signature**

```ts
declare const DockerError: typeof internalCircular.DockerError
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerEngine.ts#L56)

Since v1.0.0

## DockerError (type alias)

**Signature**

```ts
type DockerError = internalCircular.DockerError
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerEngine.ts#L50)

Since v1.0.0

## DockerErrorTypeId

**Signature**

```ts
declare const DockerErrorTypeId: unique symbol
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerEngine.ts#L32)

Since v1.0.0

## DockerErrorTypeId (type alias)

**Signature**

```ts
type DockerErrorTypeId = typeof DockerErrorTypeId
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerEngine.ts#L38)

Since v1.0.0

## isDockerError

**Signature**

```ts
declare const isDockerError: (u: unknown) => u is DockerError
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerEngine.ts#L44)

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

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerEngine.ts#L62)

Since v1.0.0

## DockerLayerWithoutHttpClientOrWebsocketConstructor (type alias)

**Signature**

```ts
type DockerLayerWithoutHttpClientOrWebsocketConstructor = Layer.Layer<
  Layer.Layer.Success<DockerLayer>,
  Layer.Layer.Error<DockerLayer>,
  Layer.Layer.Context<DockerLayer> | HttpClient.HttpClient | Socket.WebSocketConstructor
>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerEngine.ts#L86)

Since v1.0.0

## layerAgnostic

**Signature**

```ts
declare const layerAgnostic: (
  connectionOptions: MobyConnection.HttpConnectionOptionsTagged | MobyConnection.HttpsConnectionOptionsTagged
) => DockerLayerWithoutHttpClientOrWebsocketConstructor
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerEngine.ts#L174)

Since v1.0.0

## layerBun

**Signature**

```ts
declare const layerBun: (connectionOptions: MobyConnection.MobyConnectionOptions) => DockerLayer
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerEngine.ts#L127)

Since v1.0.0

## layerDeno

**Signature**

```ts
declare const layerDeno: (connectionOptions: MobyConnection.MobyConnectionOptions) => DockerLayer
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerEngine.ts#L136)

Since v1.0.0

## layerFetch

**Signature**

```ts
declare const layerFetch: (
  connectionOptions: MobyConnection.HttpConnectionOptionsTagged | MobyConnection.HttpsConnectionOptionsTagged
) => DockerLayer
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerEngine.ts#L164)

Since v1.0.0

## layerNodeJS

**Signature**

```ts
declare const layerNodeJS: (connectionOptions: MobyConnection.MobyConnectionOptions) => DockerLayer
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerEngine.ts#L118)

Since v1.0.0

## layerUndici

**Signature**

```ts
declare const layerUndici: (connectionOptions: MobyConnection.MobyConnectionOptions) => DockerLayer
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerEngine.ts#L145)

Since v1.0.0

## layerWeb

**Signature**

```ts
declare const layerWeb: (
  connectionOptions: MobyConnection.HttpConnectionOptionsTagged | MobyConnection.HttpsConnectionOptionsTagged
) => DockerLayer
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerEngine.ts#L154)

Since v1.0.0

## layerWithoutHttpCLient

**Signature**

```ts
declare const layerWithoutHttpCLient: DockerLayerWithoutHttpClientOrWebsocketConstructor
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerEngine.ts#L96)

Since v1.0.0
