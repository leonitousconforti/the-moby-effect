import { Schema as S } from "@effect/schema";

export const NetworkContainer = S.Struct({
    Name: S.optional(S.String),
    EndpointID: S.optional(S.String),
    MacAddress: S.optional(S.String),
    IPv4Address: S.optional(S.String),
    IPv6Address: S.optional(S.String),
});

export type NetworkContainer = S.Schema.Type<typeof NetworkContainer>;
export const NetworkContainerEncoded = S.encodedSchema(NetworkContainer);
export type NetworkContainerEncoded = S.Schema.Encoded<typeof NetworkContainer>;
