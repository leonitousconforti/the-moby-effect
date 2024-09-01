---
title: archive/Tar.ts
nav_order: 3
parent: Modules
---

## Tar overview

GNU ustar tar implementation.

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Tar](#tar)
  - [Tarball](#tarball)
  - [TarballFromFilesystem](#tarballfromfilesystem)
  - [TarballFromMemory](#tarballfrommemory)

---

# Tar

## Tarball

**Signature**

```ts
export declare const Tarball: <E1 = never, R1 = never>(
  entries: HashMap.HashMap<TarCommon.TarHeader, string | Uint8Array | Stream.Stream<Uint8Array, E1, R1>>
) => Stream.Stream<Uint8Array, ParseResult.ParseError | E1, R1>
```

Added in v1.0.0

## TarballFromFilesystem

**Signature**

```ts
export declare const TarballFromFilesystem: (
  base: string,
  entries: Array<string>
) => Effect.Effect<
  Stream.Stream<Uint8Array, PlatformError.PlatformError | ParseResult.ParseError, never>,
  PlatformError.PlatformError,
  Path.Path | FileSystem.FileSystem
>
```

Added in v1.0.0

## TarballFromMemory

**Signature**

```ts
export declare const TarballFromMemory: (
  entries: HashMap.HashMap<string, string | Uint8Array>
) => Stream.Stream<Uint8Array, ParseResult.ParseError, never>
```

Added in v1.0.0
