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

- [utils](#utils)
  - [MobyApi (type alias)](#mobyapi-type-alias)
  - [fromAgent](#fromagent)
  - [fromConnectionOptions](#fromconnectionoptions)
  - [fromDockerHostEnvironmentVariable](#fromdockerhostenvironmentvariable)
  - [fromPlatformDefault](#fromplatformdefault)
  - [fromUrl](#fromurl)

---

# utils

## MobyApi (type alias)

**Signature**

```ts
export type MobyApi = Layer.Layer<
  never,
  never,
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
  | Volumes.Volumes
>
```

## fromAgent

Creates a MobyApi layer from the provided connection agent

**Signature**

```ts
export declare const fromAgent: (
  agent: Effect.Effect<AgentHelpers.IMobyConnectionAgentImpl, never, Scope.Scope>
) => MobyApi
```

## fromConnectionOptions

Creates a MobyApi layer from the provided connection options

**Signature**

```ts
export declare const fromConnectionOptions: (connectionOptions: AgentHelpers.MobyConnectionOptions) => MobyApi
```

## fromDockerHostEnvironmentVariable

Creates a MobyApi layer from the DOCKER_HOST environment variable as a url

**Signature**

```ts
export declare const fromDockerHostEnvironmentVariable: Layer.Layer<
  never,
  ConfigError.ConfigError,
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
  | Images.Images
>
```

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
