---
title: MobyEndpoints.ts
nav_order: 9
parent: Modules
---

## MobyEndpoints overview

Moby endpoints.

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

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
export declare const ConfigsError: typeof ConfigsError
```

Added in v1.0.0

## ContainersError

**Signature**

```ts
export declare const ContainersError: typeof ContainersError
```

Added in v1.0.0

## DistributionsError

**Signature**

```ts
export declare const DistributionsError: typeof DistributionsError
```

Added in v1.0.0

## ExecsError

**Signature**

```ts
export declare const ExecsError: typeof ExecsError
```

Added in v1.0.0

## ImagesError

**Signature**

```ts
export declare const ImagesError: typeof ImagesError
```

Added in v1.0.0

## NetworksError

**Signature**

```ts
export declare const NetworksError: typeof NetworksError
```

Added in v1.0.0

## NodesError

**Signature**

```ts
export declare const NodesError: typeof NodesError
```

Added in v1.0.0

## PluginsError

**Signature**

```ts
export declare const PluginsError: typeof PluginsError
```

Added in v1.0.0

## SecretsError

**Signature**

```ts
export declare const SecretsError: typeof SecretsError
```

Added in v1.0.0

## ServicesError

**Signature**

```ts
export declare const ServicesError: typeof ServicesError
```

Added in v1.0.0

## SessionsError

**Signature**

```ts
export declare const SessionsError: typeof SessionsError
```

Added in v1.0.0

## SwarmsError

**Signature**

```ts
export declare const SwarmsError: typeof SwarmsError
```

Added in v1.0.0

## SystemsError

**Signature**

```ts
export declare const SystemsError: typeof SystemsError
```

Added in v1.0.0

## TasksError

**Signature**

```ts
export declare const TasksError: typeof TasksError
```

Added in v1.0.0

## VolumesError

**Signature**

```ts
export declare const VolumesError: typeof VolumesError
```

Added in v1.0.0

## isConfigsError

**Signature**

```ts
export declare const isConfigsError: (u: unknown) => u is ConfigsError
```

Added in v1.0.0

## isContainersError

**Signature**

```ts
export declare const isContainersError: (u: unknown) => u is ContainersError
```

Added in v1.0.0

## isDistributionsError

**Signature**

```ts
export declare const isDistributionsError: (u: unknown) => u is DistributionsError
```

Added in v1.0.0

## isExecsError

**Signature**

```ts
export declare const isExecsError: (u: unknown) => u is ExecsError
```

Added in v1.0.0

## isImagesError

**Signature**

```ts
export declare const isImagesError: (u: unknown) => u is ImagesError
```

Added in v1.0.0

## isNetworksError

**Signature**

```ts
export declare const isNetworksError: (u: unknown) => u is NetworksError
```

Added in v1.0.0

## isNodesError

**Signature**

```ts
export declare const isNodesError: (u: unknown) => u is NodesError
```

Added in v1.0.0

## isPluginsError

**Signature**

```ts
export declare const isPluginsError: (u: unknown) => u is PluginsError
```

Added in v1.0.0

## isSecretsError

**Signature**

```ts
export declare const isSecretsError: (u: unknown) => u is SecretsError
```

Added in v1.0.0

## isServicesError

**Signature**

```ts
export declare const isServicesError: (u: unknown) => u is ServicesError
```

Added in v1.0.0

## isSessionsError

**Signature**

```ts
export declare const isSessionsError: (u: unknown) => u is SessionsError
```

Added in v1.0.0

## isSwarmsError

**Signature**

```ts
export declare const isSwarmsError: (u: unknown) => u is SwarmsError
```

Added in v1.0.0

## isSystemsError

**Signature**

```ts
export declare const isSystemsError: (u: unknown) => u is SystemsError
```

Added in v1.0.0

## isTasksError

**Signature**

```ts
export declare const isTasksError: (u: unknown) => u is TasksError
```

Added in v1.0.0

## isVolumesError

**Signature**

```ts
export declare const isVolumesError: (u: unknown) => u is VolumesError
```

Added in v1.0.0

# Layers

## Configs

Configs are application configurations that can be used by services.
Swarm mode must be enabled for these endpoints to work.

**Signature**

```ts
export declare const Configs: typeof Configs
```

Added in v1.0.0

## ConfigsLayer

Configs are application configurations that can be used by services.
Swarm mode must be enabled for these endpoints to work.

**Signature**

```ts
export declare const ConfigsLayer: Layer<Configs, never, HttpClient>
```

Added in v1.0.0

## Containers

**Signature**

```ts
export declare const Containers: typeof Containers
```

Added in v1.0.0

## ContainersLayer

**Signature**

```ts
export declare const ContainersLayer: Layer<Containers, never, HttpClient | WebSocketConstructor>
```

Added in v1.0.0

## Distributions

**Signature**

```ts
export declare const Distributions: typeof Distributions
```

Added in v1.0.0

## DistributionsLayer

**Signature**

```ts
export declare const DistributionsLayer: Layer<Distributions, never, HttpClient>
```

Added in v1.0.0

## Execs

**Signature**

```ts
export declare const Execs: typeof Execs
```

Added in v1.0.0

## ExecsLayer

**Signature**

```ts
export declare const ExecsLayer: Layer<Execs, never, HttpClient>
```

Added in v1.0.0

## Images

**Signature**

```ts
export declare const Images: typeof Images
```

Added in v1.0.0

## ImagesLayer

**Signature**

```ts
export declare const ImagesLayer: Layer<Images, never, HttpClient>
```

Added in v1.0.0

## Networks

**Signature**

```ts
export declare const Networks: typeof Networks
```

Added in v1.0.0

## NetworksLayer

**Signature**

```ts
export declare const NetworksLayer: Layer<Networks, never, HttpClient>
```

Added in v1.0.0

## Nodes

**Signature**

```ts
export declare const Nodes: typeof Nodes
```

Added in v1.0.0

## NodesLayer

**Signature**

```ts
export declare const NodesLayer: Layer<Nodes, never, HttpClient>
```

Added in v1.0.0

## Plugins

**Signature**

```ts
export declare const Plugins: typeof Plugins
```

Added in v1.0.0

## PluginsLayer

**Signature**

```ts
export declare const PluginsLayer: Layer<Plugins, never, HttpClient>
```

Added in v1.0.0

## Secrets

Secrets are sensitive data that can be used by services. Swarm mode must
be enabled for these endpoints to work.

**Signature**

```ts
export declare const Secrets: typeof Secrets
```

Added in v1.0.0

## SecretsLayer

Secrets are sensitive data that can be used by services. Swarm mode must
be enabled for these endpoints to work.

**Signature**

```ts
export declare const SecretsLayer: Layer<Secrets, never, HttpClient>
```

Added in v1.0.0

## Services

Services are the definitions of tasks to run on a swarm. Swarm mode must
be enabled for these endpoints to work.

**Signature**

```ts
export declare const Services: typeof Services
```

Added in v1.0.0

## ServicesLayer

Services are the definitions of tasks to run on a swarm. Swarm mode must
be enabled for these endpoints to work.

**Signature**

```ts
export declare const ServicesLayer: Layer<Services, never, HttpClient>
```

Added in v1.0.0

## Sessions

**Signature**

```ts
export declare const Sessions: typeof Sessions
```

Added in v1.0.0

## SessionsLayer

**Signature**

```ts
export declare const SessionsLayer: Layer<Sessions, never, HttpClient>
```

Added in v1.0.0

## Swarm

Engines can be clustered together in a swarm. Refer to the swarm mode
documentation for more information.

**Signature**

```ts
export declare const Swarm: typeof Swarm
```

Added in v1.0.0

## SwarmLayer

Engines can be clustered together in a swarm. Refer to the swarm mode
documentation for more information.

**Signature**

```ts
export declare const SwarmLayer: Layer<Swarm, never, HttpClient>
```

Added in v1.0.0

## Systems

**Signature**

```ts
export declare const Systems: typeof Systems
```

Added in v1.0.0

## SystemsLayer

**Signature**

```ts
export declare const SystemsLayer: Layer<Systems, never, HttpClient>
```

Added in v1.0.0

## Tasks

A task is a container running on a swarm. It is the atomic scheduling
unit of swarm. Swarm mode must be enabled for these endpoints to work.

**Signature**

```ts
export declare const Tasks: typeof Tasks
```

Added in v1.0.0

## TasksLayer

A task is a container running on a swarm. It is the atomic scheduling
unit of swarm. Swarm mode must be enabled for these endpoints to work.

**Signature**

```ts
export declare const TasksLayer: Layer<Tasks, never, HttpClient>
```

Added in v1.0.0

## Volumes

**Signature**

```ts
export declare const Volumes: typeof Volumes
```

Added in v1.0.0

## VolumesLayer

**Signature**

```ts
export declare const VolumesLayer: Layer<Volumes, never, HttpClient>
```

Added in v1.0.0
