---
title: endpoints/Distribution.ts
nav_order: 11
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
  - [layer](#layer)
- [Params](#params)
  - [DistributionInspectOptions (interface)](#distributioninspectoptions-interface)
- [Tags](#tags)
  - [Distributions (class)](#distributions-class)
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

## layer

**Signature**

```ts
export declare const layer: Layer.Layer<
  Distributions,
  never,
  HttpClient.HttpClient<HttpClientError.HttpClientError, Scope>
>
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

# Tags

## Distributions (class)

**Signature**

```ts
export declare class Distributions
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
  ) => Effect.Effect<Readonly<RegistryDistributionInspect>, DistributionsError, never>
}
```

Added in v1.0.0
