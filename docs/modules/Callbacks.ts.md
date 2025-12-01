---
title: Callbacks.ts
nav_order: 1
parent: Modules
---

## Callbacks.ts overview

Docker engine callbacks api

Since v1.0.0

---

## Exports Grouped by Category

- [Callbacks](#callbacks)
  - [callbackClient](#callbackclient)
  - [runCallback](#runcallback)
  - [runCallbackForEffect](#runcallbackforeffect)

---

# Callbacks

## callbackClient

Create a callback client for the docker engine

**Signature**

```ts
declare const callbackClient: <E>(
  layer: Layer.Layer<
    Layer.Layer.Success<DockerEngine.DockerLayer>,
    Layer.Layer.Error<DockerEngine.DockerLayer> | E,
    Layer.Layer.Context<DockerEngine.DockerLayer>
  >
) => Promise<{
  pull: (a: { image: string; platform?: string | undefined }) => ReadableStream<MobySchemas.JSONMessage>
  build: <E1>(a: {
    tag: string
    platform?: string | undefined
    dockerfile?: string | undefined
    context: Stream.Stream<Uint8Array, E1, never>
    buildargs?: Record<string, string | undefined> | undefined
  }) => ReadableStream<MobySchemas.JSONMessage>
  stop: (z: string & Brand<"ContainerId">, callback: (exit: Exit.Exit<void, DockerError>) => void) => void
  start: (z: string & Brand<"ContainerId">, callback: (exit: Exit.Exit<void, DockerError>) => void) => void
  run: (
    z: Omit<
      {
        readonly Image: string
        readonly Hostname?: string | undefined
        readonly Domainname?: string | undefined
        readonly User?: string | undefined
        readonly AttachStdin?: boolean | undefined
        readonly AttachStdout?: boolean | undefined
        readonly AttachStderr?: boolean | undefined
        readonly ExposedPorts?:
          | {
              readonly [x: `${number}`]: object
              readonly [x: `${number}/tcp`]: object
              readonly [x: `${number}/udp`]: object
            }
          | undefined
        readonly Tty?: boolean | undefined
        readonly OpenStdin?: boolean | undefined
        readonly StdinOnce?: boolean | undefined
        readonly Env?: ReadonlyArray<string> | null | undefined
        readonly Cmd?: ReadonlyArray<string> | null | undefined
        readonly Healthcheck?: MobySchemas.V1HealthcheckConfig | undefined
        readonly ArgsEscaped?: boolean | undefined
        readonly Volumes?: { readonly [x: string]: object } | null | undefined
        readonly WorkingDir?: string | undefined
        readonly Entrypoint?: ReadonlyArray<string> | null | undefined
        readonly NetworkDisabled?: boolean | undefined
        readonly MacAddress?: string | undefined
        readonly OnBuild?: ReadonlyArray<string> | null | undefined
        readonly Labels?: { readonly [x: string]: string } | null | undefined
        readonly StopSignal?: string | undefined
        readonly StopTimeout?: (bigint & Brand<"I64">) | undefined
        readonly Shell?: ReadonlyArray<string> | undefined
        readonly HostConfig?: MobySchemas.ContainerHostConfig | undefined
        readonly NetworkingConfig?: MobySchemas.NetworkNetworkingConfig | undefined
      },
      "HostConfig"
    > & {
      readonly name?: string | undefined
      readonly platform?: string | undefined
      readonly HostConfig?: ConstructorParameters<typeof MobySchemas.ContainerHostConfig>[0] | undefined
    },
    callback: (exit: Exit.Exit<MobySchemas.ContainerInspectResponse, DockerError>) => void
  ) => void
  exec: (
    z: { command: string | Array<string>; containerId: MobySchemas.ContainerIdentifier },
    callback: (
      exit: Exit.Exit<[exitCode: bigint & Brand<"I64">, output: string], DockerError | SocketError | ParseError>
    ) => void
  ) => void
  execNonBlocking: <const T extends boolean = false>(
    z: { detach: T; command: string | Array<string>; containerId: MobySchemas.ContainerIdentifier },
    callback: (
      exit: Exit.Exit<
        [[T] extends [false] ? RawSocket | MultiplexedSocket : void, string & Brand<"ExecId">],
        DockerError | SocketError | ParseError
      >
    ) => void
  ) => void
  execWebsockets: (
    z: { command: string | Array<string>; containerId: MobySchemas.ContainerIdentifier },
    callback: (
      exit: Exit.Exit<readonly [stdout: string, stderr: string], DockerError | SocketError | ParseError>
    ) => void
  ) => void
  execWebsocketsNonBlocking: (a: {
    command: string | Array<string>
    containerId: MobySchemas.ContainerIdentifier
    cwd?: string | undefined
  }) => ReadableStream<MultiplexedChannel<never, DockerError | SocketError, never>>
  ps: (
    z:
      | {
          readonly all?: boolean | undefined
          readonly limit?: number | undefined
          readonly size?: boolean | undefined
          readonly filters?:
            | {
                readonly identifier?: ReadonlyArray<string & Brand<"ContainerId">> | undefined
                readonly volume?: string | undefined
                readonly name?: ReadonlyArray<string> | undefined
                readonly ancestor?: ReadonlyArray<string> | undefined
                readonly before?: ReadonlyArray<string> | undefined
                readonly expose?: ReadonlyArray<string> | undefined
                readonly exited?: ReadonlyArray<number> | undefined
                readonly health?: ReadonlyArray<"none" | "starting" | "healthy" | "unhealthy"> | undefined
                readonly "is-task"?: boolean | undefined
                readonly label?: ReadonlyArray<string> | undefined
                readonly network?: ReadonlyArray<string> | undefined
                readonly publish?: ReadonlyArray<string> | undefined
                readonly since?: ReadonlyArray<string> | undefined
                readonly status?:
                  | ReadonlyArray<"exited" | "created" | "restarting" | "running" | "removing" | "paused" | "dead">
                  | undefined
              }
            | undefined
        }
      | undefined,
    callback: (exit: Exit.Exit<ReadonlyArray<MobySchemas.ContainerSummary>, DockerError>) => void
  ) => void
  push: (
    name: string,
    options: { readonly platform?: string | undefined; readonly tag?: string | undefined } | undefined
  ) => ReadableStream<MobySchemas.JSONMessage>
  images: (
    z:
      | {
          readonly all?: boolean | undefined
          readonly filters?:
            | {
                readonly before?: ReadonlyArray<string> | undefined
                readonly label?: ReadonlyArray<string> | undefined
                readonly since?: ReadonlyArray<string> | undefined
                readonly until?: string | undefined
                readonly dangling?: boolean | undefined
                readonly reference?: ReadonlyArray<string> | undefined
              }
            | undefined
          readonly digests?: boolean | undefined
          readonly "shared-size"?: boolean | undefined
        }
      | undefined,
    callback: (exit: Exit.Exit<ReadonlyArray<MobySchemas.ImageSummary>, DockerError>) => void
  ) => void
  search: (
    z: {
      readonly limit?: number | undefined
      readonly filters?:
        | {
            readonly "is-official"?: boolean | undefined
            readonly "is-automated"?: boolean | undefined
            readonly stars?: number | undefined
          }
        | undefined
      readonly term: string
    },
    callback: (exit: Exit.Exit<ReadonlyArray<MobySchemas.RegistrySearchResult>, DockerError>) => void
  ) => void
  version: (callback: (exit: Exit.Exit<MobySchemas.TypesVersion, DockerError>) => void) => void
  info: (callback: (exit: Exit.Exit<MobySchemas.SystemInfo, DockerError>) => void) => void
  ping: (callback: (exit: Exit.Exit<void, DockerError>) => void) => void
  pingHead: (callback: (exit: Exit.Exit<void, DockerError>) => void) => void
  followProgressInConsole: (
    y: Function.LazyArg<ReadableStream<MobySchemas.JSONMessage>>,
    z: (error: unknown) => unknown,
    callback: (exit: Exit.Exit<ReadonlyArray<MobySchemas.JSONMessage>, unknown>) => void
  ) => void
  waitForProgressToComplete: (
    y: Function.LazyArg<ReadableStream<MobySchemas.JSONMessage>>,
    z: (error: unknown) => unknown,
    callback: (exit: Exit.Exit<ReadonlyArray<MobySchemas.JSONMessage>, unknown>) => void
  ) => void
}>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/Callbacks.ts#L117)

Since v1.0.0

## runCallback

**Signature**

```ts
declare const runCallback: {
  <R = never>(
    runtime: Runtime.Runtime<R>,
    arity: 0
  ): <A = void, E = never>(
    function_: () => Effect.Effect<A, E, R>
  ) => (callback: (exit: Exit.Exit<A, E>) => void) => void
  <R = never>(
    runtime: Runtime.Runtime<R>,
    arity: 1
  ): <Z, A = void, E = never>(
    function_: (z: Z) => Effect.Effect<A, E, R>
  ) => (z: Z, callback: (exit: Exit.Exit<A, E>) => void) => void
  <R = never>(
    runtime: Runtime.Runtime<R>,
    arity: 2
  ): <Y, Z, A = void, E = never>(
    function_: (y: Y, z: Z) => Effect.Effect<A, E, R>
  ) => (y: Y, z: Z, callback: (exit: Exit.Exit<A, E>) => void) => void
  <R = never>(
    runtime: Runtime.Runtime<R>,
    arity: 3
  ): <X, Y, Z, A = void, E = never>(
    function_: (x: X, y: Y, z: Z) => Effect.Effect<A, E, R>
  ) => (x: X, y: Y, z: Z, callback: (exit: Exit.Exit<A, E>) => void) => void
  <R = never>(
    runtime: Runtime.Runtime<R>,
    arity: 4
  ): <W, X, Y, Z, A = void, E = never>(
    function_: (w: W, x: X, y: Y, z: Z) => Effect.Effect<A, E, R>
  ) => (w: W, x: X, y: Y, z: Z, callback: (exit: Exit.Exit<A, E>) => void) => void
  <R = never>(
    runtime: Runtime.Runtime<R>,
    arity: 5
  ): <V, W, X, Y, Z, A = void, E = never>(
    function_: (v: V, w: W, x: X, y: Y, z: Z) => Effect.Effect<A, E, R>
  ) => (v: V, w: W, x: X, y: Y, z: Z, callback: (exit: Exit.Exit<A, E>) => void) => void
}
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/Callbacks.ts#L71)

Since v1.0.0

## runCallbackForEffect

**Signature**

```ts
declare const runCallbackForEffect: <R = never>(
  runtime: Runtime.Runtime<R>
) => <A = void, E = never>(
  effect: Effect.Effect<A, E, R>
) => (
  callback: (exit: Exit.Exit<A, E>) => void
) => (fiberId?: FiberId, options?: Runtime.RunCallbackOptions<A, E> | undefined) => void
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/Callbacks.ts#L25)

Since v1.0.0
