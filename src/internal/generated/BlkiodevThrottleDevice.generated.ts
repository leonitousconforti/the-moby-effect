import * as Schema from "effect/Schema";
import * as MobySchemas from "../schemas/index.js";

export class BlkiodevThrottleDevice extends Schema.Class<BlkiodevThrottleDevice>("BlkiodevThrottleDevice")(
    {
        Path: Schema.String,
        Rate: MobySchemas.UInt64,
    },
    {
        identifier: "BlkiodevThrottleDevice",
        title: "blkiodev.ThrottleDevice",
        documentation: "",
    }
) {}
