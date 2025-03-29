---
title: DockerEngine.ts
nav_order: 4
parent: Modules
---

## DockerEngine overview

Docker engine shortcut.

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
  - [DockerLayer](#dockerlayer)
  - [DockerLayerWithoutHttpClientOrWebsocketConstructor](#dockerlayerwithouthttpclientorwebsocketconstructor)
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

Implements the `docker build` command. It doesn't have all the flags that
the images build endpoint exposes.

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
  context: Stream<Uint8Array, E1, never>
  buildArgs?: Record<string, string | undefined> | undefined
}) => Stream<JSONMessage, ImagesError, Images>
```

Added in v1.0.0

## buildScoped

Implements the `docker build` command as a scoped effect. When the scope
is closed, the built image is removed. It doesn't have all the flags that
the images build endpoint exposes.

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
  context: Stream<Uint8Array, E1, never>
}) => Effect<Stream<JSONMessage, ImagesError, never>, never, Scope | Images>
```

Added in v1.0.0

## exec

Implements the `docker exec` command in a blocking fashion. Incompatible
with web.

**Signature**

```ts
export declare const exec: ({
  command,
  containerId
}: {
  containerId: string
  command: string | Array<string>
}) => Effect<readonly [exitCode: number, output: string], ExecsError | SocketError | ParseError, Execs>
```

Added in v1.0.0

## execNonBlocking

Implements the `docker exec` command in a non blocking fashion.
Incompatible with web when not detached.

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
}) => Effect<[socket: T extends true ? void : RawSocket | MultiplexedSocket, execId: string], ExecsError, Execs>
```

Added in v1.0.0

## execWebsockets

Implements the `docker exec` command in a blocking fashion with
websockets as the underlying transport instead of the docker engine exec
apis so that is can be compatible with web.

**Signature**

```ts
export declare const execWebsockets: ({
  command,
  containerId
}: {
  command: string | Array<string>
  containerId: string
}) => Effect<readonly [stdout: string, stderr: string], ContainersError | SocketError | ParseError, Containers>
```

Added in v1.0.0

## execWebsocketsNonBlocking

Implements the `docker exec` command in a non blocking fashion with
websockets as the underlying transport instead of the docker engine exec
apis so that is can be compatible with web.

**Signature**

```ts
export declare const execWebsocketsNonBlocking: ({
  command,
  containerId
}: {
  command: string | Array<string>
  containerId: string
}) => Effect<MultiplexedChannel<never, SocketError | ContainersError>, never, Containers>
```

Added in v1.0.0

## images

Implements the `docker images` command.

**Signature**

```ts
export declare const images: (
  options?: Parameters<Images["list"]>[0]
) => Effect<ReadonlyArray<ImageSummary>, ImagesError, Images>
```

Added in v1.0.0

## info

Implements the `docker info` command.

**Signature**

```ts
export declare const info: () => Effect<Readonly<SystemInfoResponse>, SystemsError, Systems>
```

Added in v1.0.0

## ping

Implements the `docker ping` command.

**Signature**

```ts
export declare const ping: () => Effect<"OK", SystemsError, Systems>
```

Added in v1.0.0

## pingHead

Implements the `docker ping` command.

**Signature**

```ts
export declare const pingHead: () => Effect<void, SystemsError, Systems>
```

Added in v1.0.0

## ps

Implements the `docker ps` command.

**Signature**

```ts
export declare const ps: (
  options?: Parameters<Containers["list"]>[0]
) => Effect<ReadonlyArray<ContainerListResponseItem>, ContainersError, Containers>
```

Added in v1.0.0

## pull

Implements the `docker pull` command. It does not have all the flags that
the images create endpoint exposes.

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
}) => Stream<JSONMessage, ImagesError, Images>
```

Added in v1.0.0

## pullScoped

Implements the `docker pull` command as a scoped effect. When the scope
is closed, the pulled image is removed. It doesn't have all the flags
that the images create endpoint exposes.

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
}) => Effect<Stream<JSONMessage, ImagesError, never>, never, Images | Scope>
```

Added in v1.0.0

## push

Implements the `docker push` command.

**Signature**

```ts
export declare const push: (options: Parameters<Images["push"]>[0]) => Stream<string, ImagesError, Images>
```

Added in v1.0.0

## run

Implements `docker run` command.

**Signature**

```ts
export declare const run: (
  containerOptions: Parameters<Containers["create"]>[0]
) => Effect<ContainerInspectResponse, ContainersError, Containers>
```

Added in v1.0.0

## runScoped

Implements `docker run` command as a scoped effect. When the scope is
closed, both the image and the container is removed.

**Signature**

```ts
export declare const runScoped: (
  containerOptions: Parameters<Containers["create"]>[0]
) => Effect<ContainerInspectResponse, ContainersError, Scope | Containers>
```

Added in v1.0.0

## search

Implements the `docker search` command.

**Signature**

```ts
export declare const search: (
  options: Parameters<Images["search"]>[0]
) => Effect<ReadonlyArray<RegistrySearchResponse>, ImagesError, Images>
```

Added in v1.0.0

## start

Implements the `docker start` command.

**Signature**

```ts
export declare const start: (containerId: string) => Effect<void, ContainersError, Containers>
```

Added in v1.0.0

## stop

Implements the `docker stop` command.

**Signature**

```ts
export declare const stop: (containerId: string) => Effect<void, ContainersError, Containers>
```

Added in v1.0.0

## version

Implements the `docker version` command.

**Signature**

```ts
export declare const version: () => Effect<Readonly<SystemVersionResponse>, SystemsError, Systems>
```

Added in v1.0.0

# Layers

## DockerLayer

**Signature**

```ts
export declare const DockerLayer: any
```

Added in v1.0.0

## DockerLayerWithoutHttpClientOrWebsocketConstructor

**Signature**

```ts
export declare const DockerLayerWithoutHttpClientOrWebsocketConstructor: any
```

Added in v1.0.0

## layerAgnostic

**Signature**

```ts
export declare const layerAgnostic: (
  connectionOptions: HttpConnectionOptionsTagged | HttpsConnectionOptionsTagged
) => DockerLayerWithoutHttpClientOrWebsocketConstructor
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

## layerFetch

**Signature**

```ts
export declare const layerFetch: (
  connectionOptions: HttpConnectionOptionsTagged | HttpsConnectionOptionsTagged
) => DockerLayer
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
export declare const layerWithoutHttpCLient: MobyLayerWithoutHttpClientOrWebsocketConstructor
```

Added in v1.0.0
