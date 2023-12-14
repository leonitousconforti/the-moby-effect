import * as NodeHttp from "@effect/platform-node/HttpClient";
import * as Schema from "@effect/schema/Schema";
import { Data, Effect } from "effect";

import { IMobyConnectionAgent, MobyConnectionAgent, WithConnectionAgentProvided } from "./agent-helpers.js";
import { addHeader, addQueryParameter, responseErrorHandler, setBody } from "./request-helpers.js";

import {
    IdUpdateBody1,
    Service,
    ServiceCreateResponse,
    ServiceCreateResponseSchema,
    ServiceSchema,
    ServiceUpdateResponse,
    ServiceUpdateResponseSchema,
    ServicesCreateBody,
} from "./schemas.js";

export class ServiceCreateError extends Data.TaggedError("ServiceCreateError")<{ message: string }> {}
export class ServiceDeleteError extends Data.TaggedError("ServiceDeleteError")<{ message: string }> {}
export class ServiceInspectError extends Data.TaggedError("ServiceInspectError")<{ message: string }> {}
export class ServiceListError extends Data.TaggedError("ServiceListError")<{ message: string }> {}
export class ServiceLogsError extends Data.TaggedError("ServiceLogsError")<{ message: string }> {}
export class ServiceUpdateError extends Data.TaggedError("ServiceUpdateError")<{ message: string }> {}

export interface ServiceCreateOptions {
    body: ServicesCreateBody;
    /**
     * A base64url-encoded auth configuration for pulling from private
     * registries. Refer to the [authentication
     * section](#section/Authentication) for details.
     */
    X_Registry_Auth?: string;
}

export interface ServiceDeleteOptions {
    /** ID or name of service. */
    id: string;
}

export interface ServiceInspectOptions {
    /** ID or name of service. */
    id: string;
    /** Fill empty fields with default values. */
    insertDefaults?: boolean;
}

export interface ServiceListOptions {
    /**
     * A JSON encoded value of the filters (a `map[string][]string`) to process
     * on the services list. Available filters:
     *
     * - `id=<service id>`
     * - `label=<service label>`
     * - `mode=[\"replicated\"|\"global\"]`
     * - `name=<service name>`
     */
    filters?: string;
    /** Include service status, with count of running and desired tasks. */
    status?: boolean;
}

export interface ServiceLogsOptions {
    /** ID or name of the service */
    id: string;
    /** Show service context and extra details provided to logs. */
    details?: boolean;
    /** Keep connection after returning logs. */
    follow?: boolean;
    /** Return logs from `stdout` */
    stdout?: boolean;
    /** Return logs from `stderr` */
    stderr?: boolean;
    /** Only return logs since this time, as a UNIX timestamp */
    since?: number;
    /** Add timestamps to every log line */
    timestamps?: boolean;
    /**
     * Only return this number of log lines from the end of the logs. Specify as
     * an integer or `all` to output all log lines.
     */
    tail?: string;
}

export interface ServiceUpdateOptions {
    body: IdUpdateBody1;
    /** ID or name of service. */
    id: string;
    /**
     * The version number of the service object being updated. This is required
     * to avoid conflicting writes. This version number should be the value as
     * currently set on the service _before_ the update. You can find the
     * current version by calling `GET /services/{id}`
     */
    version: number;
    /**
     * If the `X-Registry-Auth` header is not specified, this parameter
     * indicates where to find registry authorization credentials.
     */
    registryAuthFrom?: string;
    /**
     * Set to this parameter to `previous` to cause a server-side rollback to
     * the previous service spec. The supplied spec will be ignored in this
     * case.
     */
    rollback?: string;
    /**
     * A base64url-encoded auth configuration for pulling from private
     * registries. Refer to the [authentication
     * section](#section/Authentication) for details.
     */
    X_Registry_Auth?: string;
}

/**
 * Create a service
 *
 * @param body -
 * @param X_Registry_Auth - A base64url-encoded auth configuration for pulling
 *   from private registries. Refer to the [authentication
 *   section](#section/Authentication) for details.
 */
