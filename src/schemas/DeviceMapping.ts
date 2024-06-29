import { Schema as S } from "@effect/schema";

/** A device mapping between the host and container */
export const DeviceMapping = S.Struct({
    PathOnHost: S.optional(S.String),
    PathInContainer: S.optional(S.String),
    CgroupPermissions: S.optional(S.String),
});

export type DeviceMapping = S.Schema.Type<typeof DeviceMapping>;
export const DeviceMappingEncoded = S.encodedSchema(DeviceMapping);
export type DeviceMappingEncoded = S.Schema.Encoded<typeof DeviceMapping>;
