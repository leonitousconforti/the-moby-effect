import type { Modifier } from "./modifier.js";

export const optionalModifier: Modifier = (definition, existingType) => {
    const selfDoesNotHaveDefault = !definition.default;
    const parentDemandsSelf = definition.parent?.required?.includes(definition.name);

    if (selfDoesNotHaveDefault && parentDemandsSelf) return existingType;
    else if (selfDoesNotHaveDefault) return `Schema.optional(${existingType})`;
    else {
        // const defaultValue =
        //     isPrimitiveSchema(definition) && definition.enum
        //         ? `${genEnumName(definition)}.${getEnumKeyValuePair(definition.default as any)[0]}`
        //         : definition.type === "string"
        //           ? `"${definition.default}"`
        //           : `(${JSON.stringify(definition.default)})`;

        // return `Schema.optional(${existingType}, { default: () => ${defaultValue} })`;
        return `Schema.optional(${existingType})`;
    }
};