export const serviceCreate = (
    options: ServiceCreateOptions
): Effect.Effect<IMobyConnectionAgent, ServiceCreateError, Readonly<ServiceCreateResponse>> =>
    Effect.gen(function* (_: Effect.Adapter) {
        const endpoint: string = "/services/create";
        const method: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" = "POST";
        const sanitizedEndpoint: string = endpoint;

        const agent: IMobyConnectionAgent = yield* _(MobyConnectionAgent);
        const client: NodeHttp.client.Client.Default = yield* _(
            NodeHttp.nodeClient.make.pipe(Effect.provideService(NodeHttp.nodeClient.HttpAgent, agent))
        );

        return NodeHttp.request
            .make(method)(sanitizedEndpoint)
            .pipe(NodeHttp.request.prependUrl(agent.nodeRequestUrl))
            .pipe(addHeader("X-Registry-Auth", String(options.X_Registry_Auth)))
            .pipe(addHeader("Content-Type", "application/json"))
            .pipe(setBody(options.body, "ServicesCreateBody"))
            .pipe(Effect.flatMap(client.pipe(NodeHttp.client.filterStatusOk)))
            .pipe(Effect.flatMap(NodeHttp.response.schemaBodyJson(ServiceCreateResponseSchema)))
            .pipe(responseErrorHandler(ServiceCreateError));
    }).pipe(Effect.flatten);

/**
 * Delete a service
 *
 * @param id - ID or name of service.
 */
export const serviceDelete = (
    options: ServiceDeleteOptions
): Effect.Effect<IMobyConnectionAgent, ServiceDeleteError, void> =>
    Effect.gen(function* (_: Effect.Adapter) {
        const endpoint: string = "/services/{id}";
        const method: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" = "DELETE";
        const sanitizedEndpoint: string = endpoint.replace(`{${"id"}}`, encodeURIComponent(String(options.id)));

        const agent: IMobyConnectionAgent = yield* _(MobyConnectionAgent);
        const client: NodeHttp.client.Client.Default = yield* _(
            NodeHttp.nodeClient.make.pipe(Effect.provideService(NodeHttp.nodeClient.HttpAgent, agent))
        );

        return NodeHttp.request
            .make(method)(sanitizedEndpoint)
            .pipe(NodeHttp.request.prependUrl(agent.nodeRequestUrl))
            .pipe(client.pipe(NodeHttp.client.filterStatusOk))
            .pipe(responseErrorHandler(ServiceDeleteError));
    }).pipe(Effect.flatten);

/**
 * Inspect a service
 *
 * @param id - ID or name of service.
 * @param insertDefaults - Fill empty fields with default values.
 */
export const serviceInspect = (
    options: ServiceInspectOptions
): Effect.Effect<IMobyConnectionAgent, ServiceInspectError, Readonly<Service>> =>
    Effect.gen(function* (_: Effect.Adapter) {
        const endpoint: string = "/services/{id}";
        const method: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" = "GET";
        const sanitizedEndpoint: string = endpoint.replace(`{${"id"}}`, encodeURIComponent(String(options.id)));

        const agent: IMobyConnectionAgent = yield* _(MobyConnectionAgent);
        const client: NodeHttp.client.Client.Default = yield* _(
            NodeHttp.nodeClient.make.pipe(Effect.provideService(NodeHttp.nodeClient.HttpAgent, agent))
        );

        return NodeHttp.request
            .make(method)(sanitizedEndpoint)
            .pipe(NodeHttp.request.prependUrl(agent.nodeRequestUrl))
            .pipe(addQueryParameter("insertDefaults", options.insertDefaults))
            .pipe(client.pipe(NodeHttp.client.filterStatusOk))
            .pipe(Effect.flatMap(NodeHttp.response.schemaBodyJson(ServiceSchema)))
            .pipe(responseErrorHandler(ServiceInspectError));
    }).pipe(Effect.flatten);

/**
 * List services
 *
 * @param filters - A JSON encoded value of the filters (a
 *   `map[string][]string`) to process on the services list. Available filters:
 *
 *   - `id=<service id>`
 *   - `label=<service label>`
 *   - `mode=[\"replicated\"|\"global\"]`
 *   - `name=<service name>`
 *
 * @param status - Include service status, with count of running and desired
 *   tasks.
 */
