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
  - [$AddressBigint (interface)](#addressbigint-interface)
  - [$AddressString (interface)](#addressstring-interface)
- [Decoded types](#decoded-types)
  - [Address (type alias)](#address-type-alias)
  - [AddressBigint (type alias)](#addressbigint-type-alias)
  - [AddressString (type alias)](#addressstring-type-alias)
- [Encoded types](#encoded-types)
  - [AddressBigintEncoded (type alias)](#addressbigintencoded-type-alias)
  - [AddressEncoded (type alias)](#addressencoded-type-alias)
  - [AddressStringEncoded (type alias)](#addressstringencoded-type-alias)
- [Schemas](#schemas)
  - [Address](#address)
  - [AddressBigint](#addressbigint)
  - [AddressString](#addressstring)

---

# Api interface

## $Address (interface)

**Signature**

```ts
export interface $Address extends Schema.Union<[IPv4.$IPv4, IPv6.$IPv6]> {}
```

Added in v1.0.0

## $AddressBigint (interface)

**Signature**

```ts
export interface $AddressBigint extends Schema.Union<[IPv4.$IPv4Bigint, IPv6.$IPv6Bigint]> {}
```

Added in v1.0.0

## $AddressString (interface)

**Signature**

```ts
export interface $AddressString extends Schema.Union<[IPv4.$IPv4String, IPv6.$IPv6String]> {}
```

Added in v1.0.0

# Decoded types

## Address (type alias)

**Signature**

```ts
export type Address = Schema.Schema.Type<$Address>
```

Added in v1.0.0

## AddressBigint (type alias)

**Signature**

```ts
export type AddressBigint = Schema.Schema.Type<$AddressBigint>
```

Added in v1.0.0

## AddressString (type alias)

**Signature**

```ts
export type AddressString = Schema.Schema.Type<$AddressString>
```

Added in v1.0.0

# Encoded types

## AddressBigintEncoded (type alias)

**Signature**

```ts
export type AddressBigintEncoded = Schema.Schema.Encoded<$AddressBigint>
```

Added in v1.0.0

## AddressEncoded (type alias)

**Signature**

```ts
export type AddressEncoded = Schema.Schema.Encoded<$Address>
```

Added in v1.0.0

## AddressStringEncoded (type alias)

**Signature**

```ts
export type AddressStringEncoded = Schema.Schema.Encoded<$AddressString>
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

## AddressBigint

An IP address as a bigint.

**Signature**

```ts
export declare const AddressBigint: $AddressBigint
```

Added in v1.0.0

## AddressString

An IP address in string format, which is either an IPv4 or IPv6 address.

**Signature**

```ts
export declare const AddressString: $AddressString
```

Added in v1.0.0
