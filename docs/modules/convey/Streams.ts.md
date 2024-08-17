---
title: convey/Streams.ts
nav_order: 3
parent: Modules
---

## Streams overview

Prepares streams for the Docker API.

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Conveyance Streams](#conveyance-streams)
  - [packBuildContextIntoTarballStreamServer](#packbuildcontextintotarballstreamserver)
  - [packBuildContextIntoTarballStreamWeb](#packbuildcontextintotarballstreamweb)

---

# Conveyance Streams

## packBuildContextIntoTarballStreamServer

Packs the context into a tarball stream to use with the build endpoint using
the tar-fs npm package. Because we read from the filesystem, this will only
work in Node.js/Deno/Bun. If you need to pack a build context in the browser,
see {@link packBuildContextIntoTarballStreamWeb}.

**Signature**

```ts
export declare const packBuildContextIntoTarballStreamServer: (
  cwd: string,
  entries?: Array<string>
) => Stream.Stream<Uint8Array, Images.ImagesError, never>
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
) => Stream.Stream<Uint8Array, Images.ImagesError, never>
```

Added in v1.0.0
