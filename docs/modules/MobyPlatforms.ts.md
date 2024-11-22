---
title: MobyPlatforms.ts
nav_order: 37
parent: Modules
---

## MobyPlatforms overview

Http client layers for all platforms.

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Connection](#connection)
  - [makeAgnosticHttpClientLayer](#makeagnostichttpclientlayer)
  - [makeBunHttpClientLayer](#makebunhttpclientlayer)
  - [makeDenoHttpClientLayer](#makedenohttpclientlayer)
  - [makeNodeHttpClientLayer](#makenodehttpclientlayer)
  - [makeUndiciHttpClientLayer](#makeundicihttpclientlayer)
  - [makeWebHttpClientLayer](#makewebhttpclientlayer)

---

# Connection

## makeAgnosticHttpClientLayer

Given the moby connection options, it will construct a layer that provides a
http client that you could use to connect to your moby instance.

**Signature**

```ts
export declare const makeAgnosticHttpClientLayer: (
  connectionOptions: MobyConnectionOptions
) => Layer<HttpClient, never, HttpClient>
```

Added in v1.0.0

## makeBunHttpClientLayer

Given the moby connection options, it will construct a layer that provides a
http client that you could use to connect to your moby instance. This is no
different than the Node implementation currently.

**Signature**

```ts
export declare const makeBunHttpClientLayer: (
  connectionOptions: MobyConnectionOptions
) => Layer<HttpClient | WebSocketConstructor, never, never>
```

Added in v1.0.0

## makeDenoHttpClientLayer

Given the moby connection options, it will construct a layer that provides a
http client that you could use to connect to your moby instance. This is no
different than the Node implementation currently.

**Signature**

```ts
export declare const makeDenoHttpClientLayer: (
  connectionOptions: MobyConnectionOptions
) => Layer<HttpClient | WebSocketConstructor, never, never>
```

Added in v1.0.0

## makeNodeHttpClientLayer

Given the moby connection options, it will construct a layer that provides a
http client that you could use to connect to your moby instance.

**Signature**

```ts
export declare const makeNodeHttpClientLayer: (
  connectionOptions: MobyConnectionOptions
) => Layer<HttpClient | WebSocketConstructor, never, never>
```

Added in v1.0.0

## makeUndiciHttpClientLayer

Given the moby connection options, it will construct a layer that provides a
http client that you could use to connect to your moby instance.

**Signature**

```ts
export declare const makeUndiciHttpClientLayer: (
  connectionOptions: MobyConnectionOptions
) => Layer<HttpClient | WebSocketConstructor, never, never>
```

Added in v1.0.0

## makeWebHttpClientLayer

Given the moby connection options, it will construct a layer that provides a
http client that you could use to connect to your moby instance.

**Signature**

```ts
export declare const makeWebHttpClientLayer: (
  connectionOptions: HttpConnectionOptionsTagged | HttpsConnectionOptionsTagged
) => Layer<HttpClient | WebSocketConstructor, never, never>
```

Added in v1.0.0
