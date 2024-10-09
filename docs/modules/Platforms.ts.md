---
title: Platforms.ts
nav_order: 30
parent: Modules
---

## Platforms overview

Http, https, ssh, and unix socket connection agents for all platforms.

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Connection](#connection)
  - [makeAgnosticHttpClientLayer](#makeagnostichttpclientlayer)
  - [makeBunHttpClientLayer](#makebunhttpclientlayer)
  - [makeDenoHttpClientLayer](#makedenohttpclientlayer)
  - [makeNodeHttpClientLayer](#makenodehttpclientlayer)
  - [makeUndiciHttpClientLayer](#makeundicihttpclientlayer)
  - [makeWebHttpClientLayer](#makewebhttpclientlayer)
- [Connection Constructors](#connection-constructors)
  - [HttpConnectionOptions](#httpconnectionoptions)
  - [HttpsConnectionOptions](#httpsconnectionoptions)
  - [SocketConnectionOptions](#socketconnectionoptions)
  - [SshConnectionOptions](#sshconnectionoptions)
- [Connection Types](#connection-types)
  - [HttpConnectionOptions (type alias)](#httpconnectionoptions-type-alias)
  - [HttpConnectionOptionsTagged (type alias)](#httpconnectionoptionstagged-type-alias)
  - [HttpsConnectionOptions (type alias)](#httpsconnectionoptions-type-alias)
  - [HttpsConnectionOptionsTagged (type alias)](#httpsconnectionoptionstagged-type-alias)
  - [MobyConnectionOptions](#mobyconnectionoptions)
  - [MobyConnectionOptions (type alias)](#mobyconnectionoptions-type-alias)
  - [SocketConnectionOptions (type alias)](#socketconnectionoptions-type-alias)
  - [SocketConnectionOptionsTagged (type alias)](#socketconnectionoptionstagged-type-alias)
  - [SshConnectionOptions (type alias)](#sshconnectionoptions-type-alias)
  - [SshConnectionOptionsTagged (type alias)](#sshconnectionoptionstagged-type-alias)
- [Constructors](#constructors)
  - [connectionOptionsFromDockerHostEnvironmentVariable](#connectionoptionsfromdockerhostenvironmentvariable)
  - [connectionOptionsFromPlatformSystemSocketDefault](#connectionoptionsfromplatformsystemsocketdefault)
  - [connectionOptionsFromUrl](#connectionoptionsfromurl)
  - [connectionOptionsFromUserSocketDefault](#connectionoptionsfromusersocketdefault)

---

# Connection

## makeAgnosticHttpClientLayer

Given the moby connection options, it will construct a layer that provides a
http client that you could use to connect to your moby instance.

**Signature**

```ts
export declare const makeAgnosticHttpClientLayer: (
  connectionOptions: CommonInternal.HttpConnectionOptionsTagged | CommonInternal.HttpsConnectionOptionsTagged
) => Layer<HttpClient, never, HttpClient>
```

Added in v1.0.0

## makeBunHttpClientLayer

Given the moby connection options, it will construct a layer that provides a
http client that you could use to connect to your moby instance. This is no
different than the Node implementation currently.

**Signature**

```ts
export declare const makeBunHttpClientLayer: (
  connectionOptions: CommonInternal.MobyConnectionOptions
) => NeedsPlatformNode<Layer<HttpClient, never, never>>
```

Added in v1.0.0

## makeDenoHttpClientLayer

Given the moby connection options, it will construct a layer that provides a
http client that you could use to connect to your moby instance. This is no
different than the Node implementation currently.

**Signature**

```ts
export declare const makeDenoHttpClientLayer: (
  connectionOptions: CommonInternal.MobyConnectionOptions
) => NeedsPlatformNode<Layer<HttpClient, never, never>>
```

Added in v1.0.0

## makeNodeHttpClientLayer

Given the moby connection options, it will construct a layer that provides a
http client that you could use to connect to your moby instance.

**Signature**

```ts
export declare const makeNodeHttpClientLayer: (
  connectionOptions: CommonInternal.MobyConnectionOptions
) => NeedsPlatformNode<Layer<HttpClient, never, never>>
```

Added in v1.0.0

## makeUndiciHttpClientLayer

Given the moby connection options, it will construct a layer that provides a
http client that you could use to connect to your moby instance.

**Signature**

```ts
export declare const makeUndiciHttpClientLayer: (
  connectionOptions: CommonInternal.MobyConnectionOptions
) => NeedsPlatformNode<NeedsUndici<Layer<HttpClient, never, never>>>
```

Added in v1.0.0

## makeWebHttpClientLayer

Given the moby connection options, it will construct a layer that provides a
http client that you could use to connect to your moby instance.

**Signature**

```ts
export declare const makeWebHttpClientLayer: (
  connectionOptions: CommonInternal.HttpConnectionOptionsTagged | CommonInternal.HttpsConnectionOptionsTagged
) => NeedsPlatformBrowser<Layer<HttpClient, never, never>>
```

Added in v1.0.0

# Connection Constructors

## HttpConnectionOptions

**Signature**

```ts
export declare const HttpConnectionOptions: Case.Constructor<
  { readonly _tag: "http"; readonly host: string; readonly port: number; readonly path?: string | undefined },
  "_tag"
>
```

Added in v1.0.0

## HttpsConnectionOptions

**Signature**

```ts
export declare const HttpsConnectionOptions: Case.Constructor<
  {
    readonly _tag: "https"
    readonly host: string
    readonly port: number
    readonly path?: string | undefined
    readonly cert?: string | undefined
    readonly ca?: string | undefined
    readonly key?: string | undefined
    readonly passphrase?: string | undefined
  },
  "_tag"
>
```

Added in v1.0.0

## SocketConnectionOptions

**Signature**

```ts
export declare const SocketConnectionOptions: Case.Constructor<
  { readonly _tag: "socket"; readonly socketPath: string },
  "_tag"
>
```

Added in v1.0.0

## SshConnectionOptions

Connects to a remote machine over ssh. This specific ssh implementation uses
the OpenSSH extension "ForwardOutLocalStream" (so you must being running an
OpenSSH server or something that implements the "ForwardOutLocalStream"
extension) that opens a connection to a UNIX domain socket at socketPath on
the server.

**Signature**

```ts
export declare const SshConnectionOptions: Case.Constructor<
  {
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
  },
  "_tag"
>
```

Added in v1.0.0

# Connection Types

## HttpConnectionOptions (type alias)

**Signature**

```ts
export type HttpConnectionOptions = CommonInternal.HttpConnectionOptions
```

Added in v1.0.0

## HttpConnectionOptionsTagged (type alias)

**Signature**

```ts
export type HttpConnectionOptionsTagged = CommonInternal.HttpConnectionOptionsTagged
```

Added in v1.0.0

## HttpsConnectionOptions (type alias)

**Signature**

```ts
export type HttpsConnectionOptions = CommonInternal.HttpsConnectionOptions
```

Added in v1.0.0

## HttpsConnectionOptionsTagged (type alias)

**Signature**

```ts
export type HttpsConnectionOptionsTagged = CommonInternal.HttpsConnectionOptionsTagged
```

Added in v1.0.0

## MobyConnectionOptions

Connection options for how to connect to your moby/docker instance. Can be a
unix socket on the current machine. Can be an ssh connection to a remote
machine with a remote user, remote machine, remote port, and remote socket
path. Can be an http connection to a remote machine with a host, port, and
path. Or it can be an https connection to a remote machine with a host, port,
path, cert, ca, key, and passphrase.

**Signature**

```ts
export declare const MobyConnectionOptions: {
  readonly socket: Case.Constructor<{ readonly _tag: "socket"; readonly socketPath: string }, "_tag">
  readonly ssh: Case.Constructor<
    {
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
    },
    "_tag"
  >
  readonly http: Case.Constructor<
    { readonly _tag: "http"; readonly host: string; readonly port: number; readonly path?: string | undefined },
    "_tag"
  >
  readonly https: Case.Constructor<
    {
      readonly _tag: "https"
      readonly host: string
      readonly port: number
      readonly path?: string | undefined
      readonly cert?: string | undefined
      readonly ca?: string | undefined
      readonly key?: string | undefined
      readonly passphrase?: string | undefined
    },
    "_tag"
  >
  readonly $is: <Tag>(
    tag: Tag
  ) => (
    u: unknown
  ) => u is Extract<
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
      },
    { readonly _tag: Tag }
  >
  readonly $match: {
    <Cases>(
      cases: Cases
    ): (
      value:
        | { readonly _tag: "socket"; readonly socketPath: string }
        | {
            readonly _tag: "ssh"
            readonly remoteSocketPath: string
            readonly host: string
            readonly port?: number
            readonly forceIPv4?: boolean
            readonly forceIPv6?: boolean
            readonly hostHash?: string
            readonly hostVerifier?:
              | HostVerifier
              | SyncHostVerifier
              | HostFingerprintVerifier
              | SyncHostFingerprintVerifier
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
    ) => Unify<ReturnType<Cases["socket" | "ssh" | "http" | "https"]>>
    <Cases>(
      value:
        | { readonly _tag: "socket"; readonly socketPath: string }
        | {
            readonly _tag: "ssh"
            readonly remoteSocketPath: string
            readonly host: string
            readonly port?: number
            readonly forceIPv4?: boolean
            readonly forceIPv6?: boolean
            readonly hostHash?: string
            readonly hostVerifier?:
              | HostVerifier
              | SyncHostVerifier
              | HostFingerprintVerifier
              | SyncHostFingerprintVerifier
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
          },
      cases: Cases
    ): Unify<ReturnType<Cases["socket" | "ssh" | "http" | "https"]>>
  }
}
```

Added in v1.0.0

## MobyConnectionOptions (type alias)

Connection options for how to connect to your moby/docker instance. Can be a
unix socket on the current machine. Can be an ssh connection to a remote
machine with a remote user, remote machine, remote port, and remote socket
path. Can be an http connection to a remote machine with a host, port, and
path. Or it can be an https connection to a remote machine with a host, port,
path, cert, ca, key, and passphrase.

**Signature**

```ts
export type MobyConnectionOptions = CommonInternal.MobyConnectionOptions
```

Added in v1.0.0

## SocketConnectionOptions (type alias)

**Signature**

```ts
export type SocketConnectionOptions = CommonInternal.SocketConnectionOptions
```

Added in v1.0.0

## SocketConnectionOptionsTagged (type alias)

**Signature**

```ts
export type SocketConnectionOptionsTagged = CommonInternal.SocketConnectionOptionsTagged
```

Added in v1.0.0

## SshConnectionOptions (type alias)

**Signature**

```ts
export type SshConnectionOptions = CommonInternal.SshConnectionOptions
```

Added in v1.0.0

## SshConnectionOptionsTagged (type alias)

**Signature**

```ts
export type SshConnectionOptionsTagged = CommonInternal.SshConnectionOptionsTagged
```

Added in v1.0.0

# Constructors

## connectionOptionsFromDockerHostEnvironmentVariable

Creates a MobyApi layer from the DOCKER_HOST environment variable as a url.

**Signature**

```ts
export declare const connectionOptionsFromDockerHostEnvironmentVariable: Effect.Effect<
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
    },
  ConfigError.ConfigError,
  never
>
```

Added in v1.0.0

## connectionOptionsFromPlatformSystemSocketDefault

Creates a MobyApi layer from the platform default system socket location.

**Signature**

```ts
export declare const connectionOptionsFromPlatformSystemSocketDefault: () => Effect.Effect<
  CommonInternal.MobyConnectionOptions,
  ConfigError.ConfigError,
  never
>
```

Added in v1.0.0

## connectionOptionsFromUrl

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
export declare const connectionOptionsFromUrl: (
  dockerHost: string
) => Effect.Effect<CommonInternal.MobyConnectionOptions, ConfigError.ConfigError, never>
```

Added in v1.0.0

## connectionOptionsFromUserSocketDefault

Creates a MobyApi layer from the platform default system socket location.

**Signature**

```ts
export declare const connectionOptionsFromUserSocketDefault: () => Effect.Effect<
  CommonInternal.MobyConnectionOptions,
  never,
  Path.Path
>
```

Added in v1.0.0
