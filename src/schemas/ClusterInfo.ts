import { Schema as S } from "@effect/schema";
import { pipe } from "effect";

import { ObjectVersion } from "./ObjectVersion.js";
import { SwarmSpec } from "./SwarmSpec.js";
import { TLSInfo } from "./TLSInfo.js";

/**
 * ClusterInfo represents information about the swarm as is returned by the
 * "/info" endpoint. Join-tokens are not included.
 */
export const ClusterInfo = S.Struct({
    /** The ID of the swarm. */
    ID: S.optional(S.String),
    Version: S.optional(ObjectVersion),
    /**
     * Date and time at which the swarm was initialized in [RFC
     * 3339](https://www.ietf.org/rfc/rfc3339.txt) format with nano-seconds.
     */
    CreatedAt: S.optional(S.String),
    /**
     * Date and time at which the swarm was last updated in [RFC
     * 3339](https://www.ietf.org/rfc/rfc3339.txt) format with nano-seconds.
     */
    UpdatedAt: S.optional(S.String),
    Spec: S.optional(SwarmSpec),
    TLSInfo: S.optional(TLSInfo),
    /** Whether there is currently a root CA rotation in progress for the swarm */
    RootRotationInProgress: S.optional(S.Boolean),
    /**
     * DataPathPort specifies the data path port number for data traffic.
     * Acceptable port range is 1024 to 49151. If no port is set or is set to 0,
     * the default port (4789) is used.
     */
    DataPathPort: S.optional(pipe(S.Number, S.int())),
    /**
     * Default Address Pool specifies default subnet pools for global scope
     * networks.
     */
    DefaultAddrPool: S.optional(S.Array(S.String)),
    /**
     * SubnetSize specifies the subnet size of the networks created from the
     * default subnet pool.
     */
    SubnetSize: S.optional(pipe(S.Number, S.int(), S.lessThanOrEqualTo(29))),
});

export type ClusterInfo = S.Schema.Type<typeof ClusterInfo>;
export const ClusterInfoEncoded = S.encodedSchema(ClusterInfo);
export type ClusterInfoEncoded = S.Schema.Encoded<typeof ClusterInfo>;
