---
title: engines/DockerCompose.ts
nav_order: 27
parent: Modules
---

## DockerCompose overview

Docker compose engine.

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
  - [makeLayer](#makelayer)
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
  connectionOptionsToHost:
    | { readonly _tag: "http"; readonly host: string; readonly port: number; readonly path?: string | undefined }
    | {
        readonly _tag: "https"
        readonly host: string
        readonly port: number
        readonly path?: string | undefined
        readonly cert?: string | undefined
        readonly ca?: string | undefined
        readonly key?: string | undefined
        readonly passphrase?: string | undefined
      }
) => Layer.Layer<
  DockerCompose,
  ImagesError | SystemsError | VolumesError | ParseResult.ParseError | ContainersError | never,
  HttpClient<HttpClientError, Scope>
>
```

Added in v1.0.0

## layerBun

**Signature**

```ts
export declare const layerBun: (
  connectionOptionsToHost:
    | { readonly _tag: "socket"; readonly socketPath: string }
    | {
        readonly _tag: "ssh"
        readonly remoteSocketPath: string
        readonly host: string
        readonly port?: number
        readonly forceIPv4?: boolean
        readonly forceIPv6?: boolean
        readonly hostHash?: string
        readonly hostVerifier?: HostVerifier | SyncHostVerifier | HostFingerprintVerifier | SyncHostFingerprintVerifier
        readonly username?: string
        readonly password?: string
        readonly agent?: BaseAgent | string
        readonly privateKey?: Buffer | string
        readonly passphrase?: Buffer | string
        readonly localHostname?: string
        readonly localUsername?: string
        readonly tryKeyboard?: boolean
        readonly keepaliveInterval?: number
        readonly keepaliveCountMax?: number
        readonly readyTimeout?: number
        readonly strictVendor?: boolean
        readonly sock?: Readable
        readonly agentForward?: boolean
        readonly algorithms?: Algorithms
        readonly debug?: DebugFunction
        readonly authHandler?: AuthenticationType[] | AuthHandlerMiddleware | AuthMethod[]
        readonly localAddress?: string
        readonly localPort?: number
        readonly timeout?: number
        readonly ident?: Buffer | string
      }
    | { readonly _tag: "http"; readonly host: string; readonly port: number; readonly path?: string | undefined }
    | {
        readonly _tag: "https"
        readonly host: string
        readonly port: number
        readonly path?: string | undefined
        readonly cert?: string | undefined
        readonly ca?: string | undefined
        readonly key?: string | undefined
        readonly passphrase?: string | undefined
      }
) => Layer.Layer<
  DockerCompose,
  ImagesError | SystemsError | VolumesError | ParseResult.ParseError | ContainersError | never,
  never
>
```

Added in v1.0.0

## layerDeno

**Signature**

```ts
export declare const layerDeno: (
  connectionOptionsToHost:
    | { readonly _tag: "socket"; readonly socketPath: string }
    | {
        readonly _tag: "ssh"
        readonly remoteSocketPath: string
        readonly host: string
        readonly port?: number
        readonly forceIPv4?: boolean
        readonly forceIPv6?: boolean
        readonly hostHash?: string
        readonly hostVerifier?: HostVerifier | SyncHostVerifier | HostFingerprintVerifier | SyncHostFingerprintVerifier
        readonly username?: string
        readonly password?: string
        readonly agent?: BaseAgent | string
        readonly privateKey?: Buffer | string
        readonly passphrase?: Buffer | string
        readonly localHostname?: string
        readonly localUsername?: string
        readonly tryKeyboard?: boolean
        readonly keepaliveInterval?: number
        readonly keepaliveCountMax?: number
        readonly readyTimeout?: number
        readonly strictVendor?: boolean
        readonly sock?: Readable
        readonly agentForward?: boolean
        readonly algorithms?: Algorithms
        readonly debug?: DebugFunction
        readonly authHandler?: AuthenticationType[] | AuthHandlerMiddleware | AuthMethod[]
        readonly localAddress?: string
        readonly localPort?: number
        readonly timeout?: number
        readonly ident?: Buffer | string
      }
    | { readonly _tag: "http"; readonly host: string; readonly port: number; readonly path?: string | undefined }
    | {
        readonly _tag: "https"
        readonly host: string
        readonly port: number
        readonly path?: string | undefined
        readonly cert?: string | undefined
        readonly ca?: string | undefined
        readonly key?: string | undefined
        readonly passphrase?: string | undefined
      }
) => Layer.Layer<
  DockerCompose,
  ImagesError | SystemsError | VolumesError | ParseResult.ParseError | ContainersError | never,
  never
