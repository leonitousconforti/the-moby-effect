---
title: endpoints/Plugins.ts
nav_order: 16
parent: Modules
---

## Plugins overview

Plugins service

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Errors](#errors)
  - [PluginsError (class)](#pluginserror-class)
  - [isPluginsError](#ispluginserror)
- [Layers](#layers)
  - [PluginsLayer](#pluginslayer)
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

## isPluginsError

**Signature**

```ts
export declare const isPluginsError: (u: unknown) => u is PluginsError
```

Added in v1.0.0

# Layers

## PluginsLayer

Configs layer that depends on the MobyConnectionAgent

**Signature**

```ts
export declare const PluginsLayer: Layer.Layer<
  Plugins,
  never,
  HttpClient.HttpClient<HttpClientError.HttpClientError, Scope>
>
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
