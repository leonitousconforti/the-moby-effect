import * as Schema from "effect/Schema";
import * as MobySchemas from "../schemas/index.js";

export class ContainerPathStat extends Schema.Class<ContainerPathStat>("ContainerPathStat")(
    {
        name: Schema.String,
        size: MobySchemas.Int64,
        mode: MobySchemas.UInt32,
        mtime: Schema.NullOr(Schema.DateFromString),
        linkTarget: Schema.String,
    },
    {
        identifier: "ContainerPathStat",
        title: "container.PathStat",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/container#PathStat",
    }
) {}
