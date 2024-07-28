/**
 * Services service
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
import * as Stream from "effect/Stream";

import {
    SwarmService,
    SwarmServiceCreateResponse,
    SwarmServiceSpec,
    SwarmServiceUpdateResponse,
} from "../generated/index.js";
import { maybeAddQueryParameter } from "./Common.js";

/**
 * @since 1.0.0
 * @category Errors
 */
export const ServicesErrorTypeId: unique symbol = Symbol.for("@the-moby-effect/moby/ServicesError");

/**
 * @since 1.0.0
 * @category Errors
 */
export type ServicesErrorTypeId = typeof ServicesErrorTypeId;

/**
 * @since 1.0.0
 * @category Errors
 */
export const isServicesError = (u: unknown): u is ServicesError => Predicate.hasProperty(u, ServicesErrorTypeId);

/**
 * @since 1.0.0
 * @category Errors
 */
export class ServicesError extends PlatformError.TypeIdError(ServicesErrorTypeId, "ServicesError")<{
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
export interface ServiceListOptions {
    /**
     * A JSON encoded value of the filters (a `map[string][]string`) to process
     * on the services list.
     *
     * Available filters:
     *
     * - `id=<service id>`
     * - `label=<service label>`
     * - `mode=["replicated"|"global"]`
     * - `name=<service name>`
     *
     * FIXME: implement this type
     */
    readonly filters?: string;
    /** Include service status, with count of running and desired tasks. */
    readonly status?: boolean;
}

/**
 * @since 1.0.0
 * @category Params
 */
export interface ServiceCreateOptions {
    readonly body: SwarmServiceSpec;
    /**
     * A base64url-encoded auth configuration for pulling from private
     * registries.
     *
     * Refer to the [authentication section](#section/Authentication) for
     * details.
     */
    readonly "X-Registry-Auth"?: string;
}

/**
 * @since 1.0.0
 * @category Params
 */
export interface ServiceDeleteOptions {
    /** ID or name of service. */
    readonly id: string;
}

/**
 * @since 1.0.0
 * @category Params
 */
export interface ServiceInspectOptions {
    /** ID or name of service. */
    readonly id: string;
    /** Fill empty fields with default values. */
    readonly insertDefaults?: boolean;
}

/**
 * @since 1.0.0
 * @category Params
 */
export interface ServiceUpdateOptions {
    /** ID or name of service. */
    readonly id: string;
    readonly body: SwarmServiceSpec;
    /**
     * The version number of the service object being updated. This is required
     * to avoid conflicting writes. This version number should be the value as
     * currently set on the service _before_ the update. You can find the
     * current version by calling `GET /services/{id}`
     */
    readonly version: number;
    /**
     * If the `X-Registry-Auth` header is not specified, this parameter
     * indicates where to find registry authorization credentials.
     */
    readonly registryAuthFrom?: string;
    /**
     * Set to this parameter to `previous` to cause a server-side rollback to
     * the previous service spec. The supplied spec will be ignored in this
     * case.
     */
    readonly rollback?: string;
    /**
     * A base64url-encoded auth configuration for pulling from private
     * registries.
     *
     * Refer to the [authentication section](#section/Authentication) for
     * details.
     */
    readonly "X-Registry-Auth"?: string;
}

/**
 * @since 1.0.0
 * @category Params
 */
export interface ServiceLogsOptions {
    /** ID or name of the service */
    readonly id: string;
    /** Show service context and extra details provided to logs. */
    readonly details?: boolean;
    /** Keep connection after returning logs. */
    readonly follow?: boolean;
    /** Return logs from `stdout` */
    readonly stdout?: boolean;
    /** Return logs from `stderr` */
    readonly stderr?: boolean;
    /** Only return logs since this time, as a UNIX timestamp */
    readonly since?: number;
    /** Add timestamps to every log line */
    readonly timestamps?: boolean;
    /**
     * Only return this number of log lines from the end of the logs. Specify as
     * an integer or `all` to output all log lines.
     */
    readonly tail?: string;
}

/**
 * @since 1.0.0
 * @category Tags
 */
export interface ServicesImpl {
    /**
     * List services
     *
     * @param filters - A JSON encoded value of the filters (a
     *   `map[string][]string`) to process on the services list.
     *
     *   Available filters:
     *
     *   - `id=<service id>`
     *   - `label=<service label>`
     *   - `mode=["replicated"|"global"]`
     *   - `name=<service name>`
     *
     * @param status - Include service status, with count of running and desired
     *   tasks.
     */
    readonly list: (
        options?: ServiceListOptions | undefined
    ) => Effect.Effect<Readonly<Array<SwarmService>>, ServicesError, never>;

