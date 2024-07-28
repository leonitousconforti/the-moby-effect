---
title: convey/Sinks.ts
nav_order: 2
parent: Modules
---

## Sinks overview

Consumes streams from the Docker API.

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [utils](#utils)
  - [followProgressInConsole](#followprogressinconsole)
  - [followProgressSink](#followprogresssink)
  - [waitForProgressToComplete](#waitforprogresstocomplete)

---

# utils

## followProgressInConsole

Tracks the progress stream in the console and returns the result.

**Signature**

```ts
export declare const followProgressInConsole: <E1, R1>(
  stream: Stream.Stream<JSONMessage, E1, R1>
) => Effect.Effect<Chunk.Chunk<JSONMessage>, E1, R1>
```

Added in v1.0.0

## followProgressSink

Consumes the progress stream and logs it to the console.

**Signature**

```ts
export declare const followProgressSink: Sink.Sink<void, JSONMessage, never, never, never>
```

Added in v1.0.0

## waitForProgressToComplete

Waits for the progress stream to complete and returns the result.

**Signature**

```ts
export declare const waitForProgressToComplete: <E1, R1>(
  stream: Stream.Stream<JSONMessage, E1, R1>
) => Effect.Effect<Chunk.Chunk<JSONMessage>, E1, Exclude<R1, Scope.Scope>>
```

Added in v1.0.0
