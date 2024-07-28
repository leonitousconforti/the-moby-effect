---
title: schemas/Address.ts
nav_order: 41
parent: Modules
---

## Address overview

IPv4 or IPv6 addresses schema.

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Api interface](#api-interface)
  - [$Address (interface)](#address-interface)
- [Decoded types](#decoded-types)
  - [Address (type alias)](#address-type-alias)
- [Encoded types](#encoded-types)
  - [AddressEncoded (type alias)](#addressencoded-type-alias)
- [Schemas](#schemas)
  - [Address](#address)

---

# Api interface

## $Address (interface)

**Signature**

```ts
export interface $Address extends Schema.Union<[IPv4.$IPv4, IPv6.$IPv6]> {}
```

Added in v1.0.0

# Decoded types

## Address (type alias)

**Signature**

```ts
export type Address = Schema.Schema.Type<$Address>
```

Added in v1.0.0

# Encoded types

## AddressEncoded (type alias)

**Signature**

```ts
export type AddressEncoded = Schema.Schema.Encoded<$Address>
```

Added in v1.0.0

# Schemas

## Address

An IP address, which is either an IPv4 or IPv6 address.

**Signature**

```ts
export declare const Address: $Address
```

**Example**

```ts
import * as Schema from "@effect/schema/Schema"
import { Address } from "the-moby-effect/schemas/index.js"

const decodeAddress = Schema.decodeSync(Address)

assert.throws(() => decodeAddress("1.1.b.1"))
assert.throws(() => decodeAddress("2001:0db8:85a3:0000:0000:8a2e:0370:7334:"))

assert.doesNotThrow(() => decodeAddress("1.1.1.2"))
assert.doesNotThrow(() => decodeAddress("2001:0db8:85a3:0000:0000:8a2e:0370:7334"))
```

Added in v1.0.0
