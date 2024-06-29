---
title: moby/Networks.ts
nav_order: 11
parent: Modules
---

## Networks overview

Networks service

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Errors](#errors)
  - [NetworksError (class)](#networkserror-class)
  - [NetworksErrorTypeId](#networkserrortypeid)
  - [NetworksErrorTypeId (type alias)](#networkserrortypeid-type-alias)
  - [isNetworksError](#isnetworkserror)
- [Layers](#layers)
  - [fromAgent](#fromagent)
  - [fromConnectionOptions](#fromconnectionoptions)
  - [layer](#layer)
- [Services](#services)
  - [make](#make)
- [Tags](#tags)
  - [Networks](#networks)
  - [Networks (interface)](#networks-interface)
- [utils](#utils)
  - [NetworkConnectOptions (interface)](#networkconnectoptions-interface)
  - [NetworkDeleteOptions (interface)](#networkdeleteoptions-interface)
  - [NetworkDisconnectOptions (interface)](#networkdisconnectoptions-interface)
  - [NetworkInspectOptions (interface)](#networkinspectoptions-interface)
  - [NetworkListOptions (interface)](#networklistoptions-interface)
  - [NetworkPruneOptions (interface)](#networkpruneoptions-interface)

---

# Errors

## NetworksError (class)

**Signature**

```ts
export declare class NetworksError
```

Added in v1.0.0

## NetworksErrorTypeId

**Signature**

```ts
export declare const NetworksErrorTypeId: typeof NetworksErrorTypeId
```

Added in v1.0.0

## NetworksErrorTypeId (type alias)

**Signature**

```ts
export type NetworksErrorTypeId = typeof NetworksErrorTypeId
```

Added in v1.0.0

## isNetworksError

**Signature**

```ts
export declare const isNetworksError: (u: unknown) => u is NetworksError
```

Added in v1.0.0

# Layers

## fromAgent

Constructs a layer from an agent effect

**Signature**

```ts
export declare const fromAgent: (
  agent: Effect.Effect<IMobyConnectionAgentImpl, never, Scope.Scope>
) => Layer.Layer<Networks, never, Scope.Scope>
```

Added in v1.0.0

## fromConnectionOptions

Constructs a layer from agent connection options

**Signature**

```ts
export declare const fromConnectionOptions: (
  connectionOptions: MobyConnectionOptions
) => Layer.Layer<Networks, never, Scope.Scope>
```

Added in v1.0.0

## layer

Configs layer that depends on the MobyConnectionAgent

**Signature**

```ts
export declare const layer: Layer.Layer<Networks, never, IMobyConnectionAgent>
```

Added in v1.0.0

# Services

## make

**Signature**

```ts
export declare const make: Effect.Effect<Networks, never, IMobyConnectionAgent | HttpClient.HttpClient.Default>
```

Added in v1.0.0

# Tags

## Networks

Networks service

**Signature**

```ts
export declare const Networks: Context.Tag<Networks, Networks>
```

Added in v1.0.0

## Networks (interface)

**Signature**

```ts
export interface Networks {
  /**
   * List networks
   *
   * @param filters - JSON encoded value of the filters (a
   *   `map[string][]string`) to process on the networks list.
   *
   *   Available filters:
   *
   *   - `dangling=<boolean>` When set to `true` (or `1`), returns all networks
   *       that are not in use by a container. When set to `false` (or `0`),
   *       only networks that are in use by one or more containers are
   *       returned.
   *   - `driver=<driver-name>` Matches a network's driver.
   *   - `id=<network-id>` Matches all or part of a network ID.
   *   - `label=<key>` or `label=<key>=<value>` of a network label.
   *   - `name=<network-name>` Matches all or part of a network name.
   *   - `scope=["swarm"|"global"|"local"]` Filters networks by scope (`swarm`,
   *       `global`, or `local`).
   *   - `type=["custom"|"builtin"]` Filters networks by type. The `custom`
   *       keyword returns all user-defined networks.
   */
  readonly list: (options?: NetworkListOptions | undefined) => Effect.Effect<Readonly<Array<Network>>, NetworksError>

  /**
   * Remove a network
   *
   * @param id - Network ID or name
   */
  readonly delete: (options: NetworkDeleteOptions) => Effect.Effect<void, NetworksError>

  /**
   * Inspect a network
   *
   * @param id - Network ID or name
   * @param verbose - Detailed inspect output for troubleshooting
   * @param scope - Filter the network by scope (swarm, global, or local)
   */
  readonly inspect: (options: NetworkInspectOptions) => Effect.Effect<Readonly<Network>, NetworksError>

  /**
   * Create a network
   *
   * @param networkConfig - Network configuration
   */
  readonly create: (options: NetworkCreateRequest) => Effect.Effect<NetworkCreateResponse, NetworksError>

  /**
   * Connect a container to a network
   *
   * @param id - Network ID or name
   * @param container -
   */
  readonly connect: (options: NetworkConnectOptions) => Effect.Effect<void, NetworksError>

  /**
   * Disconnect a container from a network
   *
   * @param id - Network ID or name
   * @param container -
   */
  readonly disconnect: (options: NetworkDisconnectOptions) => Effect.Effect<void, NetworksError>

  /**
   * Delete unused networks
   *
   * @param filters - Filters to process on the prune list, encoded as JSON (a
   *   `map[string][]string`).
   *
   *   Available filters:
   *
   *   - `until=<timestamp>` Prune networks created before this timestamp. The
   *       `<timestamp>` can be Unix timestamps, date formatted timestamps, or
   *       Go duration strings (e.g. `10m`, `1h30m`) computed relative to the
   *       daemon machine’s time.
   *   - `label` (`label=<key>`, `label=<key>=<value>`, `label!=<key>`, or
   *       `label!=<key>=<value>`) Prune networks with (or without, in case
   *       `label!=...` is used) the specified labels.
   */
  readonly prune: (options: NetworkPruneOptions) => Effect.Effect<NetworkPruneResponse, NetworksError>
}
```

Added in v1.0.0

# utils

## NetworkConnectOptions (interface)

**Signature**

```ts
export interface NetworkConnectOptions {
  /** Network ID or name */
  readonly id: string
  readonly container: NetworkConnectRequest
}
```

Added in v1.0.0

## NetworkDeleteOptions (interface)

**Signature**

```ts
export interface NetworkDeleteOptions {
  /** Network ID or name */
  readonly id: string
}
```

Added in v1.0.0

## NetworkDisconnectOptions (interface)

**Signature**

```ts
export interface NetworkDisconnectOptions {
  /** Network ID or name */
  readonly id: string
  readonly container: NetworkDisconnectRequest
}
```

Added in v1.0.0

## NetworkInspectOptions (interface)

**Signature**

```ts
export interface NetworkInspectOptions {
  /** Network ID or name */
  readonly id: string
  /** Detailed inspect output for troubleshooting */
  readonly verbose?: boolean
  /** Filter the network by scope (swarm, global, or local) */
  readonly scope?: string
}
```

Added in v1.0.0

## NetworkListOptions (interface)

**Signature**

```ts
export interface NetworkListOptions {
  /**
   * JSON encoded value of the filters (a `map[string][]string`) to process on
   * the networks list.
   *
   * Available filters:
   *
   * - `dangling=<boolean>` When set to `true` (or `1`), returns all networks
   *   that are not in use by a container. When set to `false` (or `0`), only
   *   networks that are in use by one or more containers are returned.
   * - `driver=<driver-name>` Matches a network's driver.
   * - `id=<network-id>` Matches all or part of a network ID.
   * - `label=<key>` or `label=<key>=<value>` of a network label.
   * - `name=<network-name>` Matches all or part of a network name.
   * - `scope=["swarm"|"global"|"local"]` Filters networks by scope (`swarm`,
   *   `global`, or `local`).
   * - `type=["custom"|"builtin"]` Filters networks by type. The `custom`
   *   keyword returns all user-defined networks.
   */
  readonly filters?: string
}
```

Added in v1.0.0

## NetworkPruneOptions (interface)

**Signature**

```ts
export interface NetworkPruneOptions {
  /**
   * Filters to process on the prune list, encoded as JSON (a
   * `map[string][]string`).
   *
   * Available filters:
   *
   * - `until=<timestamp>` Prune networks created before this timestamp. The
   *   `<timestamp>` can be Unix timestamps, date formatted timestamps, or Go
   *   duration strings (e.g. `10m`, `1h30m`) computed relative to the daemon
   *   machine’s time.
   * - `label` (`label=<key>`, `label=<key>=<value>`, `label!=<key>`, or
   *   `label!=<key>=<value>`) Prune networks with (or without, in case
   *   `label!=...` is used) the specified labels.
   */
  readonly filters?: string
}
```

Added in v1.0.0
