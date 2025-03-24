import * as Schema from "effect/Schema";
import * as BindOptions from "./BindOptions.generated.js";
import * as ClusterOptions from "./ClusterOptions.generated.js";
import * as TmpfsOptions from "./TmpfsOptions.generated.js";
import * as VolumeOptions from "./VolumeOptions.generated.js";

export class Mount extends Schema.Class<Mount>("Mount")(
    {
        Type: Schema.optional(Schema.Literal("bind", "volume", "tmpfs", "npipe", "cluster")),
        Source: Schema.optional(Schema.String),
        Target: Schema.optional(Schema.String),
        ReadOnly: Schema.optional(Schema.Boolean),
        Consistency: Schema.optional(Schema.Literal("consistent", "cached", "delegated", "default")),

        BindOptions: Schema.optionalWith(BindOptions.BindOptions, { nullable: true }),
        VolumeOptions: Schema.optionalWith(VolumeOptions.VolumeOptions, { nullable: true }),
        TmpfsOptions: Schema.optionalWith(TmpfsOptions.TmpfsOptions, { nullable: true }),
        ClusterOptions: Schema.optionalWith(ClusterOptions.ClusterOptions, { nullable: true }),
    },
    {
        identifier: "Mount",
        title: "mount.Mount",
        documentation:
            "https://github.com/moby/moby/blob/733755d7cb18a4dbea7c290cc56e61d05502aca0/api/types/mount/mount.go#L24-L39",
    }
) {}
