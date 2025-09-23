import * as Schema from "effect/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as BlkiodevThrottleDevice from "./BlkiodevThrottleDevice.generated.js";
import * as BlkiodevWeightDevice from "./BlkiodevWeightDevice.generated.js";
import * as ContainerDeviceMapping from "./ContainerDeviceMapping.generated.js";
import * as ContainerDeviceRequest from "./ContainerDeviceRequest.generated.js";
import * as UnitsUlimit from "./UnitsUlimit.generated.js";

export class ContainerResources extends Schema.Class<ContainerResources>("ContainerResources")(
    {
        CpuShares: MobySchemas.Int64,
        Memory: MobySchemas.Int64,
        NanoCpus: MobySchemas.Int64,
        CgroupParent: Schema.String,
        BlkioWeight: MobySchemas.UInt16,
        BlkioWeightDevice: Schema.NullOr(Schema.Array(Schema.NullOr(BlkiodevWeightDevice.BlkiodevWeightDevice))),
        BlkioDeviceReadBps: Schema.NullOr(Schema.Array(Schema.NullOr(BlkiodevThrottleDevice.BlkiodevThrottleDevice))),
        BlkioDeviceWriteBps: Schema.NullOr(Schema.Array(Schema.NullOr(BlkiodevThrottleDevice.BlkiodevThrottleDevice))),
        BlkioDeviceReadIOps: Schema.NullOr(Schema.Array(Schema.NullOr(BlkiodevThrottleDevice.BlkiodevThrottleDevice))),
        BlkioDeviceWriteIOps: Schema.NullOr(Schema.Array(Schema.NullOr(BlkiodevThrottleDevice.BlkiodevThrottleDevice))),
        CpuPeriod: MobySchemas.Int64,
        CpuQuota: MobySchemas.Int64,
        CpuRealtimePeriod: MobySchemas.Int64,
        CpuRealtimeRuntime: MobySchemas.Int64,
        CpusetCpus: Schema.String,
        CpusetMems: Schema.String,
        Devices: Schema.NullOr(Schema.Array(Schema.NullOr(ContainerDeviceMapping.ContainerDeviceMapping))),
        DeviceCgroupRules: Schema.NullOr(Schema.Array(Schema.String)),
        DeviceRequests: Schema.NullOr(Schema.Array(Schema.NullOr(ContainerDeviceRequest.ContainerDeviceRequest))),
        KernelMemory: Schema.optional(MobySchemas.Int64),
        KernelMemoryTCP: Schema.optional(MobySchemas.Int64),
        MemoryReservation: MobySchemas.Int64,
        MemorySwap: MobySchemas.Int64,
        MemorySwappiness: Schema.NullOr(MobySchemas.Int64),
        OomKillDisable: Schema.NullOr(Schema.Boolean),
        PidsLimit: Schema.NullOr(MobySchemas.Int64),
        Ulimits: Schema.NullOr(Schema.Array(Schema.NullOr(UnitsUlimit.UnitsUlimit))),
        CpuCount: MobySchemas.Int64,
        CpuPercent: MobySchemas.Int64,
        IOMaximumIOps: MobySchemas.UInt64,
        IOMaximumBandwidth: MobySchemas.UInt64,
    },
    {
        identifier: "ContainerResources",
        title: "container.Resources",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/container#Resources",
    }
) {}
