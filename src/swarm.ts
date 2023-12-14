import * as NodeHttp from "@effect/platform-node/HttpClient";
import * as Schema from "@effect/schema/Schema";
import { Data, Effect } from "effect";

import { IMobyConnectionAgent, MobyConnectionAgent, WithConnectionAgentProvided } from "./agent-helpers.js";
import { addHeader, addQueryParameter, responseErrorHandler, setBody } from "./request-helpers.js";

import {
    Swarm,
    SwarmInitRequest,
    SwarmJoinRequest,
    SwarmSchema,
    SwarmSpec,
    SwarmUnlockRequest,
    UnlockKeyResponse,
    UnlockKeyResponseSchema,
} from "./schemas.js";

export class SwarmInitError extends Data.TaggedError("SwarmInitError")<{ message: string }> {}
export class SwarmInspectError extends Data.TaggedError("SwarmInspectError")<{ message: string }> {}
export class SwarmJoinError extends Data.TaggedError("SwarmJoinError")<{ message: string }> {}
export class SwarmLeaveError extends Data.TaggedError("SwarmLeaveError")<{ message: string }> {}
export class SwarmUnlockError extends Data.TaggedError("SwarmUnlockError")<{ message: string }> {}
export class SwarmUnlockkeyError extends Data.TaggedError("SwarmUnlockkeyError")<{ message: string }> {}
export class SwarmUpdateError extends Data.TaggedError("SwarmUpdateError")<{ message: string }> {}

export interface SwarmInitOptions {
    body: SwarmInitRequest;
}

export interface SwarmJoinOptions {
    body: SwarmJoinRequest;
}

export interface SwarmLeaveOptions {
    /**
     * Force leave swarm, even if this is the last manager or that it will break
     * the cluster.
     */
    force?: boolean;
}

export interface SwarmUnlockOptions {
    body: SwarmUnlockRequest;
}

export interface SwarmUpdateOptions {
    body: SwarmSpec;
    /**
     * The version number of the swarm object being updated. This is required to
     * avoid conflicting writes.
     */
    version: number;
    /** Rotate the worker join token. */
    rotateWorkerToken?: boolean;
    /** Rotate the manager join token. */
    rotateManagerToken?: boolean;
    /** Rotate the manager unlock key. */
    rotateManagerUnlockKey?: boolean;
}

/**
 * Initialize a new swarm
 *
 * @param options -
 */
export const swarmInit = (
    options?: SwarmInitRequest | undefined
): Effect.Effect<IMobyConnectionAgent, SwarmInitError, Readonly<string>> =>
    Effect.gen(function* (_: Effect.Adapter) {
        const endpoint: string = "/swarm/init";
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
            .pipe(setBody(options, "SwarmInitRequest1"))
            .pipe(Effect.flatMap(client.pipe(NodeHttp.client.filterStatusOk)))
            .pipe(Effect.flatMap(NodeHttp.response.schemaBodyJson(Schema.string)))
            .pipe(responseErrorHandler(SwarmInitError));
    }).pipe(Effect.flatten);

/** Inspect swarm */
export const swarmInspect = (): Effect.Effect<IMobyConnectionAgent, SwarmInspectError, Readonly<Swarm>> =>
    Effect.gen(function* (_: Effect.Adapter) {
        const endpoint: string = "/swarm";
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
            .pipe(Effect.flatMap(NodeHttp.response.schemaBodyJson(SwarmSchema)))
            .pipe(responseErrorHandler(SwarmInspectError));
    }).pipe(Effect.flatten);

/**
 * Join an existing swarm
 *
 * @param body -
 */
export const swarmJoin = (options: SwarmJoinOptions): Effect.Effect<IMobyConnectionAgent, SwarmJoinError, void> =>
    Effect.gen(function* (_: Effect.Adapter) {
        if (options.body === null || options.body === undefined) {
            yield* _(new SwarmJoinError({ message: "Required parameter body was null or undefined" }));
        }

        const endpoint: string = "/swarm/join";
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
            .pipe(setBody(options.body, "SwarmJoinRequest1"))
            .pipe(Effect.flatMap(client.pipe(NodeHttp.client.filterStatusOk)))
            .pipe(responseErrorHandler(SwarmJoinError));
    }).pipe(Effect.flatten);

/**
 * Leave a swarm
 *
 * @param force - Force leave swarm, even if this is the last manager or that it
 *   will break the cluster.
 */
export const swarmLeave = (options: SwarmLeaveOptions): Effect.Effect<IMobyConnectionAgent, SwarmLeaveError, void> =>
    Effect.gen(function* (_: Effect.Adapter) {
        const endpoint: string = "/swarm/leave";
        const method: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" = "POST";
        const sanitizedEndpoint: string = endpoint;

        const agent: IMobyConnectionAgent = yield* _(MobyConnectionAgent);
        const client: NodeHttp.client.Client.Default = yield* _(
            NodeHttp.nodeClient.make.pipe(Effect.provideService(NodeHttp.nodeClient.HttpAgent, agent))
        );

        return NodeHttp.request
            .make(method)(sanitizedEndpoint)
            .pipe(NodeHttp.request.prependUrl(agent.nodeRequestUrl))
            .pipe(addQueryParameter("force", options.force))
            .pipe(client.pipe(NodeHttp.client.filterStatusOk))
            .pipe(responseErrorHandler(SwarmLeaveError));
    }).pipe(Effect.flatten);

