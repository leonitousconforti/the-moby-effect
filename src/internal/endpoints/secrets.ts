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
import { SwarmSecret, SwarmSecretCreateResponse, SwarmSecretSpec } from "../generated/index.js";

/** Secret list filters (JSON encoded) */
export class SecretListFilters extends Schema.parseJson(
    Schema.Record({ key: Schema.String }, Schema.Any) // kept broad; can be tightened later
) {}

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Secret/operation/SecretList */
const listSecretsEndpoint = HttpApiEndpoint.get("list", "/")
    .setUrlParams(Schema.Struct({ filters: Schema.optional(SecretListFilters) }))
    .addSuccess(Schema.Array(SwarmSecret), { status: 200 });

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Secret/operation/SecretCreate */
const createSecretEndpoint = HttpApiEndpoint.post("create", "/create")
    .setPayload(SwarmSecretSpec)
    .addSuccess(SwarmSecretCreateResponse, { status: 201 })
    .addError(HttpApiError.BadRequest);

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Secret/operation/SecretInspect */
const inspectSecretEndpoint = HttpApiEndpoint.get("inspect", "/:id")
    .setPath(Schema.Struct({ id: Schema.String }))
    .addSuccess(SwarmSecret, { status: 200 })
    .addError(HttpApiError.NotFound);

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Secret/operation/SecretDelete */
const deleteSecretEndpoint = HttpApiEndpoint.del("delete", "/:id")
    .setPath(Schema.Struct({ id: Schema.String }))
    .addSuccess(HttpApiSchema.NoContent)
    .addError(HttpApiError.NotFound);

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Secret/operation/SecretUpdate */
const updateSecretEndpoint = HttpApiEndpoint.post("update", "/:id/update")
    .setPath(Schema.Struct({ id: Schema.String }))
    .setUrlParams(Schema.Struct({ version: Schema.Number }))
    .setPayload(SwarmSecretSpec)
    .addSuccess(HttpApiSchema.Empty(200))
    .addError(HttpApiError.NotFound)
    .addError(HttpApiError.BadRequest);

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
 * @since 1.0.0
 * @category HttpApi
 * @see https://docs.docker.com/reference/api/engine/latest/#tag/Secret
 */
export const SecretsApi = HttpApi.make("SecretsApi").add(SecretsGroup);

/**
 * @since 1.0.0
 * @category Services
 * @see https://docs.docker.com/reference/api/engine/latest/#tag/Secret
 */
export class SecretsService extends Effect.Service<SecretsService>()("@the-moby-effect/endpoints/Secrets", {
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

        const list_ = (filters?: Schema.Schema.Type<SecretListFilters>) => client.list({ urlParams: { filters } });
        const create_ = (payload: SwarmSecretSpec) => client.create({ payload });
        const inspect_ = (id: string) => client.inspect({ path: { id } });
        const delete_ = (id: string) => client.delete({ path: { id } });
        const update_ = (id: string, version: number, payload: SwarmSecretSpec) =>
            client.update({ path: { id }, urlParams: { version }, payload });

        return { list: list_, create: create_, inspect: inspect_, delete: delete_, update: update_ } as const;
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
export const SecretsLayer: Layer.Layer<SecretsService, never, HttpClient.HttpClient> =
    SecretsService.DefaultWithoutDependencies as Layer.Layer<SecretsService, never, HttpClient.HttpClient>;

/**
 * Local socket auto-configured layer
 *
 * @since 1.0.0
 * @category Layers
 */
export const SecretsLayerLocalSocket: Layer.Layer<SecretsService, never, HttpClient.HttpClient> =
    SecretsService.Default as Layer.Layer<SecretsService, never, HttpClient.HttpClient>;

/** Alias for pre-refactor naming consistency */
export { SecretsService as Secrets };
