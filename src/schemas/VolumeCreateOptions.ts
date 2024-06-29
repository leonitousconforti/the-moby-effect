import { Schema as S } from "@effect/schema";

import { ClusterVolumeSpec } from "./ClusterVolumeSpec.js";

/** Volume configuration */
export const VolumeCreateOptions = S.Struct({
    /** The new volume's name. If not specified, Docker generates a name. */
    Name: S.optional(S.String),
    /** Name of the volume driver to use. */
    Driver: S.optional(S.String, {
        default: () => "local",
    }),
    /**
     * A mapping of driver options and values. These options are passed directly
     * to the driver and are driver specific.
     */
    DriverOpts: S.optional(S.Record(S.String, S.String)),
    /** User-defined key/value metadata. */
    Labels: S.optional(S.Record(S.String, S.String)),
    ClusterVolumeSpec: S.optional(ClusterVolumeSpec),
});

export type VolumeCreateOptions = S.Schema.Type<typeof VolumeCreateOptions>;
export const VolumeCreateOptionsEncoded = S.encodedSchema(VolumeCreateOptions);
export type VolumeCreateOptionsEncoded = S.Schema.Encoded<typeof VolumeCreateOptions>;
