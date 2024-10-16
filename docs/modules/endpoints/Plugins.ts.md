---
title: endpoints/Plugins.ts
nav_order: 20
parent: Modules
---

## Plugins overview

Plugins service

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Errors](#errors)
  - [PluginsError (class)](#pluginserror-class)
  - [PluginsErrorTypeId](#pluginserrortypeid)
  - [PluginsErrorTypeId (type alias)](#pluginserrortypeid-type-alias)
  - [isPluginsError](#ispluginserror)
- [Layers](#layers)
  - [layer](#layer)
- [Tags](#tags)
  - [Plugins (class)](#plugins-class)

---

# Errors

## PluginsError (class)

**Signature**

```ts
export declare class PluginsError
```

Added in v1.0.0

## PluginsErrorTypeId

**Signature**

```ts
export declare const PluginsErrorTypeId: typeof PluginsErrorTypeId
```

Added in v1.0.0

## PluginsErrorTypeId (type alias)

**Signature**

```ts
export type PluginsErrorTypeId = typeof PluginsErrorTypeId
```

Added in v1.0.0

## isPluginsError

**Signature**

```ts
export declare const isPluginsError: (u: unknown) => u is PluginsError
```

Added in v1.0.0

# Layers

## layer

Configs layer that depends on the MobyConnectionAgent

**Signature**

```ts
export declare const layer: Layer.Layer<Plugins, never, HttpClient.HttpClient<HttpClientError.HttpClientError, Scope>>
```

Added in v1.0.0

# Tags

## Plugins (class)

Plugins service

**Signature**

```ts
export declare class Plugins
```

Added in v1.0.0
