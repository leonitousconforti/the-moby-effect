import * as EffectSchemas from "effect-schemas";
import * as Schema from "effect/Schema";

export class MountTmpfsOptions extends Schema.Class<MountTmpfsOptions>("MountTmpfsOptions")(
    {
        SizeBytes: Schema.optional(EffectSchemas.Number.I64),
        Mode: Schema.optional(EffectSchemas.Number.U32),
        Options: Schema.optionalWith(Schema.Array(Schema.NullOr(Schema.Array(Schema.String))), { nullable: true }),
    },
    {
        identifier: "MountTmpfsOptions",
        title: "mount.TmpfsOptions",
        documentation: "",
    }
) {}
