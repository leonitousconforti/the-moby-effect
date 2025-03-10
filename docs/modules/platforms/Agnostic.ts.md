---
title: platforms/Agnostic.ts
nav_order: 41
parent: Modules
---

## Agnostic overview

Connection agents in a platform agnostic way.

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Agnostic](#agnostic)
  - [makeAgnosticHttpClientLayer](#makeagnostichttpclientlayer)
  - [makeAgnosticLayer](#makeagnosticlayer)
  - [makeAgnosticWebsocketLayer](#makeagnosticwebsocketlayer)

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

## makeAgnosticLayer

**Signature**

```ts
export declare const makeAgnosticLayer: (
  connectionOptions: MobyConnectionOptions
) => Layer.Layer<Socket.WebSocketConstructor | HttpClient.HttpClient, never, HttpClient.HttpClient>
```

Added in v1.0.0

## makeAgnosticWebsocketLayer

Given the moby connection options, it will construct a layer that provides a
websocket constructor that you could use to connect to your moby instance.

**Signature**

```ts
export declare const makeAgnosticWebsocketLayer: (
  connectionOptions: MobyConnectionOptions
) => Layer.Layer<Socket.WebSocketConstructor, never, never>
```

Added in v1.0.0
