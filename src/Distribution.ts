import * as HttpClient from "@effect/platform/HttpClient";
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
} from "./Agent.js";
import { responseErrorHandler } from "./Requests.js";
import { DistributionInspect } from "./Schemas.js";

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
    ) => Effect.Effect<Readonly<DistributionInspect>, DistributionsError, never>;
}

const make: Effect.Effect<Distributions, never, IMobyConnectionAgent | HttpClient.client.Client.Default> = Effect.gen(
    function* (_: Effect.Adapter) {
        const agent = yield* _(MobyConnectionAgent);
        const defaultClient = yield* _(HttpClient.client.Client);

        const client = defaultClient.pipe(
            HttpClient.client.mapRequest(HttpClient.request.prependUrl(`${agent.nodeRequestUrl}/distribution`)),
            HttpClient.client.filterStatusOk
        );

        const DistributionInspectResponseClient = client.pipe(
            HttpClient.client.mapEffect(HttpClient.response.schemaBodyJson(DistributionInspect))
        );

        const responseHandler = (method: string) =>
            responseErrorHandler((message) => new DistributionsError({ method, message }));

        const inspect_ = (
            options: DistributionInspectOptions
        ): Effect.Effect<Readonly<DistributionInspect>, DistributionsError, never> =>
            Function.pipe(
                HttpClient.request.get("/{name}/json".replace("{name}", encodeURIComponent(options.name))),
                DistributionInspectResponseClient,
                Effect.catchAll(responseHandler("inspect")),
                Effect.scoped
            );

        return { inspect: inspect_ };
    }
);

export const Distributions = Context.GenericTag<Distributions>("the-moby-effect/Distributions");
export const layer = Layer.effect(Distributions, make).pipe(Layer.provide(MobyHttpClientLive));

export const fromAgent = (agent: Effect.Effect<IMobyConnectionAgent, never, Scope.Scope>) =>
    layer.pipe(Layer.provide(Layer.scoped(MobyConnectionAgent, agent)));

export const fromConnectionOptions = (connectionOptions: MobyConnectionOptions) =>
    fromAgent(getAgent(connectionOptions));
