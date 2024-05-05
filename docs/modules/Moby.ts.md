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
