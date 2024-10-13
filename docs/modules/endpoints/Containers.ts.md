---
title: endpoints/Containers.ts
nav_order: 11
parent: Modules
---

## Containers overview

Create and manage containers

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Errors](#errors)
  - [ContainersError (class)](#containerserror-class)
  - [ContainersErrorTypeId](#containerserrortypeid)
  - [ContainersErrorTypeId (type alias)](#containerserrortypeid-type-alias)
  - [isContainersError](#iscontainerserror)
- [Layers](#layers)
  - [layer](#layer)
- [Services](#services)
  - [Containers (class)](#containers-class)

---

# Errors

## ContainersError (class)

**Signature**

```ts
export declare class ContainersError
```

Added in v1.0.0

## ContainersErrorTypeId

**Signature**

```ts
export declare const ContainersErrorTypeId: typeof ContainersErrorTypeId
```

Added in v1.0.0

## ContainersErrorTypeId (type alias)

**Signature**

```ts
export type ContainersErrorTypeId = typeof ContainersErrorTypeId
```

Added in v1.0.0

## isContainersError

**Signature**

```ts
export declare const isContainersError: (u: unknown) => u is ContainersError
```

Added in v1.0.0

# Layers

## layer

**Signature**

```ts
export declare const layer: Layer.Layer<
  Containers,
  never,
  HttpClient.HttpClient<HttpClientError.HttpClientError, Scope.Scope>
>
```

Added in v1.0.0

# Services

## Containers (class)

**Signature**

```ts
export declare class Containers
```

Added in v1.0.0
