import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as ContainerBlkioStats from "./ContainerBlkioStats.generated.js";
import * as ContainerCPUStats from "./ContainerCPUStats.generated.js";
import * as ContainerMemoryStats from "./ContainerMemoryStats.generated.js";
import * as ContainerPidsStats from "./ContainerPidsStats.generated.js";
import * as ContainerStorageStats from "./ContainerStorageStats.generated.js";
import * as Time from "./Time.generated.js";

export class ContainerStats extends Schema.Class<ContainerStats>("ContainerStats")(
    {
        // Common stats
        read: Schema.NullOr(Time.Time),
        preread: Schema.NullOr(Time.Time),

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
        identifier: "ContainerStats",
        title: "container.Stats",
        documentation:
            "https://github.com/moby/moby/blob/a21b1a2d12e2c01542cb191eb526d7bfad0641e3/api/types/container/stats.go#L150-L168",
    }
) {}
