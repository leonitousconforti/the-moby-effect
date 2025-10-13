import {
    HttpApiClient,
    HttpApiSchema,
    HttpClient,
    HttpClientRequest,
    HttpClientResponse,
    Socket,
    UrlParams,
    type HttpApi,
    type HttpApiEndpoint,
    type HttpApiGroup,
    type HttpApiMiddleware,
    type HttpClientError,
} from "@effect/platform";
import {
    Effect,
    Effectable,
    Either,
    Function,
    Predicate,
    Schema,
    Stream,
    String,
    type ParseResult,
    type Types,
} from "effect";

import { type MultiplexedSocket, type RawSocket } from "../../MobyDemux.js";
import { hijackResponseUnsafe, responseToStreamingSocketOrFailUnsafe } from "../demux/hijack.js";
import { makeRawSocket } from "../demux/raw.js";

/** @internal */
export interface EmptyErrorClass<Self, Tag> extends Schema.Schema<Self, { message: string }> {
    new (message: string): { readonly _tag: Tag; readonly message: string } & Effect.Effect<never, Self>;
}

/** @internal */
export const EmptyError =
    <Self>() =>
    <const Tag extends string>(options: { readonly tag: Tag; readonly status: number }): EmptyErrorClass<Self, Tag> => {
        const symbol = Symbol.for(`@effect/platform/HttpApiSchema/EmptyError/${options.tag}`);
        class EmptyError extends Effectable.StructuralClass<never, Self> {
            readonly _tag: Tag = options.tag;
            readonly message?: string | undefined;

            constructor(message?: string | undefined) {
                super();
                this.message = message;
            }

            commit(): Effect.Effect<never, Self> {
                return Effect.fail(this) as any;
            }
        }
        Object.assign(EmptyError, {
            [Schema.TypeId]: Schema.Struct({ message: Schema.String })[Schema.TypeId],
            pipe: Schema.Struct({ message: Schema.String }).pipe,
            annotations(this: any, annotations: any) {
                return Schema.make(this.ast).annotations(annotations);
            },
        });
        (EmptyError as any).prototype[symbol] = symbol;
        let transform: Schema.Schema.Any | undefined;
        Object.defineProperty(EmptyError, "ast", {
            get() {
                if (transform) {
                    return transform.ast;
                }
                const self = this as any;
                transform = Schema.transform(
                    Schema.Struct({
                        message: Schema.String.pipe(Schema.optional),
                    }).annotations({
                        identifier: options.tag,
                        title: options.tag,
                    }),
                    Schema.typeSchema(Schema.declare((u) => Predicate.hasProperty(u, symbol))),
                    {
                        encode: Function.constant({}),
                        decode: ({ message }) => new self(message),
                    }
                ).annotations(
                    HttpApiSchema.annotations({
                        status: options.status,
                        [HttpApiSchema.AnnotationEmptyDecodeable]: true,
                    })
                );
                return transform.ast;
            },
        });
        return EmptyError as any;
    };

/**
 * @since 1.0.0
 * @category Empty errors
 */
export class BadRequest extends EmptyError<BadRequest>()({
    tag: "BadRequest",
    status: 400,
}) {}

/**
 * @since 1.0.0
 * @category Empty errors
 */
export class Unauthorized extends EmptyError<Unauthorized>()({
    tag: "Unauthorized",
    status: 401,
}) {}

/**
 * @since 1.0.0
 * @category Empty errors
 */
export class Forbidden extends EmptyError<Forbidden>()({
    tag: "Forbidden",
    status: 403,
}) {}

/**
 * @since 1.0.0
 * @category Empty errors
 */
export class NotFound extends EmptyError<NotFound>()({
    tag: "NotFound",
    status: 404,
}) {}

/**
 * @since 1.0.0
 * @category Empty errors
 */
export class MethodNotAllowed extends EmptyError<MethodNotAllowed>()({
    tag: "MethodNotAllowed",
    status: 405,
}) {}

/**
 * @since 1.0.0
 * @category Empty errors
 */
export class NotAcceptable extends EmptyError<NotAcceptable>()({
    tag: "NotAcceptable",
    status: 406,
}) {}

/**
 * @since 1.0.0
 * @category Empty errors
 */
