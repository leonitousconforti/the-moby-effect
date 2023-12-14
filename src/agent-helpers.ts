import http from "node:http";
import https from "node:https";
import net from "node:net";
import ssh2 from "ssh2";

import { HttpAgent, HttpAgentTypeId, makeAgentLayer } from "@effect/platform-node/Http/NodeClient";
import { Context, Effect, Layer, Match, Scope, pipe } from "effect";
import * as NodeHttp from "@effect/platform-node/HttpClient";

import type { MobyConnectionOptions, MobyError } from "./main.js";

/**
 * Our moby connection needs to be an extension of the effect platform-node
 * httpAgent so that it will still be compatible with all the other
 * platform-node http methods.
 */
export interface IMobyConnectionAgent extends HttpAgent {
    ssh: http.Agent;
    unix: http.Agent;
    nodeRequestUrl: string;
    connectionOptions: MobyConnectionOptions;
}

/** Context identifier for our moby connection agent. */
export const MobyConnectionAgent: Context.Tag<IMobyConnectionAgent, IMobyConnectionAgent> =
    Context.Tag<IMobyConnectionAgent>(Symbol.for("@the-moby-effect/MobyConnectionAgent"));

export const MobyHttpClientLive: Layer.Layer<IMobyConnectionAgent, never, NodeHttp.client.Client.Default> =
    NodeHttp.nodeClient.layerWithoutAgent.pipe(Layer.provide(Layer.effect(HttpAgent, MobyConnectionAgent)));

/**
 * Takes in a moby endpoint that depends on a connection agent being provided
 * and returns a scoped effect with the connection agent dependency removed.
 */
export type WithConnectionAgentProvided<Function_> = Function_ extends (
    ...arguments_: infer U
) => Effect.Effect<infer R, infer E, infer A>
    ? (...arguments_: U) => Effect.Effect<Scope.Scope | Exclude<R, IMobyConnectionAgent>, MobyError | Exclude<E, E>, A>
    : never;

/**
 * An http agent that connect to remote docker instances over ssh.
 *
 * @example
 *     import http from "node:http";
 *
 *     const request1 = http.get(
 *         {
 *             path: "/_ping",
 *             agent: new SSHAgent(ssh2Options),
 *         },
 *         (response) => {
 *             console.log(response.statusCode);
 *             console.dir(response.headers);
 *             response.resume();
 *         }
 *     );
 *     request1.end();
 *
 *     const request2 = http.get(
 *         {
 *             path: "/_ping",
 *             agent: new SSHAgent(ssh2Options),
 *         },
 *         (response) => {
 *             console.log(response.statusCode);
 *             console.dir(response.headers);
 *             response.resume();
 *         }
 *     );
 *     request2.end();
 */
export class SSHAgent extends http.Agent {
    // The ssh client that will be connecting to the server
    private readonly sshClient: ssh2.Client;

    // How to connect to the remote server and where the docker socket is located.
    private readonly connectConfig: ssh2.ConnectConfig & { socketPath: string };

    public constructor(
        ssh2ConnectConfig: ssh2.ConnectConfig & { socketPath: string },
        agentOptions?: http.AgentOptions | undefined
    ) {
        super(agentOptions);
        this.sshClient = new ssh2.Client();
        this.connectConfig = ssh2ConnectConfig;
    }

    /**
     * When creating a new connection, first start by trying to connect to the
     * remote server over ssh. Then, if that was successful, we send a
     * forwardOurStreamLocal request which is an OpenSSH extension that opens a
     * connection to the unix domain socket at socketPath on the remote server
     * and forwards traffic.
     */
    public createConnection(
        _options: http.ClientRequestArgs,
        onCreate: (error: Error | undefined, socket?: net.Socket | undefined) => void
    ): void {
        this.sshClient
            .on("ready", () => {
                this.sshClient.openssh_forwardOutStreamLocal(
                    this.connectConfig.socketPath,
                    (error: Error | undefined, stream: ssh2.ClientChannel) => {
                        if (error) {
                            return onCreate(error);
                        }

                        stream.once("close", () => {
                            stream.end();
                            stream.destroy();
                            this.sshClient.end();
                        });

                        onCreate(undefined, stream as unknown as net.Socket);
                    }
                );
            })
            .on("error", (error) => onCreate(error))
            .connect(this.connectConfig);
    }
}

/**
 * Given the moby connection options, it will construct a scoped effect that
 * provides an http connection agent that you should use to connect to your
 * docker instance.
 */
export const getAgent = (
    connectionOptions: MobyConnectionOptions
): Effect.Effect<Scope.Scope, never, IMobyConnectionAgent> =>
    Effect.map(
        Effect.acquireRelease(
            Effect.sync(() =>
                pipe(
                    Match.value<MobyConnectionOptions>(connectionOptions),
                    Match.when({ protocol: "ssh" }, (options) => new SSHAgent(options)),
                    Match.when(
                        { protocol: "unix" },
                        (options) => new http.Agent({ socketPath: options.socketPath } as http.AgentOptions)
                    ),
                    Match.when(
                        { protocol: "http" },
                        (options) => new http.Agent({ host: options.host, port: options.port })
                    ),
                    Match.when(
                        { protocol: "https" },
                        (options) =>
                            new https.Agent({
                                ca: options.ca,
                                key: options.key,
                                cert: options.cert,
                                host: options.host,
                                port: options.port,
                            })
                    ),
                    Match.exhaustive
                )
            ),
            (agent) => Effect.sync(() => agent.destroy())
        ),
        (agent: http.Agent | https.Agent | SSHAgent) => ({
            ssh: agent as SSHAgent,
            unix: agent as http.Agent,
            http: agent as http.Agent,
            https: agent as https.Agent,
            connectionOptions: connectionOptions,
            nodeRequestUrl: connectionOptions.protocol === "https" ? "https://0.0.0.0" : "http://0.0.0.0",
            [HttpAgentTypeId]: HttpAgentTypeId,
        })
    );
