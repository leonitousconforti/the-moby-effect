import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as MobySchemasGenerated from "./index.js";

export class ContainerStats extends Schema.Class<ContainerStats>("ContainerStats")(
    {
        // Common stats
        read: Schema.NullOr(MobySchemasGenerated.Time),
        preread: Schema.NullOr(MobySchemasGenerated.Time),

        // Linux specific stats, not populated on Windows.
        pids_stats: Schema.optionalWith(MobySchemasGenerated.ContainerPidsStats, { nullable: true }),
        blkio_stats: Schema.optionalWith(MobySchemasGenerated.ContainerBlkioStats, { nullable: true }),

        // Windows specific stats, not populated on Linux.
        num_procs: MobySchemas.UInt32,
        storage_stats: Schema.optionalWith(MobySchemasGenerated.ContainerStorageStats, { nullable: true }),

        // Shared stats
        cpu_stats: Schema.optionalWith(MobySchemasGenerated.ContainerCPUStats, { nullable: true }),
        precpu_stats: Schema.optionalWith(MobySchemasGenerated.ContainerCPUStats, { nullable: true }),
        memory_stats: Schema.optionalWith(MobySchemasGenerated.ContainerMemoryStats, { nullable: true }),
    },
    {
        identifier: "ContainerStats",
        title: "container.Stats",
        documentation:
            "https://github.com/moby/moby/blob/a21b1a2d12e2c01542cb191eb526d7bfad0641e3/api/types/container/stats.go#L150-L168",
    }
) {}
