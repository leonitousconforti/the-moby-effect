import * as Schema from "@effect/schema/Schema";

export class PublishStatus extends Schema.Class<PublishStatus>("PublishStatus")(
    {
        /** The ID of the swarm node this Volume is published to */
        NodeID: Schema.optional(Schema.String),

        /** The publish state of the volume. */
        State: Schema.optional(Schema.String),

        /**
         * The PublishContext returned by the CSI plugin when a volume is
         * published.
         */
        PublishContext: Schema.optional(Schema.Record(Schema.String, Schema.String), { nullable: true }),
    },
    {
        identifier: "PublishStatus",
        title: "volume.PublishStatus",
    }
) {}
