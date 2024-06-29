/**
 * Distributions service
 *
 * @since 1.0.0
 * @see https://docs.docker.com/engine/api/v1.45/#tag/Distribution
 */

import * as PlatformError from "@effect/platform/Error";
import * as HttpBody from "@effect/platform/HttpBody";
import * as HttpClient from "@effect/platform/HttpClient";
import * as HttpClientError from "@effect/platform/HttpClientError";
import * as HttpClientRequest from "@effect/platform/HttpClientRequest";
import * as HttpClientResponse from "@effect/platform/HttpClientResponse";
import * as ParseResult from "@effect/schema/ParseResult";
import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as Layer from "effect/Layer";
import * as Predicate from "effect/Predicate";
import * as Scope from "effect/Scope";

import {
    IMobyConnectionAgent,
    IMobyConnectionAgentImpl,
    MobyConnectionAgent,
    MobyConnectionOptions,
    MobyHttpClientLive,
    getAgent,
} from "../Agent.js";
import { DistributionInspect } from "../Schemas.js";

/**
 * @since 1.0.0
 * @category Errors
 */
export const DistributionsErrorTypeId: unique symbol = Symbol.for("@the-moby-effect/moby/DistributionsError");

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
export class DistributionsError extends PlatformError.RefailError(DistributionsErrorTypeId, "DistributionsError")<{
    method: string;
    error: ParseResult.ParseError | HttpClientError.HttpClientError | HttpBody.HttpBodyError;
}> {
    get message() {
        return `${this.method}: ${super.message}`;
    }
}

/**
 * @since 1.0.0
 * @category Params
 */
export interface DistributionInspectOptions {
    readonly name: string;
}

/**
 * Distributions service
 *
 * @since 1.0.0
 * @category Tags
 */
export interface DistributionsImpl {
    /** Get image information from the registry */
    readonly inspect: (
        options: DistributionInspectOptions
    ) => Effect.Effect<Readonly<DistributionInspect>, DistributionsError, never>;
}

/**
 * @since 1.0.0
 * @category Services
 */
export const make: Effect.Effect<DistributionsImpl, never, IMobyConnectionAgent | HttpClient.HttpClient.Default> =
    Effect.gen(function* () {
        const agent = yield* MobyConnectionAgent;
        const defaultClient = yield* HttpClient.HttpClient;

        const client = defaultClient.pipe(
            HttpClient.mapRequest(HttpClientRequest.prependUrl(`${agent.nodeRequestUrl}/distribution`)),
            HttpClient.filterStatusOk
        );
        const DistributionInspectResponseClient = client.pipe(
            HttpClient.mapEffect(HttpClientResponse.schemaBodyJson(DistributionInspect))
        );

        const inspect_ = (
            options: DistributionInspectOptions
        ): Effect.Effect<Readonly<DistributionInspect>, DistributionsError, never> =>
            Function.pipe(
                HttpClientRequest.get(`/${encodeURIComponent(options.name)}/json`),
                DistributionInspectResponseClient,
                Effect.mapError((error) => new DistributionsError({ method: "inspect", error })),
                Effect.scoped
            );

        return { inspect: inspect_ };
    });

/**
 * @since 1.0.0
 * @category Tags
 */
export interface Distributions {
    readonly _: unique symbol;
}

/**
 * Distributions service
 *
 * @since 1.0.0
 * @category Tags
 */
export const Distributions: Context.Tag<Distributions, DistributionsImpl> = Context.GenericTag<
    Distributions,
    DistributionsImpl
>("@the-moby-effect/moby/Distributions");

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
