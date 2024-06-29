import { Schema as S } from "@effect/schema";

/**
 * Information about the storage driver used to store the container's and
 * image's filesystem.
 */
export const GraphDriverData = S.Struct({
    /** Name of the storage driver. */
    Name: S.String,
    /**
     * Low-level storage metadata, provided as key/value pairs.
     *
     * This information is driver-specific, and depends on the storage-driver in
     * use, and should be used for informational purposes only.
     */
    Data: S.Record(S.String, S.String),
});

export type GraphDriverData = S.Schema.Type<typeof GraphDriverData>;
export const GraphDriverDataEncoded = S.encodedSchema(GraphDriverData);
export type GraphDriverDataEncoded = S.Schema.Encoded<typeof GraphDriverData>;
