import { Schema as S } from "@effect/schema";

/** PortBinding represents a binding between a host IP address and a host port. */
export const PortBinding = S.Struct({
    /** Host IP address that the container's port is mapped to. */
    HostIp: S.optional(S.String),
    /** Host port number that the container's port is mapped to. */
    HostPort: S.optional(S.String),
});

export type PortBinding = S.Schema.Type<typeof PortBinding>;
export const PortBindingEncoded = S.encodedSchema(PortBinding);
export type PortBindingEncoded = S.Schema.Encoded<typeof PortBinding>;
