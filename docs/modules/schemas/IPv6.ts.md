---
title: schemas/IPv6.ts
nav_order: 45
parent: Modules
---

## IPv6 overview

IPv6 address schema.

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Api interface](#api-interface)
  - [$IPv6 (interface)](#ipv6-interface)
  - [$IPv6Family (interface)](#ipv6family-interface)
- [Branded constructors](#branded-constructors)
  - [IPv6Brand](#ipv6brand)
- [Branded types](#branded-types)
  - [IPv6Brand (type alias)](#ipv6brand-type-alias)
- [Decoded types](#decoded-types)
  - [IPv6 (type alias)](#ipv6-type-alias)
  - [IPv6Family (type alias)](#ipv6family-type-alias)
- [Encoded types](#encoded-types)
  - [IPv6Encoded (type alias)](#ipv6encoded-type-alias)
- [Regular expressions](#regular-expressions)
  - [IPv6Regex](#ipv6regex)
  - [IPv6Segment](#ipv6segment)
- [Schemas](#schemas)
  - [IPv6](#ipv6)
  - [IPv6Family](#ipv6family)

---

# Api interface

## $IPv6 (interface)

**Signature**

```ts
export interface $IPv6
  extends Schema.transform<
    Schema.filter<Schema.Schema<string, string, never>>,
    Schema.Struct<{
      family: $IPv6Family
      ip: Schema.BrandSchema<IPv6Brand, Brand.Brand.Unbranded<IPv6Brand>, never>
    }>
  > {}
```

Added in v1.0.0

## $IPv6Family (interface)

**Signature**

```ts
export interface $IPv6Family extends Schema.Literal<["ipv6"]> {}
```

Added in v1.0.0

# Branded constructors

## IPv6Brand

**Signature**

```ts
export declare const IPv6Brand: Brand.Brand.Constructor<IPv6Brand>
```

Added in v1.0.0

# Branded types

## IPv6Brand (type alias)

**Signature**

```ts
export type IPv6Brand = string & Brand.Brand<"IPv6">
```

Added in v1.0.0

# Decoded types

## IPv6 (type alias)

**Signature**

```ts
export type IPv6 = Schema.Schema.Type<$IPv6>
```

Added in v1.0.0

## IPv6Family (type alias)

**Signature**

```ts
export type IPv6Family = Schema.Schema.Type<$IPv6Family>
```

Added in v1.0.0

# Encoded types

## IPv6Encoded (type alias)

**Signature**

```ts
export type IPv6Encoded = Schema.Schema.Encoded<$IPv6>
```

Added in v1.0.0

# Regular expressions

## IPv6Regex

**Signature**

```ts
export declare const IPv6Regex: RegExp
```

Added in v1.0.0

## IPv6Segment

**Signature**

```ts
export declare const IPv6Segment: "(?:[0-9a-fA-F]{1,4})"
```

Added in v1.0.0

# Schemas

## IPv6

An IPv6 address.

**Signature**

```ts
export declare const IPv6: $IPv6
```

**Example**

```ts
import * as Schema from "@effect/schema/Schema"
import { IPv6 } from "the-moby-effect/schemas/index.js"

const decodeIPv6 = Schema.decodeSync(IPv6)
assert.deepEqual(decodeIPv6("2001:0db8:85a3:0000:0000:8a2e:0370:7334"), {
  family: "ipv6",
  ip: "2001:0db8:85a3:0000:0000:8a2e:0370:7334"
})

assert.throws(() => decodeIPv6("2001:0db8:85a3:0000:0000:8a2e:0370:7334:"))
assert.throws(() => decodeIPv6("2001::85a3::0000::0370:7334"))
assert.doesNotThrow(() => decodeIPv6("2001:0db8:85a3:0000:0000:8a2e:0370:7334"))
```

Added in v1.0.0

## IPv6Family

**Signature**

```ts
export declare const IPv6Family: $IPv6Family
```

Added in v1.0.0
