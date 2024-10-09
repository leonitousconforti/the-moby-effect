---
title: platforms/Web.ts
nav_order: 38
parent: Modules
---

## Web overview

Http and https connection methods for the web.

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Connection](#connection)
  - [makeWebHttpClientLayer](#makewebhttpclientlayer)

---

# Connection

## makeWebHttpClientLayer

Given the moby connection options, it will construct a layer that provides a
http client that you could use to connect to your moby instance.

This function will dynamically import the `@effect/platform-browser` package.

**Signature**

```ts
export declare const makeWebHttpClientLayer: (
  connectionOptions: HttpConnectionOptionsTagged | HttpsConnectionOptionsTagged
) => NeedsPlatformBrowser<Layer.Layer<HttpClient.HttpClient, never, never>>
```

Added in v1.0.0
