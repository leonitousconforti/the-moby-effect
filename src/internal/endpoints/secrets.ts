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
import { SwarmSecret, SwarmSecretSpec } from "../generated/index.ts";
import { SecretIdentifier } from "../schemas/id.ts";
import { DockerError } from "./circular.ts";
import { BadRequest, Conflict, InternalServerError, NotFound, ServiceUnavailable } from "./errors.ts";

/** @since 1.0.0 */
export const ListFilters = Schema.Struct({
    id: Schema.optional(Schema.Array(Schema.String)),
    label: Schema.optional(Schema.Array(Schema.String)),
    name: Schema.optional(Schema.Array(Schema.String)),
});

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Secret/operation/SecretList */
const listSecretsEndpoint = HttpApiEndpoint.get("list", "/", {
    query: { filters: Schema.optional(ListFilters) },
    success: Schema.Array(SwarmSecret), // 200 OK
    error: [
        ServiceUnavailable, // 503 Node is not part of a swarm
        InternalServerError,
    ],
});

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Secret/operation/SecretCreate */
const createSecretEndpoint = HttpApiEndpoint.post("create", "/create", {
    payload: SwarmSecretSpec,
    success: Schema.Struct({
        Id: SecretIdentifier,
    }).pipe(
        Schema.encodeKeys({
            Id: "ID",
        }),
        HttpApiSchema.status(201)
    ), // 201 Created
    error: [
        Conflict, // 409 name conflicts with an existing object
        ServiceUnavailable, // 503 Node is not part of a swarm
        InternalServerError,
    ],
});

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Secret/operation/SecretInspect */
const inspectSecretEndpoint = HttpApiEndpoint.get("inspect", "/:id", {
    params: { id: Schema.String },
    success: SwarmSecret, // 200 OK
    error: [
        NotFound, // 404 No such secret
        ServiceUnavailable, // 503 Node is not part of a swarm
        InternalServerError,
    ],
});

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Secret/operation/SecretDelete */
const deleteSecretEndpoint = HttpApiEndpoint.delete("delete", "/:id", {
    params: { id: Schema.String },
    success: HttpApiSchema.NoContent, // 204 No Content
    error: [
        NotFound, // 404 No such secret
        ServiceUnavailable, // 503 Node is not part of a swarm
        InternalServerError,
    ],
});

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Secret/operation/SecretUpdate */
const updateSecretEndpoint = HttpApiEndpoint.post("update", "/:id/update", {
    params: { id: Schema.String },
    query: { version: Schema.BigIntFromString },
    payload: SwarmSecretSpec,
    success: HttpApiSchema.Empty(200), // 200 OK
    error: [
        BadRequest, // 400 Bad request
        NotFound, // 404 No such secret
        ServiceUnavailable, // 503 Node is not part of a swarm
        InternalServerError,
    ],
});

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Secret */
const SecretsGroup = HttpApiGroup.make("secrets")
    .add(listSecretsEndpoint, createSecretEndpoint, inspectSecretEndpoint, deleteSecretEndpoint, updateSecretEndpoint)
    .prefix("/secrets");

/**
 * Secrets are sensitive data that can be used by services. Swarm mode must be
 * enabled for these endpoints to work.
 *
 * @since 1.0.0
 * @category HttpApi
 * @see https://docs.docker.com/reference/api/engine/latest/#tag/Secret
 */
export const SecretsApi = HttpApi.make("SecretsApi").add(SecretsGroup);

/**
 * Secrets are sensitive data that can be used by services. Swarm mode must be
 * enabled for these endpoints to work.
 *
 * @since 1.0.0
 * @category Services
 * @see https://docs.docker.com/reference/api/engine/latest/#tag/Secret
 */
export class Secrets extends Context.Service<Secrets>()("@the-moby-effect/endpoints/Secrets", {
    make: Effect.gen(function* () {
        const httpClient = yield* HttpClient.HttpClient;
        const SecretsError = DockerError.WrapForModule("secrets");
        const client = yield* HttpApiClient.group(SecretsApi, { group: "secrets", httpClient });

        const list_ = (filters?: Schema.Schema.Type<typeof ListFilters>) =>
            Effect.mapError(client.list({ query: { filters } }), SecretsError("list"));
        const create_ = (payload: (typeof SwarmSecretSpec)["~type.make.in"]) =>
            Effect.mapError(client.create({ payload: new SwarmSecretSpec(payload) }), SecretsError("create"));
        const inspect_ = (id: string) => Effect.mapError(client.inspect({ params: { id } }), SecretsError("inspect"));
        const delete_ = (id: string) => Effect.mapError(client.delete({ params: { id } }), SecretsError("delete"));
        const update_ = (id: string, version: bigint, payload: (typeof SwarmSecretSpec)["~type.make.in"]) =>
            Effect.mapError(
                client.update({ params: { id }, query: { version }, payload: new SwarmSecretSpec(payload) }),
                SecretsError("update")
            );

        return {
            list: list_,
            create: create_,
            inspect: inspect_,
            delete: delete_,
            update: update_,
        };
    }),
}) {}

/**
 * Secrets are sensitive data that can be used by services. Swarm mode must be
 * enabled for these endpoints to work.
 *
 * @since 1.0.0
 * @category Layers
 * @see https://docs.docker.com/reference/api/engine/latest/#tag/Secret
 */
export const SecretsLayer: Layer.Layer<Secrets, never, HttpClient.HttpClient> = Layer.effect(Secrets, Secrets.make);

/**
 * Secrets are sensitive data that can be used by services. Swarm mode must be
 * enabled for these endpoints to work.
 *
 * @since 1.0.0
 * @category Layers
 * @see https://docs.docker.com/reference/api/engine/latest/#tag/Secret
 */
export const SecretsLayerLocalSocket: Layer.Layer<Secrets, never, HttpClient.HttpClient> = SecretsLayer.pipe(
    Layer.provide(
        makeAgnosticHttpClientLayer(
            MobyConnectionOptions.socket({
                socketPath: "/var/run/docker.sock",
            })
        )
    )
);
