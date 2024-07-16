import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class VolumeCreateOptions extends Schema.Class<VolumeCreateOptions>("VolumeCreateOptions")(
    {
        ClusterVolumeSpec: Schema.optional(MobySchemasGenerated.ClusterVolumeSpec, { nullable: true }),
        Driver: Schema.optional(Schema.String),
        DriverOpts: Schema.optional(Schema.Record(Schema.String, Schema.String), { nullable: true }),
        Labels: Schema.optional(Schema.Record(Schema.String, Schema.String), { nullable: true }),
        Name: Schema.optional(Schema.String),
    },
    {
        identifier: "VolumeCreateOptions",
        title: "volume.CreateOptions",
    }
) {}
