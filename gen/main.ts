import SwaggerParser from "@apidevtools/swagger-parser";
import OpenApi from "openapi-types";

import { genAllOfType } from "./all-of.js";
import { genArrayType } from "./array.js";
import { genEnumType } from "./enum.js";
import { genObjectType } from "./object.js";
import { genPrimitiveType, primitiveTypeMappings } from "./primitives.js";
import { ISchemaDefinition } from "./types.js";
import { writeAndSave } from "./write.js";

// @ts-expect-error
const mobySchema: OpenApi.OpenAPIV2.Document<{}> = await SwaggerParser.validate(
    "https://raw.githubusercontent.com/moby/moby/master/api/swagger.yaml"
);

// Parse out some parts of the schema we are interested in
const definitions = mobySchema.definitions || {};
const endpoints = Object.entries(mobySchema.paths || {})
    .flatMap(([path, pathDefinition]) => [
        { ...pathDefinition.delete, path, method: "del" },
        { ...pathDefinition.get, path, method: "get" },
        { ...pathDefinition.head, path, method: "head" },
        { ...pathDefinition.options, path, method: "options" },
        { ...pathDefinition.patch, path, method: "patch" },
        { ...pathDefinition.post, path, method: "post" },
        { ...pathDefinition.put, path, method: "put" },
    ])
    .filter((endpoint) => Object.keys(endpoint).length > 2)
    .map((endpoint) => ({
        ...endpoint,
        path: endpoint.path.replace(`/${endpoint.tags![0]!.toLowerCase()}s`, "") || "/",
    }))
    .map((endpoint) => ({
        ...endpoint,
        body: (endpoint.parameters as OpenApi.OpenAPIV2.ParameterObject[])?.filter((p) => p.in === "body"),
        headers: (endpoint.parameters as OpenApi.OpenAPIV2.ParameterObject[])?.filter((p) => p.in === "header"),
        pathParameters: (endpoint.parameters as OpenApi.OpenAPIV2.ParameterObject[])?.filter((p) => p.in === "path"),
        queryParameters: (endpoint.parameters as OpenApi.OpenAPIV2.ParameterObject[])?.filter((p) => p.in === "query"),
    }))
    .reduce(
        (accumulator, endpoint) => {
            const tags = endpoint.tags!;
            for (const tag of tags) {
                accumulator[`${tag}s`] = accumulator[`${tag}s`] ?? [];
                accumulator[`${tag}s`]!.push(endpoint);
            }
            return accumulator;
        },
        {} as Record<string, Partial<OpenApi.OpenAPIV2.OperationObject>[]>
    );

/** Helper to generate the effect schema for the definitions */
export const genSchemaType = (definition: ISchemaDefinition): [thisLevel: string, hoistedValues: string[]] => {
    if (definition.enum) {
        return genEnumType(definition);
    } else if (definition.type === "array") {
        return genArrayType(definition);
    } else if (definition.type === "object") {
        return genObjectType(definition);
    } else if (definition.allOf) {
        return genAllOfType(definition);
    } else if (primitiveTypeMappings[definition.type as keyof typeof primitiveTypeMappings]) {
        return genPrimitiveType(definition);
    } else {
        throw new Error(`Unknown type: ${definition.type}`);
    }
};

let a = "";
let b = new Set<string>();
const c = new Map<string, string>();

for (const [definition, topLevel, hoisted] of [...Object.entries(definitions)].map(
    ([definitionName, definition]) => [definition, ...genSchemaType({ ...definition, name: definitionName })] as const
)) {
    a += topLevel + "\n\n";
    b = new Set([...b, ...hoisted]);
    if (topLevel) c.set(JSON.stringify(definition), topLevel.match(/export \w+ (\w+)/)![1]!);
}

// await writeAndSave("src/containers.ts", await genEndpoint(endpoints["Containers"] as any, c));
// console.log("done");
console.log(endpoints);
await writeAndSave(
    "src/schemas.ts",
    'import { Schema } from "@effect/schema";\n\n' + [...b.values()].join("\n\n") + "\n\n" + a
);

// For all the endpoints, lets generate some code for each
// for (const [endpointName, endpoint] of Object.entries(endpoints)) {
//     await writeAndSave(`src/${endpointName.toLowerCase()}.ts`, await genEndpoint(endpoint as any, c));
//     console.log(`done with ${endpointName}`);
// }
