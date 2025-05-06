import * as Schema from "effect/Schema";
import * as MobySchemas from "../schemas/index.js";

export class ThrottleDevice extends Schema.Class<ThrottleDevice>("ThrottleDevice")(
    {
        Path: Schema.String,
        Rate: MobySchemas.UInt64,
    },
    {
        identifier: "ThrottleDevice",
        title: "blkiodev.ThrottleDevice",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/blkiodev/blkio.go#L15-L19",
    }
) {}
