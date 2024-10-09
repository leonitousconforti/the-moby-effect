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
- [Params](#params)
  - [ConfigDeleteOptions (interface)](#configdeleteoptions-interface)
  - [ConfigInspectOptions (interface)](#configinspectoptions-interface)
  - [ConfigListOptions (interface)](#configlistoptions-interface)
  - [ConfigUpdateOptions (interface)](#configupdateoptions-interface)
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

# Params

## ConfigDeleteOptions (interface)

**Signature**

```ts
export interface ConfigDeleteOptions {
  readonly id: string
}
```

Added in v1.0.0

## ConfigInspectOptions (interface)

**Signature**

```ts
export interface ConfigInspectOptions {
  readonly id: string
}
```

Added in v1.0.0

## ConfigListOptions (interface)

**Signature**

```ts
export interface ConfigListOptions {
  readonly filters?: {
    id?: string | undefined
    label?: Record<string, string> | undefined
    name?: string | undefined
    names?: string | undefined
  }
}
```

Added in v1.0.0

## ConfigUpdateOptions (interface)

**Signature**

```ts
export interface ConfigUpdateOptions {
  /** The ID or name of the config */
  readonly id: string
  /**
   * The spec of the config to update. Currently, only the Labels field can be
   * updated. All other fields must remain unchanged from the ConfigInspect
   * response values.
   */
  readonly spec: SwarmConfigSpec
  /**
   * The version number of the config object being updated. This is required
   * to avoid conflicting writes.
   */
  readonly version: number
}
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
