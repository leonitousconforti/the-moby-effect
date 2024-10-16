---
title: demux/Demux.ts
nav_order: 5
parent: Modules
---

## Demux overview

Common demux utilities for hijacked docker streams.

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Demux](#demux)
  - [demuxAnyToSeparateSinks](#demuxanytoseparatesinks)
  - [demuxToSeparateSinks](#demuxtoseparatesinks)
  - [demuxToSingleSink](#demuxtosinglesink)
  - [demuxUnknownToSeparateSinks](#demuxunknowntoseparatesinks)
  - [demuxUnknownToSingleSink](#demuxunknowntosinglesink)
- [utils](#utils)
  - [Demux (namespace)](#demux-namespace)
    - [AnySocketOptions (type alias)](#anysocketoptions-type-alias)
    - [StdinStdoutStderrSocketOptions (type alias)](#stdinstdoutstderrsocketoptions-type-alias)

---

# Demux

## demuxAnyToSeparateSinks

Demux a single raw socket, multiplexed socket, or multiple raw sockets to two
sinks. If given a single raw stream socket, then stdout and stderr will be
combined on the same sink. If given a multiplexed stream socket, then stdout
and stderr will be forwarded to different sinks. If given multiple raw stream
sockets, then you can choose which ones to provide. The return type will
depend on the type of socket provided, so this isn't suitable for all use
cases. If you need a unified signature, you should use
{@link demuxUnknownToSeparateSinks}.

**Signature**

```ts
export declare const demuxAnyToSeparateSinks: {
  <A1, A2, E1, E2, E3, R1, R2, R3>(
    socket: RawStreamSocket,
    source: Stream.Stream<string | Uint8Array, E1, R1>,
    sink1: Sink.Sink<A1, string, string, E2, R2>,
    sink2: Sink.Sink<A2, string, string, E3, R3>,
    options?: { encoding?: string | undefined } | undefined
  ): Effect.Effect<
    A1,
    E1 | E2 | E3 | Socket.SocketError,
    Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope> | Exclude<R3, Scope.Scope>
  >
  <A1, A2, E1, E2, E3, R1, R2, R3>(
    source: Stream.Stream<string | Uint8Array, E1, R1>,
    sink1: Sink.Sink<A1, string, string, E2, R2>,
    sink2: Sink.Sink<A2, string, string, E3, R3>,
    options?: { encoding?: string | undefined } | undefined
  ): (
    socket: RawStreamSocket
  ) => Effect.Effect<
    A1,
    E1 | E2 | E3 | Socket.SocketError,
    Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope> | Exclude<R3, Scope.Scope>
  >
  <A1, A2, E1, E2, E3, R1, R2, R3>(
    socket: MultiplexedStreamSocket,
    source: Stream.Stream<string | Uint8Array, E1, R1>,
    sink1: Sink.Sink<A1, string, string, E2, R2>,
    sink2: Sink.Sink<A2, string, string, E3, R3>,
    options?: { bufferSize?: number | undefined; encoding?: string | undefined } | undefined
  ): Effect.Effect<
    CompressedDemuxOutput<A1, A2>,
    E1 | E2 | E3 | Socket.SocketError | ParseResult.ParseError,
    Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope> | Exclude<R3, Scope.Scope>
  >
  <A1, A2, E1, E2, E3, R1, R2, R3>(
    source: Stream.Stream<string | Uint8Array, E1, R1>,
    sink1: Sink.Sink<A1, string, string, E2, R2>,
    sink2: Sink.Sink<A2, string, string, E3, R3>,
    options?: { bufferSize?: number | undefined; encoding?: string | undefined } | undefined
  ): (
    socket: MultiplexedStreamSocket
  ) => Effect.Effect<
    CompressedDemuxOutput<A1, A2>,
    E1 | E2 | E3 | Socket.SocketError | ParseResult.ParseError,
    Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope> | Exclude<R3, Scope.Scope>
  >
  <A1, A2, E1, E2, E3, R1, R2, R3, SocketOptions extends Demux.StdinStdoutStderrSocketOptions>(
    sockets: SocketOptions,
    source: Stream.Stream<string | Uint8Array, E1, R1>,
    sink1: Sink.Sink<A1, string, string, E2, R2>,
    sink2: Sink.Sink<A2, string, string, E3, R3>,
    options?: { encoding?: string | undefined } | undefined
  ): Effect.Effect<
    CompressedStdinStdoutStderrOutput<SocketOptions, A1, A2>,
    E1 | E2 | E3 | Socket.SocketError,
    Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope> | Exclude<R3, Scope.Scope>
  >
  <A1, A2, E1, E2, E3, R1, R2, R3, SocketOptions extends Demux.StdinStdoutStderrSocketOptions>(
    source: Stream.Stream<string | Uint8Array, E1, R1>,
    sink1: Sink.Sink<A1, string, string, E2, R2>,
    sink2: Sink.Sink<A2, string, string, E3, R3>,
    options?: { encoding?: string | undefined } | undefined
  ): (
    sockets: SocketOptions
  ) => Effect.Effect<
    CompressedStdinStdoutStderrOutput<SocketOptions, A1, A2>,
    E1 | E2 | E3 | Socket.SocketError,
    Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope> | Exclude<R3, Scope.Scope>
  >
}
```

Added in v1.0.0

## demuxToSeparateSinks

Demux either a multiplexed socket or multiple raw socket to separate sinks.
If you need to also demux a single raw socket, then use
{@link demuxUnknownToSeparateSinks} instead.

**Signature**

```ts
export declare const demuxToSeparateSinks: {
  <A1, A2, E1, E2, E3, R1, R2, R3>(
    socket: MultiplexedStreamSocket,
    source: Stream.Stream<string | Uint8Array, E1, R1>,
    sink1: Sink.Sink<A1, string, string, E2, R2>,
    sink2: Sink.Sink<A2, string, string, E3, R3>,
    options?: { bufferSize?: number | undefined; encoding?: string | undefined } | undefined
  ): Effect.Effect<
    CompressedDemuxOutput<A1, A2>,
    E1 | E2 | E3 | Socket.SocketError | ParseResult.ParseError,
    Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope> | Exclude<R3, Scope.Scope>
  >
  <A1, A2, E1, E2, E3, R1, R2, R3>(
    source: Stream.Stream<string | Uint8Array, E1, R1>,
    sink1: Sink.Sink<A1, string, string, E2, R2>,
    sink2: Sink.Sink<A2, string, string, E3, R3>,
    options?: { bufferSize?: number | undefined; encoding?: string | undefined } | undefined
  ): (
    socket: MultiplexedStreamSocket
  ) => Effect.Effect<
    CompressedDemuxOutput<A1, A2>,
    E1 | E2 | E3 | Socket.SocketError | ParseResult.ParseError,
    Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope> | Exclude<R3, Scope.Scope>
  >
  <A1, A2, E1, E2, E3, R1, R2, R3, SocketOptions extends Demux.StdinStdoutStderrSocketOptions>(
    sockets: SocketOptions,
    source: Stream.Stream<string | Uint8Array, E1, R1>,
    sink1: Sink.Sink<A1, string, string, E2, R2>,
    sink2: Sink.Sink<A2, string, string, E3, R3>,
    options?: { encoding?: string | undefined } | undefined
  ): Effect.Effect<
    CompressedStdinStdoutStderrOutput<SocketOptions, A1, A2>,
    E1 | E2 | E3 | Socket.SocketError,
    Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope> | Exclude<R3, Scope.Scope>
  >
  <A1, A2, E1, E2, E3, R1, R2, R3, SocketOptions extends Demux.StdinStdoutStderrSocketOptions>(
    source: Stream.Stream<string | Uint8Array, E1, R1>,
    sink1: Sink.Sink<A1, string, string, E2, R2>,
    sink2: Sink.Sink<A2, string, string, E3, R3>,
    options?: { encoding?: string | undefined } | undefined
  ): (
    sockets: SocketOptions
  ) => Effect.Effect<
    CompressedStdinStdoutStderrOutput<SocketOptions, A1, A2>,
    E1 | E2 | E3 | Socket.SocketError,
    Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope> | Exclude<R3, Scope.Scope>
  >
}
```

**Example**

```ts
// Demux a multiplexed socket to two sinks
import * as NodeRuntime from "@effect/platform-node/NodeRuntime"
import * as Chunk from "effect/Chunk"
import * as Effect from "effect/Effect"
import * as Function from "effect/Function"
import * as Layer from "effect/Layer"
import * as Sink from "effect/Sink"
import * as Stream from "effect/Stream"

import * as Connection from "the-moby-effect/Connection"
import * as Convey from "the-moby-effect/Convey"
import * as Demux from "the-moby-effect/Demux"
import * as DemuxMultiplexed from "the-moby-effect/demux/Multiplexed"
import * as DemuxRaw from "the-moby-effect/demux/Raw"
import * as Containers from "the-moby-effect/endpoints/Containers"
import * as DockerEngine from "the-moby-effect/engines/Docker"

const layer = Function.pipe(
  Connection.connectionOptionsFromPlatformSystemSocketDefault(),
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
      // Tty: true,
      OpenStdin: true,
      Cmd: ["bash", "-c", 'read | md5sum && >&2 echo "Hi2"']
    }
  })

  // Since the container was started with "tty: false",
  // we should get a multiplexed socket here
  const socket: DemuxRaw.RawStreamSocket | DemuxMultiplexed.MultiplexedStreamSocket = yield* containers.attach({
    stdin: true,
    stdout: true,
    stderr: true,
    stream: true,
    id: containerId
  })
  assert.ok(DemuxMultiplexed.isMultiplexedStreamSocket(socket), "Expected a multiplexed stream socket")

  // Demux to a single sink
  const [stdoutData, stderrData] = yield* Demux.demuxToSeparateSinks(
    socket,
    Stream.concat(Stream.make("a\n"), Stream.never),
    Sink.collectAll<string>(),
    Sink.collectAll<string>()
  )
  assert.strictEqual(Chunk.join(stdoutData, ""), "d41d8cd98f00b204e9800998ecf8427e  -\n")
  assert.strictEqual(Chunk.join(stderrData, ""), "Hi2\n")

  // Wait for the container to exit
  yield* containers.wait({ id: containerId })
})
  .pipe(Effect.scoped)
  .pipe(Effect.provide(layer))
  .pipe(NodeRuntime.runMain)
```

**Example**

```ts
// Demux multiple raw sockets to two sinks
import * as NodeRuntime from "@effect/platform-node/NodeRuntime"
import * as NodeSocket from "@effect/platform-node/NodeSocket"
import * as Chunk from "effect/Chunk"
import * as Effect from "effect/Effect"
import * as Function from "effect/Function"
import * as Layer from "effect/Layer"
import * as Sink from "effect/Sink"
import * as Stream from "effect/Stream"

import * as Connection from "the-moby-effect/Connection"
import * as Convey from "the-moby-effect/Convey"
import * as Demux from "the-moby-effect/Demux"
import * as DemuxRaw from "the-moby-effect/demux/Raw"
import * as Containers from "the-moby-effect/endpoints/Containers"
import * as DockerEngine from "the-moby-effect/engines/Docker"

const layer = Function.pipe(
  Connection.connectionOptionsFromPlatformSystemSocketDefault(),
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
      // Tty: true,
      OpenStdin: true,
      Cmd: ["bash", "-c", 'read | md5sum && >&2 echo "Hi2"']
    }
  })

  // It doesn't matter what tty option we start the container
  // with here, we will only get a raw socket
  const stdinSocket: DemuxRaw.RawStreamSocket = yield* containers.attachWebsocket({
    stdin: true,
    stream: true,
    id: containerId
  })
  const stdoutSocket: DemuxRaw.RawStreamSocket = yield* containers.attachWebsocket({
    stdout: true,
    stream: true,
    id: containerId
  })
  const stderrSocket: DemuxRaw.RawStreamSocket = yield* containers.attachWebsocket({
    stderr: true,
    stream: true,
    id: containerId
  })
  assert.ok(DemuxRaw.isRawStreamSocket(stdinSocket), "Expected a raw socket")
  assert.ok(DemuxRaw.isRawStreamSocket(stdoutSocket), "Expected a raw socket")
  assert.ok(DemuxRaw.isRawStreamSocket(stderrSocket), "Expected a raw socket")

  // Demux to a single sink
  const [stdoutData, stderrData] = yield* Demux.demuxToSeparateSinks(
    {
      stdin: stdinSocket,
      stdout: stdoutSocket,
      stderr: stderrSocket
    },
    Stream.concat(Stream.make("a\n"), Stream.never),
    Sink.collectAll<string>(),
    Sink.collectAll<string>()
  )
  assert.strictEqual(Chunk.join(stdoutData, ""), "d41d8cd98f00b204e9800998ecf8427e  -\n")
  assert.strictEqual(Chunk.join(stderrData, ""), "Hi2\n")

  // Wait for the container to exit
  yield* containers.wait({ id: containerId })
})
  .pipe(Effect.scoped)
  .pipe(Effect.provide(layer))
  .pipe(Effect.provide(NodeSocket.layerWebSocketConstructor))
  .pipe(NodeRuntime.runMain)
```

**Example**

```ts
// Demux single raw socket to two sinks
import * as NodeRuntime from "@effect/platform-node/NodeRuntime"
import * as NodeSocket from "@effect/platform-node/NodeSocket"
import * as Chunk from "effect/Chunk"
import * as Effect from "effect/Effect"
import * as Function from "effect/Function"
import * as Layer from "effect/Layer"
import * as Sink from "effect/Sink"
import * as Stream from "effect/Stream"

import * as Connection from "the-moby-effect/Connection"
import * as Convey from "the-moby-effect/Convey"
import * as Demux from "the-moby-effect/Demux"
import * as DemuxRaw from "the-moby-effect/demux/Raw"
import * as Containers from "the-moby-effect/endpoints/Containers"
import * as DockerEngine from "the-moby-effect/engines/Docker"

const layer = Function.pipe(
  Connection.connectionOptionsFromPlatformSystemSocketDefault(),
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
      // Tty: true,
      AttachStdout: true,
      Cmd: ["bash", "-c", 'sleep 2s && echo "Hi" && >&2 echo "Hi2"']
    }
  })

  // It doesn't matter what tty option we start the container
  // with here, we will only get a raw socket
  const stdoutSocket: DemuxRaw.RawStreamSocket = yield* containers.attachWebsocket({
    stdout: true,
    stream: true,
    id: containerId
  })
  assert.ok(DemuxRaw.isRawStreamSocket(stdoutSocket), "Expected a raw socket")

  // Demux to a single sink
  const [stdoutData, stderrData] = yield* Demux.demuxToSeparateSinks(
    { stdout: stdoutSocket },
    Stream.concat(Stream.make("a\n"), Stream.never),
    Sink.collectAll<string>(),
    Sink.collectAll<string>()
  )
  assert.strictEqual(Chunk.join(stdoutData, ""), "Hi\n")
  assert.strictEqual(stderrData, undefined)

  // Wait for the container to exit
  yield* containers.wait({ id: containerId })
})
  .pipe(Effect.scoped)
  .pipe(Effect.provide(layer))
  .pipe(Effect.provide(NodeSocket.layerWebSocketConstructor))
  .pipe(NodeRuntime.runMain)
```

Added in v1.0.0

## demuxToSingleSink

Demux either a raw socket, multiplexed socket, or multiple raw socket(s) to a
single sink.

**Signature**

```ts
export declare const demuxToSingleSink: {
  <A1, E1, E2, R1, R2>(
    socket: RawStreamSocket,
    source: Stream.Stream<string | Uint8Array, E1, R1>,
    sink: Sink.Sink<A1, string, string, E2, R2>,
    options?: { encoding?: string | undefined } | undefined
  ): Effect.Effect<A1, E1 | E2 | Socket.SocketError, Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope>>
  <A1, E1, E2, R1, R2>(
    source: Stream.Stream<string | Uint8Array, E1, R1>,
    sink: Sink.Sink<A1, string, string, E2, R2>,
    options?: { encoding?: string | undefined } | undefined
  ): (
    socket: RawStreamSocket
  ) => Effect.Effect<A1, E1 | E2 | Socket.SocketError, Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope>>
  <A1, E1, E2, R1, R2>(
    socket: MultiplexedStreamSocket,
    source: Stream.Stream<string | Uint8Array, E1, R1>,
    sink: Sink.Sink<A1, string, string, E2, R2>,
    options?: { bufferSize?: number | undefined; encoding?: string | undefined } | undefined
  ): Effect.Effect<
    A1,
    E1 | E2 | Socket.SocketError | ParseResult.ParseError,
    Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope>
  >
  <A1, E1, E2, R1, R2>(
    source: Stream.Stream<string | Uint8Array, E1, R1>,
    sink: Sink.Sink<A1, string, string, E2, R2>,
    options?: { bufferSize?: number | undefined; encoding?: string | undefined } | undefined
  ): (
    socket: MultiplexedStreamSocket
  ) => Effect.Effect<
    A1,
    E1 | E2 | Socket.SocketError | ParseResult.ParseError,
    Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope>
  >
  <A1, E1, E2, R1, R2>(
    sockets: Demux.StdinStdoutStderrSocketOptions,
    source: Stream.Stream<string | Uint8Array, E1, R1>,
    sink: Sink.Sink<A1, string, string, E2, R2>,
    options?: { encoding?: string | undefined } | undefined
  ): Effect.Effect<A1, E1 | E2 | Socket.SocketError, Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope>>
  <A1, E1, E2, R1, R2>(
    source: Stream.Stream<string | Uint8Array, E1, R1>,
    sink: Sink.Sink<A1, string, string, E2, R2>,
    options?: { encoding?: string | undefined } | undefined
  ): (
    sockets: Demux.StdinStdoutStderrSocketOptions
  ) => Effect.Effect<A1, E1 | E2 | Socket.SocketError, Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope>>
}
```

**Example**

```ts
// Demux a single raw socket to one sink
import * as NodeRuntime from "@effect/platform-node/NodeRuntime"
import * as Chunk from "effect/Chunk"
import * as Effect from "effect/Effect"
import * as Function from "effect/Function"
import * as Layer from "effect/Layer"
import * as Sink from "effect/Sink"
import * as Stream from "effect/Stream"

import * as Connection from "the-moby-effect/Connection"
import * as Convey from "the-moby-effect/Convey"
import * as Demux from "the-moby-effect/Demux"
import * as DemuxMultiplexed from "the-moby-effect/demux/Multiplexed"
import * as DemuxRaw from "the-moby-effect/demux/Raw"
import * as Containers from "the-moby-effect/endpoints/Containers"
import * as DockerEngine from "the-moby-effect/engines/Docker"

const layer = Function.pipe(
  Connection.connectionOptionsFromPlatformSystemSocketDefault(),
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
      OpenStdin: true,
      Cmd: ["bash", "-c", 'read | md5sum && >&2 echo "Hi2"']
    }
  })

  // Since the container was started with "tty: true",
  // we should get a raw socket here
  const socket: DemuxRaw.RawStreamSocket | DemuxMultiplexed.MultiplexedStreamSocket = yield* containers.attach({
    stdin: true,
    stdout: true,
    stderr: true,
    stream: true,
    id: containerId
  })
  assert.ok(DemuxRaw.isRawStreamSocket(socket), "Expected a raw socket")

  // Demux to a single sink
  const input = Stream.concat(Stream.make("a\n"), Stream.never)
  const data = yield* Demux.demuxToSingleSink(socket, input, Sink.collectAll<string>())
  assert.strictEqual(Chunk.join(data, ""), "a\r\nd41d8cd98f00b204e9800998ecf8427e  -\r\nHi2\r\n")

  // Wait for the container to exit
  yield* containers.wait({ id: containerId })
})
  .pipe(Effect.scoped)
  .pipe(Effect.provide(layer))
  .pipe(NodeRuntime.runMain)
```

**Example**

```ts
// Demux a multiplexed socket to one sink
import * as NodeRuntime from "@effect/platform-node/NodeRuntime"
import * as Chunk from "effect/Chunk"
import * as Effect from "effect/Effect"
import * as Function from "effect/Function"
import * as Layer from "effect/Layer"
import * as Sink from "effect/Sink"
import * as Stream from "effect/Stream"

import * as Connection from "the-moby-effect/Connection"
import * as Convey from "the-moby-effect/Convey"
import * as Demux from "the-moby-effect/Demux"
import * as DemuxMultiplexed from "the-moby-effect/demux/Multiplexed"
import * as DemuxRaw from "the-moby-effect/demux/Raw"
import * as Containers from "the-moby-effect/endpoints/Containers"
import * as DockerEngine from "the-moby-effect/engines/Docker"

const layer = Function.pipe(
  Connection.connectionOptionsFromPlatformSystemSocketDefault(),
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
      // Tty: true,
      OpenStdin: true,
      Cmd: ["bash", "-c", 'read | md5sum && >&2 echo "Hi2"']
    }
  })

  // Since the container was started with "tty: false",
  // we should get a multiplexed socket here
  const socket: DemuxRaw.RawStreamSocket | DemuxMultiplexed.MultiplexedStreamSocket = yield* containers.attach({
    stdin: true,
    stdout: true,
    stderr: true,
    stream: true,
    id: containerId
  })
  assert.ok(DemuxMultiplexed.isMultiplexedStreamSocket(socket), "Expected a multiplexed stream socket")

  // Demux to a single sink
  const input = Stream.concat(Stream.make("a\n"), Stream.never)
  const data = yield* Demux.demuxToSingleSink(socket, input, Sink.collectAll<string>())
  assert.strictEqual(Chunk.join(data, ""), "d41d8cd98f00b204e9800998ecf8427e  -\nHi2\n")

  // Wait for the container to exit
  yield* containers.wait({ id: containerId })
})
  .pipe(Effect.scoped)
  .pipe(Effect.provide(layer))
  .pipe(NodeRuntime.runMain)
```

**Example**

```ts
// Demux multiple raw sockets to one sink
import * as NodeRuntime from "@effect/platform-node/NodeRuntime"
import * as NodeSocket from "@effect/platform-node/NodeSocket"
import * as Chunk from "effect/Chunk"
import * as Effect from "effect/Effect"
import * as Function from "effect/Function"
import * as Layer from "effect/Layer"
import * as Sink from "effect/Sink"
import * as Stream from "effect/Stream"

import * as Connection from "the-moby-effect/Connection"
import * as Convey from "the-moby-effect/Convey"
import * as Demux from "the-moby-effect/Demux"
import * as DemuxRaw from "the-moby-effect/demux/Raw"
import * as Containers from "the-moby-effect/endpoints/Containers"
import * as DockerEngine from "the-moby-effect/engines/Docker"

const layer = Function.pipe(
  Connection.connectionOptionsFromPlatformSystemSocketDefault(),
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
      // Tty: true,
      OpenStdin: true,
      Cmd: ["bash", "-c", 'read | md5sum && >&2 echo "Hi2"']
    }
  })

  // It doesn't matter what tty option we start the container
  // with here, we will only get a raw socket
  const stdinSocket: DemuxRaw.RawStreamSocket = yield* containers.attachWebsocket({
    stdin: true,
    stream: true,
    id: containerId
  })
  const stdoutSocket: DemuxRaw.RawStreamSocket = yield* containers.attachWebsocket({
    stdout: true,
    stream: true,
    id: containerId
  })
  const stderrSocket: DemuxRaw.RawStreamSocket = yield* containers.attachWebsocket({
    stderr: true,
    stream: true,
    id: containerId
  })
  assert.ok(DemuxRaw.isRawStreamSocket(stdinSocket), "Expected a raw socket")
  assert.ok(DemuxRaw.isRawStreamSocket(stdoutSocket), "Expected a raw socket")
  assert.ok(DemuxRaw.isRawStreamSocket(stderrSocket), "Expected a raw socket")

  // Demux to a single sink
  const data = yield* Demux.demuxToSingleSink(
    {
      stdin: stdinSocket,
      stdout: stdoutSocket,
      stderr: stderrSocket
    },
    Stream.concat(Stream.make("a\n"), Stream.never),
    Sink.collectAll<string>()
  )

  assert.ok(
    [
      // When tty: false
      "d41d8cd98f00b204e9800998ecf8427e  -\nHi2\n",
      "Hi2\nd41d8cd98f00b204e9800998ecf8427e  -\n",
      // When tty: true
      "a\r\nd41d8cd98f00b204e9800998ecf8427e  -\r\nHi2\r\n",
      "a\r\nHi2\r\nd41d8cd98f00b204e9800998ecf8427e  -\r\n"
    ].includes(Chunk.join(data, ""))
  )

  // Wait for the container to exit
  yield* containers.wait({ id: containerId })
})
  .pipe(Effect.scoped)
  .pipe(Effect.provide(layer))
  .pipe(Effect.provide(NodeSocket.layerWebSocketConstructor))
  .pipe(NodeRuntime.runMain)
```

**Example**

```ts
// Demux a single raw socket to one sink
import * as NodeRuntime from "@effect/platform-node/NodeRuntime"
import * as NodeSocket from "@effect/platform-node/NodeSocket"
import * as Chunk from "effect/Chunk"
import * as Effect from "effect/Effect"
import * as Function from "effect/Function"
import * as Layer from "effect/Layer"
import * as Sink from "effect/Sink"
import * as Stream from "effect/Stream"

import * as Connection from "the-moby-effect/Connection"
import * as Convey from "the-moby-effect/Convey"
import * as Demux from "the-moby-effect/Demux"
import * as DemuxRaw from "the-moby-effect/demux/Raw"
import * as Containers from "the-moby-effect/endpoints/Containers"
import * as DockerEngine from "the-moby-effect/engines/Docker"

const layer = Function.pipe(
  Connection.connectionOptionsFromPlatformSystemSocketDefault(),
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
      // Tty: true,
      AttachStdout: true,
      Cmd: ["bash", "-c", 'sleep 2s && echo "Hi" && >&2 echo "Hi2"']
    }
  })

  // It doesn't matter what tty option we start the container
  // with here, we will only get a raw socket
  const stdoutSocket: DemuxRaw.RawStreamSocket = yield* containers.attachWebsocket({
    stdout: true,
    stream: true,
    id: containerId
  })
  assert.ok(DemuxRaw.isRawStreamSocket(stdoutSocket), "Expected a raw socket")

  // Demux to a single sink
  const data = yield* Demux.demuxToSingleSink(
    { stdout: stdoutSocket },
    Stream.concat(Stream.make("a\n"), Stream.never),
    Sink.collectAll<string>()
  )
  assert.strictEqual(Chunk.join(data, ""), "Hi\n")

  // Wait for the container to exit
  yield* containers.wait({ id: containerId })
})
  .pipe(Effect.scoped)
  .pipe(Effect.provide(layer))
  .pipe(Effect.provide(NodeSocket.layerWebSocketConstructor))
  .pipe(NodeRuntime.runMain)
```

Added in v1.0.0

## demuxUnknownToSeparateSinks

Like {@link demuxAnyToSeparateSinks}, but with unknown sockets and a unified
signature.

**Signature**

```ts
export declare const demuxUnknownToSeparateSinks: {
  <A1, A2, E1, E2, E3, R1, R2, R3>(
    source: Stream.Stream<string | Uint8Array, E1, R1>,
    sink1: Sink.Sink<A1, string, string, E2, R2>,
    sink2: Sink.Sink<A2, string, string, E3, R3>,
    options?: { bufferSize?: number | undefined; encoding?: string | undefined } | undefined
  ): (
    socket: Demux.AnySocketOptions
  ) => Effect.Effect<
    void,
    E1 | E2 | E3 | Socket.SocketError | ParseResult.ParseError,
    Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope> | Exclude<R3, Scope.Scope>
  >
  <A1, A2, E1, E2, E3, R1, R2, R3>(
    socket: Demux.AnySocketOptions,
    source: Stream.Stream<string | Uint8Array, E1, R1>,
    sink1: Sink.Sink<A1, string, string, E2, R2>,
    sink2: Sink.Sink<A2, string, string, E3, R3>,
    options?: { bufferSize?: number | undefined; encoding?: string | undefined } | undefined
  ): Effect.Effect<
    void,
    E1 | E2 | E3 | Socket.SocketError | ParseResult.ParseError,
    Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope> | Exclude<R3, Scope.Scope>
  >
}
```

Added in v1.0.0

## demuxUnknownToSingleSink

Like {@link demuxToSingleSink}, but with unknown input socket.

**Signature**

```ts
export declare const demuxUnknownToSingleSink: {
  <A1, E1, E2, R1, R2>(
    source: Stream.Stream<string | Uint8Array, E1, R1>,
    sink: Sink.Sink<A1, string, string, E2, R2>,
    options?: { bufferSize?: number | undefined; encoding?: string | undefined } | undefined
  ): (
    socket: Demux.AnySocketOptions
  ) => Effect.Effect<
    A1,
    E1 | E2 | Socket.SocketError | ParseResult.ParseError,
    Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope>
  >
  <A1, E1, E2, R1, R2>(
    socket: Demux.AnySocketOptions,
    source: Stream.Stream<string | Uint8Array, E1, R1>,
    sink: Sink.Sink<A1, string, string, E2, R2>,
    options?: { bufferSize?: number | undefined; encoding?: string | undefined } | undefined
  ): Effect.Effect<
    A1,
    E1 | E2 | Socket.SocketError | ParseResult.ParseError,
    Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope>
  >
}
```

Added in v1.0.0

# utils

## Demux (namespace)

Added in v1.0.0

### AnySocketOptions (type alias)

**Signature**

```ts
export type AnySocketOptions = RawStreamSocket | MultiplexedStreamSocket | StdinStdoutStderrSocketOptions
```

Added in v1.0.0

### StdinStdoutStderrSocketOptions (type alias)

**Signature**

```ts
export type StdinStdoutStderrSocketOptions =
  | { stdin: RawStreamSocket; stdout?: never; stderr?: never }
  | { stdin?: never; stdout: RawStreamSocket; stderr?: never }
  | { stdin?: never; stdout?: never; stderr: RawStreamSocket }
  | { stdin: RawStreamSocket; stdout: RawStreamSocket; stderr?: never }
  | { stdin: RawStreamSocket; stdout?: never; stderr: RawStreamSocket }
  | { stdin?: never; stdout: RawStreamSocket; stderr: RawStreamSocket }
  | { stdin: RawStreamSocket; stdout: RawStreamSocket; stderr: RawStreamSocket }
```

Added in v1.0.0
