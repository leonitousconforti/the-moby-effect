import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as MobySchemasGenerated from "./index.js";

export class StatsJSON extends Schema.Class<StatsJSON>("StatsJSON")(
    {
        read: MobySchemasGenerated.Time,
        preread: MobySchemasGenerated.Time,
        pids_stats: Schema.optional(MobySchemasGenerated.PidsStats),
        blkio_stats: Schema.optional(MobySchemasGenerated.BlkioStats),
        num_procs: Schema.NullOr(MobySchemas.UInt32),
        storage_stats: Schema.optional(MobySchemasGenerated.StorageStats),
        cpu_stats: Schema.optional(MobySchemasGenerated.CPUStats),
        precpu_stats: Schema.optional(MobySchemasGenerated.CPUStats),
        memory_stats: Schema.optional(MobySchemasGenerated.MemoryStats),
        name: Schema.optional(Schema.String, { nullable: true }),
        id: Schema.optional(Schema.String, { nullable: true }),
        networks: Schema.optional(Schema.Record(Schema.String, MobySchemasGenerated.NetworkStats), { nullable: true }),
    },
    {
        identifier: "StatsJSON",
        title: "types.StatsJSON",
    }
) {}
