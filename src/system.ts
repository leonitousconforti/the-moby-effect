import * as NodeHttp from "@effect/platform-node/HttpClient";
import { Data, Effect } from "effect";

import { IMobyConnectionAgent, MobyConnectionAgent, WithConnectionAgentProvided } from "./agent-helpers.js";
import { addHeader, addQueryParameter, responseErrorHandler, setBody } from "./request-helpers.js";

import {
    AuthConfig,
    EventMessage,
    EventMessageSchema,
    SystemAuthResponse,
    SystemAuthResponseSchema,
    SystemDataUsageResponse,
    SystemDataUsageResponseSchema,
    SystemInfo,
    SystemInfoSchema,
    SystemVersion,
    SystemVersionSchema,
} from "./schemas.js";

export class SystemAuthError extends Data.TaggedError("SystemAuthError")<{ message: string }> {}
export class SystemDataUsageError extends Data.TaggedError("SystemDataUsageError")<{ message: string }> {}
export class SystemEventsError extends Data.TaggedError("SystemEventsError")<{ message: string }> {}
export class SystemInfoError extends Data.TaggedError("SystemInfoError")<{ message: string }> {}
export class SystemPingError extends Data.TaggedError("SystemPingError")<{ message: string }> {}
export class SystemPingHeadError extends Data.TaggedError("SystemPingHeadError")<{ message: string }> {}
export class SystemVersionError extends Data.TaggedError("SystemVersionError")<{ message: string }> {}

export interface SystemAuthOptions {
    /** Authentication to check */
    body?: AuthConfig;
}

export interface SystemDataUsageOptions {
    /** Object types, for which to compute and return data. */
    type?: Array<string>;
}

export interface SystemEventsOptions {
    /** Show events created since this timestamp then stream new events. */
    since?: string;
    /** Show events created until this timestamp then stop streaming. */
    until?: string;
    /**
     * A JSON encoded value of filters (a `map[string][]string`) to process on
     * the event list. Available filters:
     *
     * - `config=<string>` config name or ID
     * - `container=<string>` container name or ID
     * - `daemon=<string>` daemon name or ID
     * - `event=<string>` event type
     * - `image=<string>` image name or ID
     * - `label=<string>` image or container label
     * - `network=<string>` network name or ID
     * - `node=<string>` node ID
     * - `plugin`=<string> plugin name or ID
     * - `scope`=<string> local or swarm
     * - `secret=<string>` secret name or ID
     * - `service=<string>` service name or ID
     * - `type=<string>` object to filter by, one of `container`, `image`,
     *   `volume`, `network`, `daemon`, `plugin`, `node`, `service`, `secret` or
     *   `config`
     * - `volume=<string>` volume name
     */
    filters?: string;
}

/**
 * Validate credentials for a registry and, if available, get an identity token
 * for accessing the registry without password.
 *
 * @param body - Authentication to check
 */
export const systemAuth = (
    options: SystemAuthOptions
): Effect.Effect<IMobyConnectionAgent, SystemAuthError, Readonly<SystemAuthResponse>> =>
    Effect.gen(function* (_: Effect.Adapter) {
        const endpoint: string = "/auth";
        const method: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" = "POST";
        const sanitizedEndpoint: string = endpoint;

        const agent: IMobyConnectionAgent = yield* _(MobyConnectionAgent);
        const client: NodeHttp.client.Client.Default = yield* _(
            NodeHttp.nodeClient.make.pipe(Effect.provideService(NodeHttp.nodeClient.HttpAgent, agent))
        );

        return NodeHttp.request
            .make(method)(sanitizedEndpoint)
            .pipe(NodeHttp.request.prependUrl(agent.nodeRequestUrl))
            .pipe(addHeader("Content-Type", "application/json"))
            .pipe(setBody(options.body, "AuthConfig"))
            .pipe(Effect.flatMap(client.pipe(NodeHttp.client.filterStatusOk)))
            .pipe(Effect.flatMap(NodeHttp.response.schemaBodyJson(SystemAuthResponseSchema)))
            .pipe(responseErrorHandler(SystemAuthError));
    }).pipe(Effect.flatten);

