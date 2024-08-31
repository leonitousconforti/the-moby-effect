---
title: archive/Tar.ts
nav_order: 2
parent: Modules
---

## Tar overview

GNU ustar tar implementation.

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Tar](#tar)
  - [Tar](#tar-1)

---

# Tar

## Tar

**Signature**

```ts
export declare const Tar: <E1 = never, R1 = never>(
  entries: HashMap.HashMap<TarCommon.TarHeader, string | Uint8Array | Stream.Stream<Uint8Array, E1, R1>>
) => Stream.Stream<Uint8Array, ParseResult.ParseError | E1, R1>
```

Added in v1.0.0
