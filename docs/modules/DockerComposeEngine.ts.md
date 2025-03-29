---
title: DockerComposeEngine.ts
nav_order: 3
parent: Modules
---

## DockerComposeEngine overview

Docker compose engine shortcut.

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Errors](#errors)
  - [DockerComposeError](#dockercomposeerror)
  - [isDockerComposeError](#isdockercomposeerror)
- [Layers](#layers)
  - [layer](#layer)
  - [layerProject](#layerproject)
- [Models](#models)
  - [DockerComposeProject](#dockercomposeproject)
- [Tags](#tags)
  - [DockerCompose](#dockercompose)

---

# Errors

## DockerComposeError

**Signature**

```ts
export declare const DockerComposeError: typeof DockerComposeError
```

Added in v1.0.0

## isDockerComposeError

**Signature**

```ts
export declare const isDockerComposeError: (u: unknown) => u is DockerComposeError
```

Added in v1.0.0

# Layers

## layer

**Signature**

```ts
export declare const layer: Layer<
  DockerCompose,
  ContainersError | SystemsError,
  | Configs
  | Containers
  | Distributions
  | Execs
  | Images
  | Networks
  | Nodes
  | Plugins
  | Secrets
  | Services
  | Sessions
  | Swarm
  | Systems
  | Tasks
  | Volumes
>
```

Added in v1.0.0

## layerProject

**Signature**

```ts
export declare const layerProject: <E1>(
  project: Stream<Uint8Array, E1, never>,
  tagIdentifier: string
) => {
  readonly tag: Tag<DockerComposeProject, DockerComposeProject>
  readonly layer: Layer<DockerComposeProject, E1 | DockerComposeError, DockerCompose>
}
```

Added in v1.0.0

# Models

## DockerComposeProject

**Signature**

```ts
export declare const DockerComposeProject: any
```

Added in v1.0.0

# Tags

## DockerCompose

**Signature**

```ts
export declare const DockerCompose: Tag<DockerCompose, DockerCompose>
```

Added in v1.0.0