export const serviceList = (
    options?: ServiceListOptions | undefined
): Effect.Effect<IMobyConnectionAgent, ServiceListError, Readonly<Array<Service>>> =>
    Effect.gen(function* (_: Effect.Adapter) {
        const endpoint: string = "/services";
        const method: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" = "GET";
        const sanitizedEndpoint: string = endpoint;

        const agent: IMobyConnectionAgent = yield* _(MobyConnectionAgent);
        const client: NodeHttp.client.Client.Default = yield* _(
            NodeHttp.nodeClient.make.pipe(Effect.provideService(NodeHttp.nodeClient.HttpAgent, agent))
        );

        return NodeHttp.request
            .make(method)(sanitizedEndpoint)
            .pipe(NodeHttp.request.prependUrl(agent.nodeRequestUrl))
            .pipe(addQueryParameter("filters", options?.filters))
            .pipe(addQueryParameter("status", options?.status))
            .pipe(client.pipe(NodeHttp.client.filterStatusOk))
            .pipe(Effect.flatMap(NodeHttp.response.schemaBodyJson(Schema.array(ServiceSchema))))
            .pipe(responseErrorHandler(ServiceListError));
    }).pipe(Effect.flatten);

/**
 * Get `stdout` and `stderr` logs from a service. See also
 * [`/containers/{id}/logs`](#operation/ContainerLogs). **Note**: This endpoint
 * works only for services with the `local`, `json-file` or `journald` logging
 * drivers.
 *
 * @param id - ID or name of the service
 * @param details - Show service context and extra details provided to logs.
 * @param follow - Keep connection after returning logs.
 * @param stdout - Return logs from `stdout`
 * @param stderr - Return logs from `stderr`
 * @param since - Only return logs since this time, as a UNIX timestamp
 * @param timestamps - Add timestamps to every log line
 * @param tail - Only return this number of log lines from the end of the logs.
 *   Specify as an integer or `all` to output all log lines.
 */
export const serviceLogs = (
    options: ServiceLogsOptions
): Effect.Effect<IMobyConnectionAgent, ServiceLogsError, Readonly<Blob>> =>
    Effect.gen(function* (_: Effect.Adapter) {
        const endpoint: string = "/services/{id}/logs";
        const method: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" = "GET";
        const sanitizedEndpoint: string = endpoint.replace(`{${"id"}}`, encodeURIComponent(String(options.id)));

        const agent: IMobyConnectionAgent = yield* _(MobyConnectionAgent);
        const client: NodeHttp.client.Client.Default = yield* _(
            NodeHttp.nodeClient.make.pipe(Effect.provideService(NodeHttp.nodeClient.HttpAgent, agent))
        );

        return NodeHttp.request
            .make(method)(sanitizedEndpoint)
            .pipe(NodeHttp.request.prependUrl(agent.nodeRequestUrl))
            .pipe(addQueryParameter("details", options.details))
            .pipe(addQueryParameter("follow", options.follow))
            .pipe(addQueryParameter("stdout", options.stdout))
            .pipe(addQueryParameter("stderr", options.stderr))
            .pipe(addQueryParameter("since", options.since))
            .pipe(addQueryParameter("timestamps", options.timestamps))
            .pipe(addQueryParameter("tail", options.tail))
            .pipe(client.pipe(NodeHttp.client.filterStatusOk))
            .pipe(Effect.flatMap((clientResponse) => clientResponse.text))
            .pipe(Effect.map((responseText) => new Blob([responseText])))
            .pipe(responseErrorHandler(ServiceLogsError));
    }).pipe(Effect.flatten);

/**
 * Update a service
 *
 * @param body -
 * @param id - ID or name of service.
 * @param version - The version number of the service object being updated. This
 *   is required to avoid conflicting writes. This version number should be the
 *   value as currently set on the service _before_ the update. You can find the
 *   current version by calling `GET /services/{id}`
 * @param registryAuthFrom - If the `X-Registry-Auth` header is not specified,
 *   this parameter indicates where to find registry authorization credentials.
 * @param rollback - Set to this parameter to `previous` to cause a server-side
 *   rollback to the previous service spec. The supplied spec will be ignored in
 *   this case.
 * @param X_Registry_Auth - A base64url-encoded auth configuration for pulling
 *   from private registries. Refer to the [authentication
 *   section](#section/Authentication) for details.
 */
