import type * as NodeHttpClient from "@effect/platform-node/NodeHttpClient";
import type * as HttpClient from "@effect/platform/HttpClient";
import type * as HttpClientResponse from "@effect/platform/HttpClientResponse";
import type * as Scope from "effect/Scope";
import type * as http from "node:http";
import type * as https from "node:https";
import type * as net from "node:net";
import type * as stream from "node:stream";
import type * as ssh2 from "ssh2";
import type * as MobyConnection from "../../MobyConnection.js";

import * as Socket from "@effect/platform/Socket";
import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as Layer from "effect/Layer";
import * as internalAgnostic from "./agnostic.js";
import * as internalConnection from "./connection.js";

/**
 * Helper interface to expose the underlying socket from the effect HttpClient
 * response. Useful for hijacking the response stream. This is a hack, and it
 * will only work when using the NodeJS http layer.
 *
 * @since 1.0.0
 * @category NodeJS
 * @internal
 */
export interface IExposeSocketOnEffectClientResponseHack extends HttpClientResponse.HttpClientResponse {
    original: {
        source: {
            socket: net.Socket;
        };
    };
}

/** @internal */
export const makeNodeSshAgent = (
    httpLazy: typeof http,
    ssh2Lazy: typeof ssh2,
    connectionOptions: MobyConnection.SshConnectionOptions
): http.Agent =>
    new (class extends httpLazy.Agent {
        // The ssh client that will be connecting to the server
        private readonly sshClient: ssh2.Client;

        // How to connect to the remote server and where the moby socket is located.
        private readonly sshConfig: MobyConnection.SshConnectionOptions;

        // Internal state to know if we are connected or not
        private sshConnection: "unopened" | "connecting" | "open-failed" | "ready" = "unopened";
        private openFailedError: Error | null = null;

        public constructor(
            ssh2ConnectConfig: MobyConnection.SshConnectionOptions,
            agentOptions?: http.AgentOptions | undefined
        ) {
            super(agentOptions);
            this.sshConfig = ssh2ConnectConfig;
            this.sshClient = new ssh2Lazy.Client();
        }

        /**
         * When the agent is destroyed, we also want to close the ssh connection
         * if it is still open.
         *
         * @since 1.0.0
         * @see https://nodejs.org/api/http.html#agentdestroy
         */
        public override destroy(): void {
            this.sshClient.end();
            this.sshClient.destroy();
            super.destroy();
        }

        /**
         * When creating a new connection, first start by trying to connect to
         * the remote server over ssh. Then, if that was successful, we send a
         * forwardOurStreamLocal request which is an OpenSSH extension that
         * opens a connection to the unix domain socket at socketPath on the
         * remote server and forwards traffic.
         *
         * @since 1.0.0
         * @see https://nodejs.org/api/http.html#agentcreateconnectionoptions-callback
         */
        public override createConnection(
            _options: http.ClientRequestArgs,
            callback: (error: Error | null, socket: stream.Duplex | undefined) => void
        ) {
            const onError = (error: Error & ssh2.ClientErrorExtensions): void => {
                /**
                 * Indicates 'client-socket' for socket-level errors and
                 * 'client-ssh' for SSH disconnection messages. If the error is
                 * at the client-ssh level, we want to close the ssh connection
                 * and this agent cannot be used anymore.
                 */
                // if (error.level === "client-ssh") this.destroy();
                callback(error, undefined);
            };

            // No connection yet, start connecting
            if (this.sshConnection === "unopened") {
                this.sshConnection = "connecting";
                const unableToOpen = (error: Error & ssh2.ClientErrorExtensions) => {
                    this.sshConnection = "open-failed";
                    this.openFailedError = error;
                    onError(error);
                };
                this.sshClient
                    .once("ready", () => {
                        this.sshConnection = "ready";
                        this.sshClient.off("error", unableToOpen);
                        this.createConnection(_options, callback);
                    })
                    .once("error", unableToOpen)
                    .connect(this.sshConfig);
            }

            // Already tried to connect but failed
            else if (this.sshConnection === "open-failed") {
                callback(this.openFailedError, undefined);
            }

            // Another connection attempt is already in progress, wait for it
            else if (this.sshConnection === "connecting") {
                this.sshClient
                    .once("ready", () => {
                        this.sshClient.off("error", onError);
                        this.createConnection(_options, callback);
                    })
                    .once("error", onError);
            }

            // We are connected to the ssh server, now forward our stream local
            else if (this.sshConnection === "ready") {
                this.sshClient
                    .openssh_forwardOutStreamLocal(
                        this.sshConfig.remoteSocketPath,
                        (error: Error | undefined, stream: ssh2.ClientChannel) => {
                            this.sshClient.off("error", onError);
                            if (error) return callback(error, void 0 as unknown as stream.Duplex);
                            else return callback(null, stream);
                        }
                    )
                    .once("error", onError);
            }

            // Should never happen
            else {
                return Function.absurd<undefined>(this.sshConnection);
            }
        }
    })(connectionOptions);

