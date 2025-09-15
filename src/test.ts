import type { HttpApi, HttpApiEndpoint, HttpApiGroup, HttpApiMiddleware, HttpClientError } from "@effect/platform";
import type { ParseResult, Stream, Types } from "effect";

import { HttpApiClient, HttpClient, HttpClientRequest, HttpClientResponse } from "@effect/platform";
import { Effect, Function, Tuple } from "effect";

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
                  readonly transformClient?: ((client: HttpClient.HttpClient) => HttpClient.HttpClient) | undefined;
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
    > => {
        const transformClient = HttpClient.mapRequest(HttpClientRequest.bodyStream(stream));

        const client = HttpApiClient.endpoint(api, {
            group,
            endpoint,
            httpClient,
            baseUrl: options?.baseUrl,
            transformResponse: options?.transformResponse,
            transformClient: Function.compose(options?.transformClient ?? Function.identity, transformClient),
        });

        return Effect.flatMap(client, (c) => c(request)) as any;
    };

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
                  readonly transformClient?: ((client: HttpClient.HttpClient) => HttpClient.HttpClient) | undefined;
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
                transformClient: options?.transformClient,
                transformResponse: options?.transformResponse,
            });

            const result = client<true>({ ...request, withResponse: true });

            return yield* Function.pipe(
                result,
                Effect.map(Tuple.getSecond),
                HttpClientResponse.stream,
                (x) => x
            ) as any;
        });