/**
 * Get data usage information
 *
 * @param type - Object types, for which to compute and return data.
 */
export const systemDataUsage = (
    options?: SystemDataUsageOptions | undefined
): Effect.Effect<IMobyConnectionAgent, SystemDataUsageError, Readonly<SystemDataUsageResponse>> =>
    Effect.gen(function* (_: Effect.Adapter) {
        const endpoint: string = "/system/df";
        const method: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" = "GET";
        const sanitizedEndpoint: string = endpoint;

        const agent: IMobyConnectionAgent = yield* _(MobyConnectionAgent);
        const client: NodeHttp.client.Client.Default = yield* _(
            NodeHttp.nodeClient.make.pipe(Effect.provideService(NodeHttp.nodeClient.HttpAgent, agent))
        );

        return NodeHttp.request
            .make(method)(sanitizedEndpoint)
            .pipe(NodeHttp.request.prependUrl(agent.nodeRequestUrl))
            .pipe(addQueryParameter("type", options?.type))
            .pipe(client.pipe(NodeHttp.client.filterStatusOk))
            .pipe(Effect.flatMap(NodeHttp.response.schemaBodyJson(SystemDataUsageResponseSchema)))
            .pipe(responseErrorHandler(SystemDataUsageError));
    }).pipe(Effect.flatten);

/**
 * Stream real-time events from the server. Various objects within Docker report
 * events when something happens to them. Containers report these events:
 * `attach`, `commit`, `copy`, `create`, `destroy`, `detach`, `die`,
 * `exec_create`, `exec_detach`, `exec_start`, `exec_die`, `export`,
 * `health_status`, `kill`, `oom`, `pause`, `rename`, `resize`, `restart`,
 * `start`, `stop`, `top`, `unpause`, `update`, and `prune` Images report these
 * events: `delete`, `import`, `load`, `pull`, `push`, `save`, `tag`, `untag`,
 * and `prune` Volumes report these events: `create`, `mount`, `unmount`,
 * `destroy`, and `prune` Networks report these events: `create`, `connect`,
 * `disconnect`, `destroy`, `update`, `remove`, and `prune` The Docker daemon
 * reports these events: `reload` Services report these events: `create`,
 * `update`, and `remove` Nodes report these events: `create`, `update`, and
 * `remove` Secrets report these events: `create`, `update`, and `remove`
 * Configs report these events: `create`, `update`, and `remove` The Builder
 * reports `prune` events
 *
 * @param since - Show events created since this timestamp then stream new
 *   events.
 * @param until - Show events created until this timestamp then stop streaming.
 * @param filters - A JSON encoded value of filters (a `map[string][]string`) to
 *   process on the event list. Available filters:
 *
 *   - `config=<string>` config name or ID
 *   - `container=<string>` container name or ID
 *   - `daemon=<string>` daemon name or ID
 *   - `event=<string>` event type
 *   - `image=<string>` image name or ID
 *   - `label=<string>` image or container label
 *   - `network=<string>` network name or ID
 *   - `node=<string>` node ID
 *   - `plugin`=<string> plugin name or ID
 *   - `scope`=<string> local or swarm
 *   - `secret=<string>` secret name or ID
 *   - `service=<string>` service name or ID
 *   - `type=<string>` object to filter by, one of `container`, `image`, `volume`,
 *       `network`, `daemon`, `plugin`, `node`, `service`, `secret` or `config`
 *   - `volume=<string>` volume name
 */
export const systemEvents = (
    options: SystemEventsOptions
): Effect.Effect<IMobyConnectionAgent, SystemEventsError, Readonly<EventMessage>> =>
    Effect.gen(function* (_: Effect.Adapter) {
        const endpoint: string = "/events";
        const method: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" = "GET";
        const sanitizedEndpoint: string = endpoint;

        const agent: IMobyConnectionAgent = yield* _(MobyConnectionAgent);
        const client: NodeHttp.client.Client.Default = yield* _(
            NodeHttp.nodeClient.make.pipe(Effect.provideService(NodeHttp.nodeClient.HttpAgent, agent))
        );

        return NodeHttp.request
            .make(method)(sanitizedEndpoint)
            .pipe(NodeHttp.request.prependUrl(agent.nodeRequestUrl))
            .pipe(addQueryParameter("since", options.since))
            .pipe(addQueryParameter("until", options.until))
            .pipe(addQueryParameter("filters", options.filters))
            .pipe(client.pipe(NodeHttp.client.filterStatusOk))
            .pipe(Effect.flatMap(NodeHttp.response.schemaBodyJson(EventMessageSchema)))
            .pipe(responseErrorHandler(SystemEventsError));
    }).pipe(Effect.flatten);

