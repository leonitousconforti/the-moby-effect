import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as Schema from "effect/Schema";
import * as HttpClient from "effect/unstable/http/HttpClient";
import * as HttpApi from "effect/unstable/httpapi/HttpApi";
import * as HttpApiClient from "effect/unstable/httpapi/HttpApiClient";
import * as HttpApiEndpoint from "effect/unstable/httpapi/HttpApiEndpoint";
import * as HttpApiGroup from "effect/unstable/httpapi/HttpApiGroup";
import * as HttpApiSchema from "effect/unstable/httpapi/HttpApiSchema";

import { MobyConnectionOptions } from "../../MobyConnection.ts";
import { makeAgnosticHttpClientLayer } from "../../MobyPlatforms.ts";
import { SwarmSwarm as SwarmData, SwarmInitRequest, SwarmJoinRequest, SwarmSpec } from "../generated/index.ts";
import { DockerError } from "./circular.ts";
import { BadRequest, InternalServerError, NotFound } from "./errors.ts";

/** @since 1.0.0 */
export class NodeNotPartOfSwarm extends Schema.ErrorClass<NodeNotPartOfSwarm>(
    "@the-moby-effect/endpoints/NodeNotPartOfSwarm"
)(
    {
        _tag: Schema.tagDefaultOmit("NodeNotPartOfSwarm"),
        message: Schema.optionalKey(Schema.String),
    },
    {
        identifier: "NodeNotPartOfSwarm",
        description: "NodeNotPartOfSwarm",
        httpApiStatus: 503,
    }
) {}

