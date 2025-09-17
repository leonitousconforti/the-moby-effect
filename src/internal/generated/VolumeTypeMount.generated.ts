import * as Schema from "effect/Schema";

export class VolumeTypeMount extends Schema.Class<VolumeTypeMount>("VolumeTypeMount")(
    {
        FsType: Schema.optional(Schema.String),
        MountFlags: Schema.optionalWith(Schema.Array(Schema.String), { nullable: true }),
    },
    {
        identifier: "VolumeTypeMount",
        title: "volume.TypeMount",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/volume#TypeMount",
    }
) {}
