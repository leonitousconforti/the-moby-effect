import * as Schema from "effect/Schema";

export class ContainerPidsStats extends Schema.Class<ContainerPidsStats>("ContainerPidsStats")(
    {
        current: Schema.optional(
            Schema.BigIntFromString.check(Schema.isBetweenBigInt({ minimum: 0n, maximum: 2n ** 64n - 1n }))
        ),
        limit: Schema.optional(
            Schema.BigIntFromString.check(Schema.isBetweenBigInt({ minimum: 0n, maximum: 2n ** 64n - 1n }))
        ),
    },
    {
        identifier: "ContainerPidsStats",
        title: "container.PidsStats",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/container#PidsStats",
    }
) {}
