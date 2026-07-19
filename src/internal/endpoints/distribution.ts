import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as Schema from "effect/Schema";
import * as HttpClient from "effect/unstable/http/HttpClient";
import * as HttpApi from "effect/unstable/httpapi/HttpApi";
import * as HttpApiClient from "effect/unstable/httpapi/HttpApiClient";
import * as HttpApiEndpoint from "effect/unstable/httpapi/HttpApiEndpoint";
import * as HttpApiGroup from "effect/unstable/httpapi/HttpApiGroup";

import { MobyConnectionOptions } from "../../MobyConnection.js";
import { makeAgnosticHttpClientLayer } from "../../MobyPlatforms.js";
import { RegistryDistributionInspect } from "../generated/index.js";
import { DockerError } from "./circular.ts";
import { InternalServerError, NotFound, Unauthorized } from "./errors.ts";

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Distribution/operation/DistributionInspect */
const inspectDistributionEndpoint = HttpApiEndpoint.get("inspect", "/:name/json", {
    params: { name: Schema.String },
    success: RegistryDistributionInspect, // 200 OK
    error: [
        Unauthorized, // 401 Unauthorized
        NotFound, // 404 Name not found
        InternalServerError, // 500 Server error
    ],
});

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Distribution */
const DistributionsGroup = HttpApiGroup.make("distributions").add(inspectDistributionEndpoint).prefix("/distribution");

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
export class Distributions extends Context.Service<Distributions>()("@the-moby-effect/endpoints/Distributions", {
    make: Effect.gen(function* () {
        const httpClient = yield* HttpClient.HttpClient;
        const DistributionsError = DockerError.WrapForModule("distributions");
        const client = yield* HttpApiClient.group(DistributionsApi, { group: "distributions", httpClient });
        const inspect_ = (name: string) =>
            Effect.mapError(client.inspect({ params: { name } }), DistributionsError("inspect"));
        return { inspect: inspect_ };
    }),
}) {}

/**
 * @since 1.0.0
 * @category Layers
 * @see https://docs.docker.com/reference/api/engine/latest/#tag/Distribution
 */
export const DistributionsLayer: Layer.Layer<Distributions, never, HttpClient.HttpClient> = Layer.effect(
    Distributions,
    Distributions.make
);

/**
 * @since 1.0.0
 * @category Layers
 * @see https://docs.docker.com/reference/api/engine/latest/#tag/Distribution
 */
export const DistributionsLayerLocalSocket: Layer.Layer<Distributions, never, HttpClient.HttpClient> =
    DistributionsLayer.pipe(
        Layer.provide(
            makeAgnosticHttpClientLayer(
                MobyConnectionOptions.socket({
                    socketPath: "/var/run/docker.sock",
                })
            )
        )
    );
