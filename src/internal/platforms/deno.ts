import type * as Scope from "effect/Scope";
import type * as HttpClient from "effect/unstable/http/HttpClient";

import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as Layer from "effect/Layer";
import * as Predicate from "effect/Predicate";
import * as FetchHttpClient from "effect/unstable/http/FetchHttpClient";
import * as Socket from "effect/unstable/socket/Socket";

import type * as MobyConnection from "../../MobyConnection.ts";
import type * as ws from "ws";

import * as internalAgnostic from "./agnostic.ts";
import * as internalConnection from "./connection.ts";
import * as internalNode from "./node.ts";

/**
 * The subset of the Deno namespace this layer needs: `Deno.createHttpClient`
 * builds a fetch client that can dial unix domain sockets (through the proxy
 * transport option) or trust custom certificate material, and the returned
 * client is a resource that must be closed.
 *
 * @internal
 * @see https://docs.deno.com/api/deno/~/Deno.createHttpClient
 */
interface DenoHttpClient {
    readonly close: () => void;
}

/** @internal */
interface DenoCreateHttpClientOptions {
    readonly caCerts?: Array<string> | undefined;
    readonly cert?: string | undefined;
    readonly key?: string | undefined;
    readonly proxy?: { readonly transport: "unix"; readonly path: string } | undefined;
}

/** @internal */
interface DenoNamespace {
    readonly createHttpClient: (options: DenoCreateHttpClientOptions) => DenoHttpClient;
}

/**
 * Deno extends the standard fetch options with a `client` option to route the
 * request through a custom http client.
 *
 * @internal
 */
interface DenoFetchRequestInit extends globalThis.RequestInit {
    readonly client?: DenoHttpClient | undefined;
}

/** @internal */
const acquireDenoHttpClient = (
    options: DenoCreateHttpClientOptions
): Effect.Effect<DenoHttpClient, never, Scope.Scope> =>
    Effect.acquireRelease(
        Effect.sync(() => {
            const deno = (globalThis as { Deno?: DenoNamespace | undefined }).Deno;
            if (Predicate.isUndefined(deno)) {
                throw new Error(
                    "makeDenoHttpClientLayer requires the Deno runtime for unix socket and custom tls connections, use makeNodeHttpClientLayer or makeUndiciHttpClientLayer instead"
                );
            }
            return deno.createHttpClient(options);
        }),
        (client) => Effect.sync(() => client.close())
    );

/**
 * Websocket constructor backed by the "ws" package, which Deno runs through
 * its node compat layer - including support for ws+unix urls, which tunnel
 * the upgrade over a unix domain socket. Https connections receive the custom
 * certificate material from the connection options.
 *
 * @internal
 */
const websocketConstructorLayer = (
    connectionOptions: MobyConnection.MobyConnectionOptions
): Layer.Layer<Socket.WebSocketConstructor, never, never> =>
    Layer.effect(
        Socket.WebSocketConstructor,
        Function.pipe(
            Effect.promise(() => import("ws")),
            Effect.map((wsLazy) => {
                const prependedUrl = internalAgnostic.makeWebsocketRequestUrl(connectionOptions);
                const options: ws.ClientOptions | undefined =
                    connectionOptions._tag === "https"
                        ? {
                              ca: connectionOptions.ca,
                              cert: connectionOptions.cert,
                              key: connectionOptions.key,
                              passphrase: connectionOptions.passphrase,
                          }
                        : undefined;
                return (url: string, protocols?: string | Array<string> | undefined) =>
                    new wsLazy.WebSocket(
                        `${prependedUrl}${url}`,
                        protocols,
                        options
                    ) as unknown as globalThis.WebSocket;
            })
        )
    );

/** @internal */
const makeFetchBasedLayer = (
    connectionOptions: MobyConnection.MobyConnectionOptions,
    requestInit: Effect.Effect<DenoFetchRequestInit, never, Scope.Scope>
): Layer.Layer<HttpClient.HttpClient | Socket.WebSocketConstructor, never, never> =>
    internalAgnostic
        .makeAgnosticHttpClientLayer(connectionOptions)
        .pipe(
            Layer.merge(websocketConstructorLayer(connectionOptions)),
            Layer.provide(FetchHttpClient.layer),
            Layer.provide(Layer.effect(FetchHttpClient.RequestInit, requestInit))
        );

/** @internal */
export const makeDenoHttpClientLayer: (
    connectionOptions: MobyConnection.MobyConnectionOptions
) => Layer.Layer<HttpClient.HttpClient | Socket.WebSocketConstructor, never, never> =
    internalConnection.MobyConnectionOptions.$match({
        ssh: internalNode.makeNodeHttpClientLayer,
        socket: (options) =>
            makeFetchBasedLayer(
                options,
                Effect.map(
                    acquireDenoHttpClient({
                        proxy: {
                            transport: "unix",
                            path: options.socketPath,
                        },
                    }),
                    (client) => ({ client })
                )
            ),
        http: (options) => makeFetchBasedLayer(options, Effect.succeed({})),
        https: (options) => {
            const hasCertificateMaterial =
                Predicate.isNotUndefined(options.ca) ||
                Predicate.isNotUndefined(options.cert) ||
                Predicate.isNotUndefined(options.key);
            const requestInit: Effect.Effect<DenoFetchRequestInit, never, Scope.Scope> = hasCertificateMaterial
                ? Effect.map(
                      acquireDenoHttpClient({
                          caCerts: Predicate.isNotUndefined(options.ca) ? [options.ca] : undefined,
                          cert: options.cert,
                          key: options.key,
                      }),
                      (client) => ({ client })
                  )
                : Effect.succeed({});
            return makeFetchBasedLayer(options, requestInit);
        },
    });
