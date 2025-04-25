---
title: DindEngine.ts
nav_order: 2
parent: Modules
---

## DindEngine.ts overview

Docker in docker engine.

Since v1.0.0

---

## Exports Grouped by Category

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

# Layers

## MakeDindLayerFromPlatformConstructor (type alias)

**Signature**

```ts
type MakeDindLayerFromPlatformConstructor<
  PlatformLayerConstructor,
  SupportedConnectionOptions,
  PlatformLayerConstructorError,
  PlatformLayerConstructorContext
> = <
  ConnectionOptionsToHost extends SupportedConnectionOptions,
  ConnectionOptionsToDind extends SupportedConnectionOptions["_tag"]
>(options: {
  exposeDindContainerBy: ConnectionOptionsToDind
  connectionOptionsToHost: ConnectionOptionsToHost
  dindBaseImage: BlobConstants.RecommendedDindBaseImages
}) => Layer.Layer<
  Layer.Layer.Success<DockerEngine.DockerLayer>,
  | MobyEndpoints.ImagesError
  | MobyEndpoints.SystemsError
  | MobyEndpoints.VolumesError
  | ParseResult.ParseError
  | MobyEndpoints.ContainersError
  | PlatformLayerConstructorError
  | (ConnectionOptionsToDind extends "socket" ? PlatformError.PlatformError : never),
  | PlatformLayerConstructorContext
  | (ConnectionOptionsToDind extends "socket" ? Path.Path | FileSystem.FileSystem : never)
>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DindEngine.ts#L23)

Since v1.0.0

## layerAgnostic

**Signature**

```ts
declare const layerAgnostic: MakeDindLayerFromPlatformConstructor<
  (
    connectionOptions: MobyConnection.HttpConnectionOptionsTagged | MobyConnection.HttpsConnectionOptionsTagged
  ) => DockerEngine.DockerLayerWithoutHttpClientOrWebsocketConstructor,
  | {
      readonly _tag: "http"
      readonly host: string
      readonly port: number
      readonly path?: string | undefined | undefined
      readonly version?: string | undefined | undefined
    }
  | {
      readonly _tag: "https"
      readonly host: string
      readonly port: number
      readonly version?: string | undefined | undefined
      readonly path?: string | undefined | undefined
      readonly cert?: string | undefined | undefined
      readonly ca?: string | undefined | undefined
      readonly key?: string | undefined | undefined
      readonly passphrase?: string | undefined | undefined
    },
  never,
  HttpClient | WebSocketConstructor
>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DindEngine.ts#L112)

Since v1.0.0

## layerBun

**Signature**

