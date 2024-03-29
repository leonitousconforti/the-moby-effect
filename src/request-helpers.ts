import net from "node:net";

import * as NodeSocket from "@effect/experimental/Socket";
import * as NodeHttp from "@effect/platform-node/HttpClient";
import * as ParseResult from "@effect/schema/ParseResult";
import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as Match from "effect/Match";
import * as Stream from "effect/Stream";

/**
 * Helper interface to expose the underlying socket from the effect NodeHttp
 * response. Useful for multiplexing the response stream.
 */
export interface IExposeSocketOnEffectClientResponse extends NodeHttp.response.ClientResponse {
    source: {
        socket: net.Socket;
    };
}

export const addQueryParameter = (
    key: string,
    value: unknown | unknown[] | undefined
): ((self: NodeHttp.request.ClientRequest) => NodeHttp.request.ClientRequest) =>
    value === undefined || (Array.isArray(value) && value.length === 0)
        ? Function.identity
        : NodeHttp.request.setUrlParam(key, String(value));

export const responseErrorHandler =
    <E>(toError: (message: string) => E) =>
    (
        error:
            | NodeHttp.body.BodyError
            | NodeHttp.error.RequestError
            | NodeHttp.error.ResponseError
            | ParseResult.ParseError
            | NodeSocket.SocketError
    ): Effect.Effect<never, E, never> =>
        Function.pipe(
            error,
            Match.valueTags({
                ParseError: (parseError) => Effect.fail(toError(`parsing errors\n${parseError.toString()}\n`)),
                BodyError: (bodyError) =>
                    Effect.fail(toError(`body error ${bodyError.reason._tag}, ${String(bodyError.reason.error)}`)),
                RequestError: (requestError) =>
                    Effect.fail(toError(`request error ${requestError.reason}, ${String(requestError.error)}`)),
                SocketError: (socketError) =>
                    Effect.fail(toError(`socket error ${socketError.reason}, ${String(socketError.error)}`)),
                ResponseError: (responseError) =>
                    responseError.response.text.pipe(
                        Effect.catchTag("ResponseError", () =>
                            Effect.fail(toError(`response error ${responseError.reason}`))
                        ),
                        Effect.flatMap((text) =>
                            Effect.fail(
                                toError(
                                    `response error ${responseError.reason}, statusCode=${responseError.response.status} message=${text}`
                                )
                            )
                        )
                    ),
            })
        );

export const streamErrorHandler =
    <E>(toError: (message: string) => E) =>
    (error: NodeHttp.error.ResponseError | ParseResult.ParseError): Stream.Stream<never, E, never> =>
        Function.pipe(
            error,
            Match.valueTags({
                ParseError: (parseError) => Effect.fail(toError(`parsing errors\n${parseError.toString()}\n`)),
                ResponseError: (responseError) =>
                    responseError.response.text.pipe(
                        Effect.catchTag("ResponseError", () =>
                            Effect.fail(toError(`response error ${responseError.reason}`))
                        ),
                        Effect.flatMap((text) =>
                            Effect.fail(
                                toError(
                                    `response error ${responseError.reason}, statusCode=${responseError.response.status} message=${text}`
                                )
                            )
                        )
                    ),
            })
        );
