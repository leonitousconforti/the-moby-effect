import {
    HttpApi,
    HttpApiClient,
    HttpApiEndpoint,
    HttpApiError,
    HttpApiGroup,
    HttpApiSchema,
    HttpClient,
    Error as PlatformError,
    type HttpClientError,
} from "@effect/platform";
import { Effect, Predicate, Schema, type Layer, type ParseResult } from "effect";

import { MobyConnectionOptions } from "../../MobyConnection.js";
import { makeAgnosticHttpClientLayer } from "../../MobyPlatforms.js";
import { SwarmSwarm as SwarmData, SwarmInitRequest, SwarmJoinRequest, SwarmSpec } from "../generated/index.js";

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
    cause:
        | NodeNotPartOfSwarm
        | NodeAlreadyPartOfSwarm
        | HttpApiError.InternalServerError
        | HttpApiError.BadRequest
        | HttpApiError.NotFound
        | ParseResult.ParseError
        | HttpClientError.HttpClientError
        | HttpApiError.HttpApiDecodeError;
}> {
    get message() {
        return `${this.method}`;
    }

    static WrapForMethod(method: string) {
        return (cause: SwarmsError["cause"]) => new this({ method, cause });
    }
}

/** @since 1.0.0 */
export class NodeNotPartOfSwarm extends HttpApiSchema.EmptyError<NodeNotPartOfSwarm>()({
    tag: "NodeNotPartOfSwarm",
    status: 503,
}) {}

/** @since 1.0.0 */
export class NodeAlreadyPartOfSwarm extends HttpApiSchema.EmptyError<NodeAlreadyPartOfSwarm>()({
    tag: "NodeAlreadyPartOfSwarm",
    status: 503,
}) {}

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Swarm/operation/SwarmInspect */
const inspectSwarmEndpoint = HttpApiEndpoint.get("inspect", "/")
    .addSuccess(SwarmData, { status: 200 }) // 200 OK
    .addError(HttpApiError.NotFound) // 404 No such swarm
    .addError(NodeNotPartOfSwarm); // 503 Node is not part of a swarm

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Swarm/operation/SwarmInit */
const initSwarmEndpoint = HttpApiEndpoint.post("init", "/init")
    .setPayload(SwarmInitRequest)
    .addSuccess(Schema.String, { status: 200 }) // 200 OK
    .addError(HttpApiError.BadRequest) // 400 Bad parameter
    .addError(NodeAlreadyPartOfSwarm); // 503 Node is already part of a swarm

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Swarm/operation/SwarmJoin */
const joinSwarmEndpoint = HttpApiEndpoint.post("join", "/join")
    .setPayload(SwarmJoinRequest)
    .addSuccess(HttpApiSchema.Empty(200)) // 200 OK
    .addError(HttpApiError.BadRequest) // 400 Bad parameter
    .addError(NodeAlreadyPartOfSwarm); // 503 Node is already part of a swarm

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Swarm/operation/SwarmLeave */
const leaveSwarmEndpoint = HttpApiEndpoint.post("leave", "/leave")
    .setUrlParams(Schema.Struct({ force: Schema.optional(Schema.BooleanFromString) }))
    .addSuccess(HttpApiSchema.Empty(200)) // 200 OK
    .addError(NodeNotPartOfSwarm); // 503 Node is not part of a swarm

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Swarm/operation/SwarmUpdate */
const updateSwarmEndpoint = HttpApiEndpoint.post("update", "/update")
    .setUrlParams(
        Schema.Struct({
            version: Schema.NumberFromString,
            rotateWorkerToken: Schema.optional(Schema.BooleanFromString),
            rotateManagerToken: Schema.optional(Schema.BooleanFromString),
            rotateManagerUnlockKey: Schema.optional(Schema.BooleanFromString),
        })
    )
    .setPayload(SwarmSpec)
    .addSuccess(HttpApiSchema.Empty(200)) // 200 OK
    .addError(HttpApiError.BadRequest) // 400 Bad parameter
    .addError(NodeNotPartOfSwarm); // 503 Node is not part of a swarm

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Swarm/operation/SwarmUnlockkey */
const unlockkeySwarmEndpoint = HttpApiEndpoint.get("unlockkey", "/unlockkey")
    .addSuccess(Schema.Struct({ UnlockKey: Schema.String }), { status: 200 }) // 200 OK
    .addError(NodeNotPartOfSwarm); // 503 Node is not part of a swarm

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Swarm/operation/SwarmUnlock */
const unlockSwarmEndpoint = HttpApiEndpoint.post("unlock", "/unlock")
    .setPayload(Schema.Struct({ UnlockKey: Schema.String }))
    .addSuccess(HttpApiSchema.Empty(200)) // 200 OK
    .addError(NodeNotPartOfSwarm); // 503 Node is not part of a swarm

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Swarm */
const SwarmGroup = HttpApiGroup.make("swarm")
    .add(inspectSwarmEndpoint)
    .add(initSwarmEndpoint)
    .add(joinSwarmEndpoint)
    .add(leaveSwarmEndpoint)
    .add(updateSwarmEndpoint)
    .add(unlockkeySwarmEndpoint)
    .add(unlockSwarmEndpoint)
    .addError(HttpApiError.InternalServerError)
    .prefix("/swarm");

