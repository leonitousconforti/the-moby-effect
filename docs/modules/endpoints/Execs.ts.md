---
title: endpoints/Execs.ts
nav_order: 13
parent: Modules
---

## Execs overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Errors](#errors)
  - [ExecsError (class)](#execserror-class)
  - [isExecsError](#isexecserror)
- [Layers](#layers)
  - [ExecsLayer](#execslayer)
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

## isExecsError

**Signature**

```ts
export declare const isExecsError: (u: unknown) => u is ExecsError
```

Added in v1.0.0

# Layers

## ExecsLayer

**Signature**

```ts
export declare const ExecsLayer: Layer.Layer<
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