export class RequestTimeout extends EmptyError<RequestTimeout>()({
    tag: "RequestTimeout",
    status: 408,
}) {}

/**
 * @since 1.0.0
 * @category Empty errors
 */
export class Conflict extends EmptyError<Conflict>()({
    tag: "Conflict",
    status: 409,
}) {}

/**
 * @since 1.0.0
 * @category Empty errors
 */
export class Gone extends EmptyError<Gone>()({
    tag: "Gone",
    status: 410,
}) {}

/**
 * @since 1.0.0
 * @category Empty errors
 */
export class InternalServerError extends EmptyError<InternalServerError>()({
    tag: "InternalServerError",
    status: 500,
}) {}

/**
 * @since 1.0.0
 * @category Empty errors
 */
export class NotImplemented extends EmptyError<NotImplemented>()({
    tag: "NotImplemented",
    status: 501,
}) {}

/**
 * @since 1.0.0
 * @category Empty errors
 */
export class ServiceUnavailable extends EmptyError<ServiceUnavailable>()({
    tag: "ServiceUnavailable",
    status: 503,
}) {}

/** @internal */
export const HttpApiStreamingRequest =
    <
        ApiId extends string,
        Groups extends HttpApiGroup.HttpApiGroup.Any,
        ApiError,
        ApiR,
        const GroupName extends HttpApiGroup.HttpApiGroup.Name<Groups>,
        const EndpointName extends HttpApiEndpoint.HttpApiEndpoint.Name<
            HttpApiGroup.HttpApiGroup.EndpointsWithName<Groups, GroupName>
        >,
        E,
        E2,
        R,
        R2,
    >(
        api: HttpApi.HttpApi<ApiId, Groups, ApiError, ApiR>,
        group: GroupName,
        endpoint: EndpointName,
        httpClient: HttpClient.HttpClient.With<E, R>,
        stream: Stream.Stream<Uint8Array, E2, R2>,
        options?:
            | {
                  readonly baseUrl?: URL | string | undefined;
                  readonly transformResponse?:
                      | ((effect: Effect.Effect<unknown, unknown>) => Effect.Effect<unknown, unknown>)
                      | undefined;
              }
            | undefined
    ) =>
    <WithResponse extends boolean = false>(
        request: [
            HttpApiEndpoint.HttpApiEndpoint.WithName<
                HttpApiGroup.HttpApiGroup.Endpoints<HttpApiGroup.HttpApiGroup.WithName<Groups, GroupName>>,
                EndpointName
            >,
        ] extends [
            HttpApiEndpoint.HttpApiEndpoint<
                infer _Name,
                infer _Method,
                infer _Path,
                infer _UrlParams,
                infer _Payload,
                infer _Headers,
                infer _Success,
                infer _Error,
                infer _R,
                infer _RE
            >,
        ]
            ? Types.Simplify<
                  HttpApiEndpoint.HttpApiEndpoint.ClientRequest<_Path, _UrlParams, _Payload, _Headers, WithResponse>
              >
            : never
    ): Effect.Effect<
        WithResponse extends true
            ? [
                  HttpApiEndpoint.HttpApiEndpoint.Success<
                      HttpApiEndpoint.HttpApiEndpoint.WithName<
                          HttpApiGroup.HttpApiGroup.Endpoints<HttpApiGroup.HttpApiGroup.WithName<Groups, GroupName>>,
                          EndpointName
                      >
                  >,
                  HttpClientResponse.HttpClientResponse,
              ]
            : HttpApiEndpoint.HttpApiEndpoint.Success<
                  HttpApiEndpoint.HttpApiEndpoint.WithName<
                      HttpApiGroup.HttpApiGroup.Endpoints<HttpApiGroup.HttpApiGroup.WithName<Groups, GroupName>>,
                      EndpointName
                  >
              >,
        | HttpApiEndpoint.HttpApiEndpoint.Error<
              HttpApiEndpoint.HttpApiEndpoint.WithName<
                  HttpApiGroup.HttpApiGroup.Endpoints<HttpApiGroup.HttpApiGroup.WithName<Groups, GroupName>>,
                  EndpointName
              >
          >
        | HttpApiGroup.HttpApiGroup.Error<HttpApiGroup.HttpApiGroup.WithName<Groups, GroupName>>
        | ApiError
        | E
        | HttpClientError.HttpClientError
        | ParseResult.ParseError,
        | R
        | R2
        | HttpApiMiddleware.HttpApiMiddleware.Without<
              | ApiR
              | HttpApiGroup.HttpApiGroup.Context<HttpApiGroup.HttpApiGroup.WithName<Groups, GroupName>>
              | HttpApiEndpoint.HttpApiEndpoint.ContextWithName<
                    HttpApiGroup.HttpApiGroup.EndpointsWithName<Groups, GroupName>,
                    EndpointName
                >
              | HttpApiEndpoint.HttpApiEndpoint.ErrorContextWithName<
                    HttpApiGroup.HttpApiGroup.EndpointsWithName<Groups, GroupName>,
                    EndpointName
                >
          >
    > =>
        Effect.gen(function* () {
            const context = yield* Effect.context<R2>();
            const streamWithContext = Stream.provideContext(stream, context);
            const transformClient = HttpClient.mapRequest(HttpClientRequest.bodyStream(streamWithContext));

            const client = yield* HttpApiClient.endpoint(api, {
                group,
                endpoint,
                baseUrl: options?.baseUrl,
                httpClient: transformClient(httpClient),
                transformResponse: options?.transformResponse,
            });

            const response = client(request) as Effect.Effect<
                WithResponse extends true
                    ? [
                          HttpApiEndpoint.HttpApiEndpoint.Success<
                              HttpApiEndpoint.HttpApiEndpoint.WithName<
                                  HttpApiGroup.HttpApiGroup.Endpoints<
                                      HttpApiGroup.HttpApiGroup.WithName<Groups, GroupName>
                                  >,
                                  EndpointName
                              >
                          >,
                          HttpClientResponse.HttpClientResponse,
                      ]
                    : HttpApiEndpoint.HttpApiEndpoint.Success<
                          HttpApiEndpoint.HttpApiEndpoint.WithName<
                              HttpApiGroup.HttpApiGroup.Endpoints<
                                  HttpApiGroup.HttpApiGroup.WithName<Groups, GroupName>
                              >,
                              EndpointName
                          >
                      >,
                | HttpApiEndpoint.HttpApiEndpoint.Error<
                      HttpApiEndpoint.HttpApiEndpoint.WithName<
                          HttpApiGroup.HttpApiGroup.Endpoints<HttpApiGroup.HttpApiGroup.WithName<Groups, GroupName>>,
                          EndpointName
                      >
                  >
                | HttpApiGroup.HttpApiGroup.Error<HttpApiGroup.HttpApiGroup.WithName<Groups, GroupName>>
                | ApiError
                | E
                | HttpClientError.HttpClientError
                | ParseResult.ParseError,
                R
            >;

            return yield* response;
        });