/**
 * Engines can be clustered together in a swarm. Refer to the swarm mode
 * documentation for more information.
 *
 * @since 1.0.0
 * @category HttpApi
 * @see https://docs.docker.com/reference/api/engine/latest/#tag/Swarm
 */
export const SwarmApi = HttpApi.make("SwarmApi").add(SwarmGroup);

/**
 * Engines can be clustered together in a swarm. Refer to the swarm mode
 * documentation for more information.
 *
 * @since 1.0.0
 * @category Services
 * @see https://docs.docker.com/reference/api/engine/latest/#tag/Swarm
 */
export class Swarm extends Effect.Service<Swarm>()("@the-moby-effect/endpoints/Swarm", {
    accessors: false,
    dependencies: [
        makeAgnosticHttpClientLayer(
            MobyConnectionOptions.socket({
                socketPath: "/var/run/docker.sock",
            })
        ),
    ],

    effect: Effect.gen(function* () {
        const httpClient = yield* HttpClient.HttpClient;
        const client = yield* HttpApiClient.group(SwarmApi, { group: "swarm", httpClient });

        const inspect_ = () => Effect.mapError(client.inspect({}), SwarmsError.WrapForMethod("inspect"));
        const init_ = (payload: SwarmInitRequest) =>
            Effect.mapError(client.init({ payload }), SwarmsError.WrapForMethod("init"));
        const join_ = (payload: SwarmJoinRequest) =>
            Effect.mapError(client.join({ payload }), SwarmsError.WrapForMethod("join"));
        const leave_ = (options?: { force?: boolean | undefined } | undefined) =>
            Effect.mapError(client.leave({ urlParams: { ...options } }), SwarmsError.WrapForMethod("leave"));
        const update_ = (
            spec: SwarmSpec,
            version: number,
            rotate?:
                | {
                      workerToken?: boolean | undefined;
                      managerToken?: boolean | undefined;
                      managerUnlockKey?: boolean | undefined;
                  }
                | undefined
        ) =>
            Effect.mapError(
                client.update({
                    payload: spec,
                    urlParams: {
                        version,
                        rotateWorkerToken: rotate?.workerToken,
                        rotateManagerToken: rotate?.managerToken,
                        rotateManagerUnlockKey: rotate?.managerUnlockKey,
                    },
                }),
                SwarmsError.WrapForMethod("update")
            );
        const unlockkey_ = () => Effect.mapError(client.unlockkey({}), SwarmsError.WrapForMethod("unlockkey"));
        const unlock_ = (unlockKey: string) =>
            Effect.mapError(client.unlock({ payload: { UnlockKey: unlockKey } }), SwarmsError.WrapForMethod("unlock"));

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
export const SwarmLayer: Layer.Layer<Swarm, never, HttpClient.HttpClient> = Swarm.DefaultWithoutDependencies;

/**
 * Engines can be clustered together in a swarm. Refer to the swarm mode
 * documentation for more information.
 *
 * @since 1.0.0
 * @category Layers
 * @see https://docs.docker.com/reference/api/engine/latest/#tag/Swarm
 */
export const SwarmLayerLocalSocket: Layer.Layer<Swarm, never, HttpClient.HttpClient> = Swarm.Default;
