import * as NodeHttp from "@effect/platform-node/HttpClient";
import * as Schema from "@effect/schema/Schema";
import * as Context from "effect/Context";
import * as Data from "effect/Data";
import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as Layer from "effect/Layer";
import * as Scope from "effect/Scope";

import {
    IMobyConnectionAgent,
    MobyConnectionAgent,
    MobyConnectionOptions,
    MobyHttpClientLive,
    getAgent,
} from "./agent-helpers.js";
import { addQueryParameter, responseErrorHandler } from "./request-helpers.js";
import {
    Swarm,
    SwarmInitRequest,
    SwarmJoinRequest,
    SwarmSpec,
    SwarmUnlockRequest,
    UnlockKeyResponse,
} from "./schemas.js";

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
    readonly inspect: () => Effect.Effect<never, SwarmsError, Readonly<Swarm>>;

    /**
     * Initialize a new swarm
     *
     * @param body -
     */
    readonly init: (
        options: Schema.Schema.To<typeof SwarmInitRequest.struct>
    ) => Effect.Effect<never, SwarmsError, Readonly<string>>;

    /**
     * Join an existing swarm
     *
     * @param body -
     */
    readonly join: (
        options: Schema.Schema.To<typeof SwarmInitRequest.struct>
    ) => Effect.Effect<never, SwarmsError, void>;

    /**
     * Leave a swarm
     *
     * @param force - Force leave swarm, even if this is the last manager or
     *   that it will break the cluster.
     */
    readonly leave: (options: SwarmLeaveOptions) => Effect.Effect<never, SwarmsError, void>;

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
    readonly update: (options: SwarmUpdateOptions) => Effect.Effect<never, SwarmsError, void>;

    /** Get the unlock key */
    readonly unlockkey: () => Effect.Effect<never, SwarmsError, UnlockKeyResponse>;

    /**
     * Unlock a locked manager
     *
     * @param body -
     */
    readonly unlock: (
        options: Schema.Schema.To<typeof SwarmUnlockRequest.struct>
    ) => Effect.Effect<never, SwarmsError, void>;
}

const make: Effect.Effect<IMobyConnectionAgent | NodeHttp.client.Client.Default, never, Swarms> = Effect.gen(function* (
    _: Effect.Adapter
) {
    const agent = yield* _(MobyConnectionAgent);
    const defaultClient = yield* _(NodeHttp.client.Client);

    const client = defaultClient.pipe(
        NodeHttp.client.mapRequest(NodeHttp.request.prependUrl(`${agent.nodeRequestUrl}/swarm`)),
        NodeHttp.client.filterStatusOk
    );

    const voidClient = client.pipe(NodeHttp.client.transform(Effect.asUnit));
    const SwarmClient = client.pipe(NodeHttp.client.mapEffect(NodeHttp.response.schemaBodyJson(Swarm)));
    const StringClient = client.pipe(NodeHttp.client.mapEffect(NodeHttp.response.schemaBodyJson(Schema.string)));
    const UnlockKeyResponseClient = client.pipe(
        NodeHttp.client.mapEffect(NodeHttp.response.schemaBodyJson(UnlockKeyResponse))
    );

    const responseHandler = (method: string) => responseErrorHandler((message) => new SwarmsError({ method, message }));

    const inspect_ = (): Effect.Effect<never, SwarmsError, Readonly<Swarm>> =>
        Function.pipe(NodeHttp.request.get("/"), SwarmClient, Effect.catchAll(responseHandler("inspect")));

    const init_ = (
        options: Schema.Schema.To<typeof SwarmInitRequest.struct>
    ): Effect.Effect<never, SwarmsError, Readonly<string>> =>
        Function.pipe(
            NodeHttp.request.post("/init"),
            NodeHttp.request.schemaBody(SwarmInitRequest)(new SwarmInitRequest(options)),
            Effect.flatMap(StringClient),
            Effect.catchAll(responseHandler("init"))
        );

    const join_ = (
        options: Schema.Schema.To<typeof SwarmInitRequest.struct>
    ): Effect.Effect<never, SwarmsError, void> =>
        Function.pipe(
            NodeHttp.request.post("/join"),
            NodeHttp.request.schemaBody(SwarmJoinRequest)(new SwarmJoinRequest(options)),
            Effect.flatMap(voidClient),
            Effect.catchAll(responseHandler("join"))
        );

    const leave_ = (options: SwarmLeaveOptions): Effect.Effect<never, SwarmsError, void> =>
        Function.pipe(
            NodeHttp.request.post("/leave"),
            addQueryParameter("force", options.force),
            voidClient,
            Effect.catchAll(responseHandler("leave"))
        );

    const update_ = (options: SwarmUpdateOptions): Effect.Effect<never, SwarmsError, void> =>
        Function.pipe(
            NodeHttp.request.post("/update"),
            addQueryParameter("version", options.version),
            addQueryParameter("rotateWorkerToken", options.rotateWorkerToken),
            addQueryParameter("rotateManagerToken", options.rotateManagerToken),
            addQueryParameter("rotateManagerUnlockKey", options.rotateManagerUnlockKey),
            NodeHttp.request.schemaBody(SwarmSpec)(options.body ?? new SwarmSpec({})),
            Effect.flatMap(voidClient),
            Effect.catchAll(responseHandler("update"))
        );

    const unlockkey_ = (): Effect.Effect<never, SwarmsError, UnlockKeyResponse> =>
        Function.pipe(
            NodeHttp.request.get("/unlockkey"),
            UnlockKeyResponseClient,
            Effect.catchAll(responseHandler("unlockkey"))
        );

    const unlock_ = (
        options: Schema.Schema.To<typeof SwarmUnlockRequest.struct>
    ): Effect.Effect<never, SwarmsError, void> =>
        Function.pipe(
            NodeHttp.request.post("/unlock"),
            NodeHttp.request.schemaBody(SwarmUnlockRequest)(new SwarmUnlockRequest(options)),
            Effect.flatMap(voidClient),
            Effect.catchAll(responseHandler("unlock"))
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
});

export const Swarms = Context.Tag<Swarms>("the-moby-effects");
export const layer = Layer.effect(Swarms, make).pipe(Layer.provide(MobyHttpClientLive));

export const fromAgent = (agent: Effect.Effect<Scope.Scope, never, IMobyConnectionAgent>) =>
    layer.pipe(Layer.provide(Layer.scoped(MobyConnectionAgent, agent)));

export const fromConnectionOptions = (connectionOptions: MobyConnectionOptions) =>
    fromAgent(getAgent(connectionOptions));
