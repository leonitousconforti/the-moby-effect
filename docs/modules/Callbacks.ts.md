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
  pull: (a: {
    image: string
    auth?: string | undefined
    platform?: string | undefined
  }) => ReadableStream<MobySchemas.JSONMessage>
  build: <E1>(a: {
    tag: string
    auth?: string | undefined
    platform?: string | undefined
    dockerfile?: string | undefined
    context: Stream.Stream<Uint8Array, E1, never>
    buildArgs?: Record<string, string | undefined> | undefined
  }) => ReadableStream<MobySchemas.JSONMessage>
  stop: (z: string, callback: (exit: Exit.Exit<void, ContainersError>) => void) => void
  start: (z: string, callback: (exit: Exit.Exit<void, ContainersError>) => void) => void
  run: (
    z: {
      readonly name?: string | undefined
      readonly platform?: string | undefined
      readonly spec: {
        readonly Image: string
        readonly Hostname?: string | null | undefined
        readonly Domainname?: string | null | undefined
        readonly User?: string | null | undefined
        readonly AttachStdin?: boolean | null | undefined
        readonly AttachStdout?: boolean | null | undefined
        readonly AttachStderr?: boolean | null | undefined
        readonly ExposedPorts?:
          | {
              readonly [x: `${number}`]: object
              readonly [x: `${number}/tcp`]: object
              readonly [x: `${number}/udp`]: object
            }
          | null
          | undefined
        readonly Tty?: boolean | null | undefined
        readonly OpenStdin?: boolean | null | undefined
        readonly StdinOnce?: boolean | null | undefined
        readonly Env?: ReadonlyArray<string> | null | undefined
        readonly Cmd?: ReadonlyArray<string> | null | undefined
        readonly Healthcheck?:
          | {
              readonly Test?: ReadonlyArray<string> | null | undefined
              readonly Interval?: number | undefined
              readonly Timeout?: number | undefined
              readonly StartPeriod?: number | undefined
              readonly StartInterval?: number | undefined
              readonly Retries?: number | undefined
            }
          | null
          | undefined
        readonly ArgsEscaped?: boolean | null | undefined
        readonly Volumes?: { readonly [x: string]: object } | null | undefined
        readonly WorkingDir?: string | null | undefined
        readonly Entrypoint?: ReadonlyArray<string> | null | undefined
        readonly NetworkDisabled?: boolean | null | undefined
        readonly MacAddress?: string | null | undefined
        readonly OnBuild?: ReadonlyArray<string> | null | undefined
        readonly Labels?: { readonly [x: string]: string } | null | undefined
        readonly StopSignal?: string | null | undefined
        readonly StopTimeout?: number | null | undefined
        readonly Shell?: ReadonlyArray<string> | null | undefined
        readonly HostConfig?:
          | {
              readonly Binds?: ReadonlyArray<string> | null | undefined
              readonly ContainerIDFile?: string | null | undefined
              readonly LogConfig?:
                | { readonly Type: string; readonly Config: { readonly [x: string]: string } | null }
                | null
                | undefined
              readonly NetworkMode?: "none" | "default" | "host" | "bridge" | "nat" | null | undefined
              readonly PortBindings?:
                | {
                    readonly [x: `${number}`]: ReadonlyArray<{
                      readonly HostPort: string
                      readonly HostIp?: string | null | undefined
                    }>
                    readonly [x: `${number}/tcp`]: ReadonlyArray<{
                      readonly HostPort: string
                      readonly HostIp?: string | null | undefined
                    }>
                    readonly [x: `${number}/udp`]: ReadonlyArray<{
                      readonly HostPort: string
                      readonly HostIp?: string | null | undefined
                    }>
                  }
                | null
                | undefined
              readonly RestartPolicy?:
                | {
                    readonly MaximumRetryCount: number
                    readonly Name: "no" | "always" | "unless-stopped" | "on-failure"
                  }
                | null
                | undefined
              readonly AutoRemove?: boolean | null | undefined
              readonly VolumeDriver?: string | null | undefined
              readonly VolumesFrom?: ReadonlyArray<string> | null | undefined
              readonly ConsoleSize?: ReadonlyArray<number> | null | undefined
              readonly Annotations?: { readonly [x: string]: string } | null | undefined
              readonly CapAdd?: ReadonlyArray<string> | null | undefined
              readonly CapDrop?: ReadonlyArray<string> | null | undefined
              readonly CgroupnsMode?: "" | "host" | "private" | null | undefined
              readonly Dns?: ReadonlyArray<string> | null | undefined
              readonly DnsOptions?: ReadonlyArray<string> | null | undefined
              readonly DnsSearch?: ReadonlyArray<string> | null | undefined
              readonly ExtraHosts?: ReadonlyArray<string> | null | undefined
              readonly GroupAdd?: ReadonlyArray<string> | null | undefined
              readonly IpcMode?: "none" | "host" | "private" | "container" | "shareable" | null | undefined
              readonly Cgroup?: string | null | undefined
              readonly Links?: ReadonlyArray<string> | null | undefined
              readonly OomScoreAdj?: number | null | undefined
              readonly PidMode?: string | null | undefined
              readonly Privileged?: boolean | null | undefined
              readonly PublishAllPorts?: boolean | null | undefined
              readonly ReadonlyRootfs?: boolean | null | undefined
              readonly SecurityOpt?: ReadonlyArray<string> | null | undefined
              readonly StorageOpt?: { readonly [x: string]: string } | null | undefined
              readonly Tmpfs?: { readonly [x: string]: string } | null | undefined
              readonly UTSMode?: string | null | undefined
              readonly UsernsMode?: string | null | undefined
              readonly ShmSize?: number | null | undefined
              readonly Sysctls?: { readonly [x: string]: string } | null | undefined
              readonly Runtime?: string | null | undefined
              readonly Isolation?: "" | "default" | "process" | "hyperv" | null | undefined
              readonly CpuShares?: number | null | undefined
              readonly Memory?: number | null | undefined
              readonly NanoCpus?: number | null | undefined
              readonly CgroupParent?: string | null | undefined
              readonly BlkioWeight?: number | null | undefined
              readonly BlkioWeightDevice?:
                | ReadonlyArray<{ readonly Path: string; readonly Weight: number } | null>
                | null
                | undefined
              readonly BlkioDeviceReadBps?:
                | ReadonlyArray<{ readonly Path: string; readonly Rate: number } | null>
                | null
                | undefined
              readonly BlkioDeviceWriteBps?:
                | ReadonlyArray<{ readonly Path: string; readonly Rate: number } | null>
                | null
                | undefined
              readonly BlkioDeviceReadIOps?:
                | ReadonlyArray<{ readonly Path: string; readonly Rate: number } | null>
                | null
                | undefined
              readonly BlkioDeviceWriteIOps?:
                | ReadonlyArray<{ readonly Path: string; readonly Rate: number } | null>
                | null
                | undefined
              readonly CpuPeriod?: number | null | undefined
              readonly CpuQuota?: number | null | undefined
              readonly CpuRealtimePeriod?: number | null | undefined
              readonly CpuRealtimeRuntime?: number | null | undefined
              readonly CpusetCpus?: string | null | undefined
              readonly CpusetMems?: string | null | undefined
              readonly Devices?:
                | ReadonlyArray<{
                    readonly PathOnHost: string
                    readonly PathInContainer: string
                    readonly CgroupPermissions: string
                  } | null>
                | null
                | undefined
              readonly DeviceCgroupRules?: ReadonlyArray<string> | null | undefined
              readonly DeviceRequests?:
                | ReadonlyArray<{
                    readonly Driver: string
                    readonly Count: number
                    readonly DeviceIDs: ReadonlyArray<string> | null
                    readonly Capabilities: ReadonlyArray<ReadonlyArray<string> | null> | null
                    readonly Options: { readonly [x: string]: string } | null
                  } | null>
                | null
                | undefined
              readonly KernelMemory?: number | null | undefined
              readonly KernelMemoryTCP?: number | null | undefined
              readonly MemoryReservation?: number | null | undefined
              readonly MemorySwap?: number | null | undefined
              readonly MemorySwappiness?: number | null | undefined
              readonly OomKillDisable?: boolean | null | undefined
              readonly PidsLimit?: number | null | undefined
              readonly Ulimits?:
                | ReadonlyArray<{ readonly Name: string; readonly Hard: number; readonly Soft: number } | null>
                | null
                | undefined
              readonly CpuCount?: number | null | undefined
              readonly CpuPercent?: number | null | undefined
              readonly IOMaximumIOps?: number | null | undefined
              readonly IOMaximumBandwidth?: number | null | undefined
              readonly Mounts?:
                | ReadonlyArray<{
                    readonly Type?: "bind" | "volume" | "tmpfs" | "npipe" | "cluster" | undefined
                    readonly Source?: string | undefined
                    readonly Target?: string | undefined
                    readonly ReadOnly?: boolean | undefined
                    readonly Consistency?: "default" | "consistent" | "cached" | "delegated" | undefined
                    readonly BindOptions?:
                      | {
                          readonly Propagation?:
                            | "private"
                            | "rprivate"
                            | "rshared"
                            | "shared"
                            | "rslave"
                            | "slave"
                            | undefined
                          readonly NonRecursive?: boolean | undefined
                          readonly CreateMountpoint?: boolean | undefined
                          readonly ReadOnlyNonRecursive?: boolean | undefined
                          readonly ReadOnlyForceRecursive?: boolean | undefined
                        }
                      | null
                      | undefined
                    readonly VolumeOptions?:
                      | {
                          readonly Labels?: { readonly [x: string]: string } | null | undefined
                          readonly NoCopy?: boolean | undefined
                          readonly Subpath?: string | undefined
                          readonly DriverConfig?:
                            | {
                                readonly Name?: string | undefined
                                readonly Options?: { readonly [x: string]: string } | null | undefined
                              }
                            | null
                            | undefined
                        }
                      | null
                      | undefined
                    readonly TmpfsOptions?:
                      | {
                          readonly Options?: ReadonlyArray<ReadonlyArray<string> | null> | null | undefined
                          readonly SizeBytes?: number | undefined
                          readonly Mode?: number | undefined
                        }
                      | null
                      | undefined
                    readonly ClusterOptions?: {} | null | undefined
                  } | null>
                | null
                | undefined
              readonly MaskedPaths?: ReadonlyArray<string> | null | undefined
              readonly ReadonlyPaths?: ReadonlyArray<string> | null | undefined
              readonly Init?: boolean | null | undefined
            }
          | null
          | undefined
        readonly NetworkingConfig?:
          | {
              readonly EndpointsConfig: {
                readonly [x: string]: {
                  readonly MacAddress: string
                  readonly Links: ReadonlyArray<string> | null
                  readonly NetworkID: string
                  readonly EndpointID: string
                  readonly Gateway: string
                  readonly IPPrefixLen: number
                  readonly IPv6Gateway: string
                  readonly GlobalIPv6Address: string
                  readonly GlobalIPv6PrefixLen: number
                  readonly IPAMConfig: {
                    readonly IPv4Address?: string | undefined
                    readonly IPv6Address?: string | undefined
                    readonly LinkLocalIPs?: ReadonlyArray<string> | null | undefined
                  } | null
                  readonly Aliases: ReadonlyArray<string> | null
                  readonly DriverOpts: { readonly [x: string]: string } | null
                  readonly IPAddress: string
                  readonly DNSNames: ReadonlyArray<string> | null
                } | null
              } | null
            }
          | null
          | undefined
      }
    },
    callback: (exit: Exit.Exit<MobySchemas.ContainerInspectResponse, ContainersError>) => void
  ) => void
  exec: (
    z: { containerId: string; command: string | Array<string> },
    callback: (
      exit: Exit.Exit<readonly [exitCode: number, output: string], ExecsError | SocketError | ParseError>
    ) => void
  ) => void
  execNonBlocking: <T extends boolean | undefined = undefined>(
    z: { detach?: T; containerId: string; command: string | Array<string> },
    callback: (
      exit: Exit.Exit<[socket: T extends true ? void : RawSocket | MultiplexedSocket, execId: string], ExecsError>
    ) => void
  ) => void
  execWebsockets: (
    z: { command: string | Array<string>; containerId: string },
    callback: (
      exit: Exit.Exit<readonly [stdout: string, stderr: string], ContainersError | SocketError | ParseError>
    ) => void
  ) => void
  execWebsocketsNonBlocking: (a: {
    command: string | Array<string>
    containerId: string
    cwd?: string | undefined
  }) => ReadableStream<MultiplexedChannel<never, ContainersError | SocketError, never>>
  ps: (
    z:
      | {
          readonly all?: boolean | undefined
          readonly limit?: number | undefined
          readonly size?: boolean | undefined
          readonly filters?:
            | {
                ancestor?: string | undefined
                before?: string | undefined
                expose?: `${number}/${string}` | `${number}-${number}/${string}` | undefined
                exited?: number | undefined
                health?: "starting" | "healthy" | "unhealthy" | "none" | undefined
                id?: string | undefined
                isolation?: "default" | "process" | "hyperv" | undefined
                "is-task"?: true | false | undefined
                label?: Record<string, string> | undefined
                name?: string | undefined
                network?: string | undefined
                publish?: `${number}/${string}` | `${number}-${number}/${string}` | undefined
                since?: string | undefined
                status?: "created" | "restarting" | "running" | "removing" | "paused" | "exited" | "dead" | undefined
                volume?: string | undefined
              }
            | undefined
        }
      | undefined,
    callback: (exit: Exit.Exit<ReadonlyArray<MobySchemas.ContainerListResponseItem>, ContainersError>) => void
  ) => void
  push: (a: {
    readonly name: string
    readonly tag?: string
    readonly "X-Registry-Auth": string
  }) => ReadableStream<string>
  images: (
    z:
      | {
          readonly all?: boolean
          readonly filters?: string | undefined
          readonly "shared-size"?: boolean | undefined
          readonly digests?: boolean | undefined
        }
      | undefined,
    callback: (exit: Exit.Exit<ReadonlyArray<MobySchemas.ImageSummary>, ImagesError>) => void
  ) => void
  search: (
    z: {
      readonly term: string
      readonly limit?: number | undefined
      readonly stars?: number | undefined
      readonly "is-official"?: boolean | undefined
    },
    callback: (exit: Exit.Exit<ReadonlyArray<MobySchemas.RegistrySearchResponse>, ImagesError>) => void
  ) => void
  version: (callback: (exit: Exit.Exit<Readonly<MobySchemas.SystemVersionResponse>, SystemsError>) => void) => void
  info: (callback: (exit: Exit.Exit<Readonly<MobySchemas.SystemInfoResponse>, SystemsError>) => void) => void
  ping: (callback: (exit: Exit.Exit<"OK", SystemsError>) => void) => void
  pingHead: (callback: (exit: Exit.Exit<void, SystemsError>) => void) => void
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
