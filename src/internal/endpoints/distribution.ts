import type * as HttpBody from "@effect/platform/HttpBody";
import type * as HttpClientError from "@effect/platform/HttpClientError";
import type * as Layer from "effect/Layer";
import type * as ParseResult from "effect/ParseResult";

import * as PlatformError from "@effect/platform/Error";
import * as HttpClient from "@effect/platform/HttpClient";
import * as HttpClientRequest from "@effect/platform/HttpClientRequest";
import * as HttpClientResponse from "@effect/platform/HttpClientResponse";
import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as Predicate from "effect/Predicate";

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
    cause: ParseResult.ParseError | HttpClientError.HttpClientError | HttpBody.HttpBodyError | unknown;
}> {
    get message() {
        return `${this.method}`;
    }
}

/**
 * @since 1.0.0
 * @category Tags
 * @see https://docs.docker.com/engine/api/v1.45/#tag/Distribution
 */
export class Distributions extends Effect.Service<Distributions>()("@the-moby-effect/endpoints/Distributions", {
    accessors: false,
    dependencies: [],

    effect: Effect.gen(function* () {
        const contextClient = yield* HttpClient.HttpClient;
        const client = contextClient.pipe(HttpClient.filterStatusOk);

        /** @see https://docs.docker.com/reference/api/engine/latest/#tag/Distribution/operation/DistributionInspect */
        const inspect_ = (
            name: string
        ): Effect.Effect<Readonly<RegistryDistributionInspect>, DistributionsError, never> =>
            Function.pipe(
                HttpClientRequest.get(`/distribution/${encodeURIComponent(name)}/json`),
                client.execute,
                Effect.flatMap(HttpClientResponse.schemaBodyJson(RegistryDistributionInspect)),
                Effect.mapError((cause) => new DistributionsError({ method: "inspect", cause }))
            );

        return { inspect: inspect_ };
    }),
}) {}

/**
 * @since 1.0.0
 * @category Layers
 * @see https://docs.docker.com/engine/api/v1.45/#tag/Distribution
 */
export const DistributionsLayer: Layer.Layer<Distributions, never, HttpClient.HttpClient> = Distributions.Default;
