---
title: engines/Moby.ts
nav_order: 27
parent: Modules
---

## Moby overview

Generic Moby helpers

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Layers](#layers)
  - [MobyLayer (type alias)](#mobylayer-type-alias)
  - [MobyLayerWithoutHttpClient (type alias)](#mobylayerwithouthttpclient-type-alias)
  - [MobyLayerWithoutPlatformLayerConstructor (type alias)](#mobylayerwithoutplatformlayerconstructor-type-alias)
  - [layerBun](#layerbun)
  - [layerDeno](#layerdeno)
  - [layerNodeJS](#layernodejs)
  - [layerUndici](#layerundici)
  - [layerWeb](#layerweb)
  - [layerWithoutHttpCLient](#layerwithouthttpclient)
- [Tags](#tags)
  - [MobyLayerConstructor (interface)](#mobylayerconstructor-interface)
  - [MobyLayerConstructorImpl (type alias)](#mobylayerconstructorimpl-type-alias)
  - [PlatformLayerConstructor](#platformlayerconstructor)

---

# Layers

## MobyLayer (type alias)

**Signature**

```ts
export type MobyLayer = Layer.Layer<
  Layer.Layer.Success<MobyLayerWithoutPlatformLayerConstructor> | MobyLayerConstructor,
  Layer.Layer.Error<MobyLayerWithoutPlatformLayerConstructor>,
  Layer.Layer.Context<MobyLayerWithoutPlatformLayerConstructor>
>
```

Added in v1.0.0

## MobyLayerWithoutHttpClient (type alias)

**Signature**

```ts
export type MobyLayerWithoutHttpClient = Layer.Layer<
  Layer.Layer.Success<MobyLayerWithoutPlatformLayerConstructor>,
  Layer.Layer.Error<MobyLayerWithoutPlatformLayerConstructor>,
  Layer.Layer.Context<MobyLayerWithoutPlatformLayerConstructor> | HttpClient.HttpClient.Default
>
```

Added in v1.0.0

## MobyLayerWithoutPlatformLayerConstructor (type alias)

Merges all the layers into a single layer

**Signature**

```ts
export type MobyLayerWithoutPlatformLayerConstructor = Layer.Layer<
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
  | Swarm.Swarm
  | System.Systems
  | Tasks.Tasks
  | Volumes.Volumes,
  never,
  never
>
```

Added in v1.0.0

## layerBun

**Signature**

```ts
export declare const layerBun: MobyLayerConstructorImpl<
  | { readonly _tag: "socket"; readonly socketPath: string }
  | {
      readonly _tag: "ssh"
      readonly remoteSocketPath: string
      readonly host?: string
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
>
```

Added in v1.0.0

## layerDeno

**Signature**

```ts
export declare const layerDeno: MobyLayerConstructorImpl<
  | { readonly _tag: "socket"; readonly socketPath: string }
  | {
      readonly _tag: "ssh"
      readonly remoteSocketPath: string
      readonly host?: string
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
>
```

Added in v1.0.0

## layerNodeJS

**Signature**

```ts
export declare const layerNodeJS: MobyLayerConstructorImpl<
  | { readonly _tag: "socket"; readonly socketPath: string }
  | {
      readonly _tag: "ssh"
      readonly remoteSocketPath: string
      readonly host?: string
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
>
```

Added in v1.0.0

## layerUndici

**Signature**

```ts
export declare const layerUndici: MobyLayerConstructorImpl<
  | { readonly _tag: "socket"; readonly socketPath: string }
  | {
      readonly _tag: "ssh"
      readonly remoteSocketPath: string
      readonly host?: string
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
>
```

Added in v1.0.0

## layerWeb

**Signature**

```ts
export declare const layerWeb: MobyLayerConstructorImpl<
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
>
```

Added in v1.0.0

## layerWithoutHttpCLient

Merges all the layers into a single layer

**Signature**

```ts
export declare const layerWithoutHttpCLient: MobyLayerWithoutHttpClient
```

Added in v1.0.0

# Tags

## MobyLayerConstructor (interface)

**Signature**

```ts
export interface MobyLayerConstructor {
  readonly _: unique symbol
}
```

Added in v1.0.0

## MobyLayerConstructorImpl (type alias)

**Signature**

```ts
export type MobyLayerConstructorImpl<A = Platforms.MobyConnectionOptions> = (connectionOptions: A) => MobyLayer
```

Added in v1.0.0

## PlatformLayerConstructor

**Signature**

```ts
export declare const PlatformLayerConstructor: <
  A =
    | { readonly _tag: "socket"; readonly socketPath: string }
    | {
        readonly _tag: "ssh"
        readonly remoteSocketPath: string
        readonly host?: string
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
>() => Context.Tag<MobyLayerConstructor, MobyLayerConstructorImpl<A>>
```

Added in v1.0.0
