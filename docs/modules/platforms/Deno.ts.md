---
title: platforms/Deno.ts
nav_order: 33
parent: Modules
---

## Deno overview

Http, https, ssh, and unix socket connection agents for Deno.

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Connection](#connection)
  - [makeDenoHttpClientLayer](#makedenohttpclientlayer)

---

# Connection

## makeDenoHttpClientLayer

Given the moby connection options, it will construct a layer that provides a
http client that you could use to connect to your moby instance. This is no
different than the Node implementation currently.

**Signature**

```ts
export declare const makeDenoHttpClientLayer: (
  connectionOptions: MobyConnectionOptions
) => Layer.Layer<HttpClient.HttpClient.Default, never, never>
```

Added in v1.0.0
