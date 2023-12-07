import * as NodeHttp from "@effect/platform-node/HttpClient";
import { Data, Effect } from "effect";

import {
    IMobyConnectionAgent,
    MobyConnectionAgent,
    WithConnectionAgentProvided,
    errorHandler,
} from "./request-helpers.js";

import { DistributionInspect, DistributionInspectSchema } from "./schemas.js";

export class distributionInspectError extends Data.TaggedError("distributionInspectError")<{ message: string }> {}

export interface distributionInspectOptions {
    /** Image name or id */
    name: string;
}

/**
 * Return image digest and platform information by contacting the registry.
 *
 * @param name - Image name or id
 */
export const distributionInspect = (
    options: distributionInspectOptions
): Effect.Effect<IMobyConnectionAgent, distributionInspectError, Readonly<DistributionInspect>> =>
    Effect.gen(function* (_: Effect.Adapter) {
        if (options.name === null || options.name === undefined) {
            yield* _(new distributionInspectError({ message: "Required parameter name was null or undefined" }));
        }

        const endpoint: string = "/distribution/{name}/json";
        const method: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" = "GET";
        const sanitizedEndpoint: string = endpoint.replace(`{${"name"}}`, encodeURIComponent(String(options.name)));

        const agent: IMobyConnectionAgent = yield* _(MobyConnectionAgent);
        const client: NodeHttp.client.Client.Default = yield* _(
            NodeHttp.nodeClient.make.pipe(Effect.provideService(NodeHttp.nodeClient.HttpAgent, agent))
        );

        return NodeHttp.request
            .make(method)(sanitizedEndpoint)
            .pipe(NodeHttp.request.prependUrl("http://0.0.0.0"))
            .pipe(client.pipe(NodeHttp.client.filterStatusOk))
            .pipe(Effect.flatMap(NodeHttp.response.schemaBodyJson(DistributionInspectSchema)))
            .pipe(errorHandler(distributionInspectError));
    }).pipe(Effect.flatten);

/**
 * Return image digest and platform information by contacting the registry.
 *
 * @param name - Image name or id
 */
export type distributionInspectWithConnectionAgentProvided = WithConnectionAgentProvided<typeof distributionInspect>;
