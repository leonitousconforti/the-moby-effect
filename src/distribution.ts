import * as NodeHttp from "@effect/platform-node/HttpClient";
import { Data, Effect } from "effect";

import { IMobyConnectionAgent, MobyConnectionAgent, WithConnectionAgentProvided } from "./agent-helpers.js";
import { responseErrorHandler } from "./request-helpers.js";
import { DistributionInspect, DistributionInspectSchema } from "./schemas.js";

export class DistributionInspectError extends Data.TaggedError("DistributionInspectError")<{ message: string }> {}

export interface DistributionInspectOptions {
    /** Image name or id */
    name: string;
}

/**
 * Return image digest and platform information by contacting the registry.
 *
 * @param name - Image name or id
 */
export const distributionInspect = (
    options: DistributionInspectOptions
): Effect.Effect<IMobyConnectionAgent, DistributionInspectError, Readonly<DistributionInspect>> =>
    Effect.gen(function* (_: Effect.Adapter) {
        const endpoint: string = "/distribution/{name}/json";
        const method: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" = "GET";
        const sanitizedEndpoint: string = endpoint.replace(`{${"name"}}`, encodeURIComponent(String(options.name)));

        const agent: IMobyConnectionAgent = yield* _(MobyConnectionAgent);
        const client: NodeHttp.client.Client.Default = yield* _(
            NodeHttp.nodeClient.make.pipe(Effect.provideService(NodeHttp.nodeClient.HttpAgent, agent))
        );

        return NodeHttp.request
            .make(method)(sanitizedEndpoint)
            .pipe(NodeHttp.request.prependUrl(agent.nodeRequestUrl))
            .pipe(client.pipe(NodeHttp.client.filterStatusOk))
            .pipe(Effect.flatMap(NodeHttp.response.schemaBodyJson(DistributionInspectSchema)))
            .pipe(responseErrorHandler(DistributionInspectError));
    }).pipe(Effect.flatten);

export interface IDistributionService {
    Errors: DistributionInspectError;

    /**
     * Return image digest and platform information by contacting the registry.
     *
     * @param name - Image name or id
     */
    distributionInspect: WithConnectionAgentProvided<typeof distributionInspect>;
}
