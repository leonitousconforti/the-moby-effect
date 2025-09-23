import * as Schema from "effect/Schema";
import * as MountDriver from "./MountDriver.generated.js";

export class MountVolumeOptions extends Schema.Class<MountVolumeOptions>("MountVolumeOptions")(
    {
        NoCopy: Schema.optional(Schema.Boolean),
        Labels: Schema.optionalWith(Schema.Record({ key: Schema.String, value: Schema.String }), { nullable: true }),
        Subpath: Schema.optional(Schema.String),
        DriverConfig: Schema.optionalWith(MountDriver.MountDriver, { nullable: true }),
    },
    {
        identifier: "MountVolumeOptions",
        title: "mount.VolumeOptions",
        documentation: "",
    }
) {}
