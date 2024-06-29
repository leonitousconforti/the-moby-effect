import { Schema as S } from "@effect/schema";

/** Represents a peer-node in the swarm */
export const PeerNode = S.Struct({
    /** Unique identifier of for this node in the swarm. */
    NodeID: S.optional(S.String),
    /** IP address and ports at which this node can be reached. */
    Addr: S.optional(S.String),
});

export type PeerNode = S.Schema.Type<typeof PeerNode>;
export const PeerNodeEncoded = S.encodedSchema(PeerNode);
export type PeerNodeEncoded = S.Schema.Encoded<typeof PeerNode>;
