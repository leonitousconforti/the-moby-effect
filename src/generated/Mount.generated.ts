import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class Mount extends Schema.Class<Mount>("Mount")(
    {
        Type: Schema.optional(Schema.String),
        Source: Schema.optional(Schema.String),
        Target: Schema.optional(Schema.String),
        ReadOnly: Schema.optional(Schema.Boolean),
        Consistency: Schema.optional(Schema.String),
        BindOptions: Schema.optional(MobySchemasGenerated.BindOptions, { nullable: true }),
        VolumeOptions: Schema.optional(MobySchemasGenerated.VolumeOptions, { nullable: true }),
        TmpfsOptions: Schema.optional(MobySchemasGenerated.TmpfsOptions, { nullable: true }),
        ClusterOptions: Schema.optional(MobySchemasGenerated.ClusterOptions, { nullable: true }),
    },
    {
        identifier: "Mount",
        title: "mount.Mount",
    }
) {}
