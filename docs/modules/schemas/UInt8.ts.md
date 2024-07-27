---
title: schemas/UInt8.ts
nav_order: 54
parent: Modules
---

## UInt8 overview

8bit unsigned integer schema.

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Api interface](#api-interface)
  - [$UInt8 (interface)](#uint8-interface)
- [Branded constructors](#branded-constructors)
  - [UInt8Brand](#uint8brand)
- [Branded types](#branded-types)
  - [UInt8Brand (type alias)](#uint8brand-type-alias)
- [Schemas](#schemas)
  - [UInt8](#uint8)

---

# Api interface

## $UInt8 (interface)

**Signature**

```ts
export interface $UInt8 extends Schema.Annotable<$UInt8, UInt8Brand, Brand.Brand.Unbranded<UInt8Brand>, never> {}
```

Added in v1.0.0

# Branded constructors

## UInt8Brand

**Signature**

```ts
export declare const UInt8Brand: Brand.Brand.Constructor<UInt8Brand>
```

Added in v1.0.0

# Branded types

## UInt8Brand (type alias)

**Signature**

```ts
export type UInt8Brand = number & Brand.Brand<"UInt8">
```

Added in v1.0.0

# Schemas

## UInt8

8bit unsigned integer.

**Signature**

```ts
export declare const UInt8: $UInt8
```

Added in v1.0.0
