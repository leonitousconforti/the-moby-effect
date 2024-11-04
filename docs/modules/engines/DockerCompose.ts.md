---
title: engines/DockerCompose.ts
nav_order: 28
parent: Modules
---

## DockerCompose overview

Compose engine.

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Errors](#errors)
  - [DockerComposeError (class)](#dockercomposeerror-class)
  - [isDockerComposeError](#isdockercomposeerror)
- [Layers](#layers)
  - [layerAgnostic](#layeragnostic)
  - [layerBun](#layerbun)
  - [layerDeno](#layerdeno)
  - [layerNodeJS](#layernodejs)
  - [layerProject](#layerproject)
  - [layerUndici](#layerundici)
  - [layerWeb](#layerweb)
- [Models](#models)
  - [DockerCompose (interface)](#dockercompose-interface)
  - [DockerComposeProject (interface)](#dockercomposeproject-interface)
- [Tags](#tags)
  - [DockerCompose](#dockercompose)
- [Type id](#type-id)
  - [DockerComposeProjectTypeId](#dockercomposeprojecttypeid)
  - [DockerComposeProjectTypeId (type alias)](#dockercomposeprojecttypeid-type-alias)
  - [TypeId](#typeid)
  - [TypeId (type alias)](#typeid-type-alias)

---

# Errors

## DockerComposeError (class)

**Signature**

```ts
export declare class DockerComposeError
```

Added in v1.0.0

## isDockerComposeError

**Signature**

```ts
export declare const isDockerComposeError: (u: unknown) => u is DockerComposeError
```

Added in v1.0.0

# Layers

## layerAgnostic

**Signature**

```ts
export declare const layerAgnostic: (
  connectionOptions: HttpConnectionOptionsTagged | HttpsConnectionOptionsTagged
) => Layer.Layer<
  DockerCompose,
  SystemsError | ContainersError,
  HttpClient.HttpClient<HttpClientError.HttpClientError, Scope.Scope>
>
```

Added in v1.0.0

## layerBun

**Signature**

```ts
export declare const layerBun: (
  connectionOptions: MobyConnectionOptions
) => Layer.Layer<DockerCompose, SystemsError | ContainersError, never>
```

Added in v1.0.0

## layerDeno

**Signature**

```ts
export declare const layerDeno: (
  connectionOptions: MobyConnectionOptions
) => Layer.Layer<DockerCompose, SystemsError | ContainersError, never>
```

Added in v1.0.0

## layerNodeJS

**Signature**

```ts
export declare const layerNodeJS: (
  connectionOptions: MobyConnectionOptions
) => Layer.Layer<DockerCompose, SystemsError | ContainersError, never>
```

Added in v1.0.0

## layerProject

**Signature**

```ts
export declare const layerProject: <E1>(
  project: Stream.Stream<Uint8Array, E1, never>,
  tagIdentifier: string
) => {
  readonly tag: Context.Tag<DockerComposeProject, DockerComposeProject>
  readonly layer: Layer.Layer<DockerComposeProject, E1 | DockerComposeError, DockerCompose>
}
```

Added in v1.0.0

## layerUndici

**Signature**

```ts
export declare const layerUndici: (
  connectionOptions: MobyConnectionOptions
) => Layer.Layer<DockerCompose, SystemsError | ContainersError, never>
```

Added in v1.0.0

## layerWeb

**Signature**

```ts
export declare const layerWeb: (
  connectionOptions: HttpConnectionOptionsTagged | HttpsConnectionOptionsTagged
) => Layer.Layer<DockerCompose, SystemsError | ContainersError, never>
```

Added in v1.0.0

# Models

## DockerCompose (interface)

**Signature**

```ts
export interface DockerCompose {
  readonly [TypeId]: TypeId

  readonly build: <E1>(
    project: Stream.Stream<Uint8Array, E1, never>,
    options: {}
  ) => Effect.Effect<void, E1 | DockerComposeError, never>

  readonly pull: <E1>(
    project: Stream.Stream<Uint8Array, E1, never>,
    options: {}
  ) => Effect.Effect<void, E1 | DockerComposeError, never>

  readonly up: <E1>(
    project: Stream.Stream<Uint8Array, E1, never>,
    options: {}
  ) => Effect.Effect<void, E1 | DockerComposeError, never>

  readonly down: <E1>(
    project: Stream.Stream<Uint8Array, E1, never>,
    options: {}
  ) => Effect.Effect<void, E1 | DockerComposeError, never>

  readonly rm: <E1>(
    project: Stream.Stream<Uint8Array, E1, never>,
    options: {}
  ) => Effect.Effect<void, E1 | DockerComposeError, never>

  readonly kill: <E1>(
    project: Stream.Stream<Uint8Array, E1, never>,
    options: {}
  ) => Effect.Effect<void, E1 | DockerComposeError, never>

  readonly forProject: <E1>(
    project: Stream.Stream<Uint8Array, E1, never>
  ) => Effect.Effect<DockerComposeProject, E1 | DockerComposeError, never>
}
```

Added in v1.0.0

## DockerComposeProject (interface)

**Signature**

```ts
export interface DockerComposeProject {
  readonly [DockerComposeProjectTypeId]: DockerComposeProjectTypeId
  readonly build: (options: {}) => Effect.Effect<void, DockerComposeError, never>
  readonly pull: (options: {}) => Effect.Effect<void, DockerComposeError, never>
  readonly up: (options: {}) => Effect.Effect<void, DockerComposeError, never>
  readonly down: (options: {}) => Effect.Effect<void, DockerComposeError, never>
  readonly rm: (options: {}) => Effect.Effect<void, DockerComposeError, never>
  readonly kill: (options: {}) => Effect.Effect<void, DockerComposeError, never>
}
```

Added in v1.0.0

# Tags

## DockerCompose

**Signature**

```ts
export declare const DockerCompose: Context.Tag<DockerCompose, DockerCompose>
```

Added in v1.0.0

# Type id

## DockerComposeProjectTypeId

**Signature**

```ts
export declare const DockerComposeProjectTypeId: typeof DockerComposeProjectTypeId
```

Added in v1.0.0

## DockerComposeProjectTypeId (type alias)

**Signature**

```ts
export type DockerComposeProjectTypeId = typeof DockerComposeProjectTypeId
```

Added in v1.0.0

## TypeId

**Signature**

```ts
export declare const TypeId: typeof TypeId
```

Added in v1.0.0

## TypeId (type alias)

**Signature**

```ts
export type TypeId = typeof TypeId
```

Added in v1.0.0
