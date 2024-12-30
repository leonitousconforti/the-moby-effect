---
title: MobyConvey.ts
nav_order: 34
parent: Modules
---

## MobyConvey overview

Convenance utilities for Docker input and output streams.

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Conveyance Sinks](#conveyance-sinks)
  - [followProgressInConsole](#followprogressinconsole)
  - [waitForProgressToComplete](#waitforprogresstocomplete)
- [Conveyance Streams](#conveyance-streams)
  - [mergeTarballsStream](#mergetarballsstream)
  - [packIntoTarballStream](#packintotarballstream)

---

# Conveyance Sinks

## followProgressInConsole

**Signature**

```ts
export declare const followProgressInConsole: <E1, R1>(
  stream: Stream<JSONMessage, E1, R1>
) => Effect<Chunk<JSONMessage>, E1, Exclude<R1, Scope>>
```

Added in v1.0.0

## waitForProgressToComplete

**Signature**

```ts
export declare const waitForProgressToComplete: <E1, R1>(
  stream: Stream<JSONMessage, E1, R1>
) => Effect<Chunk<JSONMessage>, E1, Exclude<R1, Scope>>
```

Added in v1.0.0

# Conveyance Streams

## mergeTarballsStream

**Signature**

```ts
export declare const mergeTarballsStream: <E1, R1>(
  tarballs: Array<Stream<Uint8Array, ParseError | E1, R1>>
) => Stream<Uint8Array, ParseError | E1, R1>
```

Added in v1.0.0

## packIntoTarballStream

**Signature**

```ts
export declare const packIntoTarballStream: {
  (cwd: string, entries?: Array<string> | undefined): Stream<Uint8Array, PlatformError | ParseError, Path | FileSystem>
  <E1 = never, R1 = never>(
    entries: HashMap<string, string | Uint8Array | readonly [contentSize: number, stream: Stream<Uint8Array, E1, R1>]>
  ): Stream<Uint8Array, ParseError | E1, R1>
}
```

Added in v1.0.0
