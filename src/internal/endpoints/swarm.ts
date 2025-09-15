import {
    HttpApi,
    HttpApiClient,
    HttpApiEndpoint,
    HttpApiError,
    HttpApiGroup,
    HttpApiSchema,
    HttpClient,
} from "@effect/platform";
import { Effect, Schema, type Layer } from "effect";

import { MobyConnectionOptions } from "../../MobyConnection.js";
import { makeAgnosticHttpClientLayer } from "../../MobyPlatforms.js";
import {
    Swarm as SwarmData,
    SwarmInitRequest,
    SwarmJoinRequest,
    SwarmSpec,
    SwarmUnlockKeyResponse,
    SwarmUnlockRequest,
} from "../generated/index.js";

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Swarm/operation/SwarmInspect */
const inspectSwarmEndpoint = HttpApiEndpoint.get("inspect", "/")
    .addSuccess(SwarmData, { status: 200 }) // 200 OK
    .addError(HttpApiError.NotAcceptable); // 406 node is not a swarm manager

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Swarm/operation/SwarmInit */
const initSwarmEndpoint = HttpApiEndpoint.post("init", "/init")
    .setPayload(SwarmInitRequest)
    .addSuccess(Schema.String, { status: 200 }) // 200 OK returns node ID
    .addError(HttpApiError.BadRequest)
    .addError(HttpApiError.InternalServerError);

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Swarm/operation/SwarmJoin */
const joinSwarmEndpoint = HttpApiEndpoint.post("join", "/join")
    .setPayload(SwarmJoinRequest)
    .addSuccess(HttpApiSchema.Empty(200)) // 200 OK
    .addError(HttpApiError.InternalServerError);

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Swarm/operation/SwarmLeave */
const leaveSwarmEndpoint = HttpApiEndpoint.post("leave", "/leave")
    .setUrlParams(Schema.Struct({ force: Schema.optional(Schema.BooleanFromString) }))
    .addSuccess(HttpApiSchema.Empty(200)) // 200 OK
    .addError(HttpApiError.InternalServerError);

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
    .addError(HttpApiError.InternalServerError);

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Swarm/operation/SwarmUnlockkey */
const unlockkeySwarmEndpoint = HttpApiEndpoint.get("unlockkey", "/unlockkey")
    .addSuccess(SwarmUnlockKeyResponse, { status: 200 }) // 200 OK
    .addError(HttpApiError.InternalServerError);

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Swarm/operation/SwarmUnlock */
const unlockSwarmEndpoint = HttpApiEndpoint.post("unlock", "/unlock")
    .setPayload(SwarmUnlockRequest)
    .addSuccess(HttpApiSchema.Empty(200)) // 200 OK
    .addError(HttpApiError.InternalServerError);

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
export class SwarmService extends Effect.Service<SwarmService>()("@the-moby-effect/endpoints/Swarm", {
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

        const inspect_ = () => client.inspect({});
        const init_ = (payload: SwarmInitRequest) => client.init({ payload });
        const join_ = (payload: SwarmJoinRequest) => client.join({ payload });
        const leave_ = (force?: boolean) => client.leave({ urlParams: { force } });
        const update_ = (
            spec: SwarmSpec,
            version: number,
            rotate?: { workerToken?: boolean; managerToken?: boolean; managerUnlockKey?: boolean }
        ) =>
            client.update({
                urlParams: {
                    version,
                    rotateWorkerToken: rotate?.workerToken,
                    rotateManagerToken: rotate?.managerToken,
                    rotateManagerUnlockKey: rotate?.managerUnlockKey,
                },
                payload: spec,
            });
        const unlockkey_ = () => client.unlockkey({});
        const unlock_ = (payload: SwarmUnlockRequest) => client.unlock({ payload });

        return {
            inspect: inspect_,
            init: init_,
            join: join_,
            leave: leave_,
            update: update_,
            unlockkey: unlockkey_,
            unlock: unlock_,
        } as const;
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
export const SwarmLayer: Layer.Layer<SwarmService, never, HttpClient.HttpClient> =
    SwarmService.DefaultWithoutDependencies as Layer.Layer<SwarmService, never, HttpClient.HttpClient>;

/**
 * Local socket auto-configured layer
 *
 * @since 1.0.0
 * @category Layers
 */
export const SwarmLayerLocalSocket: Layer.Layer<SwarmService, never, HttpClient.HttpClient> =
    SwarmService.Default as Layer.Layer<SwarmService, never, HttpClient.HttpClient>;
