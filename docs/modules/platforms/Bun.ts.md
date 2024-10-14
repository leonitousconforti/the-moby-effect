---
title: platforms/Bun.ts
nav_order: 35
parent: Modules
---

## Bun overview

Http, https, ssh, and unix socket connection agents for Bun.

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Bun](#bun)
  - [makeBunHttpClientLayer](#makebunhttpclientlayer)

---

# Bun

## makeBunHttpClientLayer

Given the moby connection options, it will construct a layer that provides a
http client that you could use to connect to your moby instance. This is no
different than the Node implementation currently.

This function will dynamically import the `@effect/platform-node` package.

**Signature**

```ts
export declare const makeBunHttpClientLayer: (
  connectionOptions: MobyConnectionOptions
) => Layer.Layer<HttpClient.HttpClient, never, never>
```

Added in v1.0.0
