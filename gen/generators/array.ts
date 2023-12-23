import { genSchemaType } from "../index.js";
import { nullableModifier } from "../modifiers/nullable.js";
import { optionalModifier } from "../modifiers/optional.js";
import { ISchemaDefinition, type ArraySchema } from "../types.js";

/**
 * Arrays could be top level or nested, but we don't need to hoist them like we
 * would with enums.
 */
export const genArrayType =
    (wholeSchema: { schemas: Record<string, ISchemaDefinition> }) =>
    (definition: ArraySchema): [thisLevel: string, hoistedValues: string[]] => {
        // Generate the inner type T of Array<T>
        const [itemsType, nestedHoistedValues] = genSchemaType(wholeSchema)({
            ...definition.items,
            name: definition.name,
            parent: { ...definition, required: [definition.name] },
        });

        const TsType = `Schema.array(${itemsType})`;
        const withModifies = optionalModifier(definition, nullableModifier(definition, TsType));
        return [definition.parent ? withModifies : `export const ${definition.name} = ${TsType}`, nestedHoistedValues];
    };
