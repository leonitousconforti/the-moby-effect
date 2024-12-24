---
title: endpoints/Services.ts
nav_order: 21
parent: Modules
---

## Services overview

Services are the definitions of tasks to run on a swarm. Swarm mode must be
enabled for these endpoints to work.

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

Services are the definitions of tasks to run on a swarm. Swarm mode must be
enabled for these endpoints to work.

**Signature**

```ts
export declare const ServicesLayer: Layer.Layer<Services, never, HttpClient.HttpClient>
```

Added in v1.0.0

# Tags

## Services (class)

Services are the definitions of tasks to run on a swarm. Swarm mode must be
enabled for these endpoints to work.

**Signature**

```ts
export declare class Services
```

Added in v1.0.0
