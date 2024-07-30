/**
 * Swarms service
 *
 * @since 1.0.0
 */

import * as PlatformError from "@effect/platform/Error";
import * as HttpBody from "@effect/platform/HttpBody";
import * as HttpClient from "@effect/platform/HttpClient";
import * as HttpClientError from "@effect/platform/HttpClientError";
import * as HttpClientRequest from "@effect/platform/HttpClientRequest";
import * as HttpClientResponse from "@effect/platform/HttpClientResponse";
import * as ParseResult from "@effect/schema/ParseResult";
import * as Schema from "@effect/schema/Schema";
import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as Layer from "effect/Layer";
import * as Option from "effect/Option";
import * as Predicate from "effect/Predicate";
import * as Tuple from "effect/Tuple";

import {
    Swarm as SwarmData,
    SwarmInitRequest,
    SwarmJoinRequest,
    SwarmSpec,
    SwarmUnlockKeyResponse,
    SwarmUnlockRequest,
} from "../generated/index.js";
import { maybeAddQueryParameter } from "./Common.js";

/**
 * @since 1.0.0
 * @category Errors
 */
export const SwarmsErrorTypeId: unique symbol = Symbol.for("@the-moby-effect/moby/SwarmsError");

/**
 * @since 1.0.0
 * @category Errors
 */
export type SwarmsErrorTypeId = typeof SwarmsErrorTypeId;

/**
 * @since 1.0.0
 * @category Errors
 */
export const isSwarmsError = (u: unknown): u is SwarmsError => Predicate.hasProperty(u, SwarmsErrorTypeId);

/**
 * @since 1.0.0
 * @category Errors
 */
export class SwarmsError extends PlatformError.TypeIdError(SwarmsErrorTypeId, "SwarmsError")<{
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
export interface SwarmLeaveOptions {
    /**
     * Force leave swarm, even if this is the last manager or that it will break
     * the cluster.
     */
    readonly force?: boolean;
}

/**
 * @since 1.0.0
 * @category Params
 */
export interface SwarmUpdateOptions {
    readonly spec: SwarmSpec;
    /**
     * The version number of the swarm object being updated. This is required to
     * avoid conflicting writes.
     */
    readonly version: number;
    /** Rotate the worker join token. */
    readonly rotateWorkerToken?: boolean;
    /** Rotate the manager join token. */
    readonly rotateManagerToken?: boolean;
    /** Rotate the manager unlock key. */
    readonly rotateManagerUnlockKey?: boolean;
}

/**
 * @since 1.0.0
 * @category Tags
 */
export interface SwarmImpl {
    /** Inspect swarm */
    readonly inspect: () => Effect.Effect<Readonly<SwarmData>, SwarmsError, never>;

    /** Initialize a new swarm */
    readonly init: (options: typeof SwarmInitRequest.Encoded) => Effect.Effect<Readonly<string>, SwarmsError, never>;

    /**
     * Join an existing swarm
     *
     * @param body -
     */
    readonly join: (options: typeof SwarmJoinRequest.Encoded) => Effect.Effect<void, SwarmsError, never>;

    /**
     * Leave a swarm
     *
     * @param force - Force leave swarm, even if this is the last manager or
     *   that it will break the cluster.
     */
    readonly leave: (options: SwarmLeaveOptions) => Effect.Effect<void, SwarmsError, never>;

    /**
     * Update a swarm
     *
     * @param body -
     * @param version - The version number of the swarm object being updated.
     *   This is required to avoid conflicting writes.
     * @param rotateWorkerToken - Rotate the worker join token.
     * @param rotateManagerToken - Rotate the manager join token.
     * @param rotateManagerUnlockKey - Rotate the manager unlock key.
     */
    readonly update: (options: SwarmUpdateOptions) => Effect.Effect<void, SwarmsError, never>;

    /** Get the unlock key */
    readonly unlockkey: () => Effect.Effect<SwarmUnlockKeyResponse, SwarmsError, never>;

