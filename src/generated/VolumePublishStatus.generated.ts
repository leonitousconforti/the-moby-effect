import * as Schema from "@effect/schema/Schema";

export class VolumePublishStatus extends Schema.Class<VolumePublishStatus>("VolumePublishStatus")(
    {
        /** NodeID is the ID of the swarm node this Volume is published to. */
        NodeID: Schema.optional(Schema.String),

        /** State is the publish state of the volume. */
        State: Schema.optional(
            Schema.Literal("pending-publish", "published", "pending-node-unpublish", "pending-controller-unpublish")
        ),

        /**
         * PublishContext is the PublishContext returned by the CSI plugin when
         * a volume is published.
         */
        PublishContext: Schema.optional(Schema.Record(Schema.String, Schema.String), { nullable: true }),
    },
    {
        identifier: "VolumePublishStatus",
        title: "volume.PublishStatus",
        documentation:
            "https://github.com/moby/moby/blob/a21b1a2d12e2c01542cb191eb526d7bfad0641e3/api/types/volume/cluster_volume.go#L386-L398",
    }
) {}