    /**
     * Create a service
     *
     * @param body -
     * @param X-Registry-Auth - A base64url-encoded auth configuration for
     *   pulling from private registries.
     *
     *   Refer to the [authentication section](#section/Authentication) for
     *   details.
     */
    readonly create: (
        options: ServiceCreateOptions
    ) => Effect.Effect<Readonly<SwarmServiceCreateResponse>, ServicesError, never>;

    /**
     * Delete a service
     *
     * @param id - ID or name of service.
     */
    readonly delete: (options: ServiceDeleteOptions) => Effect.Effect<void, ServicesError, never>;

    /**
     * Inspect a service
     *
     * @param id - ID or name of service.
     * @param insertDefaults - Fill empty fields with default values.
     */
    readonly inspect: (options: ServiceInspectOptions) => Effect.Effect<Readonly<SwarmService>, ServicesError, never>;

    /**
     * Update a service
     *
     * @param id - ID or name of service.
     * @param body -
     * @param version - The version number of the service object being updated.
     *   This is required to avoid conflicting writes. This version number
     *   should be the value as currently set on the service _before_ the
     *   update. You can find the current version by calling `GET
     *   /services/{id}`
     * @param registryAuthFrom - If the `X-Registry-Auth` header is not
     *   specified, this parameter indicates where to find registry
     *   authorization credentials.
     * @param rollback - Set to this parameter to `previous` to cause a
     *   server-side rollback to the previous service spec. The supplied spec
     *   will be ignored in this case.
     * @param X-Registry-Auth - A base64url-encoded auth configuration for
     *   pulling from private registries.
     *
     *   Refer to the [authentication section](#section/Authentication) for
     *   details.
     */
    readonly update: (
        options: ServiceUpdateOptions
    ) => Effect.Effect<Readonly<SwarmServiceUpdateResponse>, ServicesError, never>;

