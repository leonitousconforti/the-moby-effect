import * as Schema from "effect/Schema";

export class ContainerBlkioStatEntry extends Schema.Class<ContainerBlkioStatEntry>("ContainerBlkioStatEntry")(
    {
        major: Schema.BigIntFromString.check(Schema.isBetweenBigInt({ minimum: 0n, maximum: 2n ** 64n - 1n })),
        minor: Schema.BigIntFromString.check(Schema.isBetweenBigInt({ minimum: 0n, maximum: 2n ** 64n - 1n })),
        op: Schema.String,
        value: Schema.BigIntFromString.check(Schema.isBetweenBigInt({ minimum: 0n, maximum: 2n ** 64n - 1n })),
    },
    {
        identifier: "ContainerBlkioStatEntry",
        title: "container.BlkioStatEntry",
        documentation:
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/container#BlkioStatEntry",
    }
) {}