/** @internal */
export const HttpApiStreamingResponse =
    <
        ApiId extends string,
        Groups extends HttpApiGroup.HttpApiGroup.Any,
        ApiError,
        ApiR,
        const GroupName extends HttpApiGroup.HttpApiGroup.Name<Groups>,
        const EndpointName extends HttpApiEndpoint.HttpApiEndpoint.Name<
            HttpApiGroup.HttpApiGroup.EndpointsWithName<Groups, GroupName>
        >,
        E,
        R,
    >(
        api: HttpApi.HttpApi<ApiId, Groups, ApiError, ApiR>,
        group: GroupName,
        endpoint: EndpointName,
        httpClient: HttpClient.HttpClient.With<E, R>,
        options?:
            | {
                  readonly baseUrl?: URL | string | undefined;
                  readonly transformResponse?:
                      | ((effect: Effect.Effect<unknown, unknown>) => Effect.Effect<unknown, unknown>)
                      | undefined;
              }
            | undefined
    ) =>
    (
        request: [
            HttpApiEndpoint.HttpApiEndpoint.WithName<
                HttpApiGroup.HttpApiGroup.Endpoints<HttpApiGroup.HttpApiGroup.WithName<Groups, GroupName>>,
                EndpointName
            >,
        ] extends [
            HttpApiEndpoint.HttpApiEndpoint<
                infer _Name,
                infer _Method,
                infer _Path,
                infer _UrlParams,
                infer _Payload,
                infer _Headers,
                infer _Success,
                infer _Error,
                infer _R,
                infer _RE
            >,
        ]
            ? Types.Simplify<
                  HttpApiEndpoint.HttpApiEndpoint.ClientRequest<_Path, _UrlParams, _Payload, _Headers, false>
              >
            : never
    ): Stream.Stream<
        Uint8Array,
        | HttpApiEndpoint.HttpApiEndpoint.Error<
              HttpApiEndpoint.HttpApiEndpoint.WithName<
                  HttpApiGroup.HttpApiGroup.Endpoints<HttpApiGroup.HttpApiGroup.WithName<Groups, GroupName>>,
                  EndpointName
              >
          >
        | HttpApiGroup.HttpApiGroup.Error<HttpApiGroup.HttpApiGroup.WithName<Groups, GroupName>>
        | ApiError
        | E
        | HttpClientError.HttpClientError
        | ParseResult.ParseError,
        | R
        | HttpApiMiddleware.HttpApiMiddleware.Without<
              | ApiR
              | HttpApiGroup.HttpApiGroup.Context<HttpApiGroup.HttpApiGroup.WithName<Groups, GroupName>>
              | HttpApiEndpoint.HttpApiEndpoint.ContextWithName<
                    HttpApiGroup.HttpApiGroup.EndpointsWithName<Groups, GroupName>,
                    EndpointName
                >
              | HttpApiEndpoint.HttpApiEndpoint.ErrorContextWithName<
                    HttpApiGroup.HttpApiGroup.EndpointsWithName<Groups, GroupName>,
                    EndpointName
                >
          >
    > =>
        Effect.gen(function* () {
            const client = yield* HttpApiClient.endpoint(api, {
                group,
                endpoint,
                httpClient,
                baseUrl: options?.baseUrl,
                transformResponse: options?.transformResponse,
            });

            const [_, response] = yield* client({ ...request, withResponse: true }) as Effect.Effect<
                [
                    HttpApiEndpoint.HttpApiEndpoint.Success<
                        HttpApiEndpoint.HttpApiEndpoint.WithName<
                            HttpApiGroup.HttpApiGroup.Endpoints<HttpApiGroup.HttpApiGroup.WithName<Groups, GroupName>>,
                            EndpointName
                        >
                    >,
                    HttpClientResponse.HttpClientResponse,
                ],
                | HttpApiEndpoint.HttpApiEndpoint.Error<
                      HttpApiEndpoint.HttpApiEndpoint.WithName<
                          HttpApiGroup.HttpApiGroup.Endpoints<HttpApiGroup.HttpApiGroup.WithName<Groups, GroupName>>,
                          EndpointName
                      >
                  >
                | HttpApiGroup.HttpApiGroup.Error<HttpApiGroup.HttpApiGroup.WithName<Groups, GroupName>>
                | ApiError
                | E
                | HttpClientError.HttpClientError
                | ParseResult.ParseError,
                R
            >;

            return response.stream;
        }).pipe(Stream.unwrap);

