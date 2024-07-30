---
title: schemas/Int8.ts
nav_order: 48
parent: Modules
---

## Int8 overview

8bit signed integer schema.

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Api interface](#api-interface)
  - [$Int8 (interface)](#int8-interface)
- [Branded constructors](#branded-constructors)
  - [Int8Brand](#int8brand)
- [Branded types](#branded-types)
  - [Int8Brand (type alias)](#int8brand-type-alias)
- [Schemas](#schemas)
  - [Int8](#int8)

---

# Api interface

## $Int8 (interface)

**Signature**

```ts
export interface $Int8 extends Schema.Annotable<$Int8, Int8Brand, Brand.Brand.Unbranded<Int8Brand>, never> {}
```

Added in v1.0.0

# Branded constructors

## Int8Brand

**Signature**

```ts
export declare const Int8Brand: Brand.Brand.Constructor<Int8Brand>
```

Added in v1.0.0

# Branded types

## Int8Brand (type alias)

**Signature**

```ts
export type Int8Brand = number & Brand.Brand<"Int8">
```

Added in v1.0.0

# Schemas

## Int8

8bit signed integer.

**Signature**

```ts
export declare const Int8: $Int8
```

Added in v1.0.0
