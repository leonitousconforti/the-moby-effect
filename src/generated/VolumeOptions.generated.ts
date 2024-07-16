import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class VolumeOptions extends Schema.Class<VolumeOptions>("VolumeOptions")(
    {
        NoCopy: Schema.optional(Schema.Boolean),
        Labels: Schema.optional(Schema.Record(Schema.String, Schema.String), { nullable: true }),
        DriverConfig: Schema.optional(MobySchemasGenerated.Driver, { nullable: true }),
    },
    {
        identifier: "VolumeOptions",
        title: "mount.VolumeOptions",
    }
) {}
