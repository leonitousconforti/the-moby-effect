---
title: schemas/Int16.ts
nav_order: 45
parent: Modules
---

## Int16 overview

16bit signed integer schema.

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Api interface](#api-interface)
  - [$Int16 (interface)](#int16-interface)
- [Branded constructors](#branded-constructors)
  - [Int16Brand](#int16brand)
- [Branded types](#branded-types)
  - [Int16Brand (type alias)](#int16brand-type-alias)
- [Schemas](#schemas)
  - [Int16](#int16)

---

# Api interface

## $Int16 (interface)

**Signature**

```ts
export interface $Int16 extends Schema.Annotable<$Int16, Int16Brand, Brand.Brand.Unbranded<Int16Brand>, never> {}
```

Added in v1.0.0

# Branded constructors

## Int16Brand

**Signature**

```ts
export declare const Int16Brand: Brand.Brand.Constructor<Int16Brand>
```

Added in v1.0.0

# Branded types

## Int16Brand (type alias)

**Signature**

```ts
export type Int16Brand = number & Brand.Brand<"Int16">
```

Added in v1.0.0

# Schemas

## Int16

16bit signed integer.

**Signature**

```ts
export declare const Int16: $Int16
```

Added in v1.0.0
