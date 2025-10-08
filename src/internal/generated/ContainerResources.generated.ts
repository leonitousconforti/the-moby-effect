import * as EffectSchemas from "effect-schemas";
import * as Schema from "effect/Schema";
import * as BlkiodevThrottleDevice from "./BlkiodevThrottleDevice.generated.js";
import * as BlkiodevWeightDevice from "./BlkiodevWeightDevice.generated.js";
import * as ContainerDeviceMapping from "./ContainerDeviceMapping.generated.js";
import * as ContainerDeviceRequest from "./ContainerDeviceRequest.generated.js";
import * as UnitsUlimit from "./UnitsUlimit.generated.js";

export class ContainerResources extends Schema.Class<ContainerResources>("ContainerResources")(
    {
        CpuShares: EffectSchemas.Number.I64.pipe(Schema.propertySignature).pipe(
            Schema.withConstructorDefault(() => EffectSchemas.Number.I64.make(0))
        ),
        Memory: EffectSchemas.Number.I64.pipe(Schema.propertySignature).pipe(
            Schema.withConstructorDefault(() => EffectSchemas.Number.I64.make(0))
        ),
        NanoCpus: EffectSchemas.Number.I64.pipe(Schema.propertySignature).pipe(
            Schema.withConstructorDefault(() => EffectSchemas.Number.I64.make(0))
        ),
        CgroupParent: Schema.String.pipe(Schema.propertySignature).pipe(Schema.withConstructorDefault(() => "")),
        BlkioWeight: EffectSchemas.Number.U16.pipe(Schema.propertySignature).pipe(
            Schema.withConstructorDefault(() => EffectSchemas.Number.U16.make(0))
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
        CpuPeriod: EffectSchemas.Number.I64.pipe(Schema.propertySignature).pipe(
            Schema.withConstructorDefault(() => EffectSchemas.Number.I64.make(0))
        ),
        CpuQuota: EffectSchemas.Number.I64.pipe(Schema.propertySignature).pipe(
            Schema.withConstructorDefault(() => EffectSchemas.Number.I64.make(0))
        ),
        CpuRealtimePeriod: EffectSchemas.Number.I64.pipe(Schema.propertySignature).pipe(
            Schema.withConstructorDefault(() => EffectSchemas.Number.I64.make(0))
        ),
        CpuRealtimeRuntime: EffectSchemas.Number.I64.pipe(Schema.propertySignature).pipe(
            Schema.withConstructorDefault(() => EffectSchemas.Number.I64.make(0))
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
        KernelMemory: Schema.optional(EffectSchemas.Number.I64),
        KernelMemoryTCP: Schema.optional(EffectSchemas.Number.I64),
        MemoryReservation: EffectSchemas.Number.I64.pipe(Schema.propertySignature).pipe(
            Schema.withConstructorDefault(() => EffectSchemas.Number.I64.make(0))
        ),
        MemorySwap: EffectSchemas.Number.I64.pipe(Schema.propertySignature).pipe(
            Schema.withConstructorDefault(() => EffectSchemas.Number.I64.make(0))
        ),
        MemorySwappiness: Schema.NullOr(EffectSchemas.Number.I64)
            .pipe(Schema.propertySignature)
            .pipe(Schema.withConstructorDefault(() => EffectSchemas.Number.I64.make(-1))),
        OomKillDisable: Schema.NullOr(Schema.Boolean)
            .pipe(Schema.propertySignature)
            .pipe(Schema.withConstructorDefault(() => false)),
        PidsLimit: Schema.NullOr(EffectSchemas.Number.I64)
            .pipe(Schema.propertySignature)
            .pipe(Schema.withConstructorDefault(() => EffectSchemas.Number.I64.make(0))),
        Ulimits: Schema.NullOr(Schema.Array(Schema.NullOr(UnitsUlimit.UnitsUlimit)))
            .pipe(Schema.propertySignature)
            .pipe(Schema.withConstructorDefault(() => [])),
        CpuCount: EffectSchemas.Number.I64.pipe(Schema.propertySignature).pipe(
            Schema.withConstructorDefault(() => EffectSchemas.Number.I64.make(0))
        ),
        CpuPercent: EffectSchemas.Number.I64.pipe(Schema.propertySignature).pipe(
            Schema.withConstructorDefault(() => EffectSchemas.Number.I64.make(0))
        ),
        IOMaximumIOps: EffectSchemas.Number.U64.pipe(Schema.propertySignature).pipe(
            Schema.withConstructorDefault(() => EffectSchemas.Number.U64.make(0))
        ),
        IOMaximumBandwidth: EffectSchemas.Number.U64.pipe(Schema.propertySignature).pipe(
            Schema.withConstructorDefault(() => EffectSchemas.Number.U64.make(0))
        ),
    },
    {
        identifier: "ContainerResources",
        title: "container.Resources",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/container#Resources",
    }
) {}
