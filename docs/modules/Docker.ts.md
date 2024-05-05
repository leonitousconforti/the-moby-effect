---
title: Docker.ts
nav_order: 6
parent: Modules
---

## Docker overview

Docker helpers

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

---

# Docker

## build

Implements the `docker build` command.

Note: It doesn't have all the flags that the images build endpoint exposes.

**Signature**

```ts
export declare const build: ({
  auth,
  context,
  dockerfile,
  platform,
  tag
}: {
  tag: string
  auth?: string | undefined
  platform?: string | undefined
  dockerfile?: string | undefined
  context: Stream.Stream<Uint8Array, Images.ImagesError, never>
}) => Effect.Effect<
  Stream.Stream<Schemas.BuildInfo, Images.ImagesError, never>,
  Images.ImagesError,
  Images.Images | Scope.Scope
>
```

Added in v1.0.0

## buildScoped

Implements the `docker build` command as a scoped effect. When the scope is
closed, the built image is removed.

Note: It doesn't have all the flags that the images build endpoint exposes.

**Signature**

```ts
export declare const buildScoped: ({
  auth,
  context,
  dockerfile,
  platform,
  tag
}: {
  tag: string
  auth?: string | undefined
  platform?: string | undefined
  dockerfile?: string | undefined
  context: Stream.Stream<Uint8Array, Images.ImagesError, never>
}) => Effect.Effect<
  Stream.Stream<Schemas.BuildInfo, Images.ImagesError, never>,
  Images.ImagesError,
  Scope.Scope | Images.Images
>
```

Added in v1.0.0

## images

Implements the `docker images` command. \*

**Signature**

```ts
export declare const images: (
  options?: Images.ImageListOptions | undefined
) => Effect.Effect<readonly Schemas.ImageSummary[], Images.ImagesError, Images.Images>
```

Added in v1.0.0

## info

Implements the `docker info` command.

**Signature**

```ts
export declare const info: Effect.Effect<Readonly<Schemas.SystemInfo>, System.SystemsError, System.Systems>
```

Added in v1.0.0

## ps

Implements the `docker ps` command.

**Signature**

```ts
export declare const ps: (
  options?: Containers.ContainerListOptions | undefined
) => Effect.Effect<readonly Schemas.ContainerSummary[], Containers.ContainersError, Containers.Containers>
```

Added in v1.0.0

## pull

Implements the `docker pull` command.

Note: it doesn't have all the flags that the images create endpoint exposes.

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
}) => Effect.Effect<
  Stream.Stream<Schemas.BuildInfo, Images.ImagesError, never>,
  Images.ImagesError,
  Images.Images | Scope.Scope
>
```

Added in v1.0.0

## pullScoped

Implements the `docker pull` command as a scoped effect. When the scope is
closed, the pulled image is removed.

Note: it doesn't have all the flags that the images create endpoint exposes.

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
  Stream.Stream<Schemas.BuildInfo, Images.ImagesError, never>,
  Images.ImagesError,
  Scope.Scope | Images.Images
>
```

Added in v1.0.0

## push

Implements the `docker push` command.

**Signature**

```ts
export declare const push: (
  options: Images.ImagePushOptions
) => Effect.Effect<Stream.Stream<string, Images.ImagesError, never>, Images.ImagesError, Images.Images>
```

Added in v1.0.0

## run

Implements `docker run` command.

**Signature**

```ts
export declare const run: ({
  containerOptions,
  imageOptions
}: {
  containerOptions: Containers.ContainerCreateOptions
  imageOptions: ({ kind: "pull" } & Images.ImageCreateOptions) | ({ kind: "build" } & Images.ImageBuildOptions)
}) => Effect.Effect<
  Schemas.ContainerInspectResponse,
  Containers.ContainersError | Images.ImagesError,
  Containers.Containers | Images.Images | Scope.Scope
>
```

Added in v1.0.0

## runScoped

Implements `docker run` command as a scoped effect. When the scope is closed,
both the image and the container is removed.

**Signature**

```ts
export declare const runScoped: ({
  containerOptions,
  imageOptions
}: {
  containerOptions: Containers.ContainerCreateOptions
  imageOptions: ({ kind: "pull" } & Images.ImageCreateOptions) | ({ kind: "build" } & Images.ImageBuildOptions)
}) => Effect.Effect<
  Schemas.ContainerInspectResponse,
  Containers.ContainersError | Images.ImagesError,
  Scope.Scope | Containers.Containers | Images.Images
>
```

Added in v1.0.0

## search

Implements the `docker search` command.

**Signature**

```ts
export declare const search: (
  options: Images.ImageSearchOptions
) => Effect.Effect<
  readonly ({
    readonly description?: string | undefined
    readonly is_official?: boolean | undefined
    readonly is_automated?: boolean | undefined
    readonly name?: string | undefined
    readonly star_count?: number | undefined
  } | null)[],
  Images.ImagesError,
  Images.Images
>
```

Added in v1.0.0

## version

Implements the `docker version` command.

**Signature**

```ts
export declare const version: Effect.Effect<Readonly<Schemas.SystemVersion>, System.SystemsError, System.Systems>
```

Added in v1.0.0
