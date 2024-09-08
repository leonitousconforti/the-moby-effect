---
title: engines/Dind.ts
nav_order: 25
parent: Modules
---

## Dind overview

Docker in docker engine

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Engines](#engines)
  - [makeDindLayer](#makedindlayer)
- [Layers](#layers)
  - [DindLayer (type alias)](#dindlayer-type-alias)
  - [layerAgnostic](#layeragnostic)
  - [layerBun](#layerbun)
  - [layerDeno](#layerdeno)
  - [layerNodeJS](#layernodejs)
  - [layerUndici](#layerundici)
  - [layerWeb](#layerweb)

---

# Engines

## makeDindLayer

Spawns a docker in docker container on the remote host provided by another
layer and exposes the dind container as a layer. This dind engine was built
to power the unit tests.

**Signature**

```ts
export declare const makeDindLayer: <
  T extends Platforms.MobyConnectionOptions,
  U extends Platforms.MobyConnectionOptions
>(options: {
  dindBaseImage: string
  exposeDindContainerBy: T["_tag"]
  connectionOptionsToHost: U
  platformLayerConstructor: (connectionOptions: T | U) => DockerEngine.DockerLayer
}) => DindLayer<T["_tag"]>
```

Added in v1.0.0

# Layers

## DindLayer (type alias)

**Signature**

```ts
export type DindLayer<T = Platforms.MobyConnectionOptions["_tag"]> = Layer.Layer<
  Layer.Layer.Success<DockerEngine.DockerLayer>,
  | Images.ImagesError
  | System.SystemsError
  | Volumes.VolumesError
  | ParseResult.ParseError
  | Containers.ContainersError
  | Layer.Layer.Error<DockerEngine.DockerLayer>
  | (T extends "socket" ? PlatformError.PlatformError : never),
  (T extends "socket" ? Path.Path | FileSystem.FileSystem : never) | Layer.Layer.Context<DockerEngine.DockerLayer>
>
```

Added in v1.0.0

## layerAgnostic

**Signature**

```ts
export declare const layerAgnostic: (options: {
  dindBaseImage?: string | undefined
  exposeDindContainerBy: "http" | "https"
  connectionOptionsToHost: Platforms.HttpConnectionOptionsTagged | Platforms.HttpsConnectionOptionsTagged
}) => DindLayer<"http" | "https">
```

Added in v1.0.0

## layerBun

**Signature**

```ts
export declare const layerBun: (options: {
  dindBaseImage?: string | undefined
  connectionOptionsToHost: Platforms.MobyConnectionOptions
  exposeDindContainerBy: Platforms.MobyConnectionOptions["_tag"]
}) => DindLayer
```

Added in v1.0.0

## layerDeno

**Signature**

```ts
export declare const layerDeno: (options: {
  dindBaseImage?: string | undefined
  connectionOptionsToHost: Platforms.MobyConnectionOptions
  exposeDindContainerBy: Platforms.MobyConnectionOptions["_tag"]
}) => DindLayer
```

Added in v1.0.0

## layerNodeJS

**Signature**

```ts
export declare const layerNodeJS: (options: {
  dindBaseImage?: string | undefined
  connectionOptionsToHost: Platforms.MobyConnectionOptions
  exposeDindContainerBy: Platforms.MobyConnectionOptions["_tag"]
}) => DindLayer
```

Added in v1.0.0

## layerUndici

**Signature**

```ts
export declare const layerUndici: (options: {
  dindBaseImage?: string | undefined
  connectionOptionsToHost: Platforms.MobyConnectionOptions
  exposeDindContainerBy: Platforms.MobyConnectionOptions["_tag"]
}) => DindLayer
```

Added in v1.0.0

## layerWeb

**Signature**

```ts
export declare const layerWeb: (options: {
  dindBaseImage?: string | undefined
  exposeDindContainerBy: "http" | "https"
  connectionOptionsToHost: Platforms.HttpConnectionOptionsTagged | Platforms.HttpsConnectionOptionsTagged
}) => DindLayer<"http" | "https">
```

Added in v1.0.0
