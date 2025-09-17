import * as Schema from "effect/Schema";

export class SwarmVolumeAttachment extends Schema.Class<SwarmVolumeAttachment>("SwarmVolumeAttachment")(
    {
        ID: Schema.optional(Schema.String),
        Source: Schema.optional(Schema.String),
        Target: Schema.optional(Schema.String),
    },
    {
        identifier: "SwarmVolumeAttachment",
        title: "swarm.VolumeAttachment",
        documentation:
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#VolumeAttachment",
    }
) {}
