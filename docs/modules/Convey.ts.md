---
title: Convey.ts
nav_order: 1
parent: Modules
---

## Convey overview

Convenance utilities for Docker input and output streams.

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [utils](#utils)
  - [followProgressInConsole](#followprogressinconsole)
  - [packBuildContextIntoTarballStream](#packbuildcontextintotarballstream)
  - [waitForProgressToComplete](#waitforprogresstocomplete)

---

# utils

## followProgressInConsole

Tracks the progress stream in the console and returns the result.

**Signature**

```ts
export declare const followProgressInConsole: <E1, R1>(
  stream: Stream<JSONMessage, E1, R1>
) => Effect<Chunk<JSONMessage>, E1, R1>
```

Added in v1.0.0

## packBuildContextIntoTarballStream

Packs the context into a tarball stream to use with the build endpoint.

**Signature**

```ts
export declare const packBuildContextIntoTarballStream: (
  cwd: string,
  entries?: string[]
) => Stream<Uint8Array, ImagesError, never>
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
