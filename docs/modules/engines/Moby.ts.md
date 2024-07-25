---
title: engines/Moby.ts
nav_order: 27
parent: Modules
---

## Moby overview

Generic Moby helpers

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Layer](#layer)
  - [layerBun](#layerbun)
  - [layerDeno](#layerdeno)
  - [layerNodeJS](#layernodejs)
  - [layerUndici](#layerundici)
  - [layerWeb](#layerweb)
- [Layers](#layers)
  - [MobyLayer (type alias)](#mobylayer-type-alias)
  - [layer](#layer-1)

---

# Layer

## layerBun

**Signature**

```ts
export declare const layerBun: (connectionOptions: PlatformAgents.MobyConnectionOptions) => MobyLayer
```

Added in v1.0.0

## layerDeno

**Signature**

```ts
export declare const layerDeno: (connectionOptions: PlatformAgents.MobyConnectionOptions) => MobyLayer
```

Added in v1.0.0

## layerNodeJS

**Signature**

```ts
export declare const layerNodeJS: (connectionOptions: PlatformAgents.MobyConnectionOptions) => MobyLayer
```

Added in v1.0.0

## layerUndici

**Signature**

```ts
export declare const layerUndici: (connectionOptions: PlatformAgents.MobyConnectionOptions) => MobyLayer
```

Added in v1.0.0

## layerWeb

**Signature**

```ts
export declare const layerWeb: (
  connectionOptions: PlatformAgents.MobyConnectionOptions
) => Layer.Layer<
  Layer.Layer.Success<MobyLayer>,
  Layer.Layer.Error<MobyLayer> | ConfigError.ConfigError,
  Layer.Layer.Context<MobyLayer>
>
```

Added in v1.0.0

# Layers

## MobyLayer (type alias)

Merges all the layers into a single layer

**Signature**

```ts
export type MobyLayer = Layer.Layer<
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
  | Swarm.Swarms
  | System.Systems
  | Tasks.Tasks
  | Volumes.Volumes,
  never,
  never
>
```

Added in v1.0.0

## layer

Merges all the layers into a single layer

**Signature**

```ts
export declare const layer: Layer.Layer<
  | Containers.Containers
  | Execs.Execs
  | Images.Images
  | Networks.Networks
  | Secrets.Secrets
  | System.Systems
  | Volumes.Volumes
  | Configs.Configs
  | Distributions.Distributions
  | Nodes.Nodes
  | Plugins.Plugins
  | Services.Services
  | Sessions.Sessions
  | Swarm.Swarms
  | Tasks.Tasks,
  never,
  HttpClient.HttpClient.Default
>
```

Added in v1.0.0
