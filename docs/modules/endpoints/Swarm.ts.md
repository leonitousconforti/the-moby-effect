---
title: endpoints/Swarm.ts
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
  - [isSwarmsError](#isswarmserror)
- [Layers](#layers)
  - [SwarmLayer](#swarmlayer)
- [Tags](#tags)
  - [Swarm (class)](#swarm-class)

---

# Errors

## SwarmsError (class)

**Signature**

```ts
export declare class SwarmsError
```

Added in v1.0.0

## isSwarmsError

**Signature**

```ts
export declare const isSwarmsError: (u: unknown) => u is SwarmsError
```

Added in v1.0.0

# Layers

## SwarmLayer

Configs layer that depends on the MobyConnectionAgent

**Signature**

```ts
export declare const SwarmLayer: Layer.Layer<
  Swarm,
  never,
  HttpClient.HttpClient<HttpClientError.HttpClientError, Scope>
>
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
