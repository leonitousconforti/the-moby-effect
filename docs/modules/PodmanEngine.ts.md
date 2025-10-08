---
title: PodmanEngine.ts
nav_order: 12
parent: Modules
---

## PodmanEngine.ts overview

Podman engine

Since v1.0.0

---

## Exports Grouped by Category

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
declare const layerAgnostic: (
  connectionOptions: MobyConnection.HttpConnectionOptionsTagged | MobyConnection.HttpsConnectionOptionsTagged
) => PodmanLayerWithoutHttpClientOrWebsocketConstructor
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/PodmanEngine.ts#L116)

Since v1.0.0

## layerBun

**Signature**

```ts
declare const layerBun: (connectionOptions: MobyConnection.MobyConnectionOptions) => PodmanLayer
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/PodmanEngine.ts#L69)

Since v1.0.0

## layerDeno

**Signature**

```ts
declare const layerDeno: (connectionOptions: MobyConnection.MobyConnectionOptions) => PodmanLayer
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/PodmanEngine.ts#L78)

Since v1.0.0

## layerFetch

**Signature**

```ts
declare const layerFetch: (
  connectionOptions: MobyConnection.HttpConnectionOptionsTagged | MobyConnection.HttpsConnectionOptionsTagged
) => PodmanLayer
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/PodmanEngine.ts#L106)

Since v1.0.0

## layerNodeJS

**Signature**

```ts
declare const layerNodeJS: (connectionOptions: MobyConnection.MobyConnectionOptions) => PodmanLayer
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/PodmanEngine.ts#L60)

Since v1.0.0

## layerUndici

**Signature**

```ts
declare const layerUndici: (connectionOptions: MobyConnection.MobyConnectionOptions) => PodmanLayer
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/PodmanEngine.ts#L87)

Since v1.0.0

## layerWeb

**Signature**

```ts
declare const layerWeb: (
  connectionOptions: MobyConnection.HttpConnectionOptionsTagged | MobyConnection.HttpsConnectionOptionsTagged
) => PodmanLayer
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/PodmanEngine.ts#L96)

Since v1.0.0

## layerWithoutHttpCLient

**Signature**

```ts
declare const layerWithoutHttpCLient: PodmanLayerWithoutHttpClientOrWebsocketConstructor
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/PodmanEngine.ts#L46)

Since v1.0.0

# Types

## PodmanLayer (type alias)

**Signature**

```ts
type PodmanLayer = Layer.Layer<
  | MobyEndpoints.Containers
  | MobyEndpoints.Execs
  | MobyEndpoints.Images
  | MobyEndpoints.Networks
  | MobyEndpoints.Secrets
  | MobyEndpoints.System
  | MobyEndpoints.Volumes,
  never,
  never
>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/PodmanEngine.ts#L20)

Since v1.0.0

## PodmanLayerWithoutHttpClientOrWebsocketConstructor (type alias)

**Signature**

```ts
type PodmanLayerWithoutHttpClientOrWebsocketConstructor = Layer.Layer<
  Layer.Layer.Success<PodmanLayer>,
  Layer.Layer.Error<PodmanLayer>,
  Layer.Layer.Context<PodmanLayer> | HttpClient.HttpClient | Socket.WebSocketConstructor
>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/PodmanEngine.ts#L36)

Since v1.0.0
