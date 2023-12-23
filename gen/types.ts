/**
 * A type for all the properties that are shared amongst all schema definitions
 * that I care about when parsing.
 */
interface IBaseSchemaDefinition {
    name: string;
    description?: string | undefined;
    "x-nullable"?: boolean | undefined;
    parent?: (ISchemaDefinition & { required?: string[] | undefined; fromAllOf?: boolean | undefined }) | undefined;
}

/** A discriminated union type for all the different types of schema definitions */
export type ISchemaDefinition = IBaseSchemaDefinition &
    (
        | {
              type: "string" | "integer" | "number" | "boolean";
              name: string;
              enum?: string[] | undefined;
              default?: string | number | boolean | undefined;
          }
        | {
              type: "object";
              properties?: Record<string, ISchemaDefinition> | undefined;
              required?: string[] | undefined;
              default?: Record<string, unknown> | undefined;
              additionalProperties?: ISchemaDefinition | undefined;
          }
        | {
              type: "array";
              items: ISchemaDefinition;
              default?: unknown[] | undefined;
          }
        | {
              type: "allOf";
              default?: unknown[] | undefined;
              allOf?: ISchemaDefinition[] | undefined;
          }
        | {
              type: "ref";
              $ref: string;
              default?: unknown | undefined;
          }
        | {
              type: "unknown";
              default?: unknown | undefined;
          }
    );

export type AllOfSchema = ISchemaDefinition extends infer S ? (S extends { type: "allOf" } ? S : never) : never;
export type ArraySchema = ISchemaDefinition extends infer S ? (S extends { type: "array" } ? S : never) : never;
export type ReferenceSchema = ISchemaDefinition extends infer S ? (S extends { type: "ref" } ? S : never) : never;
export type ObjectSchema = ISchemaDefinition extends infer S ? (S extends { type: "object" } ? S : never) : never;
export type PrimitiveSchema = ISchemaDefinition extends infer S
    ? S extends { type: "string" | "integer" | "number" | "boolean" }
        ? S
        : never
    : never;

/* eslint-disable @typescript-eslint/no-explicit-any */
export const isAllOfSchema = (definition: any): definition is AllOfSchema => definition?.allOf;
export const isEnumSchema = (definition: any): definition is PrimitiveSchema => definition?.enum;
export const isReferenceSchema = (definition: any): definition is ReferenceSchema => definition?.$ref;
export const isArraySchema = (definition: any): definition is ArraySchema => definition?.type === "array";
export const isObjectSchema = (definition: any): definition is ObjectSchema => definition?.type === "object";
export const isPrimitiveSchema = (definition: any): definition is PrimitiveSchema =>
    definition.type === "string" ||
    definition.type === "integer" ||
    definition.type === "number" ||
    definition.type === "boolean";
/* eslint-enable @typescript-eslint/no-explicit-any */

// Used when you don't want to regenerate the same type multiple times but still want to hoist it
export const HOIST_REQUEST = "__HOIST_REQUEST__" as const;
