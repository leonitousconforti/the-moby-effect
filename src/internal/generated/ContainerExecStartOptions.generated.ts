import * as EffectSchemas from "effect-schemas";
import * as Schema from "effect/Schema";

export class ContainerExecStartOptions extends Schema.Class<ContainerExecStartOptions>("ContainerExecStartOptions")(
    {
        Detach: Schema.Boolean,
        Tty: Schema.Boolean,
        ConsoleSize: Schema.optionalWith(Schema.Array(EffectSchemas.Number.U64).pipe(Schema.itemsCount(2)), {
            nullable: true,
        }),
    },
    {
        identifier: "ContainerExecStartOptions",
        title: "container.ExecStartOptions",
        documentation:
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/container#ExecStartOptions",
    }
) {}
