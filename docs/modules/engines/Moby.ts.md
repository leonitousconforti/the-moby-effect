---
title: engines/Moby.ts
nav_order: 30
parent: Modules
---

## Moby overview

Generic Moby engine

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
  HttpClient.HttpClient
>
```

Added in v1.0.0

## layerAgnostic

**Signature**

```ts
export declare const layerAgnostic: (
  connectionOptions: Connection.HttpConnectionOptionsTagged | Connection.HttpsConnectionOptionsTagged
) => MobyLayerWithoutHttpClient
```

Added in v1.0.0

## layerBun

**Signature**

```ts
export declare const layerBun: (connectionOptions: Connection.MobyConnectionOptions) => MobyLayer
```

Added in v1.0.0

## layerDeno

**Signature**

```ts
export declare const layerDeno: (connectionOptions: Connection.MobyConnectionOptions) => MobyLayer
```

Added in v1.0.0

## layerNodeJS

**Signature**

```ts
export declare const layerNodeJS: (connectionOptions: Connection.MobyConnectionOptions) => MobyLayer
```

Added in v1.0.0

## layerUndici

**Signature**

```ts
export declare const layerUndici: (connectionOptions: Connection.MobyConnectionOptions) => MobyLayer
```

Added in v1.0.0

## layerWeb

**Signature**

```ts
export declare const layerWeb: (
  connectionOptions: Connection.HttpConnectionOptionsTagged | Connection.HttpsConnectionOptionsTagged
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
