/**
 * Http, https, ssh, and unix socket undici dispatchers.
 *
 * @since 1.0.0
 */

import type * as net from "node:net";
import type * as ssh2 from "ssh2";
import type * as undici from "undici";

import * as HttpClient from "@effect/platform/HttpClient";
import * as Socket from "@effect/platform/Socket";
import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as Layer from "effect/Layer";
import * as Scope from "effect/Scope";

import { MobyConnectionOptions, SshConnectionOptions } from "../MobyConnection.js";
import { makeAgnosticLayer } from "./Agnostic.js";

/**
 * An undici connector that connects to remote moby instances over ssh.
 *
 * @internal
 */
export const makeUndiciSshConnector = (
    connectionOptions: SshConnectionOptions
): Effect.Effect<undici.buildConnector.connector, never, Scope.Scope> =>
    Effect.Do.pipe(
        Effect.bind("ssh2Lazy", () => Effect.promise(() => import("ssh2"))),
        Effect.let("acquire", ({ ssh2Lazy }) => Effect.sync(() => new ssh2Lazy.Client())),
        Effect.let(
            "release",
            () => (client: ssh2.Client) =>
                Effect.sync(() => {
                    client.end();
                    client.destroy();
                })
        ),
        Effect.flatMap(({ acquire, release }) => Effect.acquireRelease(acquire, release)),
        Effect.flatMap((sshClient) =>
            Effect.async<ssh2.Client, Error>((resume) => {
                sshClient
                    .once("ready", () => {
                        sshClient.removeAllListeners("error");
                        sshClient.removeAllListeners("ready");
                        resume(Effect.succeed(sshClient));
                    })
                    .once("error", (error) => {
                        sshClient.removeAllListeners("error");
                        sshClient.removeAllListeners("ready");
                        resume(Effect.fail(error));
                    })
                    .connect(connectionOptions);
            })
        ),
        Effect.map((sshClient) => (_opts: undici.buildConnector.Options, callback: undici.buildConnector.Callback) => {
            sshClient.openssh_forwardOutStreamLocal(
                connectionOptions.remoteSocketPath,
                (error: Error | undefined, socket: ssh2.ClientChannel) => {
                    if (error) {
                        return callback(error, null);
                    }

                    socket.once("close", () => {
                        socket.end();
                        socket.destroy();
                    });

                    return callback(null, socket as unknown as net.Socket);
                }
            );
        }),
        Effect.orDie
    );

/**
 * Given the moby connection options, it will construct a scoped effect that
 * provides a undici dispatcher that you could use to connect to your moby
 * instance.
 *
 * This function will dynamically import the `undici` package.
 *
 * @since 1.0.0
 * @category Undici
 */
export const getUndiciDispatcher = (
    connectionOptions: MobyConnectionOptions
): Effect.Effect<undici.Dispatcher, never, Scope.Scope> =>
    Effect.flatMap(
        Effect.promise(() => import("undici")),
        (undiciLazy) => {
            const AcquireUndiciDispatcher = MobyConnectionOptions.$match({
                socket: (options) =>
                    Effect.succeed(
                        new undiciLazy.Agent({
                            connect: { socketPath: options.socketPath },
                        })
                    ),
                http: (options) =>
                    Effect.succeed(
                        new undiciLazy.Agent({
                            connect: { host: options.host, port: options.port, path: options.path },
                        })
                    ),
                https: (options) =>
                    Effect.succeed(
                        new undiciLazy.Agent({
                            connect: {
                                ca: options.ca,
                                key: options.key,
                                cert: options.cert,
                                passphrase: options.passphrase,
                                host: options.host,
                                port: options.port,
                                path: options.path,
                            },
                        })
                    ),
                ssh: (options) =>
                    Effect.map(
                        makeUndiciSshConnector(options),
                        (connector) => new undiciLazy.Agent({ connect: connector })
                    ),
            });

            const releaseUndiciDispatcher = (dispatcher: undici.Dispatcher) =>
                Effect.promise(() => dispatcher.destroy());

            return Effect.acquireRelease(AcquireUndiciDispatcher(connectionOptions), releaseUndiciDispatcher);
        }
    );

/**
 * Given the moby connection options, it will construct a layer that provides a
 * http client that you could use to connect to your moby instance.
 *
 * This function will dynamically import the `@effect/platform-node` and
 * `undici` packages.
 *
 * @since 1.0.0
 * @category Undici
 */
export const makeUndiciHttpClientLayer = (
    connectionOptions: MobyConnectionOptions
): Layer.Layer<HttpClient.HttpClient | Socket.WebSocketConstructor, never, never> => {
    const undiciLayer = Function.pipe(
        Effect.promise(() => import("@effect/platform-node/NodeHttpClient")),
        Effect.map((nodeHttpClientLazy) =>
            Layer.provide(
                nodeHttpClientLazy.layerUndiciWithoutDispatcher,
                Layer.scoped(
                    nodeHttpClientLazy.Dispatcher,
                    // FIXME: https://github.com/Effect-TS/effect/pull/4031
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    getUndiciDispatcher(connectionOptions) as Effect.Effect<any, never, Scope.Scope>
                )
            )
        ),
        Layer.unwrapEffect
    );

    const agnosticHttpClientLayer = makeAgnosticLayer(connectionOptions);
    return Layer.provide(agnosticHttpClientLayer, undiciLayer);
};
