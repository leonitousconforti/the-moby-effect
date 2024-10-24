---
title: platforms/Agnostic.ts
nav_order: 38
parent: Modules
---

## Agnostic overview

Connection agents in a platform agnostic way.

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Agnostic](#agnostic)
  - [makeAgnosticHttpClientLayer](#makeagnostichttpclientlayer)
- [Helpers](#helpers)
  - [makeHttpRequestUrl](#makehttprequesturl)
  - [makeWebsocketRequestUrl](#makewebsocketrequesturl)
- [Types](#types)
  - [HttpClientRequestExtension (interface)](#httpclientrequestextension-interface)
  - [getWebsocketUrl](#getwebsocketurl)

---

# Agnostic

## makeAgnosticHttpClientLayer

Given the moby connection options, it will construct a layer that provides a
http client that you could use to connect to your moby instance and requires
an http client to transform from.

**Signature**

```ts
export declare const makeAgnosticHttpClientLayer: (
  connectionOptions: MobyConnectionOptions
) => Layer.Layer<HttpClient.HttpClient, never, HttpClient.HttpClient>
```

Added in v1.0.0

# Helpers

## makeHttpRequestUrl

**Signature**

```ts
export declare const makeHttpRequestUrl: (connectionOptions: MobyConnectionOptions) => string
```

Added in v1.0.0

## makeWebsocketRequestUrl

**Signature**

```ts
export declare const makeWebsocketRequestUrl: (connectionOptions: MobyConnectionOptions) => string
```

Added in v1.0.0

# Types

## HttpClientRequestExtension (interface)

FIXME: this feels very hacky, and is currently only used in one spot where we
get very desperate, can we do better?

**Signature**

```ts
export interface HttpClientRequestExtension extends HttpClientRequest.HttpClientRequest {
  readonly [HttpClientRequestHttpUrl]: string
  readonly [HttpClientRequestWebsocketUrl]: string
}
```

Added in v1.0.0

## getWebsocketUrl

FIXME: this feels very hacky, and is currently only used in one spot where we
get very desperate, can we do better?

**Signature**

```ts
export declare const getWebsocketUrl: ((
  client: HttpClient.HttpClient<HttpClientError.HttpClientError, Scope.Scope>
) => (request: HttpClientRequest.HttpClientRequest) => Effect.Effect<string, Error, never>) &
  ((
    request: HttpClientRequest.HttpClientRequest,
    client: HttpClient.HttpClient<HttpClientError.HttpClientError, Scope.Scope>
  ) => Effect.Effect<string, Error, never>)
```

Added in v1.0.0
