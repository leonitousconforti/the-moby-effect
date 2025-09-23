import * as Schema from "effect/Schema";
import * as MobySchemas from "../schemas/index.js";

export class ContainerExecOptions extends Schema.Class<ContainerExecOptions>("ContainerExecOptions")(
    {
        User: Schema.String.pipe(Schema.propertySignature).pipe(Schema.withConstructorDefault(() => "")),
        Privileged: Schema.Boolean.pipe(Schema.propertySignature).pipe(Schema.withConstructorDefault(() => false)),
        Tty: Schema.Boolean.pipe(Schema.propertySignature).pipe(Schema.withConstructorDefault(() => false)),
        ConsoleSize: Schema.optionalWith(Schema.Array(MobySchemas.UInt64).pipe(Schema.itemsCount(2)), {
            nullable: true,
        }),
        AttachStdin: Schema.Boolean,
        AttachStderr: Schema.Boolean,
        AttachStdout: Schema.Boolean,
        DetachKeys: Schema.String.pipe(Schema.propertySignature).pipe(Schema.withConstructorDefault(() => "")),
        Env: Schema.NullOr(Schema.Array(Schema.String))
            .pipe(Schema.propertySignature)
            .pipe(Schema.withConstructorDefault(() => null)),
        WorkingDir: Schema.String.pipe(Schema.propertySignature).pipe(Schema.withConstructorDefault(() => "")),
        Cmd: Schema.Array(Schema.String),
    },
    {
        identifier: "ContainerExecOptions",
        title: "container.ExecOptions",
        documentation:
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/container#ExecOptions",
    }
) {}
