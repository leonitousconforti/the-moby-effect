import { Schema as S } from "@effect/schema";
import { pipe } from "effect";

import { DeviceMapping } from "./DeviceMapping.js";
import { DeviceRequest } from "./DeviceRequest.js";
import { ThrottleDevice } from "./ThrottleDevice.js";

/** A container's resources (cgroups config, ulimits, etc) */
export const Resources = S.Struct({
    /**
     * An integer value representing this container's relative CPU weight versus
     * other containers.
     */
    CpuShares: S.optional(pipe(S.Number, S.int())),
    /** Memory limit in bytes. */
    Memory: S.optional(pipe(S.Number, S.int()), {
        default: () => 0,
    }),
    /**
     * Path to `cgroups` under which the container's `cgroup` is created. If the
     * path is not absolute, the path is considered to be relative to the
     * `cgroups` path of the init process. Cgroups are created if they do not
     * already exist.
     */
    CgroupParent: S.optional(S.String),
    /** Block IO weight (relative weight). */
    BlkioWeight: S.optional(pipe(S.Number, S.int(), S.greaterThanOrEqualTo(0), S.lessThanOrEqualTo(1000))),
    /**
     * Block IO weight (relative device weight) in the form:
     *
     *     [{ Path: "device_path", Weight: weight }];
     */
    BlkioWeightDevice: S.optional(
        S.Array(
            S.Struct({
                Path: S.optional(S.String),
                Weight: S.optional(pipe(S.Number, S.int(), S.greaterThanOrEqualTo(0))),
            })
        )
    ),
    /**
     * Limit read rate (bytes per second) from a device, in the form:
     *
     *     [{ Path: "device_path", Rate: rate }];
     */
    BlkioDeviceReadBps: S.optional(S.Array(ThrottleDevice)),
    /**
     * Limit write rate (bytes per second) to a device, in the form:
     *
     *     [{ Path: "device_path", Rate: rate }];
     */
    BlkioDeviceWriteBps: S.optional(S.Array(ThrottleDevice)),
    /**
     * Limit read rate (IO per second) from a device, in the form:
     *
     *     [{ Path: "device_path", Rate: rate }];
     */
    BlkioDeviceReadIOps: S.optional(S.Array(ThrottleDevice)),
    /**
     * Limit write rate (IO per second) to a device, in the form:
     *
     *     [{ Path: "device_path", Rate: rate }];
     */
    BlkioDeviceWriteIOps: S.optional(S.Array(ThrottleDevice)),
    /** The length of a CPU period in microseconds. */
    CpuPeriod: S.optional(pipe(S.Number, S.int())),
    /** Microseconds of CPU time that the container can get in a CPU period. */
    CpuQuota: S.optional(pipe(S.Number, S.int())),
    /**
     * The length of a CPU real-time period in microseconds. Set to 0 to
     * allocate no time allocated to real-time tasks.
     */
    CpuRealtimePeriod: S.optional(pipe(S.Number, S.int())),
    /**
     * The length of a CPU real-time runtime in microseconds. Set to 0 to
     * allocate no time allocated to real-time tasks.
     */
    CpuRealtimeRuntime: S.optional(pipe(S.Number, S.int())),
    /** CPUs in which to allow execution (e.g., `0-3`, `0,1`). */
    CpusetCpus: S.optional(S.String),
    /**
     * Memory nodes (MEMs) in which to allow execution (0-3, 0,1). Only
     * effective on NUMA systems.
     */
    CpusetMems: S.optional(S.String),
    /** A list of devices to add to the container. */
    Devices: S.optional(S.Array(DeviceMapping)),
    /** A list of cgroup rules to apply to the container */
    DeviceCgroupRules: S.optional(S.Array(S.String)),
    /** A list of requests for devices to be sent to device drivers. */
    DeviceRequests: S.optional(S.Array(DeviceRequest)),
    /**
     * Hard limit for kernel TCP buffer memory (in bytes). Depending on the OCI
     * runtime in use, this option may be ignored. It is no longer supported by
     * the default (runc) runtime.
     *
     * This field is omitted when empty.
     */
    KernelMemoryTCP: S.optional(pipe(S.Number, S.int())),
    /** Memory soft limit in bytes. */
    MemoryReservation: S.optional(pipe(S.Number, S.int())),
    /** Total memory limit (memory + swap). Set as `-1` to enable unlimited swap. */
    MemorySwap: S.optional(pipe(S.Number, S.int())),
    /**
     * Tune a container's memory swappiness behavior. Accepts an integer between
     * 0 and 100.
     */
    MemorySwappiness: S.optional(pipe(S.Number, S.int(), S.greaterThanOrEqualTo(0), S.lessThanOrEqualTo(100))),
    /** CPU quota in units of 10<sup>-9</sup> CPUs. */
    NanoCpus: S.optional(pipe(S.Number, S.int())),
    /** Disable OOM Killer for the container. */
    OomKillDisable: S.optional(S.Boolean),
    /**
     * Run an init inside the container that forwards signals and reaps
     * processes. This field is omitted if empty, and the default (as configured
     * on the daemon) is used.
     */
    Init: S.optional(S.Boolean),
    /**
     * Tune a container's PIDs limit. Set `0` or `-1` for unlimited, or `null`
     * to not change.
     */
    PidsLimit: S.optional(pipe(S.Number, S.int())),
    /**
     * A list of resource limits to set in the container. For example:
     *
     *     { "Name": "nofile", "Soft": 1024, "Hard": 2048 }
     */
    Ulimits: S.optional(
        S.Array(
            S.Struct({
                /** Name of ulimit */
                Name: S.optional(S.String),
                /** Soft limit */
                Soft: S.optional(pipe(S.Number, S.int())),
                /** Hard limit */
                Hard: S.optional(pipe(S.Number, S.int())),
            })
        )
    ),
    /**
     * The number of usable CPUs (Windows only).
     *
     * On Windows Server containers, the processor resource controls are
     * mutually exclusive. The order of precedence is `CPUCount` first, then
     * `CPUShares`, and `CPUPercent` last.
     */
    CpuCount: S.optional(pipe(S.Number, S.int())),
    /**
     * The usable percentage of the available CPUs (Windows only).
     *
     * On Windows Server containers, the processor resource controls are
     * mutually exclusive. The order of precedence is `CPUCount` first, then
     * `CPUShares`, and `CPUPercent` last.
     */
    CpuPercent: S.optional(pipe(S.Number, S.int())),
    /** Maximum IOps for the container system drive (Windows only) */
    IOMaximumIOps: S.optional(pipe(S.Number, S.int())),
    /**
     * Maximum IO in bytes per second for the container system drive (Windows
     * only).
     */
    IOMaximumBandwidth: S.optional(pipe(S.Number, S.int())),
});

export type Resources = S.Schema.Type<typeof Resources>;
export const ResourcesEncoded = S.encodedSchema(Resources);
export type ResourcesEncoded = S.Schema.Encoded<typeof Resources>;
