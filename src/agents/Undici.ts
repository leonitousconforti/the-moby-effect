/**
 * Http, https, ssh, and unix socket undici dispatchers for NodeJS.
 *
 * @since 1.0.0
 */

import type * as net from "node:net";
import type * as ssh2 from "ssh2";
import type * as undici from "undici";

import * as HttpClient from "@effect/platform/HttpClient";
import * as HttpClientRequest from "@effect/platform/HttpClientRequest";
import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as Layer from "effect/Layer";
import * as Scope from "effect/Scope";

import * as AgentCommon from "./Common.js";

/**
 * An undici connector that connects to remote moby instances over ssh.
 *
 * @since 1.0.0
 * @category Connection
 */
export function makeUndiciSshConnector(
    ssh2Lazy: typeof ssh2,
    connectionOptions: AgentCommon.SshConnectionOptions
): undici.buildConnector.connector {
    const sshClient = new ssh2Lazy.Client();

    return (_opts: undici.buildConnector.Options, callback: undici.buildConnector.Callback) => {
        sshClient
            .on("ready", () => {
                sshClient.openssh_forwardOutStreamLocal(
                    connectionOptions.remoteSocketPath,
                    (error: Error | undefined, socket: ssh2.ClientChannel) => {
                        if (error) {
                            return callback(error, null);
                        }

                        socket.once("close", () => {
                            socket.end();
                            socket.destroy();
                            sshClient.end();
                        });

                        callback(null, socket as unknown as net.Socket);
                    }
                );
            })
            .on("error", (error) => callback(error, null))
            .connect(connectionOptions);
    };
}

/**
 * Given the moby connection options, it will construct a scoped effect that
 * provides a undici dispatcher that you could use to connect to your moby
 * instance.
 *
 * @since 1.0.0
 * @category Connection
 */
export const getUndiciDispatcher = (
    connectionOptions: AgentCommon.MobyConnectionOptions
): Effect.Effect<undici.Dispatcher, never, Scope.Scope> =>
    Function.pipe(
        Effect.all(
            {
                ssh2Lazy: Effect.promise(() => import("ssh2")),
                undiciLazy: Effect.promise(() => import("undici")),
            },
            { concurrency: 2 }
        ),
        Effect.flatMap(({ ssh2Lazy, undiciLazy }) => {
            const AcquireUndiciDispatcher = Function.compose(
                AgentCommon.MobyConnectionOptions.$match({
                    http: (options) => new undiciLazy.Agent({ connect: options }),
                    https: (options) => new undiciLazy.Agent({ connect: options }),
                    socket: (options) => new undiciLazy.Agent({ connect: options }),
                    ssh: (options) => new undiciLazy.Agent({ connect: makeUndiciSshConnector(ssh2Lazy, options) }),
                }),
                Effect.succeed
            );
            const releaseUndiciDispatcher = (dispatcher: undici.Dispatcher) => Effect.sync(() => dispatcher.destroy());
            return Effect.acquireRelease(AcquireUndiciDispatcher(connectionOptions), releaseUndiciDispatcher);
        })
    );

/**
 * Given the moby connection options, it will construct a layer that provides a
 * http client that you could use to connect to your moby instance.
 *
 * @since 1.0.0
 * @category Connection
 */
export const makeUndiciHttpClientLayer = (
    connectionOptions: AgentCommon.MobyConnectionOptions
): Layer.Layer<HttpClient.HttpClient.Default, never, never> =>
    Function.pipe(
        Effect.promise(() => import("@effect/platform-node/NodeHttpClient")),
        Effect.map((nodeHttpClientLazy) =>
            Layer.provide(
                nodeHttpClientLazy.layerUndiciWithoutDispatcher,
                Layer.scoped(nodeHttpClientLazy.Dispatcher, getUndiciDispatcher(connectionOptions))
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
