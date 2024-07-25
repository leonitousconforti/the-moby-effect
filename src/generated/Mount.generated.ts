import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class Mount extends Schema.Class<Mount>("Mount")(
    {
        Type: Schema.optional(Schema.Literal("bind", "volume", "tmpfs", "npipe", "cluster")),
        Source: Schema.optional(Schema.String),
        Target: Schema.optional(Schema.String),
        ReadOnly: Schema.optional(Schema.Boolean),
        Consistency: Schema.optional(Schema.Literal("consistent", "cached", "delegated", "default")),

        BindOptions: Schema.optionalWith(MobySchemasGenerated.BindOptions, { nullable: true }),
        VolumeOptions: Schema.optionalWith(MobySchemasGenerated.VolumeOptions, { nullable: true }),
        TmpfsOptions: Schema.optionalWith(MobySchemasGenerated.TmpfsOptions, { nullable: true }),
        ClusterOptions: Schema.optionalWith(MobySchemasGenerated.ClusterOptions, { nullable: true }),
    },
    {
        identifier: "Mount",
        title: "mount.Mount",
        documentation:
            "https://github.com/moby/moby/blob/733755d7cb18a4dbea7c290cc56e61d05502aca0/api/types/mount/mount.go#L24-L39",
    }
) {}
