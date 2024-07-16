import * as Schema from "@effect/schema/Schema";

export class VolumeTopology extends Schema.Class<VolumeTopology>("VolumeTopology")(
    {
        Segments: Schema.optional(Schema.Record(Schema.String, Schema.String), { nullable: true }),
    },
    {
        identifier: "VolumeTopology",
        title: "volume.Topology",
    }
) {}
