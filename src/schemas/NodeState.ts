import { Schema as S } from "@effect/schema";

/** NodeState represents the state of a node. */
export const NodeState = S.Literal("unknown", "down", "ready", "disconnected");
export type NodeState = S.Schema.Type<typeof NodeState>;
export const NodeStateEncoded = S.encodedSchema(NodeState);
export type NodeStateEncoded = S.Schema.Encoded<typeof NodeState>;
