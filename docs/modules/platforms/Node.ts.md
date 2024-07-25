---
title: platforms/Node.ts
nav_order: 34
parent: Modules
---

## Node overview

Http, https, ssh, and unix socket connection agents for NodeJS.

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Connection](#connection)
  - [IExposeSocketOnEffectClientResponseHack (interface)](#iexposesocketoneffectclientresponsehack-interface)
  - [getNodeAgent](#getnodeagent)
  - [makeNodeHttpClientLayer](#makenodehttpclientlayer)
  - [makeNodeSshAgent](#makenodesshagent)

---

# Connection

## IExposeSocketOnEffectClientResponseHack (interface)

Helper interface to expose the underlying socket from the effect HttpClient
response. Useful for multiplexing the response stream. This is a hack, and it
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

**Signature**

```ts
export declare const makeNodeHttpClientLayer: (
  connectionOptions: MobyConnectionOptions
) => Layer.Layer<HttpClient.HttpClient.Default, never, never>
```

Added in v1.0.0

## makeNodeSshAgent

An http agent that connects to remote moby instances over ssh.

**Signature**

```ts
export declare const makeNodeSshAgent: (
  httpLazy: typeof http,
  ssh2Lazy: typeof ssh2,
  connectionOptions: SshConnectionOptions
) => http.Agent
```

Added in v1.0.0
