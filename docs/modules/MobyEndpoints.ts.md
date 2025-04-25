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

- [Errors](#errors)
  - [ConfigsError](#configserror)
  - [ContainersError](#containerserror)
  - [DistributionsError](#distributionserror)
  - [ExecsError](#execserror)
  - [ImagesError](#imageserror)
  - [NetworksError](#networkserror)
  - [NodesError](#nodeserror)
  - [PluginsError](#pluginserror)
  - [SecretsError](#secretserror)
  - [ServicesError](#serviceserror)
  - [SessionsError](#sessionserror)
  - [SwarmsError](#swarmserror)
  - [SystemsError](#systemserror)
  - [TasksError](#taskserror)
  - [VolumesError](#volumeserror)
  - [isConfigsError](#isconfigserror)
  - [isContainersError](#iscontainerserror)
  - [isDistributionsError](#isdistributionserror)
  - [isExecsError](#isexecserror)
  - [isImagesError](#isimageserror)
  - [isNetworksError](#isnetworkserror)
  - [isNodesError](#isnodeserror)
  - [isPluginsError](#ispluginserror)
  - [isSecretsError](#issecretserror)
  - [isServicesError](#isserviceserror)
  - [isSessionsError](#issessionserror)
  - [isSwarmsError](#isswarmserror)
  - [isSystemsError](#issystemserror)
  - [isTasksError](#istaskserror)
  - [isVolumesError](#isvolumeserror)
- [Layers](#layers)
  - [Configs](#configs)
  - [ConfigsLayer](#configslayer)
  - [Containers](#containers)
  - [ContainersLayer](#containerslayer)
  - [Distributions](#distributions)
  - [DistributionsLayer](#distributionslayer)
  - [Execs](#execs)
  - [ExecsLayer](#execslayer)
  - [Images](#images)
  - [ImagesLayer](#imageslayer)
  - [Networks](#networks)
  - [NetworksLayer](#networkslayer)
  - [Nodes](#nodes)
  - [NodesLayer](#nodeslayer)
  - [Plugins](#plugins)
  - [PluginsLayer](#pluginslayer)
  - [Secrets](#secrets)
  - [SecretsLayer](#secretslayer)
  - [Services](#services)
  - [ServicesLayer](#serviceslayer)
  - [Sessions](#sessions)
  - [SessionsLayer](#sessionslayer)
  - [Swarm](#swarm)
  - [SwarmLayer](#swarmlayer)
  - [Systems](#systems)
  - [SystemsLayer](#systemslayer)
  - [Tasks](#tasks)
  - [TasksLayer](#taskslayer)
  - [Volumes](#volumes)
  - [VolumesLayer](#volumeslayer)

---

# Errors

## ConfigsError

**Signature**

```ts
declare const ConfigsError: typeof ConfigsError
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyEndpoints.ts#L22)

Since v1.0.0

## ContainersError

**Signature**

```ts
declare const ContainersError: typeof ContainersError
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyEndpoints.ts#L53)

Since v1.0.0

## DistributionsError

**Signature**

```ts
declare const DistributionsError: typeof DistributionsError
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyEndpoints.ts#L81)

Since v1.0.0

## ExecsError

**Signature**

```ts
declare const ExecsError: typeof ExecsError
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyEndpoints.ts#L109)

Since v1.0.0

## ImagesError

**Signature**

```ts
declare const ImagesError: typeof ImagesError
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyEndpoints.ts#L137)

Since v1.0.0

## NetworksError

**Signature**

```ts
declare const NetworksError: typeof NetworksError
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyEndpoints.ts#L171)

Since v1.0.0

## NodesError

**Signature**

```ts
declare const NodesError: typeof NodesError
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyEndpoints.ts#L199)

Since v1.0.0

## PluginsError

**Signature**

```ts
declare const PluginsError: typeof PluginsError
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyEndpoints.ts#L227)

Since v1.0.0

## SecretsError

**Signature**

```ts
declare const SecretsError: typeof SecretsError
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyEndpoints.ts#L258)

Since v1.0.0

## ServicesError

**Signature**

```ts
declare const ServicesError: typeof ServicesError
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyEndpoints.ts#L292)

Since v1.0.0

## SessionsError

**Signature**

```ts
declare const SessionsError: typeof SessionsError
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyEndpoints.ts#L323)

Since v1.0.0

## SwarmsError

**Signature**

```ts
declare const SwarmsError: typeof SwarmsError
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyEndpoints.ts#L364)

Since v1.0.0

## SystemsError

**Signature**

```ts
declare const SystemsError: typeof SystemsError
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyEndpoints.ts#L385)

Since v1.0.0

## TasksError

**Signature**

```ts
declare const TasksError: typeof TasksError
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyEndpoints.ts#L416)

Since v1.0.0

## VolumesError

**Signature**

```ts
declare const VolumesError: typeof VolumesError
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyEndpoints.ts#L447)

Since v1.0.0

## isConfigsError

**Signature**

```ts
declare const isConfigsError: (u: unknown) => u is ConfigsError
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyEndpoints.ts#L38)

Since v1.0.0

## isContainersError

**Signature**

```ts
declare const isContainersError: (u: unknown) => u is ContainersError
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyEndpoints.ts#L66)

Since v1.0.0

## isDistributionsError

**Signature**

```ts
declare const isDistributionsError: (u: unknown) => u is DistributionsError
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyEndpoints.ts#L94)

Since v1.0.0

## isExecsError

**Signature**

```ts
declare const isExecsError: (u: unknown) => u is ExecsError
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyEndpoints.ts#L122)

Since v1.0.0

## isImagesError

**Signature**

```ts
declare const isImagesError: (u: unknown) => u is ImagesError
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyEndpoints.ts#L150)

Since v1.0.0

## isNetworksError

**Signature**

```ts
declare const isNetworksError: (u: unknown) => u is NetworksError
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyEndpoints.ts#L158)

Since v1.0.0

## isNodesError

**Signature**

```ts
declare const isNodesError: (u: unknown) => u is NodesError
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyEndpoints.ts#L186)

Since v1.0.0

## isPluginsError

**Signature**

```ts
declare const isPluginsError: (u: unknown) => u is PluginsError
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyEndpoints.ts#L214)

Since v1.0.0

## isSecretsError

**Signature**

```ts
declare const isSecretsError: (u: unknown) => u is SecretsError
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyEndpoints.ts#L242)

Since v1.0.0

## isServicesError

**Signature**

```ts
declare const isServicesError: (u: unknown) => u is ServicesError
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyEndpoints.ts#L276)

Since v1.0.0

## isSessionsError

**Signature**

```ts
declare const isSessionsError: (u: unknown) => u is SessionsError
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyEndpoints.ts#L310)

Since v1.0.0

## isSwarmsError

**Signature**

```ts
declare const isSwarmsError: (u: unknown) => u is SwarmsError
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyEndpoints.ts#L338)

Since v1.0.0

## isSystemsError

**Signature**

```ts
declare const isSystemsError: (u: unknown) => u is SystemsError
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyEndpoints.ts#L372)

Since v1.0.0

## isTasksError

**Signature**

```ts
declare const isTasksError: (u: unknown) => u is TasksError
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyEndpoints.ts#L400)

Since v1.0.0

## isVolumesError

**Signature**

```ts
declare const isVolumesError: (u: unknown) => u is VolumesError
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyEndpoints.ts#L434)

Since v1.0.0

# Layers

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

## ConfigsLayer

Configs are application configurations that can be used by services.
Swarm mode must be enabled for these endpoints to work.

**See**

- https://docs.docker.com/reference/api/engine/latest/#tag/Config

**Signature**

```ts
declare const ConfigsLayer: Layer<Configs, never, HttpClient>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyEndpoints.ts#L32)

Since v1.0.0

## Containers

**See**

- https://docs.docker.com/reference/api/engine/latest/#tag/Container

**Signature**

```ts
declare const Containers: typeof Containers
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyEndpoints.ts#L47)

Since v1.0.0

## ContainersLayer

**See**

- https://docs.docker.com/reference/api/engine/latest/#tag/Container

**Signature**

```ts
declare const ContainersLayer: Layer<Containers, never, HttpClient | WebSocketConstructor>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyEndpoints.ts#L60)

Since v1.0.0

## Distributions

**See**

- https://docs.docker.com/engine/api/v1.45/#tag/Distribution

**Signature**

```ts
declare const Distributions: typeof Distributions
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyEndpoints.ts#L75)

Since v1.0.0

## DistributionsLayer

**See**

- https://docs.docker.com/engine/api/v1.45/#tag/Distribution

**Signature**

```ts
declare const DistributionsLayer: Layer<Distributions, never, HttpClient>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyEndpoints.ts#L88)

Since v1.0.0

## Execs

**See**

- https://docs.docker.com/reference/api/engine/latest/#tag/Exec

**Signature**

```ts
declare const Execs: typeof Execs
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyEndpoints.ts#L103)

Since v1.0.0

## ExecsLayer

**See**

- https://docs.docker.com/reference/api/engine/latest/#tag/Exec

**Signature**

```ts
declare const ExecsLayer: Layer<Execs, never, HttpClient>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyEndpoints.ts#L116)

Since v1.0.0

## Images

**See**

- https://docs.docker.com/reference/api/engine/latest/#tag/Image

**Signature**

```ts
declare const Images: typeof Images
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyEndpoints.ts#L131)

Since v1.0.0

## ImagesLayer

**See**

- https://docs.docker.com/reference/api/engine/latest/#tag/Image

**Signature**

```ts
declare const ImagesLayer: Layer<Images, never, HttpClient>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyEndpoints.ts#L144)

Since v1.0.0

## Networks

**See**

- https://docs.docker.com/reference/api/engine/latest/#tag/Network

**Signature**

```ts
declare const Networks: typeof Networks
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyEndpoints.ts#L165)

Since v1.0.0

## NetworksLayer

**See**

- https://docs.docker.com/reference/api/engine/latest/#tag/Network

**Signature**

```ts
declare const NetworksLayer: Layer<Networks, never, HttpClient>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyEndpoints.ts#L178)

Since v1.0.0

## Nodes

**See**

- https://docs.docker.com/engine/api/v1.45/#tag/Node

**Signature**

```ts
declare const Nodes: typeof Nodes
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyEndpoints.ts#L193)

Since v1.0.0

## NodesLayer

**See**

- https://docs.docker.com/engine/api/v1.45/#tag/Node

**Signature**

```ts
declare const NodesLayer: Layer<Nodes, never, HttpClient>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyEndpoints.ts#L206)

Since v1.0.0

## Plugins

**See**

- https://docs.docker.com/engine/api/v1.45/#tag/Plugin

**Signature**

```ts
declare const Plugins: typeof Plugins
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyEndpoints.ts#L221)

Since v1.0.0

## PluginsLayer

**See**

- https://docs.docker.com/engine/api/v1.45/#tag/Plugin

**Signature**

```ts
declare const PluginsLayer: Layer<Plugins, never, HttpClient>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyEndpoints.ts#L234)

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

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyEndpoints.ts#L252)

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

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyEndpoints.ts#L286)

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

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyEndpoints.ts#L302)

Since v1.0.0

## Sessions

**See**

- https://docs.docker.com/reference/api/engine/latest/#tag/Session

**Signature**

```ts
declare const Sessions: typeof Sessions
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyEndpoints.ts#L317)

Since v1.0.0

## SessionsLayer

**See**

- https://docs.docker.com/reference/api/engine/latest/#tag/Session

**Signature**

```ts
declare const SessionsLayer: Layer<Sessions, never, HttpClient>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyEndpoints.ts#L330)

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

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyEndpoints.ts#L348)

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

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyEndpoints.ts#L358)

Since v1.0.0

## Systems

**See**

- https://docs.docker.com/reference/api/engine/latest/#tag/System

**Signature**

```ts
declare const Systems: typeof Systems
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyEndpoints.ts#L379)

Since v1.0.0

## SystemsLayer

**See**

- https://docs.docker.com/reference/api/engine/latest/#tag/System

**Signature**

```ts
declare const SystemsLayer: Layer<Systems, never, HttpClient>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyEndpoints.ts#L392)

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

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyEndpoints.ts#L410)

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

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyEndpoints.ts#L426)

Since v1.0.0

## Volumes

**See**

- https://docs.docker.com/reference/api/engine/latest/#tag/Volume

**Signature**

```ts
declare const Volumes: typeof Volumes
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyEndpoints.ts#L441)

Since v1.0.0

## VolumesLayer

**See**

- https://docs.docker.com/reference/api/engine/latest/#tag/Volume

**Signature**

```ts
declare const VolumesLayer: Layer<Volumes, never, HttpClient>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyEndpoints.ts#L454)

Since v1.0.0
