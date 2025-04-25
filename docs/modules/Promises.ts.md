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
  stop: (containerId: string) => Promise<void>
  start: (containerId: string) => Promise<void>
  run: (containerOptions: {
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
              | { readonly MaximumRetryCount: number; readonly Name: "no" | "always" | "unless-stopped" | "on-failure" }
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
  }) => Promise<MobySchemas.ContainerInspectResponse>
  exec: (a_0: {
    containerId: string
    command: string | Array<string>
  }) => Promise<readonly [exitCode: number, output: string]>
  execNonBlocking: <T extends boolean | undefined = undefined>(a_0: {
    detach?: T
    containerId: string
    command: string | Array<string>
  }) => Promise<[socket: T extends true ? void : RawSocket | MultiplexedSocket, execId: string]>
  execWebsockets: (a_0: {
    command: string | Array<string>
    containerId: string
  }) => Promise<readonly [stdout: string, stderr: string]>
  execWebsocketsNonBlocking: (a: {
    command: string | Array<string>
    containerId: string
  }) => ReadableStream<MultiplexedChannel<never, ContainersError | SocketError, never>>
  ps: (
    options?:
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
      | undefined
  ) => Promise<ReadonlyArray<MobySchemas.ContainerListResponseItem>>
  push: (options: {
    readonly name: string
    readonly tag?: string
    readonly "X-Registry-Auth": string
  }) => ReadableStream<string>
  images: (
    options?:
      | {
          readonly all?: boolean
          readonly filters?: string | undefined
          readonly "shared-size"?: boolean | undefined
          readonly digests?: boolean | undefined
        }
      | undefined
  ) => Promise<ReadonlyArray<MobySchemas.ImageSummary>>
  search: (options: {
    readonly term: string
    readonly limit?: number | undefined
    readonly stars?: number | undefined
    readonly "is-official"?: boolean | undefined
  }) => Promise<ReadonlyArray<MobySchemas.RegistrySearchResponse>>
  version: () => Promise<Readonly<MobySchemas.SystemVersionResponse>>
  info: () => Promise<Readonly<MobySchemas.SystemInfoResponse>>
  ping: () => Promise<"OK">
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
