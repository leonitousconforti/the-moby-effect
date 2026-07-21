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
        "/configs/",
        never,
        toCodecStringTree<
          Struct<{
            filters: optional<
              Struct<{
                readonly id: optional<$Array<brand<String, "ConfigId">>>
                readonly name: optional<$Array<String>>
                readonly names: optional<$Array<String>>
                readonly label: optional<$Array<String>>
              }>
            >
          }>
        >,
        never,
        never,
        toCodecJson<$Array<typeof SwarmConfig>>,
        toCodecJson<typeof InternalServerError | typeof NodeNotPartOfSwarm>,
        never,
        never
      >
    | HttpApiEndpoint<
        "create",
        "POST",
        "/configs/create",
        never,
        never,
        toCodecJson<typeof SwarmConfigSpec>,
        never,
        toCodecJson<
          decodeTo<
            Struct<{ readonly Id: brand<String, "ConfigId"> }>,
            Struct<{ readonly ID: toEncoded<brand<String, "ConfigId">> }>,
            never,
            never
          >
        >,
        toCodecJson<typeof InternalServerError | typeof Conflict | typeof NodeNotPartOfSwarm>,
        never,
        never
      >
    | HttpApiEndpoint<
        "inspect",
        "GET",
        "/configs/:identifier",
        toCodecStringTree<Struct<{ identifier: brand<String, "ConfigId"> }>>,
        never,
        never,
        never,
        toCodecJson<typeof SwarmConfig>,
        toCodecJson<typeof InternalServerError | typeof NotFound | typeof NodeNotPartOfSwarm>,
        never,
        never
      >
    | HttpApiEndpoint<
        "delete",
        "DELETE",
        "/configs/:identifier",
        toCodecStringTree<Struct<{ identifier: brand<String, "ConfigId"> }>>,
        never,
        never,
        never,
        toCodecJson<NoContent>,
        toCodecJson<typeof InternalServerError | typeof NotFound | typeof NodeNotPartOfSwarm>,
        never,
        never
      >
    | HttpApiEndpoint<
        "update",
        "POST",
        "/configs/:identifier/update",
        toCodecStringTree<Struct<{ identifier: brand<String, "ConfigId"> }>>,
        toCodecStringTree<Struct<{ version: BigIntFromString }>>,
        toCodecJson<typeof SwarmConfigSpec>,
        never,
        toCodecJson<Void>,
        toCodecJson<typeof BadRequest | typeof InternalServerError | typeof NotFound | typeof NodeNotPartOfSwarm>,
        never,
        never
      >,
    false
  >
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
        "/containers/json",
        never,
        toCodecStringTree<
          Struct<{
            all: optional<Boolean>
            limit: optional<Number>
            size: optional<Boolean>
            filters: optional<
              Struct<{
                readonly ancestor: optional<$Array<String>>
                readonly before: optional<$Array<String>>
                readonly expose: optional<$Array<String>>
                readonly exited: optional<$Array<NumberFromString>>
                readonly health: optional<$Array<Literals<readonly ["none", "starting", "healthy", "unhealthy"]>>>
                readonly identifier: optional<$Array<brand<String, "ContainerId">>>
                readonly "is-task": optional<
                  Union<
                    readonly [
                      decodeTo<Literal<true>, Literal<"true">, never, never>,
                      decodeTo<Literal<false>, Literal<"false">, never, never>
                    ]
                  >
                >
                readonly label: optional<$Array<String>>
                readonly name: optional<$Array<String>>
                readonly network: optional<$Array<String>>
                readonly publish: optional<$Array<String>>
                readonly since: optional<$Array<String>>
                readonly status: optional<
                  $Array<
                    Literals<readonly ["created", "restarting", "running", "removing", "paused", "exited", "dead"]>
                  >
                >
                readonly volume: optional<String>
              }>
            >
          }>
        >,
        never,
        never,
        toCodecJson<$Array<typeof ContainerSummary>>,
        toCodecJson<typeof BadRequest | typeof InternalServerError>,
        never,
        never
      >
    | HttpApiEndpoint<
        "create",
        "POST",
        "/containers/create",
        never,
        toCodecStringTree<Struct<{ platform: optional<String>; name: optional<String> }>>,
        toCodecJson<typeof ContainerCreateRequest>,
        never,
        toCodecJson<Struct<{ readonly Id: brand<String, "ContainerId">; readonly Warnings: NullOr<$Array<String>> }>>,
        toCodecJson<
          | typeof BadRequest
          | typeof InternalServerError
          | typeof Forbidden
          | typeof NotFound
          | typeof NotAcceptable
          | typeof Conflict
        >,
        never,
        never
      >
    | HttpApiEndpoint<
        "inspect",
        "GET",
        "/containers/:identifier/json",
        toCodecStringTree<Struct<{ identifier: brand<String, "ContainerId"> }>>,
        toCodecStringTree<Struct<{ size: optional<Boolean> }>>,
        never,
        never,
        toCodecJson<typeof ContainerInspectResponse>,
        toCodecJson<typeof InternalServerError | typeof NotFound>,
        never,
        never
      >
    | HttpApiEndpoint<
        "top",
        "GET",
        "/containers/:identifier/top",
        toCodecStringTree<Struct<{ identifier: brand<String, "ContainerId"> }>>,
        toCodecStringTree<Struct<{ ps_args: optional<String> }>>,
        never,
        never,
        toCodecJson<typeof ContainerTopResponse>,
        toCodecJson<typeof InternalServerError | typeof NotFound>,
        never,
        never
      >
    | HttpApiEndpoint<
        "logs",
        "GET",
        "/containers/:identifier/logs",
        toCodecStringTree<Struct<{ identifier: brand<String, "ContainerId"> }>>,
        toCodecStringTree<
          Struct<{
            follow: optional<Boolean>
            stdout: optional<Boolean>
            stderr: optional<Boolean>
            since: optional<Number>
            until: optional<Number>
            timestamps: optional<Boolean>
            tail: optional<String>
          }>
        >,
        never,
        never,
        StreamUint8Array,
        toCodecJson<typeof InternalServerError | typeof NotFound>,
        never,
        never
      >
    | HttpApiEndpoint<
        "changes",
        "GET",
        "/containers/:identifier/changes",
        toCodecStringTree<Struct<{ identifier: brand<String, "ContainerId"> }>>,
        never,
        never,
        never,
        toCodecJson<NullOr<$Array<typeof ArchiveChange>>>,
        toCodecJson<typeof InternalServerError | typeof NotFound>,
        never,
        never
      >
    | HttpApiEndpoint<
        "export",
        "GET",
        "/containers/:identifier/export",
        toCodecStringTree<Struct<{ identifier: brand<String, "ContainerId"> }>>,
        never,
        never,
        never,
        StreamUint8Array,
        toCodecJson<typeof InternalServerError | typeof NotFound>,
        never,
        never
      >
    | HttpApiEndpoint<
        "stats",
        "GET",
        "/containers/:identifier/stats",
        toCodecStringTree<Struct<{ identifier: brand<String, "ContainerId"> }>>,
        toCodecStringTree<Struct<{ stream: optional<Boolean>; "one-shot": optional<Boolean> }>>,
        never,
        never,
        StreamUint8Array,
        toCodecJson<typeof InternalServerError | typeof NotFound>,
        never,
        never
      >
    | HttpApiEndpoint<
        "resize",
        "POST",
        "/containers/:identifier/resize",
        toCodecStringTree<Struct<{ identifier: brand<String, "ContainerId"> }>>,
        toCodecStringTree<Struct<{ h: optional<Number>; w: optional<Number> }>>,
        never,
        never,
        toCodecJson<Void>,
        toCodecJson<typeof InternalServerError | typeof NotFound>,
        never,
        never
      >
    | HttpApiEndpoint<
        "start",
        "POST",
        "/containers/:identifier/start",
        toCodecStringTree<Struct<{ identifier: brand<String, "ContainerId"> }>>,
        toCodecStringTree<Struct<{ detachKeys: optional<String> }>>,
        never,
        never,
        toCodecJson<Void>,
        toCodecJson<typeof InternalServerError | typeof NotFound>,
        never,
        never
      >
    | HttpApiEndpoint<
        "stop",
        "POST",
        "/containers/:identifier/stop",
        toCodecStringTree<Struct<{ identifier: brand<String, "ContainerId"> }>>,
        toCodecStringTree<Struct<{ signal: optional<String>; t: optional<Number> }>>,
        never,
        never,
        toCodecJson<Void>,
        toCodecJson<typeof InternalServerError | typeof NotFound>,
        never,
        never
      >
    | HttpApiEndpoint<
        "restart",
        "POST",
        "/containers/:identifier/restart",
        toCodecStringTree<Struct<{ identifier: brand<String, "ContainerId"> }>>,
        toCodecStringTree<Struct<{ signal: optional<String>; t: optional<Number> }>>,
        never,
        never,
        toCodecJson<Void>,
        toCodecJson<typeof InternalServerError | typeof NotFound>,
        never,
        never
      >
    | HttpApiEndpoint<
        "kill",
        "POST",
        "/containers/:identifier/kill",
        toCodecStringTree<Struct<{ identifier: brand<String, "ContainerId"> }>>,
        toCodecStringTree<Struct<{ signal: optional<String> }>>,
        never,
        never,
        toCodecJson<Void>,
        toCodecJson<typeof InternalServerError | typeof NotFound | typeof Conflict>,
        never,
        never
      >
    | HttpApiEndpoint<
        "update",
        "POST",
        "/containers/:identifier/update",
        toCodecStringTree<Struct<{ identifier: brand<String, "ContainerId"> }>>,
        never,
        toCodecJson<typeof ContainerConfig>,
        never,
        toCodecJson<Struct<{ readonly Warnings: NullOr<$Array<String>> }>>,
        toCodecJson<typeof InternalServerError | typeof NotFound>,
        never,
        never
      >
    | HttpApiEndpoint<
        "rename",
        "POST",
        "/containers/:identifier/rename",
        toCodecStringTree<Struct<{ identifier: brand<String, "ContainerId"> }>>,
        toCodecStringTree<Struct<{ name: String }>>,
        never,
        never,
        toCodecJson<Void>,
        toCodecJson<typeof InternalServerError | typeof NotFound | typeof Conflict>,
        never,
        never
      >
    | HttpApiEndpoint<
        "pause",
        "POST",
        "/containers/:identifier/pause",
        toCodecStringTree<Struct<{ identifier: brand<String, "ContainerId"> }>>,
        never,
        never,
        never,
        toCodecJson<Void>,
        toCodecJson<typeof InternalServerError | typeof NotFound>,
        never,
        never
      >
    | HttpApiEndpoint<
        "unpause",
        "POST",
        "/containers/:identifier/unpause",
        toCodecStringTree<Struct<{ identifier: brand<String, "ContainerId"> }>>,
        never,
        never,
        never,
        toCodecJson<Void>,
        toCodecJson<typeof InternalServerError | typeof NotFound>,
        never,
        never
      >
    | HttpApiEndpoint<
        "attach",
        "POST",
        "/containers/:identifier/attach",
        toCodecStringTree<Struct<{ identifier: brand<String, "ContainerId"> }>>,
        toCodecStringTree<
          Struct<{
            detachKeys: optional<String>
            logs: optional<Boolean>
            stream: optional<Boolean>
            stdin: optional<Boolean>
            stdout: optional<Boolean>
            stderr: optional<Boolean>
          }>
        >,
        never,
        toCodecStringTree<Struct<{ Upgrade: Literal<"tcp">; Connection: Literal<"Upgrade"> }>>,
        toCodecJson<Void>,
        toCodecJson<typeof BadRequest | typeof InternalServerError | typeof NotFound>,
        never,
        never
      >
    | HttpApiEndpoint<
        "attachWebsocket",
        "GET",
        "/containers/:identifier/attach/ws",
        toCodecStringTree<Struct<{ identifier: brand<String, "ContainerId"> }>>,
        toCodecStringTree<
          Struct<{
            detachKeys: optional<String>
            logs: optional<Boolean>
            stream: optional<Boolean>
            stdin: optional<Boolean>
            stdout: optional<Boolean>
            stderr: optional<Boolean>
          }>
        >,
        never,
        never,
        toCodecJson<Void>,
        toCodecJson<typeof BadRequest | typeof InternalServerError | typeof NotFound>,
        never,
        never
      >
    | HttpApiEndpoint<
        "wait",
        "POST",
        "/containers/:identifier/wait",
        toCodecStringTree<Struct<{ identifier: brand<String, "ContainerId"> }>>,
        toCodecStringTree<Struct<{ condition: optional<String> }>>,
        never,
        never,
        toCodecJson<typeof ContainerWaitResponse>,
        toCodecJson<typeof BadRequest | typeof InternalServerError | typeof NotFound>,
        never,
        never
      >
    | HttpApiEndpoint<
        "delete",
        "DELETE",
        "/containers/:identifier",
        toCodecStringTree<Struct<{ identifier: brand<String, "ContainerId"> }>>,
        toCodecStringTree<Struct<{ v: optional<Boolean>; force: optional<Boolean>; link: optional<Boolean> }>>,
        never,
        never,
        toCodecJson<Void>,
        toCodecJson<typeof BadRequest | typeof InternalServerError | typeof NotFound | typeof Conflict>,
        never,
        never
      >
    | HttpApiEndpoint<
        "archive",
        "GET",
        "/containers/:identifier/archive",
        toCodecStringTree<Struct<{ identifier: brand<String, "ContainerId"> }>>,
        toCodecStringTree<Struct<{ path: String }>>,
        never,
        never,
        StreamUint8Array,
        toCodecJson<typeof BadRequest | typeof InternalServerError | typeof NotFound>,
        never,
        never
      >
    | HttpApiEndpoint<
        "archiveInfo",
        "HEAD",
        "/containers/:identifier/archive",
        toCodecStringTree<Struct<{ identifier: brand<String, "ContainerId"> }>>,
        toCodecStringTree<Struct<{ path: String }>>,
        never,
        never,
        toCodecJson<Void>,
        toCodecJson<typeof BadRequest | typeof InternalServerError | typeof NotFound>,
        never,
        never
      >
    | HttpApiEndpoint<
        "putArchive",
        "PUT",
        "/containers/:identifier/archive",
        toCodecStringTree<Struct<{ identifier: brand<String, "ContainerId"> }>>,
        toCodecStringTree<
          Struct<{ path: String; noOverwriteDirNonDir: optional<String>; copyUIDGidentifier: optional<String> }>
        >,
        toCodecJson<StreamUint8Array>,
        never,
        toCodecJson<Void>,
        toCodecJson<typeof BadRequest | typeof InternalServerError | typeof Forbidden | typeof NotFound>,
        never,
        never
      >
    | HttpApiEndpoint<
        "prune",
        "POST",
        "/containers/prune",
        never,
        toCodecStringTree<
          Struct<{
            filters: optional<Struct<{ readonly until: optional<String>; readonly label: optional<$Array<String>> }>>
          }>
        >,
        never,
        never,
        toCodecJson<
          Struct<{
            readonly ContainersDeleted: NullOr<$Array<brand<String, "ContainerId">>>
            readonly SpaceReclaimed: BigIntFromString
          }>
        >,
        toCodecJson<typeof InternalServerError>,
        never,
        never
      >,
    false
  >
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
      "/distribution/:name/json",
      toCodecStringTree<Struct<{ name: String }>>,
      never,
      never,
      never,
      toCodecJson<typeof RegistryDistributionInspect>,
      toCodecJson<typeof InternalServerError | typeof NotFound | typeof Unauthorized>,
      never,
      never
    >,
    false
  >
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
        "/containers/:id/exec",
        toCodecStringTree<Struct<{ id: String }>>,
        never,
        toCodecJson<typeof ContainerExecOptions>,
        never,
        toCodecJson<Struct<{ readonly Id: brand<String, "ExecId"> }>>,
        toCodecJson<typeof InternalServerError | typeof NotFound | typeof Conflict>,
        never,
        never
      >
    | HttpApiEndpoint<
        "start",
        "POST",
        "/exec/:id/start",
        toCodecStringTree<Struct<{ id: brand<String, "ExecId"> }>>,
        never,
        toCodecJson<typeof ContainerExecStartOptions>,
        toCodecStringTree<Struct<{ Upgrade: Literal<"tcp">; Connection: Literal<"Upgrade"> }>>,
        toCodecJson<Void>,
        toCodecJson<typeof InternalServerError | typeof NotFound | typeof Conflict>,
        never,
        never
      >
    | HttpApiEndpoint<
        "resize",
        "POST",
        "/exec/:id/resize",
        toCodecStringTree<Struct<{ id: brand<String, "ExecId"> }>>,
        toCodecStringTree<Struct<{ h: Number; w: Number }>>,
        never,
        never,
        toCodecJson<Void>,
        toCodecJson<typeof BadRequest | typeof InternalServerError | typeof NotFound>,
        never,
        never
      >
    | HttpApiEndpoint<
        "inspect",
        "GET",
        "/exec/:id/json",
        toCodecStringTree<Struct<{ id: brand<String, "ExecId"> }>>,
        never,
        never,
        never,
        toCodecJson<typeof ContainerExecInspect>,
        toCodecJson<typeof InternalServerError | typeof NotFound>,
        never,
        never
      >,
    false
  >
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
        "/images/json",
        never,
        toCodecStringTree<
          Struct<{
            filters: optional<
              Struct<{
                readonly before: optional<$Array<String>>
                readonly dangling: optional<
                  Union<
                    readonly [
                      decodeTo<Literal<true>, Literal<"true">, never, never>,
                      decodeTo<Literal<false>, Literal<"false">, never, never>
                    ]
                  >
                >
                readonly label: optional<$Array<String>>
                readonly reference: optional<$Array<String>>
                readonly since: optional<$Array<String>>
                readonly until: optional<String>
              }>
            >
            all: optional<Boolean>
            digests: optional<Boolean>
            "shared-size": optional<Boolean>
          }>
        >,
        never,
        never,
        toCodecJson<$Array<typeof ImageSummary>>,
        toCodecJson<typeof InternalServerError>,
        never,
        never
      >
    | HttpApiEndpoint<
        "build",
        "POST",
        "/build",
        never,
        toCodecStringTree<
          Struct<{
            dockerfile: optional<String>
            t: optional<String>
            extrahosts: optional<String>
            remote: optional<String>
            q: optional<Boolean>
            nocache: optional<Boolean>
            cachefrom: optional<String>
            pull: optional<String>
            rm: optional<Boolean>
            forcerm: optional<Boolean>
            memory: optional<Number>
            memswap: optional<Number>
            cpushares: optional<Number>
            cpusetcpus: optional<String>
            cpuperiod: optional<Number>
            cpuquota: optional<Number>
            buildargs: optional<$Record<String, NullishOr<String>>>
            shmsize: optional<Number>
            squash: optional<Boolean>
            labels: optional<String>
            networkmode: optional<String>
            platform: optional<String>
            target: optional<String>
            outputs: optional<String>
            version: optional<Literal<"1">>
          }>
        >,
        toCodecJson<StreamUint8Array>,
        toCodecStringTree<Struct<{ "Content-type": optional<String>; "X-Registry-Config": optional<String> }>>,
        StreamUint8Array,
        toCodecJson<typeof BadRequest | typeof InternalServerError>,
        never,
        never
      >
    | HttpApiEndpoint<
        "buildPrune",
        "POST",
        "/build/prune",
        never,
        toCodecStringTree<
          Struct<{ "keep-storage": optional<Number>; all: optional<Boolean>; filters: optional<String> }>
        >,
        never,
        never,
        toCodecJson<Struct<{ readonly SpaceReclaimed: Number; readonly CachesDeleted: $Array<String> }>>,
        toCodecJson<typeof InternalServerError>,
        never,
        never
      >
    | HttpApiEndpoint<
        "create",
        "POST",
        "/images/create",
        never,
        toCodecStringTree<
          Struct<{
            fromImage: optional<String>
            fromSrc: optional<String>
            repo: optional<String>
            tag: optional<String>
            message: optional<String>
            changes: optional<String>
            platform: optional<String>
          }>
        >,
        never,
        toCodecStringTree<Struct<{ "X-Registry-Auth": optional<String> }>>,
        StreamUint8Array,
        toCodecJson<typeof InternalServerError | typeof NotFound>,
        never,
        never
      >
    | HttpApiEndpoint<
        "inspect",
        "GET",
        "/images/:name/json",
        toCodecStringTree<Struct<{ name: String }>>,
        toCodecStringTree<Struct<{ manifests: optional<Boolean> }>>,
        never,
        never,
        toCodecJson<typeof ImageInspectResponse>,
        toCodecJson<typeof InternalServerError | typeof NotFound>,
        never,
        never
      >
    | HttpApiEndpoint<
        "history",
        "GET",
        "/images/:name/history",
        toCodecStringTree<Struct<{ name: String }>>,
        toCodecStringTree<Struct<{ platform: optional<String> }>>,
        never,
        never,
        toCodecJson<$Array<typeof ImageHistoryResponseItem>>,
        toCodecJson<typeof InternalServerError | typeof NotFound>,
        never,
        never
      >
    | HttpApiEndpoint<
        "push",
        "POST",
        "/images/:name/push",
        toCodecStringTree<Struct<{ name: String }>>,
        toCodecStringTree<Struct<{ tag: optional<String>; platform: optional<String> }>>,
        never,
        toCodecStringTree<Struct<{ "X-Registry-Auth": optional<String> }>>,
        StreamUint8Array,
        toCodecJson<typeof InternalServerError | typeof NotFound>,
        never,
        never
      >
    | HttpApiEndpoint<
        "tag",
        "POST",
        "/images/:name/tag",
        toCodecStringTree<Struct<{ name: String }>>,
        toCodecStringTree<Struct<{ repo: optional<String>; tag: optional<String> }>>,
        never,
        never,
        toCodecJson<Void>,
        toCodecJson<typeof BadRequest | typeof InternalServerError | typeof NotFound | typeof Conflict>,
        never,
        never
      >
    | HttpApiEndpoint<
        "delete",
        "DELETE",
        "/images/:name",
        toCodecStringTree<Struct<{ name: String }>>,
        toCodecStringTree<
          Struct<{ force: optional<Boolean>; noprune: optional<Boolean>; platforms: optional<$Array<String>> }>
        >,
        never,
        never,
        toCodecJson<$Array<typeof ImageDeleteResponse>>,
        toCodecJson<typeof InternalServerError | typeof NotFound | typeof Conflict>,
        never,
        never
      >
    | HttpApiEndpoint<
        "search",
        "GET",
        "/images/search",
        never,
        toCodecStringTree<
          Struct<{
            term: String
            limit: optional<Number>
            filters: optional<
              Struct<{
                readonly "is-official": optional<decodeTo<Boolean, Tuple<readonly [String]>, never, never>>
                readonly "is-automated": optional<decodeTo<Boolean, Tuple<readonly [String]>, never, never>>
                readonly stars: optional<NumberFromString>
              }>
            >
          }>
        >,
        never,
        never,
        toCodecJson<$Array<typeof RegistrySearchResult>>,
        toCodecJson<typeof InternalServerError>,
        never,
        never
      >
    | HttpApiEndpoint<
        "prune",
        "POST",
        "/images/prune",
        never,
        toCodecStringTree<Struct<{ filters: optional<String> }>>,
        never,
        never,
        toCodecJson<
          Struct<{
            readonly SpaceReclaimed: Number
            readonly ImagesDeleted: NullishOr<$Array<typeof ImageDeleteResponse>>
          }>
        >,
        toCodecJson<typeof InternalServerError>,
        never,
        never
      >
    | HttpApiEndpoint<
        "commit",
        "POST",
        "/images/commit",
        never,
        toCodecStringTree<
          Struct<{
            container: String
            repo: optional<String>
            tag: optional<String>
            comment: optional<String>
            author: optional<String>
            pause: optional<Boolean>
            changes: optional<String>
          }>
        >,
        toCodecJson<typeof ContainerCreateRequest>,
        never,
        toCodecJson<
          decodeTo<
            declareConstructor<
              ImageInspectResponse,
              {
                readonly Config: {
                  readonly User?: string | undefined
                  readonly ExposedPorts?: { readonly [x: string]: object } | null | undefined
                  readonly Env?: ReadonlyArray<string> | null | undefined
                  readonly Cmd?: ReadonlyArray<string> | null | undefined
                  readonly Healthcheck?:
                    | {
                        readonly Test?: ReadonlyArray<string> | null | undefined
                        readonly Interval?: string | undefined
                        readonly Timeout?: string | undefined
                        readonly StartPeriod?: string | undefined
                        readonly StartInterval?: string | undefined
                        readonly Retries?: string | undefined
                      }
                    | null
                    | undefined
                  readonly ArgsEscaped?: boolean | undefined
                  readonly Volumes?: { readonly [x: string]: object } | null | undefined
                  readonly WorkingDir?: string | undefined
                  readonly Entrypoint?: ReadonlyArray<string> | null | undefined
                  readonly OnBuild?: ReadonlyArray<string> | null | undefined
                  readonly Labels?: { readonly [x: string]: string } | null | undefined
                  readonly StopSignal?: string | undefined
                  readonly Shell?: ReadonlyArray<string> | null | undefined
                } | null
                readonly Id: string
                readonly GraphDriver: Struct.ReadonlySide<
                  { readonly Data: NullOr<$Record<String, String>>; readonly Name: String },
                  "Encoded"
                > | null
                readonly Size: string
                readonly RepoDigests: ReadonlyArray<string> | null
                readonly RepoTags: ReadonlyArray<string> | null
                readonly RootFS: {
                  readonly Type?: string | undefined
                  readonly Layers?: ReadonlyArray<string> | null | undefined
                } | null
                readonly Metadata: { readonly LastTagTime?: string | null | undefined } | null
                readonly Parent: string
                readonly Comment: string
                readonly DockerVersion: string
                readonly Author: string
                readonly Architecture: string
                readonly Os: string
                readonly ContainerConfig?:
                  | {
                      readonly Hostname: string
                      readonly Domainname: string
                      readonly User: string
                      readonly AttachStdin: boolean
                      readonly AttachStdout: boolean
                      readonly AttachStderr: boolean
                      readonly Tty: boolean
                      readonly OpenStdin: boolean
                      readonly StdinOnce: boolean
                      readonly Env: ReadonlyArray<string> | null
                      readonly Cmd: ReadonlyArray<string> | null
                      readonly Volumes: { readonly [x: string]: object } | null
                      readonly WorkingDir: string
                      readonly Entrypoint: ReadonlyArray<string> | null
                      readonly OnBuild: ReadonlyArray<string> | null
                      readonly Labels: { readonly [x: string]: string } | null
                      readonly Image: string
                      readonly ExposedPorts?:
                        | {
                            readonly [x: `${number}`]: object
                            readonly [x: `${number}/tcp`]: object
                            readonly [x: `${number}/udp`]: object
                          }
                        | null
                        | undefined
                      readonly Healthcheck?:
                        | {
                            readonly Test?: ReadonlyArray<string> | null | undefined
                            readonly Interval?: string | undefined
                            readonly Timeout?: string | undefined
                            readonly StartPeriod?: string | undefined
                            readonly StartInterval?: string | undefined
                            readonly Retries?: string | undefined
                          }
                        | null
                        | undefined
                      readonly ArgsEscaped?: boolean | undefined
                      readonly NetworkDisabled?: boolean | undefined
                      readonly MacAddress?: string | undefined
                      readonly StopSignal?: string | undefined
                      readonly StopTimeout?: string | null | undefined
                      readonly Shell?: ReadonlyArray<string> | null | undefined
                    }
                  | null
                  | undefined
                readonly Created?: string | undefined
                readonly Descriptor?:
                  | {
                      readonly size: string
                      readonly mediaType: string
                      readonly digest: string
                      readonly urls?: ReadonlyArray<string> | null | undefined
                      readonly annotations?: { readonly [x: string]: string } | null | undefined
                      readonly data?: string | null | undefined
                      readonly platform?:
                        | {
                            readonly architecture: string
                            readonly os: string
                            readonly "os.version"?: string | undefined
                            readonly "os.features"?: ReadonlyArray<string> | null | undefined
                            readonly variant?: string | undefined
                          }
                        | null
                        | undefined
                      readonly artifactType?: string | undefined
                    }
                  | null
                  | undefined
                readonly Manifests?:
                  | ReadonlyArray<{
                      readonly Kind: "image" | "attestation" | "unknown"
                      readonly Descriptor: {
                        readonly size: string
                        readonly mediaType: string
                        readonly digest: string
                        readonly urls?: ReadonlyArray<string> | null | undefined
                        readonly annotations?: { readonly [x: string]: string } | null | undefined
                        readonly data?: string | null | undefined
                        readonly platform?:
                          | {
                              readonly architecture: string
                              readonly os: string
                              readonly "os.version"?: string | undefined
                              readonly "os.features"?: ReadonlyArray<string> | null | undefined
                              readonly variant?: string | undefined
                            }
                          | null
                          | undefined
                        readonly artifactType?: string | undefined
                      } | null
                      readonly Size: Struct.ReadonlySide<
                        { readonly Content: BigIntFromString; readonly Total: BigIntFromString },
                        "Encoded"
                      >
                      readonly ID: string
                      readonly Available: boolean
                      readonly ImageData?:
                        | Struct.ReadonlySide<
                            {
                              readonly Platform: NullOr<typeof V1Platform>
                              readonly Size: Struct<{ readonly Unpacked: BigIntFromString }>
                              readonly Containers: NullOr<$Array<String>>
                            },
                            "Encoded"
                          >
                        | null
                        | undefined
                      readonly AttestationData?:
                        Struct.ReadonlySide<{ readonly For: brand<String, "Digest"> }, "Encoded"> | null | undefined
                    } | null>
                  | null
                  | undefined
                readonly VirtualSize?: string | undefined
                readonly Container?: string | undefined
                readonly Variant?: string | undefined
                readonly OsVersion?: string | undefined
              },
              readonly [
                Struct<{
                  readonly Id: brand<String, "ImageId">
                  readonly RepoTags: NullOr<$Array<String>>
                  readonly RepoDigests: NullOr<$Array<brand<String, "Digest">>>
                  readonly Parent: String
                  readonly Comment: String
                  readonly Created: optional<String>
                  readonly Container: optional<String>
                  readonly ContainerConfig: optional<NullOr<typeof ContainerConfig>>
                  readonly DockerVersion: String
                  readonly Author: String
                  readonly Config: NullOr<typeof V1DockerOCIImageConfig>
                  readonly Architecture: String
                  readonly Variant: optional<String>
                  readonly Os: String
                  readonly OsVersion: optional<String>
                  readonly Size: BigIntFromString
                  readonly VirtualSize: optional<BigIntFromString>
                  readonly GraphDriver: NullOr<typeof StorageDriverData>
                  readonly RootFS: NullOr<typeof ImageRootFS>
                  readonly Metadata: NullOr<typeof ImageMetadata>
                  readonly Descriptor: optional<NullOr<typeof V1Descriptor>>
                  readonly Manifests: optional<NullOr<$Array<NullOr<typeof ImageManifestSummary>>>>
                }>
              ],
              {
                readonly Config: {
                  readonly User?: string | undefined
                  readonly ExposedPorts?: { readonly [x: string]: object } | null | undefined
                  readonly Env?: ReadonlyArray<string> | null | undefined
                  readonly Cmd?: ReadonlyArray<string> | null | undefined
                  readonly Healthcheck?:
                    | {
                        readonly Test?: ReadonlyArray<string> | null | undefined
                        readonly Interval?: bigint | undefined
                        readonly Timeout?: bigint | undefined
                        readonly StartPeriod?: bigint | undefined
                        readonly StartInterval?: bigint | undefined
                        readonly Retries?: bigint | undefined
                      }
                    | null
                    | undefined
                  readonly ArgsEscaped?: boolean | undefined
                  readonly Volumes?: { readonly [x: string]: object } | null | undefined
                  readonly WorkingDir?: string | undefined
                  readonly Entrypoint?: ReadonlyArray<string> | null | undefined
                  readonly OnBuild?: ReadonlyArray<string> | null | undefined
                  readonly Labels?: { readonly [x: string]: string } | null | undefined
                  readonly StopSignal?: string | undefined
                  readonly Shell?: ReadonlyArray<string> | null | undefined
                } | null
                readonly Id: string & Brand<"ImageId">
                readonly GraphDriver: Struct.ReadonlySide<
                  { readonly Data: NullOr<$Record<String, String>>; readonly Name: String },
                  "Iso"
                > | null
                readonly Size: bigint
                readonly RepoDigests: ReadonlyArray<string & Brand<"Digest">> | null
                readonly RepoTags: ReadonlyArray<string> | null
                readonly RootFS: {
                  readonly Type?: string | undefined
                  readonly Layers?: ReadonlyArray<string> | null | undefined
                } | null
                readonly Metadata: { readonly LastTagTime?: Date | null | undefined } | null
                readonly Parent: string
                readonly Comment: string
                readonly DockerVersion: string
                readonly Author: string
                readonly Architecture: string
                readonly Os: string
                readonly ContainerConfig?:
                  | {
                      readonly Hostname: string
                      readonly Domainname: string
                      readonly User: string
                      readonly AttachStdin: boolean
                      readonly AttachStdout: boolean
                      readonly AttachStderr: boolean
                      readonly Tty: boolean
                      readonly OpenStdin: boolean
                      readonly StdinOnce: boolean
                      readonly Env: ReadonlyArray<string> | null
                      readonly Cmd: ReadonlyArray<string> | null
                      readonly Volumes: { readonly [x: string]: object } | null
                      readonly WorkingDir: string
                      readonly Entrypoint: ReadonlyArray<string> | null
                      readonly OnBuild: ReadonlyArray<string> | null
                      readonly Labels: { readonly [x: string]: string } | null
                      readonly Image: string
                      readonly ExposedPorts?:
                        | {
                            readonly [x: `${number}`]: object
                            readonly [x: `${number}/tcp`]: object
                            readonly [x: `${number}/udp`]: object
                          }
                        | null
                        | undefined
                      readonly Healthcheck?:
                        | {
                            readonly Test?: ReadonlyArray<string> | null | undefined
                            readonly Interval?: bigint | undefined
                            readonly Timeout?: bigint | undefined
                            readonly StartPeriod?: bigint | undefined
                            readonly StartInterval?: bigint | undefined
                            readonly Retries?: bigint | undefined
                          }
                        | null
                        | undefined
                      readonly ArgsEscaped?: boolean | undefined
                      readonly NetworkDisabled?: boolean | undefined
                      readonly MacAddress?: string | undefined
                      readonly StopSignal?: string | undefined
                      readonly StopTimeout?: bigint | null | undefined
                      readonly Shell?: ReadonlyArray<string> | null | undefined
                    }
                  | null
                  | undefined
                readonly Created?: string | undefined
                readonly Descriptor?:
                  | {
                      readonly size: bigint
                      readonly mediaType: string
                      readonly digest: string & Brand<"Digest">
                      readonly urls?: ReadonlyArray<string> | null | undefined
                      readonly annotations?: { readonly [x: string]: string } | null | undefined
                      readonly data?: Uint8Array<ArrayBufferLike> | null | undefined
                      readonly platform?:
                        | {
                            readonly architecture: string
                            readonly os: string
                            readonly "os.version"?: string | undefined
                            readonly "os.features"?: ReadonlyArray<string> | null | undefined
                            readonly variant?: string | undefined
                          }
                        | null
                        | undefined
                      readonly artifactType?: string | undefined
                    }
                  | null
                  | undefined
                readonly Manifests?:
                  | ReadonlyArray<{
                      readonly Kind: "image" | "attestation" | "unknown"
                      readonly Descriptor: {
                        readonly size: bigint
                        readonly mediaType: string
                        readonly digest: string & Brand<"Digest">
                        readonly urls?: ReadonlyArray<string> | null | undefined
                        readonly annotations?: { readonly [x: string]: string } | null | undefined
                        readonly data?: Uint8Array<ArrayBufferLike> | null | undefined
                        readonly platform?:
                          | {
                              readonly architecture: string
                              readonly os: string
                              readonly "os.version"?: string | undefined
                              readonly "os.features"?: ReadonlyArray<string> | null | undefined
                              readonly variant?: string | undefined
                            }
                          | null
                          | undefined
                        readonly artifactType?: string | undefined
                      } | null
                      readonly Size: Struct.ReadonlySide<
                        { readonly Content: BigIntFromString; readonly Total: BigIntFromString },
                        "Iso"
                      >
                      readonly ID: string
                      readonly Available: boolean
                      readonly ImageData?:
                        | Struct.ReadonlySide<
                            {
                              readonly Platform: NullOr<typeof V1Platform>
                              readonly Size: Struct<{ readonly Unpacked: BigIntFromString }>
                              readonly Containers: NullOr<$Array<String>>
                            },
                            "Iso"
                          >
                        | null
                        | undefined
                      readonly AttestationData?:
                        Struct.ReadonlySide<{ readonly For: brand<String, "Digest"> }, "Iso"> | null | undefined
                    } | null>
                  | null
                  | undefined
                readonly VirtualSize?: bigint | undefined
                readonly Container?: string | undefined
                readonly Variant?: string | undefined
                readonly OsVersion?: string | undefined
              }
            >,
            Struct<{
              readonly Id: brand<String, "ImageId">
              readonly RepoTags: NullOr<$Array<String>>
              readonly RepoDigests: NullOr<$Array<brand<String, "Digest">>>
              readonly Parent: String
              readonly Comment: String
              readonly Created: optional<String>
              readonly Container: optional<String>
              readonly ContainerConfig: optional<NullOr<typeof ContainerConfig>>
              readonly DockerVersion: String
              readonly Author: String
              readonly Config: NullOr<typeof V1DockerOCIImageConfig>
              readonly Architecture: String
              readonly Variant: optional<String>
              readonly Os: String
              readonly OsVersion: optional<String>
              readonly Size: BigIntFromString
              readonly VirtualSize: optional<BigIntFromString>
              readonly GraphDriver: NullOr<typeof StorageDriverData>
              readonly RootFS: NullOr<typeof ImageRootFS>
              readonly Metadata: NullOr<typeof ImageMetadata>
              readonly Descriptor: optional<NullOr<typeof V1Descriptor>>
              readonly Manifests: optional<NullOr<$Array<NullOr<typeof ImageManifestSummary>>>>
            }>,
            never,
            never
          >
        >,
        toCodecJson<typeof InternalServerError | typeof NotFound>,
        never,
        never
      >
    | HttpApiEndpoint<
        "export",
        "GET",
        "/images/:name/get",
        toCodecStringTree<Struct<{ name: String }>>,
        toCodecStringTree<Struct<{ platform: optional<String> }>>,
        never,
        never,
        StreamUint8Array,
        toCodecJson<typeof InternalServerError | typeof NotFound>,
        never,
        never
      >
    | HttpApiEndpoint<
        "exportMany",
        "GET",
        "/images/get",
        never,
        toCodecStringTree<Struct<{ names: optional<String>; platform: optional<String> }>>,
        never,
        never,
        StreamUint8Array,
        toCodecJson<typeof InternalServerError | typeof NotFound>,
        never,
        never
      >
    | HttpApiEndpoint<
        "import",
        "POST",
        "/images/load",
        never,
        toCodecStringTree<Struct<{ platform: optional<String>; quiet: optional<Boolean> }>>,
        toCodecJson<StreamUint8Array>,
        never,
        StreamUint8Array,
        toCodecJson<typeof BadRequest | typeof InternalServerError>,
        never,
        never
      >,
    false
  >
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
        "/networks/",
        never,
        toCodecStringTree<
          Struct<{
            filters: optional<
              Struct<{
                readonly dangling: optional<
                  Union<
                    readonly [
                      decodeTo<Literal<true>, Literal<"true">, never, never>,
                      decodeTo<Literal<false>, Literal<"false">, never, never>
                    ]
                  >
                >
                readonly driver: optional<$Array<String>>
                readonly id: optional<$Array<String>>
                readonly label: optional<$Array<String>>
                readonly name: optional<$Array<String>>
                readonly scope: optional<$Array<String>>
                readonly type: optional<Literals<readonly ["custom", "builtin"]>>
              }>
            >
          }>
        >,
        never,
        never,
        toCodecJson<$Array<typeof NetworkInspect>>,
        toCodecJson<typeof InternalServerError>,
        never,
        never
      >
    | HttpApiEndpoint<
        "create",
        "POST",
        "/networks/create",
        never,
        never,
        toCodecJson<typeof NetworkCreateRequest>,
        never,
        toCodecJson<Struct<{ readonly Id: brand<String, "NetworkId"> }>>,
        toCodecJson<typeof BadRequest | typeof InternalServerError | typeof Forbidden | typeof NotFound>,
        never,
        never
      >
    | HttpApiEndpoint<
        "inspect",
        "GET",
        "/networks/:id",
        toCodecStringTree<Struct<{ id: String }>>,
        toCodecStringTree<Struct<{ verbose: optional<Boolean>; scope: optional<String> }>>,
        never,
        never,
        toCodecJson<typeof NetworkInspect>,
        toCodecJson<typeof InternalServerError | typeof NotFound>,
        never,
        never
      >
    | HttpApiEndpoint<
        "delete",
        "DELETE",
        "/networks/:id",
        toCodecStringTree<Struct<{ id: String }>>,
        never,
        never,
        never,
        toCodecJson<NoContent>,
        toCodecJson<typeof InternalServerError | typeof Forbidden | typeof NotFound>,
        never,
        never
      >
    | HttpApiEndpoint<
        "connect",
        "POST",
        "/networks/:id/connect",
        toCodecStringTree<Struct<{ id: String }>>,
        never,
        toCodecJson<typeof NetworkConnectOptions>,
        never,
        toCodecJson<Void>,
        toCodecJson<typeof BadRequest | typeof InternalServerError | typeof Forbidden | typeof NotFound>,
        never,
        never
      >
    | HttpApiEndpoint<
        "disconnect",
        "POST",
        "/networks/:id/disconnect",
        toCodecStringTree<Struct<{ id: String }>>,
        never,
        toCodecJson<Struct<{ readonly Container: brand<String, "ContainerId">; readonly Force: Boolean }>>,
        never,
        toCodecJson<Void>,
        toCodecJson<typeof InternalServerError | typeof Forbidden | typeof NotFound>,
        never,
        never
      >
    | HttpApiEndpoint<
        "prune",
        "POST",
        "/networks/prune",
        never,
        toCodecStringTree<
          Struct<{
            filters: optional<Struct<{ readonly label: optional<$Array<String>>; readonly until: optional<String> }>>
          }>
        >,
        never,
        never,
        toCodecJson<Struct<{ readonly NetworksDeleted: NullishOr<$Array<String>> }>>,
        toCodecJson<typeof InternalServerError>,
        never,
        never
      >,
    false
  >
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
        "/nodes/",
        never,
        toCodecStringTree<
          Struct<{
            filters: optional<
              Struct<{
                readonly id: optional<$Array<String>>
                readonly label: optional<$Array<String>>
                readonly membership: optional<$Array<Literals<readonly ["accepted", "pending"]>>>
                readonly name: optional<$Array<String>>
                readonly "node.label": optional<$Array<String>>
                readonly role: optional<$Array<Literals<readonly ["manager", "worker"]>>>
              }>
            >
          }>
        >,
        never,
        never,
        toCodecJson<$Array<typeof SwarmNode>>,
        toCodecJson<typeof InternalServerError | typeof ServiceUnavailable>,
        never,
        never
      >
    | HttpApiEndpoint<
        "inspect",
        "GET",
        "/nodes/:id",
        toCodecStringTree<Struct<{ id: String }>>,
        never,
        never,
        never,
        toCodecJson<typeof SwarmNode>,
        toCodecJson<typeof InternalServerError | typeof NotFound | typeof ServiceUnavailable>,
        never,
        never
      >
    | HttpApiEndpoint<
        "delete",
        "DELETE",
        "/nodes/:id",
        toCodecStringTree<Struct<{ id: String }>>,
        toCodecStringTree<Struct<{ force: optional<Boolean> }>>,
        never,
        never,
        toCodecJson<Void>,
        toCodecJson<typeof InternalServerError | typeof NotFound | typeof ServiceUnavailable>,
        never,
        never
      >
    | HttpApiEndpoint<
        "update",
        "POST",
        "/nodes/:id/update",
        toCodecStringTree<Struct<{ id: String }>>,
        toCodecStringTree<Struct<{ version: Number }>>,
        toCodecJson<typeof SwarmNodeSpec>,
        never,
        toCodecJson<Void>,
        toCodecJson<typeof BadRequest | typeof InternalServerError | typeof NotFound | typeof ServiceUnavailable>,
        never,
        never
      >,
    false
  >
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
        "/plugins/",
        never,
        toCodecStringTree<
          Struct<{
            filters: optional<
              Struct<{
                readonly capability: optional<$Array<String>>
                readonly enabled: optional<decodeTo<Boolean, Tuple<readonly [String]>, never, never>>
              }>
            >
          }>
        >,
        never,
        never,
        toCodecJson<$Array<typeof TypesPlugin>>,
        toCodecJson<typeof InternalServerError>,
        never,
        never
      >
    | HttpApiEndpoint<
        "getPrivileges",
        "GET",
        "/plugins/privileges",
        never,
        toCodecStringTree<Struct<{ remote: String }>>,
        never,
        never,
        toCodecJson<$Array<typeof RuntimePluginPrivilege>>,
        toCodecJson<typeof InternalServerError>,
        never,
        never
      >
    | HttpApiEndpoint<
        "pull",
        "POST",
        "/plugins/pull",
        never,
        toCodecStringTree<Struct<{ remote: String; name: optional<String> }>>,
        toCodecJson<$Array<typeof RuntimePluginPrivilege>>,
        toCodecStringTree<Struct<{ "X-Registry-Auth": optional<String> }>>,
        StreamUint8Array,
        toCodecJson<typeof InternalServerError>,
        never,
        never
      >
    | HttpApiEndpoint<
        "inspect",
        "GET",
        "/plugins/:name/json",
        toCodecStringTree<Struct<{ name: String }>>,
        never,
        never,
        never,
        toCodecJson<typeof TypesPlugin>,
        toCodecJson<typeof InternalServerError | typeof NotFound>,
        never,
        never
      >
    | HttpApiEndpoint<
        "delete",
        "DELETE",
        "/plugins/:name",
        toCodecStringTree<Struct<{ name: String }>>,
        toCodecStringTree<Struct<{ force: optional<Boolean> }>>,
        never,
        never,
        StreamUint8Array,
        toCodecJson<typeof InternalServerError | typeof NotFound>,
        never,
        never
      >
    | HttpApiEndpoint<
        "enable",
        "POST",
        "/plugins/:name/enable",
        toCodecStringTree<Struct<{ name: String }>>,
        toCodecStringTree<Struct<{ timeout: optional<Number> }>>,
        never,
        never,
        toCodecJson<Void>,
        toCodecJson<typeof InternalServerError | typeof NotFound>,
        never,
        never
      >
    | HttpApiEndpoint<
        "disable",
        "POST",
        "/plugins/:name/disable",
        toCodecStringTree<Struct<{ name: String }>>,
        toCodecStringTree<Struct<{ force: optional<Boolean> }>>,
        never,
        never,
        toCodecJson<Void>,
        toCodecJson<typeof InternalServerError | typeof NotFound>,
        never,
        never
      >
    | HttpApiEndpoint<
        "upgrade",
        "POST",
        "/plugins/:name/upgrade",
        toCodecStringTree<Struct<{ name: String }>>,
        toCodecStringTree<Struct<{ remote: String }>>,
        toCodecJson<$Array<typeof RuntimePluginPrivilege>>,
        toCodecStringTree<Struct<{ "X-Registry-Auth": optional<String> }>>,
        toCodecJson<Void>,
        toCodecJson<typeof InternalServerError | typeof NotFound>,
        never,
        never
      >
    | HttpApiEndpoint<
        "create",
        "POST",
        "/plugins/create",
        never,
        toCodecStringTree<Struct<{ name: String }>>,
        toCodecJson<StreamUint8Array>,
        never,
        toCodecJson<NoContent>,
        toCodecJson<typeof InternalServerError>,
        never,
        never
      >
    | HttpApiEndpoint<
        "push",
        "POST",
        "/plugins/:name/push",
        toCodecStringTree<Struct<{ name: String }>>,
        never,
        never,
        never,
        toCodecJson<Void>,
        toCodecJson<typeof InternalServerError | typeof NotFound>,
        never,
        never
      >
    | HttpApiEndpoint<
        "set",
        "POST",
        "/plugins/:name/set",
        toCodecStringTree<Struct<{ name: String }>>,
        never,
        toCodecJson<$Array<String>>,
        never,
        toCodecJson<NoContent>,
        toCodecJson<typeof InternalServerError | typeof NotFound>,
        never,
        never
      >,
    false
  >
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
        "/secrets/",
        never,
        toCodecStringTree<
          Struct<{
            filters: optional<
              Struct<{
                readonly id: optional<$Array<String>>
                readonly label: optional<$Array<String>>
                readonly name: optional<$Array<String>>
              }>
            >
          }>
        >,
        never,
        never,
        toCodecJson<$Array<typeof SwarmSecret>>,
        toCodecJson<typeof InternalServerError | typeof ServiceUnavailable>,
        never,
        never
      >
    | HttpApiEndpoint<
        "create",
        "POST",
        "/secrets/create",
        never,
        never,
        toCodecJson<typeof SwarmSecretSpec>,
        never,
        toCodecJson<
          decodeTo<
            Struct<{ readonly Id: brand<String, "SecretId"> }>,
            Struct<{ readonly ID: toEncoded<brand<String, "SecretId">> }>,
            never,
            never
          >
        >,
        toCodecJson<typeof InternalServerError | typeof Conflict | typeof ServiceUnavailable>,
        never,
        never
      >
    | HttpApiEndpoint<
        "inspect",
        "GET",
        "/secrets/:id",
        toCodecStringTree<Struct<{ id: String }>>,
        never,
        never,
        never,
        toCodecJson<typeof SwarmSecret>,
        toCodecJson<typeof InternalServerError | typeof NotFound | typeof ServiceUnavailable>,
        never,
        never
      >
    | HttpApiEndpoint<
        "delete",
        "DELETE",
        "/secrets/:id",
        toCodecStringTree<Struct<{ id: String }>>,
        never,
        never,
        never,
        toCodecJson<NoContent>,
        toCodecJson<typeof InternalServerError | typeof NotFound | typeof ServiceUnavailable>,
        never,
        never
      >
    | HttpApiEndpoint<
        "update",
        "POST",
        "/secrets/:id/update",
        toCodecStringTree<Struct<{ id: String }>>,
        toCodecStringTree<Struct<{ version: BigIntFromString }>>,
        toCodecJson<typeof SwarmSecretSpec>,
        never,
        toCodecJson<Void>,
        toCodecJson<typeof BadRequest | typeof InternalServerError | typeof NotFound | typeof ServiceUnavailable>,
        never,
        never
      >,
    false
  >
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
        "/services/",
        never,
        toCodecStringTree<
          Struct<{
            filters: optional<
              Struct<{
                readonly id: optional<$Array<String>>
                readonly label: optional<$Array<String>>
                readonly mode: optional<$Array<Literals<readonly ["replicated", "global"]>>>
              }>
            >
            status: optional<Boolean>
          }>
        >,
        never,
        never,
        toCodecJson<$Array<typeof SwarmService>>,
        toCodecJson<typeof InternalServerError | typeof ServiceUnavailable>,
        never,
        never
      >
    | HttpApiEndpoint<
        "create",
        "POST",
        "/services/create",
        never,
        never,
        toCodecJson<typeof SwarmServiceSpec>,
        toCodecStringTree<Struct<{ "X-Registry-Auth": optional<String> }>>,
        toCodecJson<Struct<{ readonly ID: brand<String, "ServiceId">; readonly Warnings: optional<$Array<String>> }>>,
        toCodecJson<
          | typeof BadRequest
          | typeof InternalServerError
          | typeof Forbidden
          | typeof Conflict
          | typeof ServiceUnavailable
        >,
        never,
        never
      >
    | HttpApiEndpoint<
        "delete",
        "DELETE",
        "/services/:id",
        toCodecStringTree<Struct<{ id: String }>>,
        never,
        never,
        never,
        toCodecJson<Void>,
        toCodecJson<typeof InternalServerError | typeof NotFound | typeof ServiceUnavailable>,
        never,
        never
      >
    | HttpApiEndpoint<
        "inspect",
        "GET",
        "/services/:id",
        toCodecStringTree<Struct<{ id: String }>>,
        toCodecStringTree<Struct<{ insertDefaults: optional<Boolean> }>>,
        never,
        never,
        toCodecJson<typeof SwarmService>,
        toCodecJson<typeof InternalServerError | typeof NotFound | typeof ServiceUnavailable>,
        never,
        never
      >
    | HttpApiEndpoint<
        "update",
        "POST",
        "/services/:id/update",
        toCodecStringTree<Struct<{ id: String }>>,
        toCodecStringTree<Struct<{ version: Number; rollback: optional<String>; registryAuthFrom: optional<String> }>>,
        toCodecJson<typeof SwarmServiceSpec>,
        toCodecStringTree<Struct<{ "X-Registry-Auth": optional<String> }>>,
        toCodecJson<Struct<{ readonly Warnings: optional<$Array<String>> }>>,
        toCodecJson<typeof BadRequest | typeof InternalServerError | typeof NotFound | typeof ServiceUnavailable>,
        never,
        never
      >
    | HttpApiEndpoint<
        "logs",
        "GET",
        "/services/:id/logs",
        toCodecStringTree<Struct<{ id: String }>>,
        toCodecStringTree<
          Struct<{
            details: optional<Boolean>
            follow: optional<Boolean>
            stdout: optional<Boolean>
            stderr: optional<Boolean>
            since: optional<Number>
            timestamps: optional<Boolean>
            tail: optional<String>
          }>
        >,
        never,
        never,
        StreamUint8Array,
        toCodecJson<typeof InternalServerError | typeof NotFound | typeof ServiceUnavailable>,
        never,
        never
      >,
    false
  >
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
      "/session",
      never,
      never,
      never,
      toCodecStringTree<Struct<{ Upgrade: Literal<"h2c">; Connection: Literal<"Upgrade"> }>>,
      toCodecJson<Void>,
      never,
      never,
      never
    >,
    false
  >
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
        "/swarm/",
        never,
        never,
        never,
        never,
        toCodecJson<typeof SwarmSwarm>,
        toCodecJson<typeof InternalServerError | typeof NotFound | typeof NodeNotPartOfSwarm>,
        never,
        never
      >
    | HttpApiEndpoint<
        "init",
        "POST",
        "/swarm/init",
        never,
        never,
        toCodecJson<typeof SwarmInitRequest>,
        never,
        toCodecJson<String>,
        toCodecJson<typeof BadRequest | typeof InternalServerError | typeof NodeAlreadyPartOfSwarm>,
        never,
        never
      >
    | HttpApiEndpoint<
        "join",
        "POST",
        "/swarm/join",
        never,
        never,
        toCodecJson<typeof SwarmJoinRequest>,
        never,
        toCodecJson<Void>,
        toCodecJson<typeof BadRequest | typeof InternalServerError | typeof NodeAlreadyPartOfSwarm>,
        never,
        never
      >
    | HttpApiEndpoint<
        "leave",
        "POST",
        "/swarm/leave",
        never,
        toCodecStringTree<Struct<{ force: optional<Boolean> }>>,
        never,
        never,
        toCodecJson<Void>,
        toCodecJson<typeof InternalServerError | typeof NodeNotPartOfSwarm>,
        never,
        never
      >
    | HttpApiEndpoint<
        "update",
        "POST",
        "/swarm/update",
        never,
        toCodecStringTree<
          Struct<{
            version: BigIntFromString
            rotateWorkerToken: optional<Boolean>
            rotateManagerToken: optional<Boolean>
            rotateManagerUnlockKey: optional<Boolean>
          }>
        >,
        toCodecJson<typeof SwarmSpec>,
        never,
        toCodecJson<Void>,
        toCodecJson<typeof BadRequest | typeof InternalServerError | typeof NodeNotPartOfSwarm>,
        never,
        never
      >
    | HttpApiEndpoint<
        "unlockkey",
        "GET",
        "/swarm/unlockkey",
        never,
        never,
        never,
        never,
        toCodecJson<Struct<{ readonly UnlockKey: String }>>,
        toCodecJson<typeof InternalServerError | typeof NodeNotPartOfSwarm>,
        never,
        never
      >
    | HttpApiEndpoint<
        "unlock",
        "POST",
        "/swarm/unlock",
        never,
        never,
        toCodecJson<Struct<{ readonly UnlockKey: String }>>,
        never,
        toCodecJson<Void>,
        toCodecJson<typeof InternalServerError | typeof NodeNotPartOfSwarm>,
        never,
        never
      >,
    false
  >
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
        "/auth",
        never,
        never,
        toCodecJson<typeof RegistryAuthConfig>,
        never,
        toCodecJson<Void | typeof RegistryAuthenticateOKBody>,
        toCodecJson<typeof InternalServerError | typeof Unauthorized>,
        never,
        never
      >
    | HttpApiEndpoint<
        "info",
        "GET",
        "/info",
        never,
        never,
        never,
        never,
        toCodecJson<typeof SystemInfo>,
        toCodecJson<typeof InternalServerError>,
        never,
        never
      >
    | HttpApiEndpoint<
        "version",
        "GET",
        "/version",
        never,
        never,
        never,
        never,
        toCodecJson<typeof TypesVersion>,
        toCodecJson<typeof InternalServerError>,
        never,
        never
      >
    | HttpApiEndpoint<
        "ping",
        "GET",
        "/_ping",
        never,
        never,
        never,
        never,
        toCodecJson<Literal<"OK">>,
        toCodecJson<typeof InternalServerError>,
        never,
        never
      >
    | HttpApiEndpoint<
        "pingHead",
        "HEAD",
        "/_ping",
        never,
        never,
        never,
        never,
        toCodecJson<Void>,
        toCodecJson<typeof InternalServerError>,
        never,
        never
      >
    | HttpApiEndpoint<
        "events",
        "GET",
        "/events",
        never,
        toCodecStringTree<Struct<{ since: optional<String>; until: optional<String> }>>,
        never,
        never,
        StreamUint8Array,
        toCodecJson<typeof BadRequest | typeof InternalServerError>,
        never,
        never
      >
    | HttpApiEndpoint<
        "dataUsage",
        "GET",
        "/system/df",
        never,
        toCodecStringTree<
          Struct<{ type: optional<$Array<Literals<readonly ["container", "image", "volume", "build-cache"]>>> }>
        >,
        never,
        never,
        toCodecJson<typeof TypesDiskUsage>,
        toCodecJson<typeof InternalServerError>,
        never,
        never
      >,
    false
  >
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
        "/tasks/",
        never,
        toCodecStringTree<
          Struct<{
            filters: optional<
              Struct<{
                readonly "desired-state": optional<$Array<Literals<readonly ["running", "shutdown", "accepted"]>>>
                readonly id: optional<$Array<String>>
                readonly name: optional<$Array<String>>
                readonly node: optional<$Array<String>>
                readonly service: optional<$Array<String>>
                readonly label: optional<$Array<String>>
              }>
            >
          }>
        >,
        never,
        never,
        toCodecJson<$Array<typeof SwarmTask>>,
        toCodecJson<typeof InternalServerError | typeof ServiceUnavailable>,
        never,
        never
      >
    | HttpApiEndpoint<
        "inspect",
        "GET",
        "/tasks/:id",
        toCodecStringTree<Struct<{ id: String }>>,
        never,
        never,
        never,
        toCodecJson<typeof SwarmTask>,
        toCodecJson<typeof InternalServerError | typeof NotFound | typeof ServiceUnavailable>,
        never,
        never
      >
    | HttpApiEndpoint<
        "logs",
        "GET",
        "/tasks/:id/logs",
        toCodecStringTree<Struct<{ id: String }>>,
        toCodecStringTree<
          Struct<{
            details: optional<Boolean>
            follow: optional<Boolean>
            stdout: optional<Boolean>
            stderr: optional<Boolean>
            since: optional<Number>
            timestamps: optional<Boolean>
            tail: optional<String>
          }>
        >,
        never,
        never,
        StreamUint8Array,
        toCodecJson<typeof InternalServerError | typeof NotFound | typeof ServiceUnavailable>,
        never,
        never
      >,
    false
  >
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
        "/volumes/",
        never,
        toCodecStringTree<
          Struct<{
            filters: optional<
              Struct<{
                readonly name: optional<$Array<String>>
                readonly driver: optional<$Array<String>>
                readonly label: optional<$Array<String>>
                readonly dangling: optional<$Array<Literals<readonly ["true", "false", "1", "0"]>>>
              }>
            >
          }>
        >,
        never,
        never,
        toCodecJson<
          Struct<{ readonly Volumes: $Array<typeof VolumeVolume>; readonly Warnings: NullOr<$Array<String>> }>
        >,
        toCodecJson<typeof InternalServerError>,
        never,
        never
      >
    | HttpApiEndpoint<
        "create",
        "POST",
        "/volumes/create",
        never,
        never,
        toCodecJson<typeof VolumeCreateOptions>,
        never,
        toCodecJson<
          decodeTo<
            declareConstructor<
              VolumeVolume,
              {
                readonly Labels: { readonly [x: string]: string } | null
                readonly Name: string
                readonly Options: { readonly [x: string]: string } | null
                readonly Driver: string
                readonly Scope: string
                readonly Mountpoint: string
                readonly Status?: { readonly [x: string]: object } | null | undefined
                readonly CreatedAt?: string | undefined
                readonly ClusterVolume?:
                  | {
                      readonly ID: string
                      readonly Spec: {
                        readonly Availability?: "pause" | "active" | "drain" | undefined
                        readonly Secrets?:
                          | ReadonlyArray<Struct.ReadonlySide<
                              { readonly Key: String; readonly Secret: String },
                              "Encoded"
                            > | null>
                          | null
                          | undefined
                        readonly Group?: string | undefined
                        readonly AccessMode?:
                          | {
                              readonly Scope?: "single" | "multi" | undefined
                              readonly Sharing?: "readonly" | "all" | "none" | "onewriter" | undefined
                              readonly MountVolume?:
                                | {
                                    readonly FsType?: string | undefined
                                    readonly MountFlags?: ReadonlyArray<string> | null | undefined
                                  }
                                | null
                                | undefined
                              readonly BlockVolume?: Struct.ReadonlySide<{}, "Encoded"> | null | undefined
                            }
                          | null
                          | undefined
                        readonly AccessibilityRequirements?:
                          | {
                              readonly Requisite?:
                                | ReadonlyArray<{
                                    readonly Segments?: { readonly [x: string]: string } | null | undefined
                                  } | null>
                                | null
                                | undefined
                              readonly Preferred?:
                                | ReadonlyArray<{
                                    readonly Segments?: { readonly [x: string]: string } | null | undefined
                                  } | null>
                                | null
                                | undefined
                            }
                          | null
                          | undefined
                        readonly CapacityRange?:
                          | Struct.ReadonlySide<
                              { readonly RequiredBytes: BigIntFromString; readonly LimitBytes: BigIntFromString },
                              "Encoded"
                            >
                          | null
                          | undefined
                      } | null
                      readonly Version?: { readonly Index?: string | undefined } | null | undefined
                      readonly CreatedAt?: string | null | undefined
                      readonly UpdatedAt?: string | null | undefined
                      readonly Info?:
                        | {
                            readonly AccessibleTopology?:
                              | ReadonlyArray<{
                                  readonly Segments?: { readonly [x: string]: string } | null | undefined
                                } | null>
                              | null
                              | undefined
                            readonly CapacityBytes?: string | undefined
                            readonly VolumeContext?: { readonly [x: string]: string } | null | undefined
                            readonly VolumeID?: string | undefined
                          }
                        | null
                        | undefined
                      readonly PublishStatus?:
                        | ReadonlyArray<{
                            readonly State?:
                              | "pending-publish"
                              | "published"
                              | "pending-node-unpublish"
                              | "pending-controller-unpublish"
                              | undefined
                            readonly NodeID?: string | undefined
                            readonly PublishContext?: { readonly [x: string]: string } | null | undefined
                          } | null>
                        | null
                        | undefined
                    }
                  | null
                  | undefined
                readonly UsageData?:
                  | Struct.ReadonlySide<
                      { readonly RefCount: BigIntFromString; readonly Size: BigIntFromString },
                      "Encoded"
                    >
                  | null
                  | undefined
              },
              readonly [
                Struct<{
                  readonly ClusterVolume: optional<NullOr<typeof VolumeClusterVolume>>
                  readonly CreatedAt: optional<DateFromString>
                  readonly Driver: String
                  readonly Labels: NullOr<$Record<String, String>>
                  readonly Mountpoint: String
                  readonly Name: brand<String, "VolumeId">
                  readonly Options: NullOr<$Record<String, String>>
                  readonly Scope: String
                  readonly Status: optional<NullOr<$Record<String, ObjectKeyword>>>
                  readonly UsageData: optional<NullOr<typeof VolumeUsageData>>
                }>
              ],
              {
                readonly Labels: { readonly [x: string]: string } | null
                readonly Name: string & Brand<"VolumeId">
                readonly Options: { readonly [x: string]: string } | null
                readonly Driver: string
                readonly Scope: string
                readonly Mountpoint: string
                readonly Status?: { readonly [x: string]: object } | null | undefined
                readonly CreatedAt?: Date | undefined
                readonly ClusterVolume?:
                  | {
                      readonly ID: string
                      readonly Spec: {
                        readonly Availability?: "pause" | "active" | "drain" | undefined
                        readonly Secrets?:
                          | ReadonlyArray<Struct.ReadonlySide<
                              { readonly Key: String; readonly Secret: String },
                              "Iso"
                            > | null>
                          | null
                          | undefined
                        readonly Group?: string | undefined
                        readonly AccessMode?:
                          | {
                              readonly Scope?: "single" | "multi" | undefined
                              readonly Sharing?: "readonly" | "all" | "none" | "onewriter" | undefined
                              readonly MountVolume?:
                                | {
                                    readonly FsType?: string | undefined
                                    readonly MountFlags?: ReadonlyArray<string> | null | undefined
                                  }
                                | null
                                | undefined
                              readonly BlockVolume?: Struct.ReadonlySide<{}, "Iso"> | null | undefined
                            }
                          | null
                          | undefined
                        readonly AccessibilityRequirements?:
                          | {
                              readonly Requisite?:
                                | ReadonlyArray<{
                                    readonly Segments?: { readonly [x: string]: string } | null | undefined
                                  } | null>
                                | null
                                | undefined
                              readonly Preferred?:
                                | ReadonlyArray<{
                                    readonly Segments?: { readonly [x: string]: string } | null | undefined
                                  } | null>
                                | null
                                | undefined
                            }
                          | null
                          | undefined
                        readonly CapacityRange?:
                          | Struct.ReadonlySide<
                              { readonly RequiredBytes: BigIntFromString; readonly LimitBytes: BigIntFromString },
                              "Iso"
                            >
                          | null
                          | undefined
                      } | null
                      readonly Version?: { readonly Index?: bigint | undefined } | null | undefined
                      readonly CreatedAt?: Date | null | undefined
                      readonly UpdatedAt?: Date | null | undefined
                      readonly Info?:
                        | {
                            readonly AccessibleTopology?:
                              | ReadonlyArray<{
                                  readonly Segments?: { readonly [x: string]: string } | null | undefined
                                } | null>
                              | null
                              | undefined
                            readonly CapacityBytes?: bigint | undefined
                            readonly VolumeContext?: { readonly [x: string]: string } | null | undefined
                            readonly VolumeID?: string | undefined
                          }
                        | null
                        | undefined
                      readonly PublishStatus?:
                        | ReadonlyArray<{
                            readonly State?:
                              | "pending-publish"
                              | "published"
                              | "pending-node-unpublish"
                              | "pending-controller-unpublish"
                              | undefined
                            readonly NodeID?: (string & Brand<"NodeId">) | undefined
                            readonly PublishContext?: { readonly [x: string]: string } | null | undefined
                          } | null>
                        | null
                        | undefined
                    }
                  | null
                  | undefined
                readonly UsageData?:
                  | Struct.ReadonlySide<{ readonly RefCount: BigIntFromString; readonly Size: BigIntFromString }, "Iso">
                  | null
                  | undefined
              }
            >,
            Struct<{
              readonly ClusterVolume: optional<NullOr<typeof VolumeClusterVolume>>
              readonly CreatedAt: optional<DateFromString>
              readonly Driver: String
              readonly Labels: NullOr<$Record<String, String>>
              readonly Mountpoint: String
              readonly Name: brand<String, "VolumeId">
              readonly Options: NullOr<$Record<String, String>>
              readonly Scope: String
              readonly Status: optional<NullOr<$Record<String, ObjectKeyword>>>
              readonly UsageData: optional<NullOr<typeof VolumeUsageData>>
            }>,
            never,
            never
          >
        >,
        toCodecJson<typeof InternalServerError>,
        never,
        never
      >
    | HttpApiEndpoint<
        "inspect",
        "GET",
        "/volumes/:name",
        toCodecStringTree<Struct<{ name: String }>>,
        never,
        never,
        never,
        toCodecJson<typeof VolumeVolume>,
        toCodecJson<typeof InternalServerError | typeof NotFound>,
        never,
        never
      >
    | HttpApiEndpoint<
        "delete",
        "DELETE",
        "/volumes/:name",
        toCodecStringTree<Struct<{ name: String }>>,
        toCodecStringTree<Struct<{ force: optional<Boolean> }>>,
        never,
        never,
        toCodecJson<NoContent>,
        toCodecJson<typeof InternalServerError | typeof NotFound | typeof Conflict>,
        never,
        never
      >
    | HttpApiEndpoint<
        "update",
        "PUT",
        "/volumes/:name",
        toCodecStringTree<Struct<{ name: String }>>,
        toCodecStringTree<Struct<{ version: Number }>>,
        toCodecJson<typeof VolumeClusterVolumeSpec>,
        never,
        toCodecJson<Void>,
        toCodecJson<typeof BadRequest | typeof InternalServerError | typeof NotFound | typeof ServiceUnavailable>,
        never,
        never
      >
    | HttpApiEndpoint<
        "prune",
        "POST",
        "/volumes/prune",
        never,
        toCodecStringTree<
          Struct<{
            filters: optional<
              Struct<{
                readonly label: optional<$Array<String>>
                readonly all: optional<$Array<Literals<readonly ["true", "false", "1", "0"]>>>
              }>
            >
          }>
        >,
        never,
        never,
        toCodecJson<
          Struct<{
            readonly VolumesDeleted: optional<$Array<brand<String, "VolumeId">>>
            readonly SpaceReclaimed: BigIntFromString
          }>
        >,
        toCodecJson<typeof InternalServerError>,
        never,
        never
      >,
    false
  >
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
