---
title: Moby.ts
nav_order: 10
parent: Modules
---

## Moby overview

Generic Moby helpers

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Constructors](#constructors)
  - [fromAgent](#fromagent)
  - [fromConnectionOptions](#fromconnectionoptions)
  - [fromDockerHostEnvironmentVariable](#fromdockerhostenvironmentvariable)
  - [fromPlatformDefault](#fromplatformdefault)
  - [fromUrl](#fromurl)
- [Layers](#layers)
  - [MobyApi (type alias)](#mobyapi-type-alias)
  - [layer](#layer)
- [exports](#exports)
  - [From "./Agent.js"](#from-agentjs)
  - [From "./Configs.js"](#from-configsjs)
  - [From "./Containers.js"](#from-containersjs)
  - [From "./Demux.js"](#from-demuxjs)
  - [From "./Distribution.js"](#from-distributionjs)
  - [From "./Docker.js"](#from-dockerjs)
  - [From "./Execs.js"](#from-execsjs)
  - [From "./Images.js"](#from-imagesjs)
  - [From "./Networks.js"](#from-networksjs)
  - [From "./Nodes.js"](#from-nodesjs)
  - [From "./Plugins.js"](#from-pluginsjs)
  - [From "./Schemas.js"](#from-schemasjs)
  - [From "./Secrets.js"](#from-secretsjs)
  - [From "./Services.js"](#from-servicesjs)
  - [From "./Session.js"](#from-sessionjs)
  - [From "./Swarm.js"](#from-swarmjs)
  - [From "./System.js"](#from-systemjs)
  - [From "./Tasks.js"](#from-tasksjs)
  - [From "./Volumes.js"](#from-volumesjs)

---

# Constructors

## fromAgent

Creates a MobyApi layer from the provided connection agent

**Signature**

```ts
export declare const fromAgent: (
  agent: Effect.Effect<AgentHelpers.IMobyConnectionAgentImpl, never, Scope.Scope>
) => MobyApi
```

Added in v1.0.0

## fromConnectionOptions

Creates a MobyApi layer from the provided connection options

**Signature**

```ts
export declare const fromConnectionOptions: (connectionOptions: AgentHelpers.MobyConnectionOptions) => MobyApi
```

Added in v1.0.0

## fromDockerHostEnvironmentVariable

Creates a MobyApi layer from the DOCKER_HOST environment variable as a url.

**Signature**

```ts
export declare const fromDockerHostEnvironmentVariable: Layer.Layer<
  | Volumes.Volumes
  | Tasks.Tasks
  | System.Systems
  | Swarm.Swarms
  | Sessions.Sessions
  | Services.Services
  | Secrets.Secrets
  | Plugins.Plugins
  | Nodes.Nodes
  | Networks.Networks
  | Configs.Configs
  | Containers.Containers
  | Distributions.Distributions
  | Execs.Execs
  | Images.Images,
  ConfigError.ConfigError,
  never
>
```

Added in v1.0.0

## fromPlatformDefault

Creates a MobyApi layer from the platform default socket location.

**Signature**

```ts
export declare const fromPlatformDefault: () => Layer.Layer<
  Layer.Layer.Success<MobyApi>,
  Layer.Layer.Error<MobyApi> | ConfigError.ConfigError,
  Layer.Layer.Context<MobyApi>
>
```

Added in v1.0.0

## fromUrl

From
https://docs.docker.com/engine/reference/commandline/dockerd/#daemon-socket-option

"The Docker client will honor the DOCKER_HOST environment variable to set the
-H flag for the client"

And then from
https://docs.docker.com/engine/reference/commandline/dockerd/#bind-docker-to-another-hostport-or-a-unix-socket

"-H accepts host and port assignment in the following format:
`tcp://[host]:[port][path]` or `unix://path`

For example:

- `unix://path/to/socket` -> Unix socket located at path/to/socket
- When -H is empty, it will default to the same value as when no -H was passed
  in
- `http://host:port/path` -> HTTP connection on host:port and prepend path to
  all requests
- `https://host:port/path` -> HTTPS connection on host:port and prepend path to
  all requests
- `ssh://me@example.com:22/var/run/docker.sock` -> SSH connection to
  example.com on port 22

**Signature**

```ts
export declare const fromUrl: (
  dockerHost: string
) => Layer.Layer<
  Layer.Layer.Success<MobyApi>,
  Layer.Layer.Error<MobyApi> | ConfigError.ConfigError,
  Layer.Layer.Context<MobyApi> | never
>
```

Added in v1.0.0

# Layers

## MobyApi (type alias)

Merges all the layers into a single layer

**Signature**

```ts
export type MobyApi = Layer.Layer<
  | Configs.Configs
  | Containers.Containers
  | Distributions.Distributions
  | Execs.Execs
  | Images.Images
  | Networks.Networks
  | Nodes.Nodes
  | Plugins.Plugins
  | Secrets.Secrets
  | Services.Services
  | Sessions.Sessions
  | Swarm.Swarms
  | System.Systems
  | Tasks.Tasks
  | Volumes.Volumes,
  never,
  never
>
```

Added in v1.0.0

## layer

Merges all the layers into a single layer

**Signature**

```ts
export declare const layer: Layer.Layer<
  | Volumes.Volumes
  | Tasks.Tasks
  | System.Systems
  | Swarm.Swarms
  | Sessions.Sessions
  | Services.Services
  | Secrets.Secrets
  | Plugins.Plugins
  | Nodes.Nodes
  | Networks.Networks
  | Configs.Configs
  | Containers.Containers
  | Distributions.Distributions
  | Execs.Execs
  | Images.Images,
  never,
  AgentHelpers.IMobyConnectionAgent
>
```

Added in v1.0.0

# exports

## From "./Agent.js"

Re-exports all named exports from the "./Agent.js" module.

**Signature**

```ts
export * from "./Agent.js"
```

Added in v1.0.0

## From "./Configs.js"

Re-exports all named exports from the "./Configs.js" module as `Configs`.

**Signature**

```ts
export * as Configs from "./Configs.js"
```

Added in v1.0.0

## From "./Containers.js"

Re-exports all named exports from the "./Containers.js" module as `Containers`.

**Signature**

```ts
export * as Containers from "./Containers.js"
```

Added in v1.0.0

## From "./Demux.js"

Re-exports all named exports from the "./Demux.js" module as `DemuxHelpers`.

**Signature**

```ts
export * as DemuxHelpers from "./Demux.js"
```

Added in v1.0.0

## From "./Distribution.js"

Re-exports all named exports from the "./Distribution.js" module as `Distributions`.

**Signature**

```ts
export * as Distributions from "./Distribution.js"
```

Added in v1.0.0

## From "./Docker.js"

Re-exports all named exports from the "./Docker.js" module as `DockerCommon`.

**Signature**

```ts
export * as DockerCommon from "./Docker.js"
```

Added in v1.0.0

## From "./Execs.js"

Re-exports all named exports from the "./Execs.js" module as `Execs`.

**Signature**

```ts
export * as Execs from "./Execs.js"
```

Added in v1.0.0

## From "./Images.js"

Re-exports all named exports from the "./Images.js" module as `Images`.

**Signature**

```ts
export * as Images from "./Images.js"
```

Added in v1.0.0

## From "./Networks.js"

Re-exports all named exports from the "./Networks.js" module as `Networks`.

**Signature**

```ts
export * as Networks from "./Networks.js"
```

Added in v1.0.0

## From "./Nodes.js"

Re-exports all named exports from the "./Nodes.js" module as `Nodes`.

**Signature**

```ts
export * as Nodes from "./Nodes.js"
```

Added in v1.0.0

## From "./Plugins.js"

Re-exports all named exports from the "./Plugins.js" module as `Plugins`.

**Signature**

```ts
export * as Plugins from "./Plugins.js"
```

Added in v1.0.0

## From "./Schemas.js"

Re-exports all named exports from the "./Schemas.js" module as `Schemas`.

**Signature**

```ts
export * as Schemas from "./Schemas.js"
```

Added in v1.0.0

## From "./Secrets.js"

Re-exports all named exports from the "./Secrets.js" module as `Secrets`.

**Signature**

```ts
export * as Secrets from "./Secrets.js"
```

Added in v1.0.0

## From "./Services.js"

Re-exports all named exports from the "./Services.js" module as `Services`.

**Signature**

```ts
export * as Services from "./Services.js"
```

Added in v1.0.0

## From "./Session.js"

Re-exports all named exports from the "./Session.js" module as `Sessions`.

**Signature**

```ts
export * as Sessions from "./Session.js"
```

Added in v1.0.0

## From "./Swarm.js"

Re-exports all named exports from the "./Swarm.js" module as `Swarm`.

**Signature**

```ts
export * as Swarm from "./Swarm.js"
```

Added in v1.0.0

## From "./System.js"

Re-exports all named exports from the "./System.js" module as `System`.

**Signature**

```ts
export * as System from "./System.js"
```

Added in v1.0.0

## From "./Tasks.js"

Re-exports all named exports from the "./Tasks.js" module as `Tasks`.

**Signature**

```ts
export * as Tasks from "./Tasks.js"
```

Added in v1.0.0

## From "./Volumes.js"

Re-exports all named exports from the "./Volumes.js" module as `Volumes`.

**Signature**

```ts
export * as Volumes from "./Volumes.js"
```

Added in v1.0.0
