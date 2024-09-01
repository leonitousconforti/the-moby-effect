---
title: platforms/Common.ts
nav_order: 33
parent: Modules
---

## Common overview

Common connection options for all agents

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

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
- [Helpers](#helpers)
  - [getAgnosticRequestUrl](#getagnosticrequesturl)
  - [getNodeRequestUrl](#getnoderequesturl)
  - [getWebRequestUrl](#getwebrequesturl)

---

# Connection Constructors

## HttpConnectionOptions

**Signature**

```ts
export declare const HttpConnectionOptions: Data.Case.Constructor<
  { readonly _tag: "http"; readonly host: string; readonly port: number; readonly path?: string | undefined },
  "_tag"
>
```

Added in v1.0.0

## HttpsConnectionOptions

**Signature**

```ts
export declare const HttpsConnectionOptions: Data.Case.Constructor<
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
export declare const SocketConnectionOptions: Data.Case.Constructor<
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
export declare const SshConnectionOptions: Data.Case.Constructor<
  {
    readonly _tag: "ssh"
    readonly remoteSocketPath: string
    readonly host?: string | undefined
    readonly port?: number | undefined
    readonly forceIPv4?: boolean | undefined
    readonly forceIPv6?: boolean | undefined
    readonly hostHash?: string | undefined
    readonly hostVerifier?:
      | ssh2.HostVerifier
      | ssh2.SyncHostVerifier
      | ssh2.HostFingerprintVerifier
      | ssh2.SyncHostFingerprintVerifier
      | undefined
    readonly username?: string | undefined
    readonly password?: string | undefined
    readonly agent?: string | ssh2.BaseAgent<string | Buffer | ssh2.ParsedKey> | undefined
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
    readonly algorithms?: ssh2.Algorithms | undefined
    readonly debug?: ssh2.DebugFunction | undefined
    readonly authHandler?: ssh2.AuthenticationType[] | ssh2.AuthHandlerMiddleware | ssh2.AuthMethod[] | undefined
    readonly localAddress?: string | undefined
    readonly localPort?: number | undefined
    readonly timeout?: number | undefined
    readonly ident?: string | Buffer | undefined
  },
  "_tag"
>
```

Added in v1.0.0

# Connection Types

## HttpConnectionOptions (type alias)

**Signature**

```ts
export type HttpConnectionOptions = Data.TaggedEnum.Args<MobyConnectionOptions, "http">
```

Added in v1.0.0

## HttpConnectionOptionsTagged (type alias)

**Signature**

```ts
export type HttpConnectionOptionsTagged = Data.TaggedEnum.Value<MobyConnectionOptions, "http">
```

Added in v1.0.0

## HttpsConnectionOptions (type alias)

**Signature**

```ts
export type HttpsConnectionOptions = Data.TaggedEnum.Args<MobyConnectionOptions, "https">
```

Added in v1.0.0

## HttpsConnectionOptionsTagged (type alias)

**Signature**

```ts
export type HttpsConnectionOptionsTagged = Data.TaggedEnum.Value<MobyConnectionOptions, "https">
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
  readonly socket: Data.Case.Constructor<{ readonly _tag: "socket"; readonly socketPath: string }, "_tag">
  readonly ssh: Data.Case.Constructor<
    {
      readonly _tag: "ssh"
      readonly remoteSocketPath: string
      readonly host?: string | undefined
      readonly port?: number | undefined
      readonly forceIPv4?: boolean | undefined
      readonly forceIPv6?: boolean | undefined
      readonly hostHash?: string | undefined
      readonly hostVerifier?:
        | ssh2.HostVerifier
        | ssh2.SyncHostVerifier
        | ssh2.HostFingerprintVerifier
        | ssh2.SyncHostFingerprintVerifier
        | undefined
      readonly username?: string | undefined
      readonly password?: string | undefined
      readonly agent?: string | ssh2.BaseAgent<string | Buffer | ssh2.ParsedKey> | undefined
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
      readonly algorithms?: ssh2.Algorithms | undefined
      readonly debug?: ssh2.DebugFunction | undefined
      readonly authHandler?: ssh2.AuthenticationType[] | ssh2.AuthHandlerMiddleware | ssh2.AuthMethod[] | undefined
      readonly localAddress?: string | undefined
      readonly localPort?: number | undefined
      readonly timeout?: number | undefined
      readonly ident?: string | Buffer | undefined
    },
    "_tag"
  >
  readonly http: Data.Case.Constructor<
    { readonly _tag: "http"; readonly host: string; readonly port: number; readonly path?: string | undefined },
    "_tag"
  >
  readonly https: Data.Case.Constructor<
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
            | ssh2.HostVerifier
            | ssh2.SyncHostVerifier
            | ssh2.HostFingerprintVerifier
            | ssh2.SyncHostFingerprintVerifier
            | undefined
          readonly username?: string | undefined
          readonly password?: string | undefined
          readonly agent?: string | ssh2.BaseAgent<string | Buffer | ssh2.ParsedKey> | undefined
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
          readonly algorithms?: ssh2.Algorithms | undefined
          readonly debug?: ssh2.DebugFunction | undefined
          readonly authHandler?: ssh2.AuthenticationType[] | ssh2.AuthHandlerMiddleware | ssh2.AuthMethod[] | undefined
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
              | ssh2.HostVerifier
              | ssh2.SyncHostVerifier
              | ssh2.HostFingerprintVerifier
              | ssh2.SyncHostFingerprintVerifier
              | undefined
            readonly username?: string | undefined
            readonly password?: string | undefined
            readonly agent?: string | ssh2.BaseAgent<string | Buffer | ssh2.ParsedKey> | undefined
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
            readonly algorithms?: ssh2.Algorithms | undefined
            readonly debug?: ssh2.DebugFunction | undefined
            readonly authHandler?:
              | ssh2.AuthenticationType[]
              | ssh2.AuthHandlerMiddleware
              | ssh2.AuthMethod[]
              | undefined
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
              | ssh2.HostVerifier
              | ssh2.SyncHostVerifier
              | ssh2.HostFingerprintVerifier
              | ssh2.SyncHostFingerprintVerifier
              | undefined
            readonly username?: string | undefined
            readonly password?: string | undefined
            readonly agent?: string | ssh2.BaseAgent<string | Buffer | ssh2.ParsedKey> | undefined
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
            readonly algorithms?: ssh2.Algorithms | undefined
            readonly debug?: ssh2.DebugFunction | undefined
            readonly authHandler?:
              | ssh2.AuthenticationType[]
              | ssh2.AuthHandlerMiddleware
              | ssh2.AuthMethod[]
              | undefined
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
export type MobyConnectionOptions = Data.TaggedEnum<{
  socket: { readonly socketPath: string }
  ssh: { readonly remoteSocketPath: string } & ssh2.ConnectConfig
  http: { readonly host: string; readonly port: number; readonly path?: string | undefined }
  https: {
    readonly host: string
    readonly port: number
    readonly path?: string | undefined
    readonly cert?: string | undefined
    readonly ca?: string | undefined
    readonly key?: string | undefined
    readonly passphrase?: string | undefined
  }
}>
```

Added in v1.0.0

## SocketConnectionOptions (type alias)

**Signature**

```ts
export type SocketConnectionOptions = Data.TaggedEnum.Args<MobyConnectionOptions, "socket">
```

Added in v1.0.0

## SocketConnectionOptionsTagged (type alias)

**Signature**

```ts
export type SocketConnectionOptionsTagged = Data.TaggedEnum.Value<MobyConnectionOptions, "socket">
```

Added in v1.0.0

## SshConnectionOptions (type alias)

**Signature**

```ts
export type SshConnectionOptions = Data.TaggedEnum.Args<MobyConnectionOptions, "ssh">
```

Added in v1.0.0

## SshConnectionOptionsTagged (type alias)

**Signature**

```ts
export type SshConnectionOptionsTagged = Data.TaggedEnum.Value<MobyConnectionOptions, "ssh">
```

Added in v1.0.0

# Helpers

## getAgnosticRequestUrl

**Signature**

```ts
export declare const getAgnosticRequestUrl: (
  connectionOptions: HttpConnectionOptionsTagged | HttpsConnectionOptionsTagged
) => string
```

Added in v1.0.0

## getNodeRequestUrl

**Signature**

```ts
export declare const getNodeRequestUrl: (connectionOptions: MobyConnectionOptions) => string
```

Added in v1.0.0

## getWebRequestUrl

**Signature**

```ts
export declare const getWebRequestUrl: (
  connectionOptions: HttpConnectionOptionsTagged | HttpsConnectionOptionsTagged
) => string
```

Added in v1.0.0
