/**
 * Swarms service
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

import {
    IMobyConnectionAgent,
    IMobyConnectionAgentImpl,
    MobyConnectionAgent,
    MobyConnectionOptions,
    MobyHttpClientLive,
    getAgent,
} from "./Agent.js";
import { addQueryParameter, responseErrorHandler } from "./Requests.js";
import {
    Swarm,
    SwarmInitRequest,
    SwarmJoinRequest,
    SwarmSpec,
    SwarmUnlockRequest,
    UnlockKeyResponse,
} from "./Schemas.js";

export class SwarmsError extends Data.TaggedError("SwarmsError")<{
    method: string;
    message: string;
}> {}

export interface SwarmLeaveOptions {
    /**
     * Force leave swarm, even if this is the last manager or that it will break
     * the cluster.
     */
    readonly force?: boolean;
}

export interface SwarmUpdateOptions {
    readonly body: SwarmSpec;
    /**
     * The version number of the swarm object being updated. This is required to
     * avoid conflicting writes.
     */
    readonly version: number;
    /** Rotate the worker join token. */
    readonly rotateWorkerToken?: boolean;
    /** Rotate the manager join token. */
    readonly rotateManagerToken?: boolean;
    /** Rotate the manager unlock key. */
    readonly rotateManagerUnlockKey?: boolean;
}

export interface Swarms {
    /** Inspect swarm */
    readonly inspect: () => Effect.Effect<Readonly<Swarm>, SwarmsError>;

    /** Initialize a new swarm */
    readonly init: (
        options: Schema.Schema.Encoded<typeof SwarmInitRequest>
    ) => Effect.Effect<Readonly<string>, SwarmsError>;

    /**
     * Join an existing swarm
     *
     * @param body -
     */
    readonly join: (options: Schema.Schema.Encoded<typeof SwarmInitRequest>) => Effect.Effect<void, SwarmsError>;

    /**
     * Leave a swarm
     *
     * @param force - Force leave swarm, even if this is the last manager or
     *   that it will break the cluster.
     */
    readonly leave: (options: SwarmLeaveOptions) => Effect.Effect<void, SwarmsError>;

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
    readonly update: (options: SwarmUpdateOptions) => Effect.Effect<void, SwarmsError>;

    /** Get the unlock key */
    readonly unlockkey: () => Effect.Effect<UnlockKeyResponse, SwarmsError>;

    /** Unlock a locked manager */
    readonly unlock: (options: Schema.Schema.Encoded<typeof SwarmUnlockRequest>) => Effect.Effect<void, SwarmsError>;
}

const make: Effect.Effect<Swarms, never, IMobyConnectionAgent | HttpClient.client.Client.Default> = Effect.gen(
    function* (_: Effect.Adapter) {
        const agent = yield* _(MobyConnectionAgent);
        const defaultClient = yield* _(HttpClient.client.Client);

        const client = defaultClient.pipe(
            HttpClient.client.mapRequest(HttpClient.request.prependUrl(`${agent.nodeRequestUrl}/swarm`)),
            HttpClient.client.filterStatusOk
        );

        const voidClient = client.pipe(HttpClient.client.transform(Effect.asVoid));
        const SwarmClient = client.pipe(HttpClient.client.mapEffect(HttpClient.response.schemaBodyJson(Swarm)));
        const StringClient = client.pipe(
            HttpClient.client.mapEffect(HttpClient.response.schemaBodyJson(Schema.String))
        );
        const UnlockKeyResponseClient = client.pipe(
            HttpClient.client.mapEffect(HttpClient.response.schemaBodyJson(UnlockKeyResponse))
        );

        const responseHandler = (method: string) =>
            responseErrorHandler((message) => new SwarmsError({ method, message }));

        const inspect_ = (): Effect.Effect<Readonly<Swarm>, SwarmsError> =>
            Function.pipe(
                HttpClient.request.get("/"),
                SwarmClient,
                Effect.catchAll(responseHandler("inspect")),
                Effect.scoped
            );

        const init_ = (
            options: Schema.Schema.Type<typeof SwarmInitRequest>
        ): Effect.Effect<Readonly<string>, SwarmsError> =>
            Function.pipe(
                HttpClient.request.post("/init"),
                HttpClient.request.schemaBody(SwarmInitRequest)(new SwarmInitRequest(options)),
                Effect.flatMap(StringClient),
                Effect.catchAll(responseHandler("init")),
                Effect.scoped
            );

        const join_ = (options: Schema.Schema.Type<typeof SwarmInitRequest>): Effect.Effect<void, SwarmsError> =>
            Function.pipe(
                HttpClient.request.post("/join"),
                HttpClient.request.schemaBody(SwarmJoinRequest)(new SwarmJoinRequest(options)),
                Effect.flatMap(voidClient),
                Effect.catchAll(responseHandler("join")),
                Effect.scoped
            );

        const leave_ = (options: SwarmLeaveOptions): Effect.Effect<void, SwarmsError> =>
            Function.pipe(
                HttpClient.request.post("/leave"),
                addQueryParameter("force", options.force),
                voidClient,
                Effect.catchAll(responseHandler("leave")),
                Effect.scoped
            );

        const update_ = (options: SwarmUpdateOptions): Effect.Effect<void, SwarmsError> =>
            Function.pipe(
                HttpClient.request.post("/update"),
                addQueryParameter("version", options.version),
                addQueryParameter("rotateWorkerToken", options.rotateWorkerToken),
                addQueryParameter("rotateManagerToken", options.rotateManagerToken),
                addQueryParameter("rotateManagerUnlockKey", options.rotateManagerUnlockKey),
                HttpClient.request.schemaBody(SwarmSpec)(options.body ?? new SwarmSpec({})),
                Effect.flatMap(voidClient),
                Effect.catchAll(responseHandler("update")),
                Effect.scoped
            );

        const unlockkey_ = (): Effect.Effect<UnlockKeyResponse, SwarmsError> =>
            Function.pipe(
                HttpClient.request.get("/unlockkey"),
                UnlockKeyResponseClient,
                Effect.catchAll(responseHandler("unlockkey")),
                Effect.scoped
            );

        const unlock_ = (options: Schema.Schema.Type<typeof SwarmUnlockRequest>): Effect.Effect<void, SwarmsError> =>
            Function.pipe(
                HttpClient.request.post("/unlock"),
                HttpClient.request.schemaBody(SwarmUnlockRequest)(new SwarmUnlockRequest(options)),
                Effect.flatMap(voidClient),
                Effect.catchAll(responseHandler("unlock")),
                Effect.scoped
            );

        return {
            inspect: inspect_,
            init: init_,
            join: join_,
            leave: leave_,
            update: update_,
            unlockkey: unlockkey_,
            unlock: unlock_,
        };
    }
);

export const Swarms = Context.GenericTag<Swarms>("the-moby-effects");
export const layer = Layer.effect(Swarms, make).pipe(Layer.provide(MobyHttpClientLive));

export const fromAgent = (agent: Effect.Effect<IMobyConnectionAgentImpl, never, Scope.Scope>) =>
    layer.pipe(Layer.provide(Layer.scoped(MobyConnectionAgent, agent)));

export const fromConnectionOptions = (connectionOptions: MobyConnectionOptions) =>
    fromAgent(getAgent(connectionOptions));
