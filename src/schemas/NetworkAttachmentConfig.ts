import { Schema as S } from "@effect/schema";

/** Specifies how a service should be attached to a particular network. */
export const NetworkAttachmentConfig = S.Struct({
    /** The target network for attachment. Must be a network name or ID. */
    Target: S.optional(S.String),
    /** Discoverable alternate names for the service on this network. */
    Aliases: S.optional(S.Array(S.String)),
    /** Driver attachment options for the network target. */
    DriverOpts: S.optional(S.Record(S.String, S.String)),
});

export type NetworkAttachmentConfig = S.Schema.Type<typeof NetworkAttachmentConfig>;
export const NetworkAttachmentConfigEncoded = S.encodedSchema(NetworkAttachmentConfig);
export type NetworkAttachmentConfigEncoded = S.Schema.Encoded<typeof NetworkAttachmentConfig>;
