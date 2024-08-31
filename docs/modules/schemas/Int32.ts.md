---
title: schemas/Int32.ts
nav_order: 53
parent: Modules
---

## Int32 overview

32bit signed integer schema.

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Api interface](#api-interface)
  - [$Int32 (interface)](#int32-interface)
- [Branded constructors](#branded-constructors)
  - [Int32Brand](#int32brand)
- [Branded types](#branded-types)
  - [Int32Brand (type alias)](#int32brand-type-alias)
- [Schemas](#schemas)
  - [Int32](#int32)

---

# Api interface

## $Int32 (interface)

**Signature**

```ts
export interface $Int32 extends Schema.Annotable<$Int32, Int32Brand, Brand.Brand.Unbranded<Int32Brand>, never> {}
```

Added in v1.0.0

# Branded constructors

## Int32Brand

**Signature**

```ts
export declare const Int32Brand: Brand.Brand.Constructor<Int32Brand>
```

Added in v1.0.0

# Branded types

## Int32Brand (type alias)

**Signature**

```ts
export type Int32Brand = number & Brand.Brand<"Int32">
```

Added in v1.0.0

# Schemas

## Int32

32bit signed integer.

**Signature**

```ts
export declare const Int32: $Int32
```

Added in v1.0.0