/** @internal */
export const HttpApiStreamingBoth =
    <
        ApiId extends string,
        Groups extends HttpApiGroup.HttpApiGroup.Any,
        ApiError,
        ApiR,
        const GroupName extends HttpApiGroup.HttpApiGroup.Name<Groups>,
        const EndpointName extends HttpApiEndpoint.HttpApiEndpoint.Name<
            HttpApiGroup.HttpApiGroup.EndpointsWithName<Groups, GroupName>
        >,
        E,
        E2,
        R,
        R2,
    >(
        api: HttpApi.HttpApi<ApiId, Groups, ApiError, ApiR>,
        group: GroupName,
        endpoint: EndpointName,
        httpClient: HttpClient.HttpClient.With<E, R>,
        stream: Stream.Stream<Uint8Array, E2, R2>,
        options?:
            | {
                  readonly baseUrl?: URL | string | undefined;
                  readonly transformResponse?:
                      | ((effect: Effect.Effect<unknown, unknown>) => Effect.Effect<unknown, unknown>)
                      | undefined;
              }
            | undefined
    ) =>
    (
        request: [
            HttpApiEndpoint.HttpApiEndpoint.WithName<
                HttpApiGroup.HttpApiGroup.Endpoints<HttpApiGroup.HttpApiGroup.WithName<Groups, GroupName>>,
                EndpointName
            >,
        ] extends [
            HttpApiEndpoint.HttpApiEndpoint<
                infer _Name,
                infer _Method,
                infer _Path,
                infer _UrlParams,
                infer _Payload,
                infer _Headers,
                infer _Success,
                infer _Error,
                infer _R,
                infer _RE
            >,
        ]
            ? Types.Simplify<
                  HttpApiEndpoint.HttpApiEndpoint.ClientRequest<_Path, _UrlParams, _Payload, _Headers, false>
              >
            : never
    ): Stream.Stream<
        Uint8Array,
        | HttpApiEndpoint.HttpApiEndpoint.Error<
              HttpApiEndpoint.HttpApiEndpoint.WithName<
                  HttpApiGroup.HttpApiGroup.Endpoints<HttpApiGroup.HttpApiGroup.WithName<Groups, GroupName>>,
                  EndpointName
              >
          >
        | HttpApiGroup.HttpApiGroup.Error<HttpApiGroup.HttpApiGroup.WithName<Groups, GroupName>>
        | ApiError
        | E
        | HttpClientError.HttpClientError
        | ParseResult.ParseError,
        | R
        | R2
        | HttpApiMiddleware.HttpApiMiddleware.Without<
              | ApiR
              | HttpApiGroup.HttpApiGroup.Context<HttpApiGroup.HttpApiGroup.WithName<Groups, GroupName>>
              | HttpApiEndpoint.HttpApiEndpoint.ContextWithName<
                    HttpApiGroup.HttpApiGroup.EndpointsWithName<Groups, GroupName>,
                    EndpointName
                >
              | HttpApiEndpoint.HttpApiEndpoint.ErrorContextWithName<
                    HttpApiGroup.HttpApiGroup.EndpointsWithName<Groups, GroupName>,
                    EndpointName
                >
          >
    > =>
        Effect.gen(function* () {
            const context = yield* Effect.context<R2>();
            const streamWithContext = Stream.provideContext(stream, context);
            const transformClient = HttpClient.mapRequest(HttpClientRequest.bodyStream(streamWithContext));

            const client = yield* HttpApiClient.endpoint(api, {
                group,
                endpoint,
                baseUrl: options?.baseUrl,
                httpClient: transformClient(httpClient),
                transformResponse: options?.transformResponse,
            });

            const [_, response] = yield* client({ ...request, withResponse: true }) as Effect.Effect<
                [
                    HttpApiEndpoint.HttpApiEndpoint.Success<
                        HttpApiEndpoint.HttpApiEndpoint.WithName<
                            HttpApiGroup.HttpApiGroup.Endpoints<HttpApiGroup.HttpApiGroup.WithName<Groups, GroupName>>,
                            EndpointName
                        >
                    >,
                    HttpClientResponse.HttpClientResponse,
                ],
                | HttpApiEndpoint.HttpApiEndpoint.Error<
                      HttpApiEndpoint.HttpApiEndpoint.WithName<
                          HttpApiGroup.HttpApiGroup.Endpoints<HttpApiGroup.HttpApiGroup.WithName<Groups, GroupName>>,
                          EndpointName
                      >
                  >
                | HttpApiGroup.HttpApiGroup.Error<HttpApiGroup.HttpApiGroup.WithName<Groups, GroupName>>
                | ApiError
                | E
                | HttpClientError.HttpClientError
                | ParseResult.ParseError,
                R
            >;

            return response.stream;
        }).pipe(Stream.unwrap);

