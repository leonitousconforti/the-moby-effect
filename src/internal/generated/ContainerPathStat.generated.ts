import * as Schema from "effect/Schema";

export class ContainerPathStat extends Schema.Class<ContainerPathStat>("ContainerPathStat")(
    {
        name: Schema.String,
        size: Schema.BigIntFromString.check(Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n })),
        mode: Schema.NumberFromString.check(Schema.isInt(), Schema.isBetween({ minimum: 0, maximum: 2 ** 32 - 1 })),
        mtime: Schema.NullOr(Schema.DateFromString),
        linkTarget: Schema.String,
    },
    {
        identifier: "ContainerPathStat",
        title: "container.PathStat",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/container#PathStat",
    }
) {}
