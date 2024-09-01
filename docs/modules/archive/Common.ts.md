---
title: archive/Common.ts
nav_order: 2
parent: Modules
---

## Common overview

Shared GNU ustar tar details.

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Schemas](#schemas)
  - [TarHeader (class)](#tarheader-class)
    - [write (property)](#write-property)

---

# Schemas

## TarHeader (class)

**Signature**

```ts
export declare class TarHeader
```

Added in v1.0.0

### write (property)

**Signature**

```ts
write: () => Effect.Effect<Uint8Array, ParseResult.ParseError, never>
```

Added in v1.0.0
