import * as Schema from "effect/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as BlkiodevThrottleDevice from "./BlkiodevThrottleDevice.generated.js";
import * as BlkiodevWeightDevice from "./BlkiodevWeightDevice.generated.js";
import * as ContainerDeviceMapping from "./ContainerDeviceMapping.generated.js";
import * as ContainerDeviceRequest from "./ContainerDeviceRequest.generated.js";
import * as UnitsUlimit from "./UnitsUlimit.generated.js";

export class ContainerResources extends Schema.Class<ContainerResources>("ContainerResources")(
    {
        CpuShares: MobySchemas.Int64.pipe(Schema.propertySignature).pipe(
            Schema.withConstructorDefault(() => MobySchemas.Int64Schemas.Int64Brand(0))
        ),
        Memory: MobySchemas.Int64.pipe(Schema.propertySignature).pipe(
            Schema.withConstructorDefault(() => MobySchemas.Int64Schemas.Int64Brand(0))
        ),
        NanoCpus: MobySchemas.Int64.pipe(Schema.propertySignature).pipe(
            Schema.withConstructorDefault(() => MobySchemas.Int64Schemas.Int64Brand(0))
        ),
        CgroupParent: Schema.String.pipe(Schema.propertySignature).pipe(Schema.withConstructorDefault(() => "")),
        BlkioWeight: MobySchemas.UInt16.pipe(Schema.propertySignature).pipe(
            Schema.withConstructorDefault(() => MobySchemas.UInt16Schemas.UInt16Brand(0))
        ),
        BlkioWeightDevice: Schema.NullOr(Schema.Array(Schema.NullOr(BlkiodevWeightDevice.BlkiodevWeightDevice)))
            .pipe(Schema.propertySignature)
            .pipe(Schema.withConstructorDefault(() => [])),
        BlkioDeviceReadBps: Schema.NullOr(Schema.Array(Schema.NullOr(BlkiodevThrottleDevice.BlkiodevThrottleDevice)))
            .pipe(Schema.propertySignature)
            .pipe(Schema.withConstructorDefault(() => [])),
        BlkioDeviceWriteBps: Schema.NullOr(Schema.Array(Schema.NullOr(BlkiodevThrottleDevice.BlkiodevThrottleDevice)))
            .pipe(Schema.propertySignature)
            .pipe(Schema.withConstructorDefault(() => [])),
        BlkioDeviceReadIOps: Schema.NullOr(Schema.Array(Schema.NullOr(BlkiodevThrottleDevice.BlkiodevThrottleDevice)))
            .pipe(Schema.propertySignature)
            .pipe(Schema.withConstructorDefault(() => [])),
        BlkioDeviceWriteIOps: Schema.NullOr(Schema.Array(Schema.NullOr(BlkiodevThrottleDevice.BlkiodevThrottleDevice)))
            .pipe(Schema.propertySignature)
            .pipe(Schema.withConstructorDefault(() => [])),
        CpuPeriod: MobySchemas.Int64.pipe(Schema.propertySignature).pipe(
            Schema.withConstructorDefault(() => MobySchemas.Int64Schemas.Int64Brand(0))
        ),
        CpuQuota: MobySchemas.Int64.pipe(Schema.propertySignature).pipe(
            Schema.withConstructorDefault(() => MobySchemas.Int64Schemas.Int64Brand(0))
        ),
        CpuRealtimePeriod: MobySchemas.Int64.pipe(Schema.propertySignature).pipe(
            Schema.withConstructorDefault(() => MobySchemas.Int64Schemas.Int64Brand(0))
        ),
        CpuRealtimeRuntime: MobySchemas.Int64.pipe(Schema.propertySignature).pipe(
            Schema.withConstructorDefault(() => MobySchemas.Int64Schemas.Int64Brand(0))
        ),
        CpusetCpus: Schema.String.pipe(Schema.propertySignature).pipe(Schema.withConstructorDefault(() => "")),
        CpusetMems: Schema.String.pipe(Schema.propertySignature).pipe(Schema.withConstructorDefault(() => "")),
        Devices: Schema.NullOr(Schema.Array(Schema.NullOr(ContainerDeviceMapping.ContainerDeviceMapping)))
            .pipe(Schema.propertySignature)
            .pipe(Schema.withConstructorDefault(() => [])),
        DeviceCgroupRules: Schema.NullOr(Schema.Array(Schema.String))
            .pipe(Schema.propertySignature)
            .pipe(Schema.withConstructorDefault(() => [])),
        DeviceRequests: Schema.NullOr(Schema.Array(Schema.NullOr(ContainerDeviceRequest.ContainerDeviceRequest)))
            .pipe(Schema.propertySignature)
            .pipe(Schema.withConstructorDefault(() => [])),
        KernelMemory: Schema.optional(MobySchemas.Int64),
        KernelMemoryTCP: Schema.optional(MobySchemas.Int64),
        MemoryReservation: MobySchemas.Int64.pipe(Schema.propertySignature).pipe(
            Schema.withConstructorDefault(() => MobySchemas.Int64Schemas.Int64Brand(0))
        ),
        MemorySwap: MobySchemas.Int64.pipe(Schema.propertySignature).pipe(
            Schema.withConstructorDefault(() => MobySchemas.Int64Schemas.Int64Brand(0))
        ),
        MemorySwappiness: Schema.NullOr(MobySchemas.Int64)
            .pipe(Schema.propertySignature)
            .pipe(Schema.withConstructorDefault(() => MobySchemas.Int64Schemas.Int64Brand(-1))),
        OomKillDisable: Schema.NullOr(Schema.Boolean)
            .pipe(Schema.propertySignature)
            .pipe(Schema.withConstructorDefault(() => false)),
        PidsLimit: Schema.NullOr(MobySchemas.Int64)
            .pipe(Schema.propertySignature)
            .pipe(Schema.withConstructorDefault(() => MobySchemas.Int64Schemas.Int64Brand(0))),
        Ulimits: Schema.NullOr(Schema.Array(Schema.NullOr(UnitsUlimit.UnitsUlimit)))
            .pipe(Schema.propertySignature)
            .pipe(Schema.withConstructorDefault(() => [])),
        CpuCount: MobySchemas.Int64.pipe(Schema.propertySignature).pipe(
            Schema.withConstructorDefault(() => MobySchemas.Int64Schemas.Int64Brand(0))
        ),
        CpuPercent: MobySchemas.Int64.pipe(Schema.propertySignature).pipe(
            Schema.withConstructorDefault(() => MobySchemas.Int64Schemas.Int64Brand(0))
        ),
        IOMaximumIOps: MobySchemas.UInt64.pipe(Schema.propertySignature).pipe(
            Schema.withConstructorDefault(() => MobySchemas.UInt64Schemas.UInt64Brand(0))
        ),
        IOMaximumBandwidth: MobySchemas.UInt64.pipe(Schema.propertySignature).pipe(
            Schema.withConstructorDefault(() => MobySchemas.UInt64Schemas.UInt64Brand(0))
        ),
    },
    {
        identifier: "ContainerResources",
        title: "container.Resources",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/container#Resources",
    }
) {}
