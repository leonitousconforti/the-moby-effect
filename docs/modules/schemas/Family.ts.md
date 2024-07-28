---
title: schemas/Family.ts
nav_order: 42
parent: Modules
---

## Family overview

IPv4 or IPv6 family schema.

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Api interface](#api-interface)
  - [$Family (interface)](#family-interface)
- [Decoded types](#decoded-types)
  - [Family (type alias)](#family-type-alias)
- [Schemas](#schemas)
  - [Family](#family)

---

# Api interface

## $Family (interface)

**Signature**

```ts
export interface $Family extends Schema.Union<[IPv4.$IPv4Family, IPv6.$IPv6Family]> {}
```

Added in v1.0.0

# Decoded types

## Family (type alias)

**Signature**

```ts
export type Family = Schema.Schema.Type<$Family>
```

Added in v1.0.0

# Schemas

## Family

**Signature**

```ts
export declare const Family: $Family
```

Added in v1.0.0
