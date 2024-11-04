---
title: endpoints/Secrets.ts
nav_order: 19
parent: Modules
---

## Secrets overview

Secrets are sensitive data that can be used by services. Swarm mode must be
enabled for these endpoints to work.

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

Secrets are sensitive data that can be used by services. Swarm mode must be
enabled for these endpoints to work.

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

Secrets are sensitive data that can be used by services. Swarm mode must be
enabled for these endpoints to work.

**Signature**

```ts
export declare class Secrets
```

Added in v1.0.0
