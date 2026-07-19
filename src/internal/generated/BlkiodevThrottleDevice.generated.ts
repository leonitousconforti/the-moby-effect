import * as Schema from "effect/Schema";

export class BlkiodevThrottleDevice extends Schema.Class<BlkiodevThrottleDevice>("BlkiodevThrottleDevice")(
    {
        Path: Schema.String,
        Rate: Schema.BigIntFromString.check(Schema.isBetweenBigInt({ minimum: 0n, maximum: 2n ** 64n - 1n })),
    },
    {
        identifier: "BlkiodevThrottleDevice",
        title: "blkiodev.ThrottleDevice",
        documentation: "",
    }
) {}
