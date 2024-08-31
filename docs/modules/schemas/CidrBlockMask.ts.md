---
title: schemas/CidrBlockMask.ts
nav_order: 50
parent: Modules
---

## CidrBlockMask overview

IPv4 and IPv4 CidrBlock mask schemas.

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Api interface](#api-interface)
  - [$IPv4CidrMask (interface)](#ipv4cidrmask-interface)
  - [$IPv6CidrMask (interface)](#ipv6cidrmask-interface)
- [Branded constructors](#branded-constructors)
  - [IPv4CidrMaskBrand](#ipv4cidrmaskbrand)
  - [IPv6CidrMaskBrand](#ipv6cidrmaskbrand)
- [Branded types](#branded-types)
  - [IPv4CidrMaskBrand (type alias)](#ipv4cidrmaskbrand-type-alias)
  - [IPv6CidrMaskBrand (type alias)](#ipv6cidrmaskbrand-type-alias)
- [Decoded types](#decoded-types)
  - [IPv4CidrMask (type alias)](#ipv4cidrmask-type-alias)
  - [IPv6CidrMask (type alias)](#ipv6cidrmask-type-alias)
- [Encoded types](#encoded-types)
  - [IPv4CidrMaskEncoded (type alias)](#ipv4cidrmaskencoded-type-alias)
  - [IPv6CidrMaskEncoded (type alias)](#ipv6cidrmaskencoded-type-alias)
- [Schemas](#schemas)
  - [IPv4CidrMask](#ipv4cidrmask)
  - [IPv6CidrMask](#ipv6cidrmask)

---

# Api interface

## $IPv4CidrMask (interface)

**Signature**

```ts
export interface $IPv4CidrMask
  extends Schema.Annotable<$IPv4CidrMask, IPv4CidrMaskBrand, Brand.Brand.Unbranded<IPv4CidrMaskBrand>, never> {}
```

Added in v1.0.0

## $IPv6CidrMask (interface)

**Signature**

```ts
export interface $IPv6CidrMask
  extends Schema.Annotable<$IPv6CidrMask, IPv6CidrMaskBrand, Brand.Brand.Unbranded<IPv6CidrMaskBrand>, never> {}
```

Added in v1.0.0

# Branded constructors

## IPv4CidrMaskBrand

**Signature**

```ts
export declare const IPv4CidrMaskBrand: Brand.Brand.Constructor<IPv4CidrMaskBrand>
```

Added in v1.0.0

## IPv6CidrMaskBrand

**Signature**

```ts
export declare const IPv6CidrMaskBrand: Brand.Brand.Constructor<IPv6CidrMaskBrand>
```

Added in v1.0.0

# Branded types

## IPv4CidrMaskBrand (type alias)

**Signature**

```ts
export type IPv4CidrMaskBrand = number & Brand.Brand<"IPv4CidrMask">
```

Added in v1.0.0

## IPv6CidrMaskBrand (type alias)

**Signature**

```ts
export type IPv6CidrMaskBrand = number & Brand.Brand<"IPv6CidrMask">
```

Added in v1.0.0

# Decoded types

## IPv4CidrMask (type alias)

**Signature**

```ts
export type IPv4CidrMask = Schema.Schema.Type<$IPv4CidrMask>
```

Added in v1.0.0

## IPv6CidrMask (type alias)

**Signature**

```ts
export type IPv6CidrMask = Schema.Schema.Type<$IPv6CidrMask>
```

Added in v1.0.0

# Encoded types

## IPv4CidrMaskEncoded (type alias)

**Signature**

```ts
export type IPv4CidrMaskEncoded = Schema.Schema.Encoded<$IPv4CidrMask>
```

Added in v1.0.0

## IPv6CidrMaskEncoded (type alias)

**Signature**

```ts
export type IPv6CidrMaskEncoded = Schema.Schema.Encoded<$IPv6CidrMask>
```

Added in v1.0.0

# Schemas

## IPv4CidrMask

An ipv4 cidr mask, which is a number between 0 and 32.

**Signature**

```ts
export declare const IPv4CidrMask: $IPv4CidrMask
```

**Example**

```ts
import * as Schema from "@effect/schema/Schema"
import { IPv4CidrMask, IPv4CidrMaskBrand } from "the-moby-effect/schemas/CidrBlockMask.js"

const mask: IPv4CidrMaskBrand = IPv4CidrMaskBrand(24)
assert.strictEqual(mask, 24)

const decodeMask = Schema.decodeSync(IPv4CidrMask)
assert.strictEqual(decodeMask(24), 24)

assert.throws(() => decodeMask(33))
assert.doesNotThrow(() => decodeMask(0))
assert.doesNotThrow(() => decodeMask(32))
```

Added in v1.0.0

## IPv6CidrMask

An ipv6 cidr mask, which is a number between 0 and 128.

**Signature**

```ts
export declare const IPv6CidrMask: $IPv6CidrMask
```

**Example**

```ts
import * as Schema from "@effect/schema/Schema"
import { IPv6CidrMask, IPv6CidrMaskBrand } from "the-moby-effect/schemas/CidrBlockMask.js"

const mask: IPv6CidrMaskBrand = IPv6CidrMaskBrand(64)
assert.strictEqual(mask, 64)

const decodeMask = Schema.decodeSync(IPv6CidrMask)
assert.strictEqual(decodeMask(64), 64)

assert.throws(() => decodeMask(129))
assert.doesNotThrow(() => decodeMask(0))
assert.doesNotThrow(() => decodeMask(128))
```

Added in v1.0.0
