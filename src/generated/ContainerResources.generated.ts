import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as MobySchemasGenerated from "./index.js";

export class ContainerResources extends Schema.Class<ContainerResources>("ContainerResources")(
    {
        CpuShares: MobySchemas.Int64,
        Memory: MobySchemas.Int64,
        NanoCpus: MobySchemas.Int64,
        CgroupParent: Schema.String,
        BlkioWeight: MobySchemas.UInt16,
        BlkioWeightDevice: Schema.NullOr(Schema.Array(MobySchemasGenerated.WeightDevice)),
        BlkioDeviceReadBps: Schema.NullOr(Schema.Array(MobySchemasGenerated.ThrottleDevice)),
        BlkioDeviceWriteBps: Schema.NullOr(Schema.Array(MobySchemasGenerated.ThrottleDevice)),
        BlkioDeviceReadIOps: Schema.NullOr(Schema.Array(MobySchemasGenerated.ThrottleDevice)),
        BlkioDeviceWriteIOps: Schema.NullOr(Schema.Array(MobySchemasGenerated.ThrottleDevice)),
        CpuPeriod: MobySchemas.Int64,
        CpuQuota: MobySchemas.Int64,
        CpuRealtimePeriod: MobySchemas.Int64,
        CpuRealtimeRuntime: MobySchemas.Int64,
        CpusetCpus: Schema.String,
        CpusetMems: Schema.String,
        Devices: Schema.NullOr(Schema.Array(MobySchemasGenerated.ContainerDeviceMapping)),
        DeviceCgroupRules: Schema.NullOr(Schema.Array(Schema.String)),
        DeviceRequests: Schema.NullOr(Schema.Array(MobySchemasGenerated.ContainerDeviceRequest)),
        KernelMemory: Schema.optional(MobySchemas.Int64),
        KernelMemoryTCP: Schema.optional(MobySchemas.Int64),
        MemoryReservation: MobySchemas.Int64,
        MemorySwap: MobySchemas.Int64,
        MemorySwappiness: Schema.NullOr(MobySchemas.Int64),
        OomKillDisable: Schema.NullOr(Schema.Boolean),
        PidsLimit: Schema.NullOr(MobySchemas.Int64),
        Ulimits: Schema.NullOr(Schema.Array(MobySchemasGenerated.ContainerUlimit)),
        CpuCount: MobySchemas.Int64,
        CpuPercent: MobySchemas.Int64,
        IOMaximumIOps: MobySchemas.UInt64,
        IOMaximumBandwidth: MobySchemas.UInt64,
    },
    {
        identifier: "ContainerResources",
        title: "container.Resources",
    }
) {}
