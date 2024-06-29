---
title: moby/Distribution.ts
nav_order: 8
parent: Modules
---

## Distribution overview

Distributions service

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Errors](#errors)
  - [DistributionsError (class)](#distributionserror-class)
  - [DistributionsErrorTypeId](#distributionserrortypeid)
  - [DistributionsErrorTypeId (type alias)](#distributionserrortypeid-type-alias)
  - [isDistributionsError](#isdistributionserror)
- [Layers](#layers)
  - [fromAgent](#fromagent)
  - [fromConnectionOptions](#fromconnectionoptions)
  - [layer](#layer)
- [Params](#params)
  - [DistributionInspectOptions (interface)](#distributioninspectoptions-interface)
- [Services](#services)
  - [make](#make)
- [Tags](#tags)
  - [Distributions](#distributions)
  - [Distributions (interface)](#distributions-interface)
  - [DistributionsImpl (interface)](#distributionsimpl-interface)

---

# Errors

## DistributionsError (class)

**Signature**

```ts
export declare class DistributionsError
```

Added in v1.0.0

## DistributionsErrorTypeId

**Signature**

```ts
export declare const DistributionsErrorTypeId: typeof DistributionsErrorTypeId
```

Added in v1.0.0

## DistributionsErrorTypeId (type alias)

**Signature**

```ts
export type DistributionsErrorTypeId = typeof DistributionsErrorTypeId
```

Added in v1.0.0

## isDistributionsError

**Signature**

```ts
export declare const isDistributionsError: (u: unknown) => u is DistributionsError
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

# Params

## DistributionInspectOptions (interface)

**Signature**

```ts
export interface DistributionInspectOptions {
  readonly name: string
}
```

Added in v1.0.0

# Services

## make

**Signature**

```ts
export declare const make: Effect.Effect<DistributionsImpl, never, IMobyConnectionAgent | HttpClient.HttpClient.Default>
```

Added in v1.0.0

# Tags

## Distributions

Distributions service

**Signature**

```ts
export declare const Distributions: Context.Tag<Distributions, DistributionsImpl>
```

Added in v1.0.0

## Distributions (interface)

**Signature**

```ts
export interface Distributions {
  readonly _: unique symbol
}
```

Added in v1.0.0

## DistributionsImpl (interface)

Distributions service

**Signature**

```ts
export interface DistributionsImpl {
  /** Get image information from the registry */
  readonly inspect: (
    options: DistributionInspectOptions
  ) => Effect.Effect<Readonly<DistributionInspect>, DistributionsError, never>
}
```

Added in v1.0.0
