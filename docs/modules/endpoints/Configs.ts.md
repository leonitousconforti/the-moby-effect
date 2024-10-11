---
title: endpoints/Configs.ts
nav_order: 9
parent: Modules
---

## Configs overview

Configs are application configurations that can be used by services. Swarm
mode must be enabled for these endpoints to work.

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Errors](#errors)
  - [ConfigsError (class)](#configserror-class)
  - [ConfigsErrorTypeId](#configserrortypeid)
  - [ConfigsErrorTypeId (type alias)](#configserrortypeid-type-alias)
  - [isConfigsError](#isconfigserror)
- [Layers](#layers)
  - [layer](#layer)
- [Services](#services)
  - [Configs (class)](#configs-class)

---

# Errors

## ConfigsError (class)

**Signature**

```ts
export declare class ConfigsError
```

Added in v1.0.0

## ConfigsErrorTypeId

**Signature**

```ts
export declare const ConfigsErrorTypeId: typeof ConfigsErrorTypeId
```

Added in v1.0.0

## ConfigsErrorTypeId (type alias)

**Signature**

```ts
export type ConfigsErrorTypeId = typeof ConfigsErrorTypeId
```

Added in v1.0.0

## isConfigsError

**Signature**

```ts
export declare const isConfigsError: (u: unknown) => u is ConfigsError
```

Added in v1.0.0

# Layers

## layer

Configs are application configurations that can be used by services. Swarm
mode must be enabled for these endpoints to work.

**Signature**

```ts
export declare const layer: Layer.Layer<Configs, never, HttpClient.HttpClient<HttpClientError.HttpClientError, Scope>>
```

Added in v1.0.0

# Services

## Configs (class)

Configs are application configurations that can be used by services. Swarm
mode must be enabled for these endpoints to work.

**Signature**

```ts
export declare class Configs
```

Added in v1.0.0
