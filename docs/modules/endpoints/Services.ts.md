---
title: endpoints/Services.ts
nav_order: 19
parent: Modules
---

## Services overview

Services service

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Errors](#errors)
  - [ServicesError (class)](#serviceserror-class)
  - [isServicesError](#isserviceserror)
- [Layers](#layers)
  - [ServicesLayer](#serviceslayer)
- [Tags](#tags)
  - [Services (class)](#services-class)

---

# Errors

## ServicesError (class)

**Signature**

```ts
export declare class ServicesError
```

Added in v1.0.0

## isServicesError

**Signature**

```ts
export declare const isServicesError: (u: unknown) => u is ServicesError
```

Added in v1.0.0

# Layers

## ServicesLayer

Configs layer that depends on the MobyConnectionAgent

**Signature**

```ts
export declare const ServicesLayer: Layer.Layer<
  Services,
  never,
  HttpClient.HttpClient<HttpClientError.HttpClientError, Scope>
>
```

Added in v1.0.0

# Tags

## Services (class)

Services service

**Signature**

```ts
export declare class Services
```

Added in v1.0.0
