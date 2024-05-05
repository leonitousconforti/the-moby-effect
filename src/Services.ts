/**
 * Services service
 *
 * @since 1.0.0
 */

import * as HttpClient from "@effect/platform/HttpClient";
import * as Schema from "@effect/schema/Schema";
import * as Context from "effect/Context";
import * as Data from "effect/Data";
import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as Layer from "effect/Layer";
import * as Scope from "effect/Scope";
import * as Stream from "effect/Stream";

import {
    IMobyConnectionAgent,
    IMobyConnectionAgentImpl,
    MobyConnectionAgent,
    MobyConnectionOptions,
    MobyHttpClientLive,
    getAgent,
} from "./Agent.js";
import { addQueryParameter, responseErrorHandler, streamErrorHandler } from "./Requests.js";
import { Service, ServiceCreateResponse, ServiceSpec, ServiceUpdateResponse } from "./Schemas.js";

/**
 * @since 1.0.0
 * @category Errors
 */
export class ServicesError extends Data.TaggedError("ServicesError")<{
    method: string;
    message: string;
}> {}

/** @since 1.0.0 */
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
     */
    readonly filters?: string;
    /** Include service status, with count of running and desired tasks. */
    readonly status?: boolean;
}

/** @since 1.0.0 */
export interface ServiceCreateOptions {
    readonly body: ServiceSpec;
    /**
     * A base64url-encoded auth configuration for pulling from private
     * registries.
     *
     * Refer to the [authentication section](#section/Authentication) for
     * details.
     */
    readonly "X-Registry-Auth"?: string;
}

/** @since 1.0.0 */
export interface ServiceDeleteOptions {
    /** ID or name of service. */
    readonly id: string;
}

/** @since 1.0.0 */
export interface ServiceInspectOptions {
    /** ID or name of service. */
    readonly id: string;
    /** Fill empty fields with default values. */
    readonly insertDefaults?: boolean;
}

/** @since 1.0.0 */
export interface ServiceUpdateOptions {
    /** ID or name of service. */
    readonly id: string;
    readonly body: ServiceSpec;
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

/** @since 1.0.0 */
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
export interface Services {
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
    readonly list: (options?: ServiceListOptions | undefined) => Effect.Effect<Readonly<Array<Service>>, ServicesError>;

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
    readonly create: (options: ServiceCreateOptions) => Effect.Effect<Readonly<ServiceCreateResponse>, ServicesError>;

    /**
     * Delete a service
     *
     * @param id - ID or name of service.
     */
    readonly delete: (options: ServiceDeleteOptions) => Effect.Effect<void, ServicesError>;

