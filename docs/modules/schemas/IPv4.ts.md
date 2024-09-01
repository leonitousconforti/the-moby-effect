---
title: schemas/IPv4.ts
nav_order: 58
parent: Modules
---

## IPv4 overview

IPv4 address schema.

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Api interface](#api-interface)
  - [$IPv4 (interface)](#ipv4-interface)
  - [$IPv4Bigint (interface)](#ipv4bigint-interface)
  - [$IPv4Family (interface)](#ipv4family-interface)
  - [$IPv4String (interface)](#ipv4string-interface)
- [Branded constructors](#branded-constructors)
  - [IPv4BigintBrand](#ipv4bigintbrand)
  - [IPv4Brand](#ipv4brand)
- [Branded types](#branded-types)
  - [IPv4BigintBrand (type alias)](#ipv4bigintbrand-type-alias)
  - [IPv4Brand (type alias)](#ipv4brand-type-alias)
- [Decoded types](#decoded-types)
  - [IPv4 (type alias)](#ipv4-type-alias)
  - [IPv4Bigint (type alias)](#ipv4bigint-type-alias)
  - [IPv4Family (type alias)](#ipv4family-type-alias)
- [Encoded types](#encoded-types)
  - [IPv4BigintEncoded (type alias)](#ipv4bigintencoded-type-alias)
  - [IPv4Encoded (type alias)](#ipv4encoded-type-alias)
- [Regular expressions](#regular-expressions)
  - [IPv4Regex](#ipv4regex)
  - [IPv4Segment](#ipv4segment)
  - [IPv4StringRegex](#ipv4stringregex)
- [Schemas](#schemas)
  - [IPv4](#ipv4)
  - [IPv4Bigint](#ipv4bigint)
  - [IPv4Family](#ipv4family)
  - [IPv4String](#ipv4string)

---

# Api interface

## $IPv4 (interface)

**Signature**

```ts
export interface $IPv4
  extends Schema.transform<
    Schema.filter<Schema.Schema<string, string, never>>,
    Schema.Struct<{
      family: $IPv4Family
      ip: Schema.BrandSchema<IPv4Brand, Brand.Brand.Unbranded<IPv4Brand>, never>
    }>
  > {}
```

Added in v1.0.0

## $IPv4Bigint (interface)

**Signature**

```ts
export interface $IPv4Bigint
  extends Schema.transformOrFail<
    $IPv4,
    Schema.Struct<{
      family: $IPv4Family
      value: Schema.BrandSchema<IPv4BigintBrand, Brand.Brand.Unbranded<IPv4BigintBrand>, never>
    }>,
    never
  > {}
```

Added in v1.0.0

## $IPv4Family (interface)

**Signature**

```ts
export interface $IPv4Family extends Schema.Literal<["ipv4"]> {}
```

Added in v1.0.0

## $IPv4String (interface)

**Signature**

```ts
export interface $IPv4String extends Schema.filter<Schema.Schema<string, string, never>> {}
```

Added in v1.0.0

# Branded constructors

## IPv4BigintBrand

**Signature**

```ts
export declare const IPv4BigintBrand: Brand.Brand.Constructor<IPv4BigintBrand>
```

Added in v1.0.0

## IPv4Brand

**Signature**

```ts
export declare const IPv4Brand: Brand.Brand.Constructor<IPv4Brand>
```

Added in v1.0.0

# Branded types

## IPv4BigintBrand (type alias)

**Signature**

```ts
export type IPv4BigintBrand = bigint & Brand.Brand<"IPv4Bigint">
```

Added in v1.0.0

## IPv4Brand (type alias)

**Signature**

```ts
export type IPv4Brand = string & Brand.Brand<"IPv4">
```

Added in v1.0.0

# Decoded types

## IPv4 (type alias)

**Signature**

```ts
export type IPv4 = Schema.Schema.Type<$IPv4>
```

Added in v1.0.0

## IPv4Bigint (type alias)

**Signature**

```ts
export type IPv4Bigint = Schema.Schema.Type<$IPv4Bigint>
```

Added in v1.0.0

## IPv4Family (type alias)

**Signature**

```ts
export type IPv4Family = Schema.Schema.Type<$IPv4Family>
```

Added in v1.0.0

# Encoded types

## IPv4BigintEncoded (type alias)

**Signature**

```ts
export type IPv4BigintEncoded = Schema.Schema.Encoded<$IPv4Bigint>
```

Added in v1.0.0

## IPv4Encoded (type alias)

**Signature**

```ts
export type IPv4Encoded = Schema.Schema.Encoded<$IPv4>
```

Added in v1.0.0

# Regular expressions

## IPv4Regex

**Signature**

```ts
export declare const IPv4Regex: RegExp
```

Added in v1.0.0

## IPv4Segment

**Signature**

```ts
export declare const IPv4Segment: "(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])"
```

Added in v1.0.0

## IPv4StringRegex

**Signature**

```ts
export declare const IPv4StringRegex: "(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])"
```

Added in v1.0.0

# Schemas

## IPv4

An IPv4 address.

**Signature**

```ts
export declare const IPv4: $IPv4
```

**Example**

```ts
import * as Schema from "@effect/schema/Schema"
import { IPv4 } from "the-moby-effect/schemas/index.js"

const decodeIPv4 = Schema.decodeSync(IPv4)
assert.deepEqual(decodeIPv4("1.1.1.1"), {
  family: "ipv4",
  ip: "1.1.1.1"
})

assert.throws(() => decodeIPv4("1.1.a.1"))
assert.doesNotThrow(() => decodeIPv4("1.1.1.2"))
```

Added in v1.0.0

## IPv4Bigint

An IPv4 as a bigint.

**Signature**

```ts
export declare const IPv4Bigint: $IPv4Bigint
```

**Example**

```ts
import * as Schema from "@effect/schema/Schema"
import { IPv4Bigint, IPv4BigintBrand } from "the-moby-effect/schemas/IPv4.js"

const x: IPv4BigintBrand = IPv4BigintBrand(748392749382n)
assert.strictEqual(x, 748392749382n)

const decodeIPv4Bigint = Schema.decodeSync(IPv4Bigint)
const encodeIPv4Bigint = Schema.encodeSync(IPv4Bigint)

assert.deepEqual(decodeIPv4Bigint("1.1.1.1"), {
  family: "ipv4",
  value: 16843009n
})
assert.deepEqual(decodeIPv4Bigint("254.254.254.254"), {
  family: "ipv4",
  value: 4278124286n
})

assert.strictEqual(
  encodeIPv4Bigint({
    value: IPv4BigintBrand(16843009n),
    family: "ipv4"
  }),
  "1.1.1.1"
)
assert.strictEqual(
  encodeIPv4Bigint({
    value: IPv4BigintBrand(4278124286n),
    family: "ipv4"
  }),
  "254.254.254.254"
)
```

Added in v1.0.0

## IPv4Family

**Signature**

```ts
export declare const IPv4Family: $IPv4Family
```

Added in v1.0.0

## IPv4String

An IPv4 address in dot-decimal notation with no leading zeros.

**Signature**

```ts
export declare const IPv4String: $IPv4String
```

Added in v1.0.0
