import * as EffectSchemas from "effect-schemas";
import * as Schema from "effect/Schema";

export class ContainerBlkioStatEntry extends Schema.Class<ContainerBlkioStatEntry>("ContainerBlkioStatEntry")(
    {
        major: EffectSchemas.Number.U64,
        minor: EffectSchemas.Number.U64,
        op: Schema.String,
        value: EffectSchemas.Number.U64,
    },
    {
        identifier: "ContainerBlkioStatEntry",
        title: "container.BlkioStatEntry",
        documentation:
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/container#BlkioStatEntry",
    }
) {}
