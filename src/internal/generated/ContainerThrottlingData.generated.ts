import * as Schema from "effect/Schema";

import * as MobyNumber from "../schemas/number.ts";

export class ContainerThrottlingData extends Schema.Class<ContainerThrottlingData>("ContainerThrottlingData")(
    {
        periods: MobyNumber.BigIntFromWireString.check(
            Schema.isBetweenBigInt({ minimum: 0n, maximum: 2n ** 64n - 1n })
        ),
        throttled_periods: MobyNumber.BigIntFromWireString.check(
            Schema.isBetweenBigInt({ minimum: 0n, maximum: 2n ** 64n - 1n })
        ),
        throttled_time: MobyNumber.BigIntFromWireString.check(
            Schema.isBetweenBigInt({ minimum: 0n, maximum: 2n ** 64n - 1n })
        ),
    },
    {
        identifier: "ContainerThrottlingData",
        title: "container.ThrottlingData",
        documentation:
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/container#ThrottlingData",
    }
) {}
