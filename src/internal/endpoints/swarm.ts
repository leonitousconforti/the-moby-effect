/**
 * Engines can be clustered together in a swarm. Refer to the swarm mode
 * documentation for more information.
 *
 * @since 1.0.0
 * @see https://docs.docker.com/reference/api/engine/latest/#tag/Swarm
 */

import * as PlatformError from "@effect/platform/Error";
import * as HttpBody from "@effect/platform/HttpBody";
import * as HttpClient from "@effect/platform/HttpClient";
import * as HttpClientError from "@effect/platform/HttpClientError";
import * as HttpClientRequest from "@effect/platform/HttpClientRequest";
import * as HttpClientResponse from "@effect/platform/HttpClientResponse";
import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as Layer from "effect/Layer";
import * as Option from "effect/Option";
import * as ParseResult from "effect/ParseResult";
import * as Predicate from "effect/Predicate";
import * as Schema from "effect/Schema";
import * as Tuple from "effect/Tuple";

import {
    Swarm as SwarmData,
    SwarmInitRequest,
    SwarmJoinRequest,
    SwarmSpec,
    SwarmUnlockKeyResponse,
    SwarmUnlockRequest,
} from "../generated/index.js";
import { maybeAddQueryParameter } from "./common.js";

/**
 * @since 1.0.0
 * @category Errors
 */
export const SwarmsErrorTypeId: unique symbol = Symbol.for(
    "@the-moby-effect/endpoints/SwarmsError"
) as SwarmsErrorTypeId;

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
    cause: ParseResult.ParseError | HttpClientError.HttpClientError | HttpBody.HttpBodyError | unknown;
}> {
    get message() {
        return `${this.method}`;
    }
}

/**
 * Engines can be clustered together in a swarm. Refer to the swarm mode
 * documentation for more information.
 *
 * @since 1.0.0
 * @category Tags
 * @see https://docs.docker.com/reference/api/engine/latest/#tag/Swarm
 */
export class Swarm extends Effect.Service<Swarm>()("@the-moby-effect/endpoints/Swarm", {
    accessors: false,
    dependencies: [],

    effect: Effect.gen(function* () {
        const defaultClient = yield* HttpClient.HttpClient;
        const client = defaultClient.pipe(HttpClient.filterStatusOk);

        /** @see https://docs.docker.com/reference/api/engine/latest/#tag/Swarm/operation/SwarmInspect */
        const inspect_ = (): Effect.Effect<Readonly<SwarmData>, SwarmsError, never> =>
            Function.pipe(
                HttpClientRequest.get("/swarm"),
                client.execute,
                Effect.flatMap(HttpClientResponse.schemaBodyJson(SwarmData)),
                Effect.mapError((cause) => new SwarmsError({ method: "inspect", cause }))
            );

        /** @see https://docs.docker.com/reference/api/engine/latest/#tag/Swarm/operation/SwarmInit */
        const init_ = (options: typeof SwarmInitRequest.Encoded): Effect.Effect<Readonly<string>, SwarmsError, never> =>
            Function.pipe(
                Schema.decode(SwarmInitRequest)(options),
                Effect.map((body) => Tuple.make(HttpClientRequest.post("/swarm/init"), body)),
                Effect.flatMap(Function.tupled(HttpClientRequest.schemaBodyJson(SwarmInitRequest))),
                Effect.flatMap(client.execute),
                Effect.flatMap(HttpClientResponse.schemaBodyJson(Schema.String)),
                Effect.mapError((cause) => new SwarmsError({ method: "init", cause }))
            );

        /** @see https://docs.docker.com/reference/api/engine/latest/#tag/Swarm/operation/SwarmJoin */
        const join_ = (options: typeof SwarmJoinRequest.Encoded): Effect.Effect<void, SwarmsError, never> =>
            Function.pipe(
                Schema.decode(SwarmJoinRequest)(options),
                Effect.map((body) => Tuple.make(HttpClientRequest.post("/swarm/join"), body)),
                Effect.flatMap(Function.tupled(HttpClientRequest.schemaBodyJson(SwarmJoinRequest))),
                Effect.flatMap(client.execute),
                Effect.asVoid,
                Effect.mapError((cause) => new SwarmsError({ method: "join", cause }))
            );

        /** @see https://docs.docker.com/reference/api/engine/latest/#tag/Swarm/operation/SwarmLeave */
        const leave_ = (options: {
            /**
             * Force leave swarm, even if this is the last manager or that it
             * will break the cluster.
             */
            readonly force?: boolean;
        }): Effect.Effect<void, SwarmsError, never> =>
            Function.pipe(
                HttpClientRequest.post("/swarm/leave"),
                maybeAddQueryParameter("force", Option.fromNullable(options.force)),
                client.execute,
                Effect.asVoid,
                Effect.mapError((cause) => new SwarmsError({ method: "leave", cause }))
            );

        /** @see https://docs.docker.com/reference/api/engine/latest/#tag/Swarm/operation/SwarmUpdate */
        const update_ = (options: {
            readonly spec: SwarmSpec;
            readonly version: number;
            readonly rotateWorkerToken?: boolean;
            readonly rotateManagerToken?: boolean;
            readonly rotateManagerUnlockKey?: boolean;
        }): Effect.Effect<void, SwarmsError, never> =>
            Function.pipe(
                HttpClientRequest.post("/swarm/update"),
                maybeAddQueryParameter("version", Option.some(options.version)),
                maybeAddQueryParameter("rotateWorkerToken", Option.fromNullable(options.rotateWorkerToken)),
                maybeAddQueryParameter("rotateManagerToken", Option.fromNullable(options.rotateManagerToken)),
                maybeAddQueryParameter("rotateManagerUnlockKey", Option.fromNullable(options.rotateManagerUnlockKey)),
                HttpClientRequest.schemaBodyJson(SwarmSpec)(options.spec),
                Effect.flatMap(client.execute),
                Effect.asVoid,
                Effect.mapError((cause) => new SwarmsError({ method: "update", cause }))
            );

        /** @see https://docs.docker.com/reference/api/engine/latest/#tag/Swarm/operation/SwarmUnlockkey */
        const unlockkey_ = (): Effect.Effect<SwarmUnlockKeyResponse, SwarmsError, never> =>
            Function.pipe(
                HttpClientRequest.get("/swarm/unlockkey"),
                client.execute,
                Effect.flatMap(HttpClientResponse.schemaBodyJson(SwarmUnlockKeyResponse)),
                Effect.mapError((cause) => new SwarmsError({ method: "unlockkey", cause }))
            );

        /** @see https://docs.docker.com/reference/api/engine/latest/#tag/Swarm/operation/SwarmUnlock */
        const unlock_ = (options: typeof SwarmUnlockRequest.Encoded): Effect.Effect<void, SwarmsError, never> =>
            Function.pipe(
                Schema.decode(SwarmUnlockRequest)(options),
                Effect.map((body) => Tuple.make(HttpClientRequest.post("/swarm/unlock"), body)),
                Effect.flatMap(Function.tupled(HttpClientRequest.schemaBodyJson(SwarmUnlockRequest))),
                Effect.flatMap(client.execute),
                Effect.asVoid,
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
    }),
}) {}

/**
 * Engines can be clustered together in a swarm. Refer to the swarm mode
 * documentation for more information.
 *
 * @since 1.0.0
 * @category Layers
 * @see https://docs.docker.com/reference/api/engine/latest/#tag/Swarm
 */
export const SwarmLayer: Layer.Layer<Swarm, never, HttpClient.HttpClient> = Swarm.Default;
