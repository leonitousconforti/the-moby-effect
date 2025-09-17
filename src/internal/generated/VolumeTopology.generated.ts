import * as Schema from "effect/Schema";

export class VolumeTopology extends Schema.Class<VolumeTopology>("VolumeTopology")(
    {
        Segments: Schema.optionalWith(Schema.Record({ key: Schema.String, value: Schema.String }), { nullable: true }),
    },
    {
        identifier: "VolumeTopology",
        title: "volume.Topology",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/volume#Topology",
    }
) {}
