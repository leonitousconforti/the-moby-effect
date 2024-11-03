---
title: engines/Docker.ts
nav_order: 26
parent: Modules
---

## Docker overview

Docker engine

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Docker](#docker)
  - [build](#build)
  - [buildScoped](#buildscoped)
  - [exec](#exec)
  - [execNonBlocking](#execnonblocking)
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
  - [stop](#stop)
  - [version](#version)
- [Layers](#layers)
  - [DockerLayer (type alias)](#dockerlayer-type-alias)
  - [DockerLayerWithoutHttpClient (type alias)](#dockerlayerwithouthttpclient-type-alias)
  - [layerAgnostic](#layeragnostic)
  - [layerBun](#layerbun)
  - [layerDeno](#layerdeno)
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
}) => Stream.Stream<JSONMessage, ImagesError, Images>
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
}) => Effect.Effect<Stream.Stream<JSONMessage, ImagesError, Images>, ImagesError, Scope.Scope | Images>
```

Added in v1.0.0

## exec

Implements the `docker exec` command in a blocking fashion.

**Signature**

```ts
export declare const exec: ({
  command,
  containerId
}: {
  containerId: string
  command: Array<string>
}) => Effect.Effect<string, ExecsError | Socket.SocketError | ParseResult.ParseError, Execs>
```

Added in v1.0.0

## execNonBlocking

Implements the `docker exec` command in a non blocking fashion.

**Signature**

```ts
export declare const execNonBlocking: ({
  command,
  containerId
}: {
  containerId: string
  command: Array<string>
}) => Effect.Effect<void, ExecsError | Socket.SocketError | ParseResult.ParseError, Execs>
```

Added in v1.0.0

## images

Implements the `docker images` command.

**Signature**

```ts
export declare const images: (
  options?: Parameters<Images["list"]>[0]
) => Effect.Effect<ReadonlyArray<ImageSummary>, ImagesError, Images>
```

Added in v1.0.0

## info

Implements the `docker info` command.

**Signature**

```ts
export declare const info: () => Effect.Effect<Readonly<SystemInfoResponse>, SystemsError, Systems>
```

Added in v1.0.0

## ping

Implements the `docker ping` command.

**Signature**

```ts
export declare const ping: () => Effect.Effect<"OK", SystemsError, Systems>
```

Added in v1.0.0

## pingHead

Implements the `docker ping` command.

**Signature**

```ts
export declare const pingHead: () => Effect.Effect<void, SystemsError, Systems>
```

Added in v1.0.0

## ps

Implements the `docker ps` command.

**Signature**

```ts
export declare const ps: (
  options?: Parameters<Containers["list"]>[0]
) => Effect.Effect<ReadonlyArray<ContainerListResponseItem>, ContainersError, Containers>
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
}) => Stream.Stream<JSONMessage, ImagesError, Images>
```

Added in v1.0.0

## pullScoped

Implements the `docker pull` command as a scoped effect. When the scope is
closed, the pulled image is removed. It doesn't have all the flags that the
images create endpoint exposes.

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
}) => Effect.Effect<Stream.Stream<JSONMessage, ImagesError, Images>, never, Images | Scope.Scope>
```

Added in v1.0.0

## push

Implements the `docker push` command.

**Signature**

```ts
export declare const push: (options: Parameters<Images["push"]>[0]) => Stream.Stream<string, ImagesError, Images>
```

Added in v1.0.0

## run

Implements `docker run` command.

**Signature**

```ts
export declare const run: (
  containerOptions: Parameters<Containers["create"]>[0]
) => Effect.Effect<ContainerInspectResponse, ContainersError, Containers>
```

Added in v1.0.0

## runScoped

Implements `docker run` command as a scoped effect. When the scope is closed,
both the image and the container is removed.

**Signature**

```ts
export declare const runScoped: (
  containerOptions: Parameters<Containers["create"]>[0]
) => Effect.Effect<ContainerInspectResponse, ContainersError, Scope.Scope | Containers>
```

Added in v1.0.0

## search

Implements the `docker search` command.

**Signature**

```ts
export declare const search: (
  options: Parameters<Images["search"]>[0]
) => Effect.Effect<ReadonlyArray<RegistrySearchResponse>, ImagesError, Images>
```

Added in v1.0.0

## stop

Implements the `docker stop` command.

**Signature**

```ts
export declare const stop: (containerId: string) => Effect.Effect<void, ContainersError, Containers>
```

Added in v1.0.0

## version

Implements the `docker version` command.

**Signature**

```ts
export declare const version: () => Effect.Effect<Readonly<SystemVersionResponse>, SystemsError, Systems>
```

Added in v1.0.0

# Layers

## DockerLayer (type alias)

**Signature**

```ts
export type DockerLayer = Moby.MobyLayer
```

Added in v1.0.0

## DockerLayerWithoutHttpClient (type alias)

**Signature**

```ts
export type DockerLayerWithoutHttpClient = Moby.MobyLayerWithoutHttpClient
```

Added in v1.0.0

## layerAgnostic

**Signature**

```ts
export declare const layerAgnostic: (
  connectionOptions: HttpConnectionOptionsTagged | HttpsConnectionOptionsTagged
) => DockerLayerWithoutHttpClient
```

Added in v1.0.0

## layerBun

**Signature**

```ts
export declare const layerBun: (connectionOptions: MobyConnectionOptions) => DockerLayer
```

Added in v1.0.0

## layerDeno

**Signature**

```ts
export declare const layerDeno: (connectionOptions: MobyConnectionOptions) => DockerLayer
```

Added in v1.0.0

## layerNodeJS

**Signature**

```ts
export declare const layerNodeJS: (connectionOptions: MobyConnectionOptions) => DockerLayer
```

Added in v1.0.0

## layerUndici

**Signature**

```ts
export declare const layerUndici: (connectionOptions: MobyConnectionOptions) => DockerLayer
```

Added in v1.0.0

## layerWeb

**Signature**

```ts
export declare const layerWeb: (
  connectionOptions: HttpConnectionOptionsTagged | HttpsConnectionOptionsTagged
) => DockerLayer
```

Added in v1.0.0

## layerWithoutHttpCLient

**Signature**

```ts
export declare const layerWithoutHttpCLient: Moby.MobyLayerWithoutHttpClient
```

Added in v1.0.0
