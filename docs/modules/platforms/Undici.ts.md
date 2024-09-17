---
title: platforms/Undici.ts
nav_order: 36
parent: Modules
---

## Undici overview

Http, https, ssh, and unix socket undici dispatchers for NodeJS.

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Connection](#connection)
  - [getUndiciDispatcher](#getundicidispatcher)
  - [makeUndiciHttpClientLayer](#makeundicihttpclientlayer)
  - [makeUndiciSshConnector](#makeundicisshconnector)

---

# Connection

## getUndiciDispatcher

Given the moby connection options, it will construct a scoped effect that
provides a undici dispatcher that you could use to connect to your moby
instance.

**Signature**

```ts
export declare const getUndiciDispatcher: (
  connectionOptions: MobyConnectionOptions
) => Effect.Effect<undici.Dispatcher, never, Scope.Scope>
```

Added in v1.0.0

## makeUndiciHttpClientLayer

Given the moby connection options, it will construct a layer that provides a
http client that you could use to connect to your moby instance.

**Signature**

```ts
export declare const makeUndiciHttpClientLayer: (
  connectionOptions: MobyConnectionOptions
) => Layer.Layer<HttpClient.HttpClient.Service, never, never>
```

Added in v1.0.0

## makeUndiciSshConnector

An undici connector that connects to remote moby instances over ssh.

**Signature**

```ts
export declare function makeUndiciSshConnector(
  ssh2Lazy: typeof ssh2,
  connectionOptions: SshConnectionOptions
): undici.buildConnector.connector
```

Added in v1.0.0
