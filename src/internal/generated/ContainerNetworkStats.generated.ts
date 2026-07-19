import * as Schema from "effect/Schema";

export class ContainerNetworkStats extends Schema.Class<ContainerNetworkStats>("ContainerNetworkStats")(
    {
        rx_bytes: Schema.BigIntFromString.check(Schema.isBetweenBigInt({ minimum: 0n, maximum: 2n ** 64n - 1n })),
        rx_packets: Schema.BigIntFromString.check(Schema.isBetweenBigInt({ minimum: 0n, maximum: 2n ** 64n - 1n })),
        rx_errors: Schema.BigIntFromString.check(Schema.isBetweenBigInt({ minimum: 0n, maximum: 2n ** 64n - 1n })),
        rx_dropped: Schema.BigIntFromString.check(Schema.isBetweenBigInt({ minimum: 0n, maximum: 2n ** 64n - 1n })),
        tx_bytes: Schema.BigIntFromString.check(Schema.isBetweenBigInt({ minimum: 0n, maximum: 2n ** 64n - 1n })),
        tx_packets: Schema.BigIntFromString.check(Schema.isBetweenBigInt({ minimum: 0n, maximum: 2n ** 64n - 1n })),
        tx_errors: Schema.BigIntFromString.check(Schema.isBetweenBigInt({ minimum: 0n, maximum: 2n ** 64n - 1n })),
        tx_dropped: Schema.BigIntFromString.check(Schema.isBetweenBigInt({ minimum: 0n, maximum: 2n ** 64n - 1n })),
        endpoint_id: Schema.optional(Schema.String),
        instance_id: Schema.optional(Schema.String),
    },
    {
        identifier: "ContainerNetworkStats",
        title: "container.NetworkStats",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/container#NetworkStats",
    }
) {}
