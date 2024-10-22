---
title: endpoints/Volumes.ts
nav_order: 24
parent: Modules
---

## Volumes overview

Volumes service

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Errors](#errors)
  - [VolumesError (class)](#volumeserror-class)
  - [isVolumesError](#isvolumeserror)
- [Layers](#layers)
  - [VolumesLayer](#volumeslayer)
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

## isVolumesError

**Signature**

```ts
export declare const isVolumesError: (u: unknown) => u is VolumesError
```

Added in v1.0.0

# Layers

## VolumesLayer

**Signature**

```ts
export declare const VolumesLayer: Layer.Layer<
  Volumes,
  never,
  HttpClient.HttpClient<HttpClientError.HttpClientError, Scope>
>
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
