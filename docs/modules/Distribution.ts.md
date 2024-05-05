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

- [Distributions](#distributions)
  - [Distributions](#distributions-1)
  - [Distributions (interface)](#distributions-interface)
  - [fromAgent](#fromagent)
  - [fromConnectionOptions](#fromconnectionoptions)
  - [layer](#layer)
  - [make](#make)
- [Errors](#errors)
  - [DistributionsError (class)](#distributionserror-class)
- [utils](#utils)
  - [DistributionInspectOptions (interface)](#distributioninspectoptions-interface)

---

# Distributions

## Distributions

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

## fromAgent

**Signature**

```ts
export declare const fromAgent: (
  agent: Effect.Effect<IMobyConnectionAgentImpl, never, Scope.Scope>
) => Layer.Layer<Distributions, never, Scope.Scope>
```

Added in v1.0.0

## fromConnectionOptions

**Signature**

```ts
export declare const fromConnectionOptions: (
  connectionOptions: MobyConnectionOptions
) => Layer.Layer<Distributions, never, Scope.Scope>
```

Added in v1.0.0

## layer

**Signature**

```ts
export declare const layer: Layer.Layer<Distributions, never, IMobyConnectionAgent>
```

Added in v1.0.0

## make

**Signature**

```ts
export declare const make: Effect.Effect<Distributions, never, IMobyConnectionAgent | HttpClient.client.Client.Default>
```

Added in v1.0.0

# Errors

## DistributionsError (class)

**Signature**

```ts
export declare class DistributionsError
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
