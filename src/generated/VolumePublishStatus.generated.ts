import * as Schema from "@effect/schema/Schema";

export class VolumePublishStatus extends Schema.Class<VolumePublishStatus>("VolumePublishStatus")(
    {
        NodeID: Schema.optional(Schema.String),
        State: Schema.optional(Schema.String),
        PublishContext: Schema.optional(Schema.Record(Schema.String, Schema.String), { nullable: true }),
    },
    {
        identifier: "VolumePublishStatus",
        title: "volume.PublishStatus",
    }
) {}
