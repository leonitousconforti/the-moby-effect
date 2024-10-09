---
title: platforms/Needs.ts
nav_order: 35
parent: Modules
---

## Needs overview

Helper types for requiring certain packages to be installed.

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Types](#types)
  - [NeedsNodeHttp (type alias)](#needsnodehttp-type-alias)
  - [NeedsNodeHttps (type alias)](#needsnodehttps-type-alias)
  - [NeedsPlatformBrowser (type alias)](#needsplatformbrowser-type-alias)
  - [NeedsPlatformNode (type alias)](#needsplatformnode-type-alias)
  - [NeedsSSH2 (type alias)](#needsssh2-type-alias)
  - [NeedsUndici (type alias)](#needsundici-type-alias)

---

# Types

## NeedsNodeHttp (type alias)

**Signature**

```ts
export type NeedsNodeHttp<Dependent extends Effect.Effect<any, any, any> | Layer.Layer<any, any, any>> =
  HasPackage<typeof import("node:http")> extends "yes"
    ? Dependent
    : Dependent extends Effect.Effect<any, any, any>
      ? Effect.Effect<never, 'Missing "node:http" package', never>
      : Layer.Layer<any, 'Missing "node:http" package', never>
```

Added in v1.0.0

## NeedsNodeHttps (type alias)

**Signature**

```ts
export type NeedsNodeHttps<Dependent extends Effect.Effect<any, any, any> | Layer.Layer<any, any, any>> =
  HasPackage<typeof import("node:https")> extends "yes"
    ? Dependent
    : Dependent extends Effect.Effect<any, any, any>
      ? Effect.Effect<never, 'Missing "node:https" package', never>
      : Layer.Layer<any, 'Missing "node:https" package', never>
```

Added in v1.0.0

## NeedsPlatformBrowser (type alias)

**Signature**

```ts
export type NeedsPlatformBrowser<Dependent extends Effect.Effect<any, any, any> | Layer.Layer<any, any, any>> =
  HasPackage<typeof import("@effect/platform-browser")> extends "yes"
    ? Dependent
    : Dependent extends Effect.Effect<any, any, any>
      ? Effect.Effect<never, 'Missing "@effect/platform-browser" package', never>
      : Layer.Layer<any, 'Missing "@effect/platform-browser" package', never>
```

Added in v1.0.0

## NeedsPlatformNode (type alias)

**Signature**

```ts
export type NeedsPlatformNode<Dependent extends Effect.Effect<any, any, any> | Layer.Layer<any, any, any>> =
  HasPackage<typeof import("@effect/platform-node")> extends "yes"
    ? Dependent
    : Dependent extends Effect.Effect<any, any, any>
      ? Effect.Effect<never, 'Missing "@effect/platform-node" package', never>
      : Layer.Layer<any, 'Missing "@effect/platform-node" package', never>
```

Added in v1.0.0

## NeedsSSH2 (type alias)

**Signature**

```ts
export type NeedsSSH2<Dependent extends Effect.Effect<any, any, any> | Layer.Layer<any, any, any>> =
  HasPackage<typeof import("ssh2")> extends "yes"
    ? Dependent
    : Dependent extends Effect.Effect<any, any, any>
      ? Effect.Effect<never, 'Missing "ssh2" package', never>
      : Layer.Layer<any, 'Missing "ssh2" package', never>
```

Added in v1.0.0

## NeedsUndici (type alias)

**Signature**

```ts
export type NeedsUndici<Dependent extends Effect.Effect<any, any, any> | Layer.Layer<any, any, any>> =
  HasPackage<typeof import("undici")> extends "yes"
    ? Dependent
    : Dependent extends Effect.Effect<any, any, any>
      ? Effect.Effect<never, 'Missing "undici" package', never>
      : Layer.Layer<any, 'Missing "undici" package', never>
```

Added in v1.0.0
