---
title: engines/Podman.ts
nav_order: 31
parent: Modules
---

## Podman overview

Podman engine

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Layers](#layers)
  - [PodmanLayer (type alias)](#podmanlayer-type-alias)
  - [PodmanLayerWithoutHttpCLientOrWebsocketConstructor (type alias)](#podmanlayerwithouthttpclientorwebsocketconstructor-type-alias)
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

## PodmanLayer (type alias)

**Signature**

```ts
export type PodmanLayer = Layer.Layer<
  Containers | Execs | Images | Networks | Secrets | Systems | Volumes,
  never,
  never
>
```

Added in v1.0.0

## PodmanLayerWithoutHttpCLientOrWebsocketConstructor (type alias)

**Signature**

```ts
export type PodmanLayerWithoutHttpCLientOrWebsocketConstructor = Layer.Layer<
  Layer.Layer.Success<PodmanLayer>,
  Layer.Layer.Error<PodmanLayer>,
  Layer.Layer.Context<PodmanLayer> | HttpClient.HttpClient | Socket.WebSocketConstructor
>
```

Added in v1.0.0

## layerAgnostic

**Signature**

```ts
export declare const layerAgnostic: (
  connectionOptions: HttpConnectionOptionsTagged | HttpsConnectionOptionsTagged
) => PodmanLayerWithoutHttpCLientOrWebsocketConstructor
```

Added in v1.0.0

## layerBun

**Signature**

```ts
export declare const layerBun: (connectionOptions: MobyConnectionOptions) => PodmanLayer
```

Added in v1.0.0

## layerDeno

**Signature**

```ts
export declare const layerDeno: (connectionOptions: MobyConnectionOptions) => PodmanLayer
```

Added in v1.0.0

## layerFetch

**Signature**

```ts
export declare const layerFetch: (
  connectionOptions: HttpConnectionOptionsTagged | HttpsConnectionOptionsTagged
) => PodmanLayer
```

Added in v1.0.0

## layerNodeJS

**Signature**

```ts
export declare const layerNodeJS: (connectionOptions: MobyConnectionOptions) => PodmanLayer
```

Added in v1.0.0

## layerUndici

**Signature**

```ts
export declare const layerUndici: (connectionOptions: MobyConnectionOptions) => PodmanLayer
```

Added in v1.0.0

## layerWeb

**Signature**

```ts
export declare const layerWeb: (
  connectionOptions: HttpConnectionOptionsTagged | HttpsConnectionOptionsTagged
) => PodmanLayer
```

Added in v1.0.0

## layerWithoutHttpCLient

**Signature**

```ts
export declare const layerWithoutHttpCLient: PodmanLayerWithoutHttpCLientOrWebsocketConstructor
```

Added in v1.0.0
