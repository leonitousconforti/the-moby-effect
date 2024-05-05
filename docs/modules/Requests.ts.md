---
title: Requests.ts
nav_order: 14
parent: Modules
---

## Requests overview

Request helpers

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [utils](#utils)
  - [IExposeSocketOnEffectClientResponse (interface)](#iexposesocketoneffectclientresponse-interface)
  - [addQueryParameter](#addqueryparameter)
  - [responseErrorHandler](#responseerrorhandler)
  - [streamErrorHandler](#streamerrorhandler)

---

# utils

## IExposeSocketOnEffectClientResponse (interface)

Helper interface to expose the underlying socket from the effect HttpClient
response. Useful for multiplexing the response stream.

La la la coding coding coding

**Signature**

```ts
export interface IExposeSocketOnEffectClientResponse extends HttpClient.response.ClientResponse {
  source: {
    socket: net.Socket
  }
}
```

## addQueryParameter

**Signature**

```ts
export declare const addQueryParameter: (
  key: string,
  value: unknown | Array<unknown> | undefined
) => (self: HttpClient.request.ClientRequest) => HttpClient.request.ClientRequest
```

## responseErrorHandler

**Signature**

```ts
export declare const responseErrorHandler: <E>(
  toError: (message: string) => E
) => (
  error:
    | HttpClient.error.RequestError
    | HttpClient.error.ResponseError
    | HttpClient.body.BodyError
    | ParseResult.ParseError
    | NodeSocket.SocketError
) => Effect.Effect<never, E, never>
```

## streamErrorHandler

**Signature**

```ts
export declare const streamErrorHandler: <E>(
  toError: (message: string) => E
) => (error: HttpClient.error.ResponseError | ParseResult.ParseError) => Stream.Stream<never, E, never>
```
