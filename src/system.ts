import * as NodeHttp from "@effect/platform-node/HttpClient";
import { Context, Data, Effect, Layer, Scope, pipe } from "effect";

import {
    IMobyConnectionAgent,
    MobyConnectionAgent,
    MobyConnectionOptions,
    MobyHttpClientLive,
    getAgent,
} from "./agent-helpers.js";
import { addQueryParameter, responseErrorHandler } from "./request-helpers.js";
import {
    AuthConfig,
    EventMessage,
    SystemAuthResponse,
    SystemDataUsageResponse,
    SystemInfo,
    SystemVersion,
} from "./schemas.js";

export class SystemsError extends Data.TaggedError("SystemsError")<{
    method: string;
    message: string;
}> {}

export interface SystemEventsOptions {
    /** Show events created since this timestamp then stream new events. */
    readonly since?: string;
    /** Show events created until this timestamp then stop streaming. */
    readonly until?: string;
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
    readonly filters?: string;
}

export interface SystemDataUsageOptions {
    /** Object types, for which to compute and return data. */
    readonly type?: Array<"container" | "image" | "volume" | "build-cache"> | undefined;
}

export interface Systems {
    /**
     * Check auth configuration
     *
     * @param authConfig - Authentication to check
     */
    readonly auth: (options?: AuthConfig | undefined) => Effect.Effect<never, SystemsError, SystemAuthResponse>;

    /** Get system information */
    readonly info: () => Effect.Effect<never, SystemsError, Readonly<SystemInfo>>;

    /** Get version */
    readonly version: () => Effect.Effect<never, SystemsError, Readonly<SystemVersion>>;

    /** Ping */
    readonly ping: () => Effect.Effect<never, SystemsError, Readonly<string>>;

    /** Ping */
    readonly pingHead: () => Effect.Effect<never, SystemsError, void>;

    /**
     * Monitor events
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
    readonly events: (options: SystemEventsOptions) => Effect.Effect<never, SystemsError, EventMessage>;

    /**
     * Get data usage information
     *
     * @param type - Object types, for which to compute and return data.
     */
    readonly dataUsage: (
        options?: SystemDataUsageOptions | undefined
    ) => Effect.Effect<never, SystemsError, SystemDataUsageResponse>;
}

const make: Effect.Effect<IMobyConnectionAgent | NodeHttp.client.Client.Default, never, Systems> = Effect.gen(
    function* (_: Effect.Adapter) {
        const agent = yield* _(MobyConnectionAgent);
        const defaultClient = yield* _(NodeHttp.client.Client);

        const client = defaultClient.pipe(
            NodeHttp.client.mapRequest(NodeHttp.request.prependUrl(agent.nodeRequestUrl)),
            NodeHttp.client.filterStatusOk
        );

        const voidClient = client.pipe(NodeHttp.client.transform(Effect.asUnit));
        const SystemInfoClient = client.pipe(NodeHttp.client.mapEffect(NodeHttp.response.schemaBodyJson(SystemInfo)));
        const SystemAuthResponseClient = client.pipe(
            NodeHttp.client.mapEffect(NodeHttp.response.schemaBodyJson(SystemAuthResponse))
        );
        const SystemVersionClient = client.pipe(
            NodeHttp.client.mapEffect(NodeHttp.response.schemaBodyJson(SystemVersion))
        );
        const SystemEventsResponseClient = client.pipe(
            NodeHttp.client.mapEffect(NodeHttp.response.schemaBodyJson(EventMessage))
        );
        const SystemDataUsageResponseClient = client.pipe(
            NodeHttp.client.mapEffect(NodeHttp.response.schemaBodyJson(SystemDataUsageResponse))
        );

        const responseHandler = (method: string) =>
            responseErrorHandler((message) => new SystemsError({ method, message }));

        const auth_ = (options?: AuthConfig | undefined): Effect.Effect<never, SystemsError, SystemAuthResponse> =>
            pipe(
                NodeHttp.request.post("/auth"),
                NodeHttp.request.schemaBody(AuthConfig)(options ?? new AuthConfig({})),
                Effect.flatMap(SystemAuthResponseClient),
                Effect.catchAll(responseHandler("auth"))
            );

        const info_ = (): Effect.Effect<never, SystemsError, Readonly<SystemInfo>> =>
            pipe(NodeHttp.request.get("/info"), SystemInfoClient, Effect.catchAll(responseHandler("info")));

        const version_ = (): Effect.Effect<never, SystemsError, Readonly<SystemVersion>> =>
            pipe(NodeHttp.request.get("/version"), SystemVersionClient, Effect.catchAll(responseHandler("version")));

        const ping_ = (): Effect.Effect<never, SystemsError, Readonly<string>> =>
            pipe(
                NodeHttp.request.get("/_ping"),
                client,
                Effect.flatMap((response) => response.text),
                Effect.catchAll(responseHandler("ping"))
            );

        const pingHead_ = (): Effect.Effect<never, SystemsError, void> =>
            pipe(NodeHttp.request.head("/_ping"), voidClient, Effect.catchAll(responseHandler("pingHead")));

        const events_ = (options: SystemEventsOptions): Effect.Effect<never, SystemsError, EventMessage> =>
            pipe(
                NodeHttp.request.get("/events"),
                addQueryParameter("since", options.since),
                addQueryParameter("until", options.until),
                addQueryParameter("filters", options.filters),
                SystemEventsResponseClient,
                Effect.catchAll(responseHandler("events"))
            );

        const dataUsage_ = (
            options?: SystemDataUsageOptions | undefined
        ): Effect.Effect<never, SystemsError, SystemDataUsageResponse> =>
            pipe(
                NodeHttp.request.get("/system/df"),
                addQueryParameter("type", options?.type),
                SystemDataUsageResponseClient,
                Effect.catchAll(responseHandler("dataUsage"))
            );

        return {
            auth: auth_,
            info: info_,
            version: version_,
            ping: ping_,
            pingHead: pingHead_,
            events: events_,
            dataUsage: dataUsage_,
        };
    }
);

export const Systems = Context.Tag<Systems>("the-moby-effect/Systems");
export const layer = Layer.effect(Systems, make).pipe(Layer.provide(MobyHttpClientLive));

export const fromAgent = (agent: Effect.Effect<Scope.Scope, never, IMobyConnectionAgent>) =>
    layer.pipe(Layer.provide(Layer.scoped(MobyConnectionAgent, agent)));

export const fromConnectionOptions = (connectionOptions: MobyConnectionOptions) =>
    fromAgent(getAgent(connectionOptions));