```ts
declare const layerBun: MakeDindLayerFromPlatformConstructor<
  (connectionOptions: MobyConnection.MobyConnectionOptions) => DockerEngine.DockerLayer,
  | { readonly _tag: "socket"; readonly socketPath: string; readonly version?: string | undefined | undefined }
  | {
      readonly _tag: "ssh"
      readonly remoteSocketPath: string
      readonly host: string
      readonly version?: string | undefined | undefined
      readonly port?: number | undefined
      readonly forceIPv4?: boolean | undefined
      readonly forceIPv6?: boolean | undefined
      readonly hostHash?: string | undefined
      readonly hostVerifier?:
        | (HostVerifier | SyncHostVerifier | HostFingerprintVerifier | SyncHostFingerprintVerifier)
        | undefined
      readonly username?: string | undefined
      readonly password?: string | undefined
      readonly agent?: (BaseAgent | string) | undefined
      readonly privateKey?: (Buffer | string) | undefined
      readonly passphrase?: (Buffer | string) | undefined
      readonly localHostname?: string | undefined
      readonly localUsername?: string | undefined
      readonly tryKeyboard?: boolean | undefined
      readonly keepaliveInterval?: number | undefined
      readonly keepaliveCountMax?: number | undefined
      readonly readyTimeout?: number | undefined
      readonly strictVendor?: boolean | undefined
      readonly sock?: Stream.Readable | undefined
      readonly agentForward?: boolean | undefined
      readonly algorithms?: Algorithms | undefined
      readonly debug?: DebugFunction | undefined
      readonly authHandler?: (AuthenticationType[] | AuthHandlerMiddleware | AuthMethod[]) | undefined
      readonly localAddress?: string | undefined
      readonly localPort?: number | undefined
      readonly timeout?: number | undefined
      readonly ident?: (Buffer | string) | undefined
    }
  | {
      readonly _tag: "http"
      readonly host: string
      readonly port: number
      readonly path?: string | undefined | undefined
      readonly version?: string | undefined | undefined
    }
  | {
      readonly _tag: "https"
      readonly host: string
      readonly port: number
      readonly version?: string | undefined | undefined
      readonly path?: string | undefined | undefined
      readonly cert?: string | undefined | undefined
      readonly ca?: string | undefined | undefined
      readonly key?: string | undefined | undefined
      readonly passphrase?: string | undefined | undefined
    },
  never,
  never
>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DindEngine.ts#L77)

Since v1.0.0

## layerDeno

**Signature**

```ts
declare const layerDeno: MakeDindLayerFromPlatformConstructor<
  (connectionOptions: MobyConnection.MobyConnectionOptions) => DockerEngine.DockerLayer,
  | { readonly _tag: "socket"; readonly socketPath: string; readonly version?: string | undefined | undefined }
  | {
      readonly _tag: "ssh"
      readonly remoteSocketPath: string
      readonly host: string
      readonly version?: string | undefined | undefined
      readonly port?: number | undefined
      readonly forceIPv4?: boolean | undefined
      readonly forceIPv6?: boolean | undefined
      readonly hostHash?: string | undefined
      readonly hostVerifier?:
        | (HostVerifier | SyncHostVerifier | HostFingerprintVerifier | SyncHostFingerprintVerifier)
        | undefined
      readonly username?: string | undefined
      readonly password?: string | undefined
      readonly agent?: (BaseAgent | string) | undefined
      readonly privateKey?: (Buffer | string) | undefined
      readonly passphrase?: (Buffer | string) | undefined
      readonly localHostname?: string | undefined
      readonly localUsername?: string | undefined
      readonly tryKeyboard?: boolean | undefined
      readonly keepaliveInterval?: number | undefined
      readonly keepaliveCountMax?: number | undefined
      readonly readyTimeout?: number | undefined
      readonly strictVendor?: boolean | undefined
      readonly sock?: Stream.Readable | undefined
      readonly agentForward?: boolean | undefined
      readonly algorithms?: Algorithms | undefined
      readonly debug?: DebugFunction | undefined
      readonly authHandler?: (AuthenticationType[] | AuthHandlerMiddleware | AuthMethod[]) | undefined
      readonly localAddress?: string | undefined
      readonly localPort?: number | undefined
      readonly timeout?: number | undefined
      readonly ident?: (Buffer | string) | undefined
    }
  | {
      readonly _tag: "http"
      readonly host: string
      readonly port: number
      readonly path?: string | undefined | undefined
      readonly version?: string | undefined | undefined
    }
  | {
      readonly _tag: "https"
      readonly host: string
      readonly port: number
      readonly version?: string | undefined | undefined
      readonly path?: string | undefined | undefined
      readonly cert?: string | undefined | undefined
      readonly ca?: string | undefined | undefined
      readonly key?: string | undefined | undefined
      readonly passphrase?: string | undefined | undefined
    },
  never,
  never
>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DindEngine.ts#L84)

Since v1.0.0

## layerFetch

**Signature**

```ts
declare const layerFetch: MakeDindLayerFromPlatformConstructor<
  (
    connectionOptions: MobyConnection.HttpConnectionOptionsTagged | MobyConnection.HttpsConnectionOptionsTagged
  ) => DockerEngine.DockerLayer,
  | {
      readonly _tag: "http"
      readonly host: string
      readonly port: number
      readonly path?: string | undefined | undefined
      readonly version?: string | undefined | undefined
    }
  | {
      readonly _tag: "https"
      readonly host: string
      readonly port: number
      readonly version?: string | undefined | undefined
      readonly path?: string | undefined | undefined
      readonly cert?: string | undefined | undefined
      readonly ca?: string | undefined | undefined
      readonly key?: string | undefined | undefined
      readonly passphrase?: string | undefined | undefined
    },
  never,
  never
>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DindEngine.ts#L105)

Since v1.0.0

## layerNodeJS

**Signature**

```ts
declare const layerNodeJS: MakeDindLayerFromPlatformConstructor<
  (connectionOptions: MobyConnection.MobyConnectionOptions) => DockerEngine.DockerLayer,
  | { readonly _tag: "socket"; readonly socketPath: string; readonly version?: string | undefined | undefined }
  | {
      readonly _tag: "ssh"
      readonly remoteSocketPath: string
      readonly host: string
      readonly version?: string | undefined | undefined
      readonly port?: number | undefined
      readonly forceIPv4?: boolean | undefined
      readonly forceIPv6?: boolean | undefined
      readonly hostHash?: string | undefined
      readonly hostVerifier?:
        | (HostVerifier | SyncHostVerifier | HostFingerprintVerifier | SyncHostFingerprintVerifier)
        | undefined
      readonly username?: string | undefined
      readonly password?: string | undefined
      readonly agent?: (BaseAgent | string) | undefined
      readonly privateKey?: (Buffer | string) | undefined
      readonly passphrase?: (Buffer | string) | undefined
      readonly localHostname?: string | undefined
      readonly localUsername?: string | undefined
      readonly tryKeyboard?: boolean | undefined
      readonly keepaliveInterval?: number | undefined
      readonly keepaliveCountMax?: number | undefined
      readonly readyTimeout?: number | undefined
      readonly strictVendor?: boolean | undefined
      readonly sock?: Stream.Readable | undefined
      readonly agentForward?: boolean | undefined
      readonly algorithms?: Algorithms | undefined
      readonly debug?: DebugFunction | undefined
      readonly authHandler?: (AuthenticationType[] | AuthHandlerMiddleware | AuthMethod[]) | undefined
      readonly localAddress?: string | undefined
      readonly localPort?: number | undefined
      readonly timeout?: number | undefined
      readonly ident?: (Buffer | string) | undefined
    }
  | {
      readonly _tag: "http"
      readonly host: string
      readonly port: number
      readonly path?: string | undefined | undefined
      readonly version?: string | undefined | undefined
    }
  | {
      readonly _tag: "https"
      readonly host: string
      readonly port: number
      readonly version?: string | undefined | undefined
      readonly path?: string | undefined | undefined
      readonly cert?: string | undefined | undefined
      readonly ca?: string | undefined | undefined
      readonly key?: string | undefined | undefined
      readonly passphrase?: string | undefined | undefined
    },
  never,
  never
