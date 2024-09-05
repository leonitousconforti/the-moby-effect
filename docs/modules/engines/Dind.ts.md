---
title: engines/Dind.ts
nav_order: 25
parent: Modules
---

## Dind overview

Docker in docker engine helpers

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Engines](#engines)
  - [makeDindLayer](#makedindlayer)
- [Layer](#layer)
  - [layerBun](#layerbun)
  - [layerDeno](#layerdeno)
  - [layerNodeJS](#layernodejs)
  - [layerUndici](#layerundici)
  - [layerWeb](#layerweb)
- [Layers](#layers)
  - [DindLayer (type alias)](#dindlayer-type-alias)
  - [DindLayerWithDockerEngineRequirementsProvided (type alias)](#dindlayerwithdockerenginerequirementsprovided-type-alias)

---

# Engines

## makeDindLayer

Spawns a docker in docker container on the remote host provided by another
layer and exposes the dind container as a layer. This dind engine was built
to power the unit tests.

**Signature**

```ts
export declare const makeDindLayer: <T extends Platforms.MobyConnectionOptions["_tag"]>(
  exposeDindContainerBy: T,
  dindBaseImage: string
) => DindLayer<T>
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
}) => DindLayerWithDockerEngineRequirementsProvided
```

Added in v1.0.0

## layerDeno

**Signature**

```ts
export declare const layerDeno: (options: {
  dindBaseImage?: string | undefined
  connectionOptionsToHost: Platforms.MobyConnectionOptions
  exposeDindContainerBy: Platforms.MobyConnectionOptions["_tag"]
}) => DindLayerWithDockerEngineRequirementsProvided
```

Added in v1.0.0

## layerNodeJS

**Signature**

```ts
export declare const layerNodeJS: (options: {
  dindBaseImage?: string | undefined
  connectionOptionsToHost: Platforms.MobyConnectionOptions
  exposeDindContainerBy: Platforms.MobyConnectionOptions["_tag"]
}) => DindLayerWithDockerEngineRequirementsProvided
```

Added in v1.0.0

## layerUndici

**Signature**

```ts
export declare const layerUndici: (options: {
  dindBaseImage?: string | undefined
  connectionOptionsToHost: Platforms.MobyConnectionOptions
  exposeDindContainerBy: Platforms.MobyConnectionOptions["_tag"]
}) => DindLayerWithDockerEngineRequirementsProvided
```

Added in v1.0.0

## layerWeb

**Signature**

```ts
export declare const layerWeb: (options: {
  dindBaseImage?: string | undefined
  exposeDindContainerBy: "http" | "https"
  connectionOptionsToHost: Platforms.HttpConnectionOptionsTagged | Platforms.HttpsConnectionOptionsTagged
}) => DindLayerWithDockerEngineRequirementsProvided<"http" | "https">
```

Added in v1.0.0

# Layers

## DindLayer (type alias)

**Signature**

```ts
export type DindLayer<T = Platforms.MobyConnectionOptions["_tag"]> = Effect.Effect<
  DockerEngine.DockerLayer,
  | Images.ImagesError
  | System.SystemsError
  | Volumes.VolumesError
  | ParseResult.ParseError
  | Containers.ContainersError
  | (T extends "socket" ? PlatformError.PlatformError : never),
  | Scope.Scope
  | Images.Images
  | System.Systems
  | Volumes.Volumes
  | Containers.Containers
  | DockerEngine.DockerLayerConstructor
  | (T extends "socket" ? Path.Path | FileSystem.FileSystem : never)
>
```

Added in v1.0.0

## DindLayerWithDockerEngineRequirementsProvided (type alias)

**Signature**

```ts
export type DindLayerWithDockerEngineRequirementsProvided<T = "http" | "https" | "socket" | "ssh"> = Layer.Layer<
  Layer.Layer.Success<Effect.Effect.Success<DindLayer<T>>>,
  Effect.Effect.Error<DindLayer<T>> | Layer.Layer.Error<DockerEngine.DockerLayer>,
  | Layer.Layer.Context<DockerEngine.DockerLayer>
  | Exclude<Effect.Effect.Context<DindLayer<T>>, Layer.Layer.Success<DockerEngine.DockerLayer> | Scope.Scope>
>
```

Added in v1.0.0
