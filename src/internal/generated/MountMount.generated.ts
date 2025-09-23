import * as Schema from "effect/Schema";
import * as MountBindOptions from "./MountBindOptions.generated.js";
import * as MountClusterOptions from "./MountClusterOptions.generated.js";
import * as MountImageOptions from "./MountImageOptions.generated.js";
import * as MountTmpfsOptions from "./MountTmpfsOptions.generated.js";
import * as MountVolumeOptions from "./MountVolumeOptions.generated.js";

export class MountMount extends Schema.Class<MountMount>("MountMount")(
    {
        Type: Schema.optional(Schema.Literal("bind", "volume", "tmpfs", "npipe", "cluster", "image")),
        Source: Schema.optional(Schema.String),
        Target: Schema.optional(Schema.String),
        ReadOnly: Schema.optional(Schema.Boolean),
        Consistency: Schema.optional(Schema.Literal("consistent", "cached", "delegated", "default")),
        BindOptions: Schema.optionalWith(MountBindOptions.MountBindOptions, { nullable: true }),
        VolumeOptions: Schema.optionalWith(MountVolumeOptions.MountVolumeOptions, { nullable: true }),
        ImageOptions: Schema.optionalWith(MountImageOptions.MountImageOptions, { nullable: true }),
        TmpfsOptions: Schema.optionalWith(MountTmpfsOptions.MountTmpfsOptions, { nullable: true }),
        ClusterOptions: Schema.optionalWith(MountClusterOptions.MountClusterOptions, { nullable: true }),
    },
    {
        identifier: "MountMount",
        title: "mount.Mount",
        documentation: "",
    }
) {}
