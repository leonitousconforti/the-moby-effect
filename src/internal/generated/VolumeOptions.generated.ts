import * as Schema from "effect/Schema";
import * as Driver from "./Driver.generated.js";

export class VolumeOptions extends Schema.Class<VolumeOptions>("VolumeOptions")(
    {
        NoCopy: Schema.optional(Schema.Boolean),
        Labels: Schema.optionalWith(Schema.Record({ key: Schema.String, value: Schema.String }), { nullable: true }),
        Subpath: Schema.optional(Schema.String),
        DriverConfig: Schema.optionalWith(Driver.Driver, { nullable: true }),
    },
    {
        identifier: "VolumeOptions",
        title: "mount.VolumeOptions",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/mount/mount.go#L98-L104",
    }
) {}
