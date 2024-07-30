import * as Schema from "@effect/schema/Schema";
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
        documentation:
            "https://github.com/moby/moby/blob/a21b1a2d12e2c01542cb191eb526d7bfad0641e3/api/types/container/container.go#L16-L25",
    }
) {}
