import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";

export class TmpfsOptions extends Schema.Class<TmpfsOptions>("TmpfsOptions")(
    {
        SizeBytes: Schema.optional(MobySchemas.Int64),
        Mode: Schema.optional(MobySchemas.UInt32),
        Options: Schema.optional(Schema.Array(Schema.NullOr(Schema.Array(Schema.String))), { nullable: true }),
    },
    {
        identifier: "TmpfsOptions",
        title: "mount.TmpfsOptions",
        documentation:
            "https://github.com/moby/moby/blob/733755d7cb18a4dbea7c290cc56e61d05502aca0/api/types/mount/mount.go#L109-L145",
    }
) {}
