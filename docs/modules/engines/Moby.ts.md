---
title: engines/Moby.ts
nav_order: 31
parent: Modules
---

## Moby overview

Generic Moby engine.

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Layers](#layers)
  - [MobyLayer (type alias)](#mobylayer-type-alias)
  - [MobyLayerWithoutHttpClientOrWebsocketConstructor (type alias)](#mobylayerwithouthttpclientorwebsocketconstructor-type-alias)
  - [layerAgnostic](#layeragnostic)
  - [layerBun](#layerbun)
  - [layerDeno](#layerdeno)
  - [layerFetch](#layerfetch)
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
  Layer.Layer.Success<MobyLayerWithoutHttpClientOrWebsocketConstructor>,
  Layer.Layer.Error<MobyLayerWithoutHttpClientOrWebsocketConstructor>,
  Exclude<
    Layer.Layer.Context<MobyLayerWithoutHttpClientOrWebsocketConstructor>,
    HttpClient.HttpClient | Socket.WebSocketConstructor
  >
>
```

Added in v1.0.0

## MobyLayerWithoutHttpClientOrWebsocketConstructor (type alias)

**Signature**

```ts
export type MobyLayerWithoutHttpClientOrWebsocketConstructor = Layer.Layer<
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
  HttpClient.HttpClient | Socket.WebSocketConstructor
>
```

Added in v1.0.0

## layerAgnostic

**Signature**

```ts
export declare const layerAgnostic: (
  connectionOptions: HttpConnectionOptionsTagged | HttpsConnectionOptionsTagged
) => MobyLayerWithoutHttpClientOrWebsocketConstructor
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

## layerFetch

**Signature**

```ts
export declare const layerFetch: (
  connectionOptions: HttpConnectionOptionsTagged | HttpsConnectionOptionsTagged
) => MobyLayer
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
export declare const layerWithoutHttpCLient: MobyLayerWithoutHttpClientOrWebsocketConstructor
```

Added in v1.0.0
