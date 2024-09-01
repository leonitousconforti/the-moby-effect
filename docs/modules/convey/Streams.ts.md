---
title: convey/Streams.ts
nav_order: 12
parent: Modules
---

## Streams overview

Prepares streams for the Docker API.

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Conveyance Streams](#conveyance-streams)
  - [packBuildContextIntoTarballStream](#packbuildcontextintotarballstream)

---

# Conveyance Streams

## packBuildContextIntoTarballStream

**Signature**

```ts
export declare const packBuildContextIntoTarballStream: {
  (
    cwd: string,
    entries?: Array<string> | undefined
  ): Effect.Effect<
    Stream.Stream<Uint8Array, PlatformError.PlatformError | ParseResult.ParseError, never>,
    PlatformError.PlatformError,
    Path.Path | FileSystem.FileSystem
  >
  (entries: HashMap.HashMap<string, string | Uint8Array>): Stream.Stream<Uint8Array, ParseResult.ParseError, never>
}
```

Added in v1.0.0
