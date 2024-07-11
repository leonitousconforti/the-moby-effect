/**
 * Http, https, ssh, and unix socket connection agents for NodeJS.
 *
 * @since 1.0.0
 */

import type * as NodeHttpClient from "@effect/platform-node/NodeHttpClient";
import type * as http from "node:http";
import type * as https from "node:https";
import type * as stream from "node:stream";
import type * as ssh2 from "ssh2";

import * as HttpClient from "@effect/platform/HttpClient";
import * as HttpClientRequest from "@effect/platform/HttpClientRequest";
import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as Layer from "effect/Layer";
import * as Scope from "effect/Scope";

import * as AgentCommon from "./Common.js";

/**
 * An http agent that connects to remote moby instances over ssh.
 *
 * @since 1.0.0
 * @category Connection
 * @example
 *     import http from "node:http";
 *
 *     http.get(
 *         {
 *             path: "/_ping",
 *             agent: new SSHAgent(ssh2Options),
 *         },
 *         (response) => {
 *             console.log(response.statusCode);
 *             console.dir(response.headers);
 *             response.resume();
 *         }
 *     ).end();
 */
export const makeNodeSshAgent = (
    httpLazy: typeof http,
    ssh2Lazy: typeof ssh2,
    connectionOptions: AgentCommon.SshConnectionOptions
): http.Agent =>
    new (class SSHAgent extends httpLazy.Agent {
        // The ssh client that will be connecting to the server
        public readonly sshClient: ssh2.Client;

        // How to connect to the remote server and where the moby socket is located.
        public readonly connectConfig: AgentCommon.SshConnectionOptions;

        public constructor(
            ssh2ConnectConfig: AgentCommon.SshConnectionOptions,
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
            callback: (error: Error | undefined, socket?: stream.Duplex) => void
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
                .on("error", (error) => callback(error))
                .connect(this.connectConfig);
        }
    })(connectionOptions);

/**
 * Given the moby connection options, it will construct a scoped effect that
 * provides a node http connection agent that you could use to connect to your
 * moby instance.
 *
 * @since 1.0.0
 * @category Connection
 */
export const getNodeAgent = (
    connectionOptions: AgentCommon.MobyConnectionOptions
): Effect.Effect<NodeHttpClient.HttpAgent, never, Scope.Scope> =>
    Function.pipe(
        Effect.all(
            {
                ssh2Lazy: Effect.promise(() => import("ssh2")),
                httpLazy: Effect.promise(() => import("node:http")),
                httpsLazy: Effect.promise(() => import("node:https")),
                nodeHttpClientLazy: Effect.promise(() => import("@effect/platform-node/NodeHttpClient")),
            },
            { concurrency: 4 }
        ),
        Effect.flatMap(({ httpLazy, httpsLazy, nodeHttpClientLazy, ssh2Lazy }) => {
            const AcquireNodeHttpAgent = Function.compose(
                AgentCommon.MobyConnectionOptions.$match({
                    ssh: (options) => makeNodeSshAgent(httpLazy, ssh2Lazy, options),
                    http: (options) => new httpLazy.Agent({ host: options.host, port: options.port }),
                    socket: (options) => new httpLazy.Agent({ socketPath: options.socketPath } as http.AgentOptions),
                    https: (options) =>
                        new httpsLazy.Agent({
                            ca: options.ca,
                            key: options.key,
                            cert: options.cert,
                            host: options.host,
                            port: options.port,
                            passphrase: options.passphrase,
                        }),
                }),
                Effect.succeed
            );
            const releaseNodeHttpAgent = (agent: http.Agent) => Effect.sync(() => agent.destroy());
            const resource = Effect.acquireRelease(AcquireNodeHttpAgent(connectionOptions), releaseNodeHttpAgent);
            return Effect.map(resource, (agent) => ({
                http: agent as http.Agent,
                https: agent as https.Agent,
                [nodeHttpClientLazy.HttpAgentTypeId]: nodeHttpClientLazy.HttpAgentTypeId,
            }));
        })
    );

/**
 * Given the moby connection options, it will construct a layer that provides a
 * http client that you could use to connect to your moby instance.
 *
 * @since 1.0.0
 * @category Connection
 */
export const makeNodeHttpClientLayer = (
    connectionOptions: AgentCommon.MobyConnectionOptions
): Layer.Layer<HttpClient.HttpClient.Default, never, never> =>
    Function.pipe(
        Effect.promise(() => import("@effect/platform-node/NodeHttpClient")),
        Effect.map((nodeHttpClientLazy) =>
            Layer.provide(
                nodeHttpClientLazy.layerWithoutAgent,
                Layer.scoped(nodeHttpClientLazy.HttpAgent, getNodeAgent(connectionOptions))
            )
        ),
        Layer.unwrapEffect,
        Layer.map((context) => {
            const oldClient = Context.get(context, HttpClient.HttpClient);
            const requestUrl = AgentCommon.getNodeRequestUrl(connectionOptions);
            const newClient = HttpClient.mapRequest(oldClient, HttpClientRequest.prependUrl(requestUrl));
            return Context.make(HttpClient.HttpClient, newClient);
        })
    );
