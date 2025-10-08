import * as EffectSchemas from "effect-schemas";
import * as Schema from "effect/Schema";

export class ContainerPathStat extends Schema.Class<ContainerPathStat>("ContainerPathStat")(
    {
        name: Schema.String,
        size: EffectSchemas.Number.I64,
        mode: EffectSchemas.Number.U32,
        mtime: Schema.NullOr(Schema.DateFromString),
        linkTarget: Schema.String,
    },
    {
        identifier: "ContainerPathStat",
        title: "container.PathStat",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/container#PathStat",
    }
) {}
