---
title: endpoints/System.ts
nav_order: 32
parent: Modules
---

## System overview

Systems service

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Errors](#errors)
  - [SystemsError (class)](#systemserror-class)
  - [SystemsErrorTypeId](#systemserrortypeid)
  - [SystemsErrorTypeId (type alias)](#systemserrortypeid-type-alias)
  - [isSystemsError](#issystemserror)
- [Layers](#layers)
  - [layer](#layer)
- [Services](#services)
  - [make](#make)
- [Tags](#tags)
  - [Systems (class)](#systems-class)
  - [SystemsImpl (interface)](#systemsimpl-interface)
- [utils](#utils)
  - [SystemDataUsageOptions (interface)](#systemdatausageoptions-interface)
  - [SystemEventsOptions (interface)](#systemeventsoptions-interface)

---

# Errors

## SystemsError (class)

**Signature**

```ts
export declare class SystemsError
```

Added in v1.0.0

## SystemsErrorTypeId

**Signature**

```ts
export declare const SystemsErrorTypeId: typeof SystemsErrorTypeId
```

Added in v1.0.0

## SystemsErrorTypeId (type alias)

**Signature**

```ts
export type SystemsErrorTypeId = typeof SystemsErrorTypeId
```

Added in v1.0.0

## isSystemsError

**Signature**

```ts
export declare const isSystemsError: (u: unknown) => u is SystemsError
```

Added in v1.0.0

# Layers

## layer

Configs layer that depends on the MobyConnectionAgent

**Signature**

```ts
export declare const layer: Layer.Layer<Systems, never, HttpClient.HttpClient.Default>
```

Added in v1.0.0

# Services

## make

**Signature**

```ts
export declare const make: Effect.Effect<SystemsImpl, never, HttpClient.HttpClient.Default>
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

## SystemsImpl (interface)

**Signature**

```ts
export interface SystemsImpl {
  /**
   * Validate credentials for a registry and, if available, get an identity
   * token for accessing the registry without password.
   */
  readonly auth: (
    options: Schema.Schema.Encoded<typeof RegistryAuthConfig>
  ) => Effect.Effect<AuthResponse, SystemsError, never>

  /** Get system information */
  readonly info: () => Effect.Effect<Readonly<SystemInfoResponse>, SystemsError, never>

  /** Get version */
  readonly version: () => Effect.Effect<Readonly<SystemVersionResponse>, SystemsError, never>

  /** Ping */
  readonly ping: () => Effect.Effect<"OK", SystemsError, never>

  /** Ping */
  readonly pingHead: () => Effect.Effect<void, SystemsError, never>

  /**
   * Monitor events
   *
   * @param since - Show events created since this timestamp then stream new
   *   events.
   * @param until - Show events created until this timestamp then stop
   *   streaming.
   * @param filters - A JSON encoded value of filters (a
   *   `map[string][]string`) to process on the event list. Available
   *   filters:
   *
   *   - `config=<string>` config name or ID
   *   - `container=<string>` container name or ID
   *   - `daemon=<string>` daemon name or ID
   *   - `event=<string>` event type
   *   - `image=<string>` image name or ID
   *   - `label=<string>` image or container label
   *   - `network=<string>` network name or ID
   *   - `node=<string>` node ID
   *   - `plugin`=<string> plugin name or ID
   *   - `scope`=<string> local or swarm
   *   - `secret=<string>` secret name or ID
   *   - `service=<string>` service name or ID
   *   - `type=<string>` object to filter by, one of `container`, `image`,
   *       `volume`, `network`, `daemon`, `plugin`, `node`, `service`,
   *       `secret` or `config`
   *   - `volume=<string>` volume name
   */
  readonly events: (options?: SystemEventsOptions | undefined) => Stream.Stream<EventMessage, SystemsError, never>

  /**
   * Get data usage information
   *
   * @param type - Object types, for which to compute and return data.
   */
  readonly dataUsage: (options?: SystemDataUsageOptions | undefined) => Effect.Effect<DiskUsage, SystemsError, never>
}
```

Added in v1.0.0

# utils

## SystemDataUsageOptions (interface)

**Signature**

```ts
export interface SystemDataUsageOptions {
  /** Object types, for which to compute and return data. */
  readonly type?: Array<"container" | "image" | "volume" | "build-cache"> | undefined
}
```

Added in v1.0.0

## SystemEventsOptions (interface)

**Signature**

```ts
export interface SystemEventsOptions {
  /** Show events created since this timestamp then stream new events. */
  readonly since?: string
  /** Show events created until this timestamp then stop streaming. */
  readonly until?: string
  /**
   * A JSON encoded value of filters (a `map[string][]string`) to process on
   * the event list. Available filters:
   *
   * - `config=<string>` config name or ID
   * - `container=<string>` container name or ID
   * - `daemon=<string>` daemon name or ID
   * - `event=<string>` event type
   * - `image=<string>` image name or ID
   * - `label=<string>` image or container label
   * - `network=<string>` network name or ID
   * - `node=<string>` node ID
   * - `plugin`=<string> plugin name or ID
   * - `scope`=<string> local or swarm
   * - `secret=<string>` secret name or ID
   * - `service=<string>` service name or ID
   * - `type=<string>` object to filter by, one of `container`, `image`,
   *   `volume`, `network`, `daemon`, `plugin`, `node`, `service`, `secret` or
   *   `config`
   * - `volume=<string>` volume name
   */
  readonly filters?: {
    config?: string | undefined
    container?: string | undefined
    daemon?: string | undefined
    event?: string | undefined
    image?: string | undefined
    label?: string | undefined
    network?: string | undefined
    node?: string | undefined
    plugin?: string | undefined
    scope?: string | undefined
    secret?: string | undefined
    service?: string | undefined
    type?: string | undefined
    volume?: string | undefined
  }
}
```

Added in v1.0.0
