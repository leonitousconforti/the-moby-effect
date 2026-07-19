import * as Schema from "effect/Schema";
import * as MountBindOptions from "./MountBindOptions.generated.ts";
import * as MountClusterOptions from "./MountClusterOptions.generated.ts";
import * as MountImageOptions from "./MountImageOptions.generated.ts";
import * as MountTmpfsOptions from "./MountTmpfsOptions.generated.ts";
import * as MountVolumeOptions from "./MountVolumeOptions.generated.ts";

export class MountMount extends Schema.Class<MountMount>("MountMount")(
    {
        Type: Schema.optional(Schema.Literals(["bind", "volume", "tmpfs", "npipe", "cluster", "image"])),
        Source: Schema.optional(Schema.String),
        Target: Schema.optional(Schema.String),
        ReadOnly: Schema.optional(Schema.Boolean),
        Consistency: Schema.optional(Schema.Literals(["consistent", "cached", "delegated", "default"])),
        BindOptions: Schema.optional(Schema.NullOr(MountBindOptions.MountBindOptions)),
        VolumeOptions: Schema.optional(Schema.NullOr(MountVolumeOptions.MountVolumeOptions)),
        ImageOptions: Schema.optional(Schema.NullOr(MountImageOptions.MountImageOptions)),
        TmpfsOptions: Schema.optional(Schema.NullOr(MountTmpfsOptions.MountTmpfsOptions)),
        ClusterOptions: Schema.optional(Schema.NullOr(MountClusterOptions.MountClusterOptions)),
    },
    {
        identifier: "MountMount",
        title: "mount.Mount",
        documentation: "",
    }
) {}
