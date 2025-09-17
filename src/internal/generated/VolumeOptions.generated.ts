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
        documentation: "",
    }
) {}
