import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as ContainerDeviceMapping from "./ContainerDeviceMapping.generated.js";
import * as ContainerDeviceRequest from "./ContainerDeviceRequest.generated.js";
import * as ContainerHealthConfig from "./ContainerHealthConfig.generated.js";
import * as ContainerLogConfig from "./ContainerLogConfig.generated.js";
import * as ContainerRestartPolicy from "./ContainerRestartPolicy.generated.js";
import * as ContainerUlimit from "./ContainerUlimit.generated.js";
import * as Mount from "./Mount.generated.js";
import * as NetworkNetworkingConfig from "./NetworkNetworkingConfig.generated.js";
import * as ThrottleDevice from "./ThrottleDevice.generated.js";
import * as WeightDevice from "./WeightDevice.generated.js";

export class ContainerCreateRequest extends Schema.Class<ContainerCreateRequest>("ContainerCreateRequest")(
    {
        /** Hostname */
        Hostname: Schema.optionalWith(Schema.String, { nullable: true }),

        /** Domainname */
        Domainname: Schema.optionalWith(Schema.String, { nullable: true }),

        /**
         * User that will run the command(s) inside the container, also support
         * user:group
         */
        User: Schema.optionalWith(Schema.String, { nullable: true }),

        /** Attach the standard input, makes possible user interaction */
        AttachStdin: Schema.optionalWith(Schema.Boolean, { nullable: true }),

        /** Attach the standard output */
        AttachStdout: Schema.optionalWith(Schema.Boolean, { nullable: true }),

        /** Attach the standard error */
        AttachStderr: Schema.optionalWith(Schema.Boolean, { nullable: true }),

        /** List of exposed ports */
        ExposedPorts: Schema.optionalWith(MobySchemas.PortSchemas.PortSet, { nullable: true }),

        /**
         * Attach standard streams to a tty, including stdin if it is not
         * closed.
         */
        Tty: Schema.optionalWith(Schema.Boolean, { nullable: true }),

        /** Open stdin */
        OpenStdin: Schema.optionalWith(Schema.Boolean, { nullable: true }),

        /** If true, close stdin after the 1 attached client disconnects. */
        StdinOnce: Schema.optionalWith(Schema.Boolean, { nullable: true }),

        /** List of environment variable to set in the container */
        Env: Schema.optionalWith(Schema.Array(Schema.String), { nullable: true }),

        /** Command to run when starting the container */
        Cmd: Schema.optionalWith(Schema.Array(Schema.String), { nullable: true }),

        /** Healthcheck describes how to check the container is healthy */
        Healthcheck: Schema.optionalWith(ContainerHealthConfig.ContainerHealthConfig, { nullable: true }),

        /**
         * True if command is already escaped (meaning treat as a command line)
         * (Windows specific).
         */
        ArgsEscaped: Schema.optionalWith(Schema.Boolean, { nullable: true }),

        /**
         * Name of the image as it was passed by the operator (e.g. could be
         * symbolic)
         */
        Image: Schema.String,

        /** List of volumes (mounts) used for the container */
        Volumes: Schema.optionalWith(
            Schema.Record({
                key: Schema.String,
                value: Schema.Object,
            }),
            { nullable: true }
        ),

        /** Current directory (PWD) in the command will be launched */
        WorkingDir: Schema.optionalWith(Schema.String, { nullable: true }),

        /** Entrypoint to run when starting the container */
        Entrypoint: Schema.optionalWith(Schema.Array(Schema.String), { nullable: true }),

        /** Is network disabled */
        NetworkDisabled: Schema.optionalWith(Schema.Boolean, { nullable: true }),

        /**
         * Mac Address of the container. Deprecated: this field is deprecated
         * since API v1.44. Use EndpointSettings.MacAddress instead.
         */
        MacAddress: Schema.optionalWith(Schema.String, { nullable: true }),

        /** ONBUILD metadata that were defined on the image Dockerfile */
        OnBuild: Schema.optionalWith(Schema.Array(Schema.String), { nullable: true }),

        /** List of labels set to this container */
        Labels: Schema.optionalWith(
            Schema.Record({
                key: Schema.String,
                value: Schema.String,
            }),
            { nullable: true }
        ),

        /** Signal to stop a container */
        StopSignal: Schema.optionalWith(Schema.String, { nullable: true }),

        /** Timeout (in seconds) to stop a container */
        StopTimeout: Schema.optionalWith(MobySchemas.Int64, { nullable: true }),

        /** Shell for shell-form of RUN, CMD, ENTRYPOINT */
        Shell: Schema.optionalWith(Schema.Array(Schema.String), { nullable: true }),

        HostConfig: Schema.optionalWith(
            Schema.Struct({
                // Applicable to all platforms
                /** List of volume bindings for this container */
                Binds: Schema.optionalWith(Schema.Array(Schema.String), { nullable: true }),

                /** File (path) where the containerId is written */
                ContainerIDFile: Schema.optionalWith(Schema.String, { nullable: true }),

                /** Configuration of the logs for this container */
                LogConfig: Schema.optionalWith(ContainerLogConfig.ContainerLogConfig, { nullable: true }),

                /** Network mode to use for the container */
                NetworkMode: Schema.optionalWith(Schema.Literal("default", "none", "host", "bridge", "nat"), {
                    nullable: true,
                }),

                /**
                 * Port mapping between the exposed port (container) and the
                 * host
                 */
                PortBindings: Schema.optionalWith(MobySchemas.PortSchemas.PortMap, { nullable: true }),

                /** Restart policy to be used for the container */
                RestartPolicy: Schema.optionalWith(ContainerRestartPolicy.ContainerRestartPolicy, { nullable: true }),

                /** Automatically remove container when it exits */
                AutoRemove: Schema.optionalWith(Schema.Boolean, { nullable: true }),

                /** Name of the volume driver used to mount volumes */
                VolumeDriver: Schema.optionalWith(Schema.String, { nullable: true }),

                /** List of volumes to take from other container */
                VolumesFrom: Schema.optionalWith(Schema.Array(Schema.String), { nullable: true }),

                /** Initial console size (height,width) */
                ConsoleSize: Schema.optionalWith(Schema.Array(MobySchemas.UInt64).pipe(Schema.itemsCount(2)), {
                    nullable: true,
                }),

                /**
                 * Arbitrary non-identifying metadata attached to container and
                 * provided to the runtime
                 */
                Annotations: Schema.optionalWith(
                    Schema.Record({
                        key: Schema.String,
                        value: Schema.String,
                    }),
                    { nullable: true }
                ),

                // Applicable to UNIX platforms
                /** List of kernel capabilities to add to the container */
                CapAdd: Schema.optionalWith(Schema.Array(Schema.String), { nullable: true }),

                /** List of kernel capabilities to remove from the container */
                CapDrop: Schema.optionalWith(Schema.Array(Schema.String), { nullable: true }),

                /** Cgroup namespace mode to use for the container */
                CgroupnsMode: Schema.optionalWith(Schema.Literal("", "private", "host"), { nullable: true }),

                /** List of DNS servers for the container to use */
                Dns: Schema.optionalWith(Schema.Array(Schema.String), { nullable: true }),

                /** List of DNS search domains */
                DnsOptions: Schema.optionalWith(Schema.Array(Schema.String), { nullable: true }),

                /** List of DNS search domains */
                DnsSearch: Schema.optionalWith(Schema.Array(Schema.String), { nullable: true }),

                /** List of extra hosts */
                ExtraHosts: Schema.optionalWith(Schema.Array(Schema.String), { nullable: true }),

                /**
                 * List of additional groups that the container process will run
                 * as
                 */
                GroupAdd: Schema.optionalWith(Schema.Array(Schema.String), { nullable: true }),

                /** IPC namespace to use for the container */
                IpcMode: Schema.optionalWith(Schema.Literal("none", "host", "container", "private", "shareable"), {
                    nullable: true,
                }),

                /** Cgroup to use for the container */
                Cgroup: Schema.optionalWith(Schema.String, { nullable: true }),

                /** List of links (in the name:alias form) */
                Links: Schema.optionalWith(Schema.Array(Schema.String), { nullable: true }),

                /** Container preference for OOM-killing */
                OomScoreAdj: Schema.optionalWith(MobySchemas.Int64, { nullable: true }),

                /** PID namespace to use for the container */
                PidMode: Schema.optionalWith(Schema.String, { nullable: true }),

                /** Is the container in privileged mode */
                Privileged: Schema.optionalWith(Schema.Boolean, { nullable: true }),

                /** Should docker publish all exposed port for the container */
                PublishAllPorts: Schema.optionalWith(Schema.Boolean, { nullable: true }),

                /** Is the container root filesystem in read-only */
                ReadonlyRootfs: Schema.optionalWith(Schema.Boolean, { nullable: true }),

                /**
                 * List of string values to customize labels for MLS systems,
                 * such as SELinux.
                 */
                SecurityOpt: Schema.optionalWith(Schema.Array(Schema.String), { nullable: true }),

                /** Storage driver options per container. */
                StorageOpt: Schema.optionalWith(
                    Schema.Record({
                        key: Schema.String,
                        value: Schema.String,
                    }),
                    { nullable: true }
                ),

                /** List of tmpfs (mounts) used for the container */
                Tmpfs: Schema.optionalWith(
                    Schema.Record({
                        key: Schema.String,
                        value: Schema.String,
                    }),
                    { nullable: true }
                ),

                /** UTS namespace to use for the container */
                UTSMode: Schema.optionalWith(Schema.String, { nullable: true }),

                /** The user namespace to use for the container */
                UsernsMode: Schema.optionalWith(Schema.String, { nullable: true }),

                /** Total shm memory usage */
                ShmSize: Schema.optionalWith(MobySchemas.Int64, { nullable: true }),

                /** List of Namespaced sysctls used for the container */
                Sysctls: Schema.optionalWith(
                    Schema.Record({
                        key: Schema.String,
                        value: Schema.String,
                    }),
                    { nullable: true }
                ),

                /** Runtime to use with this container */
                Runtime: Schema.optionalWith(Schema.String, { nullable: true }),

                // Applicable to Windows
                /** Isolation technology of the container (e.g. default, hyperv) */
                Isolation: Schema.optionalWith(Schema.Literal("default", "process", "hyperv", ""), { nullable: true }),

                // Contains container's resources (cgroups, ulimits)
                // Applicable to all platforms
                /** CPU shares (relative weight vs. other containers) */
                CpuShares: Schema.optionalWith(MobySchemas.Int64, { nullable: true }),

                /** Memory limit (in bytes) */
                Memory: Schema.optionalWith(MobySchemas.Int64, { nullable: true }),

                /** CPU quota */
                NanoCpus: Schema.optionalWith(MobySchemas.Int64, { nullable: true }),

                // Applicable to UNIX platforms
                /** Parent cgroup. */
                CgroupParent: Schema.optionalWith(Schema.String, { nullable: true }),

                /** Block IO weight (relative weight vs. other containers) */
                BlkioWeight: Schema.optionalWith(MobySchemas.UInt16, { nullable: true }),

                BlkioWeightDevice: Schema.optionalWith(Schema.Array(Schema.NullOr(WeightDevice.WeightDevice)), {
                    nullable: true,
                }),
                BlkioDeviceReadBps: Schema.optionalWith(Schema.Array(Schema.NullOr(ThrottleDevice.ThrottleDevice)), {
                    nullable: true,
                }),
                BlkioDeviceWriteBps: Schema.optionalWith(Schema.Array(Schema.NullOr(ThrottleDevice.ThrottleDevice)), {
                    nullable: true,
                }),
                BlkioDeviceReadIOps: Schema.optionalWith(Schema.Array(Schema.NullOr(ThrottleDevice.ThrottleDevice)), {
                    nullable: true,
                }),
                BlkioDeviceWriteIOps: Schema.optionalWith(Schema.Array(Schema.NullOr(ThrottleDevice.ThrottleDevice)), {
                    nullable: true,
                }),

                /** CPU CFS (Completely Fair Scheduler) period */
                CpuPeriod: Schema.optionalWith(MobySchemas.Int64, { nullable: true }),

                /** CPU CFS (Completely Fair Scheduler) quota */
                CpuQuota: Schema.optionalWith(MobySchemas.Int64, { nullable: true }),

                /** CPU real-time period */
                CpuRealtimePeriod: Schema.optionalWith(MobySchemas.Int64, { nullable: true }),

                /** CPU real-time runtime */
                CpuRealtimeRuntime: Schema.optionalWith(MobySchemas.Int64, { nullable: true }),

                /** CpusetCpus 0-2, 0,1 */
                CpusetCpus: Schema.optionalWith(Schema.String, { nullable: true }),

                /** CpusetMems 0-2, 0,1 */
                CpusetMems: Schema.optionalWith(Schema.String, { nullable: true }),

                /** List of devices to map inside the container */
                Devices: Schema.optionalWith(
                    Schema.Array(Schema.NullOr(ContainerDeviceMapping.ContainerDeviceMapping)),
                    { nullable: true }
                ),

                /** List of rule to be added to the device cgroup */
                DeviceCgroupRules: Schema.optionalWith(Schema.Array(Schema.String), { nullable: true }),

                /** List of device requests for device drivers */
                DeviceRequests: Schema.optionalWith(
                    Schema.Array(Schema.NullOr(ContainerDeviceRequest.ContainerDeviceRequest)),
                    { nullable: true }
                ),

                /**
                 * KernelMemory specifies the kernel memory limit (in bytes) for
                 * the container. Deprecated: kernel 5.4 deprecated
                 * kmem.limit_in_bytes.
                 */
                KernelMemory: Schema.optionalWith(MobySchemas.Int64, { nullable: true }),

                /** Hard limit for kernel TCP buffer memory (in bytes) */
                KernelMemoryTCP: Schema.optionalWith(MobySchemas.Int64, { nullable: true }),

                /** Memory soft limit (in bytes) */
                MemoryReservation: Schema.optionalWith(MobySchemas.Int64, { nullable: true }),

                /**
                 * Total memory usage (memory + swap); set `-1` to enable
                 * unlimited swap
                 */
                MemorySwap: Schema.optionalWith(MobySchemas.Int64, { nullable: true }),

                /** Tuning container memory swappiness behaviour */
                MemorySwappiness: Schema.optionalWith(MobySchemas.Int64, { nullable: true }),

                /** Whether to disable OOM Killer or not */
                OomKillDisable: Schema.optionalWith(Schema.Boolean, { nullable: true }),

                /**
                 * Setting PIDs limit for a container; Set `0` or `-1` for
                 * unlimited, or `null` to not change.
                 */
                PidsLimit: Schema.optionalWith(MobySchemas.Int64, { nullable: true }),

                /** List of ulimits to be set in the container */
                Ulimits: Schema.optionalWith(Schema.Array(Schema.NullOr(ContainerUlimit.ContainerUlimit)), {
                    nullable: true,
                }),

                // Applicable to Windows
                /** Cpu count */
                CpuCount: Schema.optionalWith(MobySchemas.Int64, { nullable: true }),

                /** CPU percent */
                CpuPercent: Schema.optionalWith(MobySchemas.Int64, { nullable: true }),

                /** Maximum IOps for the container system drive */
                IOMaximumIOps: Schema.optionalWith(MobySchemas.UInt64, { nullable: true }),

                /** Maximum IO in bytes per second for the container system drive */
                IOMaximumBandwidth: Schema.optionalWith(MobySchemas.UInt64, { nullable: true }),

                /** Mounts specs used by the container */
                Mounts: Schema.optionalWith(Schema.Array(Schema.NullOr(Mount.Mount)), { nullable: true }),

                /**
                 * MaskedPaths is the list of paths to be masked inside the
                 * container (this overrides the default set of paths)
                 */
                MaskedPaths: Schema.optionalWith(Schema.Array(Schema.String), { nullable: true }),

                /**
                 * ReadonlyPaths is the list of paths to be set as read-only
                 * inside the container (this overrides the default set of
                 * paths)
                 */
                ReadonlyPaths: Schema.optionalWith(Schema.Array(Schema.String), { nullable: true }),

                /**
                 * Run a custom init inside the container, if null, use the
                 * daemon's configured settings
                 */
                Init: Schema.optionalWith(Schema.Boolean, { nullable: true }),
            }),
            { nullable: true }
        ),
        NetworkingConfig: Schema.optionalWith(NetworkNetworkingConfig.NetworkNetworkingConfig, { nullable: true }),
    },
    {
        identifier: "ContainerCreateRequest",
        title: "container.CreateRequest",
        documentation:
            "https://github.com/moby/moby/blob/a21b1a2d12e2c01542cb191eb526d7bfad0641e3/api/types/container/create_request.go#L5-L13",
    }
) {}
