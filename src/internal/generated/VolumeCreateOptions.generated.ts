import * as Schema from "effect/Schema";
import * as VolumeClusterVolumeSpec from "./VolumeClusterVolumeSpec.generated.js";

export class VolumeCreateOptions extends Schema.Class<VolumeCreateOptions>("VolumeCreateOptions")(
    {
        ClusterVolumeSpec: Schema.optionalWith(VolumeClusterVolumeSpec.VolumeClusterVolumeSpec, { nullable: true }),
        Driver: Schema.optional(Schema.String),
        DriverOpts: Schema.optionalWith(Schema.Record({ key: Schema.String, value: Schema.String }), {
            nullable: true,
        }),
        Labels: Schema.optionalWith(Schema.Record({ key: Schema.String, value: Schema.String }), { nullable: true }),
        Name: Schema.optional(Schema.String),
    },
    {
        identifier: "VolumeCreateOptions",
        title: "volume.CreateOptions",
        documentation:
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/volume#CreateOptions",
    }
) {}
