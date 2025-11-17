---
title: MobyEndpoints.ts
nav_order: 9
parent: Modules
---

## MobyEndpoints.ts overview

Moby endpoints.

Since v1.0.0

---

## Exports Grouped by Category

- [HttpApi](#httpapi)
  - [ConfigsApi](#configsapi)
  - [ContainersApi](#containersapi)
  - [DistributionsApi](#distributionsapi)
  - [ExecsApi](#execsapi)
  - [ImagesApi](#imagesapi)
  - [NetworksApi](#networksapi)
  - [NodesApi](#nodesapi)
  - [PluginsApi](#pluginsapi)
  - [SecretsApi](#secretsapi)
  - [ServicesApi](#servicesapi)
  - [SessionApi](#sessionapi)
  - [SwarmApi](#swarmapi)
  - [SystemApi](#systemapi)
  - [TasksApi](#tasksapi)
  - [VolumesApi](#volumesapi)
- [Layers](#layers)
  - [ConfigsLayer](#configslayer)
  - [ConfigsLayerLocalSocket](#configslayerlocalsocket)
  - [ContainersLayer](#containerslayer)
  - [ContainersLayerLocalSocket](#containerslayerlocalsocket)
  - [DistributionsLayer](#distributionslayer)
  - [DistributionsLayerLocalSocket](#distributionslayerlocalsocket)
  - [ExecsLayer](#execslayer)
  - [ExecsLayerLocalSocket](#execslayerlocalsocket)
  - [ImagesLayer](#imageslayer)
  - [ImagesLayerLocalSocket](#imageslayerlocalsocket)
  - [NetworksLayer](#networkslayer)
  - [NetworksLayerLocalSocket](#networkslayerlocalsocket)
  - [NodesLayer](#nodeslayer)
  - [NodesLayerLocalSocket](#nodeslayerlocalsocket)
  - [PluginsLayer](#pluginslayer)
  - [PluginsLayerLocalSocket](#pluginslayerlocalsocket)
  - [SecretsLayer](#secretslayer)
  - [SecretsLayerLocalSocket](#secretslayerlocalsocket)
  - [ServicesLayer](#serviceslayer)
  - [ServicesLayerLocalSocket](#serviceslayerlocalsocket)
  - [SessionsLayer](#sessionslayer)
  - [SessionsLayerLocalSocket](#sessionslayerlocalsocket)
  - [SwarmLayer](#swarmlayer)
  - [SwarmLayerLocalSocket](#swarmlayerlocalsocket)
  - [SystemLayer](#systemlayer)
  - [SystemLayerLocalSocket](#systemlayerlocalsocket)
  - [TasksLayer](#taskslayer)
  - [TasksLayerLocalSocket](#taskslayerlocalsocket)
  - [VolumesLayer](#volumeslayer)
  - [VolumesLayerLocalSocket](#volumeslayerlocalsocket)
- [Services](#services)
  - [Configs](#configs)
  - [Containers](#containers)
  - [Distributions](#distributions)
  - [Execs](#execs)
  - [Images](#images)
  - [Networks](#networks)
  - [Nodes](#nodes)
  - [Plugins](#plugins)
  - [Secrets](#secrets)
  - [Services](#services-1)
  - [Sessions](#sessions)
  - [Swarm](#swarm)
  - [System](#system)
  - [Tasks](#tasks)
  - [Volumes](#volumes)

---

# HttpApi

## ConfigsApi

Configs are application configurations that can be used by services.
Swarm mode must be enabled for these endpoints to work.

**See**

- https://docs.docker.com/reference/api/engine/latest/#tag/Config

**Signature**

```ts
declare const ConfigsApi: HttpApi<
  "ConfigsApi",
  HttpApiGroup<
    "configs",
    | HttpApiEndpoint<
        "list",
        "GET",
        never,
        {
          readonly filters?:
            | {
                readonly name?: ReadonlyArray<string> | undefined
                readonly label?: ReadonlyArray<string> | undefined
                readonly names?: ReadonlyArray<string> | undefined
                readonly id?: ReadonlyArray<string & Brand<"ConfigId">> | undefined
              }
            | undefined
        },
        never,
        never,
        ReadonlyArray<SwarmConfig>,
        never,
        never,
        never
      >
    | HttpApiEndpoint<
        "create",
        "POST",
        never,
        never,
        SwarmConfigSpec,
        never,
        { readonly Id: string & Brand<"ConfigId"> },
        Conflict,
        never,
        never
      >
    | HttpApiEndpoint<
        "inspect",
        "GET",
        { readonly identifier: string & Brand<"ConfigId"> },
        never,
        never,
        never,
        SwarmConfig,
        NotFound,
        never,
        never
      >
    | HttpApiEndpoint<
        "delete",
        "DELETE",
        { readonly identifier: string & Brand<"ConfigId"> },
        never,
        never,
        never,
        void,
        NotFound,
        never,
        never
      >
    | HttpApiEndpoint<
        "update",
        "POST",
        { readonly identifier: string & Brand<"ConfigId"> },
        { readonly version: bigint },
        SwarmConfigSpec,
        never,
        void,
        BadRequest | NotFound,
        never,
        never
      >,
    InternalServerError | NodeNotPartOfSwarm,
    never,
    false
  >,
  HttpApiDecodeError,
  never
>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyEndpoints.ts#L26)

Since v1.0.0

## ContainersApi

**See**

- https://docs.docker.com/reference/api/engine/latest/#tag/Container

**Signature**

```ts
declare const ContainersApi: HttpApi<
  "ContainersApi",
  HttpApiGroup<
    "containers",
    | HttpApiEndpoint<
        "list",
        "GET",
        never,
        {
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
        },
        never,
        never,
        ReadonlyArray<ContainerSummary>,
        BadRequest,
        never,
        never
      >
    | HttpApiEndpoint<
        "create",
        "POST",
        never,
        { readonly name?: string | undefined; readonly platform?: string | undefined },
        ContainerCreateRequest,
        never,
        { readonly Id: string & Brand<"ContainerId">; readonly Warnings: ReadonlyArray<string> | null },
        BadRequest | Forbidden | NotFound | NotAcceptable | Conflict,
        never,
        never
      >
    | HttpApiEndpoint<
        "inspect",
        "GET",
        { readonly identifier: string & Brand<"ContainerId"> },
        { readonly size?: boolean | undefined },
        never,
        never,
        ContainerInspectResponse,
        NotFound,
        never,
        never
      >
    | HttpApiEndpoint<
        "top",
        "GET",
        { readonly identifier: string & Brand<"ContainerId"> },
        { readonly ps_args?: string | undefined },
        never,
        never,
        ContainerTopResponse,
        NotFound,
        never,
        never
      >
    | HttpApiEndpoint<
        "logs",
        "GET",
        { readonly identifier: string & Brand<"ContainerId"> },
        {
          readonly since?: number | undefined
          readonly follow?: boolean | undefined
          readonly stdout?: boolean | undefined
          readonly stderr?: boolean | undefined
          readonly until?: number | undefined
          readonly timestamps?: boolean | undefined
          readonly tail?: string | undefined
        },
        never,
        never,
        void,
        NotFound,
        never,
        never
      >
    | HttpApiEndpoint<
        "changes",
        "GET",
        { readonly identifier: string & Brand<"ContainerId"> },
        never,
        never,
        never,
        ReadonlyArray<ArchiveChange> | null,
        NotFound,
        never,
        never
      >
    | HttpApiEndpoint<
        "export",
        "GET",
        { readonly identifier: string & Brand<"ContainerId"> },
        never,
        never,
        never,
        void,
        NotFound,
        never,
        never
      >
    | HttpApiEndpoint<
        "stats",
        "GET",
        { readonly identifier: string & Brand<"ContainerId"> },
        { readonly stream?: boolean | undefined; readonly "one-shot"?: boolean | undefined },
        never,
        never,
        void,
        NotFound,
        never,
        never
      >
    | HttpApiEndpoint<
        "resize",
        "POST",
        { readonly identifier: string & Brand<"ContainerId"> },
        { readonly h?: number | undefined; readonly w?: number | undefined },
        never,
        never,
        void,
        NotFound,
        never,
        never
      >
    | HttpApiEndpoint<
        "start",
        "POST",
        { readonly identifier: string & Brand<"ContainerId"> },
        { readonly detachKeys?: string | undefined },
        never,
        never,
        void,
        NotFound,
        never,
        never
      >
    | HttpApiEndpoint<
        "stop",
        "POST",
        { readonly identifier: string & Brand<"ContainerId"> },
        { readonly signal?: string | undefined; readonly t?: number | undefined },
        never,
        never,
        void,
        NotFound,
        never,
        never
      >
    | HttpApiEndpoint<
        "restart",
        "POST",
        { readonly identifier: string & Brand<"ContainerId"> },
        { readonly signal?: string | undefined; readonly t?: number | undefined },
        never,
        never,
        void,
        NotFound,
        never,
        never
      >
    | HttpApiEndpoint<
        "kill",
        "POST",
        { readonly identifier: string & Brand<"ContainerId"> },
        { readonly signal?: string | undefined },
        never,
        never,
        void,
        NotFound | Conflict,
        never,
        never
      >
    | HttpApiEndpoint<
        "update",
        "POST",
        { readonly identifier: string & Brand<"ContainerId"> },
        never,
        ContainerConfig,
        never,
        { readonly Warnings: ReadonlyArray<string> | null },
        NotFound,
        never,
        never
      >
    | HttpApiEndpoint<
        "rename",
        "POST",
        { readonly identifier: string & Brand<"ContainerId"> },
        { readonly name: string },
        never,
        never,
        void,
        NotFound | Conflict,
        never,
        never
      >
    | HttpApiEndpoint<
        "pause",
        "POST",
        { readonly identifier: string & Brand<"ContainerId"> },
        never,
        never,
        never,
        void,
        NotFound,
        never,
        never
      >
    | HttpApiEndpoint<
        "unpause",
        "POST",
        { readonly identifier: string & Brand<"ContainerId"> },
        never,
        never,
        never,
        void,
        NotFound,
        never,
        never
      >
    | HttpApiEndpoint<
        "attach",
        "POST",
        { readonly identifier: string & Brand<"ContainerId"> },
        {
          readonly logs?: boolean | undefined
          readonly stdout?: boolean | undefined
          readonly stderr?: boolean | undefined
          readonly stream?: boolean | undefined
          readonly detachKeys?: string | undefined
          readonly stdin?: boolean | undefined
        },
        never,
        never,
        void,
        BadRequest | NotFound,
        never,
        never
      >
    | HttpApiEndpoint<
        "attachWebsocket",
        "GET",
        { readonly identifier: string & Brand<"ContainerId"> },
        {
          readonly logs?: boolean | undefined
          readonly stdout?: boolean | undefined
          readonly stderr?: boolean | undefined
          readonly stream?: boolean | undefined
          readonly detachKeys?: string | undefined
          readonly stdin?: boolean | undefined
        },
        never,
        never,
        void,
        BadRequest | NotFound,
        never,
        never
      >
    | HttpApiEndpoint<
        "wait",
        "POST",
        { readonly identifier: string & Brand<"ContainerId"> },
        { readonly condition?: string | undefined },
        never,
        never,
        ContainerWaitResponse,
        BadRequest | NotFound,
        never,
        never
      >
    | HttpApiEndpoint<
        "delete",
        "DELETE",
        { readonly identifier: string & Brand<"ContainerId"> },
        { readonly link?: boolean | undefined; readonly v?: boolean | undefined; readonly force?: boolean | undefined },
        never,
        never,
        void,
        BadRequest | NotFound | Conflict,
        never,
        never
      >
    | HttpApiEndpoint<
        "archive",
        "GET",
        { readonly identifier: string & Brand<"ContainerId"> },
        { readonly path: string },
        never,
        never,
        void,
        BadRequest | NotFound,
        never,
        never
      >
    | HttpApiEndpoint<
        "archiveInfo",
        "HEAD",
        { readonly identifier: string & Brand<"ContainerId"> },
        { readonly path: string },
        never,
        never,
        void,
        BadRequest | NotFound,
        never,
        never
      >
    | HttpApiEndpoint<
        "putArchive",
        "PUT",
        { readonly identifier: string & Brand<"ContainerId"> },
        {
          readonly path: string
          readonly noOverwriteDirNonDir?: string | undefined
          readonly copyUIDGidentifier?: string | undefined
        },
        never,
        never,
        void,
        BadRequest | Forbidden | NotFound,
        never,
        never
      >
    | HttpApiEndpoint<
        "prune",
        "POST",
        never,
        {
          readonly filters?:
            | { readonly label?: ReadonlyArray<string> | undefined; readonly until?: string | undefined }
            | undefined
        },
        never,
        never,
        {
          readonly ContainersDeleted: ReadonlyArray<string & Brand<"ContainerId">> | null
          readonly SpaceReclaimed: bigint & Brand<"I64">
        },
        never,
        never,
        never
      >,
    InternalServerError,
    never,
    false
  >,
  HttpApiDecodeError,
  never
>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyEndpoints.ts#L62)

Since v1.0.0

## DistributionsApi

**See**

- https://docs.docker.com/reference/api/engine/latest/#tag/Distribution

**Signature**

```ts
declare const DistributionsApi: HttpApi<
  "distributions",
  HttpApiGroup<
    "distributions",
    HttpApiEndpoint<
      "inspect",
      "GET",
      { readonly name: string },
      never,
      never,
      never,
      RegistryDistributionInspect,
      NotFound | Unauthorized,
      never,
      never
    >,
    InternalServerError,
    never,
    false
  >,
  HttpApiDecodeError,
  never
>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyEndpoints.ts#L92)

Since v1.0.0

## ExecsApi

**See**

- https://docs.docker.com/reference/api/engine/latest/#tag/Exec

**Signature**

```ts
declare const ExecsApi: HttpApi<
  "ExecsApi",
  HttpApiGroup<
    "exec",
    | HttpApiEndpoint<
        "container",
        "POST",
        { readonly id: string },
        never,
        ContainerExecOptions,
        never,
        { readonly Id: string & Brand<"ExecId"> },
        NotFound | Conflict,
        never,
        never
      >
    | HttpApiEndpoint<
        "start",
        "POST",
        { readonly id: string & Brand<"ExecId"> },
        never,
        ContainerExecStartOptions,
        never,
        void,
        NotFound | Conflict,
        never,
        never
      >
    | HttpApiEndpoint<
        "resize",
        "POST",
        { readonly id: string & Brand<"ExecId"> },
        { readonly h: number; readonly w: number },
        never,
        never,
        void,
        BadRequest | NotFound,
        never,
        never
      >
    | HttpApiEndpoint<
        "inspect",
        "GET",
        { readonly id: string & Brand<"ExecId"> },
        never,
        never,
        never,
        ContainerExecInspect,
        NotFound,
        never,
        never
      >,
    InternalServerError,
    never,
    false
  >,
  HttpApiDecodeError,
  never
>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyEndpoints.ts#L122)

Since v1.0.0

## ImagesApi

**See**

- https://docs.docker.com/reference/api/engine/latest/#tag/Image

**Signature**

```ts
declare const ImagesApi: HttpApi<
  "ImagesApi",
  HttpApiGroup<
    "images",
    | HttpApiEndpoint<
        "list",
        "GET",
        never,
        {
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
        },
        never,
        never,
        ReadonlyArray<ImageSummary>,
        never,
        never,
        never
      >
    | HttpApiEndpoint<
        "build",
        "POST",
        never,
        {
          readonly version?: "1" | undefined
          readonly platform?: string | undefined
          readonly t?: string | undefined
          readonly dockerfile?: string | undefined
          readonly extrahosts?: string | undefined
          readonly remote?: string | undefined
          readonly q?: boolean | undefined
          readonly nocache?: boolean | undefined
          readonly cachefrom?: string | undefined
          readonly pull?: string | undefined
          readonly rm?: boolean | undefined
          readonly forcerm?: boolean | undefined
          readonly memory?: number | undefined
          readonly memswap?: number | undefined
          readonly cpushares?: number | undefined
          readonly cpusetcpus?: string | undefined
          readonly cpuperiod?: number | undefined
          readonly cpuquota?: number | undefined
          readonly buildargs?: { readonly [x: string]: string | null | undefined } | undefined
          readonly shmsize?: number | undefined
          readonly squash?: boolean | undefined
          readonly labels?: string | undefined
          readonly networkmode?: string | undefined
          readonly target?: string | undefined
          readonly outputs?: string | undefined
        },
        never,
        { readonly "Content-type"?: string | undefined; readonly "X-Registry-Config"?: string | undefined },
        void,
        BadRequest,
        never,
        never
      >
    | HttpApiEndpoint<
        "buildPrune",
        "POST",
        never,
        {
          readonly all?: boolean | undefined
          readonly filters?: string | undefined
          readonly "keep-storage"?: number | undefined
        },
        never,
        never,
        { readonly SpaceReclaimed: number; readonly CachesDeleted: ReadonlyArray<string> },
        never,
        never,
        never
      >
    | HttpApiEndpoint<
        "create",
        "POST",
        never,
        {
          readonly changes?: string | undefined
          readonly platform?: string | undefined
          readonly tag?: string | undefined
          readonly fromImage?: string | undefined
          readonly fromSrc?: string | undefined
          readonly repo?: string | undefined
          readonly message?: string | undefined
        },
        never,
        { readonly "X-Registry-Auth"?: string | undefined },
        void,
        NotFound,
        never,
        never
      >
    | HttpApiEndpoint<
        "inspect",
        "GET",
        { readonly name: string },
        { readonly manifests?: boolean | undefined },
        never,
        never,
        ImageInspectResponse,
        NotFound,
        never,
        never
      >
    | HttpApiEndpoint<
        "history",
        "GET",
        { readonly name: string },
        { readonly platform?: string | undefined },
        never,
        never,
        ReadonlyArray<ImageHistoryResponseItem>,
        NotFound,
        never,
        never
      >
    | HttpApiEndpoint<
        "push",
        "POST",
        { readonly name: string },
        { readonly platform?: string | undefined; readonly tag?: string | undefined },
        never,
        { readonly "X-Registry-Auth"?: string | undefined },
        void,
        NotFound,
        never,
        never
      >
    | HttpApiEndpoint<
        "tag",
        "POST",
        { readonly name: string },
        { readonly tag?: string | undefined; readonly repo?: string | undefined },
        never,
        never,
        void,
        BadRequest | NotFound | Conflict,
        never,
        never
      >
    | HttpApiEndpoint<
        "delete",
        "DELETE",
        { readonly name: string },
        {
          readonly force?: boolean | undefined
          readonly noprune?: boolean | undefined
          readonly platforms?: ReadonlyArray<string> | undefined
        },
        never,
        never,
        ReadonlyArray<ImageDeleteResponse>,
        NotFound | Conflict,
        never,
        never
      >
    | HttpApiEndpoint<
        "search",
        "GET",
        never,
        {
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
        never,
        never,
        ReadonlyArray<RegistrySearchResult>,
        never,
        never,
        never
      >
    | HttpApiEndpoint<
        "prune",
        "POST",
        never,
        { readonly filters?: string | undefined },
        never,
        never,
        {
          readonly SpaceReclaimed: number
          readonly ImagesDeleted: ReadonlyArray<ImageDeleteResponse> | null | undefined
        },
        never,
        never,
        never
      >
    | HttpApiEndpoint<
        "commit",
        "POST",
        never,
        {
          readonly container: string
          readonly changes?: string | undefined
          readonly pause?: boolean | undefined
          readonly tag?: string | undefined
          readonly repo?: string | undefined
          readonly comment?: string | undefined
          readonly author?: string | undefined
        },
        ContainerCreateRequest,
        never,
        ImageInspectResponse,
        NotFound,
        never,
        never
      >
    | HttpApiEndpoint<
        "export",
        "GET",
        { readonly name: string },
        { readonly platform?: string | undefined },
        never,
        never,
        void,
        NotFound,
        never,
        never
      >
    | HttpApiEndpoint<
        "exportMany",
        "GET",
        never,
        { readonly platform?: string | undefined },
        never,
        never,
        void,
        NotFound,
        never,
        never
      >
    | HttpApiEndpoint<
        "import",
        "POST",
        never,
        { readonly platform?: string | undefined; readonly quiet?: boolean | undefined },
        never,
        never,
        void,
        BadRequest,
        never,
        never
      >,
    InternalServerError,
    never,
    false
  >,
  HttpApiDecodeError,
  never
>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyEndpoints.ts#L152)

Since v1.0.0

## NetworksApi

**See**

- https://docs.docker.com/reference/api/engine/latest/#tag/Network

**Signature**

```ts
declare const NetworksApi: HttpApi<
  "NetworksApi",
  HttpApiGroup<
    "networks",
    | HttpApiEndpoint<
        "list",
        "GET",
        never,
        {
          readonly filters?:
            | {
                readonly name?: ReadonlyArray<string> | undefined
                readonly label?: ReadonlyArray<string> | undefined
                readonly dangling?: boolean | undefined
                readonly id?: ReadonlyArray<string> | undefined
                readonly driver?: ReadonlyArray<string> | undefined
                readonly scope?: ReadonlyArray<string> | undefined
                readonly type?: "custom" | "builtin" | undefined
              }
            | undefined
        },
        never,
        never,
        ReadonlyArray<NetworkInspect>,
        never,
        never,
        never
      >
    | HttpApiEndpoint<
        "create",
        "POST",
        never,
        never,
        NetworkCreateRequest,
        never,
        { readonly Id: string & Brand<"NetworkId"> },
        BadRequest | Forbidden | NotFound,
        never,
        never
      >
    | HttpApiEndpoint<
        "inspect",
        "GET",
        { readonly id: string },
        { readonly scope?: string | undefined; readonly verbose?: boolean | undefined },
        never,
        never,
        NetworkInspect,
        NotFound,
        never,
        never
      >
    | HttpApiEndpoint<
        "delete",
        "DELETE",
        { readonly id: string },
        never,
        never,
        never,
        void,
        Forbidden | NotFound,
        never,
        never
      >
    | HttpApiEndpoint<
        "connect",
        "POST",
        { readonly id: string },
        never,
        NetworkConnectOptions,
        never,
        void,
        BadRequest | Forbidden | NotFound,
        never,
        never
      >
    | HttpApiEndpoint<
        "disconnect",
        "POST",
        { readonly id: string },
        never,
        { readonly Container: string & Brand<"ContainerId">; readonly Force: boolean },
        never,
        void,
        Forbidden | NotFound,
        never,
        never
      >
    | HttpApiEndpoint<
        "prune",
        "POST",
        never,
        {
          readonly filters?:
            | { readonly label?: ReadonlyArray<string> | undefined; readonly until?: string | undefined }
            | undefined
        },
        never,
        never,
        { readonly NetworksDeleted: ReadonlyArray<string> | null | undefined },
        never,
        never,
        never
      >,
    InternalServerError,
    never,
    false
  >,
  HttpApiDecodeError,
  never
>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyEndpoints.ts#L182)

Since v1.0.0

## NodesApi

**See**

- https://docs.docker.com/reference/api/engine/latest/#tag/Node

**Signature**

```ts
declare const NodesApi: HttpApi<
  "NodesApi",
  HttpApiGroup<
    "nodes",
    | HttpApiEndpoint<
        "list",
        "GET",
        never,
        {
          readonly filters?:
            | {
                readonly name?: ReadonlyArray<string> | undefined
                readonly label?: ReadonlyArray<string> | undefined
                readonly id?: ReadonlyArray<string> | undefined
                readonly membership?: ReadonlyArray<"accepted" | "pending"> | undefined
                readonly "node.label"?: ReadonlyArray<string> | undefined
                readonly role?: ReadonlyArray<"manager" | "worker"> | undefined
              }
            | undefined
        },
        never,
        never,
        ReadonlyArray<SwarmNode>,
        NodeNotPartOfSwarm,
        never,
        never
      >
    | HttpApiEndpoint<
        "inspect",
        "GET",
        { readonly id: string },
        never,
        never,
        never,
        SwarmNode,
        NotFound | NodeNotPartOfSwarm,
        never,
        never
      >
    | HttpApiEndpoint<
        "delete",
        "DELETE",
        { readonly id: string },
        { readonly force?: boolean | undefined },
        never,
        never,
        void,
        NotFound | NodeNotPartOfSwarm,
        never,
        never
      >
    | HttpApiEndpoint<
        "update",
        "POST",
        { readonly id: string },
        { readonly version: number },
        SwarmNodeSpec,
        never,
        void,
        BadRequest | NotFound | NodeNotPartOfSwarm,
        never,
        never
      >,
    InternalServerError,
    never,
    false
  >,
  HttpApiDecodeError,
  never
>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyEndpoints.ts#L212)

Since v1.0.0

## PluginsApi

**See**

- https://docs.docker.com/reference/api/engine/latest/#tag/Plugin

**Signature**

```ts
declare const PluginsApi: HttpApi<
  "PluginsApi",
  HttpApiGroup<
    "plugins",
    | HttpApiEndpoint<
        "list",
        "GET",
        never,
        {
          readonly filters?:
            | { readonly capability?: ReadonlyArray<string> | undefined; readonly enabled?: boolean | undefined }
            | undefined
        },
        never,
        never,
        ReadonlyArray<TypesPlugin>,
        never,
        never,
        never
      >
    | HttpApiEndpoint<
        "getPrivileges",
        "GET",
        never,
        { readonly remote: string },
        never,
        never,
        ReadonlyArray<RuntimePluginPrivilege>,
        never,
        never,
        never
      >
    | HttpApiEndpoint<
        "pull",
        "POST",
        never,
        { readonly name?: string | undefined; readonly remote: string },
        ReadonlyArray<RuntimePluginPrivilege>,
        { readonly "X-Registry-Auth"?: string | undefined },
        void,
        never,
        never,
        never
      >
    | HttpApiEndpoint<
        "inspect",
        "GET",
        { readonly name: string },
        never,
        never,
        never,
        TypesPlugin,
        NotFound,
        never,
        never
      >
    | HttpApiEndpoint<
        "delete",
        "DELETE",
        { readonly name: string },
        { readonly force?: boolean | undefined },
        never,
        never,
        void,
        NotFound,
        never,
        never
      >
    | HttpApiEndpoint<
        "enable",
        "POST",
        { readonly name: string },
        { readonly timeout?: number | undefined },
        never,
        never,
        void,
        NotFound,
        never,
        never
      >
    | HttpApiEndpoint<
        "disable",
        "POST",
        { readonly name: string },
        { readonly force?: boolean | undefined },
        never,
        never,
        void,
        NotFound,
        never,
        never
      >
    | HttpApiEndpoint<
        "upgrade",
        "POST",
        { readonly name: string },
        { readonly remote: string },
        ReadonlyArray<RuntimePluginPrivilege>,
        { readonly "X-Registry-Auth"?: string | undefined },
        void,
        NotFound,
        never,
        never
      >
    | HttpApiEndpoint<"create", "POST", never, { readonly name: string }, never, never, void, never, never, never>
    | HttpApiEndpoint<"push", "POST", { readonly name: string }, never, never, never, void, NotFound, never, never>
    | HttpApiEndpoint<
        "set",
        "POST",
        { readonly name: string },
        never,
        ReadonlyArray<string>,
        never,
        void,
        NotFound,
        never,
        never
      >,
    InternalServerError,
    never,
    false
  >,
  HttpApiDecodeError,
  never
>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyEndpoints.ts#L242)

Since v1.0.0

## SecretsApi

Secrets are sensitive data that can be used by services. Swarm mode must
be enabled for these endpoints to work.

**See**

- https://docs.docker.com/reference/api/engine/latest/#tag/Secret

**Signature**

```ts
declare const SecretsApi: HttpApi<
  "SecretsApi",
  HttpApiGroup<
    "secrets",
    | HttpApiEndpoint<
        "list",
        "GET",
        never,
        {
          readonly filters?:
            | {
                readonly name?: ReadonlyArray<string> | undefined
                readonly label?: ReadonlyArray<string> | undefined
                readonly id?: ReadonlyArray<string> | undefined
              }
            | undefined
        },
        never,
        never,
        ReadonlyArray<SwarmSecret>,
        NodeNotPartOfSwarm,
        never,
        never
      >
    | HttpApiEndpoint<
        "create",
        "POST",
        never,
        never,
        SwarmSecretSpec,
        never,
        { readonly Id: string & Brand<"SecretId"> },
        Conflict | NodeNotPartOfSwarm,
        never,
        never
      >
    | HttpApiEndpoint<
        "inspect",
        "GET",
        { readonly id: string },
        never,
        never,
        never,
        SwarmSecret,
        NotFound | NodeNotPartOfSwarm,
        never,
        never
      >
    | HttpApiEndpoint<
        "delete",
        "DELETE",
        { readonly id: string },
        never,
        never,
        never,
        void,
        NotFound | NodeNotPartOfSwarm,
        never,
        never
      >
    | HttpApiEndpoint<
        "update",
        "POST",
        { readonly id: string },
        { readonly version: bigint },
        SwarmSecretSpec,
        never,
        void,
        BadRequest | NotFound | NodeNotPartOfSwarm,
        never,
        never
      >,
    InternalServerError,
    never,
    false
  >,
  HttpApiDecodeError,
  never
>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyEndpoints.ts#L278)

Since v1.0.0

## ServicesApi

Services are the definitions of tasks to run on a swarm. Swarm mode must
be enabled for these endpoints to work.

**See**

- https://docs.docker.com/reference/api/engine/latest/#tag/Service

**Signature**

```ts
declare const ServicesApi: HttpApi<
  "ServicesApi",
  HttpApiGroup<
    "services",
    | HttpApiEndpoint<
        "list",
        "GET",
        never,
        {
          readonly status?: boolean | undefined
          readonly filters?:
            | {
                readonly label?: ReadonlyArray<string> | undefined
                readonly id?: ReadonlyArray<string> | undefined
                readonly mode?: ReadonlyArray<"replicated" | "global"> | undefined
              }
            | undefined
        },
        never,
        never,
        ReadonlyArray<SwarmService>,
        NodeNotPartOfSwarm,
        never,
        never
      >
    | HttpApiEndpoint<
        "create",
        "POST",
        never,
        never,
        SwarmServiceSpec,
        { readonly "X-Registry-Auth"?: string | undefined },
        { readonly Warnings?: ReadonlyArray<string> | undefined; readonly ID: string & Brand<"ServiceId"> },
        BadRequest | Forbidden | Conflict | NodeNotPartOfSwarm,
        never,
        never
      >
    | HttpApiEndpoint<
        "delete",
        "DELETE",
        { readonly id: string },
        never,
        never,
        never,
        void,
        NotFound | NodeNotPartOfSwarm,
        never,
        never
      >
    | HttpApiEndpoint<
        "inspect",
        "GET",
        { readonly id: string },
        { readonly insertDefaults?: boolean | undefined },
        never,
        never,
        SwarmService,
        NotFound | NodeNotPartOfSwarm,
        never,
        never
      >
    | HttpApiEndpoint<
        "update",
        "POST",
        { readonly id: string },
        {
          readonly version: number
          readonly rollback?: string | undefined
          readonly registryAuthFrom?: string | undefined
        },
        SwarmServiceSpec,
        { readonly "X-Registry-Auth"?: string | undefined },
        { readonly Warnings?: ReadonlyArray<string> | undefined },
        BadRequest | NotFound | NodeNotPartOfSwarm,
        never,
        never
      >
    | HttpApiEndpoint<
        "logs",
        "GET",
        { readonly id: string },
        {
          readonly since?: number | undefined
          readonly follow?: boolean | undefined
          readonly stdout?: boolean | undefined
          readonly stderr?: boolean | undefined
          readonly timestamps?: boolean | undefined
          readonly tail?: string | undefined
          readonly details?: boolean | undefined
        },
        never,
        never,
        void,
        NotFound | NodeNotPartOfSwarm,
        never,
        never
      >,
    InternalServerError,
    never,
    false
  >,
  HttpApiDecodeError,
  never
>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyEndpoints.ts#L320)

Since v1.0.0

## SessionApi

**See**

- https://docs.docker.com/reference/api/engine/latest/#tag/Session

**Signature**

```ts
declare const SessionApi: HttpApi<
  "SessionApi",
  HttpApiGroup<
    "session",
    HttpApiEndpoint<
      "session",
      "POST",
      never,
      never,
      never,
      { readonly Upgrade: "h2c"; readonly Connection: "Upgrade" },
      void,
      never,
      never,
      never
    >,
    never,
    never,
    false
  >,
  HttpApiDecodeError,
  never
>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyEndpoints.ts#L349)

Since v1.0.0

## SwarmApi

Engines can be clustered together in a swarm. Refer to the swarm mode
documentation for more information.

**See**

- https://docs.docker.com/reference/api/engine/latest/#tag/Swarm

**Signature**

```ts
declare const SwarmApi: HttpApi<
  "SwarmApi",
  HttpApiGroup<
    "swarm",
    | HttpApiEndpoint<
        "inspect",
        "GET",
        never,
        never,
        never,
        never,
        SwarmSwarm,
        NotFound | NodeNotPartOfSwarm,
        never,
        never
      >
    | HttpApiEndpoint<
        "init",
        "POST",
        never,
        never,
        SwarmInitRequest,
        never,
        string,
        BadRequest | NodeAlreadyPartOfSwarm,
        never,
        never
      >
    | HttpApiEndpoint<
        "join",
        "POST",
        never,
        never,
        SwarmJoinRequest,
        never,
        void,
        BadRequest | NodeAlreadyPartOfSwarm,
        never,
        never
      >
    | HttpApiEndpoint<
        "leave",
        "POST",
        never,
        { readonly force?: boolean | undefined },
        never,
        never,
        void,
        NodeNotPartOfSwarm,
        never,
        never
      >
    | HttpApiEndpoint<
        "update",
        "POST",
        never,
        {
          readonly version: bigint
          readonly rotateWorkerToken?: boolean | undefined
          readonly rotateManagerToken?: boolean | undefined
          readonly rotateManagerUnlockKey?: boolean | undefined
        },
        SwarmSpec,
        never,
        void,
        BadRequest | NodeNotPartOfSwarm,
        never,
        never
      >
    | HttpApiEndpoint<
        "unlockkey",
        "GET",
        never,
        never,
        never,
        never,
        { readonly UnlockKey: string },
        NodeNotPartOfSwarm,
        never,
        never
      >
    | HttpApiEndpoint<
        "unlock",
        "POST",
        never,
        never,
        { readonly UnlockKey: string },
        never,
        void,
        NodeNotPartOfSwarm,
        never,
        never
      >,
    InternalServerError,
    never,
    false
  >,
  HttpApiDecodeError,
  never
>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyEndpoints.ts#L392)

Since v1.0.0

## SystemApi

**See**

- https://docs.docker.com/reference/api/engine/latest/#tag/System

**Signature**

```ts
declare const SystemApi: HttpApi<
  "SystemApi",
  HttpApiGroup<
    "system",
    | HttpApiEndpoint<
        "auth",
        "POST",
        never,
        never,
        RegistryAuthConfig,
        never,
        void | RegistryAuthenticateOKBody,
        Unauthorized,
        never,
        never
      >
    | HttpApiEndpoint<"info", "GET", never, never, never, never, SystemInfo, never, never, never>
    | HttpApiEndpoint<"version", "GET", never, never, never, never, TypesVersion, never, never, never>
    | HttpApiEndpoint<"ping", "GET", never, never, never, never, "OK", never, never, never>
    | HttpApiEndpoint<"pingHead", "HEAD", never, never, never, never, void, never, never, never>
    | HttpApiEndpoint<
        "events",
        "GET",
        never,
        { readonly since?: string | undefined; readonly until?: string | undefined },
        never,
        never,
        void,
        BadRequest,
        never,
        never
      >
    | HttpApiEndpoint<
        "dataUsage",
        "GET",
        never,
        { readonly type?: ReadonlyArray<"container" | "volume" | "image" | "build-cache"> | undefined },
        never,
        never,
        TypesDiskUsage,
        never,
        never,
        never
      >,
    InternalServerError,
    never,
    false
  >,
  HttpApiDecodeError,
  never
>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyEndpoints.ts#L425)

Since v1.0.0

## TasksApi

A task is a container running on a swarm. It is the atomic scheduling
unit of swarm. Swarm mode must be enabled for these endpoints to work.

**See**

- https://docs.docker.com/reference/api/engine/latest/#tag/Task

**Signature**

```ts
declare const TasksApi: HttpApi<
  "TasksApi",
  HttpApiGroup<
    "tasks",
    | HttpApiEndpoint<
        "list",
        "GET",
        never,
        {
          readonly filters?:
            | {
                readonly name?: ReadonlyArray<string> | undefined
                readonly label?: ReadonlyArray<string> | undefined
                readonly id?: ReadonlyArray<string> | undefined
                readonly "desired-state"?: ReadonlyArray<"running" | "accepted" | "shutdown"> | undefined
                readonly node?: ReadonlyArray<string> | undefined
                readonly service?: ReadonlyArray<string> | undefined
              }
            | undefined
        },
        never,
        never,
        ReadonlyArray<SwarmTask>,
        NodeNotPartOfSwarm,
        never,
        never
      >
    | HttpApiEndpoint<
        "inspect",
        "GET",
        { readonly id: string },
        never,
        never,
        never,
        SwarmTask,
        NotFound | NodeNotPartOfSwarm,
        never,
        never
      >
    | HttpApiEndpoint<
        "logs",
        "GET",
        { readonly id: string },
        {
          readonly since?: number | undefined
          readonly follow?: boolean | undefined
          readonly stdout?: boolean | undefined
          readonly stderr?: boolean | undefined
          readonly timestamps?: boolean | undefined
          readonly tail?: string | undefined
          readonly details?: boolean | undefined
        },
        never,
        never,
        void,
        NotFound | NodeNotPartOfSwarm,
        never,
        never
      >,
    InternalServerError,
    never,
    false
  >,
  HttpApiDecodeError,
  never
>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyEndpoints.ts#L461)

Since v1.0.0

## VolumesApi

**See**

- https://docs.docker.com/reference/api/engine/latest/#tag/Volume

**Signature**

```ts
declare const VolumesApi: HttpApi<
  "VolumesApi",
  HttpApiGroup<
    "volumes",
    | HttpApiEndpoint<
        "list",
        "GET",
        never,
        {
          readonly filters?:
            | {
                readonly name?: ReadonlyArray<string> | undefined
                readonly label?: ReadonlyArray<string> | undefined
                readonly dangling?: ReadonlyArray<"0" | "true" | "false" | "1"> | undefined
                readonly driver?: ReadonlyArray<string> | undefined
              }
            | undefined
        },
        never,
        never,
        { readonly Volumes: ReadonlyArray<VolumeVolume>; readonly Warnings: ReadonlyArray<string> | null },
        never,
        never,
        never
      >
    | HttpApiEndpoint<"create", "POST", never, never, VolumeCreateOptions, never, VolumeVolume, never, never, never>
    | HttpApiEndpoint<
        "inspect",
        "GET",
        { readonly name: string },
        never,
        never,
        never,
        VolumeVolume,
        NotFound,
        never,
        never
      >
    | HttpApiEndpoint<
        "delete",
        "DELETE",
        { readonly name: string },
        { readonly force?: boolean | undefined },
        never,
        never,
        void,
        NotFound | Conflict,
        never,
        never
      >
    | HttpApiEndpoint<
        "update",
        "PUT",
        { readonly name: string },
        { readonly version: number },
        VolumeClusterVolumeSpec,
        never,
        void,
        BadRequest | NotFound | NodeNotPartOfSwarm,
        never,
        never
      >
    | HttpApiEndpoint<
        "prune",
        "POST",
        never,
        {
          readonly filters?:
            | {
                readonly label?: ReadonlyArray<string> | undefined
                readonly all?: ReadonlyArray<"0" | "true" | "false" | "1"> | undefined
              }
            | undefined
        },
        never,
        never,
        {
          readonly SpaceReclaimed: bigint & Brand<"I64">
          readonly VolumesDeleted?: ReadonlyArray<string & Brand<"VolumeId">> | undefined
        },
        never,
        never,
        never
      >,
    InternalServerError,
    never,
    false
  >,
  HttpApiDecodeError,
  never
>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyEndpoints.ts#L497)

Since v1.0.0

# Layers

## ConfigsLayer

Configs are application configurations that can be used by services.
Swarm mode must be enabled for these endpoints to work.

**See**

- https://docs.docker.com/reference/api/engine/latest/#tag/Config

**Signature**

```ts
declare const ConfigsLayer: Layer<Configs, never, HttpClient>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyEndpoints.ts#L36)

Since v1.0.0

## ConfigsLayerLocalSocket

Configs are application configurations that can be used by services.
Swarm mode must be enabled for these endpoints to work.

**See**

- https://docs.docker.com/reference/api/engine/latest/#tag/Config

**Signature**

```ts
declare const ConfigsLayerLocalSocket: Layer<Configs, never, HttpClient>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyEndpoints.ts#L46)

Since v1.0.0

## ContainersLayer

**See**

- https://docs.docker.com/reference/api/engine/latest/#tag/Container

**Signature**

```ts
declare const ContainersLayer: Layer<Containers, never, HttpClient | WebSocketConstructor>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyEndpoints.ts#L69)

Since v1.0.0

## ContainersLayerLocalSocket

**See**

- https://docs.docker.com/reference/api/engine/latest/#tag/Container

**Signature**

```ts
declare const ContainersLayerLocalSocket: Layer<Containers, never, HttpClient | WebSocketConstructor>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyEndpoints.ts#L76)

Since v1.0.0

## DistributionsLayer

**See**

- https://docs.docker.com/reference/api/engine/latest/#tag/Distribution

**Signature**

```ts
declare const DistributionsLayer: Layer<Distributions, never, HttpClient>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyEndpoints.ts#L99)

Since v1.0.0

## DistributionsLayerLocalSocket

**See**

- https://docs.docker.com/reference/api/engine/latest/#tag/Distribution

**Signature**

```ts
declare const DistributionsLayerLocalSocket: Layer<Distributions, never, HttpClient>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyEndpoints.ts#L106)

Since v1.0.0

## ExecsLayer

**See**

- https://docs.docker.com/reference/api/engine/latest/#tag/Exec

**Signature**

```ts
declare const ExecsLayer: Layer<Execs, never, HttpClient>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyEndpoints.ts#L129)

Since v1.0.0

## ExecsLayerLocalSocket

**See**

- https://docs.docker.com/reference/api/engine/latest/#tag/Exec

**Signature**

```ts
declare const ExecsLayerLocalSocket: Layer<Execs, never, HttpClient>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyEndpoints.ts#L136)

Since v1.0.0

## ImagesLayer

**See**

- https://docs.docker.com/reference/api/engine/latest/#tag/Image

**Signature**

```ts
declare const ImagesLayer: Layer<Images, never, HttpClient>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyEndpoints.ts#L159)

Since v1.0.0

## ImagesLayerLocalSocket

**See**

- https://docs.docker.com/reference/api/engine/latest/#tag/Image

**Signature**

```ts
declare const ImagesLayerLocalSocket: Layer<Images, never, HttpClient>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyEndpoints.ts#L166)

Since v1.0.0

## NetworksLayer

**See**

- https://docs.docker.com/reference/api/engine/latest/#tag/Network

**Signature**

```ts
declare const NetworksLayer: Layer<Networks, never, HttpClient>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyEndpoints.ts#L189)

Since v1.0.0

## NetworksLayerLocalSocket

**See**

- https://docs.docker.com/reference/api/engine/latest/#tag/Network

**Signature**

```ts
declare const NetworksLayerLocalSocket: Layer<Networks, never, HttpClient>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyEndpoints.ts#L196)

Since v1.0.0

## NodesLayer

**See**

- https://docs.docker.com/reference/api/engine/latest/#tag/Node

**Signature**

```ts
declare const NodesLayer: Layer<Nodes, never, HttpClient>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyEndpoints.ts#L219)

Since v1.0.0

## NodesLayerLocalSocket

**See**

- https://docs.docker.com/reference/api/engine/latest/#tag/Node

**Signature**

```ts
declare const NodesLayerLocalSocket: Layer<Nodes, never, HttpClient>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyEndpoints.ts#L226)

Since v1.0.0

## PluginsLayer

**See**

- https://docs.docker.com/reference/api/engine/latest/#tag/Plugin

**Signature**

```ts
declare const PluginsLayer: Layer<Plugins, never, HttpClient>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyEndpoints.ts#L249)

Since v1.0.0

## PluginsLayerLocalSocket

**See**

- https://docs.docker.com/reference/api/engine/latest/#tag/Plugin

**Signature**

```ts
declare const PluginsLayerLocalSocket: Layer<Plugins, never, HttpClient>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyEndpoints.ts#L256)

Since v1.0.0

## SecretsLayer

Secrets are sensitive data that can be used by services. Swarm mode must
be enabled for these endpoints to work.

**See**

- https://docs.docker.com/reference/api/engine/latest/#tag/Secret

**Signature**

```ts
declare const SecretsLayer: Layer<Secrets, never, HttpClient>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyEndpoints.ts#L288)

Since v1.0.0

## SecretsLayerLocalSocket

Secrets are sensitive data that can be used by services. Swarm mode must
be enabled for these endpoints to work.

**See**

- https://docs.docker.com/reference/api/engine/latest/#tag/Secret

**Signature**

```ts
declare const SecretsLayerLocalSocket: Layer<Secrets, never, HttpClient>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyEndpoints.ts#L298)

Since v1.0.0

## ServicesLayer

Services are the definitions of tasks to run on a swarm. Swarm mode must
be enabled for these endpoints to work.

**See**

- https://docs.docker.com/reference/api/engine/latest/#tag/Service

**Signature**

```ts
declare const ServicesLayer: Layer<Services, never, HttpClient>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyEndpoints.ts#L330)

Since v1.0.0

## ServicesLayerLocalSocket

Services are the definitions of tasks to run on a swarm. Swarm mode must
be enabled for these endpoints to work.

**See**

- https://docs.docker.com/reference/api/engine/latest/#tag/Service

**Signature**

```ts
declare const ServicesLayerLocalSocket: Layer<Services, never, HttpClient>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyEndpoints.ts#L340)

Since v1.0.0

## SessionsLayer

**See**

- https://docs.docker.com/reference/api/engine/latest/#tag/Session

**Signature**

```ts
declare const SessionsLayer: Layer<Sessions, never, HttpClient>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyEndpoints.ts#L363)

Since v1.0.0

## SessionsLayerLocalSocket

**See**

- https://docs.docker.com/reference/api/engine/latest/#tag/Session

**Signature**

```ts
declare const SessionsLayerLocalSocket: Layer<Sessions, never, HttpClient>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyEndpoints.ts#L370)

Since v1.0.0

## SwarmLayer

Engines can be clustered together in a swarm. Refer to the swarm mode
documentation for more information.

**See**

- https://docs.docker.com/reference/api/engine/latest/#tag/Swarm

**Signature**

```ts
declare const SwarmLayer: Layer<Swarm, never, HttpClient>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyEndpoints.ts#L402)

Since v1.0.0

## SwarmLayerLocalSocket

**See**

- https://docs.docker.com/reference/api/engine/latest/#tag/Swarm

**Signature**

```ts
declare const SwarmLayerLocalSocket: Layer<Swarm, never, HttpClient>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyEndpoints.ts#L409)

Since v1.0.0

## SystemLayer

**See**

- https://docs.docker.com/reference/api/engine/latest/#tag/System

**Signature**

```ts
declare const SystemLayer: Layer<System, never, HttpClient>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyEndpoints.ts#L432)

Since v1.0.0

## SystemLayerLocalSocket

**See**

- https://docs.docker.com/reference/api/engine/latest/#tag/System

**Signature**

```ts
declare const SystemLayerLocalSocket: Layer<System, never, HttpClient>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyEndpoints.ts#L439)

Since v1.0.0

## TasksLayer

A task is a container running on a swarm. It is the atomic scheduling
unit of swarm. Swarm mode must be enabled for these endpoints to work.

**See**

- https://docs.docker.com/reference/api/engine/latest/#tag/Task

**Signature**

```ts
declare const TasksLayer: Layer<Tasks, never, HttpClient>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyEndpoints.ts#L471)

Since v1.0.0

## TasksLayerLocalSocket

A task is a container running on a swarm. It is the atomic scheduling
unit of swarm. Swarm mode must be enabled for these endpoints to work.

**See**

- https://docs.docker.com/reference/api/engine/latest/#tag/Task

**Signature**

```ts
declare const TasksLayerLocalSocket: Layer<Tasks, never, HttpClient>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyEndpoints.ts#L481)

Since v1.0.0

## VolumesLayer

**See**

- https://docs.docker.com/reference/api/engine/latest/#tag/Volume

**Signature**

```ts
declare const VolumesLayer: Layer<Volumes, never, HttpClient>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyEndpoints.ts#L504)

Since v1.0.0

## VolumesLayerLocalSocket

**See**

- https://docs.docker.com/reference/api/engine/latest/#tag/Volume

**Signature**

```ts
declare const VolumesLayerLocalSocket: Layer<Volumes, never, HttpClient>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyEndpoints.ts#L511)

Since v1.0.0

# Services

## Configs

Configs are application configurations that can be used by services.
Swarm mode must be enabled for these endpoints to work.

**See**

- https://docs.docker.com/reference/api/engine/latest/#tag/Config

**Signature**

```ts
declare const Configs: typeof Configs
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyEndpoints.ts#L16)

Since v1.0.0

## Containers

**See**

- https://docs.docker.com/reference/api/engine/latest/#tag/Container

**Signature**

```ts
declare const Containers: typeof Containers
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyEndpoints.ts#L55)

Since v1.0.0

## Distributions

**See**

- https://docs.docker.com/reference/api/engine/latest/#tag/Distribution

**Signature**

```ts
declare const Distributions: typeof Distributions
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyEndpoints.ts#L85)

Since v1.0.0

## Execs

**See**

- https://docs.docker.com/reference/api/engine/latest/#tag/Exec

**Signature**

```ts
declare const Execs: typeof Execs
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyEndpoints.ts#L115)

Since v1.0.0

## Images

**See**

- https://docs.docker.com/reference/api/engine/latest/#tag/Image

**Signature**

```ts
declare const Images: typeof Images
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyEndpoints.ts#L145)

Since v1.0.0

## Networks

**See**

- https://docs.docker.com/reference/api/engine/latest/#tag/Network

**Signature**

```ts
declare const Networks: typeof Networks
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyEndpoints.ts#L175)

Since v1.0.0

## Nodes

**See**

- https://docs.docker.com/reference/api/engine/latest/#tag/Node

**Signature**

```ts
declare const Nodes: typeof Nodes
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyEndpoints.ts#L205)

Since v1.0.0

## Plugins

**See**

- https://docs.docker.com/reference/api/engine/latest/#tag/Plugin

**Signature**

```ts
declare const Plugins: typeof Plugins
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyEndpoints.ts#L235)

Since v1.0.0

## Secrets

Secrets are sensitive data that can be used by services. Swarm mode must
be enabled for these endpoints to work.

**See**

- https://docs.docker.com/reference/api/engine/latest/#tag/Secret

**Signature**

```ts
declare const Secrets: typeof Secrets
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyEndpoints.ts#L268)

Since v1.0.0

## Services

Services are the definitions of tasks to run on a swarm. Swarm mode must
be enabled for these endpoints to work.

**See**

- https://docs.docker.com/reference/api/engine/latest/#tag/Service

**Signature**

```ts
declare const Services: typeof Services
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyEndpoints.ts#L310)

Since v1.0.0

## Sessions

**See**

- https://docs.docker.com/reference/api/engine/latest/#tag/Session

**Signature**

```ts
declare const Sessions: typeof Sessions
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyEndpoints.ts#L356)

Since v1.0.0

## Swarm

Engines can be clustered together in a swarm. Refer to the swarm mode
documentation for more information.

**See**

- https://docs.docker.com/reference/api/engine/latest/#tag/Swarm

**Signature**

```ts
declare const Swarm: typeof Swarm
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyEndpoints.ts#L382)

Since v1.0.0

## System

**See**

- https://docs.docker.com/reference/api/engine/latest/#tag/System

**Signature**

```ts
declare const System: typeof System
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyEndpoints.ts#L418)

Since v1.0.0

## Tasks

A task is a container running on a swarm. It is the atomic scheduling
unit of swarm. Swarm mode must be enabled for these endpoints to work.

**See**

- https://docs.docker.com/reference/api/engine/latest/#tag/Task

**Signature**

```ts
declare const Tasks: typeof Tasks
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyEndpoints.ts#L451)

Since v1.0.0

## Volumes

**See**

- https://docs.docker.com/reference/api/engine/latest/#tag/Volume

**Signature**

```ts
declare const Volumes: typeof Volumes
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyEndpoints.ts#L490)

Since v1.0.0
