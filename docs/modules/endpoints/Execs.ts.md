---
title: endpoints/Execs.ts
nav_order: 15
parent: Modules
---

## Execs overview

Execs service

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Errors](#errors)
  - [ExecsError (class)](#execserror-class)
  - [ExecsErrorTypeId](#execserrortypeid)
  - [ExecsErrorTypeId (type alias)](#execserrortypeid-type-alias)
  - [isDistributionsError](#isdistributionserror)
- [Layers](#layers)
  - [layer](#layer)
- [Tags](#tags)
  - [Execs (class)](#execs-class)

---

# Errors

## ExecsError (class)

**Signature**

```ts
export declare class ExecsError
```

Added in v1.0.0

## ExecsErrorTypeId

**Signature**

```ts
export declare const ExecsErrorTypeId: typeof ExecsErrorTypeId
```

Added in v1.0.0

## ExecsErrorTypeId (type alias)

**Signature**

```ts
export type ExecsErrorTypeId = typeof ExecsErrorTypeId
```

Added in v1.0.0

## isDistributionsError

**Signature**

```ts
export declare const isDistributionsError: (u: unknown) => u is ExecsError
```

Added in v1.0.0

# Layers

## layer

**Signature**

```ts
export declare const layer: Layer.Layer<
  Execs,
  never,
  HttpClient.HttpClient<HttpClientError.HttpClientError, Scope.Scope>
>
```

Added in v1.0.0

# Tags

## Execs (class)

Execs service

**Signature**

```ts
export declare class Execs
```

Added in v1.0.0
