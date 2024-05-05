---
title: Nodes.ts
nav_order: 12
parent: Modules
---

## Nodes overview

Nodes service

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Errors](#errors)
  - [NodesError (class)](#nodeserror-class)
- [Layers](#layers)
  - [fromAgent](#fromagent)
  - [fromConnectionOptions](#fromconnectionoptions)
  - [layer](#layer)
- [Services](#services)
  - [make](#make)
- [Tags](#tags)
  - [Nodes](#nodes)
  - [Nodes (interface)](#nodes-interface)
- [utils](#utils)
  - [NodeDeleteOptions (interface)](#nodedeleteoptions-interface)
  - [NodeInspectOptions (interface)](#nodeinspectoptions-interface)
  - [NodeListOptions (interface)](#nodelistoptions-interface)
  - [NodeUpdateOptions (interface)](#nodeupdateoptions-interface)

---

# Errors

## NodesError (class)

**Signature**

```ts
export declare class NodesError
```

Added in v1.0.0

# Layers

## fromAgent

Constructs a layer from an agent effect

**Signature**

```ts
export declare const fromAgent: (
  agent: Effect.Effect<IMobyConnectionAgentImpl, never, Scope.Scope>
) => Layer.Layer<Nodes, never, Scope.Scope>
```

Added in v1.0.0

## fromConnectionOptions

Constructs a layer from agent connection options

**Signature**

```ts
export declare const fromConnectionOptions: (
  connectionOptions: MobyConnectionOptions
) => Layer.Layer<Nodes, never, Scope.Scope>
```

Added in v1.0.0

## layer

Configs layer that depends on the MobyConnectionAgent

**Signature**

```ts
export declare const layer: Layer.Layer<Nodes, never, IMobyConnectionAgent>
```

Added in v1.0.0

# Services

## make

**Signature**

```ts
export declare const make: Effect.Effect<Nodes, never, IMobyConnectionAgent | HttpClient.client.Client.Default>
```

Added in v1.0.0

# Tags

## Nodes

Nodes service

**Signature**

```ts
export declare const Nodes: Context.Tag<Nodes, Nodes>
```

Added in v1.0.0

## Nodes (interface)

**Signature**

```ts
export interface Nodes {
  /**
   * List nodes
   *
   * @param filters - Filters to process on the nodes list, encoded as JSON (a
   *   `map[string][]string`).
   *
   *   Available filters:
   *
   *   - `id=<node id>`
   *   - `label=<engine label>`
   *   - `membership=`(`accepted`|`pending`)`
   *   - `name=<node name>`
   *   - `node.label=<node label>`
   *   - `role=`(`manager`|`worker`)`
   */
  readonly list: (options?: NodeListOptions | undefined) => Effect.Effect<Readonly<Array<Node>>, NodesError>

  /**
   * Delete a node
   *
   * @param id - The ID or name of the node
   * @param force - Force remove a node from the swarm
   */
  readonly delete: (options: NodeDeleteOptions) => Effect.Effect<void, NodesError>

  /**
   * Inspect a node
   *
   * @param id - The ID or name of the node
   */
  readonly inspect: (options: NodeInspectOptions) => Effect.Effect<Readonly<Node>, NodesError>

  /**
   * Update a node
   *
   * @param id - The ID of the node
   * @param body -
   * @param version - The version number of the node object being updated.
   *   This is required to avoid conflicting writes.
   */
  readonly update: (options: NodeUpdateOptions) => Effect.Effect<void, NodesError>
}
```

Added in v1.0.0

# utils

## NodeDeleteOptions (interface)

**Signature**

```ts
export interface NodeDeleteOptions {
  /** The ID or name of the node */
  readonly id: string
  /** Force remove a node from the swarm */
  readonly force?: boolean
}
```

Added in v1.0.0

## NodeInspectOptions (interface)

**Signature**

```ts
export interface NodeInspectOptions {
  /** The ID or name of the node */
  readonly id: string
}
```

Added in v1.0.0

## NodeListOptions (interface)

**Signature**

```ts
export interface NodeListOptions {
  /**
   * Filters to process on the nodes list, encoded as JSON (a
   * `map[string][]string`).
   *
   * Available filters:
   *
   * - `id=<node id>`
   * - `label=<engine label>`
   * - `membership=`(`accepted`|`pending`)`
   * - `name=<node name>`
   * - `node.label=<node label>`
   * - `role=`(`manager`|`worker`)`
   */
  readonly filters?: {
    id?: [string] | undefined
    label?: [string] | undefined
    membership?: ["accepted" | "pending"] | undefined
    name?: [string] | undefined
    "node.label"?: [string] | undefined
    role?: ["manager" | "worker"] | undefined
  }
}
```

Added in v1.0.0

## NodeUpdateOptions (interface)

**Signature**

```ts
export interface NodeUpdateOptions {
  /** The ID of the node */
  readonly id: string
  readonly body: NodeSpec
  /**
   * The version number of the node object being updated. This is required to
   * avoid conflicting writes.
   */
  readonly version: number
}
```

Added in v1.0.0
