---
title: endpoints/Secrets.ts
nav_order: 26
parent: Modules
---

## Secrets overview

Secrets service

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Errors](#errors)
  - [SecretsError (class)](#secretserror-class)
  - [SecretsErrorTypeId](#secretserrortypeid)
  - [SecretsErrorTypeId (type alias)](#secretserrortypeid-type-alias)
  - [isSecretsError](#issecretserror)
- [Layers](#layers)
  - [layer](#layer)
- [Params](#params)
  - [SecretDeleteOptions (interface)](#secretdeleteoptions-interface)
  - [SecretInspectOptions (interface)](#secretinspectoptions-interface)
  - [SecretListOptions (interface)](#secretlistoptions-interface)
  - [SecretUpdateOptions (interface)](#secretupdateoptions-interface)
- [Services](#services)
  - [make](#make)
- [Tags](#tags)
  - [Secrets (class)](#secrets-class)
  - [SecretsImpl (interface)](#secretsimpl-interface)

---

# Errors

## SecretsError (class)

**Signature**

```ts
export declare class SecretsError
```

Added in v1.0.0

## SecretsErrorTypeId

**Signature**

```ts
export declare const SecretsErrorTypeId: typeof SecretsErrorTypeId
```

Added in v1.0.0

## SecretsErrorTypeId (type alias)

**Signature**

```ts
export type SecretsErrorTypeId = typeof SecretsErrorTypeId
```

Added in v1.0.0

## isSecretsError

**Signature**

```ts
export declare const isSecretsError: (u: unknown) => u is SecretsError
```

Added in v1.0.0

# Layers

## layer

Configs layer that depends on the MobyConnectionAgent

**Signature**

```ts
export declare const layer: Layer.Layer<Secrets, never, HttpClient.HttpClient.Default>
```

Added in v1.0.0

# Params

## SecretDeleteOptions (interface)

**Signature**

```ts
export interface SecretDeleteOptions {
  /** ID of the secret */
  readonly id: string
}
```

Added in v1.0.0

## SecretInspectOptions (interface)

**Signature**

```ts
export interface SecretInspectOptions {
  /** ID of the secret */
  readonly id: string
}
```

Added in v1.0.0

## SecretListOptions (interface)

**Signature**

```ts
export interface SecretListOptions {
  /**
   * A JSON encoded value of the filters (a `map[string][]string`) to process
   * on the secrets list.
   *
   * Available filters:
   *
   * - `id=<secret id>`
   * - `label=<key> or label=<key>=value`
   * - `name=<secret name>`
   * - `names=<secret name>`
   *
   * FIXME: implement this type
   */
  readonly filters?: string
}
```

Added in v1.0.0

## SecretUpdateOptions (interface)

**Signature**

```ts
export interface SecretUpdateOptions {
  /** The ID or name of the secret */
  readonly id: string
  /**
   * The spec of the secret to update. Currently, only the Labels field can be
   * updated. All other fields must remain unchanged from the [SecretInspect
   * endpoint](#operation/SecretInspect) response values.
   */
  readonly spec: SwarmSecretSpec
  /**
   * The version number of the secret object being updated. This is required
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
export declare const make: Effect.Effect<SecretsImpl, never, HttpClient.HttpClient.Default>
```

Added in v1.0.0

# Tags

## Secrets (class)

Secrets service

**Signature**

```ts
export declare class Secrets
```

Added in v1.0.0

## SecretsImpl (interface)

**Signature**

```ts
export interface SecretsImpl {
  /**
   * List secrets
   *
   * @param filters - A JSON encoded value of the filters (a
   *   `map[string][]string`) to process on the secrets list.
   *
   *   Available filters:
   *
   *   - `id=<secret id>`
   *   - `label=<key> or label=<key>=value`
   *   - `name=<secret name>`
   *   - `names=<secret name>`
   */
  readonly list: (
    options?: SecretListOptions | undefined
  ) => Effect.Effect<Readonly<Array<SwarmSecret>>, SecretsError, never>

  /**
   * Create a secret
   *
   * @param body -
   */
  readonly create: (options: SwarmSecretSpec) => Effect.Effect<Readonly<SwarmSecretCreateResponse>, SecretsError, never>

  /**
   * Delete a secret
   *
   * @param id - ID of the secret
   */
  readonly delete: (options: SecretDeleteOptions) => Effect.Effect<void, SecretsError, never>

  /**
   * Inspect a secret
   *
   * @param id - ID of the secret
   */
  readonly inspect: (options: SecretInspectOptions) => Effect.Effect<Readonly<SwarmSecret>, SecretsError, never>

  /**
   * Update a Secret
   *
   * @param id - The ID or name of the secret
   * @param spec - The spec of the secret to update. Currently, only the
   *   Labels field can be updated. All other fields must remain unchanged
   *   from the [SecretInspect endpoint](#operation/SecretInspect) response
   *   values.
   * @param version - The version number of the secret object being updated.
   *   This is required to avoid conflicting writes.
   */
  readonly update: (options: SecretUpdateOptions) => Effect.Effect<void, SecretsError, never>
}
```

Added in v1.0.0
