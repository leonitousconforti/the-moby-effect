import type * as HttpClientResponse from "@effect/platform/HttpClientResponse";
import type * as MobyDemux from "../../MobyDemux.js";
import type { IExposeSocketOnEffectClientResponseHack } from "../platforms/node.js";

import * as Socket from "@effect/platform/Socket";
import * as Effect from "effect/Effect";

import { makeMultiplexedSocket, responseIsMultiplexedResponse } from "./multiplexed.js";
import { makeRawSocket, responseIsRawResponse } from "./raw.js";

/** @internal */
export const hijackResponseUnsafe = (
    response: HttpClientResponse.HttpClientResponse
): Effect.Effect<Socket.Socket, Socket.SocketError, never> =>
    Effect.flatMap(
        Effect.promise(() => import("@effect/platform-node/NodeSocket")),
        (nodeSocketLazy) => {
            const socket = (response as IExposeSocketOnEffectClientResponseHack).original.source.socket;
            return nodeSocketLazy.fromDuplex(Effect.sync(() => socket));
        }
    );

/** @internal */
export const responseToMultiplexedStreamSocketOrFailUnsafe = (
    response: HttpClientResponse.HttpClientResponse
): Effect.Effect<MobyDemux.MultiplexedSocket, Socket.SocketError, never> => {
    if (!responseIsMultiplexedResponse(response)) {
        return Effect.fail(
            new Socket.SocketGenericError({
                reason: "Read",
                cause: `Response with content type "${response.headers["content-type"]}" is not a multiplexed streaming socket`,
            })
        );
    }

    return Effect.map(hijackResponseUnsafe(response), makeMultiplexedSocket);
};

/** @internal */
export const responseToRawStreamSocketOrFailUnsafe = (
    response: HttpClientResponse.HttpClientResponse
): Effect.Effect<MobyDemux.RawSocket, Socket.SocketError, never> => {
    if (!responseIsRawResponse(response)) {
        return Effect.fail(
            new Socket.SocketGenericError({
                reason: "Read",
                cause: `Response with content type "${response.headers["content-type"]}" is not a raw streaming socket`,
            })
        );
    }

    return Effect.map(hijackResponseUnsafe(response), makeRawSocket);
};

/** @internal */
export const responseToStreamingSocketOrFailUnsafe = (
    response: HttpClientResponse.HttpClientResponse
): Effect.Effect<MobyDemux.RawSocket | MobyDemux.MultiplexedSocket, Socket.SocketError, never> => {
    if (responseIsMultiplexedResponse(response)) {
        return responseToMultiplexedStreamSocketOrFailUnsafe(response);
    }

    if (responseIsRawResponse(response)) {
        return responseToRawStreamSocketOrFailUnsafe(response);
    }

    return Effect.fail(new Socket.SocketGenericError({ reason: "Read", cause: "Response is not a streaming socket" }));
};
