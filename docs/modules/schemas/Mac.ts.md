---
title: schemas/Mac.ts
nav_order: 51
parent: Modules
---

## Mac overview

Mac Address schema.

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Api interface](#api-interface)
  - [MacAddress (interface)](#macaddress-interface)
- [Branded constructors](#branded-constructors)
  - [MacAddressBrand](#macaddressbrand)
- [Branded types](#branded-types)
  - [MacAddressBrand (type alias)](#macaddressbrand-type-alias)
- [Regular expressions](#regular-expressions)
  - [MacAddressRegex](#macaddressregex)
- [Schemas](#schemas)
  - [MacAddress](#macaddress)

---

# Api interface

## MacAddress (interface)

**Signature**

```ts
export interface MacAddress
  extends Schema.Annotable<MacAddress, MacAddressBrand, Brand.Brand.Unbranded<MacAddressBrand>, never> {}
```

Added in v1.0.0

# Branded constructors

## MacAddressBrand

**Signature**

```ts
export declare const MacAddressBrand: Brand.Brand.Constructor<MacAddressBrand>
```

Added in v1.0.0

# Branded types

## MacAddressBrand (type alias)

**Signature**

```ts
export type MacAddressBrand = string & Brand.Brand<"MacAddress">
```

Added in v1.0.0

# Regular expressions

## MacAddressRegex

**Signature**

```ts
export declare const MacAddressRegex: RegExp
```

Added in v1.0.0

# Schemas

## MacAddress

A Mac Address.

**Signature**

```ts
export declare const MacAddress: MacAddress
```

Added in v1.0.0
