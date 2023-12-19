import type OpenApi from "openapi-types";

import Handlebars from "handlebars";

Handlebars.registerHelper("curlyBraces", function (options) {
    // @ts-expect-error
    return "{" + options.fn(this) + "}";
});

const template = Handlebars.compile(`
import * as NodeHttp from "@effect/platform-node/HttpClient";
import * as Schema from "@effect/schema/Schema";
import { Context, Data, Effect, Layer, pipe } from "effect";
import { IMobyConnectionAgent, MobyConnectionAgent, MobyHttpClientLive } from "./agent-helpers.js";
import { addQueryParameter, responseErrorHandler2 } from "./request-helpers.js";

export class {{baseOperationName}}Error extends Data.TaggedError("{{baseOperationName}}Error")<{
    method: string;
    message: string;
}> {}

{{#operations}}
export interface {{operationId}}Options {
    {{#parameters}}
    /**
     * {{{description}}}
     */
    readonly {{name}}{{^required}}?{{/required}}: {{type}};
    {{/parameters}}
}

{{/operations}}

export interface {{baseOperationName}} {
    {{#operations}}
    /**
     * {{{summary}}}
     *
    {{#parameters}}
     * @param {{name}} - {{{description}}}
    {{/parameters}}
     */
    readonly {{simpleOperationId}}: (options: {{operationId}}Options) => Effect.Effect<never, {{baseOperationName}}Error, {{{successReturnType.tsReturnType}}}>;

    {{/operations}}
}

const make: Effect.Effect<IMobyConnectionAgent | NodeHttp.client.Client.Default, never, {{baseOperationName}}> = Effect.gen(
    function* (_: Effect.Adapter) {
        const agent = yield* _(MobyConnectionAgent);
        const defaultClient = yield* _(NodeHttp.client.Client);

        const client = defaultClient.pipe(
            NodeHttp.client.mapRequest(NodeHttp.request.prependUrl(agent.nodeRequestUrl + "{{baseOperationName}}")),
            NodeHttp.client.filterStatusOk
        );

        const voidClient = client.pipe(NodeHttp.client.transform(Effect.asUnit));
        {{#responses}}
        const {{name}}Client = client.pipe(NodeHttp.client.mapEffect(NodeHttp.response.schemaBodyJson({{type}})));
        {{/responses}}

        const errorHandler = (method: string) =>
            responseErrorHandler2((message) => new {{baseOperationName}}Error({ method, message }));

        {{#operations}}
        const {{simpleOperationId}}_ = (options: {{operationId}}Options): Effect.Effect<never, {{../baseOperationName}}Error, {{{successReturnType.tsReturnType}}}> =>
            pipe(
                NodeHttp.request.{{method}}("{{path}}"{{#pathParameters}}.replace("{{#curlyBraces}}{{name}}{{/curlyBraces}}", encodeURIComponent(options.{{name}})){{/pathParameters}}),
                {{#headers}}
                NodeHttp.request.setHeader("{{name}}", "{{value}}"),
                {{/headers}}
                {{#queryParameters}}
                addQueryParameter("{{name}}", options.{{name}}),
                {{/queryParameters}}
                {{#body}}
                NodeHttp.request.schemaBody({{type}})(options.{{name}} ?? new {{type}}({})),
                Effect.flatMap({{../successReturnType.name}}Client),
                {{/body}}
                {{^body}}
                {{#successReturnType}}{{name}}Client,{{/successReturnType}}
                {{/body}}
                Effect.catchAll(errorHandler("{{simpleOperationId}}"))
            );

        {{/operations}}

        return { {{#operations}}{{simpleOperationId}}: {{simpleOperationId}}_, {{/operations}} };
    }
);

export const {{baseOperationName}} = Context.Tag<{{baseOperationName}}>("the-moby-effect/{{baseOperationName}}");
export const layer = Layer.effect({{baseOperationName}}, make).pipe(Layer.provide(MobyHttpClientLive));
`);

interface Parameter {
    name: string;
    description: string;
    required: boolean;
    type?: string;
    schema?: any;
}

export const genEndpoint = async (
    operations: {
        summary: string;
        operationId: string;
        responses: Record<number, unknown>;
        parameters: Parameter[];
        tags: [string];
        path: string;
        method: string;
        body: Parameter[];
        headers: Parameter[];
        pathParameters: Parameter[];
        queryParameters: Parameter[];
    }[],
    typeMappings: Map<string, string>
): Promise<string> => {
    typeMappings.set(JSON.stringify("integer"), "number");

    const baseOperationName = `${operations[0]?.tags[0]}s`;

    const allSuccessResponses = operations
        .flatMap((operation) =>
            Object.entries(operation.responses)
                .filter(
                    ([statusCode, response]) =>
                        Number.parseInt(statusCode) >= 100 &&
                        Number.parseInt(statusCode) <= 300 &&
                        (response as any).schema
                )
                .map(([, response]) => ({
                    ...(response as any).schema,
                    operationId: operation.operationId,
                }))
        )
        .map(({ operationId, ...rest }: any) => {
            if (rest.title) {
                return {
                    operationId,
                    type: rest.title,
                    name: rest.title,
                    tsReturnType: rest.title,
                };
            }

            const type =
                rest.type === "array"
                    ? `Schema.array(${typeMappings.get(JSON.stringify(rest.items))!})`
                    : typeMappings.get(JSON.stringify(rest))!;

            const name =
                rest.type === "array"
                    ? `${typeMappings.get(JSON.stringify(rest.items))!}s`
                    : typeMappings.get(JSON.stringify(rest))!;

            const tsReturnType =
                rest.type === "array"
                    ? `Readonly<Array<${typeMappings.get(JSON.stringify(rest.items))!}>>`
                    : `Readonly<${typeMappings.get(JSON.stringify(rest))}>` || "void";

            return {
                operationId,
                type,
                name,
                tsReturnType,
            };
        });

    return template({
        baseOperationName,
        responses: [...new Set(allSuccessResponses.map((response) => response))],
        operations: operations
            .map((operation) => ({
                ...operation,
                successReturnType: allSuccessResponses.find(
                    (response) => response.operationId === operation.operationId
                ) || { type: "void", name: "void", tsReturnType: "void" },
                simpleOperationId: operation.operationId.replace(`${operations[0]?.tags[0]}`, "").toLowerCase(),
                parameters: operation.parameters?.map(({ description, ...rest }) => ({
                    ...rest,
                    description: description?.replaceAll("\n", "\n *"),
                    type: ["string", "number", "boolean"].includes(rest.type || "")
                        ? rest.type
                        : rest.schema?.allOf && rest.schema?.allOf.length === 2 && rest.schema?.allOf[1].example
                          ? typeMappings.get(JSON.stringify(rest.schema.allOf[0]))!
                          : typeMappings.get(JSON.stringify(rest.schema || rest.type))!,
                })),
            }))
            .map((operation) => ({
                ...operation,
                body: (operation.parameters as unknown as OpenApi.OpenAPIV2.ParameterObject[])?.filter(
                    (p) => p.in === "body"
                ),
            })),
    });
};
