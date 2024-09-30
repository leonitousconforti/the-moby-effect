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
        documentation:
            "https://github.com/moby/moby/blob/a21b1a2d12e2c01542cb191eb526d7bfad0641e3/api/types/blkiodev/blkio.go#L15-L19",
    }
) {}