/**
 * Unlock a locked manager
 *
 * @param body -
 */
export const swarmUnlock = (options: SwarmUnlockOptions): Effect.Effect<IMobyConnectionAgent, SwarmUnlockError, void> =>
    Effect.gen(function* (_: Effect.Adapter) {
        if (options.body === null || options.body === undefined) {
            yield* _(new SwarmUnlockError({ message: "Required parameter body was null or undefined" }));
        }

        const endpoint: string = "/swarm/unlock";
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
            .pipe(setBody(options.body, "SwarmUnlockRequest"))
            .pipe(Effect.flatMap(client.pipe(NodeHttp.client.filterStatusOk)))
            .pipe(responseErrorHandler(SwarmUnlockError));
    }).pipe(Effect.flatten);

/** Get the unlock key */
export const swarmUnlockkey = (): Effect.Effect<
    IMobyConnectionAgent,
    SwarmUnlockkeyError,
    Readonly<UnlockKeyResponse>
> =>
    Effect.gen(function* (_: Effect.Adapter) {
        const endpoint: string = "/swarm/unlockkey";
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
            .pipe(Effect.flatMap(NodeHttp.response.schemaBodyJson(UnlockKeyResponseSchema)))
            .pipe(responseErrorHandler(SwarmUnlockkeyError));
    }).pipe(Effect.flatten);

/**
 * Update a swarm
 *
 * @param body -
 * @param version - The version number of the swarm object being updated. This
 *   is required to avoid conflicting writes.
 * @param rotateWorkerToken - Rotate the worker join token.
 * @param rotateManagerToken - Rotate the manager join token.
 * @param rotateManagerUnlockKey - Rotate the manager unlock key.
 */
export const swarmUpdate = (options: SwarmUpdateOptions): Effect.Effect<IMobyConnectionAgent, SwarmUpdateError, void> =>
    Effect.gen(function* (_: Effect.Adapter) {
        if (options.body === null || options.body === undefined) {
            yield* _(new SwarmUpdateError({ message: "Required parameter body was null or undefined" }));
        }

        if (options.version === null || options.version === undefined) {
            yield* _(new SwarmUpdateError({ message: "Required parameter version was null or undefined" }));
        }

        const endpoint: string = "/swarm/update";
        const method: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" = "POST";
        const sanitizedEndpoint: string = endpoint;

        const agent: IMobyConnectionAgent = yield* _(MobyConnectionAgent);
        const client: NodeHttp.client.Client.Default = yield* _(
            NodeHttp.nodeClient.make.pipe(Effect.provideService(NodeHttp.nodeClient.HttpAgent, agent))
        );

        return NodeHttp.request
            .make(method)(sanitizedEndpoint)
            .pipe(NodeHttp.request.prependUrl(agent.nodeRequestUrl))
            .pipe(addQueryParameter("version", options.version))
            .pipe(addQueryParameter("rotateWorkerToken", options.rotateWorkerToken))
            .pipe(addQueryParameter("rotateManagerToken", options.rotateManagerToken))
            .pipe(addQueryParameter("rotateManagerUnlockKey", options.rotateManagerUnlockKey))
            .pipe(addHeader("Content-Type", "application/json"))
            .pipe(setBody(options.body, "SwarmSpec"))
            .pipe(Effect.flatMap(client.pipe(NodeHttp.client.filterStatusOk)))
            .pipe(responseErrorHandler(SwarmUpdateError));
    }).pipe(Effect.flatten);

export interface ISwarmService {
    Errors:
        | SwarmInitError
        | SwarmInspectError
        | SwarmJoinError
        | SwarmLeaveError
        | SwarmUnlockError
        | SwarmUnlockkeyError
        | SwarmUpdateError;

    /**
     * Initialize a new swarm
     *
     * @param options -
     */
    swarmInit: WithConnectionAgentProvided<typeof swarmInit>;

    /** Inspect swarm */
    swarmInspect: WithConnectionAgentProvided<typeof swarmInspect>;

    /**
     * Join an existing swarm
     *
     * @param body -
     */
    swarmJoin: WithConnectionAgentProvided<typeof swarmJoin>;

    /**
     * Leave a swarm
     *
     * @param force - Force leave swarm, even if this is the last manager or
     *   that it will break the cluster.
     */
    swarmLeave: WithConnectionAgentProvided<typeof swarmLeave>;

    /**
     * Unlock a locked manager
     *
     * @param body -
     */
    swarmUnlock: WithConnectionAgentProvided<typeof swarmUnlock>;

    /** Get the unlock key */
    swarmUnlockkey: WithConnectionAgentProvided<typeof swarmUnlockkey>;

    /**
     * Update a swarm
     *
     * @param body -
     * @param version - The version number of the swarm object being updated.
     *   This is required to avoid conflicting writes.
     * @param rotateWorkerToken - Rotate the worker join token.
     * @param rotateManagerToken - Rotate the manager join token.
     * @param rotateManagerUnlockKey - Rotate the manager unlock key.
     */
    swarmUpdate: WithConnectionAgentProvided<typeof swarmUpdate>;
}
