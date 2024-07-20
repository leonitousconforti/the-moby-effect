import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as MobySchemasGenerated from "./index.js";

export class ContainerStats extends Schema.Class<ContainerStats>("ContainerStats")(
    {
        read: MobySchemasGenerated.Time,
        preread: MobySchemasGenerated.Time,
        pids_stats: Schema.optional(MobySchemasGenerated.ContainerPidsStats),
        blkio_stats: Schema.optional(MobySchemasGenerated.ContainerBlkioStats),
        num_procs: MobySchemas.UInt32,
        storage_stats: Schema.optional(MobySchemasGenerated.ContainerStorageStats),
        cpu_stats: Schema.optional(MobySchemasGenerated.ContainerCPUStats),
        precpu_stats: Schema.optional(MobySchemasGenerated.ContainerCPUStats),
        memory_stats: Schema.optional(MobySchemasGenerated.ContainerMemoryStats),
    },
    {
        identifier: "ContainerStats",
        title: "container.Stats",
    }
) {}
