---
title: Callbacks.ts
nav_order: 1
parent: Modules
---

## Callbacks overview

Docker engine callbacks api

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Callbacks](#callbacks)
  - [callbackClient](#callbackclient)

---

# Callbacks

## callbackClient

Create a callback client for the docker engine

**Signature**

```ts
export declare const callbackClient: <E>(
  layer: Layer.Layer<
    Layer.Layer.Success<DockerEngine.DockerLayer>,
    E | Layer.Layer.Error<DockerEngine.DockerLayer>,
    Layer.Layer.Context<DockerEngine.DockerLayer>
  >
) => Promise<{
  pull: (a: { image: string; auth?: string | undefined; platform?: string | undefined }) => ReadableStream<JSONMessage>
  build: <E1>(a: {
    tag: string
    auth?: string | undefined
    platform?: string | undefined
    dockerfile?: string | undefined
    context: Stream.Stream<Uint8Array, E1, never>
    buildArgs?: Record<string, string | undefined> | undefined
  }) => ReadableStream<JSONMessage>
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
        readonly Env?: readonly string[] | null | undefined
        readonly Cmd?: readonly string[] | null | undefined
        readonly Healthcheck?:
          | {
              readonly Test?: readonly string[] | null | undefined
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
        readonly Entrypoint?: readonly string[] | null | undefined
        readonly NetworkDisabled?: boolean | null | undefined
        readonly MacAddress?: string | null | undefined
        readonly OnBuild?: readonly string[] | null | undefined
        readonly Labels?: { readonly [x: string]: string } | null | undefined
        readonly StopSignal?: string | null | undefined
        readonly StopTimeout?: number | null | undefined
        readonly Shell?: readonly string[] | null | undefined
        readonly HostConfig?:
          | {
              readonly Binds?: readonly string[] | null | undefined
              readonly ContainerIDFile?: string | null | undefined
              readonly LogConfig?:
                | { readonly Type: string; readonly Config: { readonly [x: string]: string } | null }
                | null
                | undefined
              readonly NetworkMode?: "none" | "default" | "host" | "bridge" | "nat" | null | undefined
              readonly PortBindings?:
                | {
                    readonly [x: `${number}`]: readonly {
                      readonly HostPort: string
                      readonly HostIp?: string | null | undefined
                    }[]
                    readonly [x: `${number}/tcp`]: readonly {
                      readonly HostPort: string
                      readonly HostIp?: string | null | undefined
                    }[]
                    readonly [x: `${number}/udp`]: readonly {
                      readonly HostPort: string
                      readonly HostIp?: string | null | undefined
                    }[]
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
              readonly VolumesFrom?: readonly string[] | null | undefined
              readonly ConsoleSize?: readonly number[] | null | undefined
              readonly Annotations?: { readonly [x: string]: string } | null | undefined
              readonly CapAdd?: readonly string[] | null | undefined
              readonly CapDrop?: readonly string[] | null | undefined
              readonly CgroupnsMode?: "" | "host" | "private" | null | undefined
              readonly Dns?: readonly string[] | null | undefined
              readonly DnsOptions?: readonly string[] | null | undefined
              readonly DnsSearch?: readonly string[] | null | undefined
              readonly ExtraHosts?: readonly string[] | null | undefined
              readonly GroupAdd?: readonly string[] | null | undefined
              readonly IpcMode?: "none" | "host" | "private" | "container" | "shareable" | null | undefined
              readonly Cgroup?: string | null | undefined
              readonly Links?: readonly string[] | null | undefined
              readonly OomScoreAdj?: number | null | undefined
              readonly PidMode?: string | null | undefined
              readonly Privileged?: boolean | null | undefined
              readonly PublishAllPorts?: boolean | null | undefined
              readonly ReadonlyRootfs?: boolean | null | undefined
              readonly SecurityOpt?: readonly string[] | null | undefined
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
                | readonly ({ readonly Path: string; readonly Weight: number } | null)[]
                | null
                | undefined
              readonly BlkioDeviceReadBps?:
                | readonly ({ readonly Path: string; readonly Rate: number } | null)[]
                | null
                | undefined
              readonly BlkioDeviceWriteBps?:
                | readonly ({ readonly Path: string; readonly Rate: number } | null)[]
                | null
                | undefined
              readonly BlkioDeviceReadIOps?:
                | readonly ({ readonly Path: string; readonly Rate: number } | null)[]
                | null
                | undefined
              readonly BlkioDeviceWriteIOps?:
                | readonly ({ readonly Path: string; readonly Rate: number } | null)[]
                | null
                | undefined
              readonly CpuPeriod?: number | null | undefined
              readonly CpuQuota?: number | null | undefined
              readonly CpuRealtimePeriod?: number | null | undefined
              readonly CpuRealtimeRuntime?: number | null | undefined
              readonly CpusetCpus?: string | null | undefined
              readonly CpusetMems?: string | null | undefined
              readonly Devices?:
                | readonly ({
                    readonly PathOnHost: string
                    readonly PathInContainer: string
                    readonly CgroupPermissions: string
                  } | null)[]
                | null
                | undefined
              readonly DeviceCgroupRules?: readonly string[] | null | undefined
              readonly DeviceRequests?:
                | readonly ({
                    readonly Driver: string
                    readonly Count: number
                    readonly DeviceIDs: readonly string[] | null
                    readonly Capabilities: readonly (readonly string[] | null)[] | null
                    readonly Options: { readonly [x: string]: string } | null
                  } | null)[]
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
                | readonly ({ readonly Name: string; readonly Hard: number; readonly Soft: number } | null)[]
                | null
                | undefined
              readonly CpuCount?: number | null | undefined
              readonly CpuPercent?: number | null | undefined
              readonly IOMaximumIOps?: number | null | undefined
              readonly IOMaximumBandwidth?: number | null | undefined
              readonly Mounts?:
                | readonly ({
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
                          readonly Options?: readonly (readonly string[] | null)[] | null | undefined
                          readonly SizeBytes?: number | undefined
                          readonly Mode?: number | undefined
                        }
                      | null
                      | undefined
                    readonly ClusterOptions?: {} | null | undefined
                  } | null)[]
                | null
                | undefined
              readonly MaskedPaths?: readonly string[] | null | undefined
              readonly ReadonlyPaths?: readonly string[] | null | undefined
              readonly Init?: boolean | null | undefined
            }
          | null
          | undefined
        readonly NetworkingConfig?:
          | {
              readonly EndpointsConfig: {
                readonly [x: string]: {
                  readonly MacAddress: string
                  readonly Links: readonly string[] | null
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
                    readonly LinkLocalIPs?: readonly string[] | null | undefined
                  } | null
                  readonly Aliases: readonly string[] | null
                  readonly DriverOpts: { readonly [x: string]: string } | null
                  readonly IPAddress: string
                  readonly DNSNames: readonly string[] | null
                } | null
              } | null
            }
          | null
          | undefined
      }
    },
    callback: (exit: Exit.Exit<ContainerInspectResponse, ContainersError>) => void
  ) => void
  exec: (
    z: { containerId: string; command: Array<string> },
    callback: (exit: Exit.Exit<string, ExecsError | SocketError | ParseError>) => void
  ) => void
  execNonBlocking: (
    z: { containerId: string; command: Array<string> },
    callback: (exit: Exit.Exit<void, ExecsError | SocketError | ParseError>) => void
  ) => void
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
    callback: (exit: Exit.Exit<readonly ContainerListResponseItem[], ContainersError>) => void
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
    callback: (exit: Exit.Exit<readonly ImageSummary[], ImagesError>) => void
  ) => void
  search: (
    z: {
      readonly term: string
      readonly limit?: number | undefined
      readonly stars?: number | undefined
      readonly "is-official"?: boolean | undefined
    },
    callback: (exit: Exit.Exit<readonly RegistrySearchResponse[], ImagesError>) => void
  ) => void
  version: (callback: (exit: Exit.Exit<Readonly<SystemVersionResponse>, SystemsError>) => void) => void
  info: (callback: (exit: Exit.Exit<Readonly<SystemInfoResponse>, SystemsError>) => void) => void
  ping: (callback: (exit: Exit.Exit<"OK", SystemsError>) => void) => void
  pingHead: (callback: (exit: Exit.Exit<void, SystemsError>) => void) => void
}>
```

Added in v1.0.0
