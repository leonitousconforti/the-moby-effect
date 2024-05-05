---
title: System.ts
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
- [Layers](#layers)
  - [fromAgent](#fromagent)
  - [fromConnectionOptions](#fromconnectionoptions)
  - [layer](#layer)
- [Services](#services)
  - [make](#make)
- [Tags](#tags)
  - [Systems](#systems)
  - [Systems (interface)](#systems-interface)
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

# Layers

## fromAgent

Constructs a layer from an agent effect

**Signature**

```ts
export declare const fromAgent: (
  agent: Effect.Effect<IMobyConnectionAgentImpl, never, Scope.Scope>
) => Layer.Layer<Systems, never, Scope.Scope>
```

Added in v1.0.0

## fromConnectionOptions

Constructs a layer from agent connection options

**Signature**

```ts
export declare const fromConnectionOptions: (
  connectionOptions: MobyConnectionOptions
) => Layer.Layer<Systems, never, Scope.Scope>
```

Added in v1.0.0

## layer

Configs layer that depends on the MobyConnectionAgent

**Signature**

```ts
export declare const layer: Layer.Layer<Systems, never, IMobyConnectionAgent>
```

Added in v1.0.0

# Services

## make

**Signature**

```ts
export declare const make: Effect.Effect<Systems, never, IMobyConnectionAgent | HttpClient.client.Client.Default>
```

Added in v1.0.0

# Tags

## Systems

Systems service

**Signature**

```ts
export declare const Systems: Context.Tag<Systems, Systems>
```

Added in v1.0.0

## Systems (interface)

**Signature**

```ts
export interface Systems {
  /**
   * Check auth configuration
   *
   * @param authConfig - Authentication to check
   */
  readonly auth: (options: Schema.Schema.Encoded<typeof AuthConfig>) => Effect.Effect<SystemAuthResponse, SystemsError>

  /** Get system information */
  readonly info: () => Effect.Effect<Readonly<SystemInfo>, SystemsError>

  /** Get version */
  readonly version: () => Effect.Effect<Readonly<SystemVersion>, SystemsError>

  /** Ping */
  readonly ping: () => Effect.Effect<Readonly<string>, SystemsError>

  /** Ping */
  readonly pingHead: () => Effect.Effect<void, SystemsError>

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
  readonly events: (
    options?: SystemEventsOptions | undefined
  ) => Effect.Effect<Stream.Stream<EventMessage, SystemsError>, SystemsError, Scope.Scope>

  /**
   * Get data usage information
   *
   * @param type - Object types, for which to compute and return data.
   */
  readonly dataUsage: (
    options?: SystemDataUsageOptions | undefined
  ) => Effect.Effect<SystemDataUsageResponse, SystemsError>
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
