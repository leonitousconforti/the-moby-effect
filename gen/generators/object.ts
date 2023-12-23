import { genSchemaType } from "../index.js";
import { descriptionModifier } from "../modifiers/description.js";
import { nullableModifier } from "../modifiers/nullable.js";
import { optionalModifier } from "../modifiers/optional.js";
import type { ISchemaDefinition, ObjectSchema } from "../types.js";

export const genObjectType =
    (wholeSchema: { definitions: Record<string, ISchemaDefinition> }) =>
    (definition: ObjectSchema): [thisLevel: string, hoistedValues: string[]] => {
        if (definition.properties && definition.additionalProperties) {
            throw new Error("An object can not define it's own properties and have additional properties");
        }

        const properties = definition.properties || {};

        // Short circuit for if this is an additional properties object
        if (definition.additionalProperties) {
            const [innerType, hoistRequests] = genSchemaType(wholeSchema)({
                ...definition.additionalProperties,
                default: undefined,
                "x-nullable": false,
                parent: { ...definition, required: [undefined] as unknown as string[] },
            });
            const outerType = `Schema.record(Schema.string, ${innerType})`;

            return definition.parent
                ? [optionalModifier(definition, nullableModifier(definition, outerType)), hoistRequests]
                : [`export const ${definition.name} = ${outerType}`, hoistRequests];
        }

        // Generates the inner type T of Record<string, T>
        const [propertyDefinitions, hoistedValues] = Object.entries(properties)
            .map(([name, property]) => {
                const data = genSchemaType(wholeSchema)({ ...property, name, parent: definition });
                return [`${descriptionModifier(property)}"${name}": ${data[0]},\n`, data[1]] as const;
            })
            // eslint-disable-next-line unicorn/no-array-reduce
            .reduce(
                ([previousPropertyDefinitions, previousHoistedValues], [propertyDefinition, hoistedValue]) => [
                    previousPropertyDefinitions + propertyDefinition,
                    [...previousHoistedValues, ...hoistedValue],
                ],
                ["", [] as string[]]
            );

        const TsSchemaType = `Schema.struct({ ${propertyDefinitions} })`;
        return [
            definition.parent
                ? optionalModifier(definition, nullableModifier(definition, TsSchemaType))
                : `export class ${definition.name} extends Schema.Class<${definition.name}>()({ ${propertyDefinitions} }) {}`,
            hoistedValues,
        ];
    };

// Check for optional modifier
// const withOptionalModifier =
//     definition.parent?.required?.includes(definition.name) ||
//     definition.parent?.fromAllOf ||
//     definition.parent?.type === "array"
//         ? withNullableModifier
//         : `Schema.optional(${withNullableModifier})`;
