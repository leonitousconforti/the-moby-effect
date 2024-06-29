import { Schema as S } from "@effect/schema";

/** Reachability represents the reachability of a node. */
export const Reachability = S.Literal("unknown", "unreachable", "reachable");
export type Reachability = S.Schema.Type<typeof Reachability>;
export const ReachabilityEncoded = S.encodedSchema(Reachability);
export type ReachabilityEncoded = S.Schema.Encoded<typeof Reachability>;
