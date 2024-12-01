---
title: platforms/Needs.ts
nav_order: 44
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
  - [NeedsPlatformBun (type alias)](#needsplatformbun-type-alias)
  - [NeedsPlatformNode (type alias)](#needsplatformnode-type-alias)
  - [NeedsSSH2 (type alias)](#needsssh2-type-alias)
  - [NeedsUndici (type alias)](#needsundici-type-alias)

---

# Types

## NeedsNodeHttp (type alias)

**Signature**

```ts
export type NeedsNodeHttp<
  Dependent extends Effect.Effect<unknown, unknown, unknown> | Layer.Layer<unknown, unknown, unknown>
> = HasPackage<typeof import("node:http")> extends "yes" ? Dependent : 'Missing "node:http" package'
```

Added in v1.0.0

## NeedsNodeHttps (type alias)

**Signature**

```ts
export type NeedsNodeHttps<
  Dependent extends Effect.Effect<unknown, unknown, unknown> | Layer.Layer<unknown, unknown, unknown>
> = HasPackage<typeof import("node:https")> extends "yes" ? Dependent : 'Missing "node:https" package'
```

Added in v1.0.0

## NeedsPlatformBrowser (type alias)

**Signature**

```ts
export type NeedsPlatformBrowser<
  Dependent extends Effect.Effect<unknown, unknown, unknown> | Layer.Layer<unknown, unknown, unknown>
> =
  HasPackage<typeof import("@effect/platform-browser")> extends "yes"
    ? Dependent
    : 'Missing "@effect/platform-browser" package'
```

Added in v1.0.0

## NeedsPlatformBun (type alias)

**Signature**

```ts
export type NeedsPlatformBun<
  Dependent extends Effect.Effect<unknown, unknown, unknown> | Layer.Layer<unknown, unknown, unknown>
> =
  HasPackage<typeof import("@effect/platform-bun")> extends "yes" ? Dependent : 'Missing "@effect/platform-bun" package'
```

Added in v1.0.0

## NeedsPlatformNode (type alias)

**Signature**

```ts
export type NeedsPlatformNode<
  Dependent extends Effect.Effect<unknown, unknown, unknown> | Layer.Layer<unknown, unknown, unknown>
> =
  HasPackage<typeof import("@effect/platform-node")> extends "yes"
    ? Dependent
    : 'Missing "@effect/platform-node" package'
```

Added in v1.0.0

## NeedsSSH2 (type alias)

**Signature**

```ts
export type NeedsSSH2<
  Dependent extends Effect.Effect<unknown, unknown, unknown> | Layer.Layer<unknown, unknown, unknown>
> = HasPackage<typeof import("ssh2")> extends "yes" ? Dependent : 'Missing "ssh2" package'
```

Added in v1.0.0

## NeedsUndici (type alias)

**Signature**

```ts
export type NeedsUndici<
  Dependent extends Effect.Effect<unknown, unknown, unknown> | Layer.Layer<unknown, unknown, unknown>
> = HasPackage<typeof import("undici")> extends "yes" ? Dependent : 'Missing "undici" package'
```

Added in v1.0.0
