import * as NodeHttp from "@effect/platform-node/HttpClient";
import * as Schema from "@effect/schema/Schema";
import { Data, Effect } from "effect";

import {
    IMobyConnectionAgent,
    MobyConnectionAgent,
    WithConnectionAgentProvided,
    addHeader,
    addQueryParameter,
    errorHandler,
    setBody,
} from "./request-helpers.js";

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

export class swarmInitError extends Data.TaggedError("swarmInitError")<{ message: string }> {}
export class swarmInspectError extends Data.TaggedError("swarmInspectError")<{ message: string }> {}
export class swarmJoinError extends Data.TaggedError("swarmJoinError")<{ message: string }> {}
export class swarmLeaveError extends Data.TaggedError("swarmLeaveError")<{ message: string }> {}
export class swarmUnlockError extends Data.TaggedError("swarmUnlockError")<{ message: string }> {}
export class swarmUnlockkeyError extends Data.TaggedError("swarmUnlockkeyError")<{ message: string }> {}
export class swarmUpdateError extends Data.TaggedError("swarmUpdateError")<{ message: string }> {}

export interface swarmInitOptions {
    body: SwarmInitRequest;
}

export interface swarmJoinOptions {
    body: SwarmJoinRequest;
}

export interface swarmLeaveOptions {
    /**
     * Force leave swarm, even if this is the last manager or that it will break
     * the cluster.
     */
    force?: boolean;
}

export interface swarmUnlockOptions {
    body: SwarmUnlockRequest;
}

export interface swarmUpdateOptions {
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
 * @param body -
 */
export const swarmInit = (
    options: swarmInitOptions
): Effect.Effect<IMobyConnectionAgent, swarmInitError, Readonly<string>> =>
    Effect.gen(function* (_: Effect.Adapter) {
        if (options.body === null || options.body === undefined) {
            yield* _(new swarmInitError({ message: "Required parameter body was null or undefined" }));
        }

        const endpoint: string = "/swarm/init";
        const method: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" = "POST";
        const sanitizedEndpoint: string = endpoint;

        const agent: IMobyConnectionAgent = yield* _(MobyConnectionAgent);
        const client: NodeHttp.client.Client.Default = yield* _(
            NodeHttp.nodeClient.make.pipe(Effect.provideService(NodeHttp.nodeClient.HttpAgent, agent))
        );

        return NodeHttp.request
            .make(method)(sanitizedEndpoint)
            .pipe(NodeHttp.request.prependUrl("http://0.0.0.0"))
            .pipe(addHeader("Content-Type", "application/json"))
            .pipe(setBody(options.body, "SwarmInitRequest1"))
            .pipe(Effect.flatMap(client.pipe(NodeHttp.client.filterStatusOk)))
            .pipe(Effect.flatMap(NodeHttp.response.schemaBodyJson(Schema.string)))
            .pipe(errorHandler(swarmInitError));
    }).pipe(Effect.flatten);

/** Inspect swarm */
export const swarmInspect = (): Effect.Effect<IMobyConnectionAgent, swarmInspectError, Readonly<Swarm>> =>
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
            .pipe(NodeHttp.request.prependUrl("http://0.0.0.0"))
            .pipe(client.pipe(NodeHttp.client.filterStatusOk))
            .pipe(Effect.flatMap(NodeHttp.response.schemaBodyJson(SwarmSchema)))
            .pipe(errorHandler(swarmInspectError));
    }).pipe(Effect.flatten);

/**
 * Join an existing swarm
 *
 * @param body -
 */
export const swarmJoin = (options: swarmJoinOptions): Effect.Effect<IMobyConnectionAgent, swarmJoinError, void> =>
    Effect.gen(function* (_: Effect.Adapter) {
        if (options.body === null || options.body === undefined) {
            yield* _(new swarmJoinError({ message: "Required parameter body was null or undefined" }));
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
            .pipe(NodeHttp.request.prependUrl("http://0.0.0.0"))
            .pipe(addHeader("Content-Type", "application/json"))
            .pipe(setBody(options.body, "SwarmJoinRequest1"))
            .pipe(Effect.flatMap(client.pipe(NodeHttp.client.filterStatusOk)))
            .pipe(errorHandler(swarmJoinError));
    }).pipe(Effect.flatten);

/**
 * Leave a swarm
 *
 * @param force - Force leave swarm, even if this is the last manager or that it
 *   will break the cluster.
 */
export const swarmLeave = (options: swarmLeaveOptions): Effect.Effect<IMobyConnectionAgent, swarmLeaveError, void> =>
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
            .pipe(NodeHttp.request.prependUrl("http://0.0.0.0"))
            .pipe(addQueryParameter("force", options.force))
            .pipe(client.pipe(NodeHttp.client.filterStatusOk))
            .pipe(errorHandler(swarmLeaveError));
    }).pipe(Effect.flatten);

