import type OpenApi from "openapi-types";
import type { ISchemaDefinition } from "./types.js";

import { genSchemaType } from "./main.js";

/**
 * Arrays could be top level or nested, but we don't need to hoist them like we
 * would with enums.
 */
export const genArrayType = (definition: ISchemaDefinition): [thisLevel: string, hoistedValues: string[]] => {
    const items = definition.items as OpenApi.OpenAPIV2.SchemaObject;
    const [itemsType, nestedHoistedValues] = genSchemaType({ ...items, name: definition.name, parent: definition });

    if (definition.default) {
        throw new Error("Default is not implemented for arrays");
    }

    const baseOutput = `Schema.array(${itemsType})`;

    // Check for nullable modifier
    const withNullableModifier = definition["x-nullable"] ? `Schema.nullable(${baseOutput})` : baseOutput;

    // helper to export if there is no parent
    const withExportModifier = (output: string): string =>
        definition.parent ? output : `export const ${definition.name} = ${output}`;

    // hoist the optional modifier if the inner type was optional
    if (itemsType.startsWith("Schema.optional(")) {
        return [
            withExportModifier(`Schema.optional(${withNullableModifier.replace("Schema.optional(", "")}`),
            nestedHoistedValues,
        ];
    }

    if (
        (definition.required && !definition.required.includes(definition.name)) ||
        (definition.parent?.required && definition.parent.required.includes(definition.name))
    ) {
        return [withExportModifier(`Schema.optional(${withNullableModifier})`), nestedHoistedValues];
    }

    return [withExportModifier(withNullableModifier), nestedHoistedValues];
};
