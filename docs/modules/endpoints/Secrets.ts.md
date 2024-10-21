---
title: endpoints/Secrets.ts
nav_order: 17
parent: Modules
---

## Secrets overview

Secrets service

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Errors](#errors)
  - [SecretsError (class)](#secretserror-class)
  - [isSecretsError](#issecretserror)
- [Layers](#layers)
  - [SecretsLayer](#secretslayer)
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

## isSecretsError

**Signature**

```ts
export declare const isSecretsError: (u: unknown) => u is SecretsError
```

Added in v1.0.0

# Layers

## SecretsLayer

Configs layer that depends on the MobyConnectionAgent

**Signature**

```ts
export declare const SecretsLayer: Layer.Layer<
  Secrets,
  never,
  HttpClient.HttpClient<HttpClientError.HttpClientError, Scope>
>
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