/** @internal */
export const getNodeAgent = (
    connectionOptions: MobyConnection.MobyConnectionOptions
): Effect.Effect<NodeHttpClient.HttpAgent, never, Scope.Scope> =>
    Function.pipe(
        Effect.all(
            {
                httpLazy: Effect.promise(() => import("node:http")),
                httpsLazy: Effect.promise(() => import("node:https")),
                nodeHttpClientLazy: Effect.promise(() => import("@effect/platform-node/NodeHttpClient")),
            },
            { concurrency: 3 }
        ),
        Effect.flatMap(({ httpLazy, httpsLazy, nodeHttpClientLazy }) => {
            const AcquireNodeHttpAgent = internalConnection.MobyConnectionOptions.$match({
                http: (options) => Effect.succeed(new httpLazy.Agent({ host: options.host, port: options.port })),
                socket: (options) =>
                    Effect.succeed(new httpLazy.Agent({ socketPath: options.socketPath } as http.AgentOptions)),
                ssh: (options) =>
                    Effect.map(
                        Effect.promise(() => import("ssh2")),
                        (ssh2Lazy) => makeNodeSshAgent(httpLazy, ssh2Lazy, options)
                    ),
                https: (options) =>
                    Effect.succeed(
                        new httpsLazy.Agent({
                            ca: options.ca,
                            key: options.key,
                            cert: options.cert,
                            host: options.host,
                            port: options.port,
                            passphrase: options.passphrase,
                        })
                    ),
            });

            const releaseNodeHttpAgent = (agent: http.Agent) => Effect.sync(() => agent.destroy());
            const resource = Effect.acquireRelease(AcquireNodeHttpAgent(connectionOptions), releaseNodeHttpAgent);

            return Effect.map(resource, (agent) => ({
                http: agent as http.Agent,
                https: agent as https.Agent,
                [nodeHttpClientLazy.HttpAgentTypeId]: nodeHttpClientLazy.HttpAgentTypeId,
            }));
        })
    );

/** @internal */
export const getWebsocketConstructor = (
    connectionOptions: MobyConnection.MobyConnectionOptions
): Layer.Layer<Socket.WebSocketConstructor, never, NodeHttpClient.HttpAgent> =>
    Layer.effect(
        Socket.WebSocketConstructor,
        Effect.gen(function* () {
            const ws = yield* Effect.promise(() => import("ws"));
            const nodeHttpClientLazy = yield* Effect.promise(() => import("@effect/platform-node/NodeHttpClient"));
            const agent = yield* nodeHttpClientLazy.HttpAgent;

            return (url, protocols) =>
                new ws.WebSocket(
                    `ws://0.0.0.0${internalAgnostic.makeVersionPath(connectionOptions)}${url}`,
                    protocols,
                    { agent: agent.http }
                ) as unknown as globalThis.WebSocket;
        })
    );

/** @internal */
export const makeNodeHttpClientLayer = (
    connectionOptions: MobyConnection.MobyConnectionOptions
): Layer.Layer<HttpClient.HttpClient | Socket.WebSocketConstructor, never, never> => {
    const httpAgentLive = Function.pipe(
        Effect.promise(() => import("@effect/platform-node/NodeHttpClient")),
        Effect.map((nodeHttpClientLazy) => Layer.scoped(nodeHttpClientLazy.HttpAgent, getNodeAgent(connectionOptions))),
        Layer.unwrapEffect
    );

    const websocketConstructorLive = getWebsocketConstructor(connectionOptions);

    const nodeHttpClientLive = Function.pipe(
        Effect.promise(() => import("@effect/platform-node/NodeHttpClient")),
        Effect.map((nodeHttpClientLazy) => nodeHttpClientLazy.layerWithoutAgent),
        Layer.unwrapEffect
    );

    const agnosticHttpClientLayer = internalAgnostic.makeAgnosticHttpClientLayer(connectionOptions);

    return agnosticHttpClientLayer
        .pipe(Layer.merge(websocketConstructorLive))
        .pipe(Layer.provide(nodeHttpClientLive))
        .pipe(Layer.provide(httpAgentLive));
};
