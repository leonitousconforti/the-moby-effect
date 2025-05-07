import * as Schema from "effect/Schema";
import * as BindOptions from "./BindOptions.generated.js";
import * as ClusterOptions from "./ClusterOptions.generated.js";
import * as ImageOptions from "./ImageOptions.generated.js";
import * as TmpfsOptions from "./TmpfsOptions.generated.js";
import * as VolumeOptions from "./VolumeOptions.generated.js";

export class Mount extends Schema.Class<Mount>("Mount")(
    {
        Type: Schema.optional(
            Schema.Literal("bind", "volume", "tmpfs", "npipe", "cluster", "image").annotations({
                documentation:
                    "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/mount/mount.go#L7-L24",
            })
        ),
        Source: Schema.optional(Schema.String),
        Target: Schema.optional(Schema.String),
        ReadOnly: Schema.optional(Schema.Boolean),
        Consistency: Schema.optional(
            Schema.Literal("consistent", "cached", "delegated", "default").annotations({
                documentation:
                    "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/mount/mount.go#L72-L84",
            })
        ),

        BindOptions: Schema.optionalWith(BindOptions.BindOptions, { nullable: true }),
        VolumeOptions: Schema.optionalWith(VolumeOptions.VolumeOptions, { nullable: true }),
        ImageOptions: Schema.optionalWith(ImageOptions.ImageOptions, { nullable: true }),
        TmpfsOptions: Schema.optionalWith(TmpfsOptions.TmpfsOptions, { nullable: true }),
        ClusterOptions: Schema.optionalWith(ClusterOptions.ClusterOptions, { nullable: true }),
    },
    {
        identifier: "Mount",
        title: "mount.Mount",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/mount/mount.go#L26-L42",
    }
) {}