    /**
     * Inspect a service
     *
     * @param id - ID or name of service.
     * @param insertDefaults - Fill empty fields with default values.
     */
    readonly inspect: (options: ServiceInspectOptions) => Effect.Effect<Readonly<Service>, ServicesError>;

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
    readonly update: (options: ServiceUpdateOptions) => Effect.Effect<Readonly<ServiceUpdateResponse>, ServicesError>;

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
    readonly logs: (options: ServiceLogsOptions) => Effect.Effect<Stream.Stream<string, ServicesError>, ServicesError>;
}

/**
 * @since 1.0.0
 * @category Services
 */
export const make: Effect.Effect<Services, never, IMobyConnectionAgent | HttpClient.client.Client.Default> = Effect.gen(
    function* (_: Effect.Adapter) {
        const agent = yield* _(MobyConnectionAgent);
        const defaultClient = yield* _(HttpClient.client.Client);

        const client = defaultClient.pipe(
            HttpClient.client.mapRequest(HttpClient.request.prependUrl(`${agent.nodeRequestUrl}/services`)),
            HttpClient.client.filterStatusOk
        );

        const voidClient = client.pipe(HttpClient.client.transform(Effect.asVoid));
        const ServicesClient = client.pipe(
            HttpClient.client.mapEffect(HttpClient.response.schemaBodyJson(Schema.Array(Service)))
        );
        const ServiceCreateResponseClient = client.pipe(
            HttpClient.client.mapEffect(HttpClient.response.schemaBodyJson(ServiceCreateResponse))
        );
        const ServiceClient = client.pipe(HttpClient.client.mapEffect(HttpClient.response.schemaBodyJson(Service)));
        const ServiceUpdateResponseClient = client.pipe(
            HttpClient.client.mapEffect(HttpClient.response.schemaBodyJson(ServiceUpdateResponse))
        );

        const streamHandler = (method: string) =>
            streamErrorHandler((message) => new ServicesError({ method, message }));
        const responseHandler = (method: string) =>
            responseErrorHandler((message) => new ServicesError({ method, message }));

        const list_ = (
            options?: ServiceListOptions | undefined
        ): Effect.Effect<Readonly<Array<Service>>, ServicesError> =>
            Function.pipe(
                HttpClient.request.get(""),
                addQueryParameter("filters", options?.filters),
                addQueryParameter("status", options?.status),
                ServicesClient,
                Effect.catchAll(responseHandler("list")),
                Effect.scoped
            );

        const create_ = (
            options: ServiceCreateOptions
        ): Effect.Effect<Readonly<ServiceCreateResponse>, ServicesError> =>
            Function.pipe(
                HttpClient.request.post("/create"),
                HttpClient.request.setHeader("X-Registry-Auth", ""),
                HttpClient.request.schemaBody(ServiceSpec)(options.body),
                Effect.flatMap(ServiceCreateResponseClient),
                Effect.catchAll(responseHandler("create")),
                Effect.scoped
            );

        const delete_ = (options: ServiceDeleteOptions): Effect.Effect<void, ServicesError> =>
            Function.pipe(
                HttpClient.request.del("/{id}".replace("{id}", encodeURIComponent(options.id))),
                voidClient,
                Effect.catchAll(responseHandler("delete")),
                Effect.scoped
            );

        const inspect_ = (options: ServiceInspectOptions): Effect.Effect<Readonly<Service>, ServicesError> =>
            Function.pipe(
                HttpClient.request.get("/{id}".replace("{id}", encodeURIComponent(options.id))),
                addQueryParameter("insertDefaults", options.insertDefaults),
                ServiceClient,
                Effect.catchAll(responseHandler("inspect")),
                Effect.scoped
            );

        const update_ = (
            options: ServiceUpdateOptions
        ): Effect.Effect<Readonly<ServiceUpdateResponse>, ServicesError> =>
            Function.pipe(
                HttpClient.request.post("/{id}/update".replace("{id}", encodeURIComponent(options.id))),
                HttpClient.request.setHeader("X-Registry-Auth", ""),
                addQueryParameter("version", options.version),
                addQueryParameter("registryAuthFrom", options.registryAuthFrom),
                addQueryParameter("rollback", options.rollback),
                HttpClient.request.schemaBody(ServiceSpec)(options.body),
                Effect.flatMap(ServiceUpdateResponseClient),
                Effect.catchAll(responseHandler("update")),
                Effect.scoped
            );

        const logs_ = (
            options: ServiceLogsOptions
        ): Effect.Effect<Stream.Stream<string, ServicesError>, ServicesError> =>
            Function.pipe(
                HttpClient.request.get("/{id}/logs".replace("{id}", encodeURIComponent(options.id))),
                addQueryParameter("details", options.details),
                addQueryParameter("follow", options.follow),
                addQueryParameter("stdout", options.stdout),
                addQueryParameter("stderr", options.stderr),
                addQueryParameter("since", options.since),
                addQueryParameter("timestamps", options.timestamps),
                addQueryParameter("tail", options.tail),
                client,
                Effect.map((response) => response.stream),
                Effect.map(Stream.decodeText("utf8")),
                Effect.map(Stream.catchAll(streamHandler("logs"))),
                Effect.catchAll(responseHandler("logs")),
                Effect.scoped
            );

        return { list: list_, create: create_, delete: delete_, inspect: inspect_, update: update_, logs: logs_ };
    }
);

/**
 * Services service
 *
 * @since 1.0.0
 * @category Tags
 */
export const Services: Context.Tag<Services, Services> = Context.GenericTag<Services>("@the-moby-effect/Services");

/**
 * Configs layer that depends on the MobyConnectionAgent
 *
 * @since 1.0.0
 * @category Layers
 */
export const layer: Layer.Layer<Services, never, IMobyConnectionAgent> = Layer.effect(Services, make).pipe(
    Layer.provide(MobyHttpClientLive)
);

/**
 * Constructs a layer from an agent effect
 *
 * @since 1.0.0
 * @category Layers
 */
export const fromAgent = (
    agent: Effect.Effect<IMobyConnectionAgentImpl, never, Scope.Scope>
): Layer.Layer<Services, never, Scope.Scope> => layer.pipe(Layer.provide(Layer.effect(MobyConnectionAgent, agent)));

/**
 * Constructs a layer from agent connection options
 *
 * @since 1.0.0
 * @category Layers
 */
export const fromConnectionOptions = (
    connectionOptions: MobyConnectionOptions
): Layer.Layer<Services, never, Scope.Scope> => fromAgent(getAgent(connectionOptions));
