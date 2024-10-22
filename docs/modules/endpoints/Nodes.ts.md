---
title: endpoints/Nodes.ts
nav_order: 16
parent: Modules
---

## Nodes overview

Nodes service

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Errors](#errors)
  - [NodesError (class)](#nodeserror-class)
  - [isNodesError](#isnodeserror)
- [Layers](#layers)
  - [NodesLayer](#nodeslayer)
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

## isNodesError

**Signature**

```ts
export declare const isNodesError: (u: unknown) => u is NodesError
```

Added in v1.0.0

# Layers

## NodesLayer

Configs layer that depends on the MobyConnectionAgent

**Signature**

```ts
export declare const NodesLayer: Layer.Layer<
  Nodes,
  never,
  HttpClient.HttpClient<HttpClientError.HttpClientError, Scope>
>
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
