import {
    HttpApiClient,
    HttpApiError,
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
import { Effect, Either, Stream, type ParseResult, type Types } from "effect";

import { type MultiplexedSocket, type RawSocket } from "../../MobyDemux.js";
import { responseToStreamingSocketOrFailUnsafe } from "../demux/hijack.js";
import { makeRawSocket } from "../demux/raw.js";

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
    >(
        api: HttpApi.HttpApi<ApiId, Groups, ApiError, ApiR>,
        group: GroupName,
        endpoint: EndpointName,
        httpClient: HttpClient.HttpClient.With<E, R>,
        stream: Stream.Stream<Uint8Array, E2, never>,
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
            const transformClient = HttpClient.mapRequest(HttpClientRequest.bodyStream(stream));

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
    >(
        api: HttpApi.HttpApi<ApiId, Groups, ApiError, ApiR>,
        group: GroupName,
        endpoint: EndpointName,
        httpClient: HttpClient.HttpClient.With<E, R>,
        stream: Stream.Stream<Uint8Array, E2, never>,
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
            const transformClient = HttpClient.mapRequest(HttpClientRequest.bodyStream(stream));

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
        | HttpApiError.BadRequest
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
            const emptyResponse = new Response(undefined, { status: 200 });
            const noopHttpClient = HttpClient.make((request) =>
                Effect.succeed(HttpClientResponse.fromWeb(request, emptyResponse))
            );

            const client = yield* HttpApiClient.endpoint(api, {
                group,
                endpoint,
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
                .pipe(Either.mapLeft((_cause) => new HttpApiError.BadRequest()))
                .pipe(Either.map((url) => url.toString()));

            return yield* Effect.map(Socket.makeWebSocket(wsUrl), makeRawSocket);
        });
