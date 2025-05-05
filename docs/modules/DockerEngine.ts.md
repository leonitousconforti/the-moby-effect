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
  auth,
  buildArgs,
  context,
  dockerfile,
  platform,
  tag
}: {
  tag: string
  auth?: string | undefined
  platform?: string | undefined
  dockerfile?: string | undefined
  context: Stream.Stream<Uint8Array, E1, never>
  buildArgs?: Record<string, string | undefined> | undefined
}) => Stream.Stream<MobySchemas.JSONMessage, MobyEndpoints.ImagesError, MobyEndpoints.Images>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerEngine.ts#L154)

Since v1.0.0

## buildScoped

Implements the `docker build` command as a scoped effect. When the scope is
closed, the built image is removed. It doesn't have all the flags that the
images build endpoint exposes.

**Signature**

```ts
declare const buildScoped: <E1>({
  auth,
  buildArgs,
  context,
  dockerfile,
  platform,
  tag
}: {
  tag: string
  auth?: string | undefined
  platform?: string | undefined
  dockerfile?: string | undefined
  buildArgs?: Record<string, string | undefined> | undefined
  context: Stream.Stream<Uint8Array, E1, never>
}) => Effect.Effect<
  Stream.Stream<MobySchemas.JSONMessage, MobyEndpoints.ImagesError, never>,
  never,
  Scope.Scope | MobyEndpoints.Images
>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerEngine.ts#L178)

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
  containerId: string
  command: string | Array<string>
}) => Effect.Effect<
  readonly [exitCode: number, output: string],
  MobyEndpoints.ExecsError | Socket.SocketError | ParseResult.ParseError,
  MobyEndpoints.Execs
>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerEngine.ts#L205)

Since v1.0.0

## execNonBlocking

Implements the `docker exec` command in a non blocking fashion. Incompatible
with web when not detached.

**Signature**

```ts
declare const execNonBlocking: <T extends boolean | undefined = undefined>({
  command,
  containerId,
  detach
}: {
  detach?: T
  containerId: string
  command: string | Array<string>
}) => Effect.Effect<
  [socket: T extends true ? void : MobyDemux.RawSocket | MobyDemux.MultiplexedSocket, execId: string],
  MobyEndpoints.ExecsError,
  MobyEndpoints.Execs
>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerEngine.ts#L224)

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
  containerId: string
}) => Effect.Effect<
  readonly [stdout: string, stderr: string],
  MobyEndpoints.ContainersError | Socket.SocketError | ParseResult.ParseError,
  MobyEndpoints.Containers
>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerEngine.ts#L246)

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
  containerId: string
  cwd?: string | undefined
}) => Effect.Effect<
  MobyDemux.MultiplexedChannel<never, Socket.SocketError | MobyEndpoints.ContainersError, never>,
  never,
  MobyEndpoints.Containers
>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerEngine.ts#L266)

Since v1.0.0

## images

Implements the `docker images` command.

**Signature**

```ts
declare const images: (
  options?: Parameters<MobyEndpoints.Images["list"]>[0]
) => Effect.Effect<ReadonlyArray<MobySchemas.ImageSummary>, MobyEndpoints.ImagesError, MobyEndpoints.Images>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerEngine.ts#L286)

Since v1.0.0

## info

Implements the `docker info` command.

**Signature**

```ts
declare const info: () => Effect.Effect<
  Readonly<MobySchemas.SystemInfoResponse>,
  MobyEndpoints.SystemsError,
  MobyEndpoints.Systems
>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerEngine.ts#L297)

Since v1.0.0

## ping

Implements the `docker ping` command.

**Signature**

```ts
declare const ping: () => Effect.Effect<"OK", MobyEndpoints.SystemsError, MobyEndpoints.Systems>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerEngine.ts#L309)

Since v1.0.0

## pingHead

Implements the `docker ping` command.

**Signature**

```ts
declare const pingHead: () => Effect.Effect<void, MobyEndpoints.SystemsError, MobyEndpoints.Systems>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerEngine.ts#L317)

Since v1.0.0

## ps

Implements the `docker ps` command.

**Signature**

```ts
declare const ps: (
  options?: Parameters<MobyEndpoints.Containers["list"]>[0]
) => Effect.Effect<
  ReadonlyArray<MobySchemas.ContainerListResponseItem>,
  MobyEndpoints.ContainersError,
  MobyEndpoints.Containers
>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerEngine.ts#L326)

Since v1.0.0

## pull

Implements the `docker pull` command. It does not have all the flags that the
images create endpoint exposes.

**Signature**

```ts
declare const pull: ({
  auth,
  image,
  platform
}: {
  image: string
  auth?: string | undefined
  platform?: string | undefined
}) => Stream.Stream<MobySchemas.JSONMessage, MobyEndpoints.ImagesError, MobyEndpoints.Images>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerEngine.ts#L341)

Since v1.0.0

## pullScoped

Implements the `docker pull` command as a scoped effect. When the scope is
closed, the pulled image is removed. It doesn't have all the flag =
internalDocker.flags that the images create endpoint exposes.

