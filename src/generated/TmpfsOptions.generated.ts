import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";

export class TmpfsOptions extends Schema.Class<TmpfsOptions>("TmpfsOptions")(
    {
        SizeBytes: Schema.optional(MobySchemas.Int64),
        Mode: Schema.optional(MobySchemas.UInt32),
        Options: Schema.optional(Schema.Array(Schema.Array(Schema.String)), { nullable: true }),
    },
    {
        identifier: "TmpfsOptions",
        title: "mount.TmpfsOptions",
    }
) {}
