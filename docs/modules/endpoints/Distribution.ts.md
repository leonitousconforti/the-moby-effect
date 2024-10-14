---
title: endpoints/Distribution.ts
nav_order: 14
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
- [Tags](#tags)
  - [Distributions (class)](#distributions-class)

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

# Tags

## Distributions (class)

**Signature**

```ts
export declare class Distributions
```

Added in v1.0.0
