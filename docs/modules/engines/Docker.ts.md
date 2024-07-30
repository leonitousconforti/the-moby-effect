---
title: engines/Docker.ts
nav_order: 28
parent: Modules
---

## Docker overview

Docker engine helpers

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Docker](#docker)
  - [build](#build)
  - [buildScoped](#buildscoped)
  - [images](#images)
  - [info](#info)
  - [ps](#ps)
  - [pull](#pull)
  - [pullScoped](#pullscoped)
  - [push](#push)
  - [run](#run)
  - [runScoped](#runscoped)
  - [search](#search)
  - [version](#version)
- [Layers](#layers)
  - [DockerLayer (type alias)](#dockerlayer-type-alias)
  - [DockerLayerWithoutHttpClient (type alias)](#dockerlayerwithouthttpclient-type-alias)
  - [DockerLayerWithoutPlatformLayerConstructor (type alias)](#dockerlayerwithoutplatformlayerconstructor-type-alias)
  - [layerBun](#layerbun)
  - [layerDeno](#layerdeno)
  - [layerNodeJS](#layernodejs)
  - [layerUndici](#layerundici)
  - [layerWeb](#layerweb)
  - [layerWithoutHttpCLient](#layerwithouthttpclient)
- [Tags](#tags)
  - [DockerLayerConstructor (interface)](#dockerlayerconstructor-interface)
  - [DockerLayerConstructorImpl (type alias)](#dockerlayerconstructorimpl-type-alias)
  - [PlatformLayerConstructor](#platformlayerconstructor)

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
}) => Stream.Stream<GeneratedSchemas.JSONMessage, Images.ImagesError, Images.Images>
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
  Stream.Stream<GeneratedSchemas.JSONMessage, Images.ImagesError, Images.Images>,
  Images.ImagesError,
  Scope.Scope | Images.Images
>
```

Added in v1.0.0

## images

Implements the `docker images` command.

**Signature**

```ts
export declare const images: (
  options?: Images.ImageListOptions | undefined
) => Effect.Effect<ReadonlyArray<GeneratedSchemas.ImageSummary>, Images.ImagesError, Images.Images>
```

Added in v1.0.0

## info

Implements the `docker info` command.

**Signature**

```ts
export declare const info: Effect.Effect<
  Readonly<GeneratedSchemas.SystemInfoResponse>,
  System.SystemsError,
  System.Systems
>
```

Added in v1.0.0

## ps

Implements the `docker ps` command.

**Signature**

```ts
export declare const ps: (
  options?: Containers.ContainerListOptions | undefined
) => Effect.Effect<
  ReadonlyArray<GeneratedSchemas.ContainerListResponseItem>,
  Containers.ContainersError,
  Containers.Containers
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
}) => Stream.Stream<GeneratedSchemas.JSONMessage, Images.ImagesError, Images.Images>
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
}) => Effect.Effect<
  Stream.Stream<GeneratedSchemas.JSONMessage, Images.ImagesError, Images.Images>,
  never,
  Images.Images | Scope.Scope
>
```

Added in v1.0.0

## push

Implements the `docker push` command.

**Signature**

```ts
export declare const push: (
  options: Images.ImagePushOptions
) => Stream.Stream<string, Images.ImagesError, Images.Images>
```

Added in v1.0.0

## run

Implements `docker run` command.

**Signature**

```ts
export declare const run: (
  containerOptions: Containers.ContainerCreateOptions
) => Effect.Effect<GeneratedSchemas.ContainerInspectResponse, Containers.ContainersError, Containers.Containers>
```

Added in v1.0.0

## runScoped

Implements `docker run` command as a scoped effect. When the scope is closed,
both the image and the container is removed.

**Signature**

```ts
export declare const runScoped: (
  containerOptions: Containers.ContainerCreateOptions
) => Effect.Effect<
  GeneratedSchemas.ContainerInspectResponse,
  Containers.ContainersError,
  Scope.Scope | Containers.Containers
>
```

Added in v1.0.0

## search

Implements the `docker search` command.

**Signature**

```ts
export declare const search: (
  options: Images.ImageSearchOptions
) => Effect.Effect<ReadonlyArray<GeneratedSchemas.RegistrySearchResponse>, Images.ImagesError, Images.Images>
```

Added in v1.0.0

## version

Implements the `docker version` command.

**Signature**

```ts
export declare const version: Effect.Effect<
  Readonly<GeneratedSchemas.SystemVersionResponse>,
  System.SystemsError,
  System.Systems
>
```

Added in v1.0.0

# Layers

## DockerLayer (type alias)

**Signature**

```ts
export type DockerLayer<E1 = never> = Layer.Layer<
  Layer.Layer.Success<DockerLayerWithoutPlatformLayerConstructor> | DockerLayerConstructor,
  Layer.Layer.Error<DockerLayerWithoutPlatformLayerConstructor> | E1,
  Layer.Layer.Context<DockerLayerWithoutPlatformLayerConstructor>
>
```

Added in v1.0.0

## DockerLayerWithoutHttpClient (type alias)

**Signature**

```ts
export type DockerLayerWithoutHttpClient = Moby.MobyLayerWithoutHttpClient
```

Added in v1.0.0

## DockerLayerWithoutPlatformLayerConstructor (type alias)

**Signature**

```ts
export type DockerLayerWithoutPlatformLayerConstructor = Moby.MobyLayerWithoutPlatformLayerConstructor
```

Added in v1.0.0

## layerBun

**Signature**

```ts
export declare const layerBun: DockerLayerConstructorImpl<never>
```

Added in v1.0.0

## layerDeno

**Signature**

```ts
export declare const layerDeno: DockerLayerConstructorImpl<never>
```

Added in v1.0.0

## layerNodeJS

**Signature**

```ts
export declare const layerNodeJS: DockerLayerConstructorImpl<never>
```

Added in v1.0.0

## layerUndici

**Signature**

```ts
export declare const layerUndici: DockerLayerConstructorImpl<never>
```

Added in v1.0.0

## layerWeb

**Signature**

```ts
export declare const layerWeb: DockerLayerConstructorImpl<ConfigError.ConfigError>
```

Added in v1.0.0

## layerWithoutHttpCLient

**Signature**

```ts
export declare const layerWithoutHttpCLient: Moby.MobyLayerWithoutHttpClient
```

Added in v1.0.0

# Tags

## DockerLayerConstructor (interface)

**Signature**

```ts
export interface DockerLayerConstructor {
  readonly _: unique symbol
}
```

Added in v1.0.0

## DockerLayerConstructorImpl (type alias)

**Signature**

```ts
export type DockerLayerConstructorImpl<E1 = never> = (
  connectionOptions: PlatformAgents.MobyConnectionOptions
) => DockerLayer<E1>
```

Added in v1.0.0

## PlatformLayerConstructor

**Signature**

```ts
export declare const PlatformLayerConstructor: <E1 = never>() => Context.Tag<
  DockerLayerConstructor,
  DockerLayerConstructorImpl<E1>
>
```

Added in v1.0.0
