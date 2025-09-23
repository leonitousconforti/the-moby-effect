import * as Schema from "effect/Schema";
import * as MobySchemas from "../schemas/index.js";

export class MountTmpfsOptions extends Schema.Class<MountTmpfsOptions>("MountTmpfsOptions")(
    {
        SizeBytes: Schema.optional(MobySchemas.Int64),
        Mode: Schema.optional(MobySchemas.UInt32),
        Options: Schema.optionalWith(Schema.Array(Schema.NullOr(Schema.Array(Schema.String))), { nullable: true }),
    },
    {
        identifier: "MountTmpfsOptions",
        title: "mount.TmpfsOptions",
        documentation: "",
    }
) {}
