---
title: engines/Dind.ts
nav_order: 27
parent: Modules
---

## Dind overview

Docker in docker engine

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Engines](#engines)
  - [makeDindLayerFromPlatformConstructor](#makedindlayerfromplatformconstructor)
- [Layers](#layers)
  - [MakeDindLayerFromPlatformConstructor (type alias)](#makedindlayerfromplatformconstructor-type-alias)
  - [layerAgnostic](#layeragnostic)
  - [layerBun](#layerbun)
  - [layerDeno](#layerdeno)
  - [layerFetch](#layerfetch)
  - [layerNodeJS](#layernodejs)
  - [layerUndici](#layerundici)
  - [layerWeb](#layerweb)

---

# Engines

## makeDindLayerFromPlatformConstructor

Spawns a docker in docker container on the remote host provided by another
layer and exposes the dind container as a layer. This dind engine was built
to power the unit tests.

**Signature**

```ts
export declare const makeDindLayerFromPlatformConstructor: <
  PlatformLayerConstructor extends (
    connectionOptions: any
  ) => Layer.Layer<Layer.Layer.Success<DockerEngine.DockerLayer>, unknown, unknown>,
  SupportedConnectionOptions extends MobyConnectionOptions = PlatformLayerConstructor extends (
    connectionOptions: infer C
  ) => Layer.Layer<Layer.Layer.Success<DockerEngine.DockerLayer>, infer _E, infer _R>
    ? C
    : never
>(
  platformLayerConstructor: PlatformLayerConstructor
) => MakeDindLayerFromPlatformConstructor<PlatformLayerConstructor>
```

Added in v1.0.0

# Layers

## MakeDindLayerFromPlatformConstructor (type alias)

**Signature**

```ts
export type MakeDindLayerFromPlatformConstructor<
  PlatformLayerConstructor extends (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    connectionOptions: any
  ) => Layer.Layer<Layer.Layer.Success<DockerEngine.DockerLayer>, unknown, unknown>,
  SupportedConnectionOptions extends MobyConnectionOptions = PlatformLayerConstructor extends (
    connectionOptions: infer C
  ) => Layer.Layer<Layer.Layer.Success<DockerEngine.DockerLayer>, infer _E, infer _R>
    ? C
    : never,
  PlatformLayerConstructorError = ReturnType<PlatformLayerConstructor> extends Layer.Layer<
    Layer.Layer.Success<DockerEngine.DockerLayer>,
    infer E,
    infer _R
  >
    ? E
    : never,
  PlatformLayerConstructorContext = ReturnType<PlatformLayerConstructor> extends Layer.Layer<
    Layer.Layer.Success<DockerEngine.DockerLayer>,
    infer _E,
    infer R
  >
    ? R
    : never
> = <
  ConnectionOptionsToHost extends SupportedConnectionOptions,
  ConnectionOptionsToDind extends SupportedConnectionOptions["_tag"]
>(options: {
  exposeDindContainerBy: ConnectionOptionsToDind
  connectionOptionsToHost: ConnectionOptionsToHost
  dindBaseImage: RecommendedDindBaseImages
}) => Layer.Layer<
  Layer.Layer.Success<DockerEngine.DockerLayer>,
  | ImagesError
  | SystemsError
  | VolumesError
  | ParseResult.ParseError
  | ContainersError
  | PlatformLayerConstructorError
  | (ConnectionOptionsToDind extends "socket" ? PlatformError.PlatformError : never),
  | PlatformLayerConstructorContext
  | (ConnectionOptionsToDind extends "socket" ? Path.Path | FileSystem.FileSystem : never)
>
```

Added in v1.0.0

## layerAgnostic

**Signature**

```ts
export declare const layerAgnostic: MakeDindLayerFromPlatformConstructor<
  (
    connectionOptions: HttpConnectionOptionsTagged | HttpsConnectionOptionsTagged
  ) => DockerEngine.DockerLayerWithoutHttpClientOrWebsocketConstructor,
  | {
      readonly _tag: "http"
      readonly host: string
      readonly port: number
      readonly path?: string | undefined
      readonly version?: string | undefined
    }
  | {
      readonly _tag: "https"
      readonly host: string
      readonly port: number
      readonly version?: string | undefined
      readonly path?: string | undefined
      readonly cert?: string | undefined
      readonly ca?: string | undefined
      readonly key?: string | undefined
      readonly passphrase?: string | undefined
    },
  never,
  HttpClient | WebSocketConstructor
>
```

Added in v1.0.0

## layerBun

**Signature**

```ts
export declare const layerBun: MakeDindLayerFromPlatformConstructor<
  (connectionOptions: MobyConnectionOptions) => DockerEngine.DockerLayer,
  | { readonly _tag: "socket"; readonly socketPath: string; readonly version?: string | undefined }
  | {
      readonly _tag: "ssh"
      readonly remoteSocketPath: string
      readonly host: string
      readonly version?: string | undefined
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
  | {
      readonly _tag: "http"
      readonly host: string
      readonly port: number
      readonly path?: string | undefined
      readonly version?: string | undefined
    }
  | {
      readonly _tag: "https"
      readonly host: string
      readonly port: number
      readonly version?: string | undefined
      readonly path?: string | undefined
      readonly cert?: string | undefined
      readonly ca?: string | undefined
      readonly key?: string | undefined
      readonly passphrase?: string | undefined
    },
  never,
  never
>
```

Added in v1.0.0

## layerDeno

**Signature**

```ts
export declare const layerDeno: MakeDindLayerFromPlatformConstructor<
  (connectionOptions: MobyConnectionOptions) => DockerEngine.DockerLayer,
  | { readonly _tag: "socket"; readonly socketPath: string; readonly version?: string | undefined }
  | {
      readonly _tag: "ssh"
      readonly remoteSocketPath: string
      readonly host: string
      readonly version?: string | undefined
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
  | {
      readonly _tag: "http"
      readonly host: string
      readonly port: number
      readonly path?: string | undefined
      readonly version?: string | undefined
    }
  | {
      readonly _tag: "https"
      readonly host: string
      readonly port: number
      readonly version?: string | undefined
      readonly path?: string | undefined
      readonly cert?: string | undefined
      readonly ca?: string | undefined
      readonly key?: string | undefined
      readonly passphrase?: string | undefined
    },
  never,
  never
>
```

Added in v1.0.0

## layerFetch

**Signature**

```ts
export declare const layerFetch: MakeDindLayerFromPlatformConstructor<
  (connectionOptions: HttpConnectionOptionsTagged | HttpsConnectionOptionsTagged) => DockerEngine.DockerLayer,
  | {
      readonly _tag: "http"
      readonly host: string
      readonly port: number
      readonly path?: string | undefined
      readonly version?: string | undefined
    }
  | {
      readonly _tag: "https"
      readonly host: string
      readonly port: number
      readonly version?: string | undefined
      readonly path?: string | undefined
      readonly cert?: string | undefined
      readonly ca?: string | undefined
      readonly key?: string | undefined
      readonly passphrase?: string | undefined
    },
  never,
  never
>
```

Added in v1.0.0

## layerNodeJS

**Signature**

```ts
export declare const layerNodeJS: MakeDindLayerFromPlatformConstructor<
  (connectionOptions: MobyConnectionOptions) => DockerEngine.DockerLayer,
  | { readonly _tag: "socket"; readonly socketPath: string; readonly version?: string | undefined }
  | {
      readonly _tag: "ssh"
      readonly remoteSocketPath: string
      readonly host: string
      readonly version?: string | undefined
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
  | {
      readonly _tag: "http"
      readonly host: string
      readonly port: number
      readonly path?: string | undefined
      readonly version?: string | undefined
    }
  | {
      readonly _tag: "https"
      readonly host: string
      readonly port: number
      readonly version?: string | undefined
      readonly path?: string | undefined
      readonly cert?: string | undefined
      readonly ca?: string | undefined
      readonly key?: string | undefined
      readonly passphrase?: string | undefined
    },
  never,
  never
>
```

Added in v1.0.0

## layerUndici

**Signature**

```ts
export declare const layerUndici: MakeDindLayerFromPlatformConstructor<
  (connectionOptions: MobyConnectionOptions) => DockerEngine.DockerLayer,
  | { readonly _tag: "socket"; readonly socketPath: string; readonly version?: string | undefined }
  | {
      readonly _tag: "ssh"
      readonly remoteSocketPath: string
      readonly host: string
      readonly version?: string | undefined
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
  | {
      readonly _tag: "http"
      readonly host: string
      readonly port: number
      readonly path?: string | undefined
      readonly version?: string | undefined
    }
  | {
      readonly _tag: "https"
      readonly host: string
      readonly port: number
      readonly version?: string | undefined
      readonly path?: string | undefined
      readonly cert?: string | undefined
      readonly ca?: string | undefined
      readonly key?: string | undefined
      readonly passphrase?: string | undefined
    },
  never,
  never
>
```

Added in v1.0.0

## layerWeb

**Signature**

```ts
export declare const layerWeb: MakeDindLayerFromPlatformConstructor<
  (connectionOptions: HttpConnectionOptionsTagged | HttpsConnectionOptionsTagged) => DockerEngine.DockerLayer,
  | {
      readonly _tag: "http"
      readonly host: string
      readonly port: number
      readonly path?: string | undefined
      readonly version?: string | undefined
    }
  | {
      readonly _tag: "https"
      readonly host: string
      readonly port: number
      readonly version?: string | undefined
      readonly path?: string | undefined
      readonly cert?: string | undefined
      readonly ca?: string | undefined
      readonly key?: string | undefined
      readonly passphrase?: string | undefined
    },
  never,
  never
>
```

Added in v1.0.0
