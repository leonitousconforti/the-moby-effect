import { Schema as S } from "@effect/schema";

import { Reachability } from "./Reachability.js";

/**
 * ManagerStatus represents the status of a manager.
 *
 * It provides the current status of a node's manager component, if the node is
 * a manager.
 */
export const ManagerStatus = S.Struct({
    Leader: S.optional(S.Boolean, {
        default: () => false,
    }),
    Reachability: S.optional(Reachability),
    /** The IP address and port at which the manager is reachable. */
    Addr: S.optional(S.String),
});

export type ManagerStatus = S.Schema.Type<typeof ManagerStatus>;
export const ManagerStatusEncoded = S.encodedSchema(ManagerStatus);
export type ManagerStatusEncoded = S.Schema.Encoded<typeof ManagerStatus>;
