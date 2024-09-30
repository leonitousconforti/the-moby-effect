import * as Schema from "@effect/schema/Schema";

export class VolumeTypeMount extends Schema.Class<VolumeTypeMount>("VolumeTypeMount")(
    {
        /** FsType specifies the filesystem type for the mount volume. */
        FsType: Schema.optional(Schema.String),

        /** MountFlags defines flags to pass when mounting the volume. */
        MountFlags: Schema.optionalWith(Schema.Array(Schema.String), { nullable: true }),
    },
    {
        identifier: "VolumeTypeMount",
        title: "volume.TypeMount",
        documentation:
            "https://github.com/moby/moby/blob/a21b1a2d12e2c01542cb191eb526d7bfad0641e3/api/types/volume/cluster_volume.go#L148-L156",
    }
) {}
