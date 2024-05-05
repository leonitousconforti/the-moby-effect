---
title: Configs.ts
nav_order: 2
parent: Modules
---

## Configs overview

Configs service

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Errors](#errors)
  - [ConfigsError (class)](#configserror-class)
- [Layers](#layers)
  - [fromAgent](#fromagent)
  - [fromConnectionOptions](#fromconnectionoptions)
  - [layer](#layer)
- [Services](#services)
  - [make](#make)
- [Tags](#tags)
  - [Configs](#configs)
  - [Configs (interface)](#configs-interface)
- [utils](#utils)
  - [ConfigDeleteOptions (interface)](#configdeleteoptions-interface)
  - [ConfigInspectOptions (interface)](#configinspectoptions-interface)
  - [ConfigListOptions (interface)](#configlistoptions-interface)
  - [ConfigUpdateOptions (interface)](#configupdateoptions-interface)

---

# Errors

## ConfigsError (class)

**Signature**

```ts
export declare class ConfigsError
```

Added in v1.0.0

# Layers

## fromAgent

Constructs a layer from an agent effect

**Signature**

```ts
export declare const fromAgent: (
  agent: Effect.Effect<IMobyConnectionAgentImpl, never, Scope.Scope>
) => Layer.Layer<Configs, never, Scope.Scope>
```

Added in v1.0.0

## fromConnectionOptions

Constructs a layer from agent connection options

**Signature**

```ts
export declare const fromConnectionOptions: (
  connectionOptions: MobyConnectionOptions
) => Layer.Layer<Configs, never, Scope.Scope>
```

Added in v1.0.0

## layer

Configs layer that depends on the MobyConnectionAgent

**Signature**

```ts
export declare const layer: Layer.Layer<Configs, never, IMobyConnectionAgent>
```

Added in v1.0.0

# Services

## make

**Signature**

```ts
export declare const make: Effect.Effect<Configs, never, IMobyConnectionAgent | HttpClient.client.Client.Default>
```

Added in v1.0.0

# Tags

## Configs

Configs service

**Signature**

```ts
export declare const Configs: Context.Tag<Configs, Configs>
```

Added in v1.0.0

## Configs (interface)

**Signature**

```ts
export interface Configs {
  /**
   * List configs
   *
   * @param filters - A JSON encoded value of the filters (a
   *   `map[string][]string`) to process on the configs list.
   *
   *   Available filters:
   *
   *   - `id=<config id>`
   *   - `name=<config name>`
   *   - `names=<config name>`
   *   - `label=<key> or label=<key>=value`
   */
  readonly list: (
    options?: ConfigListOptions | undefined
  ) => Effect.Effect<Readonly<Array<Config>>, ConfigsError, never>

  /** Create a config */
  readonly create: (
    options: Schema.Schema.Encoded<typeof ConfigSpec>
  ) => Effect.Effect<Readonly<IDResponse>, ConfigsError, never>

  /**
   * Delete a config
   *
   * @param id - ID of the config
   */
  readonly delete: (options: ConfigDeleteOptions) => Effect.Effect<void, ConfigsError, never>

  /**
   * Inspect a config
   *
   * @param id - ID of the config
   */
  readonly inspect: (options: ConfigInspectOptions) => Effect.Effect<Readonly<Config>, ConfigsError, never>

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

# utils

## ConfigDeleteOptions (interface)

**Signature**

```ts
export interface ConfigDeleteOptions {
  /** ID of the config */
  readonly id: string
}
```

Added in v1.0.0

## ConfigInspectOptions (interface)

**Signature**

```ts
export interface ConfigInspectOptions {
  /** ID of the config */
  readonly id: string
}
```

Added in v1.0.0

## ConfigListOptions (interface)

**Signature**

```ts
export interface ConfigListOptions {
  /**
   * A JSON encoded value of the filters (a `map[string][]string`) to process
   * on the configs list.
   *
   * Available filters:
   *
   * - `id=<config id>`
   * - `name=<config name>`
   * - `names=<config name>`
   * - `label=<key> or label=<key>=value`
   */
  readonly filters?: {
    id?: [string] | undefined
    name?: [string] | undefined
    names?: [string] | undefined
    label?: Array<string> | undefined
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
   * updated. All other fields must remain unchanged from the [ConfigInspect
   * endpoint](#operation/ConfigInspect) response values.
   */
  readonly spec: Schema.Schema.Encoded<typeof ConfigSpec>
  /**
   * The version number of the config object being updated. This is required
   * to avoid conflicting writes.
   */
  readonly version: number
}
```

Added in v1.0.0