/** @since 1.0.0 */
export class NodeAlreadyPartOfSwarm extends Schema.ErrorClass<NodeAlreadyPartOfSwarm>(
    "@the-moby-effect/endpoints/NodeAlreadyPartOfSwarm"
)(
    {
        _tag: Schema.tagDefaultOmit("NodeAlreadyPartOfSwarm"),
        message: Schema.optionalKey(Schema.String),
    },
    {
        identifier: "NodeAlreadyPartOfSwarm",
        description: "NodeAlreadyPartOfSwarm",
        httpApiStatus: 503,
    }
) {}

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Swarm/operation/SwarmInspect */
const inspectSwarmEndpoint = HttpApiEndpoint.get("inspect", "/", {
    success: SwarmData, // 200 OK
    error: [
        NotFound, // 404 No such swarm
        NodeNotPartOfSwarm, // 503 Node is not part of a swarm
        InternalServerError,
    ],
});

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Swarm/operation/SwarmInit */
const initSwarmEndpoint = HttpApiEndpoint.post("init", "/init", {
    payload: SwarmInitRequest,
    success: Schema.String, // 200 OK
    error: [
        BadRequest, // 400 Bad parameter
        NodeAlreadyPartOfSwarm, // 503 Node is already part of a swarm
        InternalServerError,
    ],
});

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Swarm/operation/SwarmJoin */
const joinSwarmEndpoint = HttpApiEndpoint.post("join", "/join", {
    payload: SwarmJoinRequest,
    success: HttpApiSchema.Empty(200), // 200 OK
    error: [
        BadRequest, // 400 Bad parameter
        NodeAlreadyPartOfSwarm, // 503 Node is already part of a swarm
        InternalServerError,
    ],
});

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Swarm/operation/SwarmLeave */
const leaveSwarmEndpoint = HttpApiEndpoint.post("leave", "/leave", {
    query: { force: Schema.optional(Schema.Boolean) },
    success: HttpApiSchema.Empty(200), // 200 OK
    error: [
        NodeNotPartOfSwarm, // 503 Node is not part of a swarm
        InternalServerError,
    ],
});

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Swarm/operation/SwarmUpdate */
const updateSwarmEndpoint = HttpApiEndpoint.post("update", "/update", {
    query: {
        version: Schema.BigIntFromString,
        rotateWorkerToken: Schema.optional(Schema.Boolean),
        rotateManagerToken: Schema.optional(Schema.Boolean),
        rotateManagerUnlockKey: Schema.optional(Schema.Boolean),
    },
    payload: SwarmSpec,
    success: HttpApiSchema.Empty(200), // 200 OK
    error: [
        BadRequest, // 400 Bad parameter
        NodeNotPartOfSwarm, // 503 Node is not part of a swarm
        InternalServerError,
    ],
});

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Swarm/operation/SwarmUnlockkey */
const unlockkeySwarmEndpoint = HttpApiEndpoint.get("unlockkey", "/unlockkey", {
    success: Schema.Struct({ UnlockKey: Schema.String }), // 200 OK
    error: [
        NodeNotPartOfSwarm, // 503 Node is not part of a swarm
        InternalServerError,
    ],
});

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Swarm/operation/SwarmUnlock */
const unlockSwarmEndpoint = HttpApiEndpoint.post("unlock", "/unlock", {
    payload: Schema.Struct({ UnlockKey: Schema.String }),
    success: HttpApiSchema.Empty(200), // 200 OK
    error: [
        NodeNotPartOfSwarm, // 503 Node is not part of a swarm
        InternalServerError,
    ],
});

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Swarm */
const SwarmGroup = HttpApiGroup.make("swarm")
    .add(
        inspectSwarmEndpoint,
        initSwarmEndpoint,
        joinSwarmEndpoint,
        leaveSwarmEndpoint,
        updateSwarmEndpoint,
        unlockkeySwarmEndpoint,
        unlockSwarmEndpoint
    )
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
export class Swarm extends Context.Service<Swarm>()("@the-moby-effect/endpoints/Swarm", {
    make: Effect.gen(function* () {
        const httpClient = yield* HttpClient.HttpClient;
        const SwarmsError = DockerError.WrapForModule("swarm");
        const client = yield* HttpApiClient.group(SwarmApi, { group: "swarm", httpClient });

        const inspect_ = () => Effect.mapError(client.inspect(), SwarmsError("inspect"));
        const init_ = (payload: ConstructorParameters<typeof SwarmInitRequest>[0]) =>
            Effect.mapError(client.init({ payload: new SwarmInitRequest(payload) }), SwarmsError("init"));
        const join_ = (payload: ConstructorParameters<typeof SwarmJoinRequest>[0]) =>
            Effect.mapError(client.join({ payload: new SwarmJoinRequest(payload) }), SwarmsError("join"));
        const leave_ = (options?: { force?: boolean | undefined } | undefined) =>
            Effect.mapError(client.leave({ query: { ...options } }), SwarmsError("leave"));
        const update_ = (
            spec: ConstructorParameters<typeof SwarmSpec>[0],
            version: bigint,
            rotate?:
                | {
                      readonly rotateWorkerToken?: boolean | undefined;
                      readonly rotateManagerToken?: boolean | undefined;
                      readonly rotateManagerUnlockKey?: boolean | undefined;
                  }
                | undefined
        ) =>
            Effect.mapError(
                client.update({
                    payload: new SwarmSpec(spec),
                    query: { version, ...rotate },
                }),
                SwarmsError("update")
            );
        const unlockkey_ = () => Effect.mapError(client.unlockkey(), SwarmsError("unlockkey"));
        const unlock_ = (unlockKey: string) =>
            Effect.mapError(client.unlock({ payload: { UnlockKey: unlockKey } }), SwarmsError("unlock"));

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
export const SwarmLayer: Layer.Layer<Swarm, never, HttpClient.HttpClient> = Layer.effect(Swarm, Swarm.make);

/**
 * Engines can be clustered together in a swarm. Refer to the swarm mode
 * documentation for more information.
 *
 * @since 1.0.0
 * @category Layers
 * @see https://docs.docker.com/reference/api/engine/latest/#tag/Swarm
 */
export const SwarmLayerLocalSocket: Layer.Layer<Swarm, never, HttpClient.HttpClient> = SwarmLayer.pipe(
    Layer.provide(
        makeAgnosticHttpClientLayer(
            MobyConnectionOptions.socket({
                socketPath: "/var/run/docker.sock",
            })
        )
    )
);
