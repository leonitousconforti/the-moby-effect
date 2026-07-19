import * as Schema from "effect/Schema";

export class ContainerExecStartOptions extends Schema.Class<ContainerExecStartOptions>("ContainerExecStartOptions")(
    {
        Detach: Schema.Boolean,
        Tty: Schema.Boolean,
        ConsoleSize: Schema.optional(Schema.NullOr(Schema.Array(Schema.BigIntFromString.check(Schema.isBetweenBigInt({ minimum: 0n, maximum: 2n ** 64n - 1n }))).pipe(Schema.check(Schema.isLengthBetween(2, 2))))),
    },
    {
        identifier: "ContainerExecStartOptions",
        title: "container.ExecStartOptions",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/container#ExecStartOptions",
    }
) {}
