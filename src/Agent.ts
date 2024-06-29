/**
 * Http, https, ssh, and unix socket connection agents.
 *
 * @since 1.0.0
 */

import * as http from "node:http";
import * as https from "node:https";
import * as net from "node:net";
import * as ssh2 from "ssh2";

import * as NodeHttp from "@effect/platform-node/NodeHttpClient";
import * as HttpClient from "@effect/platform/HttpClient";
import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as Layer from "effect/Layer";
import * as Match from "effect/Match";
import * as Scope from "effect/Scope";

/**
 * Connection options for how to connect to your moby/docker instance. Can be a
 * unix socket on the current machine. Can be an ssh connection to a remote
 * machine with a remote user, remote machine, remote port, and remote socket
 * path. Can be an http connection to a remote machine with a host, port, and
 * path. Or it can be an https connection to a remote machine with a host, port,
 * path, cert, ca, key, and passphrase.
 *
 * @since 1.0.0
 * @category Connection
 */
export type MobyConnectionOptions =
    | { connection: "socket"; socketPath: string }
    | ({ connection: "ssh"; remoteSocketPath: string } & ssh2.ConnectConfig)
    | { connection: "http"; host: string; port: number; path?: string | undefined }
    | {
          connection: "https";
          host: string;
          port: number;
          path?: string | undefined;
          cert?: string | undefined;
          ca?: string | undefined;
          key?: string | undefined;
          passphrase?: string | undefined;
      };

/**
 * Our moby connection needs to be an extension of the effect platform-node
 * httpAgent so that it will still be compatible with all the other
 * platform-node http methods, but it would be nice if it had a few other things
 * as well. The nodeRequestUrl is the url that the node http client will use to
 * make requests. And while we don't need to keep track of the connection
 * options for anything yet, it doesn't hurt to add them.
 *
 * @since 1.0.0
 * @category Connection
 */
export interface IMobyConnectionAgentImpl extends NodeHttp.HttpAgent {
    nodeRequestUrl: string;
    connectionOptions: MobyConnectionOptions;
    agent: http.Agent | https.Agent | SSHAgent;
}

/**
 * @since 1.0.0
 * @category Tags
 */
export interface IMobyConnectionAgent {
    readonly _: unique symbol;
}

/**
 * Context identifier for our moby connection agent.
 *
 * @since 1.0.0
 * @category Tags
 */
export const MobyConnectionAgent: Context.Tag<IMobyConnectionAgent, IMobyConnectionAgentImpl> = Context.GenericTag<
    IMobyConnectionAgent,
    IMobyConnectionAgentImpl
>("@the-moby-effect/MobyConnectionAgent");

/**
 * A layer that provides the http client with a connection agent that can be
 * used to connect to a remote moby instance. This layer is used to eliminate
 * the HttpClient dependency from the other module make functions, which is an
 * undesirable dependency to have because then it relies on the consumer to
 * apply the http agent to the HttpClient layer.
 *
 * @since 1.0.0
 * @category Layers
 */
export const MobyHttpClientLive: Layer.Layer<HttpClient.HttpClient.Default, never, IMobyConnectionAgent> =
    Layer.provide(NodeHttp.layerWithoutAgent, Layer.effect(NodeHttp.HttpAgent, MobyConnectionAgent));

/**
 * An http agent that connect to remote moby instances over ssh.
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
export class SSHAgent extends http.Agent {
    // The ssh client that will be connecting to the server
    private readonly sshClient: ssh2.Client;

    // How to connect to the remote server and where the moby socket is located.
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
     *
     * @since 1.0.0
     */
    protected createConnection(
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
 * provides an http connection agent that you should use to connect to your moby
 * instance.
 *
 * @since 1.0.0
 * @category Connection
 */
export const getAgent = (
    connectionOptions: MobyConnectionOptions
): Effect.Effect<IMobyConnectionAgentImpl, never, Scope.Scope> => {
    // Acquire agent
    const acquire = Function.pipe(
        Match.value<MobyConnectionOptions>(connectionOptions),
        Match.when({ connection: "ssh" }, (options) => new SSHAgent(options)),
        Match.when(
            { connection: "socket" },
            (options) => new http.Agent({ socketPath: options.socketPath } as http.AgentOptions)
        ),
        Match.when({ connection: "http" }, (options) => new http.Agent({ host: options.host, port: options.port })),
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
        Match.exhaustive,
        Effect.succeed
    );

    // Release agent
    const release = (agent: http.Agent | https.Agent | SSHAgent): Effect.Effect<void> =>
        Effect.sync(() => agent.destroy());

    // Adding additional properties to our agents and ensuring types
    return Effect.acquireRelease(acquire, release).pipe(
        Effect.map((agent: http.Agent | https.Agent | SSHAgent) => ({
            agent,
            connectionOptions,
            http: agent as http.Agent,
            https: agent as https.Agent,
            nodeRequestUrl:
                connectionOptions.connection === "https"
                    ? `https://0.0.0.0${connectionOptions.path ?? ""}`
                    : connectionOptions.connection === "http"
                      ? `http://0.0.0.0${connectionOptions.path ?? ""}`
                      : "http://0.0.0.0",
            [NodeHttp.HttpAgentTypeId]: NodeHttp.HttpAgentTypeId,
        }))
    );
};
