---
title: schemas/UInt32.ts
nav_order: 62
parent: Modules
---

## UInt32 overview

32bit unsigned integer schema.

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Api interface](#api-interface)
  - [$UInt32 (interface)](#uint32-interface)
- [Branded constructors](#branded-constructors)
  - [UInt32Brand](#uint32brand)
- [Branded types](#branded-types)
  - [UInt32Brand (type alias)](#uint32brand-type-alias)
- [Schemas](#schemas)
  - [UInt32](#uint32)

---

# Api interface

## $UInt32 (interface)

**Signature**

```ts
export interface $UInt32 extends Schema.Annotable<$UInt32, UInt32Brand, Brand.Brand.Unbranded<UInt32Brand>, never> {}
```

Added in v1.0.0

# Branded constructors

## UInt32Brand

**Signature**

```ts
export declare const UInt32Brand: Brand.Brand.Constructor<UInt32Brand>
```

Added in v1.0.0

# Branded types

## UInt32Brand (type alias)

**Signature**

```ts
export type UInt32Brand = number & Brand.Brand<"UInt32">
```

Added in v1.0.0

# Schemas

## UInt32

32bit unsigned integer.

**Signature**

```ts
export declare const UInt32: $UInt32
```

Added in v1.0.0
