import * as NodeHttp from "@effect/platform-node/HttpClient";
import { Context, Data, Effect, Layer, Scope, pipe } from "effect";

import {
    IMobyConnectionAgent,
    MobyConnectionAgent,
    MobyConnectionOptions,
    MobyHttpClientLive,
    getAgent,
} from "./agent-helpers.js";
import { responseErrorHandler } from "./request-helpers.js";
import { DistributionInspect } from "./schemas.js";

export class DistributionsError extends Data.TaggedError("DistributionsError")<{
    method: string;
    message: string;
}> {}

export interface DistributionInspectOptions {
    /** Image name or id */
    readonly name: string;
}

export interface Distributions {
    /**
     * Get image information from the registry
     *
     * @param name - Image name or id
     */
    readonly inspect: (
        options: DistributionInspectOptions
    ) => Effect.Effect<never, DistributionsError, Readonly<DistributionInspect>>;
}

const make: Effect.Effect<IMobyConnectionAgent | NodeHttp.client.Client.Default, never, Distributions> = Effect.gen(
    function* (_: Effect.Adapter) {
        const agent = yield* _(MobyConnectionAgent);
        const defaultClient = yield* _(NodeHttp.client.Client);

        const client = defaultClient.pipe(
            NodeHttp.client.mapRequest(NodeHttp.request.prependUrl(`${agent.nodeRequestUrl}/distribution`)),
            NodeHttp.client.filterStatusOk
        );

        const DistributionInspectResponseClient = client.pipe(
            NodeHttp.client.mapEffect(NodeHttp.response.schemaBodyJson(DistributionInspect))
        );

        const responseHandler = (method: string) =>
            responseErrorHandler((message) => new DistributionsError({ method, message }));

        const inspect_ = (
            options: DistributionInspectOptions
        ): Effect.Effect<never, DistributionsError, Readonly<DistributionInspect>> =>
            pipe(
                NodeHttp.request.get("/{name}/json".replace("{name}", encodeURIComponent(options.name))),
                DistributionInspectResponseClient,
                Effect.catchAll(responseHandler("inspect"))
            );

        return { inspect: inspect_ };
    }
);

export const Distributions = Context.Tag<Distributions>("the-moby-effect/Distributions");
export const layer = Layer.effect(Distributions, make).pipe(Layer.provide(MobyHttpClientLive));

export const fromAgent = (agent: Effect.Effect<Scope.Scope, never, IMobyConnectionAgent>) =>
    layer.pipe(Layer.provide(Layer.scoped(MobyConnectionAgent, agent)));

export const fromConnectionOptions = (connectionOptions: MobyConnectionOptions) =>
    fromAgent(getAgent(connectionOptions));
