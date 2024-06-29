import { Schema as S } from "@effect/schema";
import { pipe } from "effect";

import { ClusterInfo } from "./ClusterInfo.js";
import { LocalNodeState } from "./LocalNodeState.js";
import { PeerNode } from "./PeerNode.js";

/** Represents generic information about swarm. */
export const SwarmInfo = S.Struct({
    /** Unique identifier of for this node in the swarm. */
    NodeID: S.optional(S.String, {
        default: () => "",
    }),
    /** IP address at which this node can be reached by other nodes in the swarm. */
    NodeAddr: S.optional(S.String, {
        default: () => "",
    }),
    LocalNodeState: S.optional(LocalNodeState),
    ControlAvailable: S.optional(S.Boolean, {
        default: () => false,
    }),
    Error: S.optional(S.String, {
        default: () => "",
    }),
    /** List of ID's and addresses of other managers in the swarm. */
    RemoteManagers: S.optional(S.Array(PeerNode)),
    /** Total number of nodes in the swarm. */
    Nodes: S.optional(pipe(S.Number, S.int())),
    /** Total number of managers in the swarm. */
    Managers: S.optional(pipe(S.Number, S.int())),
    Cluster: S.optional(ClusterInfo),
});

export type SwarmInfo = S.Schema.Type<typeof SwarmInfo>;
export const SwarmInfoEncoded = S.encodedSchema(SwarmInfo);
export type SwarmInfoEncoded = S.Schema.Encoded<typeof SwarmInfo>;
