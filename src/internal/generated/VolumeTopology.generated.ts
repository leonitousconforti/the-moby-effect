import * as Schema from "effect/Schema";

export class VolumeTopology extends Schema.Class<VolumeTopology>("VolumeTopology")(
    {
        Segments: Schema.optional(Schema.NullOr(Schema.Record(Schema.String, Schema.String))),
    },
    {
        identifier: "VolumeTopology",
        title: "volume.Topology",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/volume#Topology",
    }
) {}
