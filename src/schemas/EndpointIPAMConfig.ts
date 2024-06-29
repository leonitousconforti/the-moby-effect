import { Schema as S } from "@effect/schema";

/** EndpointIPAMConfig represents an endpoint's IPAM configuration. */
export const EndpointIPAMConfig = S.Struct({
    IPv4Address: S.optional(S.String),
    IPv6Address: S.optional(S.String),
    LinkLocalIPs: S.optional(S.Array(S.String)),
});

export type EndpointIPAMConfig = S.Schema.Type<typeof EndpointIPAMConfig>;
export const EndpointIPAMConfigEncoded = S.encodedSchema(EndpointIPAMConfig);
export type EndpointIPAMConfigEncoded = S.Schema.Encoded<typeof EndpointIPAMConfig>;