/** Get system information */
export const systemInfo = (): Effect.Effect<IMobyConnectionAgent, SystemInfoError, Readonly<SystemInfo>> =>
    Effect.gen(function* (_: Effect.Adapter) {
        const endpoint: string = "/info";
        const method: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" = "GET";
        const sanitizedEndpoint: string = endpoint;

        const agent: IMobyConnectionAgent = yield* _(MobyConnectionAgent);
        const client: NodeHttp.client.Client.Default = yield* _(
            NodeHttp.nodeClient.make.pipe(Effect.provideService(NodeHttp.nodeClient.HttpAgent, agent))
        );

        return NodeHttp.request
            .make(method)(sanitizedEndpoint)
            .pipe(NodeHttp.request.prependUrl(agent.nodeRequestUrl))
            .pipe(client.pipe(NodeHttp.client.filterStatusOk))
            .pipe(Effect.flatMap(NodeHttp.response.schemaBodyJson(SystemInfoSchema)))
            .pipe(responseErrorHandler(SystemInfoError));
    }).pipe(Effect.flatten);

/** This is a dummy endpoint you can use to test if the server is accessible. */
export const systemPing = (): Effect.Effect<IMobyConnectionAgent, SystemPingError, Readonly<string>> =>
    Effect.gen(function* (_: Effect.Adapter) {
        const endpoint: string = "/_ping";
        const method: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" = "GET";
        const sanitizedEndpoint: string = endpoint;

        const agent: IMobyConnectionAgent = yield* _(MobyConnectionAgent);
        const client: NodeHttp.client.Client.Default = yield* _(
            NodeHttp.nodeClient.make.pipe(Effect.provideService(NodeHttp.nodeClient.HttpAgent, agent))
        );

        return NodeHttp.request
            .make(method)(sanitizedEndpoint)
            .pipe(NodeHttp.request.prependUrl(agent.nodeRequestUrl))
            .pipe(client.pipe(NodeHttp.client.filterStatusOk))
            .pipe(Effect.flatMap((response) => response.text))
            .pipe(responseErrorHandler(SystemPingError));
    }).pipe(Effect.flatten);

/** This is a dummy endpoint you can use to test if the server is accessible. */
export const systemPingHead = (): Effect.Effect<IMobyConnectionAgent, SystemPingHeadError, void> =>
    Effect.gen(function* (_: Effect.Adapter) {
        const endpoint: string = "/_ping";
        const method: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" = "HEAD";
        const sanitizedEndpoint: string = endpoint;

        const agent: IMobyConnectionAgent = yield* _(MobyConnectionAgent);
        const client: NodeHttp.client.Client.Default = yield* _(
            NodeHttp.nodeClient.make.pipe(Effect.provideService(NodeHttp.nodeClient.HttpAgent, agent))
        );

        return NodeHttp.request
            .make(method)(sanitizedEndpoint)
            .pipe(NodeHttp.request.prependUrl(agent.nodeRequestUrl))
            .pipe(client.pipe(NodeHttp.client.filterStatusOk))
            .pipe(responseErrorHandler(SystemPingHeadError));
    }).pipe(Effect.flatten);

/**
 * Returns the version of Docker that is running and various information about
 * the system that Docker is running on.
 */
