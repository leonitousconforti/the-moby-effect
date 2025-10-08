import * as EffectSchemas from "effect-schemas";
import * as Schema from "effect/Schema";

export class BlkiodevThrottleDevice extends Schema.Class<BlkiodevThrottleDevice>("BlkiodevThrottleDevice")(
    {
        Path: Schema.String,
        Rate: EffectSchemas.Number.U64,
    },
    {
        identifier: "BlkiodevThrottleDevice",
        title: "blkiodev.ThrottleDevice",
        documentation: "",
    }
) {}
