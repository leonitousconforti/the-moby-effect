---
title: endpoints/Networks.ts
nav_order: 19
parent: Modules
---

## Networks overview

Networks service

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Errors](#errors)
  - [NetworksError (class)](#networkserror-class)
  - [NetworksErrorTypeId](#networkserrortypeid)
  - [NetworksErrorTypeId (type alias)](#networkserrortypeid-type-alias)
  - [isNetworksError](#isnetworkserror)
- [Layers](#layers)
  - [layer](#layer)
- [Tags](#tags)
  - [Networks (class)](#networks-class)

---

# Errors

## NetworksError (class)

**Signature**

```ts
export declare class NetworksError
```

Added in v1.0.0

## NetworksErrorTypeId

**Signature**

```ts
export declare const NetworksErrorTypeId: typeof NetworksErrorTypeId
```

Added in v1.0.0

## NetworksErrorTypeId (type alias)

**Signature**

```ts
export type NetworksErrorTypeId = typeof NetworksErrorTypeId
```

Added in v1.0.0

## isNetworksError

**Signature**

```ts
export declare const isNetworksError: (u: unknown) => u is NetworksError
```

Added in v1.0.0

# Layers

## layer

**Signature**

```ts
export declare const layer: Layer.Layer<Networks, never, HttpClient.HttpClient<HttpClientError.HttpClientError, Scope>>
```

Added in v1.0.0

# Tags

## Networks (class)

Networks service

**Signature**

```ts
export declare class Networks
```

Added in v1.0.0
