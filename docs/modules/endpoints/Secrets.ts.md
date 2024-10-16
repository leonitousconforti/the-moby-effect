---
title: endpoints/Secrets.ts
nav_order: 21
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
- [Tags](#tags)
  - [Secrets (class)](#secrets-class)

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
export declare const layer: Layer.Layer<Secrets, never, HttpClient.HttpClient<HttpClientError.HttpClientError, Scope>>
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
