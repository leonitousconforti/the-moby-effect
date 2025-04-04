import type * as NodeHttpClient from "@effect/platform-node/NodeHttpClient";
import type * as HttpClient from "@effect/platform/HttpClient";
import type * as HttpClientResponse from "@effect/platform/HttpClientResponse";
import type * as Socket from "@effect/platform/Socket";
import type * as Scope from "effect/Scope";
import type * as http from "node:http";
import type * as https from "node:https";
import type * as net from "node:net";
import type * as stream from "node:stream";
import type * as ssh2 from "ssh2";
import type * as MobyConnection from "../../MobyConnection.js";

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
        public readonly sshClient: ssh2.Client;

        // How to connect to the remote server and where the moby socket is located.
        public readonly connectConfig: MobyConnection.SshConnectionOptions;

        public constructor(
            ssh2ConnectConfig: MobyConnection.SshConnectionOptions,
            agentOptions?: http.AgentOptions | undefined
        ) {
            super(agentOptions);
            this.sshClient = new ssh2Lazy.Client();
            this.connectConfig = ssh2ConnectConfig;
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
        public createConnection(
            _options: http.ClientRequestArgs,
            callback: (error: Error | undefined, socket?: stream.Duplex | undefined) => void
        ): void {
            this.sshClient
                .on("ready", () => {
                    this.sshClient.openssh_forwardOutStreamLocal(
                        this.connectConfig.remoteSocketPath,
                        (error: Error | undefined, stream: ssh2.ClientChannel) => {
                            if (error) {
                                this.sshClient.end();
                                return callback(error);
                            }

                            stream.once("close", () => {
                                stream.end();
                                stream.destroy();
                                this.sshClient.end();
                            });

                            callback(undefined, stream);
                        }
                    );
                })
                .on("error", (error) => callback(error, undefined))
                .connect(this.connectConfig);
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
export const makeNodeHttpClientLayer = (
    connectionOptions: MobyConnection.MobyConnectionOptions
): Layer.Layer<HttpClient.HttpClient | Socket.WebSocketConstructor, never, never> => {
    const nodeHttpClientLayer = Function.pipe(
        Effect.promise(() => import("@effect/platform-node/NodeHttpClient")),
        Effect.map((nodeHttpClientLazy) =>
            Layer.provide(
                nodeHttpClientLazy.layerWithoutAgent,
                Layer.scoped(nodeHttpClientLazy.HttpAgent, getNodeAgent(connectionOptions))
            )
        ),
        Layer.unwrapEffect
    );
    const agnosticHttpClientLayer = internalAgnostic.makeAgnosticLayer(connectionOptions);
    return Layer.provide(agnosticHttpClientLayer, nodeHttpClientLayer);
};
