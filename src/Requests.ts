/**
 * Request helpers
 *
 * @since 1.0.0
 */

import * as net from "node:net";

import * as HttpClient from "@effect/platform/HttpClient";
import * as NodeSocket from "@effect/platform/Socket";
import * as ParseResult from "@effect/schema/ParseResult";
import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as Match from "effect/Match";
import * as Stream from "effect/Stream";

/**
 * Helper interface to expose the underlying socket from the effect HttpClient
 * response. Useful for multiplexing the response stream.
 *
 * La la la coding coding coding
 */
export interface IExposeSocketOnEffectClientResponse extends HttpClient.response.ClientResponse {
    source: {
        socket: net.Socket;
    };
}

export const addQueryParameter = (
    key: string,
    value: unknown | Array<unknown> | undefined
): ((self: HttpClient.request.ClientRequest) => HttpClient.request.ClientRequest) =>
    value === undefined || (Array.isArray(value) && value.length === 0)
        ? Function.identity
        : HttpClient.request.setUrlParam(key, String(value));

export const responseErrorHandler =
    <E>(toError: (message: string) => E) =>
    (
        error:
            | HttpClient.body.BodyError
            | HttpClient.error.RequestError
            | HttpClient.error.ResponseError
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
                    Effect.fail(toError(`socket error ${socketError.reason}, ${String(socketError.message)}`)),
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
    (error: HttpClient.error.ResponseError | ParseResult.ParseError): Stream.Stream<never, E, never> =>
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
