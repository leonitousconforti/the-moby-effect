---
title: platforms/Deno.ts
nav_order: 41
parent: Modules
---

## Deno overview

Http, https, ssh, and unix socket connection agents for Deno.

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Deno](#deno)
  - [makeDenoHttpClientLayer](#makedenohttpclientlayer)

---

# Deno

## makeDenoHttpClientLayer

Given the moby connection options, it will construct a layer that provides a
http client that you could use to connect to your moby instance. This is no
different than the Node implementation currently.

This function will dynamically import the `@effect/platform-node` package.

FIXME: https://github.com/denoland/deno/issues/21436?

Will fallback to using undici for now because that seems to work

**Signature**

```ts
export declare const makeDenoHttpClientLayer: (
  connectionOptions: MobyConnectionOptions
) => Layer.Layer<HttpClient.HttpClient | Socket.WebSocketConstructor, never, never>
```

Added in v1.0.0
