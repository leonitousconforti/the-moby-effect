---
title: Distribution.ts
nav_order: 5
parent: Modules
---

## Distribution overview

Distributions service

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Errors](#errors)
  - [DistributionsError (class)](#distributionserror-class)
- [Layers](#layers)
  - [fromAgent](#fromagent)
  - [fromConnectionOptions](#fromconnectionoptions)
  - [layer](#layer)
- [Services](#services)
  - [make](#make)
- [Tags](#tags)
  - [Distributions](#distributions)
  - [Distributions (interface)](#distributions-interface)
- [utils](#utils)
  - [DistributionInspectOptions (interface)](#distributioninspectoptions-interface)

---

# Errors

## DistributionsError (class)

**Signature**

```ts
export declare class DistributionsError
```

Added in v1.0.0

# Layers

## fromAgent

Constructs a layer from an agent effect

**Signature**

```ts
export declare const fromAgent: (
  agent: Effect.Effect<IMobyConnectionAgentImpl, never, Scope.Scope>
) => Layer.Layer<Distributions, never, Scope.Scope>
```

Added in v1.0.0

## fromConnectionOptions

Constructs a layer from agent connection options

**Signature**

```ts
export declare const fromConnectionOptions: (
  connectionOptions: MobyConnectionOptions
) => Layer.Layer<Distributions, never, Scope.Scope>
```

Added in v1.0.0

## layer

Distributions layer that depends on the MobyConnectionAgent

**Signature**

```ts
export declare const layer: Layer.Layer<Distributions, never, IMobyConnectionAgent>
```

Added in v1.0.0

# Services

## make

**Signature**

```ts
export declare const make: Effect.Effect<Distributions, never, IMobyConnectionAgent | HttpClient.client.Client.Default>
```

Added in v1.0.0

# Tags

## Distributions

Distributions service

**Signature**

```ts
export declare const Distributions: Context.Tag<Distributions, Distributions>
```

Added in v1.0.0

## Distributions (interface)

Distributions service

**Signature**

```ts
export interface Distributions {
  /**
   * Get image information from the registry
   *
   * @param name - Image name or id
   */
  readonly inspect: (
    options: DistributionInspectOptions
  ) => Effect.Effect<Readonly<DistributionInspect>, DistributionsError, never>
}
```

Added in v1.0.0

# utils

## DistributionInspectOptions (interface)

**Signature**

```ts
export interface DistributionInspectOptions {
  /** Image name or id */
  readonly name: string
}
```

Added in v1.0.0
