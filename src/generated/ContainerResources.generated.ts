import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as MobySchemasGenerated from "./index.js";

export class ContainerResources extends Schema.Class<ContainerResources>("ContainerResources")(
    {
        // Applicable to all platforms
        /** CPU shares (relative weight vs. other containers) */
        CpuShares: MobySchemas.Int64,

        /** Memory limit (in bytes) */
        Memory: MobySchemas.Int64,

        /** CPU quota */
        NanoCpus: MobySchemas.Int64,

        // Applicable to UNIX platforms
        /** Parent cgroup. */
        CgroupParent: Schema.String,

        /** Block IO weight (relative weight vs. other containers) */
        BlkioWeight: MobySchemas.UInt16,

        BlkioWeightDevice: Schema.NullOr(Schema.Array(Schema.NullOr(MobySchemasGenerated.WeightDevice))),
        BlkioDeviceReadBps: Schema.NullOr(Schema.Array(Schema.NullOr(MobySchemasGenerated.ThrottleDevice))),
        BlkioDeviceWriteBps: Schema.NullOr(Schema.Array(Schema.NullOr(MobySchemasGenerated.ThrottleDevice))),
        BlkioDeviceReadIOps: Schema.NullOr(Schema.Array(Schema.NullOr(MobySchemasGenerated.ThrottleDevice))),
        BlkioDeviceWriteIOps: Schema.NullOr(Schema.Array(Schema.NullOr(MobySchemasGenerated.ThrottleDevice))),

        /** CPU CFS (Completely Fair Scheduler) period */
        CpuPeriod: MobySchemas.Int64,

        /** CPU CFS (Completely Fair Scheduler) quota */
        CpuQuota: MobySchemas.Int64,

        /** CPU real-time period */
        CpuRealtimePeriod: MobySchemas.Int64,

        /** CPU real-time runtime */
        CpuRealtimeRuntime: MobySchemas.Int64,

        /** CpusetCpus 0-2, 0,1 */
        CpusetCpus: Schema.String,

        /** CpusetMems 0-2, 0,1 */
        CpusetMems: Schema.String,

        /** List of devices to map inside the container */
        Devices: Schema.NullOr(Schema.Array(Schema.NullOr(MobySchemasGenerated.ContainerDeviceMapping))),

        /** List of rule to be added to the device cgroup */
        DeviceCgroupRules: Schema.NullOr(Schema.Array(Schema.String)),

        /** List of device requests for device drivers */
        DeviceRequests: Schema.NullOr(Schema.Array(Schema.NullOr(MobySchemasGenerated.ContainerDeviceRequest))),

        /**
         * KernelMemory specifies the kernel memory limit (in bytes) for the
         * container. Deprecated: kernel 5.4 deprecated kmem.limit_in_bytes.
         */
        KernelMemory: Schema.optional(MobySchemas.Int64),

        /** Hard limit for kernel TCP buffer memory (in bytes) */
        KernelMemoryTCP: Schema.optional(MobySchemas.Int64),

        /** Memory soft limit (in bytes) */
        MemoryReservation: MobySchemas.Int64,

        /** Total memory usage (memory + swap); set `-1` to enable unlimited swap */
        MemorySwap: MobySchemas.Int64,

        /** Tuning container memory swappiness behaviour */
        MemorySwappiness: Schema.NullOr(MobySchemas.Int64),

        /** Whether to disable OOM Killer or not */
        OomKillDisable: Schema.NullOr(Schema.Boolean),

        /**
         * Setting PIDs limit for a container; Set `0` or `-1` for unlimited, or
         * `null` to not change.
         */
        PidsLimit: Schema.NullOr(MobySchemas.Int64),

        /** List of ulimits to be set in the container */
        Ulimits: Schema.NullOr(Schema.Array(Schema.NullOr(MobySchemasGenerated.ContainerUlimit))),

        // Applicable to Windows
        /** Cpu count */
        CpuCount: MobySchemas.Int64,

        /** CPU percent */
        CpuPercent: MobySchemas.Int64,

        /** Maximum IOps for the container system drive */
        IOMaximumIOps: MobySchemas.UInt64,

        /** Maximum IO in bytes per second for the container system drive */
        IOMaximumBandwidth: MobySchemas.UInt64,
    },
    {
        identifier: "ContainerResources",
        title: "container.Resources",
        documentation:
            "https://github.com/moby/moby/blob/a21b1a2d12e2c01542cb191eb526d7bfad0641e3/api/types/container/hostconfig.go#L369-L410",
    }
) {}
