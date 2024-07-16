import * as Schema from "@effect/schema/Schema";

export class SwarmVolumeAttachment extends Schema.Class<SwarmVolumeAttachment>("SwarmVolumeAttachment")(
    {
        ID: Schema.optional(Schema.String),
        Source: Schema.optional(Schema.String),
        Target: Schema.optional(Schema.String),
    },
    {
        identifier: "SwarmVolumeAttachment",
        title: "swarm.VolumeAttachment",
    }
) {}
