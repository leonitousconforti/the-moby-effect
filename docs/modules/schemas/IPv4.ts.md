---
title: schemas/IPv4.ts
nav_order: 44
parent: Modules
---

## IPv4 overview

IPv4 address schema.

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Api interface](#api-interface)
  - [$IPv4 (interface)](#ipv4-interface)
  - [$IPv4Family (interface)](#ipv4family-interface)
- [Branded constructors](#branded-constructors)
  - [IPv4Brand](#ipv4brand)
- [Branded types](#branded-types)
  - [IPv4Brand (type alias)](#ipv4brand-type-alias)
- [Decoded types](#decoded-types)
  - [IPv4 (type alias)](#ipv4-type-alias)
  - [IPv4Family (type alias)](#ipv4family-type-alias)
- [Encoded types](#encoded-types)
  - [IPv4Encoded (type alias)](#ipv4encoded-type-alias)
- [Regular expressions](#regular-expressions)
  - [IPv4Regex](#ipv4regex)
  - [IPv4Segment](#ipv4segment)
  - [IPv4String](#ipv4string)
- [Schemas](#schemas)
  - [IPv4](#ipv4)
  - [IPv4Family](#ipv4family)

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

## $IPv4Family (interface)

**Signature**

```ts
export interface $IPv4Family extends Schema.Literal<["ipv4"]> {}
```

Added in v1.0.0

# Branded constructors

## IPv4Brand

**Signature**

```ts
export declare const IPv4Brand: Brand.Brand.Constructor<IPv4Brand>
```

Added in v1.0.0

# Branded types

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

## IPv4Family (type alias)

**Signature**

```ts
export type IPv4Family = Schema.Schema.Type<$IPv4Family>
```

Added in v1.0.0

# Encoded types

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

## IPv4String

**Signature**

```ts
export declare const IPv4String: "(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])"
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

## IPv4Family

**Signature**

```ts
export declare const IPv4Family: $IPv4Family
```

Added in v1.0.0
