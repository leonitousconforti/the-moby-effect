import * as Schema from "effect/Schema";
import * as ContainerBlkioStats from "./ContainerBlkioStats.generated.ts";
import * as ContainerCPUStats from "./ContainerCPUStats.generated.ts";
import * as ContainerMemoryStats from "./ContainerMemoryStats.generated.ts";
import * as ContainerNetworkStats from "./ContainerNetworkStats.generated.ts";
import * as ContainerPidsStats from "./ContainerPidsStats.generated.ts";
import * as ContainerStorageStats from "./ContainerStorageStats.generated.ts";

export class ContainerStatsResponse extends Schema.Class<ContainerStatsResponse>("ContainerStatsResponse")(
    {
        name: Schema.optional(Schema.String),
        id: Schema.optional(Schema.String),
        read: Schema.NullOr(Schema.DateFromString),
        preread: Schema.NullOr(Schema.DateFromString),
        pids_stats: Schema.optional(Schema.NullOr(ContainerPidsStats.ContainerPidsStats)),
        blkio_stats: Schema.optional(Schema.NullOr(ContainerBlkioStats.ContainerBlkioStats)),
        num_procs: Schema.NumberFromString.check(Schema.isInt(), Schema.isBetween({ minimum: 0, maximum: 2 ** 32 - 1 })),
        storage_stats: Schema.optional(Schema.NullOr(ContainerStorageStats.ContainerStorageStats)),
        cpu_stats: Schema.optional(Schema.NullOr(ContainerCPUStats.ContainerCPUStats)),
        precpu_stats: Schema.optional(Schema.NullOr(ContainerCPUStats.ContainerCPUStats)),
        memory_stats: Schema.optional(Schema.NullOr(ContainerMemoryStats.ContainerMemoryStats)),
        networks: Schema.optional(Schema.NullOr(Schema.Record(Schema.String, Schema.NullOr(ContainerNetworkStats.ContainerNetworkStats)))),
    },
    {
        identifier: "ContainerStatsResponse",
        title: "container.StatsResponse",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/container#StatsResponse",
    }
) {}
