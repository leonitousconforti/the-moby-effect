import type { ISchemaDefinition } from "./types.js";

export const primitiveTypeMappings = {
    string: "Schema.string",
    integer: "Schema.number",
    number: "Schema.number",
    boolean: "Schema.boolean",
};

export const genPrimitiveType = (definition: ISchemaDefinition): [thisLevel: string, hoistedValues: string[]] => {
    const TsType = primitiveTypeMappings[definition.type as keyof typeof primitiveTypeMappings]!;

    if (!definition.parent) {
        throw new Error("Top level primitives are not implemented");
    }

    // Check for nullable modifier
    const withNullableModifier = definition["x-nullable"] ? `Schema.nullable(${TsType})` : TsType;

    // Check for default value short circuit
    if (definition.default) {
        const value: string = definition.type === "string" ? `"${definition.default}"` : definition.default;
        return [`Schema.optional(${withNullableModifier}).withDefault(() => ${value})`, []];
    }

    // Check for optional modifier
    const withOptionalModifier =
        definition.required?.includes(definition.name) || definition.parent.required?.includes(definition.name)
            ? withNullableModifier
            : `Schema.optional(${withNullableModifier})`;

    return [withOptionalModifier, []];
};