    /** Unlock a locked manager */
    readonly unlock: (options: typeof SwarmUnlockRequest.Encoded) => Effect.Effect<void, SwarmsError, never>;
}

/**
 * @since 1.0.0
 * @category Services
 */
export const make: Effect.Effect<SwarmImpl, never, HttpClient.HttpClient.Default> = Effect.gen(function* () {
    const defaultClient = yield* HttpClient.HttpClient;
    const client = defaultClient.pipe(HttpClient.filterStatusOk);

    const inspect_ = (): Effect.Effect<Readonly<SwarmData>, SwarmsError, never> =>
        Function.pipe(
            HttpClientRequest.get("/swarm"),
            client,
            HttpClientResponse.schemaBodyJsonScoped(SwarmData),
            Effect.mapError((cause) => new SwarmsError({ method: "inspect", cause }))
        );

    const init_ = (options: typeof SwarmInitRequest.Encoded): Effect.Effect<Readonly<string>, SwarmsError, never> =>
        Function.pipe(
            Schema.decode(SwarmInitRequest)(options),
            Effect.map((body) => Tuple.make(HttpClientRequest.post("/swarm/init"), body)),
            Effect.flatMap(Function.tupled(HttpClientRequest.schemaBody(SwarmInitRequest))),
            Effect.flatMap(client),
            HttpClientResponse.schemaBodyJsonScoped(Schema.String),
            Effect.mapError((cause) => new SwarmsError({ method: "init", cause }))
        );

    const join_ = (options: typeof SwarmJoinRequest.Encoded): Effect.Effect<void, SwarmsError, never> =>
        Function.pipe(
            Schema.decode(SwarmJoinRequest)(options),
            Effect.map((body) => Tuple.make(HttpClientRequest.post("/swarm/join"), body)),
            Effect.flatMap(Function.tupled(HttpClientRequest.schemaBody(SwarmJoinRequest))),
            Effect.flatMap(client),
            HttpClientResponse.void,
            Effect.mapError((cause) => new SwarmsError({ method: "join", cause }))
        );

    const leave_ = (options: SwarmLeaveOptions): Effect.Effect<void, SwarmsError, never> =>
        Function.pipe(
            HttpClientRequest.post("/swarm/leave"),
            maybeAddQueryParameter("force", Option.fromNullable(options.force)),
            client,
            HttpClientResponse.void,
            Effect.mapError((cause) => new SwarmsError({ method: "leave", cause }))
        );

    const update_ = (options: SwarmUpdateOptions): Effect.Effect<void, SwarmsError, never> =>
        Function.pipe(
            HttpClientRequest.post("/swarm/update"),
            maybeAddQueryParameter("version", Option.some(options.version)),
            maybeAddQueryParameter("rotateWorkerToken", Option.fromNullable(options.rotateWorkerToken)),
            maybeAddQueryParameter("rotateManagerToken", Option.fromNullable(options.rotateManagerToken)),
            maybeAddQueryParameter("rotateManagerUnlockKey", Option.fromNullable(options.rotateManagerUnlockKey)),
            HttpClientRequest.schemaBody(SwarmSpec)(options.spec),
            Effect.flatMap(client),
            HttpClientResponse.void,
            Effect.mapError((cause) => new SwarmsError({ method: "update", cause }))
        );

    const unlockkey_ = (): Effect.Effect<SwarmUnlockKeyResponse, SwarmsError, never> =>
        Function.pipe(
            HttpClientRequest.get("/swarm/unlockkey"),
            client,
            HttpClientResponse.schemaBodyJsonScoped(SwarmUnlockKeyResponse),
            Effect.mapError((cause) => new SwarmsError({ method: "unlockkey", cause }))
        );

    const unlock_ = (options: typeof SwarmUnlockRequest.Encoded): Effect.Effect<void, SwarmsError, never> =>
        Function.pipe(
            Schema.decode(SwarmUnlockRequest)(options),
            Effect.map((body) => Tuple.make(HttpClientRequest.post("/swarm/unlock"), body)),
            Effect.flatMap(Function.tupled(HttpClientRequest.schemaBody(SwarmUnlockRequest))),
            Effect.flatMap(client),
            HttpClientResponse.void,
            Effect.mapError((cause) => new SwarmsError({ method: "unlock", cause }))
        );

    return {
        inspect: inspect_,
        init: init_,
        join: join_,
        leave: leave_,
        update: update_,
        unlockkey: unlockkey_,
        unlock: unlock_,
    };
});

/**
 * Swarms service
 *
 * @since 1.0.0
 * @category Tags
 */
export class Swarm extends Effect.Tag("@the-moby-effect/endpoints/Swarm")<Swarm, SwarmImpl>() {}

/**
 * Configs layer that depends on the MobyConnectionAgent
 *
 * @since 1.0.0
 * @category Layers
 */
export const layer: Layer.Layer<Swarm, never, HttpClient.HttpClient.Default> = Layer.effect(Swarm, make);
