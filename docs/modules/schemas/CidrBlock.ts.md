---
title: schemas/CidrBlock.ts
nav_order: 50
parent: Modules
---

## CidrBlock overview

IPv4 or IPv6 cidr block schemas.

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Api interface](#api-interface)
  - [$CidrBlock (interface)](#cidrblock-interface)
  - [$CidrBlockFromString (interface)](#cidrblockfromstring-interface)
  - [$IPv4CidrBlock (interface)](#ipv4cidrblock-interface)
  - [$IPv4CidrBlockFromString (interface)](#ipv4cidrblockfromstring-interface)
  - [$IPv6CidrBlock (interface)](#ipv6cidrblock-interface)
  - [$IPv6CidrBlockFromString (interface)](#ipv6cidrblockfromstring-interface)
  - [CidrBlockBase (class)](#cidrblockbase-class)
    - [networkAddress (method)](#networkaddress-method)
    - [broadcastAddress (method)](#broadcastaddress-method)
    - [family (property)](#family-property)
- [Decoded types](#decoded-types)
  - [CidrBlockFromString (type alias)](#cidrblockfromstring-type-alias)
  - [IPv4CidrBlock (type alias)](#ipv4cidrblock-type-alias)
  - [IPv4CidrBlockFromString (type alias)](#ipv4cidrblockfromstring-type-alias)
  - [IPv6CidrBlock (type alias)](#ipv6cidrblock-type-alias)
  - [IPv6CidrBlockFromString (type alias)](#ipv6cidrblockfromstring-type-alias)
- [Encoded types](#encoded-types)
  - [CidrBlockFromStringEncoded (type alias)](#cidrblockfromstringencoded-type-alias)
  - [IPv4CidrBlockEncoded (type alias)](#ipv4cidrblockencoded-type-alias)
  - [IPv4CidrBlockFromStringEncoded (type alias)](#ipv4cidrblockfromstringencoded-type-alias)
  - [IPv6CidrBlockEncoded (type alias)](#ipv6cidrblockencoded-type-alias)
  - [IPv6CidrBlockFromStringEncoded (type alias)](#ipv6cidrblockfromstringencoded-type-alias)
- [Schemas](#schemas)
  - [CidrBlock](#cidrblock)
  - [CidrBlockFromString](#cidrblockfromstring)
  - [IPv4CidrBlock](#ipv4cidrblock)
  - [IPv4CidrBlockFromString](#ipv4cidrblockfromstring)
  - [IPv6CidrBlock](#ipv6cidrblock)
  - [IPv6CidrBlockFromString](#ipv6cidrblockfromstring)

---

# Api interface

## $CidrBlock (interface)

**Signature**

```ts
export interface $CidrBlock extends Schema.Union<[$IPv4CidrBlock, $IPv6CidrBlock]> {}
```

Added in v1.0.0

## $CidrBlockFromString (interface)

**Signature**

```ts
export interface $CidrBlockFromString
  extends Schema.Annotable<
    $CidrBlockFromString,
    CidrBlockBase<"ipv4"> | CidrBlockBase<"ipv6">,
    `${string}/${number}`,
    never
  > {}
```

Added in v1.0.0

## $IPv4CidrBlock (interface)

**Signature**

```ts
export interface $IPv4CidrBlock
  extends Schema.Annotable<
    $IPv4CidrBlock,
    CidrBlockBase<"ipv4">,
    {
      readonly address: string
      readonly mask: number
    },
    never
  > {}
```

Added in v1.0.0

## $IPv4CidrBlockFromString (interface)

**Signature**

```ts
export interface $IPv4CidrBlockFromString
  extends Schema.Annotable<$IPv4CidrBlockFromString, CidrBlockBase<"ipv4">, `${string}/${number}`, never> {}
```

Added in v1.0.0

## $IPv6CidrBlock (interface)

**Signature**

```ts
export interface $IPv6CidrBlock
  extends Schema.transformOrFail<
    Schema.Struct<{
      address: IPv6.$IPv6
      mask: CidrBlockMask.$IPv6CidrMask
    }>,
    typeof CidrBlockBase<"ipv6">,
    never
  > {}
```

Added in v1.0.0

## $IPv6CidrBlockFromString (interface)

**Signature**

```ts
export interface $IPv6CidrBlockFromString
  extends Schema.Annotable<$IPv6CidrBlockFromString, CidrBlockBase<"ipv6">, `${string}/${number}`, never> {}
```

Added in v1.0.0

## CidrBlockBase (class)

**Signature**

```ts
export declare class CidrBlockBase<_Family>
```

Added in v1.0.0

### networkAddress (method)

The first address in the range given by this address' subnet, often
referred to as the Network Address.

**Signature**

```ts
public networkAddress(): _Family extends IPv4.IPv4Family
        ? Effect.Effect<IPv4.IPv4, ParseResult.ParseError, never>
        : _Family extends IPv6.IPv6Family
          ? Effect.Effect<IPv6.IPv6, ParseResult.ParseError, never>
          : never
```

Added in v1.0.0

### broadcastAddress (method)

The last address in the range given by this address' subnet, often
referred to as the Broadcast Address.

**Signature**

```ts
public broadcastAddress(): _Family extends IPv4.IPv4Family
        ? Effect.Effect<IPv4.IPv4, ParseResult.ParseError, never>
        : _Family extends IPv6.IPv6Family
          ? Effect.Effect<IPv6.IPv6, ParseResult.ParseError, never>
          : never
```

Added in v1.0.0

### family (property)

**Signature**

```ts
readonly family: "ipv4" | "ipv6"
```

Added in v1.0.0

# Decoded types

## CidrBlockFromString (type alias)

**Signature**

```ts
export type CidrBlockFromString = Schema.Schema.Type<$CidrBlockFromString>
```

Added in v1.0.0

## IPv4CidrBlock (type alias)

**Signature**

```ts
export type IPv4CidrBlock = CidrBlockBase<"ipv4">
```

Added in v1.0.0

## IPv4CidrBlockFromString (type alias)

**Signature**

```ts
export type IPv4CidrBlockFromString = Schema.Schema.Type<$IPv4CidrBlockFromString>
```

Added in v1.0.0

## IPv6CidrBlock (type alias)

**Signature**

```ts
export type IPv6CidrBlock = CidrBlockBase<"ipv6">
```

Added in v1.0.0

## IPv6CidrBlockFromString (type alias)

**Signature**

```ts
export type IPv6CidrBlockFromString = Schema.Schema.Type<$IPv6CidrBlockFromString>
```

Added in v1.0.0

# Encoded types

## CidrBlockFromStringEncoded (type alias)

**Signature**

```ts
export type CidrBlockFromStringEncoded = Schema.Schema.Encoded<$CidrBlockFromString>
```

Added in v1.0.0

## IPv4CidrBlockEncoded (type alias)

**Signature**

```ts
export type IPv4CidrBlockEncoded = Schema.Schema.Encoded<$IPv4CidrBlock>
```

Added in v1.0.0

## IPv4CidrBlockFromStringEncoded (type alias)

**Signature**

```ts
export type IPv4CidrBlockFromStringEncoded = Schema.Schema.Encoded<$IPv4CidrBlockFromString>
```

Added in v1.0.0

## IPv6CidrBlockEncoded (type alias)

**Signature**

```ts
export type IPv6CidrBlockEncoded = Schema.Schema.Encoded<$IPv6CidrBlock>
```

Added in v1.0.0

## IPv6CidrBlockFromStringEncoded (type alias)

**Signature**

```ts
export type IPv6CidrBlockFromStringEncoded = Schema.Schema.Encoded<$IPv6CidrBlockFromString>
```

Added in v1.0.0

# Schemas

## CidrBlock

**Signature**

```ts
export declare const CidrBlock: $CidrBlock
```

Added in v1.0.0

## CidrBlockFromString

A schema that transforms a `string` into a `CidrBlock`.

**Signature**

```ts
export declare const CidrBlockFromString: $CidrBlockFromString
```

Added in v1.0.0

## IPv4CidrBlock

**Signature**

```ts
export declare const IPv4CidrBlock: $IPv4CidrBlock
```

Added in v1.0.0

## IPv4CidrBlockFromString

A schema that transforms a `string` into a `CidrBlock`.

**Signature**

```ts
export declare const IPv4CidrBlockFromString: $IPv4CidrBlockFromString
```

Added in v1.0.0

## IPv6CidrBlock

**Signature**

```ts
export declare const IPv6CidrBlock: $IPv6CidrBlock
```

Added in v1.0.0

## IPv6CidrBlockFromString

A schema that transforms a `string` into a `CidrBlock`.

**Signature**

```ts
export declare const IPv6CidrBlockFromString: $IPv6CidrBlockFromString
```

Added in v1.0.0
