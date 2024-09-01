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
  - [SessionsErrorTypeId](#sessionserrortypeid)
  - [SessionsErrorTypeId (type alias)](#sessionserrortypeid-type-alias)
  - [isSessionsError](#issessionserror)
- [Layers](#layers)
  - [layer](#layer)
- [Services](#services)
  - [make](#make)
- [Tags](#tags)
  - [Sessions (class)](#sessions-class)
  - [SessionsImpl (interface)](#sessionsimpl-interface)

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
export declare const layer: Layer.Layer<Sessions, never, HttpClient.HttpClient.Default>
```

Added in v1.0.0

# Services

## make

**Signature**

```ts
export declare const make: Effect.Effect<SessionsImpl, never, HttpClient.HttpClient.Default>
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

## SessionsImpl (interface)

**Signature**

```ts
export interface SessionsImpl {
  /**
   * Start a new interactive session with a server. Session allows server to
   * call back to the client for advanced capabilities. ### Hijacking This
   * endpoint hijacks the HTTP connection to HTTP2 transport that allows the
   * client to expose gPRC services on that connection. For example, the
   * client sends this request to upgrade the connection: `POST /session
   * HTTP/1.1 Upgrade: h2c Connection: Upgrade` The Docker daemon responds
   * with a `101 UPGRADED` response follow with the raw stream: `HTTP/1.1 101
   * UPGRADED Connection: Upgrade Upgrade: h2c`
   */
  readonly session: () => Effect.Effect<Socket.Socket, SessionsError, Scope.Scope>
}
```

Added in v1.0.0
