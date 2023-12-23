import { genAllOfType } from "./generators/all-of.js";
import { genArrayType } from "./generators/array.js";
import { genEnumType } from "./generators/enum.js";
import { genObjectType } from "./generators/object.js";
import { genPrimitiveType } from "./generators/primitives.js";
import { genReferenceSchema } from "./generators/reference.js";
import {
    HOIST_REQUEST,
    ISchemaDefinition,
    isAllOfSchema,
    isArraySchema,
    isEnumSchema,
    isObjectSchema,
    isPrimitiveSchema,
    isReferenceSchema,
} from "./types.js";

/**
 * Helper to generate the effect schema for the definitions (will be called
 * recursively by the other helpers)
 */
export const genSchemaType =
    (wholeSchema: { schemas: Record<string, ISchemaDefinition> }) =>
    (definition: ISchemaDefinition): [thisLevel: string, hoistedValues: string[]] => {
        if (isArraySchema(definition)) {
            return genArrayType(wholeSchema)(definition);
        } else if (isObjectSchema(definition)) {
            return genObjectType(wholeSchema)(definition);
        } else if (isEnumSchema(definition)) {
            return genEnumType(wholeSchema)(definition);
        } else if (isAllOfSchema(definition)) {
            return genAllOfType(wholeSchema)(definition);
        } else if (isPrimitiveSchema(definition)) {
            return genPrimitiveType(wholeSchema)(definition);
        } else if (isReferenceSchema(definition)) {
            return genReferenceSchema(wholeSchema)(definition);
        } else {
            throw new Error("Unknown schema type");
        }
    };

/** Look at any hoist requests and order the schemas appropriately. */
export const orderSchemas = (
    sectionsToProcess: { name: string; type: string; dependencies: Set<string> }[]
): { name: string; type: string; dependencies: Set<string> }[] => {
    // We are done when there are no more sections to process
    if (sectionsToProcess.length === 0) return [];

    // This iteration, we will add all the sections that have no more dependencies
    const sectionsWithNoDependencies = sectionsToProcess.filter(({ dependencies }) => dependencies.size === 0);
    const newCompletedSections: Set<string> = new Set(sectionsWithNoDependencies.map(({ name }) => name));

    // If there is currently no sections with no dependencies and we
    // know that there are still sections left to process from the
    // guard above, then there must be a circular dependency prevent
    // the dependencies from being ready.
    // TODO: I think we can resolve this with suspend
    if (sectionsWithNoDependencies.length === 0) {
        throw new Error("Circular dependency detected");
    }

    // Remove all the sections we just added from the dependencies of the remaining sections
    const newSectionsToProcess = sectionsToProcess
        .filter((x) => !sectionsWithNoDependencies.includes(x))
        .map(({ dependencies, ...rest }) => ({
            ...rest,
            dependencies: new Set([...dependencies].filter((dep) => !newCompletedSections.has(dep))),
        }));

    // Recurse with the modified sections
    return [...sectionsWithNoDependencies, ...orderSchemas(newSectionsToProcess)];
};

export const run = (schema: {
    components: { schemas: Record<string, ISchemaDefinition> };
    paths: Record<
        string,
        Record<
            "get" | "post" | "delete" | "patch" | "options",
            {
                operationId: string;
                responses: Record<
                    number,
                    {
                        content: Record<"application/json", { schema: { title?: string; items?: { title: string } } }>;
                    }
                >;
                requestBody: {
                    content: Record<"application/json", { schema: { title?: string; items?: { title: string } } }>;
                };
            }
        >
    >;
}): string => {
    // Some of the schema definitions are not defined under the definitions key, so
    // we will grab them from the request parameters and response types of the paths
    const responseTypesAndParameterTypes = Object.values(schema.paths)
        .flatMap((path) => Object.values(path))
        .flatMap(({ responses, requestBody }) => [
            ...Object.values(responses).map((response) => response.content["application/json"]),
            requestBody?.content["application/json"],
        ])
        .filter((a) => a?.schema)
        .filter(({ schema }) => schema?.title || schema?.items?.title)
        .map(({ schema }) => ({ ...schema, name: schema.title || schema.items?.title }))
        .map((schema) => ({ [schema.name!]: schema }));

    // Combine all the definitions into one object
    const definitions: Record<string, ISchemaDefinition> = Object.assign(
        {},
        schema.components.schemas,
        ...responseTypesAndParameterTypes
    );

    // Generate the schema types for all the definitions
    const generatedSchemas: { [x: string]: { dependencies: Set<string>; type: string; name: string } } = Object.assign(
        {},
        ...Object.entries(definitions).map(([definitionName, definition]) => {
            const schemaGen = genSchemaType(schema.components)({ ...definition, name: definitionName });
            const hoistedTypes = schemaGen[1].filter((type) => type.includes("export"));
            const hoistRequests = schemaGen[1]
                .filter((type) => type.startsWith(HOIST_REQUEST))
                .map((type) => type.replace(HOIST_REQUEST, ""));

            return {
                [definitionName]: {
                    name: definitionName,
                    dependencies: new Set(hoistRequests),
                    type: hoistedTypes.join("\n\n") + "\n\n" + schemaGen[0],
                },
            };
        })
    );

    return orderSchemas(Object.values(generatedSchemas))
        .map(({ type }) => type)
        .join("\n\n");
};