export const serviceUpdate = (
    options: ServiceUpdateOptions
): Effect.Effect<IMobyConnectionAgent, ServiceUpdateError, Readonly<ServiceUpdateResponse>> =>
    Effect.gen(function* (_: Effect.Adapter) {
        const endpoint: string = "/services/{id}/update";
        const method: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" = "POST";
        const sanitizedEndpoint: string = endpoint.replace(`{${"id"}}`, encodeURIComponent(String(options.id)));

        const agent: IMobyConnectionAgent = yield* _(MobyConnectionAgent);
        const client: NodeHttp.client.Client.Default = yield* _(
            NodeHttp.nodeClient.make.pipe(Effect.provideService(NodeHttp.nodeClient.HttpAgent, agent))
        );

        return NodeHttp.request
            .make(method)(sanitizedEndpoint)
            .pipe(NodeHttp.request.prependUrl(agent.nodeRequestUrl))
            .pipe(addHeader("X-Registry-Auth", String(options.X_Registry_Auth)))
            .pipe(addQueryParameter("version", options.version))
            .pipe(addQueryParameter("registryAuthFrom", options.registryAuthFrom))
            .pipe(addQueryParameter("rollback", options.rollback))
            .pipe(addHeader("Content-Type", "application/json"))
            .pipe(setBody(options.body, "IdUpdateBody1"))
            .pipe(Effect.flatMap(client.pipe(NodeHttp.client.filterStatusOk)))
            .pipe(Effect.flatMap(NodeHttp.response.schemaBodyJson(ServiceUpdateResponseSchema)))
            .pipe(responseErrorHandler(ServiceUpdateError));
    }).pipe(Effect.flatten);

export interface IServicesService {
    Errors:
        | ServiceCreateError
        | ServiceDeleteError
        | ServiceInspectError
        | ServiceListError
        | ServiceLogsError
        | ServiceUpdateError;

    /**
     * Create a service
     *
     * @param body -
     * @param X_Registry_Auth - A base64url-encoded auth configuration for
     *   pulling from private registries. Refer to the [authentication
     *   section](#section/Authentication) for details.
     */
    serviceCreate: WithConnectionAgentProvided<typeof serviceCreate>;

    /**
     * Delete a service
     *
     * @param id - ID or name of service.
     */
    serviceDelete: WithConnectionAgentProvided<typeof serviceDelete>;

    /**
     * Inspect a service
     *
     * @param id - ID or name of service.
     * @param insertDefaults - Fill empty fields with default values.
     */
    serviceInspect: WithConnectionAgentProvided<typeof serviceInspect>;

    /**
     * List services
     *
     * @param filters - A JSON encoded value of the filters (a
     *   `map[string][]string`) to process on the services list. Available
     *   filters:
     *
     *   - `id=<service id>`
     *   - `label=<service label>`
     *   - `mode=[\"replicated\"|\"global\"]`
     *   - `name=<service name>`
     *
     * @param status - Include service status, with count of running and desired
     *   tasks.
     */
    serviceList: WithConnectionAgentProvided<typeof serviceList>;

    /**
     * Get `stdout` and `stderr` logs from a service. See also
     * [`/containers/{id}/logs`](#operation/ContainerLogs). **Note**: This
     * endpoint works only for services with the `local`, `json-file` or
     * `journald` logging drivers.
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
    serviceLogs: WithConnectionAgentProvided<typeof serviceLogs>;

    /**
     * Update a service
     *
     * @param body -
     * @param id - ID or name of service.
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
     * @param X_Registry_Auth - A base64url-encoded auth configuration for
     *   pulling from private registries. Refer to the [authentication
     *   section](#section/Authentication) for details.
     */
    serviceUpdate: WithConnectionAgentProvided<typeof serviceUpdate>;
}
