import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class Stats extends Schema.Class<Stats>("Stats")({
    Read: MobySchemas.Time,
    PreRead: MobySchemas.Time,
    PidsStats: MobySchemas.PidsStats,
    BlkioStats: MobySchemas.BlkioStats,
    NumProcs: MobySchemas.UInt32,
    StorageStats: MobySchemas.StorageStats,
    CPUStats: MobySchemas.CPUStats,
    PreCPUStats: MobySchemas.CPUStats,
    MemoryStats: MobySchemas.MemoryStats,
}) {}
