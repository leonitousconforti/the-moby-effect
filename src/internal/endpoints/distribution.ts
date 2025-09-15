import { HttpApi, HttpApiClient, HttpApiEndpoint, HttpApiError, HttpApiGroup, HttpClient } from "@effect/platform";
import { Effect, Schema, type Layer } from "effect";

import { MobyConnectionOptions } from "../../MobyConnection.js";
import { makeAgnosticHttpClientLayer } from "../../MobyPlatforms.js";
import { RegistryDistributionInspect } from "../generated/index.js";

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
export class DistributionsService extends Effect.Service<DistributionsService>()(
    "@the-moby-effect/endpoints/Distributions",
    {
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
            const inspect_ = (name: string) => client.inspect({ path: { name } });
            return { inspect: inspect_ };
        }),
    }
) {}

/**
 * @since 1.0.0
 * @category Layers
 * @see https://docs.docker.com/reference/api/engine/latest/#tag/Distribution
 */
export const DistributionsLayerLocalSocket: Layer.Layer<DistributionsService, never, HttpClient.HttpClient> =
    DistributionsService.Default;

/**
 * @since 1.0.0
 * @category Layers
 * @see https://docs.docker.com/reference/api/engine/latest/#tag/Distribution
 */
export const DistributionsLayer: Layer.Layer<DistributionsService, never, HttpClient.HttpClient> =
    DistributionsService.DefaultWithoutDependencies;
