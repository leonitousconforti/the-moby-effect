import { Schema as S } from "@effect/schema";
import { pipe } from "effect";

import { ClusterVolume } from "./ClusterVolume.js";

export const Volume = S.Struct({
    /** Name of the volume. */
    Name: S.String,
    /** Name of the volume driver used by the volume. */
    Driver: S.String,
    /** Mount path of the volume on the host. */
    Mountpoint: S.String,
    /** Date/Time the volume was created. */
    CreatedAt: S.optional(S.String),
    /**
     * Low-level details about the volume, provided by the volume driver.
     * Details are returned as a map with key/value pairs:
     * `{"key":"value","key2":"value2"}`.
     *
     * The `Status` field is optional, and is omitted if the volume driver does
     * not support this feature.
     */
    Status: S.optional(S.Record(S.String, S.Struct({}))),
    /** User-defined key/value metadata. */
    Labels: S.Record(S.String, S.String),
    /**
     * The level at which the volume exists. Either `global` for cluster-wide,
     * or `local` for machine level.
     */
    Scope: S.Literal("local", "global"),
    ClusterVolume: S.optional(ClusterVolume),
    /** The driver specific options used when creating the volume. */
    Options: S.Record(S.String, S.String),
    /**
     * Usage details about the volume. This information is used by the `GET
     * /system/df` endpoint, and omitted in other endpoints.
     */
    UsageData: S.optional(
        S.Struct({
            /**
             * Amount of disk space used by the volume (in bytes). This
             * information is only available for volumes created with the
             * `"local"` volume driver. For volumes created with other volume
             * drivers, this field is set to `-1` ("not available")
             */
            Size: pipe(S.Number, S.int()),
            /**
             * The number of containers referencing this volume. This field is
             * set to `-1` if the reference-count is not available.
             */
            RefCount: pipe(S.Number, S.int()),
        })
    ),
});

export type Volume = S.Schema.Type<typeof Volume>;
export const VolumeEncoded = S.encodedSchema(Volume);
export type VolumeEncoded = S.Schema.Encoded<typeof Volume>;
