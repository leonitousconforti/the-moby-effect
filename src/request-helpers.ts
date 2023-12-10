import * as NodeHttp from "@effect/platform-node/HttpClient";
import * as ParseResult from "@effect/schema/ParseResult";
import { Cause, Effect, Stream, identity } from "effect";

// eslint-disable-next-line @typescript-eslint/typedef
export const addHeader = NodeHttp.request.setHeader;

export const addQueryParameter = (
    key: string,
    value: unknown | unknown[] | undefined
): ((self: NodeHttp.request.ClientRequest) => NodeHttp.request.ClientRequest) =>
    value === undefined || (Array.isArray(value) && value.length === 0)
        ? identity
        : NodeHttp.request.setUrlParam(key, String(value));

export const setBody =
    (
        body: unknown,
        datatype: string
    ): ((
        clientRequest: NodeHttp.request.ClientRequest
    ) => Effect.Effect<never, NodeHttp.body.BodyError, NodeHttp.request.ClientRequest>) =>
    (clientRequest) => {
        if (!body) {
            return Effect.succeed(clientRequest);
        }

        if (datatype === "stream") {
            return Effect.succeed(
                NodeHttp.request.streamBody(clientRequest, body as Stream.Stream<never, never, Uint8Array>)
            );
        }

        const needsSerialization: boolean =
            datatype !== "string" || clientRequest.headers["Content-Type"] === "application/json";

        return needsSerialization
            ? NodeHttp.request.jsonBody(clientRequest, body)
            : Effect.succeed(NodeHttp.request.textBody(clientRequest, (body as unknown as string) || ""));
    };

export const errorHandler = <Tag extends string>(
    toError: new (arguments_: { message: string }) => Cause.YieldableError & { readonly _tag: Tag }
): (<R, A>(
    self: Effect.Effect<
        R,
        NodeHttp.body.BodyError | NodeHttp.error.RequestError | NodeHttp.error.ResponseError | ParseResult.ParseError,
        A
    >
) => Effect.Effect<R, Cause.YieldableError & { readonly _tag: Tag }, A>) =>
    Effect.catchTags({
        ParseError: (parseError) => new toError({ message: `parsing errors\n${parseError.toString()}\n` }),
        BodyError: (bodyError) =>
            new toError({ message: `body error ${bodyError.reason._tag}, ${String(bodyError.reason.error)}` }),
        RequestError: (requestError) =>
            new toError({ message: `request error ${requestError.reason}, ${String(requestError.error)}` }),
        ResponseError: (responseError) =>
            responseError.response.text
                .pipe(
                    Effect.catchTag(
                        "ResponseError",
                        () => new toError({ message: `response error ${responseError.reason}` })
                    )
                )
                .pipe(
                    Effect.flatMap(
                        (text) =>
                            new toError({
                                message: `response error ${responseError.reason}, statusCode=${responseError.response.status} message=${text}`,
                            })
                    )
                ),
    });
