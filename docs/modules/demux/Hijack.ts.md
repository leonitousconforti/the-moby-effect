---
title: demux/Hijack.ts
nav_order: 3
parent: Modules
---

## Hijack overview

Utilities for hijacking a connection and transforming it into a raw stream.
Only works on "server-side" platforms.

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Predicates](#predicates)
  - [responseToMultiplexedStreamSocketOrFailUnsafe](#responsetomultiplexedstreamsocketorfailunsafe)
  - [responseToRawStreamSocketOrFailUnsafe](#responsetorawstreamsocketorfailunsafe)
  - [responseToStreamingSocketOrFailUnsafe](#responsetostreamingsocketorfailunsafe)
- [Transformations](#transformations)
  - [hijackResponseUnsafe](#hijackresponseunsafe)

---

# Predicates

## responseToMultiplexedStreamSocketOrFailUnsafe

Transforms an http response into a multiplexed stream socket. If the response
is not a multiplexed stream socket, then an error will be returned.

FIXME: this function relies on a hack to expose the underlying tcp socket
from the http client response. This will only work in NodeJs, not tested in
Bun/Deno yet, and will never work in the browser.

**Signature**

```ts
export declare const responseToMultiplexedStreamSocketOrFailUnsafe: (
  response: HttpClientResponse.HttpClientResponse
) => Effect.Effect<MultiplexedStreamSocket, Socket.SocketError, never>
```

Added in v1.0.0

## responseToRawStreamSocketOrFailUnsafe

Transforms an http response into a raw stream socket. If the response is not
a raw stream socket, then an error will be returned.

FIXME: this function relies on a hack to expose the underlying tcp socket
from the http client response. This will only work in NodeJs, not tested in
Bun/Deno yet, and will never work in the browser.

**Signature**

```ts
export declare const responseToRawStreamSocketOrFailUnsafe: (
  response: HttpClientResponse.HttpClientResponse
) => Effect.Effect<RawStreamSocket, Socket.SocketError, never>
```

Added in v1.0.0

## responseToStreamingSocketOrFailUnsafe

Transforms an http response into a multiplexed stream socket or a raw stream
socket. If the response is neither a multiplexed stream socket nor a raw or
can not be transformed, then an error will be returned.

FIXME: this function relies on a hack to expose the underlying tcp socket
from the http client response. This will only work in NodeJs, not tested in
Bun/Deno yet, and will never work in the browser.

**Signature**

```ts
export declare const responseToStreamingSocketOrFailUnsafe: (
  response: HttpClientResponse.HttpClientResponse
) => Effect.Effect<RawStreamSocket | MultiplexedStreamSocket, Socket.SocketError, never>
```

Added in v1.0.0

# Transformations

## hijackResponseUnsafe

Hijacks an http response into a socket.

FIXME: this function relies on a hack to expose the underlying tcp socket
from the http client response. This will only work in NodeJs, not tested in
Bun/Deno yet, and will never work in the browser.

**Signature**

```ts
export declare const hijackResponseUnsafe: (
  response: HttpClientResponse.HttpClientResponse
) => Effect.Effect<Socket.Socket, Socket.SocketError, never>
```

Added in v1.0.0
