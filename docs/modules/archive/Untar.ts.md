---
title: archive/Untar.ts
nav_order: 3
parent: Modules
---

## Untar overview

GNU ustar untar implementation.

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Untar](#untar)
  - [Untar](#untar-1)
  - [aggregateBlocksByHeadersSink](#aggregateblocksbyheaderssink)
  - [collectorSink](#collectorsink)

---

# Untar

## Untar

**Signature**

```ts
export declare const Untar: <E1, R1>(
  stream: Stream.Stream<Uint8Array, E1, R1>
) => Effect.Effect<
  HashMap.HashMap<TarCommon.TarHeader, Stream.Stream<Uint8Array, never, never>>,
  ParseResult.ParseError | E1,
  Exclude<R1, Scope.Scope>
>
```

Added in v1.0.0

## aggregateBlocksByHeadersSink

**Signature**

```ts
export declare const aggregateBlocksByHeadersSink: Sink.Sink<
  FolderState,
  Uint8Array,
  Uint8Array,
  ParseResult.ParseError,
  never
>
```

Added in v1.0.0

## collectorSink

**Signature**

```ts
export declare const collectorSink: Sink.Sink<
  HashMap.HashMap<TarCommon.TarHeader, FolderState>,
  FolderState,
  never,
  never,
  never
>
```

Added in v1.0.0
