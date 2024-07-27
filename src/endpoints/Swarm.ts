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
    readonly body: SwarmSpec;
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
    readonly init: (
        options: Schema.Schema.Type<typeof SwarmInitRequest>
    ) => Effect.Effect<Readonly<string>, SwarmsError, never>;

    /**
     * Join an existing swarm
     *
     * @param body -
     */
    readonly join: (options: Schema.Schema.Encoded<typeof SwarmJoinRequest>) => Effect.Effect<void, SwarmsError, never>;

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
    readonly unlock: (
        options: Schema.Schema.Encoded<typeof SwarmUnlockRequest>
    ) => Effect.Effect<void, SwarmsError, never>;
}

/**
 * @since 1.0.0
 * @category Services
 */
export const make: Effect.Effect<SwarmImpl, never, HttpClient.HttpClient.Default> = Effect.gen(function* () {
    const defaultClient = yield* HttpClient.HttpClient;

    const client = defaultClient.pipe(
        HttpClient.mapRequest(HttpClientRequest.prependUrl("/swarm")),
        HttpClient.filterStatusOk
    );

    const voidClient = client.pipe(HttpClient.transform(Effect.asVoid));
    const SwarmClient = client.pipe(HttpClient.transformResponse(HttpClientResponse.schemaBodyJsonScoped(SwarmData)));
    const StringClient = client.pipe(
        HttpClient.transformResponse(HttpClientResponse.schemaBodyJsonScoped(Schema.String))
    );
    const UnlockKeyResponseClient = client.pipe(
        HttpClient.transformResponse(HttpClientResponse.schemaBodyJsonScoped(SwarmUnlockKeyResponse))
    );

    const inspect_ = (): Effect.Effect<Readonly<SwarmData>, SwarmsError, never> =>
        Function.pipe(
            HttpClientRequest.get("/"),
            SwarmClient,
            Effect.mapError((cause) => new SwarmsError({ method: "inspect", cause }))
        );

    const init_ = (
        options: Schema.Schema.Type<typeof SwarmInitRequest>
    ): Effect.Effect<Readonly<string>, SwarmsError, never> =>
        Function.pipe(
            HttpClientRequest.post("/init"),
            HttpClientRequest.schemaBody(SwarmInitRequest)(new SwarmInitRequest(options)),
            Effect.flatMap(StringClient),
            Effect.mapError((cause) => new SwarmsError({ method: "init", cause }))
        );

    const join_ = (options: Schema.Schema.Type<typeof SwarmJoinRequest>): Effect.Effect<void, SwarmsError, never> =>
        Function.pipe(
            HttpClientRequest.post("/join"),
            HttpClientRequest.schemaBody(SwarmJoinRequest)(new SwarmJoinRequest(options)),
            Effect.flatMap(voidClient),
            Effect.mapError((cause) => new SwarmsError({ method: "join", cause })),
            Effect.scoped
        );

    const leave_ = (options: SwarmLeaveOptions): Effect.Effect<void, SwarmsError, never> =>
        Function.pipe(
            HttpClientRequest.post("/leave"),
            maybeAddQueryParameter("force", Option.fromNullable(options.force)),
            voidClient,
            Effect.mapError((cause) => new SwarmsError({ method: "leave", cause })),
            Effect.scoped
        );

    const update_ = (options: SwarmUpdateOptions): Effect.Effect<void, SwarmsError, never> =>
        Function.pipe(
            HttpClientRequest.post("/update"),
            maybeAddQueryParameter("version", Option.some(options.version)),
            maybeAddQueryParameter("rotateWorkerToken", Option.fromNullable(options.rotateWorkerToken)),
            maybeAddQueryParameter("rotateManagerToken", Option.fromNullable(options.rotateManagerToken)),
            maybeAddQueryParameter("rotateManagerUnlockKey", Option.fromNullable(options.rotateManagerUnlockKey)),
            HttpClientRequest.schemaBody(SwarmSpec)(options.body ?? new SwarmSpec({} as any)),
            Effect.flatMap(voidClient),
            Effect.mapError((cause) => new SwarmsError({ method: "update", cause })),
            Effect.scoped
        );

    const unlockkey_ = (): Effect.Effect<SwarmUnlockKeyResponse, SwarmsError, never> =>
        Function.pipe(
            HttpClientRequest.get("/unlockkey"),
            UnlockKeyResponseClient,
            Effect.mapError((cause) => new SwarmsError({ method: "unlockkey", cause }))
        );

    const unlock_ = (options: Schema.Schema.Type<typeof SwarmUnlockRequest>): Effect.Effect<void, SwarmsError, never> =>
        Function.pipe(
            HttpClientRequest.post("/unlock"),
            HttpClientRequest.schemaBody(SwarmUnlockRequest)(new SwarmUnlockRequest(options)),
            Effect.flatMap(voidClient),
            Effect.mapError((cause) => new SwarmsError({ method: "unlock", cause })),
            Effect.scoped
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