**Signature**

```ts
declare const pullScoped: ({
  auth,
  image,
  platform
}: {
  image: string
  auth?: string | undefined
  platform?: string | undefined
}) => Effect.Effect<
  Stream.Stream<MobySchemas.JSONMessage, MobyEndpoints.ImagesError, never>,
  never,
  MobyEndpoints.Images | Scope.Scope
>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerEngine.ts#L359)

Since v1.0.0

## push

Implements the `docker push` command.

**Signature**

```ts
declare const push: (
  options: Parameters<MobyEndpoints.Images["push"]>[0]
) => Stream.Stream<string, MobyEndpoints.ImagesError, MobyEndpoints.Images>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerEngine.ts#L379)

Since v1.0.0

## run

Implements `docker run` command.

**Signature**

```ts
declare const run: (
  containerOptions: Parameters<MobyEndpoints.Containers["create"]>[0]
) => Effect.Effect<MobySchemas.ContainerInspectResponse, MobyEndpoints.ContainersError, MobyEndpoints.Containers>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerEngine.ts#L389)

Since v1.0.0

## runScoped

Implements `docker run` command as a scoped effect. When the scope is closed,
both the image and the container is removed = internalDocker.removed.

**Signature**

```ts
declare const runScoped: (
  containerOptions: Parameters<MobyEndpoints.Containers["create"]>[0]
) => Effect.Effect<
  MobySchemas.ContainerInspectResponse,
  MobyEndpoints.ContainersError,
  Scope.Scope | MobyEndpoints.Containers
>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerEngine.ts#L401)

Since v1.0.0

## search

Implements the `docker search` command.

**Signature**

```ts
declare const search: (
  options: Parameters<MobyEndpoints.Images["search"]>[0]
) => Effect.Effect<ReadonlyArray<MobySchemas.RegistrySearchResponse>, MobyEndpoints.ImagesError, MobyEndpoints.Images>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerEngine.ts#L415)

Since v1.0.0

## start

Implements the `docker start` command.

**Signature**

```ts
declare const start: (
  containerId: string
) => Effect.Effect<void, MobyEndpoints.ContainersError, MobyEndpoints.Containers>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerEngine.ts#L426)

Since v1.0.0

## stop

Implements the `docker stop` command.

**Signature**

```ts
declare const stop: (
  containerId: string
) => Effect.Effect<void, MobyEndpoints.ContainersError, MobyEndpoints.Containers>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerEngine.ts#L436)

Since v1.0.0

## version

Implements the `docker version` command.

**Signature**

```ts
declare const version: () => Effect.Effect<
  Readonly<MobySchemas.SystemVersionResponse>,
  MobyEndpoints.SystemsError,
  MobyEndpoints.Systems
>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerEngine.ts#L446)

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
  | MobyEndpoints.Systems
  | MobyEndpoints.Tasks
  | MobyEndpoints.Volumes,
  never,
  never
>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerEngine.ts#L28)

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

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerEngine.ts#L52)

Since v1.0.0

## layerAgnostic

**Signature**

```ts
declare const layerAgnostic: (
  connectionOptions: MobyConnection.HttpConnectionOptionsTagged | MobyConnection.HttpsConnectionOptionsTagged
) => DockerLayerWithoutHttpClientOrWebsocketConstructor
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerEngine.ts#L140)

Since v1.0.0

## layerBun

**Signature**

```ts
declare const layerBun: (connectionOptions: MobyConnection.MobyConnectionOptions) => DockerLayer
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerEngine.ts#L93)

Since v1.0.0

## layerDeno

**Signature**

```ts
declare const layerDeno: (connectionOptions: MobyConnection.MobyConnectionOptions) => DockerLayer
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerEngine.ts#L102)

Since v1.0.0

## layerFetch

**Signature**

```ts
declare const layerFetch: (
  connectionOptions: MobyConnection.HttpConnectionOptionsTagged | MobyConnection.HttpsConnectionOptionsTagged
) => DockerLayer
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerEngine.ts#L130)

Since v1.0.0

## layerNodeJS

**Signature**

```ts
declare const layerNodeJS: (connectionOptions: MobyConnection.MobyConnectionOptions) => DockerLayer
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerEngine.ts#L84)

Since v1.0.0

## layerUndici

**Signature**

```ts
declare const layerUndici: (connectionOptions: MobyConnection.MobyConnectionOptions) => DockerLayer
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerEngine.ts#L111)

Since v1.0.0

## layerWeb

**Signature**

```ts
declare const layerWeb: (
  connectionOptions: MobyConnection.HttpConnectionOptionsTagged | MobyConnection.HttpsConnectionOptionsTagged
) => DockerLayer
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerEngine.ts#L120)

Since v1.0.0

## layerWithoutHttpCLient

**Signature**

```ts
declare const layerWithoutHttpCLient: DockerLayerWithoutHttpClientOrWebsocketConstructor
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DockerEngine.ts#L62)

Since v1.0.0
