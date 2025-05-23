import * as Schema from "effect/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as ContainerBlkioStats from "./ContainerBlkioStats.generated.js";
import * as ContainerCPUStats from "./ContainerCPUStats.generated.js";
import * as ContainerMemoryStats from "./ContainerMemoryStats.generated.js";
import * as ContainerNetworkStats from "./ContainerNetworkStats.generated.js";
import * as ContainerPidsStats from "./ContainerPidsStats.generated.js";
import * as ContainerStorageStats from "./ContainerStorageStats.generated.js";

export class ContainerStatsResponse extends Schema.Class<ContainerStatsResponse>("ContainerStatsResponse")(
    {
        name: Schema.optional(Schema.String),
        id: Schema.optional(Schema.String),

        // Common stats
        read: Schema.NullOr(Schema.DateFromString),
        preread: Schema.NullOr(Schema.DateFromString),
        networks: Schema.optionalWith(
            Schema.Record({ key: Schema.String, value: Schema.NullOr(ContainerNetworkStats.ContainerNetworkStats) }),
            { nullable: true }
        ),

        // Linux specific stats, not populated on Windows.
        pids_stats: Schema.optionalWith(ContainerPidsStats.ContainerPidsStats, { nullable: true }),
        blkio_stats: Schema.optionalWith(ContainerBlkioStats.ContainerBlkioStats, { nullable: true }),

        // Windows specific stats, not populated on Linux.
        num_procs: MobySchemas.UInt32,
        storage_stats: Schema.optionalWith(ContainerStorageStats.ContainerStorageStats, { nullable: true }),

        // Shared stats
        cpu_stats: Schema.optionalWith(ContainerCPUStats.ContainerCPUStats, { nullable: true }),
        precpu_stats: Schema.optionalWith(ContainerCPUStats.ContainerCPUStats, { nullable: true }),
        memory_stats: Schema.optionalWith(ContainerMemoryStats.ContainerMemoryStats, { nullable: true }),
    },
    {
        identifier: "ContainerStatsResponse",
        title: "container.StatsResponse",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/container/stats.go#L155-L177",
    }
) {}
