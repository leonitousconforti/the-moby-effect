import {
    HttpApi,
    HttpApiClient,
    HttpApiEndpoint,
    HttpApiError,
    HttpApiGroup,
    HttpClient,
    Error as PlatformError,
    type HttpClientError,
} from "@effect/platform";
import { Effect, Predicate, Schema, type Layer, type ParseResult } from "effect";

import { MobyConnectionOptions } from "../../MobyConnection.js";
import { makeAgnosticHttpClientLayer } from "../../MobyPlatforms.js";
import { RegistryDistributionInspect } from "../generated/index.js";

/**
 * @since 1.0.0
 * @category Errors
 */
export const DistributionsErrorTypeId: unique symbol = Symbol.for(
    "@the-moby-effect/endpoints/DistributionsError"
) as DistributionsErrorTypeId;

/**
 * @since 1.0.0
 * @category Errors
 */
export type DistributionsErrorTypeId = typeof DistributionsErrorTypeId;

/**
 * @since 1.0.0
 * @category Errors
 */
export const isDistributionsError = (u: unknown): u is DistributionsError =>
    Predicate.hasProperty(u, DistributionsErrorTypeId);

/**
 * @since 1.0.0
 * @category Errors
 */
export class DistributionsError extends PlatformError.TypeIdError(DistributionsErrorTypeId, "DistributionsError")<{
    method: string;
    cause:
        | HttpApiError.InternalServerError
        | HttpApiError.Unauthorized
        | HttpApiError.NotFound
        | ParseResult.ParseError
        | HttpClientError.HttpClientError
        | HttpApiError.HttpApiDecodeError;
}> {
    get message() {
        return `${this.method}`;
    }

    static WrapForMethod(method: string) {
        return (cause: DistributionsError["cause"]) => new this({ method, cause });
    }
}

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Distribution/operation/DistributionInspect */
const inspectDistributionEndpoint = HttpApiEndpoint.get("inspect", "/:name/json")
    .setPath(Schema.Struct({ name: Schema.String }))
    .addSuccess(RegistryDistributionInspect, { status: 200 }) // 200 OK
    .addError(HttpApiError.Unauthorized) // 401 Unauthorized
    .addError(HttpApiError.NotFound); // 404 Name not found

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Distribution */
const DistributionsGroup = HttpApiGroup.make("distributions")
    .add(inspectDistributionEndpoint)
    .addError(HttpApiError.InternalServerError) // 500 Server error
    .prefix("/distribution");

/**
 * @since 1.0.0
 * @category HttpApi
 * @see https://docs.docker.com/reference/api/engine/latest/#tag/Distribution
 */
export const DistributionsApi = HttpApi.make("distributions").add(DistributionsGroup);

/**
 * @since 1.0.0
 * @category Services
 * @see https://docs.docker.com/reference/api/engine/latest/#tag/Distribution
 */
export class Distributions extends Effect.Service<Distributions>()("@the-moby-effect/endpoints/Distributions", {
    accessors: false,
    dependencies: [
        makeAgnosticHttpClientLayer(
            MobyConnectionOptions.socket({
                socketPath: "/var/run/docker.sock",
            })
        ),
    ],

    effect: Effect.gen(function* () {
        const httpClient = yield* HttpClient.HttpClient;
        const client = yield* HttpApiClient.group(DistributionsApi, { group: "distributions", httpClient });
        const inspect_ = (name: string) =>
            Effect.mapError(client.inspect({ path: { name } }), DistributionsError.WrapForMethod("inspect"));
        return { inspect: inspect_ };
    }),
}) {}

/**
 * @since 1.0.0
 * @category Layers
 * @see https://docs.docker.com/reference/api/engine/latest/#tag/Distribution
 */
export const DistributionsLayerLocalSocket: Layer.Layer<Distributions, never, HttpClient.HttpClient> =
    Distributions.Default;

/**
 * @since 1.0.0
 * @category Layers
 * @see https://docs.docker.com/reference/api/engine/latest/#tag/Distribution
 */
export const DistributionsLayer: Layer.Layer<Distributions, never, HttpClient.HttpClient> =
    Distributions.DefaultWithoutDependencies;
