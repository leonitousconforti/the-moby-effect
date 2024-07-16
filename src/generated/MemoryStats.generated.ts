import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";

export class MemoryStats extends Schema.Class<MemoryStats>("MemoryStats")(
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
        identifier: "MemoryStats",
        title: "types.MemoryStats",
    }
) {}
