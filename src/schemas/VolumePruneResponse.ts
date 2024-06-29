import { Schema as S } from "@effect/schema";

/** Volume Prune response */
export const VolumePruneResponse = S.Struct({
    /** Volumes that were deleted */
    VolumesDeleted: S.optional(S.Array(S.String)),
    /** Disk space reclaimed in bytes */
    SpaceReclaimed: S.optional(S.Number),
});

export type VolumePruneResponse = S.Schema.Type<typeof VolumePruneResponse>;
export const VolumePruneResponseEncoded = S.encodedSchema(VolumePruneResponse);
export type VolumePruneResponseEncoded = S.Schema.Encoded<typeof VolumePruneResponse>;
