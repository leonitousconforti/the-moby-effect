---
title: Promises.ts
nav_order: 13
parent: Modules
---

## Promises.ts overview

Docker engine promises api

Since v1.0.0

---

## Exports Grouped by Category

- [Promises](#promises)
  - [promiseClient](#promiseclient)

---

# Promises

## promiseClient

Create a promise client for the docker engine

**Signature**

```ts
declare const promiseClient: <E>(
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
  stop: (containerId: string & Brand<"ContainerId">) => Promise<void>
  start: (containerId: string & Brand<"ContainerId">) => Promise<void>
  run: (
    options: Omit<
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
    }
  ) => Promise<MobySchemas.ContainerInspectResponse>
  exec: (a_0: {
    command: string | Array<string>
    containerId: MobySchemas.ContainerIdentifier
  }) => Promise<[exitCode: bigint & Brand<"I64">, output: string]>
  execNonBlocking: <const T extends boolean = false>(a_0: {
    detach: T
    command: string | Array<string>
    containerId: MobySchemas.ContainerIdentifier
  }) => Promise<[[T] extends [false] ? RawSocket | MultiplexedSocket : void, string & Brand<"ExecId">]>
  execWebsockets: (a_0: {
    command: string | Array<string>
    containerId: MobySchemas.ContainerIdentifier
  }) => Promise<readonly [stdout: string, stderr: string]>
  execWebsocketsNonBlocking: (a: {
    command: string | Array<string>
    containerId: MobySchemas.ContainerIdentifier
    cwd?: string | undefined
  }) => ReadableStream<MultiplexedChannel<never, DockerError | SocketError, never>>
  ps: (
    options?:
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
  ) => Promise<ReadonlyArray<MobySchemas.ContainerSummary>>
  push: (
    name: string,
    options: { readonly platform?: string | undefined; readonly tag?: string | undefined } | undefined
  ) => ReadableStream<MobySchemas.JSONMessage>
  images: (
    options?:
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
      | undefined
  ) => Promise<ReadonlyArray<MobySchemas.ImageSummary>>
  search: (options: {
    readonly limit?: number | undefined
    readonly filters?:
      | {
          readonly "is-official"?: boolean | undefined
          readonly "is-automated"?: boolean | undefined
          readonly stars?: number | undefined
        }
      | undefined
    readonly term: string
  }) => Promise<ReadonlyArray<MobySchemas.RegistrySearchResult>>
  version: () => Promise<MobySchemas.TypesVersion>
  info: () => Promise<MobySchemas.SystemInfo>
  ping: () => Promise<void>
  pingHead: () => Promise<void>
  followProgressInConsole: (
    evaluate: Function.LazyArg<ReadableStream<MobySchemas.JSONMessage>>,
    onError: (error: unknown) => unknown
  ) => Promise<ReadonlyArray<MobySchemas.JSONMessage>>
  waitForProgressToComplete: (
    evaluate: Function.LazyArg<ReadableStream<MobySchemas.JSONMessage>>,
    onError: (error: unknown) => unknown
  ) => Promise<ReadonlyArray<MobySchemas.JSONMessage>>
}>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/Promises.ts#L24)

Since v1.0.0
