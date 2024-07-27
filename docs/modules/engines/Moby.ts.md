---
title: engines/Moby.ts
nav_order: 29
parent: Modules
---

## Moby overview

Generic Moby helpers

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Layers](#layers)
  - [MobyLayer (type alias)](#mobylayer-type-alias)
  - [MobyLayerWithoutHttpClient (type alias)](#mobylayerwithouthttpclient-type-alias)
  - [MobyLayerWithoutPlatformLayerConstructor (type alias)](#mobylayerwithoutplatformlayerconstructor-type-alias)
  - [layerBun](#layerbun)
  - [layerDeno](#layerdeno)
  - [layerNodeJS](#layernodejs)
  - [layerUndici](#layerundici)
  - [layerWeb](#layerweb)
  - [layerWithoutHttpCLient](#layerwithouthttpclient)
- [Tags](#tags)
  - [MobyLayerConstructor (interface)](#mobylayerconstructor-interface)
  - [MobyLayerConstructorImpl (type alias)](#mobylayerconstructorimpl-type-alias)
  - [PlatformLayerConstructor](#platformlayerconstructor)

---

# Layers

## MobyLayer (type alias)

**Signature**

```ts
export type MobyLayer<E1 = never> = Layer.Layer<
  Layer.Layer.Success<MobyLayerWithoutPlatformLayerConstructor> | MobyLayerConstructor,
  Layer.Layer.Error<MobyLayerWithoutPlatformLayerConstructor> | E1,
  Layer.Layer.Context<MobyLayerWithoutPlatformLayerConstructor>
>
```

Added in v1.0.0

## MobyLayerWithoutHttpClient (type alias)

**Signature**

```ts
export type MobyLayerWithoutHttpClient = Layer.Layer<
  Layer.Layer.Success<MobyLayerWithoutPlatformLayerConstructor>,
  Layer.Layer.Error<MobyLayerWithoutPlatformLayerConstructor>,
  Layer.Layer.Context<MobyLayerWithoutPlatformLayerConstructor> | HttpClient.HttpClient.Default
>
```

Added in v1.0.0

## MobyLayerWithoutPlatformLayerConstructor (type alias)

Merges all the layers into a single layer

**Signature**

```ts
export type MobyLayerWithoutPlatformLayerConstructor = Layer.Layer<
  | Configs.Configs
  | Containers.Containers
  | Distributions.Distributions
  | Execs.Execs
  | Images.Images
  | Networks.Networks
  | Nodes.Nodes
  | Plugins.Plugins
  | Secrets.Secrets
  | Services.Services
  | Sessions.Sessions
  | Swarm.Swarm
  | System.Systems
  | Tasks.Tasks
  | Volumes.Volumes,
  never,
  never
>
```

Added in v1.0.0

## layerBun

**Signature**

```ts
export declare const layerBun: MobyLayerConstructorImpl<never>
```

Added in v1.0.0

## layerDeno

**Signature**

```ts
export declare const layerDeno: MobyLayerConstructorImpl<never>
```

Added in v1.0.0

## layerNodeJS

**Signature**

```ts
export declare const layerNodeJS: MobyLayerConstructorImpl<never>
```

Added in v1.0.0

## layerUndici

**Signature**

```ts
export declare const layerUndici: MobyLayerConstructorImpl<never>
```

Added in v1.0.0

## layerWeb

**Signature**

```ts
export declare const layerWeb: MobyLayerConstructorImpl<ConfigError.ConfigError>
```

Added in v1.0.0

## layerWithoutHttpCLient

Merges all the layers into a single layer

**Signature**

```ts
export declare const layerWithoutHttpCLient: MobyLayerWithoutHttpClient
```

Added in v1.0.0

# Tags

## MobyLayerConstructor (interface)

**Signature**

```ts
export interface MobyLayerConstructor {
  readonly _: unique symbol
}
```

Added in v1.0.0

## MobyLayerConstructorImpl (type alias)

**Signature**

```ts
export type MobyLayerConstructorImpl<E1 = never> = (
  connectionOptions: PlatformAgents.MobyConnectionOptions
) => MobyLayer<E1>
```

Added in v1.0.0

## PlatformLayerConstructor

**Signature**

```ts
export declare const PlatformLayerConstructor: <E1 = never>() => Context.Tag<
  MobyLayerConstructor,
  MobyLayerConstructorImpl<E1>
>
```

Added in v1.0.0
