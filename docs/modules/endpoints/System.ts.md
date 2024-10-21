---
title: endpoints/System.ts
nav_order: 21
parent: Modules
---

## System overview

Systems service

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Errors](#errors)
  - [SystemsError (class)](#systemserror-class)
  - [isSystemsError](#issystemserror)
- [Layers](#layers)
  - [SystemsLayer](#systemslayer)
- [Tags](#tags)
  - [Systems (class)](#systems-class)

---

# Errors

## SystemsError (class)

**Signature**

```ts
export declare class SystemsError
```

Added in v1.0.0

## isSystemsError

**Signature**

```ts
export declare const isSystemsError: (u: unknown) => u is SystemsError
```

Added in v1.0.0

# Layers

## SystemsLayer

**Signature**

```ts
export declare const SystemsLayer: Layer.Layer<
  Systems,
  never,
  HttpClient.HttpClient<HttpClientError.HttpClientError, Scope>
>
```

Added in v1.0.0

# Tags

## Systems (class)

Systems service

**Signature**

```ts
export declare class Systems
```

Added in v1.0.0
