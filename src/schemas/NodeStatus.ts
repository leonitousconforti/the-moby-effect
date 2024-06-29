import { Schema as S } from "@effect/schema";

import { NodeState } from "./NodeState.js";

/**
 * NodeStatus represents the status of a node.
 *
 * It provides the current status of the node, as seen by the manager.
 */
export const NodeStatus = S.Struct({
    State: S.optional(NodeState),
    Message: S.optional(S.String),
    /** IP address of the node. */
    Addr: S.optional(S.String),
});

export type NodeStatus = S.Schema.Type<typeof NodeStatus>;
export const NodeStatusEncoded = S.encodedSchema(NodeStatus);
export type NodeStatusEncoded = S.Schema.Encoded<typeof NodeStatus>;
