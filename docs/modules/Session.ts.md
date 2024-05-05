---
title: Session.ts
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
- [Layers](#layers)
  - [fromAgent](#fromagent)
  - [fromConnectionOptions](#fromconnectionoptions)
  - [layer](#layer)
- [Services](#services)
  - [make](#make)
- [Tags](#tags)
  - [Sessions](#sessions)
  - [Sessions (interface)](#sessions-interface)

---

# Errors

## SessionsError (class)

**Signature**

```ts
export declare class SessionsError
```

Added in v1.0.0

# Layers

## fromAgent

Constructs a layer from an agent effect

**Signature**

```ts
export declare const fromAgent: (
  agent: Effect.Effect<IMobyConnectionAgentImpl, never, Scope.Scope>
) => Layer.Layer<Sessions, never, Scope.Scope>
```

Added in v1.0.0

## fromConnectionOptions

Constructs a layer from agent connection options

**Signature**

```ts
export declare const fromConnectionOptions: (
  connectionOptions: MobyConnectionOptions
) => Layer.Layer<Sessions, never, Scope.Scope>
```

Added in v1.0.0

## layer

Configs layer that depends on the MobyConnectionAgent

**Signature**

```ts
export declare const layer: Layer.Layer<Sessions, never, IMobyConnectionAgent>
```

Added in v1.0.0

# Services

## make

**Signature**

```ts
export declare const make: Effect.Effect<Sessions, never, IMobyConnectionAgent | HttpClient.client.Client.Default>
```

Added in v1.0.0

# Tags

## Sessions

Sessions service

**Signature**

```ts
export declare const Sessions: Context.Tag<Sessions, Sessions>
```

Added in v1.0.0

## Sessions (interface)

**Signature**

```ts
export interface Sessions {
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
