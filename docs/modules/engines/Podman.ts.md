---
title: engines/Podman.ts
nav_order: 38
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
      readonly host?: string | undefined
      readonly port?: number | undefined
      readonly forceIPv4?: boolean | undefined
      readonly forceIPv6?: boolean | undefined
      readonly hostHash?: string | undefined
      readonly hostVerifier?:
        | HostVerifier
        | SyncHostVerifier
        | HostFingerprintVerifier
        | SyncHostFingerprintVerifier
        | undefined
      readonly username?: string | undefined
      readonly password?: string | undefined
      readonly agent?: string | BaseAgent<string | Buffer | ParsedKey> | undefined
      readonly privateKey?: string | Buffer | undefined
      readonly passphrase?: string | Buffer | undefined
      readonly localHostname?: string | undefined
      readonly localUsername?: string | undefined
      readonly tryKeyboard?: boolean | undefined
      readonly keepaliveInterval?: number | undefined
      readonly keepaliveCountMax?: number | undefined
      readonly readyTimeout?: number | undefined
      readonly strictVendor?: boolean | undefined
      readonly sock?: Readable | undefined
      readonly agentForward?: boolean | undefined
      readonly algorithms?: Algorithms | undefined
      readonly debug?: DebugFunction | undefined
      readonly authHandler?: AuthenticationType[] | AuthHandlerMiddleware | AuthMethod[] | undefined
      readonly localAddress?: string | undefined
      readonly localPort?: number | undefined
      readonly timeout?: number | undefined
      readonly ident?: string | Buffer | undefined
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
      readonly host?: string | undefined
      readonly port?: number | undefined
      readonly forceIPv4?: boolean | undefined
      readonly forceIPv6?: boolean | undefined
      readonly hostHash?: string | undefined
      readonly hostVerifier?:
        | HostVerifier
        | SyncHostVerifier
        | HostFingerprintVerifier
        | SyncHostFingerprintVerifier
        | undefined
      readonly username?: string | undefined
      readonly password?: string | undefined
      readonly agent?: string | BaseAgent<string | Buffer | ParsedKey> | undefined
      readonly privateKey?: string | Buffer | undefined
      readonly passphrase?: string | Buffer | undefined
      readonly localHostname?: string | undefined
      readonly localUsername?: string | undefined
      readonly tryKeyboard?: boolean | undefined
      readonly keepaliveInterval?: number | undefined
      readonly keepaliveCountMax?: number | undefined
      readonly readyTimeout?: number | undefined
      readonly strictVendor?: boolean | undefined
      readonly sock?: Readable | undefined
      readonly agentForward?: boolean | undefined
      readonly algorithms?: Algorithms | undefined
      readonly debug?: DebugFunction | undefined
      readonly authHandler?: AuthenticationType[] | AuthHandlerMiddleware | AuthMethod[] | undefined
      readonly localAddress?: string | undefined
      readonly localPort?: number | undefined
      readonly timeout?: number | undefined
      readonly ident?: string | Buffer | undefined
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
      readonly host?: string | undefined
      readonly port?: number | undefined
      readonly forceIPv4?: boolean | undefined
      readonly forceIPv6?: boolean | undefined
      readonly hostHash?: string | undefined
      readonly hostVerifier?:
        | HostVerifier
        | SyncHostVerifier
        | HostFingerprintVerifier
        | SyncHostFingerprintVerifier
        | undefined
      readonly username?: string | undefined
      readonly password?: string | undefined
      readonly agent?: string | BaseAgent<string | Buffer | ParsedKey> | undefined
      readonly privateKey?: string | Buffer | undefined
      readonly passphrase?: string | Buffer | undefined
      readonly localHostname?: string | undefined
      readonly localUsername?: string | undefined
      readonly tryKeyboard?: boolean | undefined
      readonly keepaliveInterval?: number | undefined
      readonly keepaliveCountMax?: number | undefined
      readonly readyTimeout?: number | undefined
      readonly strictVendor?: boolean | undefined
      readonly sock?: Readable | undefined
      readonly agentForward?: boolean | undefined
      readonly algorithms?: Algorithms | undefined
      readonly debug?: DebugFunction | undefined
      readonly authHandler?: AuthenticationType[] | AuthHandlerMiddleware | AuthMethod[] | undefined
      readonly localAddress?: string | undefined
      readonly localPort?: number | undefined
      readonly timeout?: number | undefined
      readonly ident?: string | Buffer | undefined
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
      readonly host?: string | undefined
      readonly port?: number | undefined
      readonly forceIPv4?: boolean | undefined
      readonly forceIPv6?: boolean | undefined
      readonly hostHash?: string | undefined
      readonly hostVerifier?:
        | HostVerifier
        | SyncHostVerifier
        | HostFingerprintVerifier
        | SyncHostFingerprintVerifier
        | undefined
      readonly username?: string | undefined
      readonly password?: string | undefined
      readonly agent?: string | BaseAgent<string | Buffer | ParsedKey> | undefined
      readonly privateKey?: string | Buffer | undefined
      readonly passphrase?: string | Buffer | undefined
      readonly localHostname?: string | undefined
      readonly localUsername?: string | undefined
      readonly tryKeyboard?: boolean | undefined
      readonly keepaliveInterval?: number | undefined
      readonly keepaliveCountMax?: number | undefined
      readonly readyTimeout?: number | undefined
      readonly strictVendor?: boolean | undefined
      readonly sock?: Readable | undefined
      readonly agentForward?: boolean | undefined
      readonly algorithms?: Algorithms | undefined
      readonly debug?: DebugFunction | undefined
      readonly authHandler?: AuthenticationType[] | AuthHandlerMiddleware | AuthMethod[] | undefined
      readonly localAddress?: string | undefined
      readonly localPort?: number | undefined
      readonly timeout?: number | undefined
      readonly ident?: string | Buffer | undefined
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
        readonly host?: string | undefined
        readonly port?: number | undefined
        readonly forceIPv4?: boolean | undefined
        readonly forceIPv6?: boolean | undefined
        readonly hostHash?: string | undefined
        readonly hostVerifier?:
          | HostVerifier
          | SyncHostVerifier
          | HostFingerprintVerifier
          | SyncHostFingerprintVerifier
          | undefined
        readonly username?: string | undefined
        readonly password?: string | undefined
        readonly agent?: string | BaseAgent<string | Buffer | ParsedKey> | undefined
        readonly privateKey?: string | Buffer | undefined
        readonly passphrase?: string | Buffer | undefined
        readonly localHostname?: string | undefined
        readonly localUsername?: string | undefined
        readonly tryKeyboard?: boolean | undefined
        readonly keepaliveInterval?: number | undefined
        readonly keepaliveCountMax?: number | undefined
        readonly readyTimeout?: number | undefined
        readonly strictVendor?: boolean | undefined
        readonly sock?: Readable | undefined
        readonly agentForward?: boolean | undefined
        readonly algorithms?: Algorithms | undefined
        readonly debug?: DebugFunction | undefined
        readonly authHandler?: AuthenticationType[] | AuthHandlerMiddleware | AuthMethod[] | undefined
        readonly localAddress?: string | undefined
        readonly localPort?: number | undefined
        readonly timeout?: number | undefined
        readonly ident?: string | Buffer | undefined
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
