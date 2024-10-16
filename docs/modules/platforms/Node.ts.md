---
title: platforms/Node.ts
nav_order: 41
parent: Modules
---

## Node overview

Http, https, ssh, and unix socket connection agents for NodeJS.

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [NodeJS](#nodejs)
  - [IExposeSocketOnEffectClientResponseHack (interface)](#iexposesocketoneffectclientresponsehack-interface)
  - [getNodeAgent](#getnodeagent)
  - [makeNodeHttpClientLayer](#makenodehttpclientlayer)

---

# NodeJS

## IExposeSocketOnEffectClientResponseHack (interface)

Helper interface to expose the underlying socket from the effect HttpClient
response. Useful for hijacking the response stream. This is a hack, and it
will only work when using the NodeJS http layer.

**Signature**

```ts
export interface IExposeSocketOnEffectClientResponseHack extends HttpClientResponse.HttpClientResponse {
  source: {
    socket: net.Socket
  }
}
```

Added in v1.0.0

## getNodeAgent

Given the moby connection options, it will construct a scoped effect that
provides a node http connection agent that you could use to connect to your
moby instance.

This function will dynamically import the `node:http`, `node:https`, and
`@effect/platform-node` packages.

**Signature**

```ts
export declare const getNodeAgent: (
  connectionOptions: MobyConnectionOptions
) => Effect.Effect<NodeHttpClient.HttpAgent, never, Scope.Scope>
```

Added in v1.0.0

## makeNodeHttpClientLayer

Given the moby connection options, it will construct a layer that provides a
http client that you could use to connect to your moby instance.

This function will dynamically import the `@effect/platform-node` package.

**Signature**

```ts
export declare const makeNodeHttpClientLayer: (
  connectionOptions: MobyConnectionOptions
) => Layer.Layer<HttpClient.HttpClient, never, never>
```

Added in v1.0.0
