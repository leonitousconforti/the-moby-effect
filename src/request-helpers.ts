import * as NodeHttp from "@effect/platform-node/HttpClient";
import * as ParseResult from "@effect/schema/ParseResult";
import { Effect, Match, Stream, identity, pipe } from "effect";

export const addQueryParameter = (
    key: string,
    value: unknown | unknown[] | undefined
): ((self: NodeHttp.request.ClientRequest) => NodeHttp.request.ClientRequest) =>
    value === undefined || (Array.isArray(value) && value.length === 0)
        ? identity
        : NodeHttp.request.setUrlParam(key, String(value));

export const responseErrorHandler =
    <E>(toError: (message: string) => E) =>
    (
        error:
            | NodeHttp.body.BodyError
            | NodeHttp.error.RequestError
            | NodeHttp.error.ResponseError
            | ParseResult.ParseError
    ): Effect.Effect<never, E, never> =>
        pipe(
            error,
            Match.valueTags({
                ParseError: (parseError) => Effect.fail(toError(`parsing errors\n${parseError.toString()}\n`)),
                BodyError: (bodyError) =>
                    Effect.fail(toError(`body error ${bodyError.reason._tag}, ${String(bodyError.reason.error)}`)),
                RequestError: (requestError) =>
                    Effect.fail(toError(`request error ${requestError.reason}, ${String(requestError.error)}`)),
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
    (error: NodeHttp.error.ResponseError): Stream.Stream<never, E, never> =>
        pipe(
            error,
            Match.valueTags({
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
