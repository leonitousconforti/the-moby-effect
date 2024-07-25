---
title: schemas/Int64.ts
nav_order: 42
parent: Modules
---

## Int64 overview

64bit signed integer schema.

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Api interface](#api-interface)
  - [$Int64 (interface)](#int64-interface)
- [Branded constructors](#branded-constructors)
  - [Int64Brand](#int64brand)
- [Branded types](#branded-types)
  - [Int64Brand (type alias)](#int64brand-type-alias)
- [Schemas](#schemas)
  - [Int64](#int64)

---

# Api interface

## $Int64 (interface)

**Signature**

```ts
export interface $Int64 extends Schema.Annotable<$Int64, Int64Brand, Brand.Brand.Unbranded<Int64Brand>, never> {}
```

Added in v1.0.0

# Branded constructors

## Int64Brand

**Signature**

```ts
export declare const Int64Brand: Brand.Brand.Constructor<Int64Brand>
```

Added in v1.0.0

# Branded types

## Int64Brand (type alias)

**Signature**

```ts
export type Int64Brand = number & Brand.Brand<"Int64">
```

Added in v1.0.0

# Schemas

## Int64

64bit signed integer.

**Signature**

```ts
export declare const Int64: $Int64
```

Added in v1.0.0
