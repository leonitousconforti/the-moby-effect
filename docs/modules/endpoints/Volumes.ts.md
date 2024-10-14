---
title: endpoints/Volumes.ts
nav_order: 25
parent: Modules
---

## Volumes overview

Volumes service

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Errors](#errors)
  - [VolumesError (class)](#volumeserror-class)
  - [VolumesErrorTypeId](#volumeserrortypeid)
  - [VolumesErrorTypeId (type alias)](#volumeserrortypeid-type-alias)
  - [isVolumesError](#isvolumeserror)
- [Layers](#layers)
  - [layer](#layer)
- [Tags](#tags)
  - [Volumes (class)](#volumes-class)
  - [VolumesImpl (interface)](#volumesimpl-interface)
- [utils](#utils)
  - [VolumeDeleteOptions (interface)](#volumedeleteoptions-interface)
  - [VolumeInspectOptions (interface)](#volumeinspectoptions-interface)
  - [VolumeListOptions (interface)](#volumelistoptions-interface)
  - [VolumePruneOptions (interface)](#volumepruneoptions-interface)
  - [VolumeUpdateOptions (interface)](#volumeupdateoptions-interface)

---

# Errors

## VolumesError (class)

**Signature**

```ts
export declare class VolumesError
```

Added in v1.0.0

## VolumesErrorTypeId

**Signature**

```ts
export declare const VolumesErrorTypeId: typeof VolumesErrorTypeId
```

Added in v1.0.0

## VolumesErrorTypeId (type alias)

**Signature**

```ts
export type VolumesErrorTypeId = typeof VolumesErrorTypeId
```

Added in v1.0.0

## isVolumesError

**Signature**

```ts
export declare const isVolumesError: (u: unknown) => u is VolumesError
```

Added in v1.0.0

# Layers

## layer

**Signature**

```ts
export declare const layer: Layer.Layer<Volumes, never, HttpClient.HttpClient<HttpClientError.HttpClientError, Scope>>
```

Added in v1.0.0

# Tags

## Volumes (class)

Volumes service

**Signature**

```ts
export declare class Volumes
```

Added in v1.0.0

## VolumesImpl (interface)

**Signature**

```ts
export interface VolumesImpl {
  /**
   * List volumes
   *
   * @param filters - JSON encoded value of the filters (a
   *   `map[string][]string`) to process on the volumes list. Available
   *   filters:
   *
   *   - `dangling=<boolean>` When set to `true` (or `1`), returns all volumes
   *       that are not in use by a container. When set to `false` (or `0`),
   *       only volumes that are in use by one or more containers are
   *       returned.
   *   - `driver=<volume-driver-name>` Matches volumes based on their driver.
   *   - `label=<key>` or `label=<key>:<value>` Matches volumes based on the
   *       presence of a `label` alone or a `label` and a value.
   *   - `name=<volume-name>` Matches all or part of a volume name.
   */
  readonly list: (options?: VolumeListOptions | undefined) => Effect.Effect<VolumeListResponse, VolumesError, never>

  /**
   * Create a volume
   *
   * @param volumeConfig - Volume configuration
   */
  readonly create: (options: VolumeCreateOptions) => Effect.Effect<Readonly<Volume>, VolumesError, never>

  /**
   * Remove a volume
   *
   * @param name - Volume name or ID
   * @param force - Force the removal of the volume
   */
  readonly delete: (options: VolumeDeleteOptions) => Effect.Effect<void, VolumesError, never>

  /**
   * Inspect a volume
   *
   * @param name - Volume name or ID
   */
  readonly inspect: (options: VolumeInspectOptions) => Effect.Effect<Readonly<Volume>, VolumesError, never>

  /**
   * "Update a volume. Valid only for Swarm cluster volumes"
   *
   * @param name - The name or ID of the volume
   * @param spec - The spec of the volume to update. Currently, only
   *   Availability may change. All other fields must remain unchanged.
   * @param version - The version number of the volume being updated. This is
   *   required to avoid conflicting writes. Found in the volume's
   *   `ClusterVolume` field.
   */
  readonly update: (options: VolumeUpdateOptions) => Effect.Effect<void, VolumesError, never>

  /**
   * Delete unused volumes
   *
   * Available filters:
   *
   * - `label` (`label=<key>`, `label=<key>=<value>`, `label!=<key>`, or
   *   `label!=<key>=<value>`) Prune volumes with (or without, in case
   *   `label!=...` is used) the specified labels.
   * - `all` (`all=true`) - Consider all (local) volumes for pruning and not
   *   just anonymous volumes.
   */
  readonly prune: (options: VolumePruneOptions) => Effect.Effect<VolumePruneResponse, VolumesError, never>
}
```

Added in v1.0.0

# utils

## VolumeDeleteOptions (interface)

**Signature**

```ts
export interface VolumeDeleteOptions {
  /** Volume name or ID */
  readonly name: string
  /** Force the removal of the volume */
  readonly force?: boolean | undefined
}
```

Added in v1.0.0

## VolumeInspectOptions (interface)

**Signature**

```ts
export interface VolumeInspectOptions {
  /** Volume name or ID */
  readonly name: string
}
```

Added in v1.0.0

## VolumeListOptions (interface)

**Signature**

```ts
export interface VolumeListOptions {
  /**
   * JSON encoded value of the filters (a `map[string][]string`) to process on
   * the volumes list. Available filters:
   *
   * - `dangling=<boolean>` When set to `true` (or `1`), returns all volumes
   *   that are not in use by a container. When set to `false` (or `0`), only
   *   volumes that are in use by one or more containers are returned.
   * - `driver=<volume-driver-name>` Matches volumes based on their driver.
   * - `label=<key>` or `label=<key>:<value>` Matches volumes based on the
   *   presence of a `label` alone or a `label` and a value.
   * - `name=<volume-name>` Matches all or part of a volume name.
   */
  readonly filters?: {
    name?: [string] | undefined
    driver?: [string] | undefined
    label?: Array<string> | undefined
    dangling?: ["true" | "false" | "1" | "0"] | undefined
  }
}
```

Added in v1.0.0

## VolumePruneOptions (interface)

**Signature**

```ts
export interface VolumePruneOptions {
  /**
   * Filters to process on the prune list, encoded as JSON (a
   * `map[string][]string`).
   *
   * Available filters:
   *
   * - `label` (`label=<key>`, `label=<key>=<value>`, `label!=<key>`, or
   *   `label!=<key>=<value>`) Prune volumes with (or without, in case
   *   `label!=...` is used) the specified labels.
   * - `all` (`all=true`) - Consider all (local) volumes for pruning and not
   *   just anonymous volumes.
   */
  readonly filters?: { label?: Array<string> | undefined; all?: ["true" | "false" | "1" | "0"] | undefined }
}
```

Added in v1.0.0

## VolumeUpdateOptions (interface)

**Signature**

```ts
export interface VolumeUpdateOptions {
  /** The name or ID of the volume */
  readonly name: string
  /**
   * The spec of the volume to update. Currently, only Availability may
   * change. All other fields must remain unchanged.
   */
  readonly spec: ClusterVolumeSpec
  /**
   * The version number of the volume being updated. This is required to avoid
   * conflicting writes. Found in the volume's `ClusterVolume` field.
   */
  readonly version: number
}
```

Added in v1.0.0
