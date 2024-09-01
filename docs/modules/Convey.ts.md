---
title: Convey.ts
nav_order: 10
parent: Modules
---

## Convey overview

Convenance utilities for Docker input and output streams.

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Conveyance Sinks](#conveyance-sinks)
  - [followProgressInConsole](#followprogressinconsole)
  - [waitForProgressToComplete](#waitforprogresstocomplete)
- [Conveyance Streams](#conveyance-streams)
  - [packBuildContextIntoTarballStream](#packbuildcontextintotarballstream)

---

# Conveyance Sinks

## followProgressInConsole

Tracks the progress stream in the console and returns the result.

**Signature**

```ts
export declare const followProgressInConsole: <E1, R1>(
  stream: Stream<JSONMessage, E1, R1>
) => Effect<Chunk<JSONMessage>, E1, Exclude<R1, Scope>>
```

Added in v1.0.0

## waitForProgressToComplete

Waits for the progress stream to complete and returns the result.

**Signature**

```ts
export declare const waitForProgressToComplete: <E1, R1>(
  stream: Stream<JSONMessage, E1, R1>
) => Effect<Chunk<JSONMessage>, E1, Exclude<R1, Scope>>
```

Added in v1.0.0

# Conveyance Streams

## packBuildContextIntoTarballStream

**Signature**

```ts
export declare const packBuildContextIntoTarballStream: {
  (
    cwd: string,
    entries?: string[] | undefined
  ): Effect<Stream<Uint8Array, PlatformError | ParseError, never>, PlatformError, Path | FileSystem>
  (entries: HashMap<string, string | Uint8Array>): Stream<Uint8Array, ParseError, never>
}
```

Added in v1.0.0
