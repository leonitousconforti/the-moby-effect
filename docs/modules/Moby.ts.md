---
title: Moby.ts
nav_order: 5
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
  - [fromPlatformSystemSocketDefault](#fromplatformsystemsocketdefault)
  - [fromUrl](#fromurl)
  - [fromUserSocketDefault](#fromusersocketdefault)
- [Layers](#layers)
  - [MobyApi (type alias)](#mobyapi-type-alias)
  - [layer](#layer)
- [exports](#exports)
  - [From "./moby/Configs.js"](#from-mobyconfigsjs)
  - [From "./moby/Containers.js"](#from-mobycontainersjs)
  - [From "./moby/Distribution.js"](#from-mobydistributionjs)
  - [From "./moby/Execs.js"](#from-mobyexecsjs)
  - [From "./moby/Images.js"](#from-mobyimagesjs)
  - [From "./moby/Networks.js"](#from-mobynetworksjs)
  - [From "./moby/Nodes.js"](#from-mobynodesjs)
  - [From "./moby/Plugins.js"](#from-mobypluginsjs)
  - [From "./moby/Secrets.js"](#from-mobysecretsjs)
  - [From "./moby/Services.js"](#from-mobyservicesjs)
  - [From "./moby/Session.js"](#from-mobysessionjs)
  - [From "./moby/Swarm.js"](#from-mobyswarmjs)
  - [From "./moby/System.js"](#from-mobysystemjs)
  - [From "./moby/Tasks.js"](#from-mobytasksjs)
  - [From "./moby/Volumes.js"](#from-mobyvolumesjs)

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
  ConfigError.ConfigError,
  never
>
```

Added in v1.0.0

## fromPlatformSystemSocketDefault

Creates a MobyApi layer from the platform default system socket location.

**Signature**

```ts
export declare const fromPlatformSystemSocketDefault: () => Layer.Layer<
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

## fromUserSocketDefault

Creates a MobyApi layer from the platform default system socket location.

**Signature**

```ts
export declare const fromUserSocketDefault: () => Layer.Layer<
  Layer.Layer.Success<MobyApi>,
  Layer.Layer.Error<MobyApi> | ConfigError.ConfigError,
  Layer.Layer.Context<MobyApi> | Path.Path
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
  AgentHelpers.IMobyConnectionAgent
>
```

Added in v1.0.0

# exports

## From "./moby/Configs.js"

Re-exports all named exports from the "./moby/Configs.js" module as `Configs`.

**Signature**

```ts
export * as Configs from "./moby/Configs.js"
```

Added in v1.0.0

## From "./moby/Containers.js"

Re-exports all named exports from the "./moby/Containers.js" module as `Containers`.

**Signature**

```ts
export * as Containers from "./moby/Containers.js"
```

Added in v1.0.0

## From "./moby/Distribution.js"

Re-exports all named exports from the "./moby/Distribution.js" module as `Distribution`.

**Signature**

```ts
export * as Distribution from "./moby/Distribution.js"
```

Added in v1.0.0

## From "./moby/Execs.js"

Re-exports all named exports from the "./moby/Execs.js" module as `Execs`.

**Signature**

```ts
export * as Execs from "./moby/Execs.js"
```

Added in v1.0.0

## From "./moby/Images.js"

Re-exports all named exports from the "./moby/Images.js" module as `Images`.

**Signature**

```ts
export * as Images from "./moby/Images.js"
```

Added in v1.0.0

## From "./moby/Networks.js"

Re-exports all named exports from the "./moby/Networks.js" module as `Networks`.

**Signature**

```ts
export * as Networks from "./moby/Networks.js"
```

Added in v1.0.0

## From "./moby/Nodes.js"

Re-exports all named exports from the "./moby/Nodes.js" module as `Nodes`.

**Signature**

```ts
export * as Nodes from "./moby/Nodes.js"
```

Added in v1.0.0

## From "./moby/Plugins.js"

Re-exports all named exports from the "./moby/Plugins.js" module as `Plugins`.

**Signature**

```ts
export * as Plugins from "./moby/Plugins.js"
```

Added in v1.0.0

## From "./moby/Secrets.js"

Re-exports all named exports from the "./moby/Secrets.js" module as `Secrets`.

**Signature**

```ts
export * as Secrets from "./moby/Secrets.js"
```

Added in v1.0.0

## From "./moby/Services.js"

Re-exports all named exports from the "./moby/Services.js" module as `Services`.

**Signature**

```ts
export * as Services from "./moby/Services.js"
```

Added in v1.0.0

## From "./moby/Session.js"

Re-exports all named exports from the "./moby/Session.js" module as `Session`.

**Signature**

```ts
export * as Session from "./moby/Session.js"
```

Added in v1.0.0

## From "./moby/Swarm.js"

Re-exports all named exports from the "./moby/Swarm.js" module as `Swarm`.

**Signature**

```ts
export * as Swarm from "./moby/Swarm.js"
```

Added in v1.0.0

## From "./moby/System.js"

Re-exports all named exports from the "./moby/System.js" module as `System`.

**Signature**

```ts
export * as System from "./moby/System.js"
```

Added in v1.0.0

## From "./moby/Tasks.js"

Re-exports all named exports from the "./moby/Tasks.js" module as `Tasks`.

**Signature**

```ts
export * as Tasks from "./moby/Tasks.js"
```

Added in v1.0.0

## From "./moby/Volumes.js"

Re-exports all named exports from the "./moby/Volumes.js" module as `Volumes`.

**Signature**

```ts
export * as Volumes from "./moby/Volumes.js"
```

Added in v1.0.0
