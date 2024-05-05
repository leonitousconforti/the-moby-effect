---
title: Agent.ts
nav_order: 1
parent: Modules
---

## Agent overview

Connection agents

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Connection](#connection)
  - [IMobyConnectionAgentImpl (interface)](#imobyconnectionagentimpl-interface)
  - [MobyConnectionOptions (type alias)](#mobyconnectionoptions-type-alias)
  - [SSHAgent (class)](#sshagent-class)
    - [createConnection (method)](#createconnection-method)
  - [getAgent](#getagent)
- [Layers](#layers)
  - [MobyHttpClientLive](#mobyhttpclientlive)
- [Tags](#tags)
  - [IMobyConnectionAgent (interface)](#imobyconnectionagent-interface)
  - [MobyConnectionAgent](#mobyconnectionagent)

---

# Connection

## IMobyConnectionAgentImpl (interface)

Our moby connection needs to be an extension of the effect platform-node
httpAgent so that it will still be compatible with all the other
platform-node http methods, but it would be nice if it had a few other things
as well. The nodeRequestUrl is the url that the node http client will use to
make requests. And while we don't need to keep track of the connection
options for anything yet, it doesn't hurt to add them.

**Signature**

```ts
export interface IMobyConnectionAgentImpl extends NodeHttp.HttpAgent {
  ssh: http.Agent
  unix: http.Agent
  nodeRequestUrl: string
  connectionOptions: MobyConnectionOptions
}
```

Added in v1.0.0

## MobyConnectionOptions (type alias)

How to connect to your moby/docker instance.

**Signature**

```ts
export type MobyConnectionOptions =
  | { connection: "socket"; socketPath: string }
  | ({ connection: "ssh"; remoteSocketPath: string } & ssh2.ConnectConfig)
  | { connection: "http"; host: string; port: number; path?: string | undefined }
  | {
      connection: "https"
      host: string
      port: number
      path?: string | undefined
      cert?: string | undefined
      ca?: string | undefined
      key?: string | undefined
      passphrase?: string | undefined
    }
```

Added in v1.0.0

## SSHAgent (class)

An http agent that connect to remote moby instances over ssh.

**Signature**

```ts
export declare class SSHAgent {
  public constructor(
    ssh2ConnectConfig: ssh2.ConnectConfig & { remoteSocketPath: string },
    agentOptions?: http.AgentOptions | undefined
  )
}
```

**Example**

```ts
import http from "node:http"

http
  .get(
    {
      path: "/_ping",
      agent: new SSHAgent(ssh2Options)
    },
    (response) => {
      console.log(response.statusCode)
      console.dir(response.headers)
      response.resume()
    }
  )
  .end()
```

Added in v1.0.0

### createConnection (method)

When creating a new connection, first start by trying to connect to the
remote server over ssh. Then, if that was successful, we send a
forwardOurStreamLocal request which is an OpenSSH extension that opens a
connection to the unix domain socket at socketPath on the remote server
and forwards traffic.

**Signature**

```ts
protected createConnection(
        _options: http.ClientRequestArgs,
        callback: (error: Error | undefined, socket?: net.Socket | undefined) => void
    ): void
```

Added in v1.0.0

## getAgent

Given the moby connection options, it will construct a scoped effect that
provides an http connection agent that you should use to connect to your moby
instance.

**Signature**

```ts
export declare const getAgent: (
  connectionOptions: MobyConnectionOptions
) => Effect.Effect<IMobyConnectionAgentImpl, never, Scope.Scope>
```

Added in v1.0.0

# Layers

## MobyHttpClientLive

A layer that provides the http client with a connection agent that can be
used to connect to a remote moby instance. This layer is used to eliminate
the HttpClient dependency from the other module make functions, which is an
undesirable dependency to have because then it relies on the consumer to
apply the http agent to the HttpClient layer.

**Signature**

```ts
export declare const MobyHttpClientLive: Layer.Layer<HttpClient.client.Client.Default, never, IMobyConnectionAgent>
```

Added in v1.0.0

# Tags

## IMobyConnectionAgent (interface)

**Signature**

```ts
export interface IMobyConnectionAgent {
  readonly _: unique symbol
}
```

Added in v1.0.0

## MobyConnectionAgent

Context identifier for our moby connection agent.

**Signature**

```ts
export declare const MobyConnectionAgent: Context.Tag<IMobyConnectionAgent, IMobyConnectionAgentImpl>
```

Added in v1.0.0
