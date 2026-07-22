import * as Schema from "effect/Schema";

import * as MobyNumber from "../schemas/number.ts";

export class ContainerNetworkStats extends Schema.Class<ContainerNetworkStats>("ContainerNetworkStats")(
    {
        rx_bytes: MobyNumber.BigIntFromWireString.check(
            Schema.isBetweenBigInt({ minimum: 0n, maximum: 2n ** 64n - 1n })
        ),
        rx_packets: MobyNumber.BigIntFromWireString.check(
            Schema.isBetweenBigInt({ minimum: 0n, maximum: 2n ** 64n - 1n })
        ),
        rx_errors: MobyNumber.BigIntFromWireString.check(
            Schema.isBetweenBigInt({ minimum: 0n, maximum: 2n ** 64n - 1n })
        ),
        rx_dropped: MobyNumber.BigIntFromWireString.check(
            Schema.isBetweenBigInt({ minimum: 0n, maximum: 2n ** 64n - 1n })
        ),
        tx_bytes: MobyNumber.BigIntFromWireString.check(
            Schema.isBetweenBigInt({ minimum: 0n, maximum: 2n ** 64n - 1n })
        ),
        tx_packets: MobyNumber.BigIntFromWireString.check(
            Schema.isBetweenBigInt({ minimum: 0n, maximum: 2n ** 64n - 1n })
        ),
        tx_errors: MobyNumber.BigIntFromWireString.check(
            Schema.isBetweenBigInt({ minimum: 0n, maximum: 2n ** 64n - 1n })
        ),
        tx_dropped: MobyNumber.BigIntFromWireString.check(
            Schema.isBetweenBigInt({ minimum: 0n, maximum: 2n ** 64n - 1n })
        ),
        endpoint_id: Schema.optional(Schema.String),
        instance_id: Schema.optional(Schema.String),
    },
    {
        identifier: "ContainerNetworkStats",
        title: "container.NetworkStats",
        documentation:
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/container#NetworkStats",
    }
) {}
