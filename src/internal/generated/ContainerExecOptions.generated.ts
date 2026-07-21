import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";

export class ContainerExecOptions extends Schema.Class<ContainerExecOptions>("ContainerExecOptions")(
    {
        User: Schema.String.pipe(Schema.withConstructorDefault(Effect.succeed(""))),
        Privileged: Schema.Boolean.pipe(Schema.withConstructorDefault(Effect.succeed(false))),
        Tty: Schema.Boolean.pipe(Schema.withConstructorDefault(Effect.succeed(false))),
        ConsoleSize: Schema.optional(
            Schema.NullOr(
                Schema.Array(
                    Schema.BigIntFromString.check(Schema.isBetweenBigInt({ minimum: 0n, maximum: 2n ** 64n - 1n }))
                ).check(Schema.isLengthBetween(2, 2))
            )
        ),
        AttachStdin: Schema.Boolean,
        AttachStderr: Schema.Boolean,
        AttachStdout: Schema.Boolean,
        DetachKeys: Schema.String.pipe(Schema.withConstructorDefault(Effect.succeed(""))),
        Env: Schema.NullOr(Schema.Array(Schema.String)).pipe(Schema.withConstructorDefault(Effect.succeed(null))),
        WorkingDir: Schema.String.pipe(Schema.withConstructorDefault(Effect.succeed(""))),
        Cmd: Schema.NullOr(Schema.Array(Schema.String)),
        Detach: Schema.Boolean,
    },
    {
        identifier: "ContainerExecOptions",
        title: "container.ExecOptions",
        documentation:
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/container#ExecOptions",
    }
) {}