/**
 * Unlock a locked manager
 *
 * @param body -
 */
export const swarmUnlock = (options: swarmUnlockOptions): Effect.Effect<IMobyConnectionAgent, swarmUnlockError, void> =>
    Effect.gen(function* (_: Effect.Adapter) {
        if (options.body === null || options.body === undefined) {
            yield* _(new swarmUnlockError({ message: "Required parameter body was null or undefined" }));
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
            .pipe(NodeHttp.request.prependUrl("http://0.0.0.0"))
            .pipe(addHeader("Content-Type", "application/json"))
            .pipe(setBody(options.body, "SwarmUnlockRequest"))
            .pipe(Effect.flatMap(client.pipe(NodeHttp.client.filterStatusOk)))
            .pipe(errorHandler(swarmUnlockError));
    }).pipe(Effect.flatten);

/** Get the unlock key */
export const swarmUnlockkey = (): Effect.Effect<
    IMobyConnectionAgent,
    swarmUnlockkeyError,
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
            .pipe(NodeHttp.request.prependUrl("http://0.0.0.0"))
            .pipe(client.pipe(NodeHttp.client.filterStatusOk))
            .pipe(Effect.flatMap(NodeHttp.response.schemaBodyJson(UnlockKeyResponseSchema)))
            .pipe(errorHandler(swarmUnlockkeyError));
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
export const swarmUpdate = (options: swarmUpdateOptions): Effect.Effect<IMobyConnectionAgent, swarmUpdateError, void> =>
    Effect.gen(function* (_: Effect.Adapter) {
        if (options.body === null || options.body === undefined) {
            yield* _(new swarmUpdateError({ message: "Required parameter body was null or undefined" }));
        }

        if (options.version === null || options.version === undefined) {
            yield* _(new swarmUpdateError({ message: "Required parameter version was null or undefined" }));
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
            .pipe(NodeHttp.request.prependUrl("http://0.0.0.0"))
            .pipe(addQueryParameter("version", options.version))
            .pipe(addQueryParameter("rotateWorkerToken", options.rotateWorkerToken))
            .pipe(addQueryParameter("rotateManagerToken", options.rotateManagerToken))
            .pipe(addQueryParameter("rotateManagerUnlockKey", options.rotateManagerUnlockKey))
            .pipe(addHeader("Content-Type", "application/json"))
            .pipe(setBody(options.body, "SwarmSpec"))
            .pipe(Effect.flatMap(client.pipe(NodeHttp.client.filterStatusOk)))
            .pipe(errorHandler(swarmUpdateError));
    }).pipe(Effect.flatten);

/**
 * Initialize a new swarm
 *
 * @param body -
 */
export type swarmInitWithConnectionAgentProvided = WithConnectionAgentProvided<typeof swarmInit>;

/** Inspect swarm */
export type swarmInspectWithConnectionAgentProvided = WithConnectionAgentProvided<typeof swarmInspect>;

/**
 * Join an existing swarm
 *
 * @param body -
 */
export type swarmJoinWithConnectionAgentProvided = WithConnectionAgentProvided<typeof swarmJoin>;

/**
 * Leave a swarm
 *
 * @param force - Force leave swarm, even if this is the last manager or that it
 *   will break the cluster.
 */
export type swarmLeaveWithConnectionAgentProvided = WithConnectionAgentProvided<typeof swarmLeave>;

/**
 * Unlock a locked manager
 *
 * @param body -
 */
export type swarmUnlockWithConnectionAgentProvided = WithConnectionAgentProvided<typeof swarmUnlock>;

/** Get the unlock key */
export type swarmUnlockkeyWithConnectionAgentProvided = WithConnectionAgentProvided<typeof swarmUnlockkey>;

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
export type swarmUpdateWithConnectionAgentProvided = WithConnectionAgentProvided<typeof swarmUpdate>;
