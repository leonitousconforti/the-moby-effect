---
title: MobyConnection.ts
nav_order: 6
parent: Modules
---

## MobyConnection.ts overview

Http, https, ssh, and unix socket connection agents for all platforms.

Since v1.0.0

---

## Exports Grouped by Category

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

# Connection Constructors

## HttpConnectionOptions

**Example**

```ts
import { HttpConnectionOptions } from "the-moby-effect/MobyConnection"
const connectionOptions = HttpConnectionOptions({
  host: "host.domain.com",
  port: 2375,
  path: "/proxy-path"
})
```

**Signature**

```ts
declare const HttpConnectionOptions: Data.Case.Constructor<
  {
    readonly _tag: "http"
    readonly host: string
    readonly port: number
    readonly path?: string | undefined | undefined
    readonly version?: string | undefined | undefined
  },
  "_tag"
>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyConnection.ts#L155)

Since v1.0.0

## HttpsConnectionOptions

**Example**

```ts
import { HttpsConnectionOptions } from "the-moby-effect/MobyConnection"
const connectionOptions = HttpsConnectionOptions({
  host: "host.domain.com",
  port: 2375,
  path: "/proxy-path"
  // passphrase: "password",
  // ca: fs.readFileSync("ca.pem"),
  // key: fs.readFileSync("key.pem"),
  // cert: fs.readFileSync("cert.pem"),
})
```

**Signature**

```ts
declare const HttpsConnectionOptions: Data.Case.Constructor<
  {
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
  "_tag"
>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyConnection.ts#L172)

Since v1.0.0

## SocketConnectionOptions

**Example**

```ts
import { SocketConnectionOptions } from "the-moby-effect/MobyConnection"
const connectionOptions = SocketConnectionOptions({
  socketPath: "/var/run/docker.sock"
})
```

**Signature**

```ts
declare const SocketConnectionOptions: Data.Case.Constructor<
  { readonly _tag: "socket"; readonly socketPath: string; readonly version?: string | undefined | undefined },
  "_tag"
>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyConnection.ts#L121)

Since v1.0.0

## SshConnectionOptions

Connects to a remote machine over ssh. This specific ssh implementation uses
the OpenSSH extension "ForwardOutLocalStream" (so you must being running an
OpenSSH server or something that implements the "ForwardOutLocalStream"
extension) that opens a connection to a UNIX domain socket at socketPath on
the server.

**Example**

```ts
import { SshConnectionOptions } from "the-moby-effect/MobyConnection"
const connectionOptions = SshConnectionOptions({
  host: "host.domain.com",
  port: 2222,
  username: "user",
  password: "password",
  remoteSocketPath: "/var/run/docker.sock"
})
```

**Signature**

```ts
declare const SshConnectionOptions: Data.Case.Constructor<
  {
    readonly _tag: "ssh"
    readonly remoteSocketPath: string
    readonly host: string
    readonly version?: string | undefined | undefined
    readonly port?: number | undefined
    readonly forceIPv4?: boolean | undefined
    readonly forceIPv6?: boolean | undefined
    readonly hostHash?: string | undefined
    readonly hostVerifier?:
      | (ssh2.HostVerifier | ssh2.SyncHostVerifier | ssh2.HostFingerprintVerifier | ssh2.SyncHostFingerprintVerifier)
      | undefined
    readonly username?: string | undefined
    readonly password?: string | undefined
    readonly agent?: (ssh2.BaseAgent | string) | undefined
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
    readonly algorithms?: ssh2.Algorithms | undefined
    readonly debug?: ssh2.DebugFunction | undefined
    readonly authHandler?: (ssh2.AuthenticationType[] | ssh2.AuthHandlerMiddleware | ssh2.AuthMethod[]) | undefined
    readonly localAddress?: string | undefined
    readonly localPort?: number | undefined
    readonly timeout?: number | undefined
    readonly ident?: (Buffer | string) | undefined
  },
  "_tag"
>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyConnection.ts#L142)

Since v1.0.0

# Connection Types

## HttpConnectionOptions (type alias)

**Signature**

```ts
type HttpConnectionOptions = Data.TaggedEnum.Args<MobyConnectionOptions, "http">
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyConnection.ts#L67)

Since v1.0.0

## HttpConnectionOptionsTagged (type alias)

**Signature**

```ts
type HttpConnectionOptionsTagged = Data.TaggedEnum.Value<MobyConnectionOptions, "http">
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyConnection.ts#L73)

Since v1.0.0

## HttpsConnectionOptions (type alias)

**Signature**

```ts
type HttpsConnectionOptions = Data.TaggedEnum.Args<MobyConnectionOptions, "https">
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyConnection.ts#L79)

Since v1.0.0

## HttpsConnectionOptionsTagged (type alias)

**Signature**

```ts
type HttpsConnectionOptionsTagged = Data.TaggedEnum.Value<MobyConnectionOptions, "https">
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyConnection.ts#L85)

Since v1.0.0

## MobyConnectionOptions

Connection options for how to connect to your moby/docker instance. Can be a
unix socket on the current machine. Can be an ssh connection to a remote
machine with a remote user, remote machine, remote port, and remote socket
path. Can be an http connection to a remote machine with a host, port, and
path. Or it can be an https connection to a remote machine with a host, port,
path, cert, ca, key, and passphrase.

**Signature**

```ts
declare const MobyConnectionOptions: {
  readonly socket: Data.Case.Constructor<
    { readonly _tag: "socket"; readonly socketPath: string; readonly version?: string | undefined | undefined },
    "_tag"
  >
  readonly ssh: Data.Case.Constructor<
    {
      readonly _tag: "ssh"
      readonly remoteSocketPath: string
      readonly host: string
      readonly version?: string | undefined | undefined
      readonly port?: number | undefined
      readonly forceIPv4?: boolean | undefined
      readonly forceIPv6?: boolean | undefined
      readonly hostHash?: string | undefined
      readonly hostVerifier?:
        | (ssh2.HostVerifier | ssh2.SyncHostVerifier | ssh2.HostFingerprintVerifier | ssh2.SyncHostFingerprintVerifier)
        | undefined
      readonly username?: string | undefined
      readonly password?: string | undefined
      readonly agent?: (ssh2.BaseAgent | string) | undefined
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
      readonly algorithms?: ssh2.Algorithms | undefined
      readonly debug?: ssh2.DebugFunction | undefined
      readonly authHandler?: (ssh2.AuthenticationType[] | ssh2.AuthHandlerMiddleware | ssh2.AuthMethod[]) | undefined
      readonly localAddress?: string | undefined
      readonly localPort?: number | undefined
      readonly timeout?: number | undefined
      readonly ident?: (Buffer | string) | undefined
    },
    "_tag"
  >
  readonly http: Data.Case.Constructor<
    {
      readonly _tag: "http"
      readonly host: string
      readonly port: number
      readonly path?: string | undefined | undefined
      readonly version?: string | undefined | undefined
    },
    "_tag"
  >
  readonly https: Data.Case.Constructor<
    {
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
    "_tag"
  >
  readonly $is: <Tag extends "socket" | "ssh" | "http" | "https">(
    tag: Tag
  ) => (
    u: unknown
  ) => u is
    | Extract<
        { readonly _tag: "socket"; readonly socketPath: string; readonly version?: string | undefined | undefined },
        { readonly _tag: Tag }
      >
    | Extract<
        {
          readonly _tag: "ssh"
          readonly remoteSocketPath: string
          readonly host: string
          readonly version?: string | undefined | undefined
          readonly port?: number | undefined
          readonly forceIPv4?: boolean | undefined
          readonly forceIPv6?: boolean | undefined
          readonly hostHash?: string | undefined
          readonly hostVerifier?:
            | (
                | ssh2.HostVerifier
                | ssh2.SyncHostVerifier
                | ssh2.HostFingerprintVerifier
                | ssh2.SyncHostFingerprintVerifier
              )
            | undefined
          readonly username?: string | undefined
          readonly password?: string | undefined
          readonly agent?: (ssh2.BaseAgent | string) | undefined
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
          readonly algorithms?: ssh2.Algorithms | undefined
          readonly debug?: ssh2.DebugFunction | undefined
          readonly authHandler?:
            | (ssh2.AuthenticationType[] | ssh2.AuthHandlerMiddleware | ssh2.AuthMethod[])
            | undefined
          readonly localAddress?: string | undefined
          readonly localPort?: number | undefined
          readonly timeout?: number | undefined
          readonly ident?: (Buffer | string) | undefined
        },
        { readonly _tag: Tag }
      >
    | Extract<
        {
          readonly _tag: "http"
          readonly host: string
          readonly port: number
          readonly path?: string | undefined | undefined
          readonly version?: string | undefined | undefined
        },
        { readonly _tag: Tag }
      >
    | Extract<
        {
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
        { readonly _tag: Tag }
      >
  readonly $match: {
    <
      Cases extends {
        readonly socket: (args: {
          readonly _tag: "socket"
          readonly socketPath: string
          readonly version?: string | undefined | undefined
        }) => any
        readonly ssh: (args: {
          readonly _tag: "ssh"
          readonly remoteSocketPath: string
          readonly host: string
          readonly version?: string | undefined | undefined
          readonly port?: number | undefined
          readonly forceIPv4?: boolean | undefined
          readonly forceIPv6?: boolean | undefined
          readonly hostHash?: string | undefined
          readonly hostVerifier?:
            | (
                | ssh2.HostVerifier
                | ssh2.SyncHostVerifier
                | ssh2.HostFingerprintVerifier
                | ssh2.SyncHostFingerprintVerifier
              )
            | undefined
          readonly username?: string | undefined
          readonly password?: string | undefined
          readonly agent?: (ssh2.BaseAgent | string) | undefined
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
          readonly algorithms?: ssh2.Algorithms | undefined
          readonly debug?: ssh2.DebugFunction | undefined
          readonly authHandler?:
            | (ssh2.AuthenticationType[] | ssh2.AuthHandlerMiddleware | ssh2.AuthMethod[])
            | undefined
          readonly localAddress?: string | undefined
          readonly localPort?: number | undefined
          readonly timeout?: number | undefined
          readonly ident?: (Buffer | string) | undefined
        }) => any
        readonly http: (args: {
          readonly _tag: "http"
          readonly host: string
          readonly port: number
          readonly path?: string | undefined | undefined
          readonly version?: string | undefined | undefined
        }) => any
        readonly https: (args: {
          readonly _tag: "https"
          readonly host: string
          readonly port: number
          readonly version?: string | undefined | undefined
          readonly path?: string | undefined | undefined
          readonly cert?: string | undefined | undefined
          readonly ca?: string | undefined | undefined
          readonly key?: string | undefined | undefined
          readonly passphrase?: string | undefined | undefined
        }) => any
      }
    >(
      cases: Cases
    ): (
      value:
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
              | (
                  | ssh2.HostVerifier
                  | ssh2.SyncHostVerifier
                  | ssh2.HostFingerprintVerifier
                  | ssh2.SyncHostFingerprintVerifier
                )
              | undefined
            readonly username?: string | undefined
            readonly password?: string | undefined
            readonly agent?: (ssh2.BaseAgent | string) | undefined
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
            readonly algorithms?: ssh2.Algorithms | undefined
            readonly debug?: ssh2.DebugFunction | undefined
            readonly authHandler?:
              | (ssh2.AuthenticationType[] | ssh2.AuthHandlerMiddleware | ssh2.AuthMethod[])
              | undefined
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
          }
    ) => Unify<ReturnType<Cases["socket" | "ssh" | "http" | "https"]>>
    <
      Cases extends {
        readonly socket: (args: {
          readonly _tag: "socket"
          readonly socketPath: string
          readonly version?: string | undefined | undefined
        }) => any
        readonly ssh: (args: {
          readonly _tag: "ssh"
          readonly remoteSocketPath: string
          readonly host: string
          readonly version?: string | undefined | undefined
          readonly port?: number | undefined
          readonly forceIPv4?: boolean | undefined
          readonly forceIPv6?: boolean | undefined
          readonly hostHash?: string | undefined
          readonly hostVerifier?:
            | (
                | ssh2.HostVerifier
                | ssh2.SyncHostVerifier
                | ssh2.HostFingerprintVerifier
                | ssh2.SyncHostFingerprintVerifier
              )
            | undefined
          readonly username?: string | undefined
          readonly password?: string | undefined
          readonly agent?: (ssh2.BaseAgent | string) | undefined
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
          readonly algorithms?: ssh2.Algorithms | undefined
          readonly debug?: ssh2.DebugFunction | undefined
          readonly authHandler?:
            | (ssh2.AuthenticationType[] | ssh2.AuthHandlerMiddleware | ssh2.AuthMethod[])
            | undefined
          readonly localAddress?: string | undefined
          readonly localPort?: number | undefined
          readonly timeout?: number | undefined
          readonly ident?: (Buffer | string) | undefined
        }) => any
        readonly http: (args: {
          readonly _tag: "http"
          readonly host: string
          readonly port: number
          readonly path?: string | undefined | undefined
          readonly version?: string | undefined | undefined
        }) => any
        readonly https: (args: {
          readonly _tag: "https"
          readonly host: string
          readonly port: number
          readonly version?: string | undefined | undefined
          readonly path?: string | undefined | undefined
          readonly cert?: string | undefined | undefined
          readonly ca?: string | undefined | undefined
          readonly key?: string | undefined | undefined
          readonly passphrase?: string | undefined | undefined
        }) => any
      }
    >(
      value:
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
              | (
                  | ssh2.HostVerifier
                  | ssh2.SyncHostVerifier
                  | ssh2.HostFingerprintVerifier
                  | ssh2.SyncHostFingerprintVerifier
                )
              | undefined
            readonly username?: string | undefined
            readonly password?: string | undefined
            readonly agent?: (ssh2.BaseAgent | string) | undefined
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
            readonly algorithms?: ssh2.Algorithms | undefined
            readonly debug?: ssh2.DebugFunction | undefined
            readonly authHandler?:
              | (ssh2.AuthenticationType[] | ssh2.AuthHandlerMiddleware | ssh2.AuthMethod[])
              | undefined
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
      cases: Cases
    ): Unify<ReturnType<Cases["socket" | "ssh" | "http" | "https"]>>
  }
}
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyConnection.ts#L110)

Since v1.0.0

## MobyConnectionOptions (type alias)

Connection options for how to connect to your moby/docker instance. Can be a
unix socket on the current machine. Can be an ssh connection to a remote
machine with a remote user, remote machine, remote port, and remote socket
path. Can be an http connection to a remote machine with a host, port, and
path. Or it can be an https connection to a remote machine with a host, port,
path, cert, ca, key, and passphrase.

**Signature**

```ts
type MobyConnectionOptions = Data.TaggedEnum<{
  socket: { readonly socketPath: string; readonly version?: string | undefined }
  ssh: {
    readonly remoteSocketPath: string
    readonly host: string
    readonly version?: string | undefined
  } & Exclude<ssh2.ConnectConfig, "host">
  http: {
    readonly host: string
    readonly port: number
    readonly path?: string | undefined
    readonly version?: string | undefined
  }
  https: {
    readonly host: string
    readonly port: number
    readonly version?: string | undefined
    readonly path?: string | undefined
    readonly cert?: string | undefined
    readonly ca?: string | undefined
    readonly key?: string | undefined
    readonly passphrase?: string | undefined
  }
}>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyConnection.ts#L26)

Since v1.0.0

## SocketConnectionOptions (type alias)

**Signature**

```ts
type SocketConnectionOptions = Data.TaggedEnum.Args<MobyConnectionOptions, "socket">
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyConnection.ts#L55)

Since v1.0.0

## SocketConnectionOptionsTagged (type alias)

**Signature**

```ts
type SocketConnectionOptionsTagged = Data.TaggedEnum.Value<MobyConnectionOptions, "socket">
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyConnection.ts#L61)

Since v1.0.0

## SshConnectionOptions (type alias)

**Signature**

```ts
type SshConnectionOptions = Data.TaggedEnum.Args<MobyConnectionOptions, "ssh">
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyConnection.ts#L91)

Since v1.0.0

## SshConnectionOptionsTagged (type alias)

**Signature**

```ts
type SshConnectionOptionsTagged = Data.TaggedEnum.Value<MobyConnectionOptions, "ssh">
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyConnection.ts#L97)

Since v1.0.0

# Constructors

## connectionOptionsFromDockerHostEnvironmentVariable

Creates a MobyApi layer from the DOCKER_HOST environment variable as a url.

**Signature**

```ts
declare const connectionOptionsFromDockerHostEnvironmentVariable: Effect.Effect<
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
        | (ssh2.HostVerifier | ssh2.SyncHostVerifier | ssh2.HostFingerprintVerifier | ssh2.SyncHostFingerprintVerifier)
        | undefined
      readonly username?: string | undefined
      readonly password?: string | undefined
      readonly agent?: (ssh2.BaseAgent | string) | undefined
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
      readonly algorithms?: ssh2.Algorithms | undefined
      readonly debug?: ssh2.DebugFunction | undefined
      readonly authHandler?: (ssh2.AuthenticationType[] | ssh2.AuthHandlerMiddleware | ssh2.AuthMethod[]) | undefined
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
  ConfigError.ConfigError,
  never
>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyConnection.ts#L212)

Since v1.0.0

## connectionOptionsFromPlatformSystemSocketDefault

Creates a MobyApi layer from the platform default system socket location.

**Signature**

```ts
declare const connectionOptionsFromPlatformSystemSocketDefault: Effect.Effect<
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
        | (ssh2.HostVerifier | ssh2.SyncHostVerifier | ssh2.HostFingerprintVerifier | ssh2.SyncHostFingerprintVerifier)
        | undefined
      readonly username?: string | undefined
      readonly password?: string | undefined
      readonly agent?: (ssh2.BaseAgent | string) | undefined
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
      readonly algorithms?: ssh2.Algorithms | undefined
      readonly debug?: ssh2.DebugFunction | undefined
      readonly authHandler?: (ssh2.AuthenticationType[] | ssh2.AuthHandlerMiddleware | ssh2.AuthMethod[]) | undefined
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
  ConfigError.ConfigError,
  never
>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyConnection.ts#L224)

Since v1.0.0

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
declare const connectionOptionsFromUrl: (
  dockerHost: string
) => Effect.Effect<MobyConnectionOptions, ConfigError.ConfigError, never>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyConnection.ts#L202)

Since v1.0.0

## connectionOptionsFromUserSocketDefault

Creates a MobyApi layer from the platform default system socket location.

**Signature**

```ts
declare const connectionOptionsFromUserSocketDefault: Effect.Effect<
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
        | (ssh2.HostVerifier | ssh2.SyncHostVerifier | ssh2.HostFingerprintVerifier | ssh2.SyncHostFingerprintVerifier)
        | undefined
      readonly username?: string | undefined
      readonly password?: string | undefined
      readonly agent?: (ssh2.BaseAgent | string) | undefined
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
      readonly algorithms?: ssh2.Algorithms | undefined
      readonly debug?: ssh2.DebugFunction | undefined
      readonly authHandler?: (ssh2.AuthenticationType[] | ssh2.AuthHandlerMiddleware | ssh2.AuthMethod[]) | undefined
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
  Path.Path
>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyConnection.ts#L236)

Since v1.0.0
