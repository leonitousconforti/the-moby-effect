/**
 * Distributions service
 *
 * @since 1.0.0
 */

import * as HttpClient from "@effect/platform/HttpClient";
import * as Context from "effect/Context";
import * as Data from "effect/Data";
import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as Layer from "effect/Layer";
import * as Scope from "effect/Scope";

import {
    IMobyConnectionAgent,
    IMobyConnectionAgentImpl,
    MobyConnectionAgent,
    MobyConnectionOptions,
    MobyHttpClientLive,
    getAgent,
} from "./Agent.js";
import { responseErrorHandler } from "./Requests.js";
import { DistributionInspect } from "./Schemas.js";

/**
 * @since 1.0.0
 * @category Errors
 */
export class DistributionsError extends Data.TaggedError("DistributionsError")<{
    method: string;
    message: string;
}> {}

/** @since 1.0.0 */
export interface DistributionInspectOptions {
    /** Image name or id */
    readonly name: string;
}

/**
 * Distributions service
 *
 * @since 1.0.0
 * @category Tags
 */
export interface Distributions {
    /**
     * Get image information from the registry
     *
     * @param name - Image name or id
     */
    readonly inspect: (
        options: DistributionInspectOptions
    ) => Effect.Effect<Readonly<DistributionInspect>, DistributionsError, never>;
}

/**
 * @since 1.0.0
 * @category Services
 */
export const make: Effect.Effect<Distributions, never, IMobyConnectionAgent | HttpClient.client.Client.Default> =
    Effect.gen(function* (_: Effect.Adapter) {
        const agent = yield* _(MobyConnectionAgent);
        const defaultClient = yield* _(HttpClient.client.Client);

        const client = defaultClient.pipe(
            HttpClient.client.mapRequest(HttpClient.request.prependUrl(`${agent.nodeRequestUrl}/distribution`)),
            HttpClient.client.filterStatusOk
        );

        const DistributionInspectResponseClient = client.pipe(
            HttpClient.client.mapEffect(HttpClient.response.schemaBodyJson(DistributionInspect))
        );

        const responseHandler = (method: string) =>
            responseErrorHandler((message) => new DistributionsError({ method, message }));

        const inspect_ = (
            options: DistributionInspectOptions
        ): Effect.Effect<Readonly<DistributionInspect>, DistributionsError, never> =>
            Function.pipe(
                HttpClient.request.get("/{name}/json".replace("{name}", encodeURIComponent(options.name))),
                DistributionInspectResponseClient,
                Effect.catchAll(responseHandler("inspect")),
                Effect.scoped
            );

        return { inspect: inspect_ };
    });

/**
 * Distributions service
 *
 * @since 1.0.0
 * @category Tags
 */
export const Distributions: Context.Tag<Distributions, Distributions> = Context.GenericTag<Distributions>(
    "@the-moby-effect/Distributions"
);

/**
 * Distributions layer that depends on the MobyConnectionAgent
 *
 * @since 1.0.0
 * @category Layers
 */
export const layer: Layer.Layer<Distributions, never, IMobyConnectionAgent> = Layer.effect(Distributions, make).pipe(
    Layer.provide(MobyHttpClientLive)
);

/**
 * Constructs a layer from an agent effect
 *
 * @since 1.0.0
 * @category Layers
 */
export const fromAgent = (
    agent: Effect.Effect<IMobyConnectionAgentImpl, never, Scope.Scope>
): Layer.Layer<Distributions, never, Scope.Scope> =>
    layer.pipe(Layer.provide(Layer.effect(MobyConnectionAgent, agent)));

/**
 * Constructs a layer from agent connection options
 *
 * @since 1.0.0
 * @category Layers
 */
export const fromConnectionOptions = (
    connectionOptions: MobyConnectionOptions
): Layer.Layer<Distributions, never, Scope.Scope> => fromAgent(getAgent(connectionOptions));
