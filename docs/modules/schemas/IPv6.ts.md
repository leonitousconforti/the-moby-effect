---
title: schemas/IPv6.ts
nav_order: 59
parent: Modules
---

## IPv6 overview

IPv6 address schema.

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Api interface](#api-interface)
  - [$IPv6 (interface)](#ipv6-interface)
  - [$IPv6Bigint (interface)](#ipv6bigint-interface)
  - [$IPv6Family (interface)](#ipv6family-interface)
  - [$IPv6String (interface)](#ipv6string-interface)
- [Branded constructors](#branded-constructors)
  - [IPv6BigintBrand](#ipv6bigintbrand)
  - [IPv6Brand](#ipv6brand)
- [Branded types](#branded-types)
  - [IPv6BigintBrand (type alias)](#ipv6bigintbrand-type-alias)
  - [IPv6Brand (type alias)](#ipv6brand-type-alias)
- [Decoded types](#decoded-types)
  - [IPv6 (type alias)](#ipv6-type-alias)
  - [IPv6Bigint (type alias)](#ipv6bigint-type-alias)
  - [IPv6Family (type alias)](#ipv6family-type-alias)
- [Encoded types](#encoded-types)
  - [IPv6BigintEncoded (type alias)](#ipv6bigintencoded-type-alias)
  - [IPv6Encoded (type alias)](#ipv6encoded-type-alias)
- [Regular expressions](#regular-expressions)
  - [IPv6Regex](#ipv6regex)
  - [IPv6Segment](#ipv6segment)
- [Schemas](#schemas)
  - [IPv6](#ipv6)
  - [IPv6Bigint](#ipv6bigint)
  - [IPv6Family](#ipv6family)
  - [IPv6String](#ipv6string)

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

## $IPv6Bigint (interface)

**Signature**

```ts
export interface $IPv6Bigint
  extends Schema.transformOrFail<
    $IPv6,
    Schema.Struct<{
      family: $IPv6Family
      value: Schema.BrandSchema<IPv6BigintBrand, Brand.Brand.Unbranded<IPv6BigintBrand>, never>
    }>,
    never
  > {}
```

Added in v1.0.0

## $IPv6Family (interface)

**Signature**

```ts
export interface $IPv6Family extends Schema.Literal<["ipv6"]> {}
```

Added in v1.0.0

## $IPv6String (interface)

**Signature**

```ts
export interface $IPv6String extends Schema.filter<Schema.Schema<string, string, never>> {}
```

Added in v1.0.0

# Branded constructors

## IPv6BigintBrand

**Signature**

```ts
export declare const IPv6BigintBrand: Brand.Brand.Constructor<IPv6BigintBrand>
```

Added in v1.0.0

## IPv6Brand

**Signature**

```ts
export declare const IPv6Brand: Brand.Brand.Constructor<IPv6Brand>
```

Added in v1.0.0

# Branded types

## IPv6BigintBrand (type alias)

**Signature**

```ts
export type IPv6BigintBrand = bigint & Brand.Brand<"IPv6Bigint">
```

Added in v1.0.0

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

## IPv6Bigint (type alias)

**Signature**

```ts
export type IPv6Bigint = Schema.Schema.Type<$IPv6Bigint>
```

Added in v1.0.0

## IPv6Family (type alias)

**Signature**

```ts
export type IPv6Family = Schema.Schema.Type<$IPv6Family>
```

Added in v1.0.0

# Encoded types

## IPv6BigintEncoded (type alias)

**Signature**

```ts
export type IPv6BigintEncoded = Schema.Schema.Encoded<$IPv6Bigint>
```

Added in v1.0.0

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

## IPv6Bigint

An IPv6 as a bigint.

**Signature**

```ts
export declare const IPv6Bigint: $IPv6Bigint
```

**Example**

```ts
import * as Schema from "@effect/schema/Schema"
import { IPv6Bigint, IPv6BigintBrand } from "the-moby-effect/schemas/IPv6.js"

const y: IPv6BigintBrand = IPv6BigintBrand(748392749382n)
assert.strictEqual(y, 748392749382n)

const decodeIPv6Bigint = Schema.decodeSync(IPv6Bigint)
const encodeIPv6Bigint = Schema.encodeSync(IPv6Bigint)

assert.deepEqual(decodeIPv6Bigint("4cbd:ff70:e62b:a048:686c:4e7e:a68a:c377"), {
  value: 102007852745154114519525620108359287671n,
  family: "ipv6"
})
assert.deepEqual(decodeIPv6Bigint("d8c6:3feb:46e6:b80c:5a07:6227:ac19:caf6"), {
  value: 288142618299897818094313964584331496182n,
  family: "ipv6"
})

assert.deepEqual(
  encodeIPv6Bigint({
    value: IPv6BigintBrand(102007852745154114519525620108359287671n),
    family: "ipv6"
  }),
  "4cbd:ff70:e62b:a048:686c:4e7e:a68a:c377"
)
assert.deepEqual(
  encodeIPv6Bigint({
    value: IPv6BigintBrand(288142618299897818094313964584331496182n),
    family: "ipv6"
  }),
  "d8c6:3feb:46e6:b80c:5a07:6227:ac19:caf6"
)
```

Added in v1.0.0

## IPv6Family

**Signature**

```ts
export declare const IPv6Family: $IPv6Family
```

Added in v1.0.0

## IPv6String

An IPv6 address in string format.

**Signature**

```ts
export declare const IPv6String: $IPv6String
```

Added in v1.0.0
