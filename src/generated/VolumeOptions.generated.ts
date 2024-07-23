import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class VolumeOptions extends Schema.Class<VolumeOptions>("VolumeOptions")(
    {
        NoCopy: Schema.optional(Schema.Boolean),
        Labels: Schema.optional(Schema.Record(Schema.String, Schema.String), { nullable: true }),
        Subpath: Schema.optional(Schema.String),
        DriverConfig: Schema.optional(MobySchemasGenerated.Driver, { nullable: true }),
    },
    {
        identifier: "VolumeOptions",
        title: "mount.VolumeOptions",
        documentation:
            "https://github.com/moby/moby/blob/733755d7cb18a4dbea7c290cc56e61d05502aca0/api/types/mount/mount.go#L95-L101",
    }
) {}