/** @internal */
export const HttpApiTcp =
    <
        ApiId extends string,
        Groups extends HttpApiGroup.HttpApiGroup.Any,
        ApiError,
        ApiR,
        const GroupName extends HttpApiGroup.HttpApiGroup.Name<Groups>,
        const EndpointName extends HttpApiEndpoint.HttpApiEndpoint.Name<
            HttpApiGroup.HttpApiGroup.EndpointsWithName<Groups, GroupName>
        >,
        E,
        R,
    >(
        api: HttpApi.HttpApi<ApiId, Groups, ApiError, ApiR>,
        group: GroupName,
        endpoint: EndpointName,
        httpClient: HttpClient.HttpClient.With<E, R>,
        options?:
            | {
                  readonly baseUrl?: URL | string | undefined;
                  readonly transformResponse?:
                      | ((effect: Effect.Effect<unknown, unknown>) => Effect.Effect<unknown, unknown>)
                      | undefined;
              }
            | undefined
    ) =>
    (
        request: [
            HttpApiEndpoint.HttpApiEndpoint.WithName<
                HttpApiGroup.HttpApiGroup.Endpoints<HttpApiGroup.HttpApiGroup.WithName<Groups, GroupName>>,
                EndpointName
            >,
        ] extends [
            HttpApiEndpoint.HttpApiEndpoint<
                infer _Name,
                infer _Method,
                infer _Path,
                infer _UrlParams,
                infer _Payload,
                infer _Headers,
                infer _Success,
                infer _Error,
                infer _R,
                infer _RE
            >,
        ]
            ? Types.Simplify<
                  HttpApiEndpoint.HttpApiEndpoint.ClientRequest<_Path, _UrlParams, _Payload, _Headers, false>
              >
            : never
    ): Effect.Effect<
        Socket.Socket,
        | HttpApiEndpoint.HttpApiEndpoint.Error<
              HttpApiEndpoint.HttpApiEndpoint.WithName<
                  HttpApiGroup.HttpApiGroup.Endpoints<HttpApiGroup.HttpApiGroup.WithName<Groups, GroupName>>,
                  EndpointName
              >
          >
        | HttpApiGroup.HttpApiGroup.Error<HttpApiGroup.HttpApiGroup.WithName<Groups, GroupName>>
        | ApiError
        | E
        | HttpClientError.HttpClientError
        | ParseResult.ParseError
        | Socket.SocketError,
        | R
        | HttpApiMiddleware.HttpApiMiddleware.Without<
              | ApiR
              | HttpApiGroup.HttpApiGroup.Context<HttpApiGroup.HttpApiGroup.WithName<Groups, GroupName>>
              | HttpApiEndpoint.HttpApiEndpoint.ContextWithName<
                    HttpApiGroup.HttpApiGroup.EndpointsWithName<Groups, GroupName>,
                    EndpointName
                >
              | HttpApiEndpoint.HttpApiEndpoint.ErrorContextWithName<
                    HttpApiGroup.HttpApiGroup.EndpointsWithName<Groups, GroupName>,
                    EndpointName
                >
          >
    > =>
        Effect.gen(function* () {
            const client = yield* HttpApiClient.endpoint(api, {
                group,
                endpoint,
                httpClient,
                baseUrl: options?.baseUrl,
                transformResponse: options?.transformResponse,
            });

            const [_, response] = yield* client({ ...request, withResponse: true }) as Effect.Effect<
                [
                    HttpApiEndpoint.HttpApiEndpoint.Success<
                        HttpApiEndpoint.HttpApiEndpoint.WithName<
                            HttpApiGroup.HttpApiGroup.Endpoints<HttpApiGroup.HttpApiGroup.WithName<Groups, GroupName>>,
                            EndpointName
                        >
                    >,
                    HttpClientResponse.HttpClientResponse,
                ],
                | HttpApiEndpoint.HttpApiEndpoint.Error<
                      HttpApiEndpoint.HttpApiEndpoint.WithName<
                          HttpApiGroup.HttpApiGroup.Endpoints<HttpApiGroup.HttpApiGroup.WithName<Groups, GroupName>>,
                          EndpointName
                      >
                  >
                | HttpApiGroup.HttpApiGroup.Error<HttpApiGroup.HttpApiGroup.WithName<Groups, GroupName>>
                | ApiError
                | E
                | HttpClientError.HttpClientError
                | ParseResult.ParseError,
                R
            >;

            return yield* hijackResponseUnsafe(response);
        });

