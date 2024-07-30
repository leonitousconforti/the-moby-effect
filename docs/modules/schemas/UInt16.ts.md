---
title: schemas/UInt16.ts
nav_order: 53
parent: Modules
---

## UInt16 overview

16bit unsigned integer schema.

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Api interface](#api-interface)
  - [$UInt16 (interface)](#uint16-interface)
- [Branded constructors](#branded-constructors)
  - [UInt16Brand](#uint16brand)
- [Branded types](#branded-types)
  - [UInt16Brand (type alias)](#uint16brand-type-alias)
- [Schemas](#schemas)
  - [UInt16](#uint16)

---

# Api interface

## $UInt16 (interface)

**Signature**

```ts
export interface $UInt16 extends Schema.Annotable<$UInt16, UInt16Brand, Brand.Brand.Unbranded<UInt16Brand>, never> {}
```

Added in v1.0.0

# Branded constructors

## UInt16Brand

**Signature**

```ts
export declare const UInt16Brand: Brand.Brand.Constructor<UInt16Brand>
```

Added in v1.0.0

# Branded types

## UInt16Brand (type alias)

**Signature**

```ts
export type UInt16Brand = number & Brand.Brand<"UInt16">
```

Added in v1.0.0

# Schemas

## UInt16

16bit unsigned integer.

**Signature**

```ts
export declare const UInt16: $UInt16
```

Added in v1.0.0
