---
title: Convey.ts
nav_order: 8
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
  - [packBuildContextIntoTarballStreamServer](#packbuildcontextintotarballstreamserver)
  - [packBuildContextIntoTarballStreamWeb](#packbuildcontextintotarballstreamweb)

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

## packBuildContextIntoTarballStreamServer

Packs the context into a tarball stream to use with the build endpoint using
the tar-fs npm package. Because we read from the filesystem, this will only
work in Node.js/Deno/Bun. If you need to pack a build context in the browser,
see {@link packBuildContextIntoTarballStream2}.

**Signature**

```ts
export declare const packBuildContextIntoTarballStreamServer: (
  cwd: string,
  entries?: string[]
) => Stream<Uint8Array, ImagesError, never>
```

Added in v1.0.0

## packBuildContextIntoTarballStreamWeb

Packs the context into a tarball stream to use with the build endpoint using
an in-memory implementation. This is useful for the browser, where we don't
have access to the filesystem.

**Signature**

```ts
export declare const packBuildContextIntoTarballStreamWeb: (
  entries: Record<string, string | Uint8Array>
) => Stream<Uint8Array, ImagesError, never>
```

Added in v1.0.0
