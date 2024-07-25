---
title: engines/Podman.ts
nav_order: 28
parent: Modules
---

## Podman overview

Podman helpers

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Layer](#layer)
  - [PodmanLayer (type alias)](#podmanlayer-type-alias)
  - [layer](#layer-1)
  - [layerBun](#layerbun)
  - [layerDeno](#layerdeno)
  - [layerNodeJS](#layernodejs)
  - [layerUndici](#layerundici)
  - [layerWeb](#layerweb)

---

# Layer

## PodmanLayer (type alias)

**Signature**

```ts
export type PodmanLayer = Layer.Layer<
  | Containers.Containers
  | Execs.Execs
  | Images.Images
  | Networks.Networks
  | Secrets.Secrets
  | System.Systems
  | Volumes.Volumes,
  never,
  never
>
```

Added in v1.0.0

## layer

**Signature**

```ts
export declare const layer: Layer.Layer<
  | Containers.Containers
  | Execs.Execs
  | Images.Images
  | Networks.Networks
  | Secrets.Secrets
  | System.Systems
  | Volumes.Volumes,
  never,
  HttpClient.HttpClient.Default
>
```

Added in v1.0.0

## layerBun

**Signature**

```ts
export declare const layerBun: (connectionOptions: PlatformAgents.MobyConnectionOptions) => PodmanLayer
```

Added in v1.0.0

## layerDeno

**Signature**

```ts
export declare const layerDeno: (connectionOptions: PlatformAgents.MobyConnectionOptions) => PodmanLayer
```

Added in v1.0.0

## layerNodeJS

**Signature**

```ts
export declare const layerNodeJS: (connectionOptions: PlatformAgents.MobyConnectionOptions) => PodmanLayer
```

Added in v1.0.0

## layerUndici

**Signature**

```ts
export declare const layerUndici: (connectionOptions: PlatformAgents.MobyConnectionOptions) => PodmanLayer
```

Added in v1.0.0

## layerWeb

**Signature**

```ts
export declare const layerWeb: (
  connectionOptions: PlatformAgents.MobyConnectionOptions
) => Layer.Layer<
  Layer.Layer.Success<PodmanLayer>,
  Layer.Layer.Error<PodmanLayer> | ConfigError.ConfigError,
  Layer.Layer.Context<PodmanLayer>
>
```

Added in v1.0.0
