import * as Schema from "effect/Schema";
import * as VolumeClusterVolumeSpec from "./VolumeClusterVolumeSpec.generated.ts";

export class VolumeCreateOptions extends Schema.Class<VolumeCreateOptions>("VolumeCreateOptions")(
    {
        ClusterVolumeSpec: Schema.optional(Schema.NullOr(VolumeClusterVolumeSpec.VolumeClusterVolumeSpec)),
        Driver: Schema.optional(Schema.String),
        DriverOpts: Schema.optional(Schema.NullOr(Schema.Record(Schema.String, Schema.String))),
        Labels: Schema.optional(Schema.NullOr(Schema.Record(Schema.String, Schema.String))),
        Name: Schema.optional(Schema.String),
    },
    {
        identifier: "VolumeCreateOptions",
        title: "volume.CreateOptions",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/volume#CreateOptions",
    }
) {}
