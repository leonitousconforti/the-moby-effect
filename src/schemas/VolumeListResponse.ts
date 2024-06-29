import { Schema as S } from "@effect/schema";

import { Volume } from "./Volume.js";

/** Volume list response */
export const VolumeListResponse = S.Struct({
    /** List of volumes */
    Volumes: S.optional(S.Array(Volume)),
    /** Warnings that occurred when fetching the list of volumes. */
    Warnings: S.optional(S.Array(S.String)),
});

export type VolumeListResponse = S.Schema.Type<typeof VolumeListResponse>;
export const VolumeListResponseEncoded = S.encodedSchema(VolumeListResponse);
export type VolumeListResponseEncoded = S.Schema.Encoded<typeof VolumeListResponse>;
