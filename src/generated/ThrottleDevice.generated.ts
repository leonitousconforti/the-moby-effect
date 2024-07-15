import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";

export class ThrottleDevice extends Schema.Class<ThrottleDevice>("ThrottleDevice")(
    {
        Path: Schema.NullOr(Schema.String),
        Rate: Schema.NullOr(MobySchemas.UInt64),
    },
    {
        identifier: "ThrottleDevice",
        title: "blkiodev.ThrottleDevice",
    }
) {}
