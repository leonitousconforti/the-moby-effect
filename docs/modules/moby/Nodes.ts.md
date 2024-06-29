---
title: moby/Nodes.ts
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
  - [NodesErrorTypeId](#nodeserrortypeid)
  - [NodesErrorTypeId (type alias)](#nodeserrortypeid-type-alias)
  - [isNodesError](#isnodeserror)
- [Layers](#layers)
  - [fromAgent](#fromagent)
  - [fromConnectionOptions](#fromconnectionoptions)
  - [layer](#layer)
- [Params](#params)
  - [NodeDeleteOptions (interface)](#nodedeleteoptions-interface)
  - [NodeInspectOptions (interface)](#nodeinspectoptions-interface)
  - [NodeListOptions (interface)](#nodelistoptions-interface)
  - [NodeUpdateOptions (interface)](#nodeupdateoptions-interface)
- [Services](#services)
  - [make](#make)
- [Tags](#tags)
  - [Nodes](#nodes)
  - [Nodes (interface)](#nodes-interface)
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
  readonly body: NodeSpec
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

# Services

## make

**Signature**

```ts
export declare const make: Effect.Effect<NodesImpl, never, IMobyConnectionAgent | HttpClient.HttpClient.Default>
```

Added in v1.0.0

# Tags

## Nodes

Nodes service

**Signature**

```ts
export declare const Nodes: Context.Tag<Nodes, NodesImpl>
```

Added in v1.0.0

## Nodes (interface)

**Signature**

```ts
export interface Nodes {
  readonly _: unique symbol
}
```

Added in v1.0.0

## NodesImpl (interface)

**Signature**

```ts
export interface NodesImpl {
  /** List nodes */
  readonly list: (options?: NodeListOptions | undefined) => Effect.Effect<Readonly<Array<Node>>, NodesError, never>

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
  readonly inspect: (options: NodeInspectOptions) => Effect.Effect<Readonly<Node>, NodesError, never>

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
