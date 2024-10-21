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
  - [isConfigsError](#isconfigserror)
- [Layers](#layers)
  - [ConfigsLayer](#configslayer)
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

## isConfigsError

**Signature**

```ts
export declare const isConfigsError: (u: unknown) => u is ConfigsError
```

Added in v1.0.0

# Layers

## ConfigsLayer

Configs are application configurations that can be used by services. Swarm
mode must be enabled for these endpoints to work.

**Signature**

```ts
export declare const ConfigsLayer: Layer.Layer<
  Configs,
  never,
  HttpClient.HttpClient<HttpClientError.HttpClientError, Scope>
>
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
