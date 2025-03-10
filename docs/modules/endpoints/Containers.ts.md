---
title: endpoints/Containers.ts
nav_order: 14
parent: Modules
---

## Containers overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Errors](#errors)
  - [ContainersError (class)](#containerserror-class)
  - [isContainersError](#iscontainerserror)
- [Layers](#layers)
  - [ContainersLayer](#containerslayer)
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

## isContainersError

**Signature**

```ts
export declare const isContainersError: (u: unknown) => u is ContainersError
```

Added in v1.0.0

# Layers

## ContainersLayer

**Signature**

```ts
export declare const ContainersLayer: Layer.Layer<
  Containers,
  never,
  HttpClient.HttpClient | Socket.WebSocketConstructor
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