/** @internal */
export const HttpApiSocket =
    <
        ApiId extends string,
        Groups extends HttpApiGroup.HttpApiGroup.Any,
        ApiError,
        ApiR,
        const GroupName extends HttpApiGroup.HttpApiGroup.Name<Groups>,
        const EndpointName extends HttpApiEndpoint.HttpApiEndpoint.Name<
            HttpApiGroup.HttpApiGroup.EndpointsWithName<Groups, GroupName>
        >,
        E,
        R,
    >(
        api: HttpApi.HttpApi<ApiId, Groups, ApiError, ApiR>,
        group: GroupName,
        endpoint: EndpointName,
        httpClient: HttpClient.HttpClient.With<E, R>,
        options?:
            | {
                  readonly baseUrl?: URL | string | undefined;
                  readonly transformResponse?:
                      | ((effect: Effect.Effect<unknown, unknown>) => Effect.Effect<unknown, unknown>)
                      | undefined;
              }
            | undefined
    ) =>
    (
        request: [
            HttpApiEndpoint.HttpApiEndpoint.WithName<
                HttpApiGroup.HttpApiGroup.Endpoints<HttpApiGroup.HttpApiGroup.WithName<Groups, GroupName>>,
                EndpointName
            >,
        ] extends [
            HttpApiEndpoint.HttpApiEndpoint<
                infer _Name,
                infer _Method,
                infer _Path,
                infer _UrlParams,
                infer _Payload,
                infer _Headers,
                infer _Success,
                infer _Error,
                infer _R,
                infer _RE
            >,
        ]
            ? Types.Simplify<
                  HttpApiEndpoint.HttpApiEndpoint.ClientRequest<_Path, _UrlParams, _Payload, _Headers, false>
              >
            : never
    ): Effect.Effect<
        RawSocket | MultiplexedSocket,
        | HttpApiEndpoint.HttpApiEndpoint.Error<
              HttpApiEndpoint.HttpApiEndpoint.WithName<
                  HttpApiGroup.HttpApiGroup.Endpoints<HttpApiGroup.HttpApiGroup.WithName<Groups, GroupName>>,
                  EndpointName
              >
          >
        | HttpApiGroup.HttpApiGroup.Error<HttpApiGroup.HttpApiGroup.WithName<Groups, GroupName>>
        | ApiError
        | E
        | HttpClientError.HttpClientError
        | ParseResult.ParseError
        | Socket.SocketError,
        | R
        | HttpApiMiddleware.HttpApiMiddleware.Without<
              | ApiR
              | HttpApiGroup.HttpApiGroup.Context<HttpApiGroup.HttpApiGroup.WithName<Groups, GroupName>>
              | HttpApiEndpoint.HttpApiEndpoint.ContextWithName<
                    HttpApiGroup.HttpApiGroup.EndpointsWithName<Groups, GroupName>,
                    EndpointName
                >
              | HttpApiEndpoint.HttpApiEndpoint.ErrorContextWithName<
                    HttpApiGroup.HttpApiGroup.EndpointsWithName<Groups, GroupName>,
                    EndpointName
                >
          >
    > =>
        Effect.gen(function* () {
            const client = yield* HttpApiClient.endpoint(api, {
                group,
                endpoint,
                httpClient,
                baseUrl: options?.baseUrl,
                transformResponse: options?.transformResponse,
            });

            const [_, response] = yield* client({ ...request, withResponse: true }) as Effect.Effect<
                [
                    HttpApiEndpoint.HttpApiEndpoint.Success<
                        HttpApiEndpoint.HttpApiEndpoint.WithName<
                            HttpApiGroup.HttpApiGroup.Endpoints<HttpApiGroup.HttpApiGroup.WithName<Groups, GroupName>>,
                            EndpointName
                        >
                    >,
                    HttpClientResponse.HttpClientResponse,
                ],
                | HttpApiEndpoint.HttpApiEndpoint.Error<
                      HttpApiEndpoint.HttpApiEndpoint.WithName<
                          HttpApiGroup.HttpApiGroup.Endpoints<HttpApiGroup.HttpApiGroup.WithName<Groups, GroupName>>,
                          EndpointName
                      >
                  >
                | HttpApiGroup.HttpApiGroup.Error<HttpApiGroup.HttpApiGroup.WithName<Groups, GroupName>>
                | ApiError
                | E
                | HttpClientError.HttpClientError
                | ParseResult.ParseError,
                R
            >;

            return yield* responseToStreamingSocketOrFailUnsafe(response);
        });

