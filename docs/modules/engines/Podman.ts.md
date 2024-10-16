---
title: engines/Podman.ts
nav_order: 33
parent: Modules
---

## Podman overview

Podman engine

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Layers](#layers)
  - [PodmanLayer (type alias)](#podmanlayer-type-alias)
  - [PodmanLayerWithoutHttpCLient (type alias)](#podmanlayerwithouthttpclient-type-alias)
  - [layerAgnostic](#layeragnostic)
  - [layerBun](#layerbun)
  - [layerDeno](#layerdeno)
  - [layerNodeJS](#layernodejs)
  - [layerUndici](#layerundici)
  - [layerWeb](#layerweb)
  - [layerWithoutHttpCLient](#layerwithouthttpclient)

---

# Layers

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

## PodmanLayerWithoutHttpCLient (type alias)

**Signature**

```ts
export type PodmanLayerWithoutHttpCLient = Layer.Layer<
  Layer.Layer.Success<PodmanLayer>,
  Layer.Layer.Error<PodmanLayer>,
  Layer.Layer.Context<PodmanLayer> | HttpClient.HttpClient
>
```

Added in v1.0.0

## layerAgnostic

**Signature**

```ts
export declare const layerAgnostic: (
  connectionOptions: Platforms.HttpConnectionOptionsTagged | Platforms.HttpsConnectionOptionsTagged
) => PodmanLayerWithoutHttpCLient
```

Added in v1.0.0

## layerBun

**Signature**

```ts
export declare const layerBun: (connectionOptions: Platforms.MobyConnectionOptions) => PodmanLayer
```

Added in v1.0.0

## layerDeno

**Signature**

```ts
export declare const layerDeno: (connectionOptions: Platforms.MobyConnectionOptions) => PodmanLayer
```

Added in v1.0.0

## layerNodeJS

**Signature**

```ts
export declare const layerNodeJS: (connectionOptions: Platforms.MobyConnectionOptions) => PodmanLayer
```

Added in v1.0.0

## layerUndici

**Signature**

```ts
export declare const layerUndici: (connectionOptions: Platforms.MobyConnectionOptions) => PodmanLayer
```

Added in v1.0.0

## layerWeb

**Signature**

```ts
export declare const layerWeb: (
  connectionOptions: Platforms.HttpConnectionOptionsTagged | Platforms.HttpsConnectionOptionsTagged
) => PodmanLayer
```

Added in v1.0.0

## layerWithoutHttpCLient

**Signature**

```ts
export declare const layerWithoutHttpCLient: PodmanLayerWithoutHttpCLient
```

Added in v1.0.0
