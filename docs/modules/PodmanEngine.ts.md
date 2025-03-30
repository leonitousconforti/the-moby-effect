---
title: PodmanEngine.ts
nav_order: 12
parent: Modules
---

## PodmanEngine overview

Podman engine

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Layers](#layers)
  - [layerAgnostic](#layeragnostic)
  - [layerBun](#layerbun)
  - [layerDeno](#layerdeno)
  - [layerFetch](#layerfetch)
  - [layerNodeJS](#layernodejs)
  - [layerUndici](#layerundici)
  - [layerWeb](#layerweb)
  - [layerWithoutHttpCLient](#layerwithouthttpclient)
- [Types](#types)
  - [PodmanLayer (type alias)](#podmanlayer-type-alias)
  - [PodmanLayerWithoutHttpClientOrWebsocketConstructor (type alias)](#podmanlayerwithouthttpclientorwebsocketconstructor-type-alias)

---

# Layers

## layerAgnostic

**Signature**

```ts
export declare const layerAgnostic: (
  connectionOptions: MobyConnection.HttpConnectionOptionsTagged | MobyConnection.HttpsConnectionOptionsTagged
) => PodmanLayerWithoutHttpClientOrWebsocketConstructor
```

Added in v1.0.0

## layerBun

**Signature**

```ts
export declare const layerBun: (connectionOptions: MobyConnection.MobyConnectionOptions) => PodmanLayer
```

Added in v1.0.0

## layerDeno

**Signature**

```ts
export declare const layerDeno: (connectionOptions: MobyConnection.MobyConnectionOptions) => PodmanLayer
```

Added in v1.0.0

## layerFetch

**Signature**

```ts
export declare const layerFetch: (
  connectionOptions: MobyConnection.HttpConnectionOptionsTagged | MobyConnection.HttpsConnectionOptionsTagged
) => PodmanLayer
```

Added in v1.0.0

## layerNodeJS

**Signature**

```ts
export declare const layerNodeJS: (connectionOptions: MobyConnection.MobyConnectionOptions) => PodmanLayer
```

Added in v1.0.0

## layerUndici

**Signature**

```ts
export declare const layerUndici: (connectionOptions: MobyConnection.MobyConnectionOptions) => PodmanLayer
```

Added in v1.0.0

## layerWeb

**Signature**

```ts
export declare const layerWeb: (
  connectionOptions: MobyConnection.HttpConnectionOptionsTagged | MobyConnection.HttpsConnectionOptionsTagged
) => PodmanLayer
```

Added in v1.0.0

## layerWithoutHttpCLient

**Signature**

```ts
export declare const layerWithoutHttpCLient: PodmanLayerWithoutHttpClientOrWebsocketConstructor
```

Added in v1.0.0

# Types

## PodmanLayer (type alias)

**Signature**

```ts
export type PodmanLayer = Layer.Layer<
  | Endpoints.Containers
  | Endpoints.Execs
  | Endpoints.Images
  | Endpoints.Networks
  | Endpoints.Secrets
  | Endpoints.Systems
  | Endpoints.Volumes,
  never,
  never
>
```

Added in v1.0.0

## PodmanLayerWithoutHttpClientOrWebsocketConstructor (type alias)

**Signature**

```ts
export type PodmanLayerWithoutHttpClientOrWebsocketConstructor = Layer.Layer<
  Layer.Layer.Success<PodmanLayer>,
  Layer.Layer.Error<PodmanLayer>,
  Layer.Layer.Context<PodmanLayer> | HttpClient.HttpClient | Socket.WebSocketConstructor
>
```

Added in v1.0.0
