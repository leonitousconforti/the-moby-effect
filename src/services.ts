import * as NodeHttp from "@effect/platform-node/HttpClient";
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
    MobyConnectionAgent,
    MobyConnectionOptions,
    MobyHttpClientLive,
    getAgent,
} from "./agent-helpers.js";
import { addQueryParameter, responseErrorHandler, streamErrorHandler } from "./request-helpers.js";
import { Service, ServiceCreateResponse, ServiceSpec, ServiceUpdateResponse } from "./schemas.js";

export class ServicesError extends Data.TaggedError("ServicesError")<{
    method: string;
    message: string;
}> {}

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

export interface ServiceDeleteOptions {
    /** ID or name of service. */
    readonly id: string;
}

export interface ServiceInspectOptions {
    /** ID or name of service. */
    readonly id: string;
    /** Fill empty fields with default values. */
    readonly insertDefaults?: boolean;
}

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
    readonly list: (
        options?: ServiceListOptions | undefined
    ) => Effect.Effect<never, ServicesError, Readonly<Array<Service>>>;

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
    ) => Effect.Effect<never, ServicesError, Readonly<ServiceCreateResponse>>;

    /**
     * Delete a service
     *
     * @param id - ID or name of service.
     */
    readonly delete: (options: ServiceDeleteOptions) => Effect.Effect<never, ServicesError, void>;

    /**
     * Inspect a service
     *
     * @param id - ID or name of service.
     * @param insertDefaults - Fill empty fields with default values.
     */
    readonly inspect: (options: ServiceInspectOptions) => Effect.Effect<never, ServicesError, Readonly<Service>>;

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
    ) => Effect.Effect<never, ServicesError, Readonly<ServiceUpdateResponse>>;

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
    readonly logs: (
        options: ServiceLogsOptions
    ) => Effect.Effect<never, ServicesError, Stream.Stream<never, ServicesError, string>>;
}

const make: Effect.Effect<IMobyConnectionAgent | NodeHttp.client.Client.Default, never, Services> = Effect.gen(
    function* (_: Effect.Adapter) {
        const agent = yield* _(MobyConnectionAgent);
        const defaultClient = yield* _(NodeHttp.client.Client);

        const client = defaultClient.pipe(
            NodeHttp.client.mapRequest(NodeHttp.request.prependUrl(`${agent.nodeRequestUrl}/services`)),
            NodeHttp.client.filterStatusOk
        );

        const voidClient = client.pipe(NodeHttp.client.transform(Effect.asUnit));
        const ServicesClient = client.pipe(
            NodeHttp.client.mapEffect(NodeHttp.response.schemaBodyJson(Schema.array(Service)))
        );
        const ServiceCreateResponseClient = client.pipe(
            NodeHttp.client.mapEffect(NodeHttp.response.schemaBodyJson(ServiceCreateResponse))
        );
        const ServiceClient = client.pipe(NodeHttp.client.mapEffect(NodeHttp.response.schemaBodyJson(Service)));
        const ServiceUpdateResponseClient = client.pipe(
            NodeHttp.client.mapEffect(NodeHttp.response.schemaBodyJson(ServiceUpdateResponse))
        );

        const streamHandler = (method: string) =>
            streamErrorHandler((message) => new ServicesError({ method, message }));
        const responseHandler = (method: string) =>
            responseErrorHandler((message) => new ServicesError({ method, message }));

        const list_ = (
            options?: ServiceListOptions | undefined
        ): Effect.Effect<never, ServicesError, Readonly<Array<Service>>> =>
            Function.pipe(
                NodeHttp.request.get(""),
                addQueryParameter("filters", options?.filters),
                addQueryParameter("status", options?.status),
                ServicesClient,
                Effect.catchAll(responseHandler("list"))
            );

        const create_ = (
            options: ServiceCreateOptions
        ): Effect.Effect<never, ServicesError, Readonly<ServiceCreateResponse>> =>
            Function.pipe(
                NodeHttp.request.post("/create"),
                NodeHttp.request.setHeader("X-Registry-Auth", ""),
                NodeHttp.request.schemaBody(ServiceSpec)(options.body),
                Effect.flatMap(ServiceCreateResponseClient),
                Effect.catchAll(responseHandler("create"))
            );

        const delete_ = (options: ServiceDeleteOptions): Effect.Effect<never, ServicesError, void> =>
            Function.pipe(
                NodeHttp.request.del("/{id}".replace("{id}", encodeURIComponent(options.id))),
                voidClient,
                Effect.catchAll(responseHandler("delete"))
            );

        const inspect_ = (options: ServiceInspectOptions): Effect.Effect<never, ServicesError, Readonly<Service>> =>
            Function.pipe(
                NodeHttp.request.get("/{id}".replace("{id}", encodeURIComponent(options.id))),
                addQueryParameter("insertDefaults", options.insertDefaults),
                ServiceClient,
                Effect.catchAll(responseHandler("inspect"))
            );

        const update_ = (
            options: ServiceUpdateOptions
        ): Effect.Effect<never, ServicesError, Readonly<ServiceUpdateResponse>> =>
            Function.pipe(
                NodeHttp.request.post("/{id}/update".replace("{id}", encodeURIComponent(options.id))),
                NodeHttp.request.setHeader("X-Registry-Auth", ""),
                addQueryParameter("version", options.version),
                addQueryParameter("registryAuthFrom", options.registryAuthFrom),
                addQueryParameter("rollback", options.rollback),
                NodeHttp.request.schemaBody(ServiceSpec)(options.body),
                Effect.flatMap(ServiceUpdateResponseClient),
                Effect.catchAll(responseHandler("update"))
            );

        const logs_ = (
            options: ServiceLogsOptions
        ): Effect.Effect<never, ServicesError, Stream.Stream<never, ServicesError, string>> =>
            Function.pipe(
                NodeHttp.request.get("/{id}/logs".replace("{id}", encodeURIComponent(options.id))),
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
                Effect.catchAll(responseHandler("logs"))
            );

        return { list: list_, create: create_, delete: delete_, inspect: inspect_, update: update_, logs: logs_ };
    }
);

export const Services = Context.Tag<Services>("the-moby-effect/Services");
export const layer = Layer.effect(Services, make).pipe(Layer.provide(MobyHttpClientLive));

export const fromAgent = (agent: Effect.Effect<Scope.Scope, never, IMobyConnectionAgent>) =>
    layer.pipe(Layer.provide(Layer.scoped(MobyConnectionAgent, agent)));

export const fromConnectionOptions = (connectionOptions: MobyConnectionOptions) =>
    fromAgent(getAgent(connectionOptions));
