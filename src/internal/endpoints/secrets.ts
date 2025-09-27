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
import { Effect, Predicate, Schema, String, type Layer, type ParseResult } from "effect";

import { MobyConnectionOptions } from "../../MobyConnection.js";
import { makeAgnosticHttpClientLayer } from "../../MobyPlatforms.js";
import { SwarmSecret, SwarmSecretSpec } from "../generated/index.js";
import { SecretIdentifier } from "../schemas/id.js";
import { NodeNotPartOfSwarm } from "./swarm.js";

/**
 * @since 1.0.0
 * @category Errors
 */
export const SecretsErrorTypeId: unique symbol = Symbol.for(
    "@the-moby-effect/endpoints/SecretsError"
) as SecretsErrorTypeId;

/**
 * @since 1.0.0
 * @category Errors
 */
export type SecretsErrorTypeId = typeof SecretsErrorTypeId;

/**
 * @since 1.0.0
 * @category Errors
 */
export const isSecretsError = (u: unknown): u is SecretsError => Predicate.hasProperty(u, SecretsErrorTypeId);

/**
 * @since 1.0.0
 * @category Errors
 */
export class SecretsError extends PlatformError.TypeIdError(SecretsErrorTypeId, "SecretsError")<{
    method: string;
    cause:
        | NodeNotPartOfSwarm
        | HttpApiError.InternalServerError
        | HttpApiError.BadRequest
        | HttpApiError.NotFound
        | HttpApiError.Conflict
        | ParseResult.ParseError
        | HttpClientError.HttpClientError
        | HttpApiError.HttpApiDecodeError;
}> {
    public override get message() {
        return `${String.capitalize(this.method)} ${this.cause._tag}`;
    }

    public static WrapForMethod(method: string) {
        return (cause: SecretsError["cause"]) => new this({ method, cause });
    }
}

/** @since 1.0.0 */
export class ListFilters extends Schema.parseJson(
    Schema.Struct({
        id: Schema.optional(Schema.Array(Schema.String)),
        label: Schema.optional(Schema.Array(Schema.String)),
        name: Schema.optional(Schema.Array(Schema.String)),
    })
) {}

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Secret/operation/SecretList */
const listSecretsEndpoint = HttpApiEndpoint.get("list", "/")
    .setUrlParams(Schema.Struct({ filters: Schema.optional(ListFilters) }))
    .addSuccess(Schema.Array(SwarmSecret), { status: 200 }) // 200 OK
    .addError(NodeNotPartOfSwarm); // 503 Node is not part of a swarm

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Secret/operation/SecretCreate */
const createSecretEndpoint = HttpApiEndpoint.post("create", "/create")
    .setPayload(SwarmSecretSpec)
    .addSuccess(Schema.rename(Schema.Struct({ ID: SecretIdentifier }), { ID: "Id" }), { status: 201 }) // 201 Created
    .addError(HttpApiError.Conflict) // 409 name conflicts with an existing object
    .addError(NodeNotPartOfSwarm); // 503 Node is not part of a swarm

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Secret/operation/SecretInspect */
const inspectSecretEndpoint = HttpApiEndpoint.get("inspect", "/:id")
    .setPath(Schema.Struct({ id: Schema.String }))
    .addSuccess(SwarmSecret, { status: 200 }) // 200 OK
    .addError(HttpApiError.NotFound) // 404 No such secret
    .addError(NodeNotPartOfSwarm); // 503 Node is not part of a swarm

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Secret/operation/SecretDelete */
const deleteSecretEndpoint = HttpApiEndpoint.del("delete", "/:id")
    .setPath(Schema.Struct({ id: Schema.String }))
    .addSuccess(HttpApiSchema.NoContent) // 204 No Content
    .addError(HttpApiError.NotFound) // 404 No such secret
    .addError(NodeNotPartOfSwarm); // 503 Node is not part of a swarm

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Secret/operation/SecretUpdate */
const updateSecretEndpoint = HttpApiEndpoint.post("update", "/:id/update")
    .setPath(Schema.Struct({ id: Schema.String }))
    .setUrlParams(Schema.Struct({ version: Schema.NumberFromString }))
    .setPayload(SwarmSecretSpec)
    .addSuccess(HttpApiSchema.Empty(200)) // 200 OK
    .addError(HttpApiError.BadRequest) // 400 Bad request
    .addError(HttpApiError.NotFound) // 404 No such secret
    .addError(NodeNotPartOfSwarm); // 503 Node is not part of a swarm

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Secret */
const SecretsGroup = HttpApiGroup.make("secrets")
    .add(listSecretsEndpoint)
    .add(createSecretEndpoint)
    .add(inspectSecretEndpoint)
    .add(deleteSecretEndpoint)
    .add(updateSecretEndpoint)
    .addError(HttpApiError.InternalServerError)
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
export class Secrets extends Effect.Service<Secrets>()("@the-moby-effect/endpoints/Secrets", {
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
        const client = yield* HttpApiClient.group(SecretsApi, { group: "secrets", httpClient });

        const list_ = (filters?: Schema.Schema.Type<ListFilters>) =>
            Effect.mapError(client.list({ urlParams: { filters } }), SecretsError.WrapForMethod("list"));
        const create_ = (payload: SwarmSecretSpec) =>
            Effect.mapError(client.create({ payload }), SecretsError.WrapForMethod("create"));
        const inspect_ = (id: string) =>
            Effect.mapError(client.inspect({ path: { id } }), SecretsError.WrapForMethod("inspect"));
        const delete_ = (id: string) =>
            Effect.mapError(client.delete({ path: { id } }), SecretsError.WrapForMethod("delete"));
        const update_ = (id: string, version: number, payload: SwarmSecretSpec) =>
            Effect.mapError(
                client.update({ path: { id }, urlParams: { version }, payload }),
                SecretsError.WrapForMethod("update")
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
export const SecretsLayer: Layer.Layer<Secrets, never, HttpClient.HttpClient> = Secrets.DefaultWithoutDependencies;

/**
 * Secrets are sensitive data that can be used by services. Swarm mode must be
 * enabled for these endpoints to work.
 *
 * @since 1.0.0
 * @category Layers
 * @see https://docs.docker.com/reference/api/engine/latest/#tag/Secret
 */
export const SecretsLayerLocalSocket: Layer.Layer<Secrets, never, HttpClient.HttpClient> = Secrets.Default;
