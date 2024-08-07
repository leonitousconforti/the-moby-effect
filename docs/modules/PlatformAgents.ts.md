---
title: PlatformAgents.ts
nav_order: 32
parent: Modules
---

## PlatformAgents overview

Http, https, ssh, and unix socket connection agents for all platforms.

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Connection](#connection)
  - [makeBunHttpClientLayer](#makebunhttpclientlayer)
  - [makeDenoHttpClientLayer](#makedenohttpclientlayer)
  - [makeNodeHttpClientLayer](#makenodehttpclientlayer)
  - [makeUndiciHttpClientLayer](#makeundicihttpclientlayer)
  - [makeWebHttpClientLayer](#makewebhttpclientlayer)
- [Connection Types](#connection-types)
  - [HttpConnectionOptions](#httpconnectionoptions)
  - [HttpsConnectionOptions](#httpsconnectionoptions)
  - [MobyConnectionOptions](#mobyconnectionoptions)
  - [MobyConnectionOptions (type alias)](#mobyconnectionoptions-type-alias)
  - [SocketConnectionOptions](#socketconnectionoptions)
  - [SshConnectionOptions](#sshconnectionoptions)
- [Constructors](#constructors)
  - [connectionOptionsFromDockerHostEnvironmentVariable](#connectionoptionsfromdockerhostenvironmentvariable)
  - [connectionOptionsFromPlatformSystemSocketDefault](#connectionoptionsfromplatformsystemsocketdefault)
  - [connectionOptionsFromUrl](#connectionoptionsfromurl)
  - [connectionOptionsFromUserSocketDefault](#connectionoptionsfromusersocketdefault)

---

# Connection

## makeBunHttpClientLayer

Given the moby connection options, it will construct a layer that provides a
http client that you could use to connect to your moby instance. This is no
different than the Node implementation currently.

**Signature**

```ts
export declare const makeBunHttpClientLayer: (
  connectionOptions:
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
) => Layer<HttpClient.Default, never, never>
```

Added in v1.0.0

## makeDenoHttpClientLayer

Given the moby connection options, it will construct a layer that provides a
http client that you could use to connect to your moby instance. This is no
different than the Node implementation currently.

**Signature**

```ts
export declare const makeDenoHttpClientLayer: (
  connectionOptions:
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
) => Layer<HttpClient.Default, never, never>
```

Added in v1.0.0

## makeNodeHttpClientLayer

Given the moby connection options, it will construct a layer that provides a
http client that you could use to connect to your moby instance.

**Signature**

```ts
export declare const makeNodeHttpClientLayer: (
  connectionOptions:
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
) => Layer<HttpClient.Default, never, never>
```

Added in v1.0.0

## makeUndiciHttpClientLayer

Given the moby connection options, it will construct a layer that provides a
http client that you could use to connect to your moby instance.

**Signature**

```ts
export declare const makeUndiciHttpClientLayer: (
  connectionOptions:
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
) => Layer<HttpClient.Default, never, never>
```

Added in v1.0.0

## makeWebHttpClientLayer

Given the moby connection options, it will construct a layer that provides a
http client that you could use to connect to your moby instance.

**Signature**

```ts
export declare const makeWebHttpClientLayer: (
  connectionOptions:
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
) => Layer<HttpClient.Default, ConfigError.ConfigError, never>
```

Added in v1.0.0

# Connection Types

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
  ) => u is
    | Extract<{ readonly _tag: "socket"; readonly socketPath: string }, { readonly _tag: Tag }>
    | Extract<
        {
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
        },
        { readonly _tag: Tag }
      >
    | Extract<
        { readonly _tag: "http"; readonly host: string; readonly port: number; readonly path?: string | undefined },
        { readonly _tag: Tag }
      >
    | Extract<
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
    ) => Unify<ReturnType<Cases["socket" | "ssh" | "http" | "https"]>>
    <Cases>(
      value:
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
          },
      cases: Cases
    ): Unify<ReturnType<Cases["socket" | "ssh" | "http" | "https"]>>
  }
}
```

Added in v1.0.0

## MobyConnectionOptions (type alias)

**Signature**

```ts
export type MobyConnectionOptions = CommonInternal.MobyConnectionOptions
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

**Signature**

```ts
export declare const SshConnectionOptions: Case.Constructor<
  {
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
  },
  "_tag"
>
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
