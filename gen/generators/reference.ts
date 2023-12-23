import { nullableModifier } from "../modifiers/nullable.js";
import { optionalModifier } from "../modifiers/optional.js";
import { HOIST_REQUEST, isPrimitiveSchema, type ISchemaDefinition, type ReferenceSchema } from "../types.js";

/**
 * Just return the name of the type for referenced types, and we will hoist the
 * referenced type as a hoist request (not a hoisted type because we don't want
 * to generate it again since we know it will be generated when processing all
 * the definitions and having duplicate types would be more difficult) to ensure
 * that it will be defined before this one in the final TS schema.
 */
export const genReferenceSchema =
    (wholeSchema: { definitions: Record<string, ISchemaDefinition> }) =>
    (definition: ReferenceSchema): [thisLevel: string, hoistedValues: string[]] => {
        const type = definition.$ref.replace("#/definitions/", "");
        const hoistRequest = `${HOIST_REQUEST}${type}`;

        const referencedSchema = wholeSchema.definitions[type as keyof typeof wholeSchema.definitions];
        if (!referencedSchema) throw new Error(`Could not find referenced schema ${type}`);

        /**
         * If the referenced schema is a primitive schema with an enum and we
         * have a parent (i.e we are not at top level scope), then we need to
         * wrap the generated type in a Schema.enums schema as simply passing
         * its generated type name will not do.
         */
        const withEnumModifier =
            isPrimitiveSchema(referencedSchema) && referencedSchema.enum && definition.parent
                ? `Schema.enums(${type})`
                : type;

        return definition.parent
            ? [optionalModifier(definition, nullableModifier(definition, withEnumModifier)), [hoistRequest]]
            : [`export class ${definition.name} extends ${type}.extend<${definition.name}>()({}) {}`, [hoistRequest]];
    };