/** @internal */
export const HttpApiWebsocket =
    <
        ApiId extends string,
        Groups extends HttpApiGroup.HttpApiGroup.Any,
        ApiError,
        ApiR,
        const GroupName extends HttpApiGroup.HttpApiGroup.Name<Groups>,
        const EndpointName extends HttpApiEndpoint.HttpApiEndpoint.Name<
            HttpApiGroup.HttpApiGroup.EndpointsWithName<Groups, GroupName>
        >,
    >(
        api: HttpApi.HttpApi<ApiId, Groups, ApiError, ApiR>,
        group: GroupName,
        endpoint: EndpointName
    ) =>
    (
        request: [
            HttpApiEndpoint.HttpApiEndpoint.WithName<
                HttpApiGroup.HttpApiGroup.Endpoints<HttpApiGroup.HttpApiGroup.WithName<Groups, GroupName>>,
                EndpointName
            >,
        ] extends [
            HttpApiEndpoint.HttpApiEndpoint<
                infer _Name,
                infer _Method,
                infer _Path,
                infer _UrlParams,
                infer _Payload,
                infer _Headers,
                infer _Success,
                infer _Error,
                infer _R,
                infer _RE
            >,
        ]
            ? Types.Simplify<
                  HttpApiEndpoint.HttpApiEndpoint.ClientRequest<_Path, _UrlParams, _Payload, _Headers, false>
              >
            : never
    ): Effect.Effect<
        RawSocket,
        | HttpApiEndpoint.HttpApiEndpoint.Error<
              HttpApiEndpoint.HttpApiEndpoint.WithName<
                  HttpApiGroup.HttpApiGroup.Endpoints<HttpApiGroup.HttpApiGroup.WithName<Groups, GroupName>>,
                  EndpointName
              >
          >
        | HttpApiGroup.HttpApiGroup.Error<HttpApiGroup.HttpApiGroup.WithName<Groups, GroupName>>
        | ApiError
        | HttpClientError.HttpClientError
        | ParseResult.ParseError
        | BadRequest
        | Socket.SocketError,
        | Socket.WebSocketConstructor
        | HttpApiMiddleware.HttpApiMiddleware.Without<
              | ApiR
              | HttpApiGroup.HttpApiGroup.Context<HttpApiGroup.HttpApiGroup.WithName<Groups, GroupName>>
              | HttpApiEndpoint.HttpApiEndpoint.ContextWithName<
                    HttpApiGroup.HttpApiGroup.EndpointsWithName<Groups, GroupName>,
                    EndpointName
                >
              | HttpApiEndpoint.HttpApiEndpoint.ErrorContextWithName<
                    HttpApiGroup.HttpApiGroup.EndpointsWithName<Groups, GroupName>,
                    EndpointName
                >
          >
    > =>
        Effect.gen(function* () {
            const baseUrl = "ws://0.0.0.0";
            const stripBaseUrl = String.replace(baseUrl, String.empty);
            const emptyResponse = new Response(undefined, { status: 200 });
            const noopHttpClient = HttpClient.make((request) =>
                Effect.succeed(HttpClientResponse.fromWeb(request, emptyResponse))
            );

            const client = yield* HttpApiClient.endpoint(api, {
                group,
                endpoint,
                baseUrl,
                httpClient: noopHttpClient,
            });

            const [_, response] = yield* client({ ...request, withResponse: true }) as Effect.Effect<
                [never, HttpClientResponse.HttpClientResponse],
                | HttpApiEndpoint.HttpApiEndpoint.Error<
                      HttpApiEndpoint.HttpApiEndpoint.WithName<
                          HttpApiGroup.HttpApiGroup.Endpoints<HttpApiGroup.HttpApiGroup.WithName<Groups, GroupName>>,
                          EndpointName
                      >
                  >
                | HttpApiGroup.HttpApiGroup.Error<HttpApiGroup.HttpApiGroup.WithName<Groups, GroupName>>
                | ApiError
                | HttpClientError.HttpClientError
                | ParseResult.ParseError,
                never
            >;

            const { hash, url, urlParams } = response.request;
            const wsUrl = yield* UrlParams.makeUrl(url, urlParams, hash)
                .pipe(Either.mapLeft((_cause) => new BadRequest("Cannot construct WebSocket URL")))
                .pipe(Either.map((url) => url.toString()))
                .pipe(Effect.map(stripBaseUrl));

            return yield* Effect.map(Socket.makeWebSocket(wsUrl), makeRawSocket);
        });
