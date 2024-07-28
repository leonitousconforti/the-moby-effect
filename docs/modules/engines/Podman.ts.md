---
title: engines/Podman.ts
nav_order: 30
parent: Modules
---

## Podman overview

Podman engine helpers

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Layers](#layers)
  - [PodmanLayer (type alias)](#podmanlayer-type-alias)
  - [PodmanLayerWithoutHttpCLient (type alias)](#podmanlayerwithouthttpclient-type-alias)
  - [PodmanLayerWithoutPlatformLayerConstructor (type alias)](#podmanlayerwithoutplatformlayerconstructor-type-alias)
  - [layerBun](#layerbun)
  - [layerDeno](#layerdeno)
  - [layerNodeJS](#layernodejs)
  - [layerUndici](#layerundici)
  - [layerWeb](#layerweb)
  - [layerWithoutHttpCLient](#layerwithouthttpclient)
- [Tags](#tags)
  - [PlatformLayerConstructor](#platformlayerconstructor)
  - [PodmanLayerConstructor (interface)](#podmanlayerconstructor-interface)
  - [PodmanLayerConstructorImpl (type alias)](#podmanlayerconstructorimpl-type-alias)

---

# Layers

## PodmanLayer (type alias)

**Signature**

```ts
export type PodmanLayer<E1 = never> = Layer.Layer<
  Layer.Layer.Success<PodmanLayerWithoutPlatformLayerConstructor> | PodmanLayerConstructor,
  Layer.Layer.Error<PodmanLayerWithoutPlatformLayerConstructor> | E1,
  Layer.Layer.Context<PodmanLayerWithoutPlatformLayerConstructor>
>
```

Added in v1.0.0

## PodmanLayerWithoutHttpCLient (type alias)

**Signature**

```ts
export type PodmanLayerWithoutHttpCLient = Layer.Layer<
  Layer.Layer.Success<PodmanLayerWithoutPlatformLayerConstructor>,
  Layer.Layer.Error<PodmanLayerWithoutPlatformLayerConstructor>,
  Layer.Layer.Context<PodmanLayerWithoutPlatformLayerConstructor> | HttpClient.HttpClient.Default
>
```

Added in v1.0.0

## PodmanLayerWithoutPlatformLayerConstructor (type alias)

**Signature**

```ts
export type PodmanLayerWithoutPlatformLayerConstructor = Layer.Layer<
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

## layerBun

**Signature**

```ts
export declare const layerBun: PodmanLayerConstructorImpl<never>
```

Added in v1.0.0

## layerDeno

**Signature**

```ts
export declare const layerDeno: PodmanLayerConstructorImpl<never>
```

Added in v1.0.0

## layerNodeJS

**Signature**

```ts
export declare const layerNodeJS: PodmanLayerConstructorImpl<never>
```

Added in v1.0.0

## layerUndici

**Signature**

```ts
export declare const layerUndici: PodmanLayerConstructorImpl<never>
```

Added in v1.0.0

## layerWeb

**Signature**

```ts
export declare const layerWeb: PodmanLayerConstructorImpl<ConfigError.ConfigError>
```

Added in v1.0.0

## layerWithoutHttpCLient

**Signature**

```ts
export declare const layerWithoutHttpCLient: PodmanLayerWithoutHttpCLient
```

Added in v1.0.0

# Tags

## PlatformLayerConstructor

**Signature**

```ts
export declare const PlatformLayerConstructor: <E1 = never>() => Context.Tag<
  PodmanLayerConstructor,
  PodmanLayerConstructorImpl<E1>
>
```

Added in v1.0.0

## PodmanLayerConstructor (interface)

**Signature**

```ts
export interface PodmanLayerConstructor {
  readonly _: unique symbol
}
```

Added in v1.0.0

## PodmanLayerConstructorImpl (type alias)

**Signature**

```ts
export type PodmanLayerConstructorImpl<E1 = never> = (
  connectionOptions: PlatformAgents.MobyConnectionOptions
) => PodmanLayer<E1>
```

Added in v1.0.0