export const systemVersion = (): Effect.Effect<IMobyConnectionAgent, SystemVersionError, Readonly<SystemVersion>> =>
    Effect.gen(function* (_: Effect.Adapter) {
        const endpoint: string = "/version";
        const method: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" = "GET";
        const sanitizedEndpoint: string = endpoint;

        const agent: IMobyConnectionAgent = yield* _(MobyConnectionAgent);
        const client: NodeHttp.client.Client.Default = yield* _(
            NodeHttp.nodeClient.make.pipe(Effect.provideService(NodeHttp.nodeClient.HttpAgent, agent))
        );

        return NodeHttp.request
            .make(method)(sanitizedEndpoint)
            .pipe(NodeHttp.request.prependUrl(agent.nodeRequestUrl))
            .pipe(client.pipe(NodeHttp.client.filterStatusOk))
            .pipe(Effect.flatMap(NodeHttp.response.schemaBodyJson(SystemVersionSchema)))
            .pipe(responseErrorHandler(SystemVersionError));
    }).pipe(Effect.flatten);

export interface ISystemService {
    Errors:
        | SystemAuthError
        | SystemDataUsageError
        | SystemEventsError
        | SystemInfoError
        | SystemPingError
        | SystemPingHeadError
        | SystemVersionError;

    /**
     * Validate credentials for a registry and, if available, get an identity
     * token for accessing the registry without password.
     *
     * @param body - Authentication to check
     */
    systemAuth: WithConnectionAgentProvided<typeof systemAuth>;

    /**
     * Get data usage information
     *
     * @param type - Object types, for which to compute and return data.
     */
    systemDataUsage: WithConnectionAgentProvided<typeof systemDataUsage>;

    /**
     * Stream real-time events from the server. Various objects within Docker
     * report events when something happens to them. Containers report these
     * events: `attach`, `commit`, `copy`, `create`, `destroy`, `detach`, `die`,
     * `exec_create`, `exec_detach`, `exec_start`, `exec_die`, `export`,
     * `health_status`, `kill`, `oom`, `pause`, `rename`, `resize`, `restart`,
     * `start`, `stop`, `top`, `unpause`, `update`, and `prune` Images report
     * these events: `delete`, `import`, `load`, `pull`, `push`, `save`, `tag`,
     * `untag`, and `prune` Volumes report these events: `create`, `mount`,
     * `unmount`, `destroy`, and `prune` Networks report these events: `create`,
     * `connect`, `disconnect`, `destroy`, `update`, `remove`, and `prune` The
     * Docker daemon reports these events: `reload` Services report these
     * events: `create`, `update`, and `remove` Nodes report these events:
     * `create`, `update`, and `remove` Secrets report these events: `create`,
     * `update`, and `remove` Configs report these events: `create`, `update`,
     * and `remove` The Builder reports `prune` events
     *
     * @param since - Show events created since this timestamp then stream new
     *   events.
     * @param until - Show events created until this timestamp then stop
     *   streaming.
     * @param filters - A JSON encoded value of filters (a
     *   `map[string][]string`) to process on the event list. Available
     *   filters:
     *
     *   - `config=<string>` config name or ID
     *   - `container=<string>` container name or ID
     *   - `daemon=<string>` daemon name or ID
     *   - `event=<string>` event type
     *   - `image=<string>` image name or ID
     *   - `label=<string>` image or container label
     *   - `network=<string>` network name or ID
     *   - `node=<string>` node ID
     *   - `plugin`=<string> plugin name or ID
     *   - `scope`=<string> local or swarm
     *   - `secret=<string>` secret name or ID
     *   - `service=<string>` service name or ID
     *   - `type=<string>` object to filter by, one of `container`, `image`,
     *       `volume`, `network`, `daemon`, `plugin`, `node`, `service`,
     *       `secret` or `config`
     *   - `volume=<string>` volume name
     */
    systemEvents: WithConnectionAgentProvided<typeof systemEvents>;

    /** Get system information */
    systemInfo: WithConnectionAgentProvided<typeof systemInfo>;

    /** This is a dummy endpoint you can use to test if the server is accessible. */
    systemPing: WithConnectionAgentProvided<typeof systemPing>;

    /** This is a dummy endpoint you can use to test if the server is accessible. */
    systemPingHead: WithConnectionAgentProvided<typeof systemPingHead>;

    /**
     * Returns the version of Docker that is running and various information
     * about the system that Docker is running on.
     */
    systemVersion: WithConnectionAgentProvided<typeof systemVersion>;
}
