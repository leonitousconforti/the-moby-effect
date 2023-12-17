import type OpenApi from "openapi-types";
import type { ISchemaDefinition } from "./types.js";

import { genSchemaType } from "./main.js";

/** Arrays could be top level or nested, but we don't need to hoist them. */
export const genArrayType = (definition: ISchemaDefinition): [thisLevel: string, hoistedValues: string[]] => {
    const items = definition.items as OpenApi.OpenAPIV2.SchemaObject;
    const [itemsType, nestedHoistedValues] = genSchemaType({ ...items, name: definition.name, parent: definition });

    if (definition.default) {
        throw new Error("Default is not implemented for arrays");
    }

    const baseOutput = `Schema.array(${itemsType})`;

    // Check for nullable modifier
    const withNullableModifier = definition["x-nullable"] ? `Schema.nullable(${baseOutput})` : baseOutput;

    // hoist the optional modifier
    if (itemsType.startsWith("Schema.optional(")) {
        return [`Schema.optional(${withNullableModifier.replace("Schema.optional(", "")}`, nestedHoistedValues];
    }

    return [withNullableModifier, nestedHoistedValues];
};
