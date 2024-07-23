import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";

export class ContainerMemoryStats extends Schema.Class<ContainerMemoryStats>("ContainerMemoryStats")(
    {
        usage: Schema.optional(MobySchemas.UInt64),
        max_usage: Schema.optional(MobySchemas.UInt64),
        stats: Schema.optional(Schema.Record(Schema.String, MobySchemas.UInt64), { nullable: true }),
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
            "https://github.com/moby/moby/blob/a21b1a2d12e2c01542cb191eb526d7bfad0641e3/api/types/container/stats.go#L55-L80",
    }
) {}
