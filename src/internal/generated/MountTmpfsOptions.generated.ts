import * as Schema from "effect/Schema";

import * as MobyNumber from "../schemas/number.ts";

export class MountTmpfsOptions extends Schema.Class<MountTmpfsOptions>("MountTmpfsOptions")(
    {
        SizeBytes: Schema.optional(
            MobyNumber.BigIntFromWireString.check(
                Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n })
            )
        ),
        Mode: Schema.optional(
            MobyNumber.NumberFromWireString.check(
                Schema.isInt(),
                Schema.isBetween({ minimum: 0, maximum: 2 ** 32 - 1 })
            )
        ),
        Options: Schema.optional(Schema.NullOr(Schema.Array(Schema.NullOr(Schema.Array(Schema.String))))),
    },
    {
        identifier: "MountTmpfsOptions",
        title: "mount.TmpfsOptions",
        documentation: "",
    }
) {}
