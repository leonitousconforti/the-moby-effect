import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";

import * as MobyNumber from "../schemas/number.ts";
import * as BlkiodevThrottleDevice from "./BlkiodevThrottleDevice.generated.ts";
import * as BlkiodevWeightDevice from "./BlkiodevWeightDevice.generated.ts";
import * as ContainerDeviceMapping from "./ContainerDeviceMapping.generated.ts";
import * as ContainerDeviceRequest from "./ContainerDeviceRequest.generated.ts";
import * as UnitsUlimit from "./UnitsUlimit.generated.ts";

export class ContainerResources extends Schema.Class<ContainerResources>("ContainerResources")(
    {
        CpuShares: MobyNumber.BigIntFromWireString.check(
            Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n })
        ).pipe(Schema.withConstructorDefault(Effect.succeed(0n))),
        Memory: MobyNumber.BigIntFromWireString.check(
            Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n })
        ).pipe(Schema.withConstructorDefault(Effect.succeed(0n))),
        NanoCpus: MobyNumber.BigIntFromWireString.check(
            Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n })
        ).pipe(Schema.withConstructorDefault(Effect.succeed(0n))),
        CgroupParent: Schema.String.pipe(Schema.withConstructorDefault(Effect.succeed(""))),
        BlkioWeight: MobyNumber.NumberFromWireString.check(
            Schema.isInt(),
            Schema.isBetween({ minimum: 0, maximum: 2 ** 16 - 1 })
        ).pipe(Schema.withConstructorDefault(Effect.succeed(0))),
        BlkioWeightDevice: Schema.NullOr(Schema.Array(Schema.NullOr(BlkiodevWeightDevice.BlkiodevWeightDevice))).pipe(
            Schema.withConstructorDefault(Effect.succeed([]))
        ),
        BlkioDeviceReadBps: Schema.NullOr(
            Schema.Array(Schema.NullOr(BlkiodevThrottleDevice.BlkiodevThrottleDevice))
        ).pipe(Schema.withConstructorDefault(Effect.succeed([]))),
        BlkioDeviceWriteBps: Schema.NullOr(
            Schema.Array(Schema.NullOr(BlkiodevThrottleDevice.BlkiodevThrottleDevice))
        ).pipe(Schema.withConstructorDefault(Effect.succeed([]))),
        BlkioDeviceReadIOps: Schema.NullOr(
            Schema.Array(Schema.NullOr(BlkiodevThrottleDevice.BlkiodevThrottleDevice))
        ).pipe(Schema.withConstructorDefault(Effect.succeed([]))),
        BlkioDeviceWriteIOps: Schema.NullOr(
            Schema.Array(Schema.NullOr(BlkiodevThrottleDevice.BlkiodevThrottleDevice))
        ).pipe(Schema.withConstructorDefault(Effect.succeed([]))),
        CpuPeriod: MobyNumber.BigIntFromWireString.check(
            Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n })
        ).pipe(Schema.withConstructorDefault(Effect.succeed(0n))),
        CpuQuota: MobyNumber.BigIntFromWireString.check(
            Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n })
        ).pipe(Schema.withConstructorDefault(Effect.succeed(0n))),
        CpuRealtimePeriod: MobyNumber.BigIntFromWireString.check(
            Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n })
        ).pipe(Schema.withConstructorDefault(Effect.succeed(0n))),
        CpuRealtimeRuntime: MobyNumber.BigIntFromWireString.check(
            Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n })
        ).pipe(Schema.withConstructorDefault(Effect.succeed(0n))),
        CpusetCpus: Schema.String.pipe(Schema.withConstructorDefault(Effect.succeed(""))),
        CpusetMems: Schema.String.pipe(Schema.withConstructorDefault(Effect.succeed(""))),
        Devices: Schema.NullOr(Schema.Array(Schema.NullOr(ContainerDeviceMapping.ContainerDeviceMapping))).pipe(
            Schema.withConstructorDefault(Effect.succeed([]))
        ),
        DeviceCgroupRules: Schema.NullOr(Schema.Array(Schema.String)).pipe(
            Schema.withConstructorDefault(Effect.succeed([]))
        ),
        DeviceRequests: Schema.NullOr(Schema.Array(Schema.NullOr(ContainerDeviceRequest.ContainerDeviceRequest))).pipe(
            Schema.withConstructorDefault(Effect.succeed([]))
        ),
        KernelMemory: Schema.optional(
            MobyNumber.BigIntFromWireString.check(
                Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n })
            )
        ),
        KernelMemoryTCP: Schema.optional(
            MobyNumber.BigIntFromWireString.check(
                Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n })
            )
        ),
        MemoryReservation: MobyNumber.BigIntFromWireString.check(
            Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n })
        ).pipe(Schema.withConstructorDefault(Effect.succeed(0n))),
        MemorySwap: MobyNumber.BigIntFromWireString.check(
            Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n })
        ).pipe(Schema.withConstructorDefault(Effect.succeed(0n))),
        MemorySwappiness: Schema.NullOr(
            MobyNumber.BigIntFromWireString.check(
                Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n })
            )
        ).pipe(Schema.withConstructorDefault(Effect.succeed(-1n))),
        OomKillDisable: Schema.NullOr(Schema.Boolean).pipe(Schema.withConstructorDefault(Effect.succeed(false))),
        PidsLimit: Schema.NullOr(
            MobyNumber.BigIntFromWireString.check(
                Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n })
            )
        ).pipe(Schema.withConstructorDefault(Effect.succeed(0n))),
        Ulimits: Schema.NullOr(Schema.Array(Schema.NullOr(UnitsUlimit.UnitsUlimit))).pipe(
            Schema.withConstructorDefault(Effect.succeed([]))
        ),
        CpuCount: MobyNumber.BigIntFromWireString.check(
            Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n })
        ).pipe(Schema.withConstructorDefault(Effect.succeed(0n))),
        CpuPercent: MobyNumber.BigIntFromWireString.check(
            Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n })
        ).pipe(Schema.withConstructorDefault(Effect.succeed(0n))),
        IOMaximumIOps: MobyNumber.BigIntFromWireString.check(
            Schema.isBetweenBigInt({ minimum: 0n, maximum: 2n ** 64n - 1n })
        ).pipe(Schema.withConstructorDefault(Effect.succeed(0n))),
        IOMaximumBandwidth: MobyNumber.BigIntFromWireString.check(
            Schema.isBetweenBigInt({ minimum: 0n, maximum: 2n ** 64n - 1n })
        ).pipe(Schema.withConstructorDefault(Effect.succeed(0n))),
    },
    {
        identifier: "ContainerResources",
        title: "container.Resources",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/container#Resources",
    }
) {}
