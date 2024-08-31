---
title: engines/Dind.ts
nav_order: 34
parent: Modules
---

## Dind overview

Docker in docker engine helpers

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Blobs](#blobs)
  - [blobForExposeBy](#blobforexposeby)
- [Constants](#constants)
  - [DefaultDindBaseImage](#defaultdindbaseimage)
- [Layer](#layer)
  - [layerBun](#layerbun)
  - [layerDeno](#layerdeno)
  - [layerNodeJS](#layernodejs)
  - [layerUndici](#layerundici)
  - [layerWeb](#layerweb)
- [Layers](#layers)
  - [DindLayer (type alias)](#dindlayer-type-alias)
  - [DindLayerWithoutDockerEngineRequirement (type alias)](#dindlayerwithoutdockerenginerequirement-type-alias)

---

# Blobs

## blobForExposeBy

**Signature**

```ts
export declare const blobForExposeBy: (exposeDindContainerBy: Platforms.MobyConnectionOptions["_tag"]) => string
```

Added in v1.0.0

# Constants

## DefaultDindBaseImage

**Signature**

```ts
export declare const DefaultDindBaseImage: string
```

Added in v1.0.0

# Layer

## layerBun

**Signature**

```ts
export declare const layerBun: (options: {
  dindBaseImage?: string | undefined
  connectionOptionsToHost: Platforms.MobyConnectionOptions
  exposeDindContainerBy: Platforms.MobyConnectionOptions["_tag"]
}) => DindLayer<PlatformError.PlatformError, Path.Path | FileSystem.FileSystem>
```

Added in v1.0.0

## layerDeno

**Signature**

```ts
export declare const layerDeno: (options: {
  dindBaseImage?: string | undefined
  connectionOptionsToHost: Platforms.MobyConnectionOptions
  exposeDindContainerBy: Platforms.MobyConnectionOptions["_tag"]
}) => DindLayer<PlatformError.PlatformError, Path.Path | FileSystem.FileSystem>
```

Added in v1.0.0

## layerNodeJS

**Signature**

```ts
export declare const layerNodeJS: (options: {
  dindBaseImage?: string | undefined
  connectionOptionsToHost: Platforms.MobyConnectionOptions
  exposeDindContainerBy: Platforms.MobyConnectionOptions["_tag"]
}) => DindLayer<PlatformError.PlatformError, Path.Path | FileSystem.FileSystem>
```

Added in v1.0.0

## layerUndici

**Signature**

```ts
export declare const layerUndici: (options: {
  dindBaseImage?: string | undefined
  connectionOptionsToHost: Platforms.MobyConnectionOptions
  exposeDindContainerBy: Platforms.MobyConnectionOptions["_tag"]
}) => DindLayer<PlatformError.PlatformError, Path.Path | FileSystem.FileSystem>
```

Added in v1.0.0

## layerWeb

**Signature**

```ts
export declare const layerWeb: (options: {
  dindBaseImage?: string | undefined
  exposeDindContainerBy: "http" | "https"
  connectionOptionsToHost: Platforms.HttpConnectionOptionsTagged | Platforms.HttpsConnectionOptionsTagged
}) => DindLayer<never, never>
```

Added in v1.0.0

# Layers

## DindLayer (type alias)

**Signature**

```ts
export type DindLayer<E1 = PlatformError.PlatformError, R1 = Path.Path | FileSystem.FileSystem> = Layer.Layer<
  Layer.Layer.Success<DockerEngine.DockerLayer>,
  | Images.ImagesError
  | System.SystemsError
  | Volumes.VolumesError
  | ParseResult.ParseError
  | Containers.ContainersError
  | E1,
  R1
>
```

Added in v1.0.0

## DindLayerWithoutDockerEngineRequirement (type alias)

**Signature**

```ts
export type DindLayerWithoutDockerEngineRequirement = Layer.Layer<
  Layer.Layer.Success<DindLayer>,
  Layer.Layer.Error<DindLayer> | PlatformError.PlatformError,
  Layer.Layer.Context<DindLayer> | Layer.Layer.Success<DockerEngine.DockerLayer>
>
```

Added in v1.0.0
