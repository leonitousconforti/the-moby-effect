---
title: MobyPlatforms.ts
nav_order: 10
parent: Modules
---

## MobyPlatforms.ts overview

Http client layers for all platforms.

Since v1.0.0

---

## Exports Grouped by Category

- [Browser](#browser)
  - [makeWebHttpClientLayer](#makewebhttpclientlayer)
- [Connection](#connection)
  - [makeAgnosticHttpClientLayer](#makeagnostichttpclientlayer)
  - [makeBunHttpClientLayer](#makebunhttpclientlayer)
- [Deno](#deno)
  - [makeDenoHttpClientLayer](#makedenohttpclientlayer)
- [Fetch](#fetch)
  - [makeFetchHttpClientLayer](#makefetchhttpclientlayer)
- [NodeJS](#nodejs)
  - [makeNodeHttpClientLayer](#makenodehttpclientlayer)
- [Undici](#undici)
  - [makeUndiciHttpClientLayer](#makeundicihttpclientlayer)

---

# Browser

## makeWebHttpClientLayer

Given the moby connection options, it will construct a layer that provides a
http client that you could use to connect to your moby instance.

This function will dynamically import the `@effect/platform-browser` package.

**Signature**

```ts
declare const makeWebHttpClientLayer: (
  connectionOptions: MobyConnection.HttpConnectionOptionsTagged | MobyConnection.HttpsConnectionOptionsTagged
) => Layer.Layer<HttpClient.HttpClient | Socket.WebSocketConstructor, never, never>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyPlatforms.ts#L116)

Since v1.0.0

# Connection

## makeAgnosticHttpClientLayer

Given the moby connection options, it will construct a layer that provides a
http client that you could use to connect to your moby instance.

**Signature**

```ts
declare const makeAgnosticHttpClientLayer: (
  connectionOptions: MobyConnection.MobyConnectionOptions
) => Layer.Layer<HttpClient.HttpClient, never, HttpClient.HttpClient>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyPlatforms.ts#L27)

Since v1.0.0

## makeBunHttpClientLayer

Given the moby connection options, it will construct a layer that provides a
http client that you could use to connect to your moby instance. This is no
different than the Node implementation currently.

This function will dynamically import the `@effect/platform-node` package.

**Signature**

```ts
declare const makeBunHttpClientLayer: (
  connectionOptions: MobyConnection.MobyConnectionOptions
) => Layer.Layer<HttpClient.HttpClient | Socket.WebSocketConstructor, never, never>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyPlatforms.ts#L41)

Since v1.0.0

# Deno

## makeDenoHttpClientLayer

Given the moby connection options, it will construct a layer that provides a
http client that you could use to connect to your moby instance. This is no
different than the Node implementation currently.

This function will dynamically import the `@effect/platform-node` package.

FIXME: https://github.com/denoland/deno/issues/21436?

**Signature**

```ts
declare const makeDenoHttpClientLayer: (
  connectionOptions: MobyConnection.MobyConnectionOptions
) => Layer.Layer<HttpClient.HttpClient | Socket.WebSocketConstructor, never, never>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyPlatforms.ts#L58)

Since v1.0.0

# Fetch

## makeFetchHttpClientLayer

Given the moby connection options, it will construct a layer that provides a
http client that you could use to connect to your moby instance. By only
supporting http and https connection options, this function does not rely on
any specific platform package and uses the `@effect/platform/FetchHttpClient`
as its base http layer.

**Signature**

```ts
declare const makeFetchHttpClientLayer: (
  connectionOptions: MobyConnection.HttpConnectionOptionsTagged | MobyConnection.HttpsConnectionOptionsTagged
) => Layer.Layer<HttpClient.HttpClient | Socket.WebSocketConstructor, never, never>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyPlatforms.ts#L73)

Since v1.0.0

# NodeJS

## makeNodeHttpClientLayer

Given the moby connection options, it will construct a layer that provides a
http client that you could use to connect to your moby instance.

This function will dynamically import the `@effect/platform-node` package.

**Signature**

```ts
declare const makeNodeHttpClientLayer: (
  connectionOptions: MobyConnection.MobyConnectionOptions
) => Layer.Layer<HttpClient.HttpClient | Socket.WebSocketConstructor, never, never>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyPlatforms.ts#L87)

Since v1.0.0

# Undici

## makeUndiciHttpClientLayer

Given the moby connection options, it will construct a layer that provides a
http client that you could use to connect to your moby instance.

This function will dynamically import the `@effect/platform-node` and
`undici` packages.

**Signature**

```ts
declare const makeUndiciHttpClientLayer: (
  connectionOptions: MobyConnection.MobyConnectionOptions
) => Layer.Layer<HttpClient.HttpClient | Socket.WebSocketConstructor, never, never>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyPlatforms.ts#L102)

Since v1.0.0
