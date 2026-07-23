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
 * Bun extends the standard fetch options: `unix` routes the request over a
 * unix domain socket instead of tcp and `tls` supplies custom certificate
 * material for https connections.
 *
 * @internal
 * @see https://bun.com/docs/api/fetch
 */
interface BunFetchRequestInit extends globalThis.RequestInit {
    readonly unix?: string | undefined;
    readonly tls?:
        | {
              readonly ca?: string | undefined;
              readonly cert?: string | undefined;
              readonly key?: string | undefined;
              readonly passphrase?: string | undefined;
          }
        | undefined;
}

/** @internal */
const assertBunRuntime = Effect.sync(() => {
    if (!("Bun" in globalThis)) {
        throw new Error(
            "makeBunHttpClientLayer requires the Bun runtime for unix socket and custom tls connections, use makeNodeHttpClientLayer or makeUndiciHttpClientLayer instead"
        );
    }
});

/**
 * Websocket constructor backed by the "ws" package, which Bun aliases to its
 * native WebSocket implementation - including support for ws+unix urls, which
 * tunnel the upgrade over a unix domain socket. Https connections receive the
 * custom certificate material from the connection options.
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
    requestInit: Effect.Effect<BunFetchRequestInit, never, never>
): Layer.Layer<HttpClient.HttpClient | Socket.WebSocketConstructor, never, never> =>
    internalAgnostic
        .makeAgnosticHttpClientLayer(connectionOptions)
        .pipe(
            Layer.merge(websocketConstructorLayer(connectionOptions)),
            Layer.provide(FetchHttpClient.layer),
            Layer.provide(Layer.effect(FetchHttpClient.RequestInit, requestInit))
        );

/** @internal */
export const makeBunHttpClientLayer: (
    connectionOptions: MobyConnection.MobyConnectionOptions
) => Layer.Layer<HttpClient.HttpClient | Socket.WebSocketConstructor, never, never> =
    internalConnection.MobyConnectionOptions.$match({
        ssh: internalNode.makeNodeHttpClientLayer,
        socket: (options) => makeFetchBasedLayer(options, Effect.as(assertBunRuntime, { unix: options.socketPath })),
        http: (options) => makeFetchBasedLayer(options, Effect.succeed({})),
        https: (options) => {
            const hasCertificateMaterial =
                Predicate.isNotUndefined(options.ca) ||
                Predicate.isNotUndefined(options.cert) ||
                Predicate.isNotUndefined(options.key);
            const requestInit: Effect.Effect<BunFetchRequestInit, never, never> = hasCertificateMaterial
                ? Effect.as(assertBunRuntime, {
                      tls: {
                          ca: options.ca,
                          cert: options.cert,
                          key: options.key,
                          passphrase: options.passphrase,
                      },
                  })
                : Effect.succeed({});
            return makeFetchBasedLayer(options, requestInit);
        },
    });
