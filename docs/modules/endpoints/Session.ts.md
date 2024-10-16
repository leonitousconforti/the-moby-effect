---
title: endpoints/Session.ts
nav_order: 23
parent: Modules
---

## Session overview

Sessions service

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Errors](#errors)
  - [SessionsError (class)](#sessionserror-class)
  - [SessionsErrorTypeId](#sessionserrortypeid)
  - [SessionsErrorTypeId (type alias)](#sessionserrortypeid-type-alias)
  - [isSessionsError](#issessionserror)
- [Layers](#layers)
  - [layer](#layer)
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

## SessionsErrorTypeId

**Signature**

```ts
export declare const SessionsErrorTypeId: typeof SessionsErrorTypeId
```

Added in v1.0.0

## SessionsErrorTypeId (type alias)

**Signature**

```ts
export type SessionsErrorTypeId = typeof SessionsErrorTypeId
```

Added in v1.0.0

## isSessionsError

**Signature**

```ts
export declare const isSessionsError: (u: unknown) => u is SessionsError
```

Added in v1.0.0

# Layers

## layer

Configs layer that depends on the MobyConnectionAgent

**Signature**

```ts
export declare const layer: Layer.Layer<
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
