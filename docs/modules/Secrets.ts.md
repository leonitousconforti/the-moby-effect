---
title: Secrets.ts
nav_order: 16
parent: Modules
---

## Secrets overview

Secrets service

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [utils](#utils)
  - [SecretDeleteOptions (interface)](#secretdeleteoptions-interface)
  - [SecretInspectOptions (interface)](#secretinspectoptions-interface)
  - [SecretListOptions (interface)](#secretlistoptions-interface)
  - [SecretUpdateOptions (interface)](#secretupdateoptions-interface)
  - [Secrets](#secrets)
  - [Secrets (interface)](#secrets-interface)
  - [SecretsError (class)](#secretserror-class)
  - [fromAgent](#fromagent)
  - [fromConnectionOptions](#fromconnectionoptions)
  - [layer](#layer)

---

# utils

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
  readonly spec: Schema.Schema.Encoded<typeof SecretSpec>
  /**
   * The version number of the secret object being updated. This is required
   * to avoid conflicting writes.
   */
  readonly version: number
}
```

Added in v1.0.0

## Secrets

**Signature**

```ts
export declare const Secrets: Context.Tag<Secrets, Secrets>
```

## Secrets (interface)

**Signature**

```ts
export interface Secrets {
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
  readonly list: (options?: SecretListOptions | undefined) => Effect.Effect<Readonly<Array<Secret>>, SecretsError>

  /**
   * Create a secret
   *
   * @param body -
   */
  readonly create: (
    options: Schema.Schema.Encoded<typeof SecretSpec>
  ) => Effect.Effect<Readonly<IDResponse>, SecretsError>

  /**
   * Delete a secret
   *
   * @param id - ID of the secret
   */
  readonly delete: (options: SecretDeleteOptions) => Effect.Effect<void, SecretsError>

  /**
   * Inspect a secret
   *
   * @param id - ID of the secret
   */
  readonly inspect: (options: SecretInspectOptions) => Effect.Effect<Readonly<Secret>, SecretsError>

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
  readonly update: (options: SecretUpdateOptions) => Effect.Effect<void, SecretsError>
}
```

Added in v1.0.0

## SecretsError (class)

**Signature**

```ts
export declare class SecretsError
```

## fromAgent

**Signature**

```ts
export declare const fromAgent: (
  agent: Effect.Effect<IMobyConnectionAgentImpl, never, Scope.Scope>
) => Layer.Layer<Secrets, never, never>
```

## fromConnectionOptions

**Signature**

```ts
export declare const fromConnectionOptions: (
  connectionOptions: MobyConnectionOptions
) => Layer.Layer<Secrets, never, never>
```

## layer

**Signature**

```ts
export declare const layer: Layer.Layer<Secrets, never, IMobyConnectionAgent>
```