>
```

Added in v1.0.0

## layerNodeJS

**Signature**

```ts
export declare const layerNodeJS: (
  connectionOptionsToHost:
    | { readonly _tag: "socket"; readonly socketPath: string }
    | {
        readonly _tag: "ssh"
        readonly remoteSocketPath: string
        readonly host: string
        readonly port?: number
        readonly forceIPv4?: boolean
        readonly forceIPv6?: boolean
        readonly hostHash?: string
        readonly hostVerifier?: HostVerifier | SyncHostVerifier | HostFingerprintVerifier | SyncHostFingerprintVerifier
        readonly username?: string
        readonly password?: string
        readonly agent?: BaseAgent | string
        readonly privateKey?: Buffer | string
        readonly passphrase?: Buffer | string
        readonly localHostname?: string
        readonly localUsername?: string
        readonly tryKeyboard?: boolean
        readonly keepaliveInterval?: number
        readonly keepaliveCountMax?: number
        readonly readyTimeout?: number
        readonly strictVendor?: boolean
        readonly sock?: Readable
        readonly agentForward?: boolean
        readonly algorithms?: Algorithms
        readonly debug?: DebugFunction
        readonly authHandler?: AuthenticationType[] | AuthHandlerMiddleware | AuthMethod[]
        readonly localAddress?: string
        readonly localPort?: number
        readonly timeout?: number
        readonly ident?: Buffer | string
      }
    | { readonly _tag: "http"; readonly host: string; readonly port: number; readonly path?: string | undefined }
    | {
        readonly _tag: "https"
        readonly host: string
        readonly port: number
        readonly path?: string | undefined
        readonly cert?: string | undefined
        readonly ca?: string | undefined
        readonly key?: string | undefined
        readonly passphrase?: string | undefined
      }
) => Layer.Layer<
  DockerCompose,
  ImagesError | SystemsError | VolumesError | ParseResult.ParseError | ContainersError | never,
  never
>
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
  readonly layer: Layer.Layer<DockerComposeProject, E1, DockerCompose>
}
```

Added in v1.0.0

## layerUndici

**Signature**

```ts
export declare const layerUndici: (
  connectionOptionsToHost:
    | { readonly _tag: "socket"; readonly socketPath: string }
    | {
        readonly _tag: "ssh"
        readonly remoteSocketPath: string
        readonly host: string
        readonly port?: number
        readonly forceIPv4?: boolean
        readonly forceIPv6?: boolean
        readonly hostHash?: string
        readonly hostVerifier?: HostVerifier | SyncHostVerifier | HostFingerprintVerifier | SyncHostFingerprintVerifier
        readonly username?: string
        readonly password?: string
        readonly agent?: BaseAgent | string
        readonly privateKey?: Buffer | string
        readonly passphrase?: Buffer | string
        readonly localHostname?: string
        readonly localUsername?: string
        readonly tryKeyboard?: boolean
        readonly keepaliveInterval?: number
        readonly keepaliveCountMax?: number
        readonly readyTimeout?: number
        readonly strictVendor?: boolean
        readonly sock?: Readable
        readonly agentForward?: boolean
        readonly algorithms?: Algorithms
        readonly debug?: DebugFunction
        readonly authHandler?: AuthenticationType[] | AuthHandlerMiddleware | AuthMethod[]
        readonly localAddress?: string
        readonly localPort?: number
        readonly timeout?: number
        readonly ident?: Buffer | string
      }
    | { readonly _tag: "http"; readonly host: string; readonly port: number; readonly path?: string | undefined }
    | {
        readonly _tag: "https"
        readonly host: string
        readonly port: number
        readonly path?: string | undefined
        readonly cert?: string | undefined
        readonly ca?: string | undefined
        readonly key?: string | undefined
        readonly passphrase?: string | undefined
      }
) => Layer.Layer<
  DockerCompose,
  ImagesError | SystemsError | VolumesError | ParseResult.ParseError | ContainersError | never,
  never
>
```

Added in v1.0.0

## layerWeb

**Signature**

```ts
export declare const layerWeb: (
  connectionOptionsToHost:
    | { readonly _tag: "http"; readonly host: string; readonly port: number; readonly path?: string | undefined }
    | {
        readonly _tag: "https"
        readonly host: string
        readonly port: number
        readonly path?: string | undefined
        readonly cert?: string | undefined
        readonly ca?: string | undefined
        readonly key?: string | undefined
        readonly passphrase?: string | undefined
      }
) => Layer.Layer<
  DockerCompose,
  ImagesError | SystemsError | VolumesError | ParseResult.ParseError | ContainersError | never,
  never
>
```

Added in v1.0.0

## makeLayer

**Signature**

```ts
export declare const makeLayer: <
  DockerConstructor extends (
    connectionOptions: any
  ) => Layer.Layer<Layer.Layer.Success<DockerEngine.DockerLayer>, unknown, unknown>,
  SupportedConnectionOptions extends MobyConnectionOptions = DockerConstructor extends (
    connectionOptions: infer C
  ) => Layer.Layer<Layer.Layer.Success<DockerEngine.DockerLayer>, infer _E, infer _R>
    ? C
    : never,
  DockerConstructorError = ReturnType<DockerConstructor> extends Layer.Layer<
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
    | Volumes,
    infer E,
    infer _R
  >
    ? E
    : never,
  DockerConstructorContext = ReturnType<DockerConstructor> extends Layer.Layer<
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
    | Volumes,
    infer _E,
    infer R
  >
    ? R
    : never
>(
  dockerLayerConstructor: DockerConstructor
) => (
  connectionOptionsToHost: SupportedConnectionOptions
) => Layer.Layer<
  DockerCompose,
  ImagesError | SystemsError | VolumesError | ParseResult.ParseError | ContainersError | DockerConstructorError,
  DockerConstructorContext
>
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
  ) => Effect.Effect<DockerComposeProject, E1, never>
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
  readonly rm: (options: {}) => Effect.Effect<void, DockerComposeError, void>
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
