---
title: Swarm.ts
nav_order: 20
parent: Modules
---

## Swarm overview

Swarms service

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Errors](#errors)
  - [SwarmsError (class)](#swarmserror-class)
- [Layers](#layers)
  - [fromAgent](#fromagent)
  - [fromConnectionOptions](#fromconnectionoptions)
  - [layer](#layer)
- [Services](#services)
  - [make](#make)
- [Tags](#tags)
  - [Swarms](#swarms)
  - [Swarms (interface)](#swarms-interface)
- [utils](#utils)
  - [SwarmLeaveOptions (interface)](#swarmleaveoptions-interface)
  - [SwarmUpdateOptions (interface)](#swarmupdateoptions-interface)

---

# Errors

## SwarmsError (class)

**Signature**

```ts
export declare class SwarmsError
```

Added in v1.0.0

# Layers

## fromAgent

Constructs a layer from an agent effect

**Signature**

```ts
export declare const fromAgent: (
  agent: Effect.Effect<IMobyConnectionAgentImpl, never, Scope.Scope>
) => Layer.Layer<Swarms, never, Scope.Scope>
```

Added in v1.0.0

## fromConnectionOptions

Constructs a layer from agent connection options

**Signature**

```ts
export declare const fromConnectionOptions: (
  connectionOptions: MobyConnectionOptions
) => Layer.Layer<Swarms, never, Scope.Scope>
```

Added in v1.0.0

## layer

Configs layer that depends on the MobyConnectionAgent

**Signature**

```ts
export declare const layer: Layer.Layer<Swarms, never, IMobyConnectionAgent>
```

Added in v1.0.0

# Services

## make

**Signature**

```ts
export declare const make: Effect.Effect<Swarms, never, IMobyConnectionAgent | HttpClient.client.Client.Default>
```

Added in v1.0.0

# Tags

## Swarms

Swarms service

**Signature**

```ts
export declare const Swarms: Context.Tag<Swarms, Swarms>
```

Added in v1.0.0

## Swarms (interface)

**Signature**

```ts
export interface Swarms {
  /** Inspect swarm */
  readonly inspect: () => Effect.Effect<Readonly<Swarm>, SwarmsError>

  /** Initialize a new swarm */
  readonly init: (
    options: Schema.Schema.Encoded<typeof SwarmInitRequest>
  ) => Effect.Effect<Readonly<string>, SwarmsError>

  /**
   * Join an existing swarm
   *
   * @param body -
   */
  readonly join: (options: Schema.Schema.Encoded<typeof SwarmInitRequest>) => Effect.Effect<void, SwarmsError>

  /**
   * Leave a swarm
   *
   * @param force - Force leave swarm, even if this is the last manager or
   *   that it will break the cluster.
   */
  readonly leave: (options: SwarmLeaveOptions) => Effect.Effect<void, SwarmsError>

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
  readonly update: (options: SwarmUpdateOptions) => Effect.Effect<void, SwarmsError>

  /** Get the unlock key */
  readonly unlockkey: () => Effect.Effect<UnlockKeyResponse, SwarmsError>

  /** Unlock a locked manager */
  readonly unlock: (options: Schema.Schema.Encoded<typeof SwarmUnlockRequest>) => Effect.Effect<void, SwarmsError>
}
```

Added in v1.0.0

# utils

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
  readonly body: SwarmSpec
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
