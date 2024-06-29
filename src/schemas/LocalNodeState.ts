import { Schema as S } from "@effect/schema";

/** Current local status of this node. */
export const LocalNodeState = S.Literal("", "inactive", "pending", "active", "error", "locked");
export type LocalNodeState = S.Schema.Type<typeof LocalNodeState>;
export const LocalNodeStateEncoded = S.encodedSchema(LocalNodeState);
export type LocalNodeStateEncoded = S.Schema.Encoded<typeof LocalNodeState>;
