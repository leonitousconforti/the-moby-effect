---
title: endpoints/Session.ts
nav_order: 19
parent: Modules
---

## Session overview

Sessions service

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Errors](#errors)
  - [SessionsError (class)](#sessionserror-class)
  - [isSessionsError](#issessionserror)
- [Layers](#layers)
  - [SessionsLayer](#sessionslayer)
- [Tags](#tags)
  - [Sessions (class)](#sessions-class)

---

# Errors

## SessionsError (class)

**Signature**

```ts
export declare class SessionsError
```

Added in v1.0.0

## isSessionsError

**Signature**

```ts
export declare const isSessionsError: (u: unknown) => u is SessionsError
```

Added in v1.0.0

# Layers

## SessionsLayer

Configs layer that depends on the MobyConnectionAgent

**Signature**

```ts
export declare const SessionsLayer: Layer.Layer<
  Sessions,
  never,
  HttpClient.HttpClient<HttpClientError.HttpClientError, Scope.Scope>
>
```

Added in v1.0.0

# Tags

## Sessions (class)

Sessions service

**Signature**

```ts
export declare class Sessions
```

Added in v1.0.0
