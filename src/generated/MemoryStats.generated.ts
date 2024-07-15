import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";

export class MemoryStats extends Schema.Class<MemoryStats>("MemoryStats")(
    {
        usage: Schema.optional(MobySchemas.UInt64, { nullable: true }),
        max_usage: Schema.optional(MobySchemas.UInt64, { nullable: true }),
        stats: Schema.optional(Schema.Record(Schema.String, MobySchemas.UInt64), { nullable: true }),
        failcnt: Schema.optional(MobySchemas.UInt64, { nullable: true }),
        limit: Schema.optional(MobySchemas.UInt64, { nullable: true }),
        commitbytes: Schema.optional(MobySchemas.UInt64, { nullable: true }),
        commitpeakbytes: Schema.optional(MobySchemas.UInt64, { nullable: true }),
        privateworkingset: Schema.optional(MobySchemas.UInt64, { nullable: true }),
    },
    {
        identifier: "MemoryStats",
        title: "types.MemoryStats",
    }
) {}
