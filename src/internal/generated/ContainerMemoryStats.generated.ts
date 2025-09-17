import * as Schema from "effect/Schema";
import * as MobySchemas from "../schemas/index.js";

export class ContainerMemoryStats extends Schema.Class<ContainerMemoryStats>("ContainerMemoryStats")(
    {
        usage: Schema.optional(MobySchemas.UInt64),
        max_usage: Schema.optional(MobySchemas.UInt64),
        stats: Schema.optionalWith(Schema.Record({ key: Schema.String, value: MobySchemas.UInt64 }), {
            nullable: true,
        }),
        failcnt: Schema.optional(MobySchemas.UInt64),
        limit: Schema.optional(MobySchemas.UInt64),
        commitbytes: Schema.optional(MobySchemas.UInt64),
        commitpeakbytes: Schema.optional(MobySchemas.UInt64),
        privateworkingset: Schema.optional(MobySchemas.UInt64),
    },
    {
        identifier: "ContainerMemoryStats",
        title: "container.MemoryStats",
        documentation:
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/container#MemoryStats",
    }
) {}
