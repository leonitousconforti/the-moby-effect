import { type ISchemaDefinition } from "./types.js";

import { genSchemaType } from "./main.js";

export const genObjectType = (definition: ISchemaDefinition): [thisLevel: string, hoistedValues: string[]] => {
    const properties = definition.properties || {};

    const [propertyDefinitions, hoistedValues] = Object.entries(properties)
        .map(([name, property]) => {
            const data = genSchemaType({ ...property, name, parent: definition });
            const propertyDescription = property.description
                ? `
                /**
                 * ${property.description}
                 */
                `
                : "";
            return [`${propertyDescription}"${name}": ${data[0]},\n`, data[1]] as const;
        })
        .reduce(
            ([previousPropertyDefinitions, previousHoistedValues], [propertyDefinition, hoistedValue]) => [
                previousPropertyDefinitions + propertyDefinition,
                [...previousHoistedValues, ...hoistedValue],
            ],
            ["", [] as string[]]
        );

    if (!definition.parent && definition.default) {
        throw new Error("Top level objects defaults are not implemented");
    }

    const baseOutput = `Schema.struct({ ${propertyDefinitions} })`;

    // Check for nullable modifier
    const withNullableModifier = definition["x-nullable"] ? `Schema.nullable(${baseOutput})` : baseOutput;

    // Check for default value short circuit
    if (definition.default) {
        return [
            `Schema.optional(${withNullableModifier}).withDefault(() => (${JSON.stringify(definition.default)}))`,
            [],
        ];
    }

    // Check for optional modifier
    const withOptionalModifier =
        definition.required?.includes(definition.name) ||
        definition.parent?.required?.includes(definition.name) ||
        definition.parent?.allOf
            ? withNullableModifier
            : `Schema.optional(${withNullableModifier})`;

    return [
        definition.parent
            ? withOptionalModifier
            : `export class ${definition.name} extends Schema.Class<${definition.name}>()({ ${propertyDefinitions} }) {}`,
        hoistedValues,
    ];
};
