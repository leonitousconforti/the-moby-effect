---
title: moby/Plugins.ts
nav_order: 13
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
  - [fromAgent](#fromagent)
  - [fromConnectionOptions](#fromconnectionoptions)
  - [layer](#layer)
- [Params](#params)
  - [GetPluginPrivilegesOptions (interface)](#getpluginprivilegesoptions-interface)
  - [PluginCreateOptions (interface)](#plugincreateoptions-interface)
  - [PluginDeleteOptions (interface)](#plugindeleteoptions-interface)
  - [PluginDisableOptions (interface)](#plugindisableoptions-interface)
  - [PluginEnableOptions (interface)](#pluginenableoptions-interface)
  - [PluginInspectOptions (interface)](#plugininspectoptions-interface)
  - [PluginListOptions (interface)](#pluginlistoptions-interface)
  - [PluginPullOptions (interface)](#pluginpulloptions-interface)
  - [PluginPushOptions (interface)](#pluginpushoptions-interface)
  - [PluginSetOptions (interface)](#pluginsetoptions-interface)
  - [PluginUpgradeOptions (interface)](#pluginupgradeoptions-interface)
- [Services](#services)
  - [make](#make)
- [Tags](#tags)
  - [Plugins](#plugins)
  - [Plugins (interface)](#plugins-interface)
  - [PluginsImpl (interface)](#pluginsimpl-interface)

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

## fromAgent

Constructs a layer from an agent effect

**Signature**

```ts
export declare const fromAgent: (
  agent: Effect.Effect<IMobyConnectionAgentImpl, never, Scope.Scope>
) => Layer.Layer<Plugins, never, Scope.Scope>
```

Added in v1.0.0

## fromConnectionOptions

Constructs a layer from agent connection options

**Signature**

```ts
export declare const fromConnectionOptions: (
  connectionOptions: MobyConnectionOptions
) => Layer.Layer<Plugins, never, Scope.Scope>
```

Added in v1.0.0

## layer

Configs layer that depends on the MobyConnectionAgent

**Signature**

```ts
export declare const layer: Layer.Layer<Plugins, never, IMobyConnectionAgent>
```

Added in v1.0.0

# Params

## GetPluginPrivilegesOptions (interface)

**Signature**

```ts
export interface GetPluginPrivilegesOptions {
  /**
   * The name of the plugin. The `:latest` tag is optional, and is the default
   * if omitted.
   */
  readonly remote: string
}
```

Added in v1.0.0

## PluginCreateOptions (interface)

**Signature**

```ts
export interface PluginCreateOptions {
  /**
   * The name of the plugin. The `:latest` tag is optional, and is the default
   * if omitted.
   */
  readonly name: string
  /** Path to tar containing plugin rootfs and manifest */
  readonly tarContext: Stream.Stream<Uint8Array, PluginsError, never>
}
```

Added in v1.0.0

## PluginDeleteOptions (interface)

**Signature**

```ts
export interface PluginDeleteOptions {
  /**
   * The name of the plugin. The `:latest` tag is optional, and is the default
   * if omitted.
   */
  readonly name: string
  /**
   * Disable the plugin before removing. This may result in issues if the
   * plugin is in use by a container.
   */
  readonly force?: boolean
}
```

Added in v1.0.0

## PluginDisableOptions (interface)

**Signature**

```ts
export interface PluginDisableOptions {
  /**
   * The name of the plugin. The `:latest` tag is optional, and is the default
   * if omitted.
   */
  readonly name: string
  /** Force disable a plugin even if still in use. */
  readonly force?: boolean
}
```

Added in v1.0.0

## PluginEnableOptions (interface)

**Signature**

```ts
export interface PluginEnableOptions {
  /**
   * The name of the plugin. The `:latest` tag is optional, and is the default
   * if omitted.
   */
  readonly name: string
  /** Set the HTTP client timeout (in seconds) */
  readonly timeout?: number
}
```

Added in v1.0.0

## PluginInspectOptions (interface)

**Signature**

```ts
export interface PluginInspectOptions {
  /**
   * The name of the plugin. The `:latest` tag is optional, and is the default
   * if omitted.
   */
  readonly name: string
}
```

Added in v1.0.0

## PluginListOptions (interface)

**Signature**

```ts
export interface PluginListOptions {
  /**
   * A JSON encoded value of the filters (a `map[string][]string`) to process
   * on the plugin list.
   *
   * Available filters:
   *
   * - `capability=<capability name>`
   * - `enable=<true>|<false>`
   */
  readonly filters?: { compatibility?: [string]; enable?: ["true" | "false"] }
}
```

Added in v1.0.0

## PluginPullOptions (interface)

**Signature**

```ts
export interface PluginPullOptions {
  /**
   * Remote reference for plugin to install.
   *
   * The `:latest` tag is optional, and is used as the default if omitted.
   */
  readonly remote: string
  /**
   * Local name for the pulled plugin.
   *
   * The `:latest` tag is optional, and is used as the default if omitted.
   */
  readonly name?: string
  /**
   * A base64url-encoded auth configuration to use when pulling a plugin from
   * a registry.
   *
   * Refer to the [authentication section](#section/Authentication) for
   * details.
   */
  readonly "X-Registry-Auth"?: string
  readonly body?: Array<PluginPrivilege>
}
```

Added in v1.0.0

## PluginPushOptions (interface)

**Signature**

```ts
export interface PluginPushOptions {
  /**
   * The name of the plugin. The `:latest` tag is optional, and is the default
   * if omitted.
   */
  readonly name: string
}
```

Added in v1.0.0

## PluginSetOptions (interface)

**Signature**

```ts
export interface PluginSetOptions {
  /**
   * The name of the plugin. The `:latest` tag is optional, and is the default
   * if omitted.
   */
  readonly name: string
  readonly body?: Array<string>
}
```

Added in v1.0.0

## PluginUpgradeOptions (interface)

**Signature**

```ts
export interface PluginUpgradeOptions {
  /**
   * The name of the plugin. The `:latest` tag is optional, and is the default
   * if omitted.
   */
  readonly name: string
  /**
   * Remote reference to upgrade to.
   *
   * The `:latest` tag is optional, and is used as the default if omitted.
   */
  readonly remote: string
  /**
   * A base64url-encoded auth configuration to use when pulling a plugin from
   * a registry.
   *
   * Refer to the [authentication section](#section/Authentication) for
   * details.
   */
  readonly "X-Registry-Auth"?: string
  readonly body?: Array<PluginPrivilege>
}
```

Added in v1.0.0

# Services

## make

**Signature**

```ts
export declare const make: Effect.Effect<PluginsImpl, never, IMobyConnectionAgent | HttpClient.HttpClient.Default>
```

Added in v1.0.0

# Tags

## Plugins

Plugins service

**Signature**

```ts
export declare const Plugins: Context.Tag<Plugins, PluginsImpl>
```

Added in v1.0.0

## Plugins (interface)

**Signature**

```ts
export interface Plugins {
  readonly _: unique symbol
}
```

Added in v1.0.0

## PluginsImpl (interface)

**Signature**

```ts
export interface PluginsImpl {
  /**
   * List plugins
   *
   * @param filters - A JSON encoded value of the filters (a
   *   `map[string][]string`) to process on the plugin list.
   *
   *   Available filters:
   *
   *   - `capability=<capability name>`
   *   - `enable=<true>|<false>`
   */
  readonly list: (
    options?: PluginListOptions | undefined
  ) => Effect.Effect<Readonly<Array<Plugin>>, PluginsError, never>

  /**
   * Get plugin privileges
   *
   * @param remote - The name of the plugin. The `:latest` tag is optional,
   *   and is the default if omitted.
   */
  readonly getPrivileges: (
    options: GetPluginPrivilegesOptions
  ) => Effect.Effect<Readonly<Array<PluginPrivilege>>, PluginsError, never>

  /**
   * Install a plugin
   *
   * @param remote - Remote reference for plugin to install.
   *
   *   The `:latest` tag is optional, and is used as the default if omitted.
   * @param name - Local name for the pulled plugin.
   *
   *   The `:latest` tag is optional, and is used as the default if omitted.
   * @param X-Registry-Auth - A base64url-encoded auth configuration to use
   *   when pulling a plugin from a registry.
   *
   *   Refer to the [authentication section](#section/Authentication) for
   *   details.
   * @param body -
   */
  readonly pull: (options: PluginPullOptions) => Effect.Effect<void, PluginsError, never>

  /**
   * Inspect a plugin
   *
   * @param name - The name of the plugin. The `:latest` tag is optional, and
   *   is the default if omitted.
   */
  readonly inspect: (options: PluginInspectOptions) => Effect.Effect<Readonly<Plugin>, PluginsError, never>

  /**
   * Remove a plugin
   *
   * @param name - The name of the plugin. The `:latest` tag is optional, and
   *   is the default if omitted.
   * @param force - Disable the plugin before removing. This may result in
   *   issues if the plugin is in use by a container.
   */
  readonly delete: (options: PluginDeleteOptions) => Effect.Effect<Readonly<Plugin>, PluginsError, never>

  /**
   * Enable a plugin
   *
   * @param name - The name of the plugin. The `:latest` tag is optional, and
   *   is the default if omitted.
   * @param timeout - Set the HTTP client timeout (in seconds)
   */
  readonly enable: (options: PluginEnableOptions) => Effect.Effect<void, PluginsError, never>

  /**
   * Disable a plugin
   *
   * @param name - The name of the plugin. The `:latest` tag is optional, and
   *   is the default if omitted.
   * @param force - Force disable a plugin even if still in use.
   */
  readonly disable: (options: PluginDisableOptions) => Effect.Effect<void, PluginsError, never>

  /**
   * Upgrade a plugin
   *
   * @param name - The name of the plugin. The `:latest` tag is optional, and
   *   is the default if omitted.
   * @param remote - Remote reference to upgrade to.
   *
   *   The `:latest` tag is optional, and is used as the default if omitted.
   * @param X-Registry-Auth - A base64url-encoded auth configuration to use
   *   when pulling a plugin from a registry.
   *
   *   Refer to the [authentication section](#section/Authentication) for
   *   details.
   * @param body -
   */
  readonly upgrade: (options: PluginUpgradeOptions) => Effect.Effect<void, PluginsError, never>

  /**
   * Create a plugin
   *
   * @param name - The name of the plugin. The `:latest` tag is optional, and
   *   is the default if omitted.
   * @param tarContext - Path to tar containing plugin rootfs and manifest
   */
  readonly create: (options: PluginCreateOptions) => Effect.Effect<void, PluginsError, never>

  /**
   * Push a plugin
   *
   * @param name - The name of the plugin. The `:latest` tag is optional, and
   *   is the default if omitted.
   */
  readonly push: (options: PluginPushOptions) => Effect.Effect<void, PluginsError, never>

  /**
   * Configure a plugin
   *
   * @param name - The name of the plugin. The `:latest` tag is optional, and
   *   is the default if omitted.
   * @param body -
   */
  readonly set: (options: PluginSetOptions) => Effect.Effect<void, PluginsError, never>
}
```

Added in v1.0.0