    /**
     * Get service logs
     *
     * @param id - ID or name of the service
     * @param details - Show service context and extra details provided to logs.
     * @param follow - Keep connection after returning logs.
     * @param stdout - Return logs from `stdout`
     * @param stderr - Return logs from `stderr`
     * @param since - Only return logs since this time, as a UNIX timestamp
     * @param timestamps - Add timestamps to every log line
     * @param tail - Only return this number of log lines from the end of the
     *   logs. Specify as an integer or `all` to output all log lines.
     */
    readonly logs: (options: ServiceLogsOptions) => Stream.Stream<string, ServicesError, never>;
}

/**
 * @since 1.0.0
 * @category Services
 */
export const make: Effect.Effect<ServicesImpl, never, HttpClient.HttpClient.Default> = Effect.gen(function* () {
    const defaultClient = yield* HttpClient.HttpClient;

    const client = defaultClient.pipe(HttpClient.filterStatusOk);

    const voidClient = client.pipe(HttpClient.transform(Effect.asVoid));
    const ServicesClient = client.pipe(
        HttpClient.mapEffect(HttpClientResponse.schemaBodyJson(Schema.Array(SwarmService)))
    );
    const ServiceCreateResponseClient = client.pipe(
        HttpClient.mapEffect(HttpClientResponse.schemaBodyJson(SwarmServiceCreateResponse))
    );
    const ServiceClient = client.pipe(HttpClient.mapEffect(HttpClientResponse.schemaBodyJson(SwarmService)));
    const ServiceUpdateResponseClient = client.pipe(
        HttpClient.mapEffect(HttpClientResponse.schemaBodyJson(SwarmServiceUpdateResponse))
    );

    const list_ = (
        options?: ServiceListOptions | undefined
    ): Effect.Effect<Readonly<Array<SwarmService>>, ServicesError, never> =>
        Function.pipe(
            HttpClientRequest.get("/services"),
            maybeAddQueryParameter(
                "filters",
                Function.pipe(options?.filters, Option.fromNullable, Option.map(JSON.stringify))
            ),
            maybeAddQueryParameter("status", Option.fromNullable(options?.status)),
            ServicesClient,
            Effect.mapError((cause) => new ServicesError({ method: "list", cause })),
            Effect.scoped
        );

    const create_ = (
        options: ServiceCreateOptions
    ): Effect.Effect<Readonly<SwarmServiceCreateResponse>, ServicesError, never> =>
        Function.pipe(
            HttpClientRequest.post("/services/create"),
            HttpClientRequest.setHeader("X-Registry-Auth", ""),
            HttpClientRequest.schemaBody(SwarmServiceSpec)(options.body),
            Effect.flatMap(ServiceCreateResponseClient),
            Effect.mapError((cause) => new ServicesError({ method: "create", cause })),
            Effect.scoped
        );

    const delete_ = (options: ServiceDeleteOptions): Effect.Effect<void, ServicesError, never> =>
        Function.pipe(
            HttpClientRequest.del("/services/{id}".replace("{id}", encodeURIComponent(options.id))),
            voidClient,
            Effect.mapError((cause) => new ServicesError({ method: "delete", cause })),
            Effect.scoped
        );

    const inspect_ = (options: ServiceInspectOptions): Effect.Effect<Readonly<SwarmService>, ServicesError, never> =>
        Function.pipe(
            HttpClientRequest.get("/services/{id}".replace("{id}", encodeURIComponent(options.id))),
            maybeAddQueryParameter("insertDefaults", Option.fromNullable(options.insertDefaults)),
            ServiceClient,
            Effect.mapError((cause) => new ServicesError({ method: "inspect", cause })),
            Effect.scoped
        );

    const update_ = (
        options: ServiceUpdateOptions
    ): Effect.Effect<Readonly<SwarmServiceUpdateResponse>, ServicesError, never> =>
        Function.pipe(
            HttpClientRequest.post("/services/{id}/update".replace("{id}", encodeURIComponent(options.id))),
            HttpClientRequest.setHeader("X-Registry-Auth", ""),
            maybeAddQueryParameter("version", Option.some(options.version)),
            maybeAddQueryParameter("registryAuthFrom", Option.fromNullable(options.registryAuthFrom)),
            maybeAddQueryParameter("rollback", Option.fromNullable(options.rollback)),
            HttpClientRequest.schemaBody(SwarmServiceSpec)(options.body),
            Effect.flatMap(ServiceUpdateResponseClient),
            Effect.mapError((cause) => new ServicesError({ method: "update", cause })),
            Effect.scoped
        );

    const logs_ = (options: ServiceLogsOptions): Stream.Stream<string, ServicesError, never> =>
        Function.pipe(
            HttpClientRequest.get("/services/{id}/logs".replace("{id}", encodeURIComponent(options.id))),
            maybeAddQueryParameter("details", Option.fromNullable(options.details)),
            maybeAddQueryParameter("follow", Option.fromNullable(options.follow)),
            maybeAddQueryParameter("stdout", Option.fromNullable(options.stdout)),
            maybeAddQueryParameter("stderr", Option.fromNullable(options.stderr)),
            maybeAddQueryParameter("since", Option.fromNullable(options.since)),
            maybeAddQueryParameter("timestamps", Option.fromNullable(options.timestamps)),
            maybeAddQueryParameter("tail", Option.fromNullable(options.tail)),
            client,
            HttpClientResponse.stream,
            Stream.decodeText("utf8"),
            Stream.mapError((cause) => new ServicesError({ method: "logs", cause }))
        );

    return {
        list: list_,
        create: create_,
        delete: delete_,
        inspect: inspect_,
        update: update_,
        logs: logs_,
    };
});

/**
 * Services service
 *
 * @since 1.0.0
 * @category Tags
 */
export class Services extends Effect.Tag("@the-moby-effect/endpoints/Services")<Services, ServicesImpl>() {}

/**
 * Configs layer that depends on the MobyConnectionAgent
 *
 * @since 1.0.0
 * @category Layers
 */
export const layer: Layer.Layer<Services, never, HttpClient.HttpClient.Default> = Layer.effect(Services, make);
