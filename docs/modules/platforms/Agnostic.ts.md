---
title: platforms/Agnostic.ts
nav_order: 32
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
  - [getRequestUrl](#getrequesturl)

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

## getRequestUrl

**Signature**

```ts
export declare const getRequestUrl: (connectionOptions: MobyConnectionOptions) => string
```

Added in v1.0.0
