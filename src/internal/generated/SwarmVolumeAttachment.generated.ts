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
            "https://github.com/moby/moby/blob/7d861e889cd2214b38c8f1f3f997bf003c77739d/api/types/swarm/task.go#L213-L225",
    }
) {}
