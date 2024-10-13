---
title: demux/Raw.ts
nav_order: 7
parent: Modules
---

## Raw overview

Demux utilities for raw sockets. Raw sockets come in two "flavors" -
unidirectional and bidirectional. In both cases, they are represented as
bidirectional sockets because even in the unidirectional case data could be
flowing in either direction. Unlike multiplexed sockets, bidirectional raw
sockets can not differentiate between stdout and stderr because the data is
just raw bytes from the process's PTY. However, you can attach multiple
unidirectional sockets to the same container (one for stdout and one for
stderr) and then use the demux utilities to separate the streams.

Upcasting and downcasting between the two types is supported, but discouraged

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Branded Types](#branded-types)
  - [BidirectionalRawStreamSocket (type alias)](#bidirectionalrawstreamsocket-type-alias)
- [Casting](#casting)
  - [downcastBidirectionalToUnidirectional](#downcastbidirectionaltounidirectional)
  - [upcastUnidirectionalToBidirectional](#upcastunidirectionaltobidirectional)
- [Demux](#demux)
  - [demuxBidirectionalRawSocket](#demuxbidirectionalrawsocket)
  - [demuxUnidirectionalRawSockets](#demuxunidirectionalrawsockets)
- [Predicates](#predicates)
  - [isBidirectionalRawStreamSocket](#isbidirectionalrawstreamsocket)
  - [isUnidirectionalRawStreamSocket](#isunidirectionalrawstreamsocket)
  - [responseIsRawStreamSocketResponse](#responseisrawstreamsocketresponse)
- [Type ids](#type-ids)
  - [BidirectionalRawStreamSocketTypeId](#bidirectionalrawstreamsockettypeid)
  - [BidirectionalRawStreamSocketTypeId (type alias)](#bidirectionalrawstreamsockettypeid-type-alias)
  - [UnidirectionalRawStreamSocketTypeId](#unidirectionalrawstreamsockettypeid)
  - [UnidirectionalRawStreamSocketTypeId (type alias)](#unidirectionalrawstreamsockettypeid-type-alias)
- [Types](#types)
  - [RawStreamSocketContentType](#rawstreamsocketcontenttype)
  - [UnidirectionalRawStreamSocket (type alias)](#unidirectionalrawstreamsocket-type-alias)

---

# Branded Types

## BidirectionalRawStreamSocket (type alias)

When the TTY setting is enabled in POST /containers/create, the stream is not
multiplexed. The data exchanged over the hijacked connection is simply the
raw data from the process PTY and client's stdin.

**Signature**

```ts
export type BidirectionalRawStreamSocket = Socket.Socket & {
  readonly "content-type": typeof RawStreamSocketContentType
  readonly [BidirectionalRawStreamSocketTypeId]: typeof BidirectionalRawStreamSocketTypeId
}
```

Added in v1.0.0

# Casting

## downcastBidirectionalToUnidirectional

**Signature**

```ts
export declare const downcastBidirectionalToUnidirectional: ({
  [BidirectionalRawStreamSocketTypeId]: _,
  ...rest
}: BidirectionalRawStreamSocket) => UnidirectionalRawStreamSocket
```

Added in v1.0.0

## upcastUnidirectionalToBidirectional

**Signature**

```ts
export declare const upcastUnidirectionalToBidirectional: ({
  [UnidirectionalRawStreamSocketTypeId]: _,
  ...rest
}: UnidirectionalRawStreamSocket) => BidirectionalRawStreamSocket
```

Added in v1.0.0

# Demux

## demuxBidirectionalRawSocket

Demux a raw socket. When given a raw socket of the remote process's pty,
there is no way to differentiate between stdout and stderr so they are
combined on the same sink.

To demux multiple raw sockets, you should use
{@link demuxUnidirectionalRawSockets}

**Signature**

```ts
export declare const demuxBidirectionalRawSocket: (<A1, E1, E2, R1, R2>(
  source: Stream.Stream<string | Uint8Array, E1, R1>,
  sink: Sink.Sink<A1, string, string, E2, R2>,
  options?: { encoding?: string | undefined } | undefined
) => (
  socket: BidirectionalRawStreamSocket
) => Effect.Effect<A1, E1 | E2 | Socket.SocketError, Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope>>) &
  (<A1, E1, E2, R1, R2>(
    socket: BidirectionalRawStreamSocket,
    source: Stream.Stream<string | Uint8Array, E1, R1>,
    sink: Sink.Sink<A1, string, string, E2, R2>,
    options?: { encoding?: string | undefined } | undefined
  ) => Effect.Effect<A1, E1 | E2 | Socket.SocketError, Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope>>)
```

**Example**

```ts
import * as NodeRuntime from "@effect/platform-node/NodeRuntime"
import * as Chunk from "effect/Chunk"
import * as Effect from "effect/Effect"
import * as Function from "effect/Function"
import * as Layer from "effect/Layer"
import * as Sink from "effect/Sink"
import * as Stream from "effect/Stream"

import * as Convey from "the-moby-effect/Convey"
import * as Platforms from "the-moby-effect/Platforms"
import * as DemuxMultiplexed from "the-moby-effect/demux/Multiplexed"
import * as DemuxRaw from "the-moby-effect/demux/Raw"
import * as Containers from "the-moby-effect/endpoints/Containers"
import * as DockerEngine from "the-moby-effect/engines/Docker"

const layer = Function.pipe(
  Platforms.connectionOptionsFromPlatformSystemSocketDefault(),
  Effect.map(DockerEngine.layerNodeJS),
  Layer.unwrapEffect
)

Effect.gen(function* () {
  const image = "ubuntu:latest"
  const containers = yield* Containers.Containers

  // Pull the image, which will be removed when the scope is closed
  const pullStream = DockerEngine.pull({ image })
  yield* Convey.followProgressInConsole(pullStream)

  // Start a container, which will be removed when the scope is closed
  const { Id: containerId } = yield* DockerEngine.runScoped({
    spec: {
      Image: image,
      Tty: true,
      Cmd: ["bash", "-c", 'sleep 2s && echo "Hi" && >&2 echo "Hi2"']
    }
  })

  // Since the container was started with "tty: true", we should get a raw socket here
  const socket: DemuxRaw.BidirectionalRawStreamSocket | DemuxMultiplexed.MultiplexedStreamSocket =
    yield* containers.attach({
      stdout: true,
      stderr: true,
      stream: true,
      id: containerId
    })

  assert.ok(DemuxRaw.isBidirectionalRawStreamSocket(socket), "Expected a bidirectional raw socket")

  const data = yield* DemuxRaw.demuxBidirectionalRawSocket(socket, Stream.never, Sink.collectAll<string>())
  assert.deepStrictEqual(Chunk.toReadonlyArray(data), ["Hi\r\nHi2\r\n"])

  yield* containers.wait({ id: containerId })
})
  .pipe(Effect.scoped)
  .pipe(Effect.provide(layer))
  .pipe(NodeRuntime.runMain)
```

Added in v1.0.0

## demuxUnidirectionalRawSockets

Demux multiple raw sockets, created from multiple container attach websocket
requests. If no options are provided for a given stream, it will be ignored.
This is really just an Effect.all wrapper around
{@link demuxBidirectionalRawSocket}.

To demux a single raw socket, you should use
{@link demuxBidirectionalRawSocket}

**Signature**

```ts
export declare const demuxUnidirectionalRawSockets: <
  O1 extends readonly [Stream.Stream<string | Uint8Array, unknown, unknown>, UnidirectionalRawStreamSocket],
  O2 extends readonly [UnidirectionalRawStreamSocket, Sink.Sink<unknown, string, string, unknown, unknown>],
  O3 extends readonly [UnidirectionalRawStreamSocket, Sink.Sink<unknown, string, string, unknown, unknown>],
  E1 = O1 extends [Stream.Stream<string | Uint8Array, infer E, infer _R>, UnidirectionalRawStreamSocket] ? E : never,
  E2 = O2 extends [UnidirectionalRawStreamSocket, Sink.Sink<infer _A, string, string, infer E, infer _R>] ? E : never,
  E3 = O3 extends [UnidirectionalRawStreamSocket, Sink.Sink<infer _A, string, string, infer E, infer _R>] ? E : never,
  R1 = O1 extends [Stream.Stream<string | Uint8Array, infer _E, infer R>, UnidirectionalRawStreamSocket] ? R : never,
  R2 = O2 extends [UnidirectionalRawStreamSocket, Sink.Sink<infer _A, string, string, infer _E, infer R>] ? R : never,
  R3 = O3 extends [UnidirectionalRawStreamSocket, Sink.Sink<infer _A, string, string, infer _E, infer R>] ? R : never,
  A1 = O2 extends [UnidirectionalRawStreamSocket, Sink.Sink<infer A, string, string, infer _E, infer _R>]
    ? A
    : undefined,
  A2 = O3 extends [UnidirectionalRawStreamSocket, Sink.Sink<infer A, string, string, infer _E, infer _R>]
    ? A
    : undefined
>(
  sockets:
    | { stdin: O1; stdout?: never; stderr?: never }
    | { stdin?: never; stdout: O2; stderr?: never }
    | { stdin?: never; stdout?: never; stderr: O3 }
    | { stdin: O1; stdout: O2; stderr?: never }
    | { stdin: O1; stdout?: never; stderr: O3 }
    | { stdin?: never; stdout: O2; stderr: O3 }
    | { stdin: O1; stdout: O2; stderr: O3 },
  options?: { encoding?: string | undefined } | undefined
) => Effect.Effect<
  CompressedDemuxOutput<A1, A2>,
  E1 | E2 | E3 | Socket.SocketError,
  Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope> | Exclude<R3, Scope.Scope>
>
```

**Example**

```ts
import * as NodeRuntime from "@effect/platform-node/NodeRuntime"
import * as NodeSocket from "@effect/platform-node/NodeSocket"
import * as Chunk from "effect/Chunk"
import * as Effect from "effect/Effect"
import * as Function from "effect/Function"
import * as Layer from "effect/Layer"
import * as Sink from "effect/Sink"
import * as Stream from "effect/Stream"
import * as Tuple from "effect/Tuple"

import * as Convey from "the-moby-effect/Convey"
import * as Platforms from "the-moby-effect/Platforms"
import * as DemuxRaw from "the-moby-effect/demux/Raw"
import * as Containers from "the-moby-effect/endpoints/Containers"
import * as DockerEngine from "the-moby-effect/engines/Docker"

const layer = Function.pipe(
  Platforms.connectionOptionsFromPlatformSystemSocketDefault(),
  Effect.map(DockerEngine.layerNodeJS),
  Layer.unwrapEffect
)

Effect.gen(function* () {
  const image = "ubuntu:latest"
  const containers = yield* Containers.Containers

  // Pull the image, which will be removed when the scope is closed
  const pullStream = DockerEngine.pull({ image })
  yield* Convey.followProgressInConsole(pullStream)

  // Start a container, which will be removed when the scope is closed
  const { Id: containerId } = yield* DockerEngine.runScoped({
    spec: {
      Image: image,
      Tty: false,
      Cmd: ["bash", "-c", 'sleep 2s && echo "Hi" && >&2 echo "Hi2"']
    }
  })

  // It doesn't matter what tty option we start the container with here, we will only get a unidirectional socket
  const stdinSocket: DemuxRaw.UnidirectionalRawStreamSocket = yield* containers.attachWebsocket({
    stdin: true,
    stream: true,
    id: containerId
  })
  const stdoutSocket: DemuxRaw.UnidirectionalRawStreamSocket = yield* containers.attachWebsocket({
    stdout: true,
    stream: true,
    id: containerId
  })
  const stderrSocket: DemuxRaw.UnidirectionalRawStreamSocket = yield* containers.attachWebsocket({
    stderr: true,
    stream: true,
    id: containerId
  })

  assert.ok(DemuxRaw.isUnidirectionalRawStreamSocket(stdinSocket), "Expected a unidirectional raw socket")
  assert.ok(DemuxRaw.isUnidirectionalRawStreamSocket(stdoutSocket), "Expected a unidirectional raw socket")
  assert.ok(DemuxRaw.isUnidirectionalRawStreamSocket(stderrSocket), "Expected a unidirectional raw socket")

  const [stdoutData, stderrData] = yield* DemuxRaw.demuxUnidirectionalRawSockets({
    stdin: Tuple.make(Stream.never, stdinSocket),
    stdout: Tuple.make(stdoutSocket, Sink.collectAll<string>()),
    stderr: Tuple.make(stderrSocket, Sink.collectAll<string>())
  })

  assert.deepStrictEqual(Chunk.toReadonlyArray(stdoutData), ["Hi\n"])
  assert.deepStrictEqual(Chunk.toReadonlyArray(stderrData), ["Hi2\n"])
  yield* containers.wait({ id: containerId })
})
  .pipe(Effect.scoped)
  .pipe(Effect.provide(layer))
  .pipe(Effect.provide(NodeSocket.layerWebSocketConstructor))
  .pipe(NodeRuntime.runMain)
```

Added in v1.0.0

# Predicates

## isBidirectionalRawStreamSocket

**Signature**

```ts
export declare const isBidirectionalRawStreamSocket: (u: unknown) => u is BidirectionalRawStreamSocket
```

Added in v1.0.0

## isUnidirectionalRawStreamSocket

**Signature**

```ts
export declare const isUnidirectionalRawStreamSocket: (u: unknown) => u is UnidirectionalRawStreamSocket
```

Added in v1.0.0

## responseIsRawStreamSocketResponse

**Signature**

```ts
export declare const responseIsRawStreamSocketResponse: (response: HttpClientResponse.HttpClientResponse) => boolean
```

Added in v1.0.0

# Type ids

## BidirectionalRawStreamSocketTypeId

**Signature**

```ts
export declare const BidirectionalRawStreamSocketTypeId: typeof BidirectionalRawStreamSocketTypeId
```

Added in v1.0.0

## BidirectionalRawStreamSocketTypeId (type alias)

**Signature**

```ts
export type BidirectionalRawStreamSocketTypeId = typeof BidirectionalRawStreamSocketTypeId
```

Added in v1.0.0

## UnidirectionalRawStreamSocketTypeId

**Signature**

```ts
export declare const UnidirectionalRawStreamSocketTypeId: typeof UnidirectionalRawStreamSocketTypeId
```

Added in v1.0.0

## UnidirectionalRawStreamSocketTypeId (type alias)

**Signature**

```ts
export type UnidirectionalRawStreamSocketTypeId = typeof UnidirectionalRawStreamSocketTypeId
```

Added in v1.0.0

# Types

## RawStreamSocketContentType

**Signature**

```ts
export declare const RawStreamSocketContentType: "application/vnd.docker.raw-stream"
```

Added in v1.0.0

## UnidirectionalRawStreamSocket (type alias)

When the TTY setting is enabled in POST /containers/create, the stream is not
multiplexed. The data exchanged over the hijacked connection is simply the
raw data from the process PTY and client's stdin.

**Signature**

```ts
export type UnidirectionalRawStreamSocket = Socket.Socket & {
  readonly "content-type": typeof RawStreamSocketContentType
  readonly [UnidirectionalRawStreamSocketTypeId]: typeof UnidirectionalRawStreamSocketTypeId
}
```

Added in v1.0.0
