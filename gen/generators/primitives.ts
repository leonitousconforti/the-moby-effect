import { nullableModifier } from "../modifiers/nullable.js";
import { optionalModifier } from "../modifiers/optional.js";
import type { PrimitiveSchema } from "../types.js";

export const primitiveTypeMappings = {
    string: "Schema.string",
    integer: "Schema.number",
    number: "Schema.number",
    boolean: "Schema.boolean",
};

// Generates the schema type for a string/number/boolean
export const genPrimitiveType =
    (_wholeSchema: unknown) =>
    (definition: PrimitiveSchema): [thisLevel: string, hoistedValues: string[]] => {
        const TsType = primitiveTypeMappings[definition.type];
        const withModifiers = optionalModifier(definition, nullableModifier(definition, TsType));
        return definition.parent ? [withModifiers, []] : [`export const ${definition.name} = ${withModifiers}`, []];
    };
