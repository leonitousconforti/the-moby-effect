---
title: demux/Stdio.ts
nav_order: 7
parent: Modules
---

## Stdio overview

Demux utilities for stdin, stdout/console.log, and stderr/console.error

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [DemuxStdio](#demuxstdio)
  - [demuxSocketFromStdinToStdoutAndStderr](#demuxsocketfromstdintostdoutandstderr)
  - [demuxSocketWithInputToConsole](#demuxsocketwithinputtoconsole)
- [Errors](#errors)
  - [StderrError (class)](#stderrerror-class)
  - [StdinError (class)](#stdinerror-class)
  - [StdoutError (class)](#stdouterror-class)

---

# DemuxStdio

## demuxSocketFromStdinToStdoutAndStderr

Demux either a raw stream socket or a multiplexed stream socket from stdin to
stdout and stderr. If given a raw stream socket, then stdout and stderr will
be combined on the same sink. If given a multiplexed stream socket, then
stdout and stderr will be forwarded to different sinks. If given multiple raw
stream sockets, then you can provide different individual sockets for stdin,
stdout, and stderr.

If you are looking for a way to demux to the console instead of stdin,
stdout, and stderr then see {@link demuxSocketWithInputToConsole}. Since we
are interacting with stdin, stdout, and stderr this function dynamically
imports the `@effect/platform-node` package.

**Signature**

```ts
export declare const demuxSocketFromStdinToStdoutAndStderr: (
  sockets: Demux.AnySocketOptions,
  options?: { bufferSize?: number | undefined; encoding?: string | undefined } | undefined
) => Effect.Effect<void, StdinError | StdoutError | StderrError | Socket.SocketError | ParseResult.ParseError, never>
```

Added in v1.0.0

## demuxSocketWithInputToConsole

Demux either a raw stream socket or a multiplexed stream socket to the
console. If given a raw stream socket, then stdout and stderr will be
combined on the same sink. If given a multiplexed stream socket, then stdout
and stderr will be forwarded to different sinks. If given multiple raw stream
sockets, then you can provide different individual sockets for stdin, stdout,
and stderr.

If you are looking for a way to demux to stdin, stdout, and stderr instead of
the console then see {@link demuxSocketFromStdinToStdoutAndStderr}.

**Signature**

```ts
export declare const demuxSocketWithInputToConsole: <E1, R1>(
  sockets: Demux.AnySocketOptions,
  input: Stream.Stream<string | Uint8Array, E1, R1>,
  options?: { bufferSize?: number | undefined; encoding?: string | undefined } | undefined
) => Effect.Effect<void, E1 | Socket.SocketError | ParseResult.ParseError, Exclude<R1, Scope.Scope>>
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
