import * as Schema from "effect/Schema";
import * as ClusterVolumeSpec from "./ClusterVolumeSpec.generated.js";

export class VolumeCreateOptions extends Schema.Class<VolumeCreateOptions>("VolumeCreateOptions")(
    {
        ClusterVolumeSpec: Schema.optionalWith(ClusterVolumeSpec.ClusterVolumeSpec, { nullable: true }),
        Driver: Schema.optional(Schema.String),
        DriverOpts: Schema.optionalWith(
            Schema.Record({
                key: Schema.String,
                value: Schema.String,
            }),
            { nullable: true }
        ),
        Labels: Schema.optionalWith(
            Schema.Record({
                key: Schema.String,
                value: Schema.String,
            }),
            { nullable: true }
        ),
        Name: Schema.optional(Schema.String),
    },
    {
        identifier: "VolumeCreateOptions",
        title: "volume.CreateOptions",
        documentation:
            "https://github.com/moby/moby/blob/7d861e889cd2214b38c8f1f3f997bf003c77739d/api/types/volume/create_options.go#L6-L29",
    }
) {}
