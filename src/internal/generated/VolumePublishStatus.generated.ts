import * as Schema from "effect/Schema";
import * as MobyIdentifiers from "../schemas/id.ts";

export class VolumePublishStatus extends Schema.Class<VolumePublishStatus>("VolumePublishStatus")(
    {
        NodeID: Schema.optional(MobyIdentifiers.NodeIdentifier),
        State: Schema.optional(
            Schema.Literal("pending-publish", "published", "pending-node-unpublish", "pending-controller-unpublish")
        ),
        PublishContext: Schema.optionalWith(Schema.Record({ key: Schema.String, value: Schema.String }), {
            nullable: true,
        }),
    },
    {
        identifier: "VolumePublishStatus",
        title: "volume.PublishStatus",
        documentation:
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/volume#PublishStatus",
    }
) {}
