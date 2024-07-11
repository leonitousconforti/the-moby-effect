import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class MemoryStats extends Schema.Class<MemoryStats>("MemoryStats")({
    Usage: MobySchemas.UInt64,
    MaxUsage: MobySchemas.UInt64,
    Stats: Schema.Record(Schema.String, MobySchemas.UInt64),
    Failcnt: MobySchemas.UInt64,
    Limit: MobySchemas.UInt64,
    Commit: MobySchemas.UInt64,
    CommitPeak: MobySchemas.UInt64,
    PrivateWorkingSet: MobySchemas.UInt64,
}) {}
