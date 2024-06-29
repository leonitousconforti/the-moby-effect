import { Schema as S } from "@effect/schema";

export const NodeSpec = S.Struct({
    /** Name for the node. */
    Name: S.optional(S.String),
    /** User-defined key/value metadata. */
    Labels: S.optional(S.Record(S.String, S.String)),
    /** Role of the node. */
    Role: S.optional(S.Literal("worker", "manager")),
    /** Availability of the node. */
    Availability: S.optional(S.Literal("active", "pause", "drain")),
});

export type NodeSpec = S.Schema.Type<typeof NodeSpec>;
export const NodeSpecEncoded = S.encodedSchema(NodeSpec);
export type NodeSpecEncoded = S.Schema.Encoded<typeof NodeSpec>;
