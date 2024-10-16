---
title: endpoints/Services.ts
nav_order: 23
parent: Modules
---

## Services overview

Services service

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Errors](#errors)
  - [ServicesError (class)](#serviceserror-class)
  - [ServicesErrorTypeId](#serviceserrortypeid)
  - [ServicesErrorTypeId (type alias)](#serviceserrortypeid-type-alias)
  - [isServicesError](#isserviceserror)
- [Layers](#layers)
  - [layer](#layer)
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

## ServicesErrorTypeId

**Signature**

```ts
export declare const ServicesErrorTypeId: typeof ServicesErrorTypeId
```

Added in v1.0.0

## ServicesErrorTypeId (type alias)

**Signature**

```ts
export type ServicesErrorTypeId = typeof ServicesErrorTypeId
```

Added in v1.0.0

## isServicesError

**Signature**

```ts
export declare const isServicesError: (u: unknown) => u is ServicesError
```

Added in v1.0.0

# Layers

## layer

Configs layer that depends on the MobyConnectionAgent

**Signature**

```ts
export declare const layer: Layer.Layer<Services, never, HttpClient.HttpClient<HttpClientError.HttpClientError, Scope>>
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
