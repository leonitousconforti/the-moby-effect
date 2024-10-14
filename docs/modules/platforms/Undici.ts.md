---
title: platforms/Undici.ts
nav_order: 40
parent: Modules
---

## Undici overview

Http, https, ssh, and unix socket undici dispatchers.

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Undici](#undici)
  - [getUndiciDispatcher](#getundicidispatcher)
  - [makeUndiciHttpClientLayer](#makeundicihttpclientlayer)

---

# Undici

## getUndiciDispatcher

Given the moby connection options, it will construct a scoped effect that
provides a undici dispatcher that you could use to connect to your moby
instance.

This function will dynamically import the `undici` package.

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

This function will dynamically import the `@effect/platform-node` and
`undici` packages.

**Signature**

```ts
export declare const makeUndiciHttpClientLayer: (
  connectionOptions: MobyConnectionOptions
) => Layer.Layer<HttpClient.HttpClient, never, never>
```

Added in v1.0.0
