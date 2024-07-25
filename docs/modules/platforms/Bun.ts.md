---
title: platforms/Bun.ts
nav_order: 31
parent: Modules
---

## Bun overview

Http, https, ssh, and unix socket connection agents for Bun.

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Connection](#connection)
  - [makeBunHttpClientLayer](#makebunhttpclientlayer)

---

# Connection

## makeBunHttpClientLayer

Given the moby connection options, it will construct a layer that provides a
http client that you could use to connect to your moby instance. This is no
different than the Node implementation currently.

**Signature**

```ts
export declare const makeBunHttpClientLayer: (
  connectionOptions: MobyConnectionOptions
) => Layer.Layer<HttpClient.HttpClient.Default, never, never>
```

Added in v1.0.0
