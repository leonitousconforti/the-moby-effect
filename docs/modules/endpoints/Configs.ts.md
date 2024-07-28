---
title: endpoints/Configs.ts
nav_order: 11
parent: Modules
---

## Configs overview

Configs service

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
  - [make](#make)
- [Tags](#tags)
  - [Configs (class)](#configs-class)
  - [ConfigsImpl (interface)](#configsimpl-interface)

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

Configs layer that depends on the MobyConnectionAgent

**Signature**

```ts
export declare const layer: Layer.Layer<Configs, never, HttpClient.HttpClient.Default>
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
    name?: string | undefined
    id?: string | undefined
    names?: string | undefined
    label?: Record<string, string> | Array<string> | undefined
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

## make

**Signature**

```ts
export declare const make: Effect.Effect<ConfigsImpl, never, HttpClient.HttpClient.Default>
```

Added in v1.0.0

# Tags

## Configs (class)

Configs service

**Signature**

```ts
export declare class Configs
```

Added in v1.0.0

## ConfigsImpl (interface)

**Signature**

```ts
export interface ConfigsImpl {
  readonly list: (
    options?: ConfigListOptions | undefined
  ) => Effect.Effect<ReadonlyArray<SwarmConfig>, ConfigsError, never>
  readonly create: (options: SwarmConfigSpec) => Effect.Effect<Readonly<SwarmConfigCreateResponse>, ConfigsError, never>
  readonly delete: (options: ConfigDeleteOptions) => Effect.Effect<void, ConfigsError, never>
  readonly inspect: (options: ConfigInspectOptions) => Effect.Effect<Readonly<SwarmConfig>, ConfigsError, never>

  /**
   * Update a Config
   *
   * @param id - The ID or name of the config
   * @param spec - The spec of the config to update. Currently, only the
   *   Labels field can be updated. All other fields must remain unchanged
   *   from the [ConfigInspect endpoint](#operation/ConfigInspect) response
   *   values.
   * @param version - The version number of the config object being updated.
   *   This is required to avoid conflicting writes.
   */
  readonly update: (options: ConfigUpdateOptions) => Effect.Effect<void, ConfigsError, never>
}
```

Added in v1.0.0
