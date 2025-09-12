import { HttpApi, HttpApiClient, HttpApiEndpoint, HttpApiError, HttpApiGroup, type HttpClient } from "@effect/platform";
import { Effect, Schema, type Layer } from "effect";

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
 * @category Tags
 * @see https://docs.docker.com/reference/api/engine/latest/#tag/Distribution
 */
export class Distributions extends Effect.Service<Distributions>()("@the-moby-effect/endpoints/Distributions", {
    accessors: false,
    dependencies: [],

    effect: Effect.gen(function* () {
        const api = HttpApi.make("api").add(DistributionsGroup);
        const client = yield* HttpApiClient.group(api, "distributions");
        const inspect_ = (name: string) => client.inspect({ path: { name } });
        return { inspect: inspect_ };
    }),
}) {}

/**
 * @since 1.0.0
 * @category Layers
 * @see https://docs.docker.com/reference/api/engine/latest/#tag/Distribution
 */
export const DistributionsLayer: Layer.Layer<Distributions, never, HttpClient.HttpClient> = Distributions.Default;
