import * as Schema from "effect/Schema";

export class VolumePublishStatus extends Schema.Class<VolumePublishStatus>("VolumePublishStatus")(
    {
        /** NodeID is the ID of the swarm node this Volume is published to. */
        NodeID: Schema.optional(Schema.String),

        /** State is the publish state of the volume. */
        State: Schema.optional(
            Schema.Literal(
                "pending-publish",
                "published",
                "pending-node-unpublish",
                "pending-controller-unpublish"
            ).annotations({
                documentation:
                    "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/volume/cluster_volume.go#L362-L384",
            })
        ),

        /**
         * PublishContext is the PublishContext returned by the CSI plugin when
         * a volume is published.
         */
        PublishContext: Schema.optionalWith(Schema.Record({ key: Schema.String, value: Schema.String }), {
            nullable: true,
        }),
    },
    {
        identifier: "VolumePublishStatus",
        title: "volume.PublishStatus",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/volume/cluster_volume.go#L386-L398",
    }
) {}
