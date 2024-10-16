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
export const SwarmsErrorTypeId: unique symbol = Symbol.for("@the-moby-effect/endpoints/SwarmsError");

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
        return `${this.method}`;
    }
}

/**
 * Swarms service
 *
 * @since 1.0.0
 * @category Tags
 */
export class Swarm extends Effect.Service<Swarm>()("@the-moby-effect/endpoints/Swarm", {
    accessors: true,
    dependencies: [],

    effect: Effect.gen(function* () {
        const defaultClient = yield* HttpClient.HttpClient;
        const client = defaultClient.pipe(HttpClient.filterStatusOk);

        const inspect_ = (): Effect.Effect<Readonly<SwarmData>, SwarmsError, never> =>
            Function.pipe(
                HttpClientRequest.get("/swarm"),
                client.execute,
                Effect.flatMap(HttpClientResponse.schemaBodyJson(SwarmData)),
                Effect.mapError((cause) => new SwarmsError({ method: "inspect", cause })),
                Effect.scoped
            );

        const init_ = (options: typeof SwarmInitRequest.Encoded): Effect.Effect<Readonly<string>, SwarmsError, never> =>
            Function.pipe(
                Schema.decode(SwarmInitRequest)(options),
                Effect.map((body) => Tuple.make(HttpClientRequest.post("/swarm/init"), body)),
                Effect.flatMap(Function.tupled(HttpClientRequest.schemaBodyJson(SwarmInitRequest))),
                Effect.flatMap(client.execute),
                Effect.flatMap(HttpClientResponse.schemaBodyJson(Schema.String)),
                Effect.mapError((cause) => new SwarmsError({ method: "init", cause })),
                Effect.scoped
            );

        const join_ = (options: typeof SwarmJoinRequest.Encoded): Effect.Effect<void, SwarmsError, never> =>
            Function.pipe(
                Schema.decode(SwarmJoinRequest)(options),
                Effect.map((body) => Tuple.make(HttpClientRequest.post("/swarm/join"), body)),
                Effect.flatMap(Function.tupled(HttpClientRequest.schemaBodyJson(SwarmJoinRequest))),
                Effect.flatMap(client.execute),
                Effect.asVoid,
                Effect.mapError((cause) => new SwarmsError({ method: "join", cause })),
                Effect.scoped
            );

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
                Effect.mapError((cause) => new SwarmsError({ method: "leave", cause })),
                Effect.scoped
            );

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
                Effect.mapError((cause) => new SwarmsError({ method: "update", cause })),
                Effect.scoped
            );

        const unlockkey_ = (): Effect.Effect<SwarmUnlockKeyResponse, SwarmsError, never> =>
            Function.pipe(
                HttpClientRequest.get("/swarm/unlockkey"),
                client.execute,
                Effect.flatMap(HttpClientResponse.schemaBodyJson(SwarmUnlockKeyResponse)),
                Effect.mapError((cause) => new SwarmsError({ method: "unlockkey", cause })),
                Effect.scoped
            );

        const unlock_ = (options: typeof SwarmUnlockRequest.Encoded): Effect.Effect<void, SwarmsError, never> =>
            Function.pipe(
                Schema.decode(SwarmUnlockRequest)(options),
                Effect.map((body) => Tuple.make(HttpClientRequest.post("/swarm/unlock"), body)),
                Effect.flatMap(Function.tupled(HttpClientRequest.schemaBodyJson(SwarmUnlockRequest))),
                Effect.flatMap(client.execute),
                Effect.asVoid,
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
    }),
}) {}

/**
 * Configs layer that depends on the MobyConnectionAgent
 *
 * @since 1.0.0
 * @category Layers
 */
export const layer: Layer.Layer<Swarm, never, HttpClient.HttpClient> = Swarm.Default;
