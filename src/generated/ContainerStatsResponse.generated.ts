import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as MobySchemasGenerated from "./index.js";

export class ContainerStatsResponse extends Schema.Class<ContainerStatsResponse>("ContainerStatsResponse")(
    {
        read: MobySchemasGenerated.Time,
        preread: MobySchemasGenerated.Time,
        pids_stats: Schema.optional(MobySchemasGenerated.PidsStats),
        blkio_stats: Schema.optional(MobySchemasGenerated.BlkioStats),
        num_procs: MobySchemas.UInt32,
        storage_stats: Schema.optional(MobySchemasGenerated.StorageStats),
        cpu_stats: Schema.optional(MobySchemasGenerated.CPUStats),
        precpu_stats: Schema.optional(MobySchemasGenerated.CPUStats),
        memory_stats: Schema.optional(MobySchemasGenerated.MemoryStats),
        name: Schema.optional(Schema.String),
        id: Schema.optional(Schema.String),
        networks: Schema.optional(Schema.Record(Schema.String, MobySchemasGenerated.NetworkStats), { nullable: true }),
    },
    {
        identifier: "ContainerStatsResponse",
        title: "types.StatsJSON",
    }
) {}
