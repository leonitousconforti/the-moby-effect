---
title: engines/Dind.ts
nav_order: 27
parent: Modules
---

## Dind overview

Docker in docker engine helpers

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

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

# Layer

## layerBun

**Signature**

```ts
export declare const layerBun: (options: {
  dindBaseImage?: string | undefined
  connectionOptionsToHost: PlatformAgents.MobyConnectionOptions
  exposeDindContainerBy: PlatformAgents.MobyConnectionOptions["_tag"]
}) => DindLayer
```

Added in v1.0.0

## layerDeno

**Signature**

```ts
export declare const layerDeno: (options: {
  dindBaseImage?: string | undefined
  connectionOptionsToHost: PlatformAgents.MobyConnectionOptions
  exposeDindContainerBy: PlatformAgents.MobyConnectionOptions["_tag"]
}) => DindLayer
```

Added in v1.0.0

## layerNodeJS

**Signature**

```ts
export declare const layerNodeJS: (options: {
  dindBaseImage?: string | undefined
  connectionOptionsToHost: PlatformAgents.MobyConnectionOptions
  exposeDindContainerBy: PlatformAgents.MobyConnectionOptions["_tag"]
}) => DindLayer
```

Added in v1.0.0

## layerUndici

**Signature**

```ts
export declare const layerUndici: (options: {
  dindBaseImage?: string | undefined
  connectionOptionsToHost: PlatformAgents.MobyConnectionOptions
  exposeDindContainerBy: PlatformAgents.MobyConnectionOptions["_tag"]
}) => DindLayer
```

Added in v1.0.0

## layerWeb

**Signature**

```ts
export declare const layerWeb: (options: {
  dindBaseImage?: string | undefined
  connectionOptionsToHost: PlatformAgents.MobyConnectionOptions
  exposeDindContainerBy: PlatformAgents.MobyConnectionOptions["_tag"]
}) => Layer.Layer<
  Layer.Layer.Success<DockerEngine.DockerLayer>,
  | ConfigError.ConfigError
  | Images.ImagesError
  | Containers.ContainersError
  | Volumes.VolumesError
  | System.SystemsError
  | PlatformError.PlatformError,
  Path.Path
>
```

Added in v1.0.0

# Layers

## DindLayer (type alias)

**Signature**

```ts
export type DindLayer = Layer.Layer<
  Layer.Layer.Success<DockerEngine.DockerLayer>,
  | Images.ImagesError
  | Containers.ContainersError
  | Volumes.VolumesError
  | System.SystemsError
  | PlatformError.PlatformError,
  Path.Path
>
```

Added in v1.0.0

## DindLayerWithoutDockerEngineRequirement (type alias)

**Signature**

```ts
export type DindLayerWithoutDockerEngineRequirement<E1 = never> = Layer.Layer<
  Layer.Layer.Success<DindLayer>,
  E1 | Layer.Layer.Error<DindLayer> | PlatformError.PlatformError,
  Layer.Layer.Context<DindLayer> | Layer.Layer.Success<DockerEngine.DockerLayer> | Path.Path
>
```

Added in v1.0.0
