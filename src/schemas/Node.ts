import { Schema as S } from "@effect/schema";

import { ManagerStatus } from "./ManagerStatus.js";
import { NodeDescription } from "./NodeDescription.js";
import { NodeSpec } from "./NodeSpec.js";
import { NodeStatus } from "./NodeStatus.js";
import { ObjectVersion } from "./ObjectVersion.js";

export const Node = S.Struct({
    ID: S.optional(S.String),
    Version: S.optional(ObjectVersion),
    /**
     * Date and time at which the node was added to the swarm in [RFC
     * 3339](https://www.ietf.org/rfc/rfc3339.txt) format with nano-seconds.
     */
    CreatedAt: S.optional(S.String),
    /**
     * Date and time at which the node was last updated in [RFC
     * 3339](https://www.ietf.org/rfc/rfc3339.txt) format with nano-seconds.
     */
    UpdatedAt: S.optional(S.String),
    Spec: S.optional(NodeSpec),
    Description: S.optional(NodeDescription),
    Status: S.optional(NodeStatus),
    ManagerStatus: S.optional(ManagerStatus),
});

export type Node = S.Schema.Type<typeof Node>;
export const NodeEncoded = S.encodedSchema(Node);
export type NodeEncoded = S.Schema.Encoded<typeof Node>;
