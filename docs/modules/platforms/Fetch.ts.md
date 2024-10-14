---
title: platforms/Fetch.ts
nav_order: 37
parent: Modules
---

## Fetch overview

Http and https connection methods for fetch.

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Fetch](#fetch)
  - [makeFetchHttpClientLayer](#makefetchhttpclientlayer)

---

# Fetch

## makeFetchHttpClientLayer

Given the moby connection options, it will construct a layer that provides a
http client that you could use to connect to your moby instance. By only
supporting http and https connection options, this function does not rely on
any specific platform package and uses the `@effect/platform/FetchHttpClient`
as its base http layer.

**Signature**

```ts
export declare const makeFetchHttpClientLayer: (
  connectionOptions: HttpConnectionOptionsTagged | HttpsConnectionOptionsTagged
) => Layer.Layer<HttpClient.HttpClient, never, never>
```

Added in v1.0.0
