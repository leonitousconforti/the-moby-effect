import * as Schema from "@effect/schema/Schema";

export class PublishStatus extends Schema.Class<PublishStatus>("PublishStatus")(
    {
        NodeID: Schema.optional(Schema.String, { nullable: true }),
        State: Schema.optional(Schema.String, { nullable: true }),
        PublishContext: Schema.optional(Schema.Record(Schema.String, Schema.String), { nullable: true }),
    },
    {
        identifier: "PublishStatus",
        title: "volume.PublishStatus",
    }
) {}
