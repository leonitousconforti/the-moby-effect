---
title: MobyConvey.ts
nav_order: 7
parent: Modules
---

## MobyConvey.ts overview

Convenance utilities for Docker input and output streams.

Since v1.0.0

---

## Exports Grouped by Category

- [Conveyance Sinks](#conveyance-sinks)
  - [followProgressInConsole](#followprogressinconsole)
  - [followProgressSink](#followprogresssink)
  - [waitForProgressToComplete](#waitforprogresstocomplete)

---

# Conveyance Sinks

## followProgressInConsole

Tracks the progress stream in the console and returns the result.

**Signature**

```ts
declare const followProgressInConsole: <E1, R1>(
  stream: Stream.Stream<MobySchemas.JSONMessage, E1, R1>
) => Effect.Effect<Array<MobySchemas.JSONMessage>, E1, R1>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyConvey.ts#L40)

Since v1.0.0

## followProgressSink

Consumes the progress stream and logs it to the console.

**Signature**

```ts
declare const followProgressSink: Sink.Sink<void, MobySchemas.JSONMessage, never, never, never>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyConvey.ts#L31)

Since v1.0.0

## waitForProgressToComplete

Waits for the progress stream to complete and returns the result.

**Signature**

```ts
declare const waitForProgressToComplete: <E1, R1>(
  stream: Stream.Stream<MobySchemas.JSONMessage, E1, R1>
) => Effect.Effect<Array<MobySchemas.JSONMessage>, E1, R1>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyConvey.ts#L21)

Since v1.0.0
