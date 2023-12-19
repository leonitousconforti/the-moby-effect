import { ISchemaDefinition } from "./types.js";

/**
 * Enums could be top level or nested, but no matter where they are we want to
 * hoist them to the top level to we can use them directly from TS.
 */
export const genEnumType = (definition: ISchemaDefinition): [thisLevel: string, hoistedValues: string[]] => {
    // Helper that converts a value to a valid enum value
    const getEnumValue = (value: string): string => {
        const words = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];

        return (value === "" ? "none" : Number.isNaN(Number.parseInt(value)) ? value : words[Number.parseInt(value)]!)
            .toString()
            .toUpperCase()
            .replaceAll("-", "_");
    };

    // Create a map of the enum values to the enum values
    const enumFields: Record<string, string> = Object.assign(
        {},
        ...definition.enum!.map((value) => getEnumValue(value)).map((value) => ({ [value]: value }))
    );

    let enumName = "";
    let parent = definition.parent;
    while (parent) {
        enumName = parent.name + "_" + enumName;
        parent = parent.parent;
    }

    if (definition["x-nullable"]) {
        throw new Error("Nullable enums are not implemented");
    }

    const enumSchema = definition.default
        ? `Schema.optional(Schema.enums(${enumName}${definition.name})).withDefault(() => ${enumName}${
              definition.name
          }.${getEnumValue(definition.default!)})`
        : (definition.required && !definition.required.includes(definition.name)) ||
            (definition.parent?.required && definition.parent.required.includes(definition.name))
          ? `Schema.optional(Schema.enums(${enumName}${definition.name}))`
          : `Schema.enums(${enumName}${definition.name})`;

    const enumTs = `export enum ${enumName}${definition.name} { ${Object.entries(enumFields)
        .map(([key, value]) => `"${key}"="${value}"`)
        .join(",")} }`;

    return [definition.parent ? enumSchema : "", [enumTs]];
};
