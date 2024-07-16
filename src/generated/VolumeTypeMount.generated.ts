import * as Schema from "@effect/schema/Schema";

export class VolumeTypeMount extends Schema.Class<VolumeTypeMount>("VolumeTypeMount")(
    {
        FsType: Schema.optional(Schema.String),
        MountFlags: Schema.optional(Schema.Array(Schema.String), { nullable: true }),
    },
    {
        identifier: "VolumeTypeMount",
        title: "volume.TypeMount",
    }
) {}
