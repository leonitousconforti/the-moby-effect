import * as Schema from "effect/Schema";

import * as MountDriver from "./MountDriver.generated.ts";

export class MountVolumeOptions extends Schema.Class<MountVolumeOptions>("MountVolumeOptions")(
    {
        NoCopy: Schema.optional(Schema.Boolean),
        Labels: Schema.optional(Schema.NullOr(Schema.Record(Schema.String, Schema.String))),
        Subpath: Schema.optional(Schema.String),
        DriverConfig: Schema.optional(Schema.NullOr(MountDriver.MountDriver)),
    },
    {
        identifier: "MountVolumeOptions",
        title: "mount.VolumeOptions",
        documentation: "",
    }
) {}
