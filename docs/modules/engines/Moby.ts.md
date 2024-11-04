---
title: engines/Moby.ts
nav_order: 29
parent: Modules
---

## Moby overview

Generic Moby engine.

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Layers](#layers)
  - [MobyLayer (type alias)](#mobylayer-type-alias)
  - [MobyLayerWithoutHttpClient (type alias)](#mobylayerwithouthttpclient-type-alias)
  - [layerAgnostic](#layeragnostic)
  - [layerBun](#layerbun)
  - [layerDeno](#layerdeno)
  - [layerNodeJS](#layernodejs)
  - [layerUndici](#layerundici)
  - [layerWeb](#layerweb)
  - [layerWithoutHttpCLient](#layerwithouthttpclient)

---

# Layers

## MobyLayer (type alias)

**Signature**

```ts
export type MobyLayer = Layer.Layer<
  Layer.Layer.Success<MobyLayerWithoutHttpClient>,
  Layer.Layer.Error<MobyLayerWithoutHttpClient>,
  Exclude<Layer.Layer.Context<MobyLayerWithoutHttpClient>, HttpClient.HttpClient>
>
```

Added in v1.0.0

## MobyLayerWithoutHttpClient (type alias)

**Signature**

```ts
export type MobyLayerWithoutHttpClient = Layer.Layer<
  | Configs
  | Containers
  | Distributions
  | Execs
  | Images
  | Networks
  | Nodes
  | Plugins
  | Secrets
  | Services
  | Sessions
  | Swarm
  | Systems
  | Tasks
  | Volumes,
  never,
  HttpClient.HttpClient
>
```

Added in v1.0.0

## layerAgnostic

**Signature**

```ts
export declare const layerAgnostic: (
  connectionOptions: HttpConnectionOptionsTagged | HttpsConnectionOptionsTagged
) => MobyLayerWithoutHttpClient
```

Added in v1.0.0

## layerBun

**Signature**

```ts
export declare const layerBun: (connectionOptions: MobyConnectionOptions) => MobyLayer
```

Added in v1.0.0

## layerDeno

**Signature**

```ts
export declare const layerDeno: (connectionOptions: MobyConnectionOptions) => MobyLayer
```

Added in v1.0.0

## layerNodeJS

**Signature**

```ts
export declare const layerNodeJS: (connectionOptions: MobyConnectionOptions) => MobyLayer
```

Added in v1.0.0

## layerUndici

**Signature**

```ts
export declare const layerUndici: (connectionOptions: MobyConnectionOptions) => MobyLayer
```

Added in v1.0.0

## layerWeb

**Signature**

```ts
export declare const layerWeb: (
  connectionOptions: HttpConnectionOptionsTagged | HttpsConnectionOptionsTagged
) => MobyLayer
```

Added in v1.0.0

## layerWithoutHttpCLient

Merges all the layers into a single layer

**Signature**

```ts
export declare const layerWithoutHttpCLient: MobyLayerWithoutHttpClient
```

Added in v1.0.0
