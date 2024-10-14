---
title: demux/Stdio.ts
nav_order: 8
parent: Modules
---

## Stdio overview

Demux utilities for stdin, stdout/console.log, and stderr/console.error

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Demux](#demux)
  - [demuxSocketFromStdinToStdoutAndStderr](#demuxsocketfromstdintostdoutandstderr)
  - [demuxSocketWithInputToConsole](#demuxsocketwithinputtoconsole)
- [Errors](#errors)
  - [StderrError (class)](#stderrerror-class)
  - [StdinError (class)](#stdinerror-class)
  - [StdoutError (class)](#stdouterror-class)

---

# Demux

## demuxSocketFromStdinToStdoutAndStderr

Demux either a raw stream socket or a multiplexed stream socket from stdin to
stdout and stderr. If given a bidirectional raw stream socket, then stdout
and stderr will be combined on the same sink. If given a multiplexed stream
socket, then stdout and stderr will be forwarded to different sinks. If given
a unidirectional raw stream socket, then you are only required to provide one
for stdout but can also provide sockets for stdin and stderr as well.

If you are looking for a way to demux to the console instead of stdin,
stdout, and stderr then see {@link demuxSocketWithInputToConsole}. Since we
are interacting with stdin, stdout, and stderr this function dynamically
imports the `@effect/platform-node` package.

**Signature**

```ts
export declare const demuxSocketFromStdinToStdoutAndStderr: (
  socketOptions:
    | BidirectionalRawStreamSocket
    | MultiplexedStreamSocket
    | {
        stdout: UnidirectionalRawStreamSocket
        stdin?: UnidirectionalRawStreamSocket | undefined
        stderr?: UnidirectionalRawStreamSocket | undefined
      }
) => Effect.Effect<void, StdinError | StdoutError | StderrError | Socket.SocketError | ParseResult.ParseError, never>
```

Added in v1.0.0

## demuxSocketWithInputToConsole

Demux either a raw stream socket or a multiplexed stream socket to the
console. If given a bidirectional raw stream socket, then stdout and stderr
will be combined on the same sink. If given a multiplexed stream socket, then
stdout and stderr will be forwarded to different sinks. If given a
unidirectional raw stream socket, then you are only required to provide one
for stdout but can also provide sockets for stdin and stderr as well.

If you are looking for a way to demux to stdin, stdout, and stderr instead of
the console then see {@link demuxSocketFromStdinToStdoutAndStderr}.

**Signature**

```ts
export declare const demuxSocketWithInputToConsole: {
  <E1, R1>(
    input: Stream.Stream<string | Uint8Array, E1, R1>
  ): (
    socket: BidirectionalRawStreamSocket
  ) => Effect.Effect<void, E1 | Socket.SocketError | ParseResult.ParseError, Exclude<R1, Scope.Scope>>
  <E1, R1>(
    input: Stream.Stream<string | Uint8Array, E1, R1>
  ): (
    socket: MultiplexedStreamSocket
  ) => Effect.Effect<void, E1 | Socket.SocketError | ParseResult.ParseError, Exclude<R1, Scope.Scope>>
  <E1, R1>(
    input: Stream.Stream<string | Uint8Array, E1, R1>
  ): (sockets: {
    stdout: UnidirectionalRawStreamSocket
    stdin?: UnidirectionalRawStreamSocket | undefined
    stderr?: UnidirectionalRawStreamSocket | undefined
  }) => Effect.Effect<void, E1 | Socket.SocketError | ParseResult.ParseError, Exclude<R1, Scope.Scope>>
}
```

Added in v1.0.0

# Errors

## StderrError (class)

**Signature**

```ts
export declare class StderrError
```

Added in v1.0.0

## StdinError (class)

**Signature**

```ts
export declare class StdinError
```

Added in v1.0.0

## StdoutError (class)

**Signature**

```ts
export declare class StdoutError
```

Added in v1.0.0
