import { Schema as S } from "@effect/schema";

import { IPAM } from "./IPAM.js";
import { NetworkContainer } from "./NetworkContainer.js";

export const Network = S.Struct({
    Name: S.optional(S.String),
    Id: S.optional(S.String),
    Created: S.optional(S.String),
    Scope: S.optional(S.String),
    Driver: S.optional(S.String),
    EnableIPv6: S.optional(S.Boolean),
    IPAM: S.optional(IPAM),
    Internal: S.optional(S.Boolean),
    Attachable: S.optional(S.Boolean),
    Ingress: S.optional(S.Boolean),
    Containers: S.optional(S.Record(S.String, NetworkContainer)),
    Options: S.optional(S.Record(S.String, S.String)),
    Labels: S.optional(S.Record(S.String, S.String)),
});

export type Network = S.Schema.Type<typeof Network>;
export const NetworkEncoded = S.encodedSchema(Network);
export type NetworkEncoded = S.Schema.Encoded<typeof Network>;
