import * as Schema from "@effect/schema/Schema";

export class VolumeAttachment extends Schema.Class<VolumeAttachment>("VolumeAttachment")(
    {
        ID: Schema.optional(Schema.String, { nullable: true }),
        Source: Schema.optional(Schema.String, { nullable: true }),
        Target: Schema.optional(Schema.String, { nullable: true }),
    },
    {
        identifier: "VolumeAttachment",
        title: "swarm.VolumeAttachment",
    }
) {}
