import { isPrimitiveSchema } from "../types.js";
import type { Modifier } from "./modifier.js";

export const nullableModifier: Modifier = (definition, existingType) => {
    const selfIsNullable = definition["x-nullable"];
    const selfIsNotPrimitive = !isPrimitiveSchema(definition);
    return selfIsNullable || selfIsNotPrimitive ? `Schema.nullable(${existingType})` : existingType;
};
