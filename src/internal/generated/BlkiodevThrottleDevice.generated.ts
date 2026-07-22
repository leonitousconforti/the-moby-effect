import * as Schema from "effect/Schema";

import * as MobyNumber from "../schemas/number.ts";

export class BlkiodevThrottleDevice extends Schema.Class<BlkiodevThrottleDevice>("BlkiodevThrottleDevice")(
    {
        Path: Schema.String,
        Rate: MobyNumber.BigIntFromWireString.check(Schema.isBetweenBigInt({ minimum: 0n, maximum: 2n ** 64n - 1n })),
    },
    {
        identifier: "BlkiodevThrottleDevice",
        title: "blkiodev.ThrottleDevice",
        documentation: "",
    }
) {}
