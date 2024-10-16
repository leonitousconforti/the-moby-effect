---
title: endpoints/Volumes.ts
nav_order: 28
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
