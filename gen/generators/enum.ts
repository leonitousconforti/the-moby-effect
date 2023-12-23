import { optionalModifier } from "../modifiers/optional.js";
import { PrimitiveSchema } from "../types.js";

export const genEnumName = (definition: PrimitiveSchema): string => {
    let enumName = "";
    let parent = definition.parent;
    while (parent) {
        enumName = parent.name + "_" + enumName;
        parent = parent.parent;
    }
    return `${enumName}${definition.name}`;
};

// Helper that converts a key to a valid enum key value pair
export const getEnumKeyValuePair = (key: string): [string, string] => {
    const words = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
    return [
        (key === "" ? "none" : Number.isNaN(Number.parseInt(key)) ? key : words[Number.parseInt(key)]!)
            .toString()
            .toUpperCase(),
        key,
    ];
};

/**
 * Enums could be top level or nested, but no matter where they are we want to
 * hoist them to the top level to we can use them directly from TS.
 */
export const genEnumType =
    (_wholeSchema: unknown) =>
    (definition: PrimitiveSchema): [thisLevel: string, hoistedValues: string[]] => {
        // Create a map of the enum values to the enum values
        const enumFields: Record<string, string> = Object.assign(
            {},
            ...definition.enum!.map((value) => getEnumKeyValuePair(value)).map(([key, value]) => ({ [key]: value }))
        );

        const enumName = genEnumName(definition);
        const TsSchemaType = `Schema.enums(${enumName})`;
        const enumTs = `export enum ${enumName} { ${Object.entries(enumFields)
            .map(([key, value]) => `"${key}"="${value}"`)
            .join(",")} }`;

        return [optionalModifier(definition, TsSchemaType), [enumTs]];
    };
