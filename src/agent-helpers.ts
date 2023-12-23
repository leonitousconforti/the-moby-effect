import http from "node:http";
import https from "node:https";
import net from "node:net";
import ssh2 from "ssh2";

import * as NodeHttp from "@effect/platform-node/HttpClient";
import { Context, Effect, Layer, Match, Scope, pipe } from "effect";

/** How to connect to your moby/docker instance. */
export type MobyConnectionOptions =
    | { connection: "unix"; socketPath: string }
    | { connection: "http"; host: string; port: number }
    | ({ connection: "ssh"; remoteSocketPath: string } & ssh2.ConnectConfig)
    | {
          connection: "https";
          host: string;
          port: number;
          cert: string;
          ca: string;
          key: string;
          passphrase?: string | undefined;
      };

/**
 * Helper interface to expose the underlying socket from the effect NodeHttp
 * response. Useful for multiplexing the response stream.
 */
export interface IExposeSocketOnEffectClientResponse extends NodeHttp.response.ClientResponse {
    source: {
        socket: net.Socket;
    };
}

/**
 * Our moby connection needs to be an extension of the effect platform-node
 * httpAgent so that it will still be compatible with all the other
 * platform-node http methods, but it would be nice if it had a few other things
 * as well. The nodeRequestUrl is the url that the node http client will use to
 * make requests. And while we don't need to keep track of the connection
 * options for anything yet, it wouldn't hurt to add them.
 */
export interface IMobyConnectionAgent extends NodeHttp.nodeClient.HttpAgent {
    ssh: http.Agent;
    unix: http.Agent;
    nodeRequestUrl: string;
    connectionOptions: MobyConnectionOptions;
}

/** Context identifier for our moby connection agent. */
export const MobyConnectionAgent: Context.Tag<IMobyConnectionAgent, IMobyConnectionAgent> =
    Context.Tag<IMobyConnectionAgent>(Symbol.for("@the-moby-effect/MobyConnectionAgent"));

export const MobyHttpClientLive: Layer.Layer<IMobyConnectionAgent, never, NodeHttp.client.Client.Default> =
    NodeHttp.nodeClient.layerWithoutAgent.pipe(
        Layer.provide(Layer.effect(NodeHttp.nodeClient.HttpAgent, MobyConnectionAgent))
    );

/**
 * An http agent that connect to remote docker instances over ssh.
 *
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
class SSHAgent extends http.Agent {
    // The ssh client that will be connecting to the server
    private readonly sshClient: ssh2.Client;

    // How to connect to the remote server and where the docker socket is located.
    private readonly connectConfig: ssh2.ConnectConfig & { remoteSocketPath: string };

    public constructor(
        ssh2ConnectConfig: ssh2.ConnectConfig & { remoteSocketPath: string },
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
        callback: (error: Error | undefined, socket?: net.Socket | undefined) => void
    ): void {
        this.sshClient
            .on("ready", () => {
                this.sshClient.openssh_forwardOutStreamLocal(
                    this.connectConfig.remoteSocketPath,
                    (error: Error | undefined, stream: ssh2.ClientChannel) => {
                        if (error) {
                            return callback(error);
                        }

                        stream.once("close", () => {
                            stream.end();
                            stream.destroy();
                            this.sshClient.end();
                        });

                        callback(undefined, stream as unknown as net.Socket);
                    }
                );
            })
            .on("error", (error) => callback(error))
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
                    Match.when({ connection: "ssh" }, (options) => new SSHAgent(options)),
                    Match.when(
                        { connection: "unix" },
                        (options) => new http.Agent({ socketPath: options.socketPath } as http.AgentOptions)
                    ),
                    Match.when(
                        { connection: "http" },
                        (options) => new http.Agent({ host: options.host, port: options.port })
                    ),
                    Match.when(
                        { connection: "https" },
                        (options) =>
                            new https.Agent({
                                ca: options.ca,
                                key: options.key,
                                cert: options.cert,
                                host: options.host,
                                port: options.port,
                                passphrase: options.passphrase,
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
            nodeRequestUrl: connectionOptions.connection === "https" ? "https://0.0.0.0" : "http://0.0.0.0",
            [NodeHttp.nodeClient.HttpAgentTypeId]: NodeHttp.nodeClient.HttpAgentTypeId,
        })
    );
