---
title: DockerEngine.ts
nav_order: 4
parent: Modules
---

## DockerEngine overview

Docker engine.

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

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
export declare const build: <E1>({
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
}) => Stream.Stream<Schemas.JSONMessage, MobyEndpoints.ImagesError, MobyEndpoints.Images>
```

Added in v1.0.0

## buildScoped

Implements the `docker build` command as a scoped effect. When the scope is
closed, the built image is removed. It doesn't have all the flags that the
images build endpoint exposes.

**Signature**

```ts
export declare const buildScoped: <E1>({
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
  Stream.Stream<Schemas.JSONMessage, MobyEndpoints.ImagesError, never>,
  never,
  Scope.Scope | MobyEndpoints.Images
>
```

Added in v1.0.0

## exec

Implements the `docker exec` command in a blocking fashion. Incompatible with
web.

**Signature**

```ts
export declare const exec: ({
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

Added in v1.0.0

## execNonBlocking

Implements the `docker exec` command in a non blocking fashion. Incompatible
with web when not detached.

**Signature**

```ts
export declare const execNonBlocking: <T extends boolean | undefined = undefined>({
  command,
  containerId,
  detach
}: {
  detach?: T
  containerId: string
  command: string | Array<string>
}) => Effect.Effect<
  [socket: T extends true ? void : RawSocket | MultiplexedSocket, execId: string],
  MobyEndpoints.ExecsError,
  MobyEndpoints.Execs
>
```

Added in v1.0.0

## execWebsockets

Implements the `docker exec` command in a blocking fashion with websockets as
the underlying transport instead of the docker engine exec apis so that is
can be compatible with web.

**Signature**

```ts
export declare const execWebsockets: ({
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

Added in v1.0.0

## execWebsocketsNonBlocking

Implements the `docker exec` command in a non blocking fashion with
websockets as the underlying transport instead of the docker engine exec apis
so that is can be compatible with web.

**Signature**

```ts
export declare const execWebsocketsNonBlocking: ({
  command,
  containerId
}: {
  command: string | Array<string>
  containerId: string
}) => Effect.Effect<
  MultiplexedChannel<never, Socket.SocketError | MobyEndpoints.ContainersError, never>,
  never,
  MobyEndpoints.Containers
>
```

Added in v1.0.0

## images

Implements the `docker images` command.

**Signature**

```ts
export declare const images: (
  options?: Parameters<MobyEndpoints.Images["list"]>[0]
) => Effect.Effect<ReadonlyArray<Schemas.ImageSummary>, MobyEndpoints.ImagesError, MobyEndpoints.Images>
```

Added in v1.0.0

## info

Implements the `docker info` command.

**Signature**

```ts
export declare const info: () => Effect.Effect<
  Readonly<Schemas.SystemInfoResponse>,
  MobyEndpoints.SystemsError,
  MobyEndpoints.Systems
>
```

Added in v1.0.0

## ping

Implements the `docker ping` command.

**Signature**

```ts
export declare const ping: () => Effect.Effect<"OK", MobyEndpoints.SystemsError, MobyEndpoints.Systems>
```

Added in v1.0.0

## pingHead

Implements the `docker ping` command.

**Signature**

```ts
export declare const pingHead: () => Effect.Effect<void, MobyEndpoints.SystemsError, MobyEndpoints.Systems>
```

Added in v1.0.0

## ps

Implements the `docker ps` command.

**Signature**

```ts
export declare const ps: (
  options?: Parameters<MobyEndpoints.Containers["list"]>[0]
) => Effect.Effect<
  ReadonlyArray<Schemas.ContainerListResponseItem>,
  MobyEndpoints.ContainersError,
  MobyEndpoints.Containers
>
```

Added in v1.0.0

## pull

Implements the `docker pull` command. It does not have all the flags that the
images create endpoint exposes.

**Signature**

```ts
export declare const pull: ({
  auth,
  image,
  platform
}: {
  image: string
  auth?: string | undefined
  platform?: string | undefined
}) => Stream.Stream<Schemas.JSONMessage, MobyEndpoints.ImagesError, MobyEndpoints.Images>
```

Added in v1.0.0

## pullScoped

Implements the `docker pull` command as a scoped effect. When the scope is
closed, the pulled image is removed. It doesn't have all the flag =
internalDocker.flags that the images create endpoint exposes.

**Signature**

```ts
export declare const pullScoped: ({
  auth,
  image,
  platform
}: {
  image: string
  auth?: string | undefined
  platform?: string | undefined
}) => Effect.Effect<
  Stream.Stream<Schemas.JSONMessage, MobyEndpoints.ImagesError, never>,
  never,
  MobyEndpoints.Images | Scope.Scope
>
```

Added in v1.0.0

## push

Implements the `docker push` command.

**Signature**

```ts
export declare const push: (
  options: Parameters<MobyEndpoints.Images["push"]>[0]
) => Stream.Stream<string, MobyEndpoints.ImagesError, MobyEndpoints.Images>
```

Added in v1.0.0

## run

Implements `docker run` command.

**Signature**

```ts
export declare const run: (
  containerOptions: Parameters<MobyEndpoints.Containers["create"]>[0]
) => Effect.Effect<Schemas.ContainerInspectResponse, MobyEndpoints.ContainersError, MobyEndpoints.Containers>
```

Added in v1.0.0

## runScoped

Implements `docker run` command as a scoped effect. When the scope is closed,
both the image and the container is removed = internalDocker.removed.

**Signature**

```ts
export declare const runScoped: (
  containerOptions: Parameters<MobyEndpoints.Containers["create"]>[0]
) => Effect.Effect<
  Schemas.ContainerInspectResponse,
  MobyEndpoints.ContainersError,
  Scope.Scope | MobyEndpoints.Containers
>
```

Added in v1.0.0

## search

Implements the `docker search` command.

**Signature**

```ts
export declare const search: (
  options: Parameters<MobyEndpoints.Images["search"]>[0]
) => Effect.Effect<ReadonlyArray<Schemas.RegistrySearchResponse>, MobyEndpoints.ImagesError, MobyEndpoints.Images>
```

Added in v1.0.0

## start

Implements the `docker start` command.

**Signature**

```ts
export declare const start: (
  containerId: string
) => Effect.Effect<void, MobyEndpoints.ContainersError, MobyEndpoints.Containers>
```

Added in v1.0.0

## stop

Implements the `docker stop` command.

**Signature**

```ts
export declare const stop: (
  containerId: string
) => Effect.Effect<void, MobyEndpoints.ContainersError, MobyEndpoints.Containers>
```

Added in v1.0.0

## version

Implements the `docker version` command.

**Signature**

```ts
export declare const version: () => Effect.Effect<
  Readonly<Schemas.SystemVersionResponse>,
  MobyEndpoints.SystemsError,
  MobyEndpoints.Systems
>
```

Added in v1.0.0

# Layers

## DockerLayer (type alias)

**Signature**

```ts
export type DockerLayer = Layer.Layer<
  Layer.Layer.Success<DockerLayerWithoutHttpClientOrWebsocketConstructor>,
  Layer.Layer.Error<DockerLayerWithoutHttpClientOrWebsocketConstructor>,
  Exclude<
    Layer.Layer.Context<DockerLayerWithoutHttpClientOrWebsocketConstructor>,
    HttpClient.HttpClient | Socket.WebSocketConstructor
  >
>
```

Added in v1.0.0

## DockerLayerWithoutHttpClientOrWebsocketConstructor (type alias)

**Signature**

```ts
export type DockerLayerWithoutHttpClientOrWebsocketConstructor = Layer.Layer<
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
  HttpClient.HttpClient | Socket.WebSocketConstructor
>
```

Added in v1.0.0

## layerAgnostic

**Signature**

```ts
export declare const layerAgnostic: (
  connectionOptions: MobyConnection.HttpConnectionOptionsTagged | MobyConnection.HttpsConnectionOptionsTagged
) => DockerLayerWithoutHttpClientOrWebsocketConstructor
```

Added in v1.0.0

## layerBun

**Signature**

```ts
export declare const layerBun: (connectionOptions: MobyConnection.MobyConnectionOptions) => DockerLayer
```

Added in v1.0.0

## layerDeno

**Signature**

```ts
export declare const layerDeno: (connectionOptions: MobyConnection.MobyConnectionOptions) => DockerLayer
```

Added in v1.0.0

## layerFetch

**Signature**

```ts
export declare const layerFetch: (
  connectionOptions: MobyConnection.HttpConnectionOptionsTagged | MobyConnection.HttpsConnectionOptionsTagged
) => DockerLayer
```

Added in v1.0.0

## layerNodeJS

**Signature**

```ts
export declare const layerNodeJS: (connectionOptions: MobyConnection.MobyConnectionOptions) => DockerLayer
```

Added in v1.0.0

## layerUndici

**Signature**

```ts
export declare const layerUndici: (connectionOptions: MobyConnection.MobyConnectionOptions) => DockerLayer
```

Added in v1.0.0

## layerWeb

**Signature**

```ts
export declare const layerWeb: (
  connectionOptions: MobyConnection.HttpConnectionOptionsTagged | MobyConnection.HttpsConnectionOptionsTagged
) => DockerLayer
```

Added in v1.0.0

## layerWithoutHttpCLient

**Signature**

```ts
export declare const layerWithoutHttpCLient: DockerLayerWithoutHttpClientOrWebsocketConstructor
```

Added in v1.0.0
