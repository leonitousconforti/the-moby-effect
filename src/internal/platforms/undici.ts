import type * as HttpClient from "@effect/platform/HttpClient";
import type * as Scope from "effect/Scope";
import type * as net from "node:net";
import type * as ssh2 from "ssh2";
import type * as undici from "undici";
import type * as MobyConnection from "../../MobyConnection.js";

import * as Socket from "@effect/platform/Socket";
import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as Layer from "effect/Layer";
import * as internalAgnostic from "./agnostic.js";
import * as internalConnection from "./connection.js";

/** @internal */
export const makeDispatcher: (
    agentOptions?: undici.Agent.Options | undefined
) => Effect.Effect<undici.Agent, never, Scope.Scope> = Effect.fnUntraced(function* (
    agentOptions?: undici.Agent.Options | undefined
) {
    const undiciLazy = yield* Effect.promise(() => import("undici"));
    const acquire = Effect.sync(() => new undiciLazy.Agent(agentOptions));
    const release = (agent: undici.Dispatcher) => Effect.promise(() => agent.destroy());
    const resource = Effect.acquireRelease(acquire, release);
    return yield* resource;
});

/** @internal */
export const makeSshDispatcher: (
    connectionOptions: MobyConnection.SshConnectionOptions
) => Effect.Effect<undici.Agent, never, Scope.Scope> = Effect.fnUntraced(function* (
    connectionOptions: MobyConnection.SshConnectionOptions
) {
    const ssh2Lazy = yield* Effect.promise(() => import("ssh2"));
    const undiciLazy = yield* Effect.promise(() => import("undici"));
    const sshClient = new ssh2Lazy.Client();

    let sshConnection: "unopened" | "connecting" | "open-failed" | "ready" = "unopened";
    let openFailedError: Error | null = null;

    const connector: undici.buildConnector.connector = (
        _options: undici.buildConnector.Options,
        callback: undici.buildConnector.Callback
    ) => {
        const onError = (error: Error): void => callback(error, null);

        // No connection yet, start connecting
        if (sshConnection === "unopened") {
            sshConnection = "connecting";
            const unableToOpen = (error: Error & ssh2.ClientErrorExtensions) => {
                sshConnection = "open-failed";
                openFailedError = error;
                onError(error);
            };
            sshClient
                .once("ready", () => {
                    sshConnection = "ready";
                    sshClient.off("error", unableToOpen);
                    connector(_options, callback);
                })
                .once("error", unableToOpen)
                .connect(connectionOptions);
        }

        // Already tried to connect but failed
        else if (sshConnection === "open-failed") {
            callback(openFailedError!, null);
        }

        // Another connection attempt is already in progress, wait for it
        else if (sshConnection === "connecting") {
            sshClient
                .once("ready", () => {
                    sshClient.off("error", onError);
                    connector(_options, callback);
                })
                .once("error", onError);
        }

        // We are connected to the ssh server, now forward our stream local
        else if (sshConnection === "ready") {
            sshClient
                .openssh_forwardOutStreamLocal(
                    connectionOptions.remoteSocketPath,
                    (error: Error | undefined, stream: ssh2.ClientChannel) => {
                        sshClient.off("error", onError);
                        if (error) return callback(error, null);
                        else return callback(null, stream as unknown as net.Socket);
                    }
                )
                .once("error", onError);
        }

        // Should never happen
        else {
            return Function.absurd<undefined>(sshConnection);
        }
    };

    const acquire = Effect.sync(() => new undiciLazy.Agent({ connect: connector }));
    const release = (_agent: undici.Dispatcher) =>
        Effect.promise(async () => {
            sshClient.end();
            sshClient.destroy();
            // await agent.close();
            // await agent.destroy();
        });

    const resource = Effect.acquireRelease(acquire, release);
    return yield* resource;
});

/** @internal */
export const getUndiciDispatcher: (
    connectionOptions: MobyConnection.MobyConnectionOptions
) => Effect.Effect<undici.Dispatcher, never, Scope.Scope> = internalConnection.MobyConnectionOptions.$match({
    ssh: (options) => makeSshDispatcher(options),
    socket: (options) =>
        makeDispatcher({
            connect: {
                socketPath: options.socketPath,
            },
        }),
    http: (options) =>
        makeDispatcher({
            connect: {
                host: options.host,
                port: options.port,
                path: options.path,
            },
        }),
    https: (options) =>
        makeDispatcher({
            connect: {
                ca: options.ca,
                key: options.key,
                cert: options.cert,
                passphrase: options.passphrase,
                host: options.host,
                port: options.port,
                path: options.path,
            },
        }),
});

/** @internal */
export const getUndiciWebsocketConstructor = (
    connectionOptions: MobyConnection.MobyConnectionOptions
): Effect.Effect<(url: string, protocols?: string | Array<string> | undefined) => globalThis.WebSocket, never, never> =>
    Function.pipe(
        Effect.promise(() => import("ws")),
        Effect.map((ws) => {
            const prependedUrl = internalAgnostic.makeWebsocketRequestUrl(connectionOptions);
            return (url: string, protocols?: string | Array<string> | undefined) =>
                new ws.WebSocket(`${prependedUrl}${url}`, protocols) as unknown as globalThis.WebSocket;
        })
    );

/** @internal */
export const makeUndiciHttpClientLayer = (
    connectionOptions: MobyConnection.MobyConnectionOptions
): Layer.Layer<HttpClient.HttpClient | Socket.WebSocketConstructor, never, never> => {
    const dispatcherLive = Function.pipe(
        Effect.promise(() => import("@effect/platform-node/NodeHttpClient")),
        Effect.map((nodeHttpClientLazy) =>
            Layer.scoped(nodeHttpClientLazy.Dispatcher, getUndiciDispatcher(connectionOptions))
        ),
        Layer.unwrapEffect
    );

    const websocketConstructorLive = Layer.effect(
        Socket.WebSocketConstructor,
        getUndiciWebsocketConstructor(connectionOptions)
    );

    const undiciHttpClientLive = Function.pipe(
        Effect.promise(() => import("@effect/platform-node/NodeHttpClient")),
        Effect.map((nodeHttpClientLazy) => nodeHttpClientLazy.layerUndiciWithoutDispatcher),
        Layer.unwrapEffect
    );

    const agnosticHttpClientLayer = internalAgnostic.makeAgnosticHttpClientLayer(connectionOptions);

    return agnosticHttpClientLayer
        .pipe(Layer.merge(websocketConstructorLive))
        .pipe(Layer.provide(undiciHttpClientLive))
        .pipe(Layer.provide(dispatcherLive));
};
