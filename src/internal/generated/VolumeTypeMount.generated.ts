import * as Schema from "effect/Schema";

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
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/volume/cluster_volume.go#L148-L156",
    }
) {}
