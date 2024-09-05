---
title: engines/Podman.ts
nav_order: 28
parent: Modules
---

## Podman overview

Podman engine helpers

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Layers](#layers)
  - [PodmanLayer (type alias)](#podmanlayer-type-alias)
  - [PodmanLayerWithoutHttpCLient (type alias)](#podmanlayerwithouthttpclient-type-alias)
  - [PodmanLayerWithoutPlatformLayerConstructor (type alias)](#podmanlayerwithoutplatformlayerconstructor-type-alias)
  - [layerBun](#layerbun)
  - [layerDeno](#layerdeno)
  - [layerNodeJS](#layernodejs)
  - [layerUndici](#layerundici)
  - [layerWeb](#layerweb)
  - [layerWithoutHttpCLient](#layerwithouthttpclient)
- [Tags](#tags)
  - [PlatformLayerConstructor](#platformlayerconstructor)
  - [PodmanLayerConstructor (interface)](#podmanlayerconstructor-interface)
  - [PodmanLayerConstructorImpl (type alias)](#podmanlayerconstructorimpl-type-alias)

---

# Layers

## PodmanLayer (type alias)

**Signature**

```ts
export type PodmanLayer = Layer.Layer<
  Layer.Layer.Success<PodmanLayerWithoutPlatformLayerConstructor> | PodmanLayerConstructor,
  Layer.Layer.Error<PodmanLayerWithoutPlatformLayerConstructor>,
  Layer.Layer.Context<PodmanLayerWithoutPlatformLayerConstructor>
>
```

Added in v1.0.0

## PodmanLayerWithoutHttpCLient (type alias)

**Signature**

```ts
export type PodmanLayerWithoutHttpCLient = Layer.Layer<
  Layer.Layer.Success<PodmanLayerWithoutPlatformLayerConstructor>,
  Layer.Layer.Error<PodmanLayerWithoutPlatformLayerConstructor>,
  Layer.Layer.Context<PodmanLayerWithoutPlatformLayerConstructor> | HttpClient.HttpClient.Default
>
```

Added in v1.0.0

## PodmanLayerWithoutPlatformLayerConstructor (type alias)

**Signature**

```ts
export type PodmanLayerWithoutPlatformLayerConstructor = Layer.Layer<
  | Containers.Containers
  | Execs.Execs
  | Images.Images
  | Networks.Networks
  | Secrets.Secrets
  | System.Systems
  | Volumes.Volumes,
  never,
  never
>
```

Added in v1.0.0

## layerBun

**Signature**

```ts
export declare const layerBun: PodmanLayerConstructorImpl<
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
export declare const layerDeno: PodmanLayerConstructorImpl<
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
export declare const layerNodeJS: PodmanLayerConstructorImpl<
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
export declare const layerUndici: PodmanLayerConstructorImpl<
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
export declare const layerWeb: PodmanLayerConstructorImpl<
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

**Signature**

```ts
export declare const layerWithoutHttpCLient: PodmanLayerWithoutHttpCLient
```

Added in v1.0.0

# Tags

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
>() => Context.Tag<PodmanLayerConstructor, PodmanLayerConstructorImpl<A>>
```

Added in v1.0.0

## PodmanLayerConstructor (interface)

**Signature**

```ts
export interface PodmanLayerConstructor {
  readonly _: unique symbol
}
```

Added in v1.0.0

## PodmanLayerConstructorImpl (type alias)

**Signature**

```ts
export type PodmanLayerConstructorImpl<A = Platforms.MobyConnectionOptions> = (connectionOptions: A) => PodmanLayer
```

Added in v1.0.0
