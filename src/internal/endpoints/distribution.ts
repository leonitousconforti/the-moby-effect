import { HttpApi, HttpApiClient, HttpApiEndpoint, HttpApiGroup, HttpClient } from "@effect/platform";
import { Effect, Schema, type Layer } from "effect";

import { MobyConnectionOptions } from "../../MobyConnection.js";
import { makeAgnosticHttpClientLayer } from "../../MobyPlatforms.js";
import { RegistryDistributionInspect } from "../generated/index.js";
import { DockerError } from "./circular.ts";
import { InternalServerError, NotFound, Unauthorized } from "./httpApiHacks.ts";

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Distribution/operation/DistributionInspect */
const inspectDistributionEndpoint = HttpApiEndpoint.get("inspect", "/:name/json")
    .setPath(Schema.Struct({ name: Schema.String }))
    .addSuccess(RegistryDistributionInspect, { status: 200 }) // 200 OK
    .addError(Unauthorized) // 401 Unauthorized
    .addError(NotFound); // 404 Name not found

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Distribution */
const DistributionsGroup = HttpApiGroup.make("distributions")
    .add(inspectDistributionEndpoint)
    .addError(InternalServerError) // 500 Server error
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
        const DistributionsError = DockerError.WrapForModule("distributions");
        const client = yield* HttpApiClient.group(DistributionsApi, { group: "distributions", httpClient });
        const inspect_ = (name: string) =>
            Effect.mapError(client.inspect({ path: { name } }), DistributionsError("inspect"));
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
