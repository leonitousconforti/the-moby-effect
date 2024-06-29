import { Schema as S } from "@effect/schema";
import { pipe } from "effect";

import { GenericResources } from "./GenericResources.js";

/**
 * An object describing the resources which can be advertised by a node and
 * requested by a task.
 */
export const ResourceObject = S.Struct({
    NanoCPUs: S.optional(pipe(S.Number, S.int())),
    MemoryBytes: S.optional(pipe(S.Number, S.int())),
    GenericResources: S.optional(GenericResources),
});

export type ResourceObject = S.Schema.Type<typeof ResourceObject>;
export const ResourceObjectEncoded = S.encodedSchema(ResourceObject);
export type ResourceObjectEncoded = S.Schema.Encoded<typeof ResourceObject>;
