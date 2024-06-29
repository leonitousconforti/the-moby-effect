import { Schema as S } from "@effect/schema";

/**
 * A map of topological domains to topological segments. For in depth details,
 * see documentation for the Topology object in the CSI specification.
 */
export const Topology = S.Record(S.String, S.String);

export type Topology = S.Schema.Type<typeof Topology>;
export const TopologyEncoded = S.encodedSchema(Topology);
export type TopologyEncoded = S.Schema.Encoded<typeof Topology>;
