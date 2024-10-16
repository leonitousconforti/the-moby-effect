---
title: endpoints/Swarm.ts
nav_order: 25
parent: Modules
---

## Swarm overview

Swarms service

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Errors](#errors)
  - [SwarmsError (class)](#swarmserror-class)
  - [SwarmsErrorTypeId](#swarmserrortypeid)
  - [SwarmsErrorTypeId (type alias)](#swarmserrortypeid-type-alias)
  - [isSwarmsError](#isswarmserror)
- [Layers](#layers)
  - [layer](#layer)
- [Params](#params)
  - [SwarmLeaveOptions (interface)](#swarmleaveoptions-interface)
  - [SwarmUpdateOptions (interface)](#swarmupdateoptions-interface)
- [Tags](#tags)
  - [Swarm (class)](#swarm-class)
  - [SwarmImpl (interface)](#swarmimpl-interface)

---

# Errors

## SwarmsError (class)

**Signature**

```ts
export declare class SwarmsError
```

Added in v1.0.0

## SwarmsErrorTypeId

**Signature**

```ts
export declare const SwarmsErrorTypeId: typeof SwarmsErrorTypeId
```

Added in v1.0.0

## SwarmsErrorTypeId (type alias)

**Signature**

```ts
export type SwarmsErrorTypeId = typeof SwarmsErrorTypeId
```

Added in v1.0.0

## isSwarmsError

**Signature**

```ts
export declare const isSwarmsError: (u: unknown) => u is SwarmsError
```

Added in v1.0.0

# Layers

## layer

Configs layer that depends on the MobyConnectionAgent

**Signature**

```ts
export declare const layer: Layer.Layer<Swarm, never, HttpClient.HttpClient<HttpClientError.HttpClientError, Scope>>
```

Added in v1.0.0

# Params

## SwarmLeaveOptions (interface)

**Signature**

```ts
export interface SwarmLeaveOptions {
  /**
   * Force leave swarm, even if this is the last manager or that it will break
   * the cluster.
   */
  readonly force?: boolean
}
```

Added in v1.0.0

## SwarmUpdateOptions (interface)

**Signature**

```ts
export interface SwarmUpdateOptions {
  readonly spec: SwarmSpec
  /**
   * The version number of the swarm object being updated. This is required to
   * avoid conflicting writes.
   */
  readonly version: number
  /** Rotate the worker join token. */
  readonly rotateWorkerToken?: boolean
  /** Rotate the manager join token. */
  readonly rotateManagerToken?: boolean
  /** Rotate the manager unlock key. */
  readonly rotateManagerUnlockKey?: boolean
}
```

Added in v1.0.0

# Tags

## Swarm (class)

Swarms service

**Signature**

```ts
export declare class Swarm
```

Added in v1.0.0

## SwarmImpl (interface)

**Signature**

```ts
export interface SwarmImpl {
  /** Inspect swarm */
  readonly inspect: () => Effect.Effect<Readonly<SwarmData>, SwarmsError, never>

  /** Initialize a new swarm */
  readonly init: (options: typeof SwarmInitRequest.Encoded) => Effect.Effect<Readonly<string>, SwarmsError, never>

  /**
   * Join an existing swarm
   *
   * @param body -
   */
  readonly join: (options: typeof SwarmJoinRequest.Encoded) => Effect.Effect<void, SwarmsError, never>

  /**
   * Leave a swarm
   *
   * @param force - Force leave swarm, even if this is the last manager or
   *   that it will break the cluster.
   */
  readonly leave: (options: SwarmLeaveOptions) => Effect.Effect<void, SwarmsError, never>

  /**
   * Update a swarm
   *
   * @param body -
   * @param version - The version number of the swarm object being updated.
   *   This is required to avoid conflicting writes.
   * @param rotateWorkerToken - Rotate the worker join token.
   * @param rotateManagerToken - Rotate the manager join token.
   * @param rotateManagerUnlockKey - Rotate the manager unlock key.
   */
  readonly update: (options: SwarmUpdateOptions) => Effect.Effect<void, SwarmsError, never>

  /** Get the unlock key */
  readonly unlockkey: () => Effect.Effect<SwarmUnlockKeyResponse, SwarmsError, never>

  /** Unlock a locked manager */
  readonly unlock: (options: typeof SwarmUnlockRequest.Encoded) => Effect.Effect<void, SwarmsError, never>
}
```

Added in v1.0.0
