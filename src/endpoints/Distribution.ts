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
import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as Layer from "effect/Layer";
import * as Predicate from "effect/Predicate";

import { RegistryDistributionInspect } from "../generated/index.js";

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
export class DistributionsError extends PlatformError.TypeIdError(DistributionsErrorTypeId, "DistributionsError")<{
    method: string;
    cause: ParseResult.ParseError | HttpClientError.HttpClientError | HttpBody.HttpBodyError;
}> {
    get message() {
        return this.method;
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
    ) => Effect.Effect<Readonly<RegistryDistributionInspect>, DistributionsError, never>;
}

/**
 * @since 1.0.0
 * @category Services
 */
export const make: Effect.Effect<DistributionsImpl, never, HttpClient.HttpClient.Default> = Effect.gen(function* () {
    const contextClient = yield* HttpClient.HttpClient;
    const client = contextClient.pipe(
        HttpClient.mapRequest(HttpClientRequest.prependUrl("/distribution")),
        HttpClient.filterStatusOk
    );

    const inspect_ = (
        options: DistributionInspectOptions
    ): Effect.Effect<Readonly<RegistryDistributionInspect>, DistributionsError, never> =>
        Function.pipe(
            HttpClientRequest.get(`/${encodeURIComponent(options.name)}/json`),
            client,
            HttpClientResponse.schemaBodyJsonScoped(RegistryDistributionInspect),
            Effect.mapError((cause) => new DistributionsError({ method: "inspect", cause })),
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
export class Distributions extends Effect.Tag("@the-moby-effect/endpoints/Distributions")<
    Distributions,
    DistributionsImpl
>() {}

/**
 * Distributions layer that depends on the MobyConnectionAgent
 *
 * @since 1.0.0
 * @category Layers
 */
export const layer: Layer.Layer<Distributions, never, HttpClient.HttpClient.Default> = Layer.effect(
    Distributions,
    make
);