>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DindEngine.ts#L70)

Since v1.0.0

## layerUndici

**Signature**

```ts
declare const layerUndici: MakeDindLayerFromPlatformConstructor<
  (connectionOptions: MobyConnection.MobyConnectionOptions) => DockerEngine.DockerLayer,
  | { readonly _tag: "socket"; readonly socketPath: string; readonly version?: string | undefined | undefined }
  | {
      readonly _tag: "ssh"
      readonly remoteSocketPath: string
      readonly host: string
      readonly version?: string | undefined | undefined
      readonly port?: number | undefined
      readonly forceIPv4?: boolean | undefined
      readonly forceIPv6?: boolean | undefined
      readonly hostHash?: string | undefined
      readonly hostVerifier?:
        | (HostVerifier | SyncHostVerifier | HostFingerprintVerifier | SyncHostFingerprintVerifier)
        | undefined
      readonly username?: string | undefined
      readonly password?: string | undefined
      readonly agent?: (BaseAgent | string) | undefined
      readonly privateKey?: (Buffer | string) | undefined
      readonly passphrase?: (Buffer | string) | undefined
      readonly localHostname?: string | undefined
      readonly localUsername?: string | undefined
      readonly tryKeyboard?: boolean | undefined
      readonly keepaliveInterval?: number | undefined
      readonly keepaliveCountMax?: number | undefined
      readonly readyTimeout?: number | undefined
      readonly strictVendor?: boolean | undefined
      readonly sock?: Stream.Readable | undefined
      readonly agentForward?: boolean | undefined
      readonly algorithms?: Algorithms | undefined
      readonly debug?: DebugFunction | undefined
      readonly authHandler?: (AuthenticationType[] | AuthHandlerMiddleware | AuthMethod[]) | undefined
      readonly localAddress?: string | undefined
      readonly localPort?: number | undefined
      readonly timeout?: number | undefined
      readonly ident?: (Buffer | string) | undefined
    }
  | {
      readonly _tag: "http"
      readonly host: string
      readonly port: number
      readonly path?: string | undefined | undefined
      readonly version?: string | undefined | undefined
    }
  | {
      readonly _tag: "https"
      readonly host: string
      readonly port: number
      readonly version?: string | undefined | undefined
      readonly path?: string | undefined | undefined
      readonly cert?: string | undefined | undefined
      readonly ca?: string | undefined | undefined
      readonly key?: string | undefined | undefined
      readonly passphrase?: string | undefined | undefined
    },
  never,
  never
>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DindEngine.ts#L91)

Since v1.0.0

## layerWeb

**Signature**

```ts
declare const layerWeb: MakeDindLayerFromPlatformConstructor<
  (
    connectionOptions: MobyConnection.HttpConnectionOptionsTagged | MobyConnection.HttpsConnectionOptionsTagged
  ) => DockerEngine.DockerLayer,
  | {
      readonly _tag: "http"
      readonly host: string
      readonly port: number
      readonly path?: string | undefined | undefined
      readonly version?: string | undefined | undefined
    }
  | {
      readonly _tag: "https"
      readonly host: string
      readonly port: number
      readonly version?: string | undefined | undefined
      readonly path?: string | undefined | undefined
      readonly cert?: string | undefined | undefined
      readonly ca?: string | undefined | undefined
      readonly key?: string | undefined | undefined
      readonly passphrase?: string | undefined | undefined
    },
  never,
  never
>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/DindEngine.ts#L98)

Since v1.0.0
