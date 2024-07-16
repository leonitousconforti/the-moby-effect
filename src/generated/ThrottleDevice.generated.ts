import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";

export class ThrottleDevice extends Schema.Class<ThrottleDevice>("ThrottleDevice")(
    {
        Path: Schema.String,
        Rate: MobySchemas.UInt64,
    },
    {
        identifier: "ThrottleDevice",
        title: "blkiodev.ThrottleDevice",
    }
) {}
