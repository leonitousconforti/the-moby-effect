---
title: platforms/Agnostic.ts
nav_order: 31
parent: Modules
---

## Agnostic overview

Http and https connection agents in a platform agnostic way.

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Connection](#connection)
  - [makeAgnosticHttpClientLayer](#makeagnostichttpclientlayer)

---

# Connection

## makeAgnosticHttpClientLayer

Given the moby connection options, it will construct a layer that provides a
http client that you could use to connect to your moby instance.

**Signature**

```ts
export declare const makeAgnosticHttpClientLayer: (
  connectionOptions: HttpConnectionOptionsTagged | HttpsConnectionOptionsTagged
) => Layer.Layer<HttpClient.HttpClient.Default, never, HttpClient.HttpClient.Default>
```

Added in v1.0.0
