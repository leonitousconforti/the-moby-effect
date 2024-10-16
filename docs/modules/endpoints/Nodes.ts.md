---
title: endpoints/Nodes.ts
nav_order: 19
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
- [Tags](#tags)
  - [Nodes (class)](#nodes-class)

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

# Tags

## Nodes (class)

Nodes service

**Signature**

```ts
export declare class Nodes
```

Added in v1.0.0
