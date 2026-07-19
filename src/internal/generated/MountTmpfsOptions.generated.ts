import * as Schema from "effect/Schema";

export class MountTmpfsOptions extends Schema.Class<MountTmpfsOptions>("MountTmpfsOptions")(
    {
        SizeBytes: Schema.optional(Schema.BigIntFromString.check(Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n }))),
        Mode: Schema.optional(Schema.Int.check(Schema.isBetween({ minimum: 0, maximum: 2 ** 32 - 1 }))),
        Options: Schema.optional(Schema.NullOr(Schema.Array(Schema.NullOr(Schema.Array(Schema.String))))),
    },
    {
        identifier: "MountTmpfsOptions",
        title: "mount.TmpfsOptions",
        documentation: "",
    }
) {}
