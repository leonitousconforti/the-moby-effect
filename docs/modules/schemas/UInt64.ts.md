---
title: schemas/UInt64.ts
nav_order: 50
parent: Modules
---

## UInt64 overview

64bit unsigned integer schema.

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Api interface](#api-interface)
  - [$UInt64 (interface)](#uint64-interface)
- [Branded constructors](#branded-constructors)
  - [UInt64Brand](#uint64brand)
- [Branded types](#branded-types)
  - [UInt64Brand (type alias)](#uint64brand-type-alias)
- [Schemas](#schemas)
  - [UInt64](#uint64)

---

# Api interface

## $UInt64 (interface)

**Signature**

```ts
export interface $UInt64 extends Schema.Annotable<$UInt64, UInt64Brand, Brand.Brand.Unbranded<UInt64Brand>, never> {}
```

Added in v1.0.0

# Branded constructors

## UInt64Brand

**Signature**

```ts
export declare const UInt64Brand: Brand.Brand.Constructor<UInt64Brand>
```

Added in v1.0.0

# Branded types

## UInt64Brand (type alias)

**Signature**

```ts
export type UInt64Brand = number & Brand.Brand<"UInt64">
```

Added in v1.0.0

# Schemas

## UInt64

64bit unsigned integer.

**Signature**

```ts
export declare const UInt64: $UInt64
```

Added in v1.0.0
