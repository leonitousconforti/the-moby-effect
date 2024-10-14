---
title: endpoints/Nodes.ts
nav_order: 18
parent: Modules
---

## Nodes overview

Nodes service

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Errors](#errors)
  - [NodesError (class)](#nodeserror-class)
  - [NodesErrorTypeId](#nodeserrortypeid)
  - [NodesErrorTypeId (type alias)](#nodeserrortypeid-type-alias)
  - [isNodesError](#isnodeserror)
- [Layers](#layers)
  - [layer](#layer)
- [Params](#params)
  - [NodeDeleteOptions (interface)](#nodedeleteoptions-interface)
  - [NodeInspectOptions (interface)](#nodeinspectoptions-interface)
  - [NodeListOptions (interface)](#nodelistoptions-interface)
  - [NodeUpdateOptions (interface)](#nodeupdateoptions-interface)
- [Tags](#tags)
  - [Nodes (class)](#nodes-class)
  - [NodesImpl (interface)](#nodesimpl-interface)

---

# Errors

## NodesError (class)

**Signature**

```ts
export declare class NodesError
```

Added in v1.0.0

## NodesErrorTypeId

**Signature**

```ts
export declare const NodesErrorTypeId: typeof NodesErrorTypeId
```

Added in v1.0.0

## NodesErrorTypeId (type alias)

**Signature**

```ts
export type NodesErrorTypeId = typeof NodesErrorTypeId
```

Added in v1.0.0

## isNodesError

**Signature**

```ts
export declare const isNodesError: (u: unknown) => u is NodesError
```

Added in v1.0.0

# Layers

## layer

Configs layer that depends on the MobyConnectionAgent

**Signature**

```ts
export declare const layer: Layer.Layer<Nodes, never, HttpClient.HttpClient<HttpClientError.HttpClientError, Scope>>
```

Added in v1.0.0

# Params

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
  readonly body: SwarmNodeSpec
  /** The ID of the node */
  readonly id: string
  /**
   * The version number of the node object being updated. This is required to
   * avoid conflicting writes.
   */
  readonly version: number
}
```

Added in v1.0.0

# Tags

## Nodes (class)

Nodes service

**Signature**

```ts
export declare class Nodes
```

Added in v1.0.0

## NodesImpl (interface)

**Signature**

```ts
export interface NodesImpl {
  /** List nodes */
  readonly list: (options?: NodeListOptions | undefined) => Effect.Effect<Readonly<Array<SwarmNode>>, NodesError, never>

  /**
   * Delete a node
   *
   * @param id - The ID or name of the node
   * @param force - Force remove a node from the swarm
   */
  readonly delete: (options: NodeDeleteOptions) => Effect.Effect<void, NodesError, never>

  /**
   * Inspect a node
   *
   * @param id - The ID or name of the node
   */
  readonly inspect: (options: NodeInspectOptions) => Effect.Effect<Readonly<SwarmNode>, NodesError, never>

  /**
   * Update a node
   *
   * @param id - The ID of the node
   * @param body -
   * @param version - The version number of the node object being updated.
   *   This is required to avoid conflicting writes.
   */
  readonly update: (options: NodeUpdateOptions) => Effect.Effect<void, NodesError, never>
}
```

Added in v1.0.0
