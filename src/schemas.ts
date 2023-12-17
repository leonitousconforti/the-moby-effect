import { Schema } from "@effect/schema";

export enum Port_Type {
    "TCP" = "TCP",
    "UDP" = "UDP",
    "SCTP" = "SCTP",
}

export enum MountPoint_Type {
    "BIND" = "BIND",
    "VOLUME" = "VOLUME",
    "TMPFS" = "TMPFS",
    "NPIPE" = "NPIPE",
    "CLUSTER" = "CLUSTER",
}

export enum Mount_Type {
    "BIND" = "BIND",
    "VOLUME" = "VOLUME",
    "TMPFS" = "TMPFS",
    "NPIPE" = "NPIPE",
    "CLUSTER" = "CLUSTER",
}

export enum Mount_BindOptions_Propagation {
    "PRIVATE" = "PRIVATE",
    "RPRIVATE" = "RPRIVATE",
    "SHARED" = "SHARED",
    "RSHARED" = "RSHARED",
    "SLAVE" = "SLAVE",
    "RSLAVE" = "RSLAVE",
}

export enum RestartPolicy_Name {
    "NONE" = "NONE",
    "NO" = "NO",
    "ALWAYS" = "ALWAYS",
    "UNLESS_STOPPED" = "UNLESS_STOPPED",
    "ON_FAILURE" = "ON_FAILURE",
}

export enum Health_Status {
    "NONE" = "NONE",
    "STARTING" = "STARTING",
    "HEALTHY" = "HEALTHY",
    "UNHEALTHY" = "UNHEALTHY",
}

export enum HostConfig_0_HostConfig_1_LogConfig_Type {
    "JSON_FILE" = "JSON_FILE",
    "SYSLOG" = "SYSLOG",
    "JOURNALD" = "JOURNALD",
    "GELF" = "GELF",
    "FLUENTD" = "FLUENTD",
    "AWSLOGS" = "AWSLOGS",
    "SPLUNK" = "SPLUNK",
    "ETWLOGS" = "ETWLOGS",
    "NONE" = "NONE",
}

export enum HostConfig_0_HostConfig_1_RestartPolicy_Name {
    "NONE" = "NONE",
    "NO" = "NO",
    "ALWAYS" = "ALWAYS",
    "UNLESS_STOPPED" = "UNLESS_STOPPED",
    "ON_FAILURE" = "ON_FAILURE",
}

export enum HostConfig_0_HostConfig_1_Mounts_Mounts_Type {
    "BIND" = "BIND",
    "VOLUME" = "VOLUME",
    "TMPFS" = "TMPFS",
    "NPIPE" = "NPIPE",
    "CLUSTER" = "CLUSTER",
}

export enum HostConfig_0_HostConfig_1_Mounts_Mounts_BindOptions_Propagation {
    "PRIVATE" = "PRIVATE",
    "RPRIVATE" = "RPRIVATE",
    "SHARED" = "SHARED",
    "RSHARED" = "RSHARED",
    "SLAVE" = "SLAVE",
    "RSLAVE" = "RSLAVE",
}

export enum HostConfig_0_HostConfig_1_CgroupnsMode {
    "PRIVATE" = "PRIVATE",
    "HOST" = "HOST",
}

export enum HostConfig_0_HostConfig_1_Isolation {
    "DEFAULT" = "DEFAULT",
    "PROCESS" = "PROCESS",
    "HYPERV" = "HYPERV",
}

export class HostConfig_0 extends Schema.Class<HostConfig_0>()({
    /**
     * An integer value representing this container's relative CPU weight versus
     * other containers.
     */
    CpuShares: Schema.optional(Schema.number),

    /** Memory limit in bytes. */
    Memory: Schema.optional(Schema.number),

    /**
     * Path to `cgroups` under which the container's `cgroup` is created. If the
     * path is not absolute, the path is considered to be relative to the
     * `cgroups` path of the init process. Cgroups are created if they do not
     * already exist.
     */
    CgroupParent: Schema.optional(Schema.string),

    /** Block IO weight (relative weight). */
    BlkioWeight: Schema.optional(Schema.number),

    /**
     * Block IO weight (relative device weight) in the form:
     *
     *     [{ Path: "device_path", Weight: weight }];
     */
    BlkioWeightDevice: Schema.optional(
        Schema.array(Schema.struct({ Path: Schema.optional(Schema.string), Weight: Schema.optional(Schema.number) }))
    ),

    /**
     * Limit read rate (bytes per second) from a device, in the form:
     *
     *     [{ Path: "device_path", Rate: rate }];
     */
    BlkioDeviceReadBps: Schema.optional(
        Schema.array(
            Schema.struct({
                /** Device path */
                Path: Schema.optional(Schema.string),

                /** Rate */
                Rate: Schema.optional(Schema.number),
            })
        )
    ),

    /**
     * Limit write rate (bytes per second) to a device, in the form:
     *
     *     [{ Path: "device_path", Rate: rate }];
     */
    BlkioDeviceWriteBps: Schema.optional(
        Schema.array(
            Schema.struct({
                /** Device path */
                Path: Schema.optional(Schema.string),

                /** Rate */
                Rate: Schema.optional(Schema.number),
            })
        )
    ),

    /**
     * Limit read rate (IO per second) from a device, in the form:
     *
     *     [{ Path: "device_path", Rate: rate }];
     */
    BlkioDeviceReadIOps: Schema.optional(
        Schema.array(
            Schema.struct({
                /** Device path */
                Path: Schema.optional(Schema.string),

                /** Rate */
                Rate: Schema.optional(Schema.number),
            })
        )
    ),

    /**
     * Limit write rate (IO per second) to a device, in the form:
     *
     *     [{ Path: "device_path", Rate: rate }];
     */
    BlkioDeviceWriteIOps: Schema.optional(
        Schema.array(
            Schema.struct({
                /** Device path */
                Path: Schema.optional(Schema.string),

                /** Rate */
                Rate: Schema.optional(Schema.number),
            })
        )
    ),

    /** The length of a CPU period in microseconds. */
    CpuPeriod: Schema.optional(Schema.number),

    /** Microseconds of CPU time that the container can get in a CPU period. */
    CpuQuota: Schema.optional(Schema.number),

    /**
     * The length of a CPU real-time period in microseconds. Set to 0 to
     * allocate no time allocated to real-time tasks.
     */
    CpuRealtimePeriod: Schema.optional(Schema.number),

    /**
     * The length of a CPU real-time runtime in microseconds. Set to 0 to
     * allocate no time allocated to real-time tasks.
     */
    CpuRealtimeRuntime: Schema.optional(Schema.number),

    /** CPUs in which to allow execution (e.g., `0-3`, `0,1`). */
    CpusetCpus: Schema.optional(Schema.string),

    /**
     * Memory nodes (MEMs) in which to allow execution (0-3, 0,1). Only
     * effective on NUMA systems.
     */
    CpusetMems: Schema.optional(Schema.string),

    /** A list of devices to add to the container. */
    Devices: Schema.optional(
        Schema.array(
            Schema.struct({
                PathOnHost: Schema.optional(Schema.string),
                PathInContainer: Schema.optional(Schema.string),
                CgroupPermissions: Schema.optional(Schema.string),
            })
        )
    ),

    /** A list of cgroup rules to apply to the container */
    DeviceCgroupRules: Schema.optional(Schema.array(Schema.string)),

    /** A list of requests for devices to be sent to device drivers. */
    DeviceRequests: Schema.optional(
        Schema.array(
            Schema.struct({
                Driver: Schema.optional(Schema.string),
                Count: Schema.optional(Schema.number),
                DeviceIDs: Schema.optional(Schema.array(Schema.string)),

                /**
                 * A list of capabilities; an OR list of AND lists of
                 * capabilities.
                 */
                Capabilities: Schema.optional(Schema.array(Schema.array(Schema.string))),

                /**
                 * Driver-specific options, specified as a key/value pairs.
                 * These options are passed directly to the driver.
                 */
                Options: Schema.optional(Schema.struct({})),
            })
        )
    ),

    /**
     * Hard limit for kernel TCP buffer memory (in bytes). Depending on the OCI
     * runtime in use, this option may be ignored. It is no longer supported by
     * the default (runc) runtime.
     *
     * This field is omitted when empty.
     */
    KernelMemoryTCP: Schema.optional(Schema.number),

    /** Memory soft limit in bytes. */
    MemoryReservation: Schema.optional(Schema.number),

    /** Total memory limit (memory + swap). Set as `-1` to enable unlimited swap. */
    MemorySwap: Schema.optional(Schema.number),

    /**
     * Tune a container's memory swappiness behavior. Accepts an integer between
     * 0 and 100.
     */
    MemorySwappiness: Schema.optional(Schema.number),

    /** CPU quota in units of 10<sup>-9</sup> CPUs. */
    NanoCpus: Schema.optional(Schema.number),

    /** Disable OOM Killer for the container. */
    OomKillDisable: Schema.optional(Schema.boolean),

    /**
     * Run an init inside the container that forwards signals and reaps
     * processes. This field is omitted if empty, and the default (as configured
     * on the daemon) is used.
     */
    Init: Schema.optional(Schema.nullable(Schema.boolean)),

    /**
     * Tune a container's PIDs limit. Set `0` or `-1` for unlimited, or `null`
     * to not change.
     */
    PidsLimit: Schema.optional(Schema.nullable(Schema.number)),

    /**
     * A list of resource limits to set in the container. For example:
     *
     *     { "Name": "nofile", "Soft": 1024, "Hard": 2048 }
     */
    Ulimits: Schema.optional(
        Schema.array(
            Schema.struct({
                /** Name of ulimit */
                Name: Schema.optional(Schema.string),

                /** Soft limit */
                Soft: Schema.optional(Schema.number),

                /** Hard limit */
                Hard: Schema.optional(Schema.number),
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
    CpuCount: Schema.optional(Schema.number),

    /**
     * The usable percentage of the available CPUs (Windows only).
     *
     * On Windows Server containers, the processor resource controls are
     * mutually exclusive. The order of precedence is `CPUCount` first, then
     * `CPUShares`, and `CPUPercent` last.
     */
    CpuPercent: Schema.optional(Schema.number),

    /** Maximum IOps for the container system drive (Windows only) */
    IOMaximumIOps: Schema.optional(Schema.number),

    /**
     * Maximum IO in bytes per second for the container system drive (Windows
     * only).
     */
    IOMaximumBandwidth: Schema.optional(Schema.number),
}) {}

export class HostConfig_1 extends HostConfig_0.extend<HostConfig_1>()({
    /**
     * A list of volume bindings for this container. Each volume binding is a
     * string in one of these forms:
     *
     * - `host-src:container-dest[:options]` to bind-mount a host path into the
     *   container. Both `host-src`, and `container-dest` must be an _absolute_
     *   path.
     * - `volume-name:container-dest[:options]` to bind-mount a volume managed by
     *   a volume driver into the container. `container-dest` must be an
     *   _absolute_ path.
     *
     * `options` is an optional, comma-delimited list of:
     *
     * - `nocopy` disables automatic copying of data from the container path to
     *   the volume. The `nocopy` flag only applies to named volumes.
     * - `[ro|rw]` mounts a volume read-only or read-write, respectively. If
     *   omitted or set to `rw`, volumes are mounted read-write.
     * - `[z|Z]` applies SELinux labels to allow or deny multiple containers to
     *   read and write to the same volume.
     *
     *   - `z`: a _shared_ content label is applied to the content. This label
     *       indicates that multiple containers can share the volume content,
     *       for both reading and writing.
     *   - `Z`: a _private unshared_ label is applied to the content. This label
     *       indicates that only the current container can use a private volume.
     *       Labeling systems such as SELinux require proper labels to be placed
     *       on volume content that is mounted into a container. Without a
     *       label, the security system can prevent a container's processes from
     *       using the content. By default, the labels set by the host operating
     *       system are not modified.
     * - `[[r]shared|[r]slave|[r]private]` specifies mount [propagation
     *   behavior](https://www.kernel.org/doc/Documentation/filesystems/sharedsubtree.txt).
     *   This only applies to bind-mounted volumes, not internal volumes or
     *   named volumes. Mount propagation requires the source mount point (the
     *   location where the source directory is mounted in the host operating
     *   system) to have the correct propagation properties. For shared volumes,
     *   the source mount point must be set to `shared`. For slave volumes, the
     *   mount must be set to either `shared` or `slave`.
     */
    Binds: Schema.optional(Schema.array(Schema.string)),

    /** Path to a file where the container ID is written */
    ContainerIDFile: Schema.optional(Schema.string),

    /** The logging configuration for this container */
    LogConfig: Schema.optional(
        Schema.struct({
            Type: Schema.enums(HostConfig_0_HostConfig_1_LogConfig_Type),
            Config: Schema.optional(Schema.struct({})),
        })
    ),

    /**
     * Network mode to use for this container. Supported standard values are:
     * `bridge`, `host`, `none`, and `container:<name|id>`. Any other value is
     * taken as a custom network's name to which this container should connect
     * to.
     */
    NetworkMode: Schema.optional(Schema.string),

    /**
     * PortMap describes the mapping of container ports to host ports, using the
     * container's port-number and protocol as key in the format
     * `<port>/<protocol>`, for example, `80/udp`.
     *
     * If a container's port is mapped for multiple protocols, separate entries
     * are added to the mapping table.
     */
    PortBindings: Schema.optional(Schema.struct({})),

    /**
     * The behavior to apply when the container exits. The default is not to
     * restart.
     *
     * An ever increasing delay (double the previous delay, starting at 100ms)
     * is added before each restart to prevent flooding the server.
     */
    RestartPolicy: Schema.optional(
        Schema.struct({
            /**
             * - Empty string means not to restart
             * - `no` Do not automatically restart
             * - `always` Always restart
             * - `unless-stopped` Restart always except when the user has manually
             *   stopped the container
             * - `on-failure` Restart only when the container exit code is
             *   non-zero
             */
            Name: Schema.enums(HostConfig_0_HostConfig_1_RestartPolicy_Name),

            /**
             * If `on-failure` is used, the number of times to retry before
             * giving up.
             */
            MaximumRetryCount: Schema.optional(Schema.number),
        })
    ),

    /**
     * Automatically remove the container when the container's process exits.
     * This has no effect if `RestartPolicy` is set.
     */
    AutoRemove: Schema.optional(Schema.boolean),

    /** Driver that this container uses to mount volumes. */
    VolumeDriver: Schema.optional(Schema.string),

    /**
     * A list of volumes to inherit from another container, specified in the
     * form `<container name>[:<ro|rw>]`.
     */
    VolumesFrom: Schema.optional(Schema.array(Schema.string)),

    /** Specification for mounts to be added to the container. */
    Mounts: Schema.optional(
        Schema.array(
            Schema.struct({
                /** Container path. */
                Target: Schema.optional(Schema.string),

                /** Mount source (e.g. a volume name, a host path). */
                Source: Schema.optional(Schema.string),

                /**
                 * The mount type. Available types:
                 *
                 * - `bind` Mounts a file or directory from the host into the
                 *   container. Must exist prior to creating the container.
                 * - `volume` Creates a volume with the given name and options (or
                 *   uses a pre-existing volume with the same name and options).
                 *   These are **not** removed when the container is removed.
                 * - `tmpfs` Create a tmpfs with the given options. The mount
                 *   source cannot be specified for tmpfs.
                 * - `npipe` Mounts a named pipe from the host into the container.
                 *   Must exist prior to creating the container.
                 * - `cluster` a Swarm cluster volume
                 */
                Type: Schema.enums(HostConfig_0_HostConfig_1_Mounts_Mounts_Type),

                /** Whether the mount should be read-only. */
                ReadOnly: Schema.optional(Schema.boolean),

                /**
                 * The consistency requirement for the mount: `default`,
                 * `consistent`, `cached`, or `delegated`.
                 */
                Consistency: Schema.optional(Schema.string),

                /** Optional configuration for the `bind` type. */
                BindOptions: Schema.optional(
                    Schema.struct({
                        /**
                         * A propagation mode with the value `[r]private`,
                         * `[r]shared`, or `[r]slave`.
                         */
                        Propagation: Schema.enums(HostConfig_0_HostConfig_1_Mounts_Mounts_BindOptions_Propagation),

                        /** Disable recursive bind mount. */
                        NonRecursive: Schema.optional(Schema.boolean),

                        /** Create mount point on host if missing */
                        CreateMountpoint: Schema.optional(Schema.boolean),

                        /**
                         * Make the mount non-recursively read-only, but still
                         * leave the mount recursive (unless NonRecursive is set
                         * to true in conjunction).
                         */
                        ReadOnlyNonRecursive: Schema.optional(Schema.boolean),

                        /**
                         * Raise an error if the mount cannot be made
                         * recursively read-only.
                         */
                        ReadOnlyForceRecursive: Schema.optional(Schema.boolean),
                    })
                ),

                /** Optional configuration for the `volume` type. */
                VolumeOptions: Schema.optional(
                    Schema.struct({
                        /** Populate volume with data from the target. */
                        NoCopy: Schema.optional(Schema.boolean),

                        /** User-defined key/value metadata. */
                        Labels: Schema.optional(Schema.struct({})),

                        /** Map of driver specific options */
                        DriverConfig: Schema.optional(
                            Schema.struct({
                                /**
                                 * Name of the driver to use to create the
                                 * volume.
                                 */
                                Name: Schema.optional(Schema.string),

                                /** Key/value map of driver specific options. */
                                Options: Schema.optional(Schema.struct({})),
                            })
                        ),
                    })
                ),

                /** Optional configuration for the `tmpfs` type. */
                TmpfsOptions: Schema.optional(
                    Schema.struct({
                        /** The size for the tmpfs mount in bytes. */
                        SizeBytes: Schema.optional(Schema.number),

                        /**
                         * The permission mode for the tmpfs mount in an
                         * integer.
                         */
                        Mode: Schema.optional(Schema.number),
                    })
                ),
            })
        )
    ),

    /** Initial console size, as an `[height, width]` array. */
    ConsoleSize: Schema.optional(Schema.nullable(Schema.array(Schema.number))),

    /**
     * Arbitrary non-identifying metadata attached to container and provided to
     * the runtime when the container is started.
     */
    Annotations: Schema.optional(Schema.struct({})),

    /**
     * A list of kernel capabilities to add to the container. Conflicts with
     * option 'Capabilities'.
     */
    CapAdd: Schema.optional(Schema.array(Schema.string)),

    /**
     * A list of kernel capabilities to drop from the container. Conflicts with
     * option 'Capabilities'.
     */
    CapDrop: Schema.optional(Schema.array(Schema.string)),

    /**
     * Cgroup namespace mode for the container. Possible values are:
     *
     * - `"private"`: the container runs in its own private cgroup namespace
     * - `"host"`: use the host system's cgroup namespace
     *
     * If not specified, the daemon default is used, which can either be
     * `"private"` or `"host"`, depending on daemon version, kernel support and
     * configuration.
     */
    CgroupnsMode: Schema.enums(HostConfig_0_HostConfig_1_CgroupnsMode),

    /** A list of DNS servers for the container to use. */
    Dns: Schema.optional(Schema.array(Schema.string)),

    /** A list of DNS options. */
    DnsOptions: Schema.optional(Schema.array(Schema.string)),

    /** A list of DNS search domains. */
    DnsSearch: Schema.optional(Schema.array(Schema.string)),

    /**
     * A list of hostnames/IP mappings to add to the container's `/etc/hosts`
     * file. Specified in the form `["hostname:IP"]`.
     */
    ExtraHosts: Schema.optional(Schema.array(Schema.string)),

    /** A list of additional groups that the container process will run as. */
    GroupAdd: Schema.optional(Schema.array(Schema.string)),

    /**
     * IPC sharing mode for the container. Possible values are:
     *
     * - `"none"`: own private IPC namespace, with /dev/shm not mounted
     * - `"private"`: own private IPC namespace
     * - `"shareable"`: own private IPC namespace, with a possibility to share it
     *   with other containers
     * - `"container:<name|id>"`: join another (shareable) container's IPC
     *   namespace
     * - `"host"`: use the host system's IPC namespace
     *
     * If not specified, daemon default is used, which can either be `"private"`
     * or `"shareable"`, depending on daemon version and configuration.
     */
    IpcMode: Schema.optional(Schema.string),

    /** Cgroup to use for the container. */
    Cgroup: Schema.optional(Schema.string),

    /** A list of links for the container in the form `container_name:alias`. */
    Links: Schema.optional(Schema.array(Schema.string)),

    /**
     * An integer value containing the score given to the container in order to
     * tune OOM killer preferences.
     */
    OomScoreAdj: Schema.optional(Schema.number),

    /**
     * Set the PID (Process) Namespace mode for the container. It can be either:
     *
     * - `"container:<name|id>"`: joins another container's PID namespace
     * - `"host"`: use the host's PID namespace inside the container
     */
    PidMode: Schema.optional(Schema.string),

    /** Gives the container full access to the host. */
    Privileged: Schema.optional(Schema.boolean),

    /**
     * Allocates an ephemeral host port for all of a container's exposed ports.
     *
     * Ports are de-allocated when the container stops and allocated when the
     * container starts. The allocated port might be changed when restarting the
     * container.
     *
     * The port is selected from the ephemeral port range that depends on the
     * kernel. For example, on Linux the range is defined by
     * `/proc/sys/net/ipv4/ip_local_port_range`.
     */
    PublishAllPorts: Schema.optional(Schema.boolean),

    /** Mount the container's root filesystem as read only. */
    ReadonlyRootfs: Schema.optional(Schema.boolean),

    /**
     * A list of string values to customize labels for MLS systems, such as
     * SELinux.
     */
    SecurityOpt: Schema.optional(Schema.array(Schema.string)),

    /**
     * Storage driver options for this container, in the form `{"size":
     * "120G"}`.
     */
    StorageOpt: Schema.optional(Schema.struct({})),

    /**
     * A map of container directories which should be replaced by tmpfs mounts,
     * and their corresponding mount options. For example:
     *
     *     { "/run": "rw,noexec,nosuid,size=65536k" }
     */
    Tmpfs: Schema.optional(Schema.struct({})),

    /** UTS namespace to use for the container. */
    UTSMode: Schema.optional(Schema.string),

    /**
     * Sets the usernamespace mode for the container when usernamespace
     * remapping option is enabled.
     */
    UsernsMode: Schema.optional(Schema.string),

    /** Size of `/dev/shm` in bytes. If omitted, the system uses 64MB. */
    ShmSize: Schema.optional(Schema.number),

    /**
     * A list of kernel parameters (sysctls) to set in the container. For
     * example:
     *
     *     { "net.ipv4.ip_forward": "1" }
     */
    Sysctls: Schema.optional(Schema.struct({})),

    /** Runtime to use with this container. */
    Runtime: Schema.optional(Schema.string),

    /** Isolation technology of the container. (Windows only) */
    Isolation: Schema.enums(HostConfig_0_HostConfig_1_Isolation),

    /**
     * The list of paths to be masked inside the container (this overrides the
     * default set of paths).
     */
    MaskedPaths: Schema.optional(Schema.array(Schema.string)),

    /**
     * The list of paths to be set as read-only inside the container (this
     * overrides the default set of paths).
     */
    ReadonlyPaths: Schema.optional(Schema.array(Schema.string)),
}) {}

export enum FilesystemChange_Kind {
    "ZERO" = "ZERO",
    "ONE" = "ONE",
    "TWO" = "TWO",
}

export enum ChangeType {
    "ZERO" = "ZERO",
    "ONE" = "ONE",
    "TWO" = "TWO",
}

export enum Volume_Scope {
    "LOCAL" = "LOCAL",
    "GLOBAL" = "GLOBAL",
}

export enum Volume_ClusterVolume_Spec_AccessMode_Scope {
    "SINGLE" = "SINGLE",
    "MULTI" = "MULTI",
}

export enum Volume_ClusterVolume_Spec_AccessMode_Sharing {
    "NONE" = "NONE",
    "READONLY" = "READONLY",
    "ONEWRITER" = "ONEWRITER",
    "ALL" = "ALL",
}

export enum Volume_ClusterVolume_Spec_AccessMode_Availability {
    "ACTIVE" = "ACTIVE",
    "PAUSE" = "PAUSE",
    "DRAIN" = "DRAIN",
}

export enum Volume_ClusterVolume_PublishStatus_PublishStatus_State {
    "PENDING_PUBLISH" = "PENDING_PUBLISH",
    "PUBLISHED" = "PUBLISHED",
    "PENDING_NODE_UNPUBLISH" = "PENDING_NODE_UNPUBLISH",
    "PENDING_CONTROLLER_UNPUBLISH" = "PENDING_CONTROLLER_UNPUBLISH",
}

export enum VolumeCreateOptions_ClusterVolumeSpec_AccessMode_Scope {
    "SINGLE" = "SINGLE",
    "MULTI" = "MULTI",
}

export enum VolumeCreateOptions_ClusterVolumeSpec_AccessMode_Sharing {
    "NONE" = "NONE",
    "READONLY" = "READONLY",
    "ONEWRITER" = "ONEWRITER",
    "ALL" = "ALL",
}

export enum VolumeCreateOptions_ClusterVolumeSpec_AccessMode_Availability {
    "ACTIVE" = "ACTIVE",
    "PAUSE" = "PAUSE",
    "DRAIN" = "DRAIN",
}

export enum VolumeListResponse_Volumes_Volumes_Scope {
    "LOCAL" = "LOCAL",
    "GLOBAL" = "GLOBAL",
}

export enum VolumeListResponse_Volumes_Volumes_ClusterVolume_Spec_AccessMode_Scope {
    "SINGLE" = "SINGLE",
    "MULTI" = "MULTI",
}

export enum VolumeListResponse_Volumes_Volumes_ClusterVolume_Spec_AccessMode_Sharing {
    "NONE" = "NONE",
    "READONLY" = "READONLY",
    "ONEWRITER" = "ONEWRITER",
    "ALL" = "ALL",
}

export enum VolumeListResponse_Volumes_Volumes_ClusterVolume_Spec_AccessMode_Availability {
    "ACTIVE" = "ACTIVE",
    "PAUSE" = "PAUSE",
    "DRAIN" = "DRAIN",
}

export enum VolumeListResponse_Volumes_Volumes_ClusterVolume_PublishStatus_PublishStatus_State {
    "PENDING_PUBLISH" = "PENDING_PUBLISH",
    "PUBLISHED" = "PUBLISHED",
    "PENDING_NODE_UNPUBLISH" = "PENDING_NODE_UNPUBLISH",
    "PENDING_CONTROLLER_UNPUBLISH" = "PENDING_CONTROLLER_UNPUBLISH",
}

export enum BuildCache_Type {
    "INTERNAL" = "INTERNAL",
    "FRONTEND" = "FRONTEND",
    "SOURCE.LOCAL" = "SOURCE.LOCAL",
    "SOURCE.GIT.CHECKOUT" = "SOURCE.GIT.CHECKOUT",
    "EXEC.CACHEMOUNT" = "EXEC.CACHEMOUNT",
    "REGULAR" = "REGULAR",
}

export enum Plugin_Config_Interface_ProtocolScheme {
    "NONE" = "NONE",
    "MOBY.PLUGINS.HTTP/V1" = "MOBY.PLUGINS.HTTP/V1",
}

export enum NodeSpec_Role {
    "WORKER" = "WORKER",
    "MANAGER" = "MANAGER",
}

export enum NodeSpec_Availability {
    "ACTIVE" = "ACTIVE",
    "PAUSE" = "PAUSE",
    "DRAIN" = "DRAIN",
}

export enum Node_Spec_Role {
    "WORKER" = "WORKER",
    "MANAGER" = "MANAGER",
}

export enum Node_Spec_Availability {
    "ACTIVE" = "ACTIVE",
    "PAUSE" = "PAUSE",
    "DRAIN" = "DRAIN",
}

export enum Node_Status_State {
    "UNKNOWN" = "UNKNOWN",
    "DOWN" = "DOWN",
    "READY" = "READY",
    "DISCONNECTED" = "DISCONNECTED",
}

export enum Node_ManagerStatus_Reachability {
    "UNKNOWN" = "UNKNOWN",
    "UNREACHABLE" = "UNREACHABLE",
    "REACHABLE" = "REACHABLE",
}

export enum NodeStatus_State {
    "UNKNOWN" = "UNKNOWN",
    "DOWN" = "DOWN",
    "READY" = "READY",
    "DISCONNECTED" = "DISCONNECTED",
}

export enum NodeState {
    "UNKNOWN" = "UNKNOWN",
    "DOWN" = "DOWN",
    "READY" = "READY",
    "DISCONNECTED" = "DISCONNECTED",
}

export enum ManagerStatus_Reachability {
    "UNKNOWN" = "UNKNOWN",
    "UNREACHABLE" = "UNREACHABLE",
    "REACHABLE" = "REACHABLE",
}

export enum Reachability {
    "UNKNOWN" = "UNKNOWN",
    "UNREACHABLE" = "UNREACHABLE",
    "REACHABLE" = "REACHABLE",
}

export enum SwarmSpec_CAConfig_ExternalCAs_ExternalCAs_Protocol {
    "CFSSL" = "CFSSL",
}

export enum ClusterInfo_Spec_CAConfig_ExternalCAs_ExternalCAs_Protocol {
    "CFSSL" = "CFSSL",
}

export enum TaskSpec_ContainerSpec_Privileges_Seccomp_Mode {
    "DEFAULT" = "DEFAULT",
    "UNCONFINED" = "UNCONFINED",
    "CUSTOM" = "CUSTOM",
}

export enum TaskSpec_ContainerSpec_Privileges_AppArmor_Mode {
    "DEFAULT" = "DEFAULT",
    "DISABLED" = "DISABLED",
}

export enum TaskSpec_ContainerSpec_Mounts_Mounts_Type {
    "BIND" = "BIND",
    "VOLUME" = "VOLUME",
    "TMPFS" = "TMPFS",
    "NPIPE" = "NPIPE",
    "CLUSTER" = "CLUSTER",
}

export enum TaskSpec_ContainerSpec_Mounts_Mounts_BindOptions_Propagation {
    "PRIVATE" = "PRIVATE",
    "RPRIVATE" = "RPRIVATE",
    "SHARED" = "SHARED",
    "RSHARED" = "RSHARED",
    "SLAVE" = "SLAVE",
    "RSLAVE" = "RSLAVE",
}

export enum TaskSpec_ContainerSpec_Isolation {
    "DEFAULT" = "DEFAULT",
    "PROCESS" = "PROCESS",
    "HYPERV" = "HYPERV",
}

export enum TaskSpec_RestartPolicy_Condition {
    "NONE" = "NONE",
    "ON_FAILURE" = "ON_FAILURE",
    "ANY" = "ANY",
}

export enum TaskState {
    "NEW" = "NEW",
    "ALLOCATED" = "ALLOCATED",
    "PENDING" = "PENDING",
    "ASSIGNED" = "ASSIGNED",
    "ACCEPTED" = "ACCEPTED",
    "PREPARING" = "PREPARING",
    "READY" = "READY",
    "STARTING" = "STARTING",
    "RUNNING" = "RUNNING",
    "COMPLETE" = "COMPLETE",
    "SHUTDOWN" = "SHUTDOWN",
    "FAILED" = "FAILED",
    "REJECTED" = "REJECTED",
    "REMOVE" = "REMOVE",
    "ORPHANED" = "ORPHANED",
}

export enum Task_Spec_ContainerSpec_Privileges_Seccomp_Mode {
    "DEFAULT" = "DEFAULT",
    "UNCONFINED" = "UNCONFINED",
    "CUSTOM" = "CUSTOM",
}

export enum Task_Spec_ContainerSpec_Privileges_AppArmor_Mode {
    "DEFAULT" = "DEFAULT",
    "DISABLED" = "DISABLED",
}

export enum Task_Spec_ContainerSpec_Mounts_Mounts_Type {
    "BIND" = "BIND",
    "VOLUME" = "VOLUME",
    "TMPFS" = "TMPFS",
    "NPIPE" = "NPIPE",
    "CLUSTER" = "CLUSTER",
}

export enum Task_Spec_ContainerSpec_Mounts_Mounts_BindOptions_Propagation {
    "PRIVATE" = "PRIVATE",
    "RPRIVATE" = "RPRIVATE",
    "SHARED" = "SHARED",
    "RSHARED" = "RSHARED",
    "SLAVE" = "SLAVE",
    "RSLAVE" = "RSLAVE",
}

export enum Task_Spec_ContainerSpec_Isolation {
    "DEFAULT" = "DEFAULT",
    "PROCESS" = "PROCESS",
    "HYPERV" = "HYPERV",
}

export enum Task_Spec_RestartPolicy_Condition {
    "NONE" = "NONE",
    "ON_FAILURE" = "ON_FAILURE",
    "ANY" = "ANY",
}

export enum Task_Status_State {
    "NEW" = "NEW",
    "ALLOCATED" = "ALLOCATED",
    "PENDING" = "PENDING",
    "ASSIGNED" = "ASSIGNED",
    "ACCEPTED" = "ACCEPTED",
    "PREPARING" = "PREPARING",
    "READY" = "READY",
    "STARTING" = "STARTING",
    "RUNNING" = "RUNNING",
    "COMPLETE" = "COMPLETE",
    "SHUTDOWN" = "SHUTDOWN",
    "FAILED" = "FAILED",
    "REJECTED" = "REJECTED",
    "REMOVE" = "REMOVE",
    "ORPHANED" = "ORPHANED",
}

export enum Task_DesiredState {
    "NEW" = "NEW",
    "ALLOCATED" = "ALLOCATED",
    "PENDING" = "PENDING",
    "ASSIGNED" = "ASSIGNED",
    "ACCEPTED" = "ACCEPTED",
    "PREPARING" = "PREPARING",
    "READY" = "READY",
    "STARTING" = "STARTING",
    "RUNNING" = "RUNNING",
    "COMPLETE" = "COMPLETE",
    "SHUTDOWN" = "SHUTDOWN",
    "FAILED" = "FAILED",
    "REJECTED" = "REJECTED",
    "REMOVE" = "REMOVE",
    "ORPHANED" = "ORPHANED",
}

export enum ServiceSpec_TaskTemplate_ContainerSpec_Privileges_Seccomp_Mode {
    "DEFAULT" = "DEFAULT",
    "UNCONFINED" = "UNCONFINED",
    "CUSTOM" = "CUSTOM",
}

export enum ServiceSpec_TaskTemplate_ContainerSpec_Privileges_AppArmor_Mode {
    "DEFAULT" = "DEFAULT",
    "DISABLED" = "DISABLED",
}

export enum ServiceSpec_TaskTemplate_ContainerSpec_Mounts_Mounts_Type {
    "BIND" = "BIND",
    "VOLUME" = "VOLUME",
    "TMPFS" = "TMPFS",
    "NPIPE" = "NPIPE",
    "CLUSTER" = "CLUSTER",
}

export enum ServiceSpec_TaskTemplate_ContainerSpec_Mounts_Mounts_BindOptions_Propagation {
    "PRIVATE" = "PRIVATE",
    "RPRIVATE" = "RPRIVATE",
    "SHARED" = "SHARED",
    "RSHARED" = "RSHARED",
    "SLAVE" = "SLAVE",
    "RSLAVE" = "RSLAVE",
}

export enum ServiceSpec_TaskTemplate_ContainerSpec_Isolation {
    "DEFAULT" = "DEFAULT",
    "PROCESS" = "PROCESS",
    "HYPERV" = "HYPERV",
}

export enum ServiceSpec_TaskTemplate_RestartPolicy_Condition {
    "NONE" = "NONE",
    "ON_FAILURE" = "ON_FAILURE",
    "ANY" = "ANY",
}

export enum ServiceSpec_UpdateConfig_FailureAction {
    "CONTINUE" = "CONTINUE",
    "PAUSE" = "PAUSE",
    "ROLLBACK" = "ROLLBACK",
}

export enum ServiceSpec_UpdateConfig_Order {
    "STOP_FIRST" = "STOP_FIRST",
    "START_FIRST" = "START_FIRST",
}

export enum ServiceSpec_RollbackConfig_FailureAction {
    "CONTINUE" = "CONTINUE",
    "PAUSE" = "PAUSE",
}

export enum ServiceSpec_RollbackConfig_Order {
    "STOP_FIRST" = "STOP_FIRST",
    "START_FIRST" = "START_FIRST",
}

export enum ServiceSpec_EndpointSpec_Mode {
    "VIP" = "VIP",
    "DNSRR" = "DNSRR",
}

export enum ServiceSpec_EndpointSpec_Ports_Ports_Protocol {
    "TCP" = "TCP",
    "UDP" = "UDP",
    "SCTP" = "SCTP",
}

export enum ServiceSpec_EndpointSpec_Ports_Ports_PublishMode {
    "INGRESS" = "INGRESS",
    "HOST" = "HOST",
}

export enum EndpointPortConfig_Protocol {
    "TCP" = "TCP",
    "UDP" = "UDP",
    "SCTP" = "SCTP",
}

export enum EndpointPortConfig_PublishMode {
    "INGRESS" = "INGRESS",
    "HOST" = "HOST",
}

export enum EndpointSpec_Mode {
    "VIP" = "VIP",
    "DNSRR" = "DNSRR",
}

export enum EndpointSpec_Ports_Ports_Protocol {
    "TCP" = "TCP",
    "UDP" = "UDP",
    "SCTP" = "SCTP",
}

export enum EndpointSpec_Ports_Ports_PublishMode {
    "INGRESS" = "INGRESS",
    "HOST" = "HOST",
}

export enum Service_Spec_TaskTemplate_ContainerSpec_Privileges_Seccomp_Mode {
    "DEFAULT" = "DEFAULT",
    "UNCONFINED" = "UNCONFINED",
    "CUSTOM" = "CUSTOM",
}

export enum Service_Spec_TaskTemplate_ContainerSpec_Privileges_AppArmor_Mode {
    "DEFAULT" = "DEFAULT",
    "DISABLED" = "DISABLED",
}

export enum Service_Spec_TaskTemplate_ContainerSpec_Mounts_Mounts_Type {
    "BIND" = "BIND",
    "VOLUME" = "VOLUME",
    "TMPFS" = "TMPFS",
    "NPIPE" = "NPIPE",
    "CLUSTER" = "CLUSTER",
}

export enum Service_Spec_TaskTemplate_ContainerSpec_Mounts_Mounts_BindOptions_Propagation {
    "PRIVATE" = "PRIVATE",
    "RPRIVATE" = "RPRIVATE",
    "SHARED" = "SHARED",
    "RSHARED" = "RSHARED",
    "SLAVE" = "SLAVE",
    "RSLAVE" = "RSLAVE",
}

export enum Service_Spec_TaskTemplate_ContainerSpec_Isolation {
    "DEFAULT" = "DEFAULT",
    "PROCESS" = "PROCESS",
    "HYPERV" = "HYPERV",
}

export enum Service_Spec_TaskTemplate_RestartPolicy_Condition {
    "NONE" = "NONE",
    "ON_FAILURE" = "ON_FAILURE",
    "ANY" = "ANY",
}

export enum Service_Spec_UpdateConfig_FailureAction {
    "CONTINUE" = "CONTINUE",
    "PAUSE" = "PAUSE",
    "ROLLBACK" = "ROLLBACK",
}

export enum Service_Spec_UpdateConfig_Order {
    "STOP_FIRST" = "STOP_FIRST",
    "START_FIRST" = "START_FIRST",
}

export enum Service_Spec_RollbackConfig_FailureAction {
    "CONTINUE" = "CONTINUE",
    "PAUSE" = "PAUSE",
}

export enum Service_Spec_RollbackConfig_Order {
    "STOP_FIRST" = "STOP_FIRST",
    "START_FIRST" = "START_FIRST",
}

export enum Service_Spec_EndpointSpec_Mode {
    "VIP" = "VIP",
    "DNSRR" = "DNSRR",
}

export enum Service_Spec_EndpointSpec_Ports_Ports_Protocol {
    "TCP" = "TCP",
    "UDP" = "UDP",
    "SCTP" = "SCTP",
}

export enum Service_Spec_EndpointSpec_Ports_Ports_PublishMode {
    "INGRESS" = "INGRESS",
    "HOST" = "HOST",
}

export enum Service_Endpoint_Spec_Mode {
    "VIP" = "VIP",
    "DNSRR" = "DNSRR",
}

export enum Service_Endpoint_Spec_Ports_Ports_Protocol {
    "TCP" = "TCP",
    "UDP" = "UDP",
    "SCTP" = "SCTP",
}

export enum Service_Endpoint_Spec_Ports_Ports_PublishMode {
    "INGRESS" = "INGRESS",
    "HOST" = "HOST",
}

export enum Service_Endpoint_Ports_Ports_Protocol {
    "TCP" = "TCP",
    "UDP" = "UDP",
    "SCTP" = "SCTP",
}

export enum Service_Endpoint_Ports_Ports_PublishMode {
    "INGRESS" = "INGRESS",
    "HOST" = "HOST",
}

export enum Service_UpdateStatus_State {
    "UPDATING" = "UPDATING",
    "PAUSED" = "PAUSED",
    "COMPLETED" = "COMPLETED",
}

export enum ContainerSummary_Ports_Ports_Type {
    "TCP" = "TCP",
    "UDP" = "UDP",
    "SCTP" = "SCTP",
}

export enum ContainerSummary_Mounts_Mounts_Type {
    "BIND" = "BIND",
    "VOLUME" = "VOLUME",
    "TMPFS" = "TMPFS",
    "NPIPE" = "NPIPE",
    "CLUSTER" = "CLUSTER",
}

export enum ContainerState_Status {
    "CREATED" = "CREATED",
    "RUNNING" = "RUNNING",
    "PAUSED" = "PAUSED",
    "RESTARTING" = "RESTARTING",
    "REMOVING" = "REMOVING",
    "EXITED" = "EXITED",
    "DEAD" = "DEAD",
}

export enum ContainerState_Health_Status {
    "NONE" = "NONE",
    "STARTING" = "STARTING",
    "HEALTHY" = "HEALTHY",
    "UNHEALTHY" = "UNHEALTHY",
}

export enum SystemInfo_CgroupDriver {
    "CGROUPFS" = "CGROUPFS",
    "SYSTEMD" = "SYSTEMD",
    "NONE" = "NONE",
}

export enum SystemInfo_CgroupVersion {
    "ONE" = "ONE",
    "TWO" = "TWO",
}

export enum SystemInfo_Swarm_LocalNodeState {
    "NONE" = "NONE",
    "INACTIVE" = "INACTIVE",
    "PENDING" = "PENDING",
    "ACTIVE" = "ACTIVE",
    "ERROR" = "ERROR",
    "LOCKED" = "LOCKED",
}

export enum SystemInfo_Swarm_Cluster_Spec_CAConfig_ExternalCAs_ExternalCAs_Protocol {
    "CFSSL" = "CFSSL",
}

export enum SystemInfo_Isolation {
    "DEFAULT" = "DEFAULT",
    "HYPERV" = "HYPERV",
    "PROCESS" = "PROCESS",
}

export enum SwarmInfo_LocalNodeState {
    "NONE" = "NONE",
    "INACTIVE" = "INACTIVE",
    "PENDING" = "PENDING",
    "ACTIVE" = "ACTIVE",
    "ERROR" = "ERROR",
    "LOCKED" = "LOCKED",
}

export enum SwarmInfo_Cluster_Spec_CAConfig_ExternalCAs_ExternalCAs_Protocol {
    "CFSSL" = "CFSSL",
}

export enum LocalNodeState {
    "NONE" = "NONE",
    "INACTIVE" = "INACTIVE",
    "PENDING" = "PENDING",
    "ACTIVE" = "ACTIVE",
    "ERROR" = "ERROR",
    "LOCKED" = "LOCKED",
}

export enum EventMessage_Type {
    "BUILDER" = "BUILDER",
    "CONFIG" = "CONFIG",
    "CONTAINER" = "CONTAINER",
    "DAEMON" = "DAEMON",
    "IMAGE" = "IMAGE",
    "NETWORK" = "NETWORK",
    "NODE" = "NODE",
    "PLUGIN" = "PLUGIN",
    "SECRET" = "SECRET",
    "SERVICE" = "SERVICE",
    "VOLUME" = "VOLUME",
}

export enum EventMessage_scope {
    "LOCAL" = "LOCAL",
    "SWARM" = "SWARM",
}

export enum ClusterVolume_Spec_AccessMode_Scope {
    "SINGLE" = "SINGLE",
    "MULTI" = "MULTI",
}

export enum ClusterVolume_Spec_AccessMode_Sharing {
    "NONE" = "NONE",
    "READONLY" = "READONLY",
    "ONEWRITER" = "ONEWRITER",
    "ALL" = "ALL",
}

export enum ClusterVolume_Spec_AccessMode_Availability {
    "ACTIVE" = "ACTIVE",
    "PAUSE" = "PAUSE",
    "DRAIN" = "DRAIN",
}

export enum ClusterVolume_PublishStatus_PublishStatus_State {
    "PENDING_PUBLISH" = "PENDING_PUBLISH",
    "PUBLISHED" = "PUBLISHED",
    "PENDING_NODE_UNPUBLISH" = "PENDING_NODE_UNPUBLISH",
    "PENDING_CONTROLLER_UNPUBLISH" = "PENDING_CONTROLLER_UNPUBLISH",
}

export enum ClusterVolumeSpec_AccessMode_Scope {
    "SINGLE" = "SINGLE",
    "MULTI" = "MULTI",
}

export enum ClusterVolumeSpec_AccessMode_Sharing {
    "NONE" = "NONE",
    "READONLY" = "READONLY",
    "ONEWRITER" = "ONEWRITER",
    "ALL" = "ALL",
}

export enum ClusterVolumeSpec_AccessMode_Availability {
    "ACTIVE" = "ACTIVE",
    "PAUSE" = "PAUSE",
    "DRAIN" = "DRAIN",
}

export class Port extends Schema.Class<Port>()({
    /** Host IP address that the container's port is mapped to */
    IP: Schema.optional(Schema.string),

    /** Port on the container */
    PrivatePort: Schema.number,

    /** Port exposed on the host */
    PublicPort: Schema.optional(Schema.number),
    Type: Schema.enums(Port_Type),
}) {}

export class MountPoint extends Schema.Class<MountPoint>()({
    /**
     * The mount type:
     *
     * - `bind` a mount of a file or directory from the host into the container.
     * - `volume` a docker volume with the given `Name`.
     * - `tmpfs` a `tmpfs`.
     * - `npipe` a named pipe from the host into the container.
     * - `cluster` a Swarm cluster volume
     */
    Type: Schema.enums(MountPoint_Type),

    /**
     * Name is the name reference to the underlying data defined by `Source`
     * e.g., the volume name.
     */
    Name: Schema.optional(Schema.string),

    /**
     * Source location of the mount.
     *
     * For volumes, this contains the storage location of the volume (within
     * `/var/lib/docker/volumes/`). For bind-mounts, and `npipe`, this contains
     * the source (host) part of the bind-mount. For `tmpfs` mount points, this
     * field is empty.
     */
    Source: Schema.optional(Schema.string),

    /**
     * Destination is the path relative to the container root (`/`) where the
     * `Source` is mounted inside the container.
     */
    Destination: Schema.optional(Schema.string),

    /**
     * Driver is the volume driver used to create the volume (if it is a
     * volume).
     */
    Driver: Schema.optional(Schema.string),

    /**
     * Mode is a comma separated list of options supplied by the user when
     * creating the bind/volume mount.
     *
     * The default is platform-specific (`"z"` on Linux, empty on Windows).
     */
    Mode: Schema.optional(Schema.string),

    /** Whether the mount is mounted writable (read-write). */
    RW: Schema.optional(Schema.boolean),

    /**
     * Propagation describes how mounts are propagated from the host into the
     * mount point, and vice-versa. Refer to the [Linux kernel
     * documentation](https://www.kernel.org/doc/Documentation/filesystems/sharedsubtree.txt)
     * for details. This field is not used on Windows.
     */
    Propagation: Schema.optional(Schema.string),
}) {}

export class DeviceMapping extends Schema.Class<DeviceMapping>()({
    PathOnHost: Schema.optional(Schema.string),
    PathInContainer: Schema.optional(Schema.string),
    CgroupPermissions: Schema.optional(Schema.string),
}) {}

export class DeviceRequest extends Schema.Class<DeviceRequest>()({
    Driver: Schema.optional(Schema.string),
    Count: Schema.optional(Schema.number),
    DeviceIDs: Schema.optional(Schema.array(Schema.string)),

    /** A list of capabilities; an OR list of AND lists of capabilities. */
    Capabilities: Schema.optional(Schema.array(Schema.array(Schema.string))),

    /**
     * Driver-specific options, specified as a key/value pairs. These options
     * are passed directly to the driver.
     */
    Options: Schema.optional(Schema.struct({})),
}) {}

export class ThrottleDevice extends Schema.Class<ThrottleDevice>()({
    /** Device path */
    Path: Schema.optional(Schema.string),

    /** Rate */
    Rate: Schema.optional(Schema.number),
}) {}

export class Mount extends Schema.Class<Mount>()({
    /** Container path. */
    Target: Schema.optional(Schema.string),

    /** Mount source (e.g. a volume name, a host path). */
    Source: Schema.optional(Schema.string),

    /**
     * The mount type. Available types:
     *
     * - `bind` Mounts a file or directory from the host into the container. Must
     *   exist prior to creating the container.
     * - `volume` Creates a volume with the given name and options (or uses a
     *   pre-existing volume with the same name and options). These are **not**
     *   removed when the container is removed.
     * - `tmpfs` Create a tmpfs with the given options. The mount source cannot be
     *   specified for tmpfs.
     * - `npipe` Mounts a named pipe from the host into the container. Must exist
     *   prior to creating the container.
     * - `cluster` a Swarm cluster volume
     */
    Type: Schema.enums(Mount_Type),

    /** Whether the mount should be read-only. */
    ReadOnly: Schema.optional(Schema.boolean),

    /**
     * The consistency requirement for the mount: `default`, `consistent`,
     * `cached`, or `delegated`.
     */
    Consistency: Schema.optional(Schema.string),

    /** Optional configuration for the `bind` type. */
    BindOptions: Schema.optional(
        Schema.struct({
            /**
             * A propagation mode with the value `[r]private`, `[r]shared`, or
             * `[r]slave`.
             */
            Propagation: Schema.enums(Mount_BindOptions_Propagation),

            /** Disable recursive bind mount. */
            NonRecursive: Schema.optional(Schema.boolean),

            /** Create mount point on host if missing */
            CreateMountpoint: Schema.optional(Schema.boolean),

            /**
             * Make the mount non-recursively read-only, but still leave the
             * mount recursive (unless NonRecursive is set to true in
             * conjunction).
             */
            ReadOnlyNonRecursive: Schema.optional(Schema.boolean),

            /** Raise an error if the mount cannot be made recursively read-only. */
            ReadOnlyForceRecursive: Schema.optional(Schema.boolean),
        })
    ),

    /** Optional configuration for the `volume` type. */
    VolumeOptions: Schema.optional(
        Schema.struct({
            /** Populate volume with data from the target. */
            NoCopy: Schema.optional(Schema.boolean),

            /** User-defined key/value metadata. */
            Labels: Schema.optional(Schema.struct({})),

            /** Map of driver specific options */
            DriverConfig: Schema.optional(
                Schema.struct({
                    /** Name of the driver to use to create the volume. */
                    Name: Schema.optional(Schema.string),

                    /** Key/value map of driver specific options. */
                    Options: Schema.optional(Schema.struct({})),
                })
            ),
        })
    ),

    /** Optional configuration for the `tmpfs` type. */
    TmpfsOptions: Schema.optional(
        Schema.struct({
            /** The size for the tmpfs mount in bytes. */
            SizeBytes: Schema.optional(Schema.number),

            /** The permission mode for the tmpfs mount in an integer. */
            Mode: Schema.optional(Schema.number),
        })
    ),
}) {}

export class RestartPolicy extends Schema.Class<RestartPolicy>()({
    /**
     * - Empty string means not to restart
     * - `no` Do not automatically restart
     * - `always` Always restart
     * - `unless-stopped` Restart always except when the user has manually stopped
     *   the container
     * - `on-failure` Restart only when the container exit code is non-zero
     */
    Name: Schema.enums(RestartPolicy_Name),

    /** If `on-failure` is used, the number of times to retry before giving up. */
    MaximumRetryCount: Schema.optional(Schema.number),
}) {}

export class Resources extends Schema.Class<Resources>()({
    /**
     * An integer value representing this container's relative CPU weight versus
     * other containers.
     */
    CpuShares: Schema.optional(Schema.number),

    /** Memory limit in bytes. */
    Memory: Schema.optional(Schema.number),

    /**
     * Path to `cgroups` under which the container's `cgroup` is created. If the
     * path is not absolute, the path is considered to be relative to the
     * `cgroups` path of the init process. Cgroups are created if they do not
     * already exist.
     */
    CgroupParent: Schema.optional(Schema.string),

    /** Block IO weight (relative weight). */
    BlkioWeight: Schema.optional(Schema.number),

    /**
     * Block IO weight (relative device weight) in the form:
     *
     *     [{ Path: "device_path", Weight: weight }];
     */
    BlkioWeightDevice: Schema.optional(
        Schema.array(Schema.struct({ Path: Schema.optional(Schema.string), Weight: Schema.optional(Schema.number) }))
    ),

    /**
     * Limit read rate (bytes per second) from a device, in the form:
     *
     *     [{ Path: "device_path", Rate: rate }];
     */
    BlkioDeviceReadBps: Schema.optional(
        Schema.array(
            Schema.struct({
                /** Device path */
                Path: Schema.optional(Schema.string),

                /** Rate */
                Rate: Schema.optional(Schema.number),
            })
        )
    ),

    /**
     * Limit write rate (bytes per second) to a device, in the form:
     *
     *     [{ Path: "device_path", Rate: rate }];
     */
    BlkioDeviceWriteBps: Schema.optional(
        Schema.array(
            Schema.struct({
                /** Device path */
                Path: Schema.optional(Schema.string),

                /** Rate */
                Rate: Schema.optional(Schema.number),
            })
        )
    ),

    /**
     * Limit read rate (IO per second) from a device, in the form:
     *
     *     [{ Path: "device_path", Rate: rate }];
     */
    BlkioDeviceReadIOps: Schema.optional(
        Schema.array(
            Schema.struct({
                /** Device path */
                Path: Schema.optional(Schema.string),

                /** Rate */
                Rate: Schema.optional(Schema.number),
            })
        )
    ),

    /**
     * Limit write rate (IO per second) to a device, in the form:
     *
     *     [{ Path: "device_path", Rate: rate }];
     */
    BlkioDeviceWriteIOps: Schema.optional(
        Schema.array(
            Schema.struct({
                /** Device path */
                Path: Schema.optional(Schema.string),

                /** Rate */
                Rate: Schema.optional(Schema.number),
            })
        )
    ),

    /** The length of a CPU period in microseconds. */
    CpuPeriod: Schema.optional(Schema.number),

    /** Microseconds of CPU time that the container can get in a CPU period. */
    CpuQuota: Schema.optional(Schema.number),

    /**
     * The length of a CPU real-time period in microseconds. Set to 0 to
     * allocate no time allocated to real-time tasks.
     */
    CpuRealtimePeriod: Schema.optional(Schema.number),

    /**
     * The length of a CPU real-time runtime in microseconds. Set to 0 to
     * allocate no time allocated to real-time tasks.
     */
    CpuRealtimeRuntime: Schema.optional(Schema.number),

    /** CPUs in which to allow execution (e.g., `0-3`, `0,1`). */
    CpusetCpus: Schema.optional(Schema.string),

    /**
     * Memory nodes (MEMs) in which to allow execution (0-3, 0,1). Only
     * effective on NUMA systems.
     */
    CpusetMems: Schema.optional(Schema.string),

    /** A list of devices to add to the container. */
    Devices: Schema.optional(
        Schema.array(
            Schema.struct({
                PathOnHost: Schema.optional(Schema.string),
                PathInContainer: Schema.optional(Schema.string),
                CgroupPermissions: Schema.optional(Schema.string),
            })
        )
    ),

    /** A list of cgroup rules to apply to the container */
    DeviceCgroupRules: Schema.optional(Schema.array(Schema.string)),

    /** A list of requests for devices to be sent to device drivers. */
    DeviceRequests: Schema.optional(
        Schema.array(
            Schema.struct({
                Driver: Schema.optional(Schema.string),
                Count: Schema.optional(Schema.number),
                DeviceIDs: Schema.optional(Schema.array(Schema.string)),

                /**
                 * A list of capabilities; an OR list of AND lists of
                 * capabilities.
                 */
                Capabilities: Schema.optional(Schema.array(Schema.array(Schema.string))),

                /**
                 * Driver-specific options, specified as a key/value pairs.
                 * These options are passed directly to the driver.
                 */
                Options: Schema.optional(Schema.struct({})),
            })
        )
    ),

    /**
     * Hard limit for kernel TCP buffer memory (in bytes). Depending on the OCI
     * runtime in use, this option may be ignored. It is no longer supported by
     * the default (runc) runtime.
     *
     * This field is omitted when empty.
     */
    KernelMemoryTCP: Schema.optional(Schema.number),

    /** Memory soft limit in bytes. */
    MemoryReservation: Schema.optional(Schema.number),

    /** Total memory limit (memory + swap). Set as `-1` to enable unlimited swap. */
    MemorySwap: Schema.optional(Schema.number),

    /**
     * Tune a container's memory swappiness behavior. Accepts an integer between
     * 0 and 100.
     */
    MemorySwappiness: Schema.optional(Schema.number),

    /** CPU quota in units of 10<sup>-9</sup> CPUs. */
    NanoCpus: Schema.optional(Schema.number),

    /** Disable OOM Killer for the container. */
    OomKillDisable: Schema.optional(Schema.boolean),

    /**
     * Run an init inside the container that forwards signals and reaps
     * processes. This field is omitted if empty, and the default (as configured
     * on the daemon) is used.
     */
    Init: Schema.optional(Schema.nullable(Schema.boolean)),

    /**
     * Tune a container's PIDs limit. Set `0` or `-1` for unlimited, or `null`
     * to not change.
     */
    PidsLimit: Schema.optional(Schema.nullable(Schema.number)),

    /**
     * A list of resource limits to set in the container. For example:
     *
     *     { "Name": "nofile", "Soft": 1024, "Hard": 2048 }
     */
    Ulimits: Schema.optional(
        Schema.array(
            Schema.struct({
                /** Name of ulimit */
                Name: Schema.optional(Schema.string),

                /** Soft limit */
                Soft: Schema.optional(Schema.number),

                /** Hard limit */
                Hard: Schema.optional(Schema.number),
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
    CpuCount: Schema.optional(Schema.number),

    /**
     * The usable percentage of the available CPUs (Windows only).
     *
     * On Windows Server containers, the processor resource controls are
     * mutually exclusive. The order of precedence is `CPUCount` first, then
     * `CPUShares`, and `CPUPercent` last.
     */
    CpuPercent: Schema.optional(Schema.number),

    /** Maximum IOps for the container system drive (Windows only) */
    IOMaximumIOps: Schema.optional(Schema.number),

    /**
     * Maximum IO in bytes per second for the container system drive (Windows
     * only).
     */
    IOMaximumBandwidth: Schema.optional(Schema.number),
}) {}

export class Limit extends Schema.Class<Limit>()({
    NanoCPUs: Schema.optional(Schema.number),
    MemoryBytes: Schema.optional(Schema.number),

    /**
     * Limits the maximum number of PIDs in the container. Set `0` for
     * unlimited.
     */
    Pids: Schema.optional(Schema.number),
}) {}

export class ResourceObject extends Schema.Class<ResourceObject>()({
    NanoCPUs: Schema.optional(Schema.number),
    MemoryBytes: Schema.optional(Schema.number),

    /**
     * User-defined resources can be either Integer resources (e.g, `SSD=3`) or
     * String resources (e.g, `GPU=UUID1`).
     */
    GenericResources: Schema.optional(
        Schema.array(
            Schema.struct({
                NamedResourceSpec: Schema.optional(
                    Schema.struct({ Kind: Schema.optional(Schema.string), Value: Schema.optional(Schema.string) })
                ),
                DiscreteResourceSpec: Schema.optional(
                    Schema.struct({ Kind: Schema.optional(Schema.string), Value: Schema.optional(Schema.number) })
                ),
            })
        )
    ),
}) {}

Schema.optional(
    Schema.array(
        Schema.struct({
            NamedResourceSpec: Schema.optional(
                Schema.struct({ Kind: Schema.optional(Schema.string), Value: Schema.optional(Schema.string) })
            ),
            DiscreteResourceSpec: Schema.optional(
                Schema.struct({ Kind: Schema.optional(Schema.string), Value: Schema.optional(Schema.number) })
            ),
        })
    )
);

export class HealthConfig extends Schema.Class<HealthConfig>()({
    /**
     * The test to perform. Possible values are:
     *
     * - `[]` inherit healthcheck from image or parent image
     * - `["NONE"]` disable healthcheck
     * - `["CMD", args...]` exec arguments directly
     * - `["CMD-SHELL", command]` run command with system's default shell
     */
    Test: Schema.optional(Schema.array(Schema.string)),

    /**
     * The time to wait between checks in nanoseconds. It should be 0 or at
     * least 1000000 (1 ms). 0 means inherit.
     */
    Interval: Schema.optional(Schema.number),

    /**
     * The time to wait before considering the check to have hung. It should be
     * 0 or at least 1000000 (1 ms). 0 means inherit.
     */
    Timeout: Schema.optional(Schema.number),

    /**
     * The number of consecutive failures needed to consider a container as
     * unhealthy. 0 means inherit.
     */
    Retries: Schema.optional(Schema.number),

    /**
     * Start period for the container to initialize before starting
     * health-retries countdown in nanoseconds. It should be 0 or at least
     * 1000000 (1 ms). 0 means inherit.
     */
    StartPeriod: Schema.optional(Schema.number),

    /**
     * The time to wait between checks in nanoseconds during the start period.
     * It should be 0 or at least 1000000 (1 ms). 0 means inherit.
     */
    StartInterval: Schema.optional(Schema.number),
}) {}

export class Health extends Schema.Class<Health>()({
    /**
     * Status is one of `none`, `starting`, `healthy` or `unhealthy`
     *
     * - "none" Indicates there is no healthcheck
     * - "starting" Starting indicates that the container is not yet ready
     * - "healthy" Healthy indicates that the container is running correctly
     * - "unhealthy" Unhealthy indicates that the container has a problem
     */
    Status: Schema.enums(Health_Status),

    /** FailingStreak is the number of consecutive failures */
    FailingStreak: Schema.optional(Schema.number),

    /** Log contains the last few results (oldest first) */
    Log: Schema.optional(
        Schema.array(
            Schema.nullable(
                Schema.struct({
                    /**
                     * Date and time at which this check started in [RFC
                     * 3339](https://www.ietf.org/rfc/rfc3339.txt) format with
                     * nano-seconds.
                     */
                    Start: Schema.optional(Schema.string),

                    /**
                     * Date and time at which this check ended in [RFC
                     * 3339](https://www.ietf.org/rfc/rfc3339.txt) format with
                     * nano-seconds.
                     */
                    End: Schema.optional(Schema.string),

                    /**
                     * ExitCode meanings:
                     *
                     * - `0` healthy
                     * - `1` unhealthy
                     * - `2` reserved (considered unhealthy)
                     * - Other values: error running probe
                     */
                    ExitCode: Schema.optional(Schema.number),

                    /** Output from last check */
                    Output: Schema.optional(Schema.string),
                })
            )
        )
    ),
}) {}

export class HealthcheckResult extends Schema.Class<HealthcheckResult>()({
    /**
     * Date and time at which this check started in [RFC
     * 3339](https://www.ietf.org/rfc/rfc3339.txt) format with nano-seconds.
     */
    Start: Schema.optional(Schema.string),

    /**
     * Date and time at which this check ended in [RFC
     * 3339](https://www.ietf.org/rfc/rfc3339.txt) format with nano-seconds.
     */
    End: Schema.optional(Schema.string),

    /**
     * ExitCode meanings:
     *
     * - `0` healthy
     * - `1` unhealthy
     * - `2` reserved (considered unhealthy)
     * - Other values: error running probe
     */
    ExitCode: Schema.optional(Schema.number),

    /** Output from last check */
    Output: Schema.optional(Schema.string),
}) {}

export class HostConfig extends HostConfig_1.extend<HostConfig>()({}) {}

export class ContainerConfig extends Schema.Class<ContainerConfig>()({
    /** The hostname to use for the container, as a valid RFC 1123 hostname. */
    Hostname: Schema.optional(Schema.string),

    /** The domain name to use for the container. */
    Domainname: Schema.optional(Schema.string),

    /** The user that commands are run as inside the container. */
    User: Schema.optional(Schema.string),

    /** Whether to attach to `stdin`. */
    AttachStdin: Schema.optional(Schema.boolean),

    /** Whether to attach to `stdout`. */
    AttachStdout: Schema.optional(Schema.boolean).withDefault(() => true),

    /** Whether to attach to `stderr`. */
    AttachStderr: Schema.optional(Schema.boolean).withDefault(() => true),

    /**
     * An object mapping ports to an empty object in the form:
     *
     * `{"<port>/<tcp|udp|sctp>": {}}`
     */
    ExposedPorts: Schema.optional(Schema.nullable(Schema.struct({}))),

    /** Attach standard streams to a TTY, including `stdin` if it is not closed. */
    Tty: Schema.optional(Schema.boolean),

    /** Open `stdin` */
    OpenStdin: Schema.optional(Schema.boolean),

    /** Close `stdin` after one attached client disconnects */
    StdinOnce: Schema.optional(Schema.boolean),

    /**
     * A list of environment variables to set inside the container in the form
     * `["VAR=value", ...]`. A variable without `=` is removed from the
     * environment, rather than to have an empty value.
     */
    Env: Schema.optional(Schema.array(Schema.string)),

    /** Command to run specified as a string or an array of strings. */
    Cmd: Schema.optional(Schema.array(Schema.string)),

    /** A test to perform to check that the container is healthy. */
    Healthcheck: Schema.optional(
        Schema.struct({
            /**
             * The test to perform. Possible values are:
             *
             * - `[]` inherit healthcheck from image or parent image
             * - `["NONE"]` disable healthcheck
             * - `["CMD", args...]` exec arguments directly
             * - `["CMD-SHELL", command]` run command with system's default shell
             */
            Test: Schema.optional(Schema.array(Schema.string)),

            /**
             * The time to wait between checks in nanoseconds. It should be 0 or
             * at least 1000000 (1 ms). 0 means inherit.
             */
            Interval: Schema.optional(Schema.number),

            /**
             * The time to wait before considering the check to have hung. It
             * should be 0 or at least 1000000 (1 ms). 0 means inherit.
             */
            Timeout: Schema.optional(Schema.number),

            /**
             * The number of consecutive failures needed to consider a container
             * as unhealthy. 0 means inherit.
             */
            Retries: Schema.optional(Schema.number),

            /**
             * Start period for the container to initialize before starting
             * health-retries countdown in nanoseconds. It should be 0 or at
             * least 1000000 (1 ms). 0 means inherit.
             */
            StartPeriod: Schema.optional(Schema.number),

            /**
             * The time to wait between checks in nanoseconds during the start
             * period. It should be 0 or at least 1000000 (1 ms). 0 means
             * inherit.
             */
            StartInterval: Schema.optional(Schema.number),
        })
    ),

    /** Command is already escaped (Windows only) */
    ArgsEscaped: Schema.optional(Schema.nullable(Schema.boolean)),

    /**
     * The name (or reference) of the image to use when creating the container,
     * or which was used when the container was created.
     */
    Image: Schema.optional(Schema.string),

    /**
     * An object mapping mount point paths inside the container to empty
     * objects.
     */
    Volumes: Schema.optional(Schema.struct({})),

    /** The working directory for commands to run in. */
    WorkingDir: Schema.optional(Schema.string),

    /**
     * The entry point for the container as a string or an array of strings.
     *
     * If the array consists of exactly one empty string (`[""]`) then the entry
     * point is reset to system default (i.e., the entry point used by docker
     * when there is no `ENTRYPOINT` instruction in the `Dockerfile`).
     */
    Entrypoint: Schema.optional(Schema.array(Schema.string)),

    /** Disable networking for the container. */
    NetworkDisabled: Schema.optional(Schema.nullable(Schema.boolean)),

    /**
     * MAC address of the container.
     *
     * Deprecated: this field is deprecated in API v1.44 and up. Use
     * EndpointSettings.MacAddress instead.
     */
    MacAddress: Schema.optional(Schema.nullable(Schema.string)),

    /** `ONBUILD` metadata that were defined in the image's `Dockerfile`. */
    OnBuild: Schema.optional(Schema.nullable(Schema.array(Schema.string))),

    /** User-defined key/value metadata. */
    Labels: Schema.optional(Schema.struct({})),

    /** Signal to stop a container as a string or unsigned integer. */
    StopSignal: Schema.optional(Schema.nullable(Schema.string)),

    /** Timeout to stop a container in seconds. */
    StopTimeout: Schema.optional(Schema.nullable(Schema.number)).withDefault(() => 10),

    /** Shell for when `RUN`, `CMD`, and `ENTRYPOINT` uses a shell. */
    Shell: Schema.optional(Schema.nullable(Schema.array(Schema.string))),
}) {}

export class NetworkingConfig extends Schema.Class<NetworkingConfig>()({
    /**
     * A mapping of network name to endpoint configuration for that network. The
     * endpoint configuration can be left empty to connect to that network with
     * no particular endpoint configuration.
     */
    EndpointsConfig: Schema.optional(Schema.struct({})),
}) {}

export class NetworkSettings extends Schema.Class<NetworkSettings>()({
    /** Name of the network's bridge (for example, `docker0`). */
    Bridge: Schema.optional(Schema.string),

    /** SandboxID uniquely represents a container's network stack. */
    SandboxID: Schema.optional(Schema.string),

    /** Indicates if hairpin NAT should be enabled on the virtual interface. */
    HairpinMode: Schema.optional(Schema.boolean),

    /** IPv6 unicast address using the link-local prefix. */
    LinkLocalIPv6Address: Schema.optional(Schema.string),

    /** Prefix length of the IPv6 unicast address. */
    LinkLocalIPv6PrefixLen: Schema.optional(Schema.number),

    /**
     * PortMap describes the mapping of container ports to host ports, using the
     * container's port-number and protocol as key in the format
     * `<port>/<protocol>`, for example, `80/udp`.
     *
     * If a container's port is mapped for multiple protocols, separate entries
     * are added to the mapping table.
     */
    Ports: Schema.optional(Schema.struct({})),

    /** SandboxKey identifies the sandbox */
    SandboxKey: Schema.optional(Schema.string),
    SecondaryIPAddresses: Schema.optional(
        Schema.nullable(
            Schema.array(
                Schema.struct({
                    /** IP address. */
                    Addr: Schema.optional(Schema.string),

                    /** Mask length of the IP address. */
                    PrefixLen: Schema.optional(Schema.number),
                })
            )
        )
    ),
    SecondaryIPv6Addresses: Schema.optional(
        Schema.nullable(
            Schema.array(
                Schema.struct({
                    /** IP address. */
                    Addr: Schema.optional(Schema.string),

                    /** Mask length of the IP address. */
                    PrefixLen: Schema.optional(Schema.number),
                })
            )
        )
    ),

    /**
     * EndpointID uniquely represents a service endpoint in a Sandbox.<p><br
     * /></p>> **Deprecated**: This field is only propagated when attached> To
     * the default "bridge" network. Use the information from the "bridge">
     * Network inside the `Networks` map instead, which contains the same>
     * Information. This field was deprecated in Docker 1.9 and is scheduled to>
     * Be removed in Docker 17.12.0
     */
    EndpointID: Schema.optional(Schema.string),

    /**
     * Gateway address for the default "bridge" network.<p><br /></p>>
     * **Deprecated**: This field is only propagated when attached> To the
     * default "bridge" network. Use the information from the "bridge"> Network
     * inside the `Networks` map instead, which contains the same> Information.
     * This field was deprecated in Docker 1.9 and is scheduled to> Be removed
     * in Docker 17.12.0
     */
    Gateway: Schema.optional(Schema.string),

    /**
     * Global IPv6 address for the default "bridge" network.<p><br /></p>>
     * **Deprecated**: This field is only propagated when attached> To the
     * default "bridge" network. Use the information from the "bridge"> Network
     * inside the `Networks` map instead, which contains the same> Information.
     * This field was deprecated in Docker 1.9 and is scheduled to> Be removed
     * in Docker 17.12.0
     */
    GlobalIPv6Address: Schema.optional(Schema.string),

    /**
     * Mask length of the global IPv6 address.<p><br /></p>> **Deprecated**:
     * This field is only propagated when attached> To the default "bridge"
     * network. Use the information from the "bridge"> Network inside the
     * `Networks` map instead, which contains the same> Information. This field
     * was deprecated in Docker 1.9 and is scheduled to> Be removed in Docker
     * 17.12.0
     */
    GlobalIPv6PrefixLen: Schema.optional(Schema.number),

    /**
     * IPv4 address for the default "bridge" network.<p><br /></p>>
     * **Deprecated**: This field is only propagated when attached> To the
     * default "bridge" network. Use the information from the "bridge"> Network
     * inside the `Networks` map instead, which contains the same> Information.
     * This field was deprecated in Docker 1.9 and is scheduled to> Be removed
     * in Docker 17.12.0
     */
    IPAddress: Schema.optional(Schema.string),

    /**
     * Mask length of the IPv4 address.<p><br /></p>> **Deprecated**: This field
     * is only propagated when attached> To the default "bridge" network. Use
     * the information from the "bridge"> Network inside the `Networks` map
     * instead, which contains the same> Information. This field was deprecated
     * in Docker 1.9 and is scheduled to> Be removed in Docker 17.12.0
     */
    IPPrefixLen: Schema.optional(Schema.number),

    /**
     * IPv6 gateway address for this network.<p><br /></p>> **Deprecated**: This
     * field is only propagated when attached> To the default "bridge" network.
     * Use the information from the "bridge"> Network inside the `Networks` map
     * instead, which contains the same> Information. This field was deprecated
     * in Docker 1.9 and is scheduled to> Be removed in Docker 17.12.0
     */
    IPv6Gateway: Schema.optional(Schema.string),

    /**
     * MAC address for the container on the default "bridge" network.<p><br
     * /></p>> **Deprecated**: This field is only propagated when attached> To
     * the default "bridge" network. Use the information from the "bridge">
     * Network inside the `Networks` map instead, which contains the same>
     * Information. This field was deprecated in Docker 1.9 and is scheduled to>
     * Be removed in Docker 17.12.0
     */
    MacAddress: Schema.optional(Schema.string),

    /** Information about all networks that the container is connected to. */
    Networks: Schema.optional(Schema.struct({})),
}) {}

export class Address extends Schema.Class<Address>()({
    /** IP address. */
    Addr: Schema.optional(Schema.string),

    /** Mask length of the IP address. */
    PrefixLen: Schema.optional(Schema.number),
}) {}

export class PortMap extends Schema.Class<PortMap>()({}) {}

export class PortBinding extends Schema.Class<PortBinding>()({
    /** Host IP address that the container's port is mapped to. */
    HostIp: Schema.optional(Schema.string),

    /** Host port number that the container's port is mapped to. */
    HostPort: Schema.optional(Schema.string),
}) {}

export class GraphDriverData extends Schema.Class<GraphDriverData>()({
    /** Name of the storage driver. */
    Name: Schema.string,

    /**
     * Low-level storage metadata, provided as key/value pairs.
     *
     * This information is driver-specific, and depends on the storage-driver in
     * use, and should be used for informational purposes only.
     */
    Data: Schema.struct({}),
}) {}

export class FilesystemChange extends Schema.Class<FilesystemChange>()({
    /** Path to file or directory that has changed. */
    Path: Schema.string,

    /**
     * Kind of change
     *
     * Can be one of:
     *
     * - `0`: Modified ("C")
     * - `1`: Added ("A")
     * - `2`: Deleted ("D")
     */
    Kind: Schema.enums(FilesystemChange_Kind),
}) {}

export class ImageInspect extends Schema.Class<ImageInspect>()({
    /**
     * ID is the content-addressable ID of an image.
     *
     * This identifier is a content-addressable digest calculated from the
     * image's configuration (which includes the digests of layers used by the
     * image).
     *
     * Note that this digest differs from the `RepoDigests` below, which holds
     * digests of image manifests that reference the image.
     */
    Id: Schema.optional(Schema.string),

    /**
     * List of image names/tags in the local image cache that reference this
     * image.
     *
     * Multiple image tags can refer to the same image, and this list may be
     * empty if no tags reference the image, in which case the image is
     * "untagged", in which case it can still be referenced by its ID.
     */
    RepoTags: Schema.optional(Schema.array(Schema.string)),

    /**
     * List of content-addressable digests of locally available image manifests
     * that the image is referenced from. Multiple manifests can refer to the
     * same image.
     *
     * These digests are usually only available if the image was either pulled
     * from a registry, or if the image was pushed to a registry, which is when
     * the manifest is generated and its digest calculated.
     */
    RepoDigests: Schema.optional(Schema.array(Schema.string)),

    /**
     * ID of the parent image.
     *
     * Depending on how the image was created, this field may be empty and is
     * only set for images that were built/created locally. This field is empty
     * if the image was pulled from an image registry.
     */
    Parent: Schema.optional(Schema.string),

    /** Optional message that was set when committing or importing the image. */
    Comment: Schema.optional(Schema.string),

    /**
     * Date and time at which the image was created, formatted in [RFC
     * 3339](https://www.ietf.org/rfc/rfc3339.txt) format with nano-seconds.
     */
    Created: Schema.optional(Schema.string),

    /**
     * The ID of the container that was used to create the image.
     *
     * Depending on how the image was created, this field may be empty.
     *
     * _Deprecated_*: this field is kept for backward compatibility, but will be
     * removed in API v1.45.
     */
    Container: Schema.optional(Schema.string),

    /**
     * **Deprecated**: this field is kept for backward compatibility, but will
     * be removed in API v1.45.
     */
    ContainerConfig: Schema.optional(
        Schema.struct({
            /**
             * The hostname to use for the container, as a valid RFC 1123
             * hostname.
             */
            Hostname: Schema.optional(Schema.string),

            /** The domain name to use for the container. */
            Domainname: Schema.optional(Schema.string),

            /** The user that commands are run as inside the container. */
            User: Schema.optional(Schema.string),

            /** Whether to attach to `stdin`. */
            AttachStdin: Schema.optional(Schema.boolean),

            /** Whether to attach to `stdout`. */
            AttachStdout: Schema.optional(Schema.boolean).withDefault(() => true),

            /** Whether to attach to `stderr`. */
            AttachStderr: Schema.optional(Schema.boolean).withDefault(() => true),

            /**
             * An object mapping ports to an empty object in the form:
             *
             * `{"<port>/<tcp|udp|sctp>": {}}`
             */
            ExposedPorts: Schema.optional(Schema.nullable(Schema.struct({}))),

            /**
             * Attach standard streams to a TTY, including `stdin` if it is not
             * closed.
             */
            Tty: Schema.optional(Schema.boolean),

            /** Open `stdin` */
            OpenStdin: Schema.optional(Schema.boolean),

            /** Close `stdin` after one attached client disconnects */
            StdinOnce: Schema.optional(Schema.boolean),

            /**
             * A list of environment variables to set inside the container in
             * the form `["VAR=value", ...]`. A variable without `=` is removed
             * from the environment, rather than to have an empty value.
             */
            Env: Schema.optional(Schema.array(Schema.string)),

            /** Command to run specified as a string or an array of strings. */
            Cmd: Schema.optional(Schema.array(Schema.string)),

            /** A test to perform to check that the container is healthy. */
            Healthcheck: Schema.optional(
                Schema.struct({
                    /**
                     * The test to perform. Possible values are:
                     *
                     * - `[]` inherit healthcheck from image or parent image
                     * - `["NONE"]` disable healthcheck
                     * - `["CMD", args...]` exec arguments directly
                     * - `["CMD-SHELL", command]` run command with system's
                     *   default shell
                     */
                    Test: Schema.optional(Schema.array(Schema.string)),

                    /**
                     * The time to wait between checks in nanoseconds. It should
                     * be 0 or at least 1000000 (1 ms). 0 means inherit.
                     */
                    Interval: Schema.optional(Schema.number),

                    /**
                     * The time to wait before considering the check to have
                     * hung. It should be 0 or at least 1000000 (1 ms). 0 means
                     * inherit.
                     */
                    Timeout: Schema.optional(Schema.number),

                    /**
                     * The number of consecutive failures needed to consider a
                     * container as unhealthy. 0 means inherit.
                     */
                    Retries: Schema.optional(Schema.number),

                    /**
                     * Start period for the container to initialize before
                     * starting health-retries countdown in nanoseconds. It
                     * should be 0 or at least 1000000 (1 ms). 0 means inherit.
                     */
                    StartPeriod: Schema.optional(Schema.number),

                    /**
                     * The time to wait between checks in nanoseconds during the
                     * start period. It should be 0 or at least 1000000 (1 ms).
                     * 0 means inherit.
                     */
                    StartInterval: Schema.optional(Schema.number),
                })
            ),

            /** Command is already escaped (Windows only) */
            ArgsEscaped: Schema.optional(Schema.nullable(Schema.boolean)),

            /**
             * The name (or reference) of the image to use when creating the
             * container, or which was used when the container was created.
             */
            Image: Schema.optional(Schema.string),

            /**
             * An object mapping mount point paths inside the container to empty
             * objects.
             */
            Volumes: Schema.optional(Schema.struct({})),

            /** The working directory for commands to run in. */
            WorkingDir: Schema.optional(Schema.string),

            /**
             * The entry point for the container as a string or an array of
             * strings.
             *
             * If the array consists of exactly one empty string (`[""]`) then
             * the entry point is reset to system default (i.e., the entry point
             * used by docker when there is no `ENTRYPOINT` instruction in the
             * `Dockerfile`).
             */
            Entrypoint: Schema.optional(Schema.array(Schema.string)),

            /** Disable networking for the container. */
            NetworkDisabled: Schema.optional(Schema.nullable(Schema.boolean)),

            /**
             * MAC address of the container.
             *
             * Deprecated: this field is deprecated in API v1.44 and up. Use
             * EndpointSettings.MacAddress instead.
             */
            MacAddress: Schema.optional(Schema.nullable(Schema.string)),

            /** `ONBUILD` metadata that were defined in the image's `Dockerfile`. */
            OnBuild: Schema.optional(Schema.nullable(Schema.array(Schema.string))),

            /** User-defined key/value metadata. */
            Labels: Schema.optional(Schema.struct({})),

            /** Signal to stop a container as a string or unsigned integer. */
            StopSignal: Schema.optional(Schema.nullable(Schema.string)),

            /** Timeout to stop a container in seconds. */
            StopTimeout: Schema.optional(Schema.nullable(Schema.number)).withDefault(() => 10),

            /** Shell for when `RUN`, `CMD`, and `ENTRYPOINT` uses a shell. */
            Shell: Schema.optional(Schema.nullable(Schema.array(Schema.string))),
        })
    ),

    /**
     * The version of Docker that was used to build the image.
     *
     * Depending on how the image was created, this field may be empty.
     */
    DockerVersion: Schema.optional(Schema.string),

    /**
     * Name of the author that was specified when committing the image, or as
     * specified through MAINTAINER (deprecated) in the Dockerfile.
     */
    Author: Schema.optional(Schema.string),

    /**
     * Configuration for a container that is portable between hosts.
     *
     * When used as `ContainerConfig` field in an image, `ContainerConfig` is an
     * optional field containing the configuration of the container that was
     * last committed when creating the image.
     *
     * Previous versions of Docker builder used this field to store build cache,
     * and it is not in active use anymore.
     */
    Config: Schema.optional(
        Schema.struct({
            /**
             * The hostname to use for the container, as a valid RFC 1123
             * hostname.
             */
            Hostname: Schema.optional(Schema.string),

            /** The domain name to use for the container. */
            Domainname: Schema.optional(Schema.string),

            /** The user that commands are run as inside the container. */
            User: Schema.optional(Schema.string),

            /** Whether to attach to `stdin`. */
            AttachStdin: Schema.optional(Schema.boolean),

            /** Whether to attach to `stdout`. */
            AttachStdout: Schema.optional(Schema.boolean).withDefault(() => true),

            /** Whether to attach to `stderr`. */
            AttachStderr: Schema.optional(Schema.boolean).withDefault(() => true),

            /**
             * An object mapping ports to an empty object in the form:
             *
             * `{"<port>/<tcp|udp|sctp>": {}}`
             */
            ExposedPorts: Schema.optional(Schema.nullable(Schema.struct({}))),

            /**
             * Attach standard streams to a TTY, including `stdin` if it is not
             * closed.
             */
            Tty: Schema.optional(Schema.boolean),

            /** Open `stdin` */
            OpenStdin: Schema.optional(Schema.boolean),

            /** Close `stdin` after one attached client disconnects */
            StdinOnce: Schema.optional(Schema.boolean),

            /**
             * A list of environment variables to set inside the container in
             * the form `["VAR=value", ...]`. A variable without `=` is removed
             * from the environment, rather than to have an empty value.
             */
            Env: Schema.optional(Schema.array(Schema.string)),

            /** Command to run specified as a string or an array of strings. */
            Cmd: Schema.optional(Schema.array(Schema.string)),

            /** A test to perform to check that the container is healthy. */
            Healthcheck: Schema.optional(
                Schema.struct({
                    /**
                     * The test to perform. Possible values are:
                     *
                     * - `[]` inherit healthcheck from image or parent image
                     * - `["NONE"]` disable healthcheck
                     * - `["CMD", args...]` exec arguments directly
                     * - `["CMD-SHELL", command]` run command with system's
                     *   default shell
                     */
                    Test: Schema.optional(Schema.array(Schema.string)),

                    /**
                     * The time to wait between checks in nanoseconds. It should
                     * be 0 or at least 1000000 (1 ms). 0 means inherit.
                     */
                    Interval: Schema.optional(Schema.number),

                    /**
                     * The time to wait before considering the check to have
                     * hung. It should be 0 or at least 1000000 (1 ms). 0 means
                     * inherit.
                     */
                    Timeout: Schema.optional(Schema.number),

                    /**
                     * The number of consecutive failures needed to consider a
                     * container as unhealthy. 0 means inherit.
                     */
                    Retries: Schema.optional(Schema.number),

                    /**
                     * Start period for the container to initialize before
                     * starting health-retries countdown in nanoseconds. It
                     * should be 0 or at least 1000000 (1 ms). 0 means inherit.
                     */
                    StartPeriod: Schema.optional(Schema.number),

                    /**
                     * The time to wait between checks in nanoseconds during the
                     * start period. It should be 0 or at least 1000000 (1 ms).
                     * 0 means inherit.
                     */
                    StartInterval: Schema.optional(Schema.number),
                })
            ),

            /** Command is already escaped (Windows only) */
            ArgsEscaped: Schema.optional(Schema.nullable(Schema.boolean)),

            /**
             * The name (or reference) of the image to use when creating the
             * container, or which was used when the container was created.
             */
            Image: Schema.optional(Schema.string),

            /**
             * An object mapping mount point paths inside the container to empty
             * objects.
             */
            Volumes: Schema.optional(Schema.struct({})),

            /** The working directory for commands to run in. */
            WorkingDir: Schema.optional(Schema.string),

            /**
             * The entry point for the container as a string or an array of
             * strings.
             *
             * If the array consists of exactly one empty string (`[""]`) then
             * the entry point is reset to system default (i.e., the entry point
             * used by docker when there is no `ENTRYPOINT` instruction in the
             * `Dockerfile`).
             */
            Entrypoint: Schema.optional(Schema.array(Schema.string)),

            /** Disable networking for the container. */
            NetworkDisabled: Schema.optional(Schema.nullable(Schema.boolean)),

            /**
             * MAC address of the container.
             *
             * Deprecated: this field is deprecated in API v1.44 and up. Use
             * EndpointSettings.MacAddress instead.
             */
            MacAddress: Schema.optional(Schema.nullable(Schema.string)),

            /** `ONBUILD` metadata that were defined in the image's `Dockerfile`. */
            OnBuild: Schema.optional(Schema.nullable(Schema.array(Schema.string))),

            /** User-defined key/value metadata. */
            Labels: Schema.optional(Schema.struct({})),

            /** Signal to stop a container as a string or unsigned integer. */
            StopSignal: Schema.optional(Schema.nullable(Schema.string)),

            /** Timeout to stop a container in seconds. */
            StopTimeout: Schema.optional(Schema.nullable(Schema.number)).withDefault(() => 10),

            /** Shell for when `RUN`, `CMD`, and `ENTRYPOINT` uses a shell. */
            Shell: Schema.optional(Schema.nullable(Schema.array(Schema.string))),
        })
    ),

    /** Hardware CPU architecture that the image runs on. */
    Architecture: Schema.optional(Schema.string),

    /** CPU architecture variant (presently ARM-only). */
    Variant: Schema.optional(Schema.nullable(Schema.string)),

    /** Operating System the image is built to run on. */
    Os: Schema.optional(Schema.string),

    /**
     * Operating System version the image is built to run on (especially for
     * Windows).
     */
    OsVersion: Schema.optional(Schema.nullable(Schema.string)),

    /** Total size of the image including all layers it is composed of. */
    Size: Schema.optional(Schema.number),

    /**
     * Total size of the image including all layers it is composed of.
     *
     * Deprecated: this field is omitted in API v1.44, but kept for backward
     * compatibility. Use Size instead.
     */
    VirtualSize: Schema.optional(Schema.number),

    /**
     * Information about the storage driver used to store the container's and
     * image's filesystem.
     */
    GraphDriver: Schema.optional(
        Schema.struct({
            /** Name of the storage driver. */
            Name: Schema.string,

            /**
             * Low-level storage metadata, provided as key/value pairs.
             *
             * This information is driver-specific, and depends on the
             * storage-driver in use, and should be used for informational
             * purposes only.
             */
            Data: Schema.struct({}),
        })
    ),

    /** Information about the image's RootFS, including the layer IDs. */
    RootFS: Schema.optional(
        Schema.struct({ Type: Schema.string, Layers: Schema.optional(Schema.array(Schema.string)) })
    ),

    /**
     * Additional metadata of the image in the local cache. This information is
     * local to the daemon, and not part of the image itself.
     */
    Metadata: Schema.optional(
        Schema.struct({
            /**
             * Date and time at which the image was last tagged in [RFC
             * 3339](https://www.ietf.org/rfc/rfc3339.txt) format with
             * nano-seconds.
             *
             * This information is only available if the image was tagged
             * locally, and omitted otherwise.
             */
            LastTagTime: Schema.optional(Schema.nullable(Schema.string)),
        })
    ),
}) {}

export class ImageSummary extends Schema.Class<ImageSummary>()({
    /**
     * ID is the content-addressable ID of an image.
     *
     * This identifier is a content-addressable digest calculated from the
     * image's configuration (which includes the digests of layers used by the
     * image).
     *
     * Note that this digest differs from the `RepoDigests` below, which holds
     * digests of image manifests that reference the image.
     */
    Id: Schema.string,

    /**
     * ID of the parent image.
     *
     * Depending on how the image was created, this field may be empty and is
     * only set for images that were built/created locally. This field is empty
     * if the image was pulled from an image registry.
     */
    ParentId: Schema.string,

    /**
     * List of image names/tags in the local image cache that reference this
     * image.
     *
     * Multiple image tags can refer to the same image, and this list may be
     * empty if no tags reference the image, in which case the image is
     * "untagged", in which case it can still be referenced by its ID.
     */
    RepoTags: Schema.optional(Schema.array(Schema.string)),

    /**
     * List of content-addressable digests of locally available image manifests
     * that the image is referenced from. Multiple manifests can refer to the
     * same image.
     *
     * These digests are usually only available if the image was either pulled
     * from a registry, or if the image was pushed to a registry, which is when
     * the manifest is generated and its digest calculated.
     */
    RepoDigests: Schema.optional(Schema.array(Schema.string)),

    /**
     * Date and time at which the image was created as a Unix timestamp (number
     * of seconds sinds EPOCH).
     */
    Created: Schema.number,

    /** Total size of the image including all layers it is composed of. */
    Size: Schema.number,

    /**
     * Total size of image layers that are shared between this image and other
     * images.
     *
     * This size is not calculated by default. `-1` indicates that the value has
     * not been set / calculated.
     */
    SharedSize: Schema.number,

    /**
     * Total size of the image including all layers it is composed of.
     *
     * Deprecated: this field is omitted in API v1.44, but kept for backward
     * compatibility. Use Size instead.
     */
    VirtualSize: Schema.optional(Schema.number),

    /** User-defined key/value metadata. */
    Labels: Schema.struct({}),

    /**
     * Number of containers using this image. Includes both stopped and running
     * containers.
     *
     * This size is not calculated by default, and depends on which API endpoint
     * is used. `-1` indicates that the value has not been set / calculated.
     */
    Containers: Schema.number,
}) {}

export class AuthConfig extends Schema.Class<AuthConfig>()({
    username: Schema.optional(Schema.string),
    password: Schema.optional(Schema.string),
    email: Schema.optional(Schema.string),
    serveraddress: Schema.optional(Schema.string),
}) {}

export class ProcessConfig extends Schema.Class<ProcessConfig>()({
    privileged: Schema.optional(Schema.boolean),
    user: Schema.optional(Schema.string),
    tty: Schema.optional(Schema.boolean),
    entrypoint: Schema.optional(Schema.string),
    arguments: Schema.optional(Schema.array(Schema.string)),
}) {}

export class Volume extends Schema.Class<Volume>()({
    /** Name of the volume. */
    Name: Schema.string,

    /** Name of the volume driver used by the volume. */
    Driver: Schema.string,

    /** Mount path of the volume on the host. */
    Mountpoint: Schema.string,

    /** Date/Time the volume was created. */
    CreatedAt: Schema.optional(Schema.string),

    /**
     * Low-level details about the volume, provided by the volume driver.
     * Details are returned as a map with key/value pairs:
     * `{"key":"value","key2":"value2"}`.
     *
     * The `Status` field is optional, and is omitted if the volume driver does
     * not support this feature.
     */
    Status: Schema.optional(Schema.struct({})),

    /** User-defined key/value metadata. */
    Labels: Schema.struct({}),

    /**
     * The level at which the volume exists. Either `global` for cluster-wide,
     * or `local` for machine level.
     */
    Scope: Schema.optional(Schema.enums(Volume_Scope)).withDefault(() => Volume_Scope.LOCAL),

    /**
     * Options and information specific to, and only present on, Swarm CSI
     * cluster volumes.
     */
    ClusterVolume: Schema.optional(
        Schema.struct({
            /**
             * The Swarm ID of this volume. Because cluster volumes are Swarm
             * objects, they have an ID, unlike non-cluster volumes. This ID can
             * be used to refer to the Volume instead of the name.
             */
            ID: Schema.optional(Schema.string),

            /**
             * The version number of the object such as node, service, etc. This
             * is needed to avoid conflicting writes. The client must send the
             * version number along with the modified specification when
             * updating these objects.
             *
             * This approach ensures safe concurrency and determinism in that
             * the change on the object may not be applied if the version number
             * has changed from the last read. In other words, if two update
             * requests specify the same base version, only one of the requests
             * can succeed. As a result, two separate update requests that
             * happen at the same time will not unintentionally overwrite each
             * other.
             */
            Version: Schema.optional(Schema.struct({ Index: Schema.optional(Schema.number) })),
            CreatedAt: Schema.optional(Schema.string),
            UpdatedAt: Schema.optional(Schema.string),

            /** Cluster-specific options used to create the volume. */
            Spec: Schema.optional(
                Schema.struct({
                    /**
                     * Group defines the volume group of this volume. Volumes
                     * belonging to the same group can be referred to by group
                     * name when creating Services. Referring to a volume by
                     * group instructs Swarm to treat volumes in that group
                     * interchangeably for the purpose of scheduling. Volumes
                     * with an empty string for a group technically all belong
                     * to the same, emptystring group.
                     */
                    Group: Schema.optional(Schema.string),

                    /** Defines how the volume is used by tasks. */
                    AccessMode: Schema.optional(
                        Schema.struct({
                            /**
                             * The set of nodes this volume can be used on at
                             * one time.
                             *
                             * - `single` The volume may only be scheduled to one
                             *   node at a time.
                             * - `multi` the volume may be scheduled to any
                             *   supported number of nodes at a time.
                             */
                            Scope: Schema.optional(
                                Schema.enums(Volume_ClusterVolume_Spec_AccessMode_Scope)
                            ).withDefault(() => Volume_ClusterVolume_Spec_AccessMode_Scope.SINGLE),

                            /**
                             * The number and way that different tasks can use
                             * this volume at one time.
                             *
                             * - `none` The volume may only be used by one task at
                             *   a time.
                             * - `readonly` The volume may be used by any number
                             *   of tasks, but they all must mount the volume as
                             *   readonly
                             * - `onewriter` The volume may be used by any number
                             *   of tasks, but only one may mount it as
                             *   read/write.
                             * - `all` The volume may have any number of readers
                             *   and writers.
                             */
                            Sharing: Schema.optional(
                                Schema.enums(Volume_ClusterVolume_Spec_AccessMode_Sharing)
                            ).withDefault(() => Volume_ClusterVolume_Spec_AccessMode_Sharing.NONE),

                            /**
                             * Options for using this volume as a Mount-type
                             * volume.
                             *
                             *     Either MountVolume or BlockVolume, but not both, must be
                             *     present.
                             *
                             * Properties: FsType: type: "string" description: |
                             * Specifies the filesystem type for the mount
                             * volume. Optional. MountFlags: type: "array"
                             * description: | Flags to pass when mounting the
                             * volume. Optional. items: type: "string"
                             * BlockVolume: type: "object" description: |
                             * Options for using this volume as a Block-type
                             * volume. Intentionally empty.
                             */
                            MountVolume: Schema.optional(Schema.struct({})),

                            /**
                             * Swarm Secrets that are passed to the CSI storage
                             * plugin when operating on this volume.
                             */
                            Secrets: Schema.optional(
                                Schema.array(
                                    Schema.struct({
                                        /**
                                         * Key is the name of the key of the
                                         * key-value pair passed to the plugin.
                                         */
                                        Key: Schema.optional(Schema.string),

                                        /**
                                         * Secret is the swarm Secret object
                                         * from which to read data. This can be
                                         * a Secret name or ID. The Secret data
                                         * is retrieved by swarm and used as the
                                         * value of the key-value pair passed to
                                         * the plugin.
                                         */
                                        Secret: Schema.optional(Schema.string),
                                    })
                                )
                            ),

                            /**
                             * Requirements for the accessible topology of the
                             * volume. These fields are optional. For an
                             * in-depth description of what these fields mean,
                             * see the CSI specification.
                             */
                            AccessibilityRequirements: Schema.optional(
                                Schema.struct({
                                    /**
                                     * A list of required topologies, at least
                                     * one of which the volume must be
                                     * accessible from.
                                     */
                                    Requisite: Schema.optional(Schema.array(Schema.struct({}))),

                                    /**
                                     * A list of topologies that the volume
                                     * should attempt to be provisioned in.
                                     */
                                    Preferred: Schema.optional(Schema.array(Schema.struct({}))),
                                })
                            ),

                            /**
                             * The desired capacity that the volume should be
                             * created with. If empty, the plugin will decide
                             * the capacity.
                             */
                            CapacityRange: Schema.optional(
                                Schema.struct({
                                    /**
                                     * The volume must be at least this big. The
                                     * value of 0 indicates an unspecified
                                     * minimum
                                     */
                                    RequiredBytes: Schema.optional(Schema.number),

                                    /**
                                     * The volume must not be bigger than this.
                                     * The value of 0 indicates an unspecified
                                     * maximum.
                                     */
                                    LimitBytes: Schema.optional(Schema.number),
                                })
                            ),

                            /**
                             * The availability of the volume for use in tasks.
                             *
                             * - `active` The volume is fully available for
                             *   scheduling on the cluster
                             * - `pause` No new workloads should use the volume,
                             *   but existing workloads are not stopped.
                             * - `drain` All workloads using this volume should be
                             *   stopped and rescheduled, and no new ones should
                             *   be started.
                             */
                            Availability: Schema.optional(
                                Schema.enums(Volume_ClusterVolume_Spec_AccessMode_Availability)
                            ).withDefault(() => Volume_ClusterVolume_Spec_AccessMode_Availability.ACTIVE),
                        })
                    ),
                })
            ),

            /** Information about the global status of the volume. */
            Info: Schema.optional(
                Schema.struct({
                    /**
                     * The capacity of the volume in bytes. A value of 0
                     * indicates that the capacity is unknown.
                     */
                    CapacityBytes: Schema.optional(Schema.number),

                    /**
                     * A map of strings to strings returned from the storage
                     * plugin when the volume is created.
                     */
                    VolumeContext: Schema.optional(Schema.struct({})),

                    /**
                     * The ID of the volume as returned by the CSI storage
                     * plugin. This is distinct from the volume's ID as provided
                     * by Docker. This ID is never used by the user when
                     * communicating with Docker to refer to this volume. If the
                     * ID is blank, then the Volume has not been successfully
                     * created in the plugin yet.
                     */
                    VolumeID: Schema.optional(Schema.string),

                    /** The topology this volume is actually accessible from. */
                    AccessibleTopology: Schema.optional(Schema.array(Schema.struct({}))),
                })
            ),

            /**
             * The status of the volume as it pertains to its publishing and use
             * on specific nodes
             */
            PublishStatus: Schema.optional(
                Schema.array(
                    Schema.struct({
                        /** The ID of the Swarm node the volume is published on. */
                        NodeID: Schema.optional(Schema.string),

                        /**
                         * The published state of the volume. `pending-publish`
                         * The volume should be published to this node, but the
                         * call to the controller plugin to do so has not yet
                         * been successfully completed. `published` The volume
                         * is published successfully to the node.
                         * `pending-node-unpublish` The volume should be
                         * unpublished from the node, and the manager is
                         * awaiting confirmation from the worker that it has
                         * done so. `pending-controller-unpublish` The volume is
                         * successfully unpublished from the node, but has not
                         * yet been successfully unpublished on the controller.
                         */
                        State: Schema.enums(Volume_ClusterVolume_PublishStatus_PublishStatus_State),

                        /**
                         * A map of strings to strings returned by the CSI
                         * controller plugin when a volume is published.
                         */
                        PublishContext: Schema.optional(Schema.struct({})),
                    })
                )
            ),
        })
    ),

    /** The driver specific options used when creating the volume. */
    Options: Schema.struct({}),

    /**
     * Usage details about the volume. This information is used by the `GET
     * /system/df` endpoint, and omitted in other endpoints.
     */
    UsageData: Schema.optional(
        Schema.nullable(
            Schema.struct({
                /**
                 * Amount of disk space used by the volume (in bytes). This
                 * information is only available for volumes created with the
                 * `"local"` volume driver. For volumes created with other
                 * volume drivers, this field is set to `-1` ("not available")
                 */
                Size: Schema.optional(Schema.number).withDefault(() => -1),

                /**
                 * The number of containers referencing this volume. This field
                 * is set to `-1` if the reference-count is not available.
                 */
                RefCount: Schema.optional(Schema.number).withDefault(() => -1),
            })
        )
    ),
}) {}

export class VolumeCreateOptions extends Schema.Class<VolumeCreateOptions>()({
    /** The new volume's name. If not specified, Docker generates a name. */
    Name: Schema.optional(Schema.string),

    /** Name of the volume driver to use. */
    Driver: Schema.optional(Schema.string).withDefault(() => "local"),

    /**
     * A mapping of driver options and values. These options are passed directly
     * to the driver and are driver specific.
     */
    DriverOpts: Schema.optional(Schema.struct({})),

    /** User-defined key/value metadata. */
    Labels: Schema.optional(Schema.struct({})),

    /** Cluster-specific options used to create the volume. */
    ClusterVolumeSpec: Schema.optional(
        Schema.struct({
            /**
             * Group defines the volume group of this volume. Volumes belonging
             * to the same group can be referred to by group name when creating
             * Services. Referring to a volume by group instructs Swarm to treat
             * volumes in that group interchangeably for the purpose of
             * scheduling. Volumes with an empty string for a group technically
             * all belong to the same, emptystring group.
             */
            Group: Schema.optional(Schema.string),

            /** Defines how the volume is used by tasks. */
            AccessMode: Schema.optional(
                Schema.struct({
                    /**
                     * The set of nodes this volume can be used on at one time.
                     *
                     * - `single` The volume may only be scheduled to one node at
                     *   a time.
                     * - `multi` the volume may be scheduled to any supported
                     *   number of nodes at a time.
                     */
                    Scope: Schema.optional(
                        Schema.enums(VolumeCreateOptions_ClusterVolumeSpec_AccessMode_Scope)
                    ).withDefault(() => VolumeCreateOptions_ClusterVolumeSpec_AccessMode_Scope.SINGLE),

                    /**
                     * The number and way that different tasks can use this
                     * volume at one time.
                     *
                     * - `none` The volume may only be used by one task at a time.
                     * - `readonly` The volume may be used by any number of tasks,
                     *   but they all must mount the volume as readonly
                     * - `onewriter` The volume may be used by any number of
                     *   tasks, but only one may mount it as read/write.
                     * - `all` The volume may have any number of readers and
                     *   writers.
                     */
                    Sharing: Schema.optional(
                        Schema.enums(VolumeCreateOptions_ClusterVolumeSpec_AccessMode_Sharing)
                    ).withDefault(() => VolumeCreateOptions_ClusterVolumeSpec_AccessMode_Sharing.NONE),

                    /**
                     * Options for using this volume as a Mount-type volume.
                     *
                     *     Either MountVolume or BlockVolume, but not both, must be
                     *     present.
                     *
                     * Properties: FsType: type: "string" description: |
                     * Specifies the filesystem type for the mount volume.
                     * Optional. MountFlags: type: "array" description: | Flags
                     * to pass when mounting the volume. Optional. items: type:
                     * "string" BlockVolume: type: "object" description: |
                     * Options for using this volume as a Block-type volume.
                     * Intentionally empty.
                     */
                    MountVolume: Schema.optional(Schema.struct({})),

                    /**
                     * Swarm Secrets that are passed to the CSI storage plugin
                     * when operating on this volume.
                     */
                    Secrets: Schema.optional(
                        Schema.array(
                            Schema.struct({
                                /**
                                 * Key is the name of the key of the key-value
                                 * pair passed to the plugin.
                                 */
                                Key: Schema.optional(Schema.string),

                                /**
                                 * Secret is the swarm Secret object from which
                                 * to read data. This can be a Secret name or
                                 * ID. The Secret data is retrieved by swarm and
                                 * used as the value of the key-value pair
                                 * passed to the plugin.
                                 */
                                Secret: Schema.optional(Schema.string),
                            })
                        )
                    ),

                    /**
                     * Requirements for the accessible topology of the volume.
                     * These fields are optional. For an in-depth description of
                     * what these fields mean, see the CSI specification.
                     */
                    AccessibilityRequirements: Schema.optional(
                        Schema.struct({
                            /**
                             * A list of required topologies, at least one of
                             * which the volume must be accessible from.
                             */
                            Requisite: Schema.optional(Schema.array(Schema.struct({}))),

                            /**
                             * A list of topologies that the volume should
                             * attempt to be provisioned in.
                             */
                            Preferred: Schema.optional(Schema.array(Schema.struct({}))),
                        })
                    ),

                    /**
                     * The desired capacity that the volume should be created
                     * with. If empty, the plugin will decide the capacity.
                     */
                    CapacityRange: Schema.optional(
                        Schema.struct({
                            /**
                             * The volume must be at least this big. The value
                             * of 0 indicates an unspecified minimum
                             */
                            RequiredBytes: Schema.optional(Schema.number),

                            /**
                             * The volume must not be bigger than this. The
                             * value of 0 indicates an unspecified maximum.
                             */
                            LimitBytes: Schema.optional(Schema.number),
                        })
                    ),

                    /**
                     * The availability of the volume for use in tasks.
                     *
                     * - `active` The volume is fully available for scheduling on
                     *   the cluster
                     * - `pause` No new workloads should use the volume, but
                     *   existing workloads are not stopped.
                     * - `drain` All workloads using this volume should be stopped
                     *   and rescheduled, and no new ones should be started.
                     */
                    Availability: Schema.optional(
                        Schema.enums(VolumeCreateOptions_ClusterVolumeSpec_AccessMode_Availability)
                    ).withDefault(() => VolumeCreateOptions_ClusterVolumeSpec_AccessMode_Availability.ACTIVE),
                })
            ),
        })
    ),
}) {}

export class VolumeListResponse extends Schema.Class<VolumeListResponse>()({
    /** List of volumes */
    Volumes: Schema.optional(
        Schema.array(
            Schema.struct({
                /** Name of the volume. */
                Name: Schema.string,

                /** Name of the volume driver used by the volume. */
                Driver: Schema.string,

                /** Mount path of the volume on the host. */
                Mountpoint: Schema.string,

                /** Date/Time the volume was created. */
                CreatedAt: Schema.optional(Schema.string),

                /**
                 * Low-level details about the volume, provided by the volume
                 * driver. Details are returned as a map with key/value pairs:
                 * `{"key":"value","key2":"value2"}`.
                 *
                 * The `Status` field is optional, and is omitted if the volume
                 * driver does not support this feature.
                 */
                Status: Schema.optional(Schema.struct({})),

                /** User-defined key/value metadata. */
                Labels: Schema.struct({}),

                /**
                 * The level at which the volume exists. Either `global` for
                 * cluster-wide, or `local` for machine level.
                 */
                Scope: Schema.optional(Schema.enums(VolumeListResponse_Volumes_Volumes_Scope)).withDefault(
                    () => VolumeListResponse_Volumes_Volumes_Scope.LOCAL
                ),

                /**
                 * Options and information specific to, and only present on,
                 * Swarm CSI cluster volumes.
                 */
                ClusterVolume: Schema.optional(
                    Schema.struct({
                        /**
                         * The Swarm ID of this volume. Because cluster volumes
                         * are Swarm objects, they have an ID, unlike
                         * non-cluster volumes. This ID can be used to refer to
                         * the Volume instead of the name.
                         */
                        ID: Schema.optional(Schema.string),

                        /**
                         * The version number of the object such as node,
                         * service, etc. This is needed to avoid conflicting
                         * writes. The client must send the version number along
                         * with the modified specification when updating these
                         * objects.
                         *
                         * This approach ensures safe concurrency and
                         * determinism in that the change on the object may not
                         * be applied if the version number has changed from the
                         * last read. In other words, if two update requests
                         * specify the same base version, only one of the
                         * requests can succeed. As a result, two separate
                         * update requests that happen at the same time will not
                         * unintentionally overwrite each other.
                         */
                        Version: Schema.optional(Schema.struct({ Index: Schema.optional(Schema.number) })),
                        CreatedAt: Schema.optional(Schema.string),
                        UpdatedAt: Schema.optional(Schema.string),

                        /** Cluster-specific options used to create the volume. */
                        Spec: Schema.optional(
                            Schema.struct({
                                /**
                                 * Group defines the volume group of this
                                 * volume. Volumes belonging to the same group
                                 * can be referred to by group name when
                                 * creating Services. Referring to a volume by
                                 * group instructs Swarm to treat volumes in
                                 * that group interchangeably for the purpose of
                                 * scheduling. Volumes with an empty string for
                                 * a group technically all belong to the same,
                                 * emptystring group.
                                 */
                                Group: Schema.optional(Schema.string),

                                /** Defines how the volume is used by tasks. */
                                AccessMode: Schema.optional(
                                    Schema.struct({
                                        /**
                                         * The set of nodes this volume can be
                                         * used on at one time.
                                         *
                                         * - `single` The volume may only be
                                         *   scheduled to one node at a time.
                                         * - `multi` the volume may be scheduled
                                         *   to any supported number of nodes at
                                         *   a time.
                                         */
                                        Scope: Schema.optional(
                                            Schema.enums(
                                                VolumeListResponse_Volumes_Volumes_ClusterVolume_Spec_AccessMode_Scope
                                            )
                                        ).withDefault(
                                            () =>
                                                VolumeListResponse_Volumes_Volumes_ClusterVolume_Spec_AccessMode_Scope.SINGLE
                                        ),

                                        /**
                                         * The number and way that different
                                         * tasks can use this volume at one
                                         * time.
                                         *
                                         * - `none` The volume may only be used by
                                         *   one task at a time.
                                         * - `readonly` The volume may be used by
                                         *   any number of tasks, but they all
                                         *   must mount the volume as readonly
                                         * - `onewriter` The volume may be used by
                                         *   any number of tasks, but only one
                                         *   may mount it as read/write.
                                         * - `all` The volume may have any number
                                         *   of readers and writers.
                                         */
                                        Sharing: Schema.optional(
                                            Schema.enums(
                                                VolumeListResponse_Volumes_Volumes_ClusterVolume_Spec_AccessMode_Sharing
                                            )
                                        ).withDefault(
                                            () =>
                                                VolumeListResponse_Volumes_Volumes_ClusterVolume_Spec_AccessMode_Sharing.NONE
                                        ),

                                        /**
                                         * Options for using this volume as a
                                         * Mount-type volume.
                                         *
                                         *     Either MountVolume or BlockVolume, but not both, must be
                                         *     present.
                                         *
                                         * Properties: FsType: type: "string"
                                         * description: | Specifies the
                                         * filesystem type for the mount volume.
                                         * Optional. MountFlags: type: "array"
                                         * description: | Flags to pass when
                                         * mounting the volume. Optional. items:
                                         * type: "string" BlockVolume: type:
                                         * "object" description: | Options for
                                         * using this volume as a Block-type
                                         * volume. Intentionally empty.
                                         */
                                        MountVolume: Schema.optional(Schema.struct({})),

                                        /**
                                         * Swarm Secrets that are passed to the
                                         * CSI storage plugin when operating on
                                         * this volume.
                                         */
                                        Secrets: Schema.optional(
                                            Schema.array(
                                                Schema.struct({
                                                    /**
                                                     * Key is the name of the
                                                     * key of the key-value pair
                                                     * passed to the plugin.
                                                     */
                                                    Key: Schema.optional(Schema.string),

                                                    /**
                                                     * Secret is the swarm
                                                     * Secret object from which
                                                     * to read data. This can be
                                                     * a Secret name or ID. The
                                                     * Secret data is retrieved
                                                     * by swarm and used as the
                                                     * value of the key-value
                                                     * pair passed to the
                                                     * plugin.
                                                     */
                                                    Secret: Schema.optional(Schema.string),
                                                })
                                            )
                                        ),

                                        /**
                                         * Requirements for the accessible
                                         * topology of the volume. These fields
                                         * are optional. For an in-depth
                                         * description of what these fields
                                         * mean, see the CSI specification.
                                         */
                                        AccessibilityRequirements: Schema.optional(
                                            Schema.struct({
                                                /**
                                                 * A list of required
                                                 * topologies, at least one of
                                                 * which the volume must be
                                                 * accessible from.
                                                 */
                                                Requisite: Schema.optional(Schema.array(Schema.struct({}))),

                                                /**
                                                 * A list of topologies that the
                                                 * volume should attempt to be
                                                 * provisioned in.
                                                 */
                                                Preferred: Schema.optional(Schema.array(Schema.struct({}))),
                                            })
                                        ),

                                        /**
                                         * The desired capacity that the volume
                                         * should be created with. If empty, the
                                         * plugin will decide the capacity.
                                         */
                                        CapacityRange: Schema.optional(
                                            Schema.struct({
                                                /**
                                                 * The volume must be at least
                                                 * this big. The value of 0
                                                 * indicates an unspecified
                                                 * minimum
                                                 */
                                                RequiredBytes: Schema.optional(Schema.number),

                                                /**
                                                 * The volume must not be bigger
                                                 * than this. The value of 0
                                                 * indicates an unspecified
                                                 * maximum.
                                                 */
                                                LimitBytes: Schema.optional(Schema.number),
                                            })
                                        ),

                                        /**
                                         * The availability of the volume for
                                         * use in tasks.
                                         *
                                         * - `active` The volume is fully
                                         *   available for scheduling on the
                                         *   cluster
                                         * - `pause` No new workloads should use
                                         *   the volume, but existing workloads
                                         *   are not stopped.
                                         * - `drain` All workloads using this
                                         *   volume should be stopped and
                                         *   rescheduled, and no new ones should
                                         *   be started.
                                         */
                                        Availability: Schema.optional(
                                            Schema.enums(
                                                VolumeListResponse_Volumes_Volumes_ClusterVolume_Spec_AccessMode_Availability
                                            )
                                        ).withDefault(
                                            () =>
                                                VolumeListResponse_Volumes_Volumes_ClusterVolume_Spec_AccessMode_Availability.ACTIVE
                                        ),
                                    })
                                ),
                            })
                        ),

                        /** Information about the global status of the volume. */
                        Info: Schema.optional(
                            Schema.struct({
                                /**
                                 * The capacity of the volume in bytes. A value
                                 * of 0 indicates that the capacity is unknown.
                                 */
                                CapacityBytes: Schema.optional(Schema.number),

                                /**
                                 * A map of strings to strings returned from the
                                 * storage plugin when the volume is created.
                                 */
                                VolumeContext: Schema.optional(Schema.struct({})),

                                /**
                                 * The ID of the volume as returned by the CSI
                                 * storage plugin. This is distinct from the
                                 * volume's ID as provided by Docker. This ID is
                                 * never used by the user when communicating
                                 * with Docker to refer to this volume. If the
                                 * ID is blank, then the Volume has not been
                                 * successfully created in the plugin yet.
                                 */
                                VolumeID: Schema.optional(Schema.string),

                                /**
                                 * The topology this volume is actually
                                 * accessible from.
                                 */
                                AccessibleTopology: Schema.optional(Schema.array(Schema.struct({}))),
                            })
                        ),

                        /**
                         * The status of the volume as it pertains to its
                         * publishing and use on specific nodes
                         */
                        PublishStatus: Schema.optional(
                            Schema.array(
                                Schema.struct({
                                    /**
                                     * The ID of the Swarm node the volume is
                                     * published on.
                                     */
                                    NodeID: Schema.optional(Schema.string),

                                    /**
                                     * The published state of the volume.
                                     * `pending-publish` The volume should be
                                     * published to this node, but the call to
                                     * the controller plugin to do so has not
                                     * yet been successfully completed.
                                     * `published` The volume is published
                                     * successfully to the node.
                                     * `pending-node-unpublish` The volume
                                     * should be unpublished from the node, and
                                     * the manager is awaiting confirmation from
                                     * the worker that it has done so.
                                     * `pending-controller-unpublish` The volume
                                     * is successfully unpublished from the
                                     * node, but has not yet been successfully
                                     * unpublished on the controller.
                                     */
                                    State: Schema.enums(
                                        VolumeListResponse_Volumes_Volumes_ClusterVolume_PublishStatus_PublishStatus_State
                                    ),

                                    /**
                                     * A map of strings to strings returned by
                                     * the CSI controller plugin when a volume
                                     * is published.
                                     */
                                    PublishContext: Schema.optional(Schema.struct({})),
                                })
                            )
                        ),
                    })
                ),

                /** The driver specific options used when creating the volume. */
                Options: Schema.struct({}),

                /**
                 * Usage details about the volume. This information is used by
                 * the `GET /system/df` endpoint, and omitted in other
                 * endpoints.
                 */
                UsageData: Schema.optional(
                    Schema.nullable(
                        Schema.struct({
                            /**
                             * Amount of disk space used by the volume (in
                             * bytes). This information is only available for
                             * volumes created with the `"local"` volume driver.
                             * For volumes created with other volume drivers,
                             * this field is set to `-1` ("not available")
                             */
                            Size: Schema.optional(Schema.number).withDefault(() => -1),

                            /**
                             * The number of containers referencing this volume.
                             * This field is set to `-1` if the reference-count
                             * is not available.
                             */
                            RefCount: Schema.optional(Schema.number).withDefault(() => -1),
                        })
                    )
                ),
            })
        )
    ),

    /** Warnings that occurred when fetching the list of volumes. */
    Warnings: Schema.optional(Schema.array(Schema.string)),
}) {}

export class Network extends Schema.Class<Network>()({
    Name: Schema.optional(Schema.string),
    Id: Schema.optional(Schema.string),
    Created: Schema.optional(Schema.string),
    Scope: Schema.optional(Schema.string),
    Driver: Schema.optional(Schema.string),
    EnableIPv6: Schema.optional(Schema.boolean),
    IPAM: Schema.optional(
        Schema.struct({
            /** Name of the IPAM driver to use. */
            Driver: Schema.optional(Schema.string).withDefault(() => "default"),

            /**
             * List of IPAM configuration options, specified as a map:
             *
             *     {"Subnet": <CIDR>, "IPRange": <CIDR>, "Gateway": <IP address>, "AuxAddress": <device_name:IP address>}
             */
            Config: Schema.optional(
                Schema.array(
                    Schema.struct({
                        Subnet: Schema.optional(Schema.string),
                        IPRange: Schema.optional(Schema.string),
                        Gateway: Schema.optional(Schema.string),
                        AuxiliaryAddresses: Schema.optional(Schema.struct({})),
                    })
                )
            ),

            /** Driver-specific options, specified as a map. */
            Options: Schema.optional(Schema.struct({})),
        })
    ),
    Internal: Schema.optional(Schema.boolean),
    Attachable: Schema.optional(Schema.boolean),
    Ingress: Schema.optional(Schema.boolean),
    Containers: Schema.optional(Schema.struct({})),
    Options: Schema.optional(Schema.struct({})),
    Labels: Schema.optional(Schema.struct({})),
}) {}

export class IPAM extends Schema.Class<IPAM>()({
    /** Name of the IPAM driver to use. */
    Driver: Schema.optional(Schema.string).withDefault(() => "default"),

    /**
     * List of IPAM configuration options, specified as a map:
     *
     *     {"Subnet": <CIDR>, "IPRange": <CIDR>, "Gateway": <IP address>, "AuxAddress": <device_name:IP address>}
     */
    Config: Schema.optional(
        Schema.array(
            Schema.struct({
                Subnet: Schema.optional(Schema.string),
                IPRange: Schema.optional(Schema.string),
                Gateway: Schema.optional(Schema.string),
                AuxiliaryAddresses: Schema.optional(Schema.struct({})),
            })
        )
    ),

    /** Driver-specific options, specified as a map. */
    Options: Schema.optional(Schema.struct({})),
}) {}

export class IPAMConfig extends Schema.Class<IPAMConfig>()({
    Subnet: Schema.optional(Schema.string),
    IPRange: Schema.optional(Schema.string),
    Gateway: Schema.optional(Schema.string),
    AuxiliaryAddresses: Schema.optional(Schema.struct({})),
}) {}

export class NetworkContainer extends Schema.Class<NetworkContainer>()({
    Name: Schema.optional(Schema.string),
    EndpointID: Schema.optional(Schema.string),
    MacAddress: Schema.optional(Schema.string),
    IPv4Address: Schema.optional(Schema.string),
    IPv6Address: Schema.optional(Schema.string),
}) {}

export class BuildInfo extends Schema.Class<BuildInfo>()({
    id: Schema.optional(Schema.string),
    stream: Schema.optional(Schema.string),
    error: Schema.optional(Schema.string),
    errorDetail: Schema.optional(
        Schema.struct({ code: Schema.optional(Schema.number), message: Schema.optional(Schema.string) })
    ),
    status: Schema.optional(Schema.string),
    progress: Schema.optional(Schema.string),
    progressDetail: Schema.optional(
        Schema.struct({ current: Schema.optional(Schema.number), total: Schema.optional(Schema.number) })
    ),

    /** Image ID or Digest */
    aux: Schema.optional(Schema.struct({ ID: Schema.optional(Schema.string) })),
}) {}

export class BuildCache extends Schema.Class<BuildCache>()({
    /** Unique ID of the build cache record. */
    ID: Schema.optional(Schema.string),

    /**
     * ID of the parent build cache record.> **Deprecated**: This field is
     * deprecated, and omitted if> Empty.
     */
    Parent: Schema.optional(Schema.nullable(Schema.string)),

    /** List of parent build cache record IDs. */
    Parents: Schema.optional(Schema.nullable(Schema.array(Schema.string))),

    /** Cache record type. */
    Type: Schema.enums(BuildCache_Type),

    /** Description of the build-step that produced the build cache. */
    Description: Schema.optional(Schema.string),

    /** Indicates if the build cache is in use. */
    InUse: Schema.optional(Schema.boolean),

    /** Indicates if the build cache is shared. */
    Shared: Schema.optional(Schema.boolean),

    /** Amount of disk space used by the build cache (in bytes). */
    Size: Schema.optional(Schema.number),

    /**
     * Date and time at which the build cache was created in [RFC
     * 3339](https://www.ietf.org/rfc/rfc3339.txt) format with nano-seconds.
     */
    CreatedAt: Schema.optional(Schema.string),

    /**
     * Date and time at which the build cache was last used in [RFC
     * 3339](https://www.ietf.org/rfc/rfc3339.txt) format with nano-seconds.
     */
    LastUsedAt: Schema.optional(Schema.nullable(Schema.string)),
    UsageCount: Schema.optional(Schema.number),
}) {}

export class ImageID extends Schema.Class<ImageID>()({ ID: Schema.optional(Schema.string) }) {}

export class CreateImageInfo extends Schema.Class<CreateImageInfo>()({
    id: Schema.optional(Schema.string),
    error: Schema.optional(Schema.string),
    errorDetail: Schema.optional(
        Schema.struct({ code: Schema.optional(Schema.number), message: Schema.optional(Schema.string) })
    ),
    status: Schema.optional(Schema.string),
    progress: Schema.optional(Schema.string),
    progressDetail: Schema.optional(
        Schema.struct({ current: Schema.optional(Schema.number), total: Schema.optional(Schema.number) })
    ),
}) {}

export class PushImageInfo extends Schema.Class<PushImageInfo>()({
    error: Schema.optional(Schema.string),
    status: Schema.optional(Schema.string),
    progress: Schema.optional(Schema.string),
    progressDetail: Schema.optional(
        Schema.struct({ current: Schema.optional(Schema.number), total: Schema.optional(Schema.number) })
    ),
}) {}

export class ErrorDetail extends Schema.Class<ErrorDetail>()({
    code: Schema.optional(Schema.number),
    message: Schema.optional(Schema.string),
}) {}

export class ProgressDetail extends Schema.Class<ProgressDetail>()({
    current: Schema.optional(Schema.number),
    total: Schema.optional(Schema.number),
}) {}

export class ErrorResponse extends Schema.Class<ErrorResponse>()({
    /** The error message. */
    message: Schema.string,
}) {}

export class IdResponse extends Schema.Class<IdResponse>()({
    /** The id of the newly created object. */
    Id: Schema.string,
}) {}

export class EndpointSettings extends Schema.Class<EndpointSettings>()({
    /** EndpointIPAMConfig represents an endpoint's IPAM configuration. */
    IPAMConfig: Schema.optional(
        Schema.nullable(
            Schema.struct({
                IPv4Address: Schema.optional(Schema.string),
                IPv6Address: Schema.optional(Schema.string),
                LinkLocalIPs: Schema.optional(Schema.array(Schema.string)),
            })
        )
    ),
    Links: Schema.optional(Schema.array(Schema.string)),

    /**
     * MAC address for the endpoint on this network. The network driver might
     * ignore this parameter.
     */
    MacAddress: Schema.optional(Schema.string),
    Aliases: Schema.optional(Schema.array(Schema.string)),

    /** Unique ID of the network. */
    NetworkID: Schema.optional(Schema.string),

    /** Unique ID for the service endpoint in a Sandbox. */
    EndpointID: Schema.optional(Schema.string),

    /** Gateway address for this network. */
    Gateway: Schema.optional(Schema.string),

    /** IPv4 address. */
    IPAddress: Schema.optional(Schema.string),

    /** Mask length of the IPv4 address. */
    IPPrefixLen: Schema.optional(Schema.number),

    /** IPv6 gateway address. */
    IPv6Gateway: Schema.optional(Schema.string),

    /** Global IPv6 address. */
    GlobalIPv6Address: Schema.optional(Schema.string),

    /** Mask length of the global IPv6 address. */
    GlobalIPv6PrefixLen: Schema.optional(Schema.number),

    /**
     * DriverOpts is a mapping of driver options and values. These options are
     * passed directly to the driver and are driver specific.
     */
    DriverOpts: Schema.optional(Schema.nullable(Schema.struct({}))),
}) {}

export class EndpointIPAMConfig extends Schema.Class<EndpointIPAMConfig>()({
    IPv4Address: Schema.optional(Schema.string),
    IPv6Address: Schema.optional(Schema.string),
    LinkLocalIPs: Schema.optional(Schema.array(Schema.string)),
}) {}

export class PluginMount extends Schema.Class<PluginMount>()({
    Name: Schema.string,
    Description: Schema.string,
    Settable: Schema.optional(Schema.array(Schema.string)),
    Source: Schema.string,
    Destination: Schema.string,
    Type: Schema.string,
    Options: Schema.optional(Schema.array(Schema.string)),
}) {}

export class PluginDevice extends Schema.Class<PluginDevice>()({
    Name: Schema.string,
    Description: Schema.string,
    Settable: Schema.optional(Schema.array(Schema.string)),
    Path: Schema.string,
}) {}

export class PluginEnv extends Schema.Class<PluginEnv>()({
    Name: Schema.string,
    Description: Schema.string,
    Settable: Schema.optional(Schema.array(Schema.string)),
    Value: Schema.string,
}) {}

export class PluginInterfaceType extends Schema.Class<PluginInterfaceType>()({
    Prefix: Schema.string,
    Capability: Schema.string,
    Version: Schema.string,
}) {}

export class PluginPrivilege extends Schema.Class<PluginPrivilege>()({
    Name: Schema.optional(Schema.string),
    Description: Schema.optional(Schema.string),
    Value: Schema.optional(Schema.array(Schema.string)),
}) {}

export class Plugin extends Schema.Class<Plugin>()({
    Id: Schema.optional(Schema.string),
    Name: Schema.string,

    /**
     * True if the plugin is running. False if the plugin is not running, only
     * installed.
     */
    Enabled: Schema.boolean,

    /** Settings that can be modified by users. */
    Settings: Schema.struct({
        Mounts: Schema.optional(
            Schema.array(
                Schema.struct({
                    Name: Schema.string,
                    Description: Schema.string,
                    Settable: Schema.optional(Schema.array(Schema.string)),
                    Source: Schema.string,
                    Destination: Schema.string,
                    Type: Schema.string,
                    Options: Schema.optional(Schema.array(Schema.string)),
                })
            )
        ),
        Env: Schema.optional(Schema.array(Schema.string)),
        Args: Schema.optional(Schema.array(Schema.string)),
        Devices: Schema.optional(
            Schema.array(
                Schema.struct({
                    Name: Schema.string,
                    Description: Schema.string,
                    Settable: Schema.optional(Schema.array(Schema.string)),
                    Path: Schema.string,
                })
            )
        ),
    }),

    /** Plugin remote reference used to push/pull the plugin */
    PluginReference: Schema.optional(Schema.string),

    /** The config of a plugin. */
    Config: Schema.struct({
        /** Docker Version used to create the plugin */
        DockerVersion: Schema.optional(Schema.string),
        Description: Schema.string,
        Documentation: Schema.string,

        /** The interface between Docker and the plugin */
        Interface: Schema.struct({
            Types: Schema.optional(
                Schema.array(
                    Schema.struct({ Prefix: Schema.string, Capability: Schema.string, Version: Schema.string })
                )
            ),
            Socket: Schema.string,

            /** Protocol to use for clients connecting to the plugin. */
            ProtocolScheme: Schema.enums(Plugin_Config_Interface_ProtocolScheme),
        }),
        Entrypoint: Schema.optional(Schema.array(Schema.string)),
        WorkDir: Schema.string,
        User: Schema.optional(
            Schema.struct({ UID: Schema.optional(Schema.number), GID: Schema.optional(Schema.number) })
        ),
        Network: Schema.struct({ Type: Schema.string }),
        Linux: Schema.struct({
            Capabilities: Schema.optional(Schema.array(Schema.string)),
            AllowAllDevices: Schema.boolean,
            Devices: Schema.optional(
                Schema.array(
                    Schema.struct({
                        Name: Schema.string,
                        Description: Schema.string,
                        Settable: Schema.optional(Schema.array(Schema.string)),
                        Path: Schema.string,
                    })
                )
            ),
        }),
        PropagatedMount: Schema.string,
        IpcHost: Schema.boolean,
        PidHost: Schema.boolean,
        Mounts: Schema.optional(
            Schema.array(
                Schema.struct({
                    Name: Schema.string,
                    Description: Schema.string,
                    Settable: Schema.optional(Schema.array(Schema.string)),
                    Source: Schema.string,
                    Destination: Schema.string,
                    Type: Schema.string,
                    Options: Schema.optional(Schema.array(Schema.string)),
                })
            )
        ),
        Env: Schema.optional(
            Schema.array(
                Schema.struct({
                    Name: Schema.string,
                    Description: Schema.string,
                    Settable: Schema.optional(Schema.array(Schema.string)),
                    Value: Schema.string,
                })
            )
        ),
        Args: Schema.struct({
            Name: Schema.string,
            Description: Schema.string,
            Settable: Schema.optional(Schema.array(Schema.string)),
            Value: Schema.optional(Schema.array(Schema.string)),
        }),
        rootfs: Schema.optional(
            Schema.struct({
                type: Schema.optional(Schema.string),
                diff_ids: Schema.optional(Schema.array(Schema.string)),
            })
        ),
    }),
}) {}

export class ObjectVersion extends Schema.Class<ObjectVersion>()({ Index: Schema.optional(Schema.number) }) {}

export class NodeSpec extends Schema.Class<NodeSpec>()({
    /** Name for the node. */
    Name: Schema.optional(Schema.string),

    /** User-defined key/value metadata. */
    Labels: Schema.optional(Schema.struct({})),

    /** Role of the node. */
    Role: Schema.enums(NodeSpec_Role),

    /** Availability of the node. */
    Availability: Schema.enums(NodeSpec_Availability),
}) {}

export class Node extends Schema.Class<Node>()({
    ID: Schema.optional(Schema.string),

    /**
     * The version number of the object such as node, service, etc. This is
     * needed to avoid conflicting writes. The client must send the version
     * number along with the modified specification when updating these
     * objects.
     *
     * This approach ensures safe concurrency and determinism in that the change
     * on the object may not be applied if the version number has changed from
     * the last read. In other words, if two update requests specify the same
     * base version, only one of the requests can succeed. As a result, two
     * separate update requests that happen at the same time will not
     * unintentionally overwrite each other.
     */
    Version: Schema.optional(Schema.struct({ Index: Schema.optional(Schema.number) })),

    /**
     * Date and time at which the node was added to the swarm in [RFC
     * 3339](https://www.ietf.org/rfc/rfc3339.txt) format with nano-seconds.
     */
    CreatedAt: Schema.optional(Schema.string),

    /**
     * Date and time at which the node was last updated in [RFC
     * 3339](https://www.ietf.org/rfc/rfc3339.txt) format with nano-seconds.
     */
    UpdatedAt: Schema.optional(Schema.string),
    Spec: Schema.optional(
        Schema.struct({
            /** Name for the node. */
            Name: Schema.optional(Schema.string),

            /** User-defined key/value metadata. */
            Labels: Schema.optional(Schema.struct({})),

            /** Role of the node. */
            Role: Schema.enums(Node_Spec_Role),

            /** Availability of the node. */
            Availability: Schema.enums(Node_Spec_Availability),
        })
    ),

    /**
     * NodeDescription encapsulates the properties of the Node as reported by
     * the agent.
     */
    Description: Schema.optional(
        Schema.struct({
            Hostname: Schema.optional(Schema.string),

            /** Platform represents the platform (Arch/OS). */
            Platform: Schema.optional(
                Schema.struct({
                    /**
                     * Architecture represents the hardware architecture (for
                     * example, `x86_64`).
                     */
                    Architecture: Schema.optional(Schema.string),

                    /**
                     * OS represents the Operating System (for example, `linux`
                     * or `windows`).
                     */
                    OS: Schema.optional(Schema.string),
                })
            ),

            /**
             * An object describing the resources which can be advertised by a
             * node and requested by a task.
             */
            Resources: Schema.optional(
                Schema.struct({
                    NanoCPUs: Schema.optional(Schema.number),
                    MemoryBytes: Schema.optional(Schema.number),

                    /**
                     * User-defined resources can be either Integer resources
                     * (e.g, `SSD=3`) or String resources (e.g, `GPU=UUID1`).
                     */
                    GenericResources: Schema.optional(
                        Schema.array(
                            Schema.struct({
                                NamedResourceSpec: Schema.optional(
                                    Schema.struct({
                                        Kind: Schema.optional(Schema.string),
                                        Value: Schema.optional(Schema.string),
                                    })
                                ),
                                DiscreteResourceSpec: Schema.optional(
                                    Schema.struct({
                                        Kind: Schema.optional(Schema.string),
                                        Value: Schema.optional(Schema.number),
                                    })
                                ),
                            })
                        )
                    ),
                })
            ),

            /** EngineDescription provides information about an engine. */
            Engine: Schema.optional(
                Schema.struct({
                    EngineVersion: Schema.optional(Schema.string),
                    Labels: Schema.optional(Schema.struct({})),
                    Plugins: Schema.optional(
                        Schema.array(
                            Schema.struct({
                                Type: Schema.optional(Schema.string),
                                Name: Schema.optional(Schema.string),
                            })
                        )
                    ),
                })
            ),

            /**
             * Information about the issuer of leaf TLS certificates and the
             * trusted root CA certificate.
             */
            TLSInfo: Schema.optional(
                Schema.struct({
                    /**
                     * The root CA certificate(s) that are used to validate leaf
                     * TLS certificates.
                     */
                    TrustRoot: Schema.optional(Schema.string),

                    /**
                     * The base64-url-safe-encoded raw subject bytes of the
                     * issuer.
                     */
                    CertIssuerSubject: Schema.optional(Schema.string),

                    /**
                     * The base64-url-safe-encoded raw public key bytes of the
                     * issuer.
                     */
                    CertIssuerPublicKey: Schema.optional(Schema.string),
                })
            ),
        })
    ),

    /**
     * NodeStatus represents the status of a node.
     *
     * It provides the current status of the node, as seen by the manager.
     */
    Status: Schema.optional(
        Schema.struct({
            /** NodeState represents the state of a node. */
            State: Schema.enums(Node_Status_State),
            Message: Schema.optional(Schema.string),

            /** IP address of the node. */
            Addr: Schema.optional(Schema.string),
        })
    ),

    /**
     * ManagerStatus represents the status of a manager.
     *
     * It provides the current status of a node's manager component, if the node
     * is a manager.
     */
    ManagerStatus: Schema.optional(
        Schema.nullable(
            Schema.struct({
                Leader: Schema.optional(Schema.boolean),

                /** Reachability represents the reachability of a node. */
                Reachability: Schema.enums(Node_ManagerStatus_Reachability),

                /** The IP address and port at which the manager is reachable. */
                Addr: Schema.optional(Schema.string),
            })
        )
    ),
}) {}

export class NodeDescription extends Schema.Class<NodeDescription>()({
    Hostname: Schema.optional(Schema.string),

    /** Platform represents the platform (Arch/OS). */
    Platform: Schema.optional(
        Schema.struct({
            /**
             * Architecture represents the hardware architecture (for example,
             * `x86_64`).
             */
            Architecture: Schema.optional(Schema.string),

            /**
             * OS represents the Operating System (for example, `linux` or
             * `windows`).
             */
            OS: Schema.optional(Schema.string),
        })
    ),

    /**
     * An object describing the resources which can be advertised by a node and
     * requested by a task.
     */
    Resources: Schema.optional(
        Schema.struct({
            NanoCPUs: Schema.optional(Schema.number),
            MemoryBytes: Schema.optional(Schema.number),

            /**
             * User-defined resources can be either Integer resources (e.g,
             * `SSD=3`) or String resources (e.g, `GPU=UUID1`).
             */
            GenericResources: Schema.optional(
                Schema.array(
                    Schema.struct({
                        NamedResourceSpec: Schema.optional(
                            Schema.struct({
                                Kind: Schema.optional(Schema.string),
                                Value: Schema.optional(Schema.string),
                            })
                        ),
                        DiscreteResourceSpec: Schema.optional(
                            Schema.struct({
                                Kind: Schema.optional(Schema.string),
                                Value: Schema.optional(Schema.number),
                            })
                        ),
                    })
                )
            ),
        })
    ),

    /** EngineDescription provides information about an engine. */
    Engine: Schema.optional(
        Schema.struct({
            EngineVersion: Schema.optional(Schema.string),
            Labels: Schema.optional(Schema.struct({})),
            Plugins: Schema.optional(
                Schema.array(
                    Schema.struct({ Type: Schema.optional(Schema.string), Name: Schema.optional(Schema.string) })
                )
            ),
        })
    ),

    /**
     * Information about the issuer of leaf TLS certificates and the trusted
     * root CA certificate.
     */
    TLSInfo: Schema.optional(
        Schema.struct({
            /**
             * The root CA certificate(s) that are used to validate leaf TLS
             * certificates.
             */
            TrustRoot: Schema.optional(Schema.string),

            /** The base64-url-safe-encoded raw subject bytes of the issuer. */
            CertIssuerSubject: Schema.optional(Schema.string),

            /** The base64-url-safe-encoded raw public key bytes of the issuer. */
            CertIssuerPublicKey: Schema.optional(Schema.string),
        })
    ),
}) {}

export class Platform extends Schema.Class<Platform>()({
    /**
     * Architecture represents the hardware architecture (for example,
     * `x86_64`).
     */
    Architecture: Schema.optional(Schema.string),

    /** OS represents the Operating System (for example, `linux` or `windows`). */
    OS: Schema.optional(Schema.string),
}) {}

export class EngineDescription extends Schema.Class<EngineDescription>()({
    EngineVersion: Schema.optional(Schema.string),
    Labels: Schema.optional(Schema.struct({})),
    Plugins: Schema.optional(
        Schema.array(Schema.struct({ Type: Schema.optional(Schema.string), Name: Schema.optional(Schema.string) }))
    ),
}) {}

export class TLSInfo extends Schema.Class<TLSInfo>()({
    /**
     * The root CA certificate(s) that are used to validate leaf TLS
     * certificates.
     */
    TrustRoot: Schema.optional(Schema.string),

    /** The base64-url-safe-encoded raw subject bytes of the issuer. */
    CertIssuerSubject: Schema.optional(Schema.string),

    /** The base64-url-safe-encoded raw public key bytes of the issuer. */
    CertIssuerPublicKey: Schema.optional(Schema.string),
}) {}

export class NodeStatus extends Schema.Class<NodeStatus>()({
    /** NodeState represents the state of a node. */
    State: Schema.enums(NodeStatus_State),
    Message: Schema.optional(Schema.string),

    /** IP address of the node. */
    Addr: Schema.optional(Schema.string),
}) {}

export class ManagerStatus extends Schema.Class<ManagerStatus>()({
    Leader: Schema.optional(Schema.boolean),

    /** Reachability represents the reachability of a node. */
    Reachability: Schema.enums(ManagerStatus_Reachability),

    /** The IP address and port at which the manager is reachable. */
    Addr: Schema.optional(Schema.string),
}) {}

export class SwarmSpec extends Schema.Class<SwarmSpec>()({
    /** Name of the swarm. */
    Name: Schema.optional(Schema.string),

    /** User-defined key/value metadata. */
    Labels: Schema.optional(Schema.struct({})),

    /** Orchestration configuration. */
    Orchestration: Schema.optional(
        Schema.nullable(
            Schema.struct({
                /**
                 * The number of historic tasks to keep per instance or node. If
                 * negative, never remove completed or failed tasks.
                 */
                TaskHistoryRetentionLimit: Schema.optional(Schema.number),
            })
        )
    ),

    /** Raft configuration. */
    Raft: Schema.optional(
        Schema.struct({
            /** The number of log entries between snapshots. */
            SnapshotInterval: Schema.optional(Schema.number),

            /** The number of snapshots to keep beyond the current snapshot. */
            KeepOldSnapshots: Schema.optional(Schema.number),

            /**
             * The number of log entries to keep around to sync up slow
             * followers after a snapshot is created.
             */
            LogEntriesForSlowFollowers: Schema.optional(Schema.number),

            /**
             * The number of ticks that a follower will wait for a message from
             * the leader before becoming a candidate and starting an election.
             * `ElectionTick` must be greater than `HeartbeatTick`.
             *
             * A tick currently defaults to one second, so these translate
             * directly to seconds currently, but this is NOT guaranteed.
             */
            ElectionTick: Schema.optional(Schema.number),

            /**
             * The number of ticks between heartbeats. Every HeartbeatTick
             * ticks, the leader will send a heartbeat to the followers.
             *
             * A tick currently defaults to one second, so these translate
             * directly to seconds currently, but this is NOT guaranteed.
             */
            HeartbeatTick: Schema.optional(Schema.number),
        })
    ),

    /** Dispatcher configuration. */
    Dispatcher: Schema.optional(
        Schema.nullable(
            Schema.struct({
                /** The delay for an agent to send a heartbeat to the dispatcher. */
                HeartbeatPeriod: Schema.optional(Schema.number),
            })
        )
    ),

    /** CA configuration. */
    CAConfig: Schema.optional(
        Schema.nullable(
            Schema.struct({
                /** The duration node certificates are issued for. */
                NodeCertExpiry: Schema.optional(Schema.number),

                /**
                 * Configuration for forwarding signing requests to an external
                 * certificate authority.
                 */
                ExternalCAs: Schema.optional(
                    Schema.array(
                        Schema.struct({
                            /**
                             * Protocol for communication with the external CA
                             * (currently only `cfssl` is supported).
                             */
                            Protocol: Schema.optional(
                                Schema.enums(SwarmSpec_CAConfig_ExternalCAs_ExternalCAs_Protocol)
                            ).withDefault(() => SwarmSpec_CAConfig_ExternalCAs_ExternalCAs_Protocol.CFSSL),

                            /**
                             * URL where certificate signing requests should be
                             * sent.
                             */
                            URL: Schema.optional(Schema.string),

                            /**
                             * An object with key/value pairs that are
                             * interpreted as protocol-specific options for the
                             * external CA driver.
                             */
                            Options: Schema.optional(Schema.struct({})),

                            /**
                             * The root CA certificate (in PEM format) this
                             * external CA uses to issue TLS certificates
                             * (assumed to be to the current swarm root CA
                             * certificate if not provided).
                             */
                            CACert: Schema.optional(Schema.string),
                        })
                    )
                ),

                /**
                 * The desired signing CA certificate for all swarm node TLS
                 * leaf certificates, in PEM format.
                 */
                SigningCACert: Schema.optional(Schema.string),

                /**
                 * The desired signing CA key for all swarm node TLS leaf
                 * certificates, in PEM format.
                 */
                SigningCAKey: Schema.optional(Schema.string),

                /**
                 * An integer whose purpose is to force swarm to generate a new
                 * signing CA certificate and key, if none have been specified
                 * in `SigningCACert` and `SigningCAKey`
                 */
                ForceRotate: Schema.optional(Schema.number),
            })
        )
    ),

    /** Parameters related to encryption-at-rest. */
    EncryptionConfig: Schema.optional(
        Schema.struct({
            /**
             * If set, generate a key and use it to lock data stored on the
             * managers.
             */
            AutoLockManagers: Schema.optional(Schema.boolean),
        })
    ),

    /** Defaults for creating tasks in this cluster. */
    TaskDefaults: Schema.optional(
        Schema.struct({
            /**
             * The log driver to use for tasks created in the orchestrator if
             * unspecified by a service.
             *
             * Updating this value only affects new tasks. Existing tasks
             * continue to use their previously configured log driver until
             * recreated.
             */
            LogDriver: Schema.optional(
                Schema.struct({
                    /** The log driver to use as a default for new tasks. */
                    Name: Schema.optional(Schema.string),

                    /**
                     * Driver-specific options for the selectd log driver,
                     * specified as key/value pairs.
                     */
                    Options: Schema.optional(Schema.struct({})),
                })
            ),
        })
    ),
}) {}

export class ClusterInfo extends Schema.Class<ClusterInfo>()({
    /** The ID of the swarm. */
    ID: Schema.optional(Schema.string),

    /**
     * The version number of the object such as node, service, etc. This is
     * needed to avoid conflicting writes. The client must send the version
     * number along with the modified specification when updating these
     * objects.
     *
     * This approach ensures safe concurrency and determinism in that the change
     * on the object may not be applied if the version number has changed from
     * the last read. In other words, if two update requests specify the same
     * base version, only one of the requests can succeed. As a result, two
     * separate update requests that happen at the same time will not
     * unintentionally overwrite each other.
     */
    Version: Schema.optional(Schema.struct({ Index: Schema.optional(Schema.number) })),

    /**
     * Date and time at which the swarm was initialised in [RFC
     * 3339](https://www.ietf.org/rfc/rfc3339.txt) format with nano-seconds.
     */
    CreatedAt: Schema.optional(Schema.string),

    /**
     * Date and time at which the swarm was last updated in [RFC
     * 3339](https://www.ietf.org/rfc/rfc3339.txt) format with nano-seconds.
     */
    UpdatedAt: Schema.optional(Schema.string),

    /** User modifiable swarm configuration. */
    Spec: Schema.optional(
        Schema.struct({
            /** Name of the swarm. */
            Name: Schema.optional(Schema.string),

            /** User-defined key/value metadata. */
            Labels: Schema.optional(Schema.struct({})),

            /** Orchestration configuration. */
            Orchestration: Schema.optional(
                Schema.nullable(
                    Schema.struct({
                        /**
                         * The number of historic tasks to keep per instance or
                         * node. If negative, never remove completed or failed
                         * tasks.
                         */
                        TaskHistoryRetentionLimit: Schema.optional(Schema.number),
                    })
                )
            ),

            /** Raft configuration. */
            Raft: Schema.optional(
                Schema.struct({
                    /** The number of log entries between snapshots. */
                    SnapshotInterval: Schema.optional(Schema.number),

                    /**
                     * The number of snapshots to keep beyond the current
                     * snapshot.
                     */
                    KeepOldSnapshots: Schema.optional(Schema.number),

                    /**
                     * The number of log entries to keep around to sync up slow
                     * followers after a snapshot is created.
                     */
                    LogEntriesForSlowFollowers: Schema.optional(Schema.number),

                    /**
                     * The number of ticks that a follower will wait for a
                     * message from the leader before becoming a candidate and
                     * starting an election. `ElectionTick` must be greater than
                     * `HeartbeatTick`.
                     *
                     * A tick currently defaults to one second, so these
                     * translate directly to seconds currently, but this is NOT
                     * guaranteed.
                     */
                    ElectionTick: Schema.optional(Schema.number),

                    /**
                     * The number of ticks between heartbeats. Every
                     * HeartbeatTick ticks, the leader will send a heartbeat to
                     * the followers.
                     *
                     * A tick currently defaults to one second, so these
                     * translate directly to seconds currently, but this is NOT
                     * guaranteed.
                     */
                    HeartbeatTick: Schema.optional(Schema.number),
                })
            ),

            /** Dispatcher configuration. */
            Dispatcher: Schema.optional(
                Schema.nullable(
                    Schema.struct({
                        /**
                         * The delay for an agent to send a heartbeat to the
                         * dispatcher.
                         */
                        HeartbeatPeriod: Schema.optional(Schema.number),
                    })
                )
            ),

            /** CA configuration. */
            CAConfig: Schema.optional(
                Schema.nullable(
                    Schema.struct({
                        /** The duration node certificates are issued for. */
                        NodeCertExpiry: Schema.optional(Schema.number),

                        /**
                         * Configuration for forwarding signing requests to an
                         * external certificate authority.
                         */
                        ExternalCAs: Schema.optional(
                            Schema.array(
                                Schema.struct({
                                    /**
                                     * Protocol for communication with the
                                     * external CA (currently only `cfssl` is
                                     * supported).
                                     */
                                    Protocol: Schema.optional(
                                        Schema.enums(ClusterInfo_Spec_CAConfig_ExternalCAs_ExternalCAs_Protocol)
                                    ).withDefault(
                                        () => ClusterInfo_Spec_CAConfig_ExternalCAs_ExternalCAs_Protocol.CFSSL
                                    ),

                                    /**
                                     * URL where certificate signing requests
                                     * should be sent.
                                     */
                                    URL: Schema.optional(Schema.string),

                                    /**
                                     * An object with key/value pairs that are
                                     * interpreted as protocol-specific options
                                     * for the external CA driver.
                                     */
                                    Options: Schema.optional(Schema.struct({})),

                                    /**
                                     * The root CA certificate (in PEM format)
                                     * this external CA uses to issue TLS
                                     * certificates (assumed to be to the
                                     * current swarm root CA certificate if not
                                     * provided).
                                     */
                                    CACert: Schema.optional(Schema.string),
                                })
                            )
                        ),

                        /**
                         * The desired signing CA certificate for all swarm node
                         * TLS leaf certificates, in PEM format.
                         */
                        SigningCACert: Schema.optional(Schema.string),

                        /**
                         * The desired signing CA key for all swarm node TLS
                         * leaf certificates, in PEM format.
                         */
                        SigningCAKey: Schema.optional(Schema.string),

                        /**
                         * An integer whose purpose is to force swarm to
                         * generate a new signing CA certificate and key, if
                         * none have been specified in `SigningCACert` and
                         * `SigningCAKey`
                         */
                        ForceRotate: Schema.optional(Schema.number),
                    })
                )
            ),

            /** Parameters related to encryption-at-rest. */
            EncryptionConfig: Schema.optional(
                Schema.struct({
                    /**
                     * If set, generate a key and use it to lock data stored on
                     * the managers.
                     */
                    AutoLockManagers: Schema.optional(Schema.boolean),
                })
            ),

            /** Defaults for creating tasks in this cluster. */
            TaskDefaults: Schema.optional(
                Schema.struct({
                    /**
                     * The log driver to use for tasks created in the
                     * orchestrator if unspecified by a service.
                     *
                     * Updating this value only affects new tasks. Existing
                     * tasks continue to use their previously configured log
                     * driver until recreated.
                     */
                    LogDriver: Schema.optional(
                        Schema.struct({
                            /** The log driver to use as a default for new tasks. */
                            Name: Schema.optional(Schema.string),

                            /**
                             * Driver-specific options for the selectd log
                             * driver, specified as key/value pairs.
                             */
                            Options: Schema.optional(Schema.struct({})),
                        })
                    ),
                })
            ),
        })
    ),

    /**
     * Information about the issuer of leaf TLS certificates and the trusted
     * root CA certificate.
     */
    TLSInfo: Schema.optional(
        Schema.struct({
            /**
             * The root CA certificate(s) that are used to validate leaf TLS
             * certificates.
             */
            TrustRoot: Schema.optional(Schema.string),

            /** The base64-url-safe-encoded raw subject bytes of the issuer. */
            CertIssuerSubject: Schema.optional(Schema.string),

            /** The base64-url-safe-encoded raw public key bytes of the issuer. */
            CertIssuerPublicKey: Schema.optional(Schema.string),
        })
    ),

    /** Whether there is currently a root CA rotation in progress for the swarm */
    RootRotationInProgress: Schema.optional(Schema.boolean),

    /**
     * DataPathPort specifies the data path port number for data traffic.
     * Acceptable port range is 1024 to 49151. If no port is set or is set to 0,
     * the default port (4789) is used.
     */
    DataPathPort: Schema.optional(Schema.number).withDefault(() => 4789),

    /**
     * Default Address Pool specifies default subnet pools for global scope
     * networks.
     */
    DefaultAddrPool: Schema.optional(Schema.array(Schema.string)),

    /**
     * SubnetSize specifies the subnet size of the networks created from the
     * default subnet pool.
     */
    SubnetSize: Schema.optional(Schema.number).withDefault(() => 24),
}) {}

export class JoinTokens extends Schema.Class<JoinTokens>()({
    /** The token workers can use to join the swarm. */
    Worker: Schema.optional(Schema.string),

    /** The token managers can use to join the swarm. */
    Manager: Schema.optional(Schema.string),
}) {}

export class Swarm extends Schema.Class<Swarm>()({}) {}

export class TaskSpec extends Schema.Class<TaskSpec>()({
    /**
     * Plugin spec for the service. _(Experimental release only.)_<p><br /></p>>
     * **Note**: ContainerSpec, NetworkAttachmentSpec, and> PluginSpec are
     * mutually exclusive. PluginSpec is only used when the> Runtime field is
     * set to `plugin`. NetworkAttachmentSpec is used when the> Runtime field is
     * set to `attachment`.
     */
    PluginSpec: Schema.optional(
        Schema.struct({
            /** The name or 'alias' to use for the plugin. */
            Name: Schema.optional(Schema.string),

            /** The plugin image reference to use. */
            Remote: Schema.optional(Schema.string),

            /** Disable the plugin once scheduled. */
            Disabled: Schema.optional(Schema.boolean),
            PluginPrivilege: Schema.optional(
                Schema.array(
                    Schema.struct({
                        Name: Schema.optional(Schema.string),
                        Description: Schema.optional(Schema.string),
                        Value: Schema.optional(Schema.array(Schema.string)),
                    })
                )
            ),
        })
    ),

    /**
     * Container spec for the service.<p><br /></p>> **Note**: ContainerSpec,
     * NetworkAttachmentSpec, and> PluginSpec are mutually exclusive. PluginSpec
     * is only used when the> Runtime field is set to `plugin`.
     * NetworkAttachmentSpec is used when the> Runtime field is set to
     * `attachment`.
     */
    ContainerSpec: Schema.optional(
        Schema.struct({
            /** The image name to use for the container */
            Image: Schema.optional(Schema.string),

            /** User-defined key/value data. */
            Labels: Schema.optional(Schema.struct({})),

            /** The command to be run in the image. */
            Command: Schema.optional(Schema.array(Schema.string)),

            /** Arguments to the command. */
            Args: Schema.optional(Schema.array(Schema.string)),

            /**
             * The hostname to use for the container, as a valid [RFC
             * 1123](https://tools.ietf.org/html/rfc1123) hostname.
             */
            Hostname: Schema.optional(Schema.string),

            /** A list of environment variables in the form `VAR=value`. */
            Env: Schema.optional(Schema.array(Schema.string)),

            /** The working directory for commands to run in. */
            Dir: Schema.optional(Schema.string),

            /** The user inside the container. */
            User: Schema.optional(Schema.string),

            /**
             * A list of additional groups that the container process will run
             * as.
             */
            Groups: Schema.optional(Schema.array(Schema.string)),

            /** Security options for the container */
            Privileges: Schema.optional(
                Schema.struct({
                    /** CredentialSpec for managed service account (Windows only) */
                    CredentialSpec: Schema.optional(
                        Schema.struct({
                            /**
                             * Load credential spec from a Swarm Config with the
                             * given ID. The specified config must also be
                             * present in the Configs field with the Runtime
                             * property set.<p><br /></p>> **Note**:
                             * `CredentialSpec.File`,
                             * `CredentialSpec.Registry`,> And
                             * `CredentialSpec.Config` are mutually> Exclusive.
                             */
                            Config: Schema.optional(Schema.string),

                            /**
                             * Load credential spec from this file. The file is
                             * read by the daemon, and must be present in the
                             * `CredentialSpecs` subdirectory in the docker data
                             * directory, which defaults to
                             * `C:\ProgramData\Docker\` on Windows.
                             *
                             * For example, specifying `spec.json` loads
                             * `C:\ProgramData\Docker\CredentialSpecs\spec.json`.<p><br
                             * /></p>> **Note**: `CredentialSpec.File`,
                             * `CredentialSpec.Registry`,> And
                             * `CredentialSpec.Config` are mutually> Exclusive.
                             */
                            File: Schema.optional(Schema.string),

                            /**
                             * Load credential spec from this value in the
                             * Windows registry. The specified registry value
                             * must be located in:
                             *
                             * `HKLM\SOFTWARE\Microsoft\Windows
                             * NT\CurrentVersion\Virtualization\Containers\CredentialSpecs`<p><br
                             * /></p>> **Note**: `CredentialSpec.File`,
                             * `CredentialSpec.Registry`,> And
                             * `CredentialSpec.Config` are mutually> Exclusive.
                             */
                            Registry: Schema.optional(Schema.string),
                        })
                    ),

                    /** SELinux labels of the container */
                    SELinuxContext: Schema.optional(
                        Schema.struct({
                            /** Disable SELinux */
                            Disable: Schema.optional(Schema.boolean),

                            /** SELinux user label */
                            User: Schema.optional(Schema.string),

                            /** SELinux role label */
                            Role: Schema.optional(Schema.string),

                            /** SELinux type label */
                            Type: Schema.optional(Schema.string),

                            /** SELinux level label */
                            Level: Schema.optional(Schema.string),
                        })
                    ),

                    /** Options for configuring seccomp on the container */
                    Seccomp: Schema.optional(
                        Schema.struct({
                            Mode: Schema.enums(TaskSpec_ContainerSpec_Privileges_Seccomp_Mode),

                            /** The custom seccomp profile as a json object */
                            Profile: Schema.optional(Schema.string),
                        })
                    ),

                    /** Options for configuring AppArmor on the container */
                    AppArmor: Schema.optional(
                        Schema.struct({ Mode: Schema.enums(TaskSpec_ContainerSpec_Privileges_AppArmor_Mode) })
                    ),

                    /** Configuration of the no_new_privs bit in the container */
                    NoNewPrivileges: Schema.optional(Schema.boolean),
                })
            ),

            /** Whether a pseudo-TTY should be allocated. */
            TTY: Schema.optional(Schema.boolean),

            /** Open `stdin` */
            OpenStdin: Schema.optional(Schema.boolean),

            /** Mount the container's root filesystem as read only. */
            ReadOnly: Schema.optional(Schema.boolean),

            /**
             * Specification for mounts to be added to containers created as
             * part of the service.
             */
            Mounts: Schema.optional(
                Schema.array(
                    Schema.struct({
                        /** Container path. */
                        Target: Schema.optional(Schema.string),

                        /** Mount source (e.g. a volume name, a host path). */
                        Source: Schema.optional(Schema.string),

                        /**
                         * The mount type. Available types:
                         *
                         * - `bind` Mounts a file or directory from the host into
                         *   the container. Must exist prior to creating the
                         *   container.
                         * - `volume` Creates a volume with the given name and
                         *   options (or uses a pre-existing volume with the
                         *   same name and options). These are **not** removed
                         *   when the container is removed.
                         * - `tmpfs` Create a tmpfs with the given options. The
                         *   mount source cannot be specified for tmpfs.
                         * - `npipe` Mounts a named pipe from the host into the
                         *   container. Must exist prior to creating the
                         *   container.
                         * - `cluster` a Swarm cluster volume
                         */
                        Type: Schema.enums(TaskSpec_ContainerSpec_Mounts_Mounts_Type),

                        /** Whether the mount should be read-only. */
                        ReadOnly: Schema.optional(Schema.boolean),

                        /**
                         * The consistency requirement for the mount: `default`,
                         * `consistent`, `cached`, or `delegated`.
                         */
                        Consistency: Schema.optional(Schema.string),

                        /** Optional configuration for the `bind` type. */
                        BindOptions: Schema.optional(
                            Schema.struct({
                                /**
                                 * A propagation mode with the value
                                 * `[r]private`, `[r]shared`, or `[r]slave`.
                                 */
                                Propagation: Schema.enums(TaskSpec_ContainerSpec_Mounts_Mounts_BindOptions_Propagation),

                                /** Disable recursive bind mount. */
                                NonRecursive: Schema.optional(Schema.boolean),

                                /** Create mount point on host if missing */
                                CreateMountpoint: Schema.optional(Schema.boolean),

                                /**
                                 * Make the mount non-recursively read-only, but
                                 * still leave the mount recursive (unless
                                 * NonRecursive is set to true in conjunction).
                                 */
                                ReadOnlyNonRecursive: Schema.optional(Schema.boolean),

                                /**
                                 * Raise an error if the mount cannot be made
                                 * recursively read-only.
                                 */
                                ReadOnlyForceRecursive: Schema.optional(Schema.boolean),
                            })
                        ),

                        /** Optional configuration for the `volume` type. */
                        VolumeOptions: Schema.optional(
                            Schema.struct({
                                /** Populate volume with data from the target. */
                                NoCopy: Schema.optional(Schema.boolean),

                                /** User-defined key/value metadata. */
                                Labels: Schema.optional(Schema.struct({})),

                                /** Map of driver specific options */
                                DriverConfig: Schema.optional(
                                    Schema.struct({
                                        /**
                                         * Name of the driver to use to create
                                         * the volume.
                                         */
                                        Name: Schema.optional(Schema.string),

                                        /**
                                         * Key/value map of driver specific
                                         * options.
                                         */
                                        Options: Schema.optional(Schema.struct({})),
                                    })
                                ),
                            })
                        ),

                        /** Optional configuration for the `tmpfs` type. */
                        TmpfsOptions: Schema.optional(
                            Schema.struct({
                                /** The size for the tmpfs mount in bytes. */
                                SizeBytes: Schema.optional(Schema.number),

                                /**
                                 * The permission mode for the tmpfs mount in an
                                 * integer.
                                 */
                                Mode: Schema.optional(Schema.number),
                            })
                        ),
                    })
                )
            ),

            /** Signal to stop the container. */
            StopSignal: Schema.optional(Schema.string),

            /**
             * Amount of time to wait for the container to terminate before
             * forcefully killing it.
             */
            StopGracePeriod: Schema.optional(Schema.number),

            /** A test to perform to check that the container is healthy. */
            HealthCheck: Schema.optional(
                Schema.struct({
                    /**
                     * The test to perform. Possible values are:
                     *
                     * - `[]` inherit healthcheck from image or parent image
                     * - `["NONE"]` disable healthcheck
                     * - `["CMD", args...]` exec arguments directly
                     * - `["CMD-SHELL", command]` run command with system's
                     *   default shell
                     */
                    Test: Schema.optional(Schema.array(Schema.string)),

                    /**
                     * The time to wait between checks in nanoseconds. It should
                     * be 0 or at least 1000000 (1 ms). 0 means inherit.
                     */
                    Interval: Schema.optional(Schema.number),

                    /**
                     * The time to wait before considering the check to have
                     * hung. It should be 0 or at least 1000000 (1 ms). 0 means
                     * inherit.
                     */
                    Timeout: Schema.optional(Schema.number),

                    /**
                     * The number of consecutive failures needed to consider a
                     * container as unhealthy. 0 means inherit.
                     */
                    Retries: Schema.optional(Schema.number),

                    /**
                     * Start period for the container to initialize before
                     * starting health-retries countdown in nanoseconds. It
                     * should be 0 or at least 1000000 (1 ms). 0 means inherit.
                     */
                    StartPeriod: Schema.optional(Schema.number),

                    /**
                     * The time to wait between checks in nanoseconds during the
                     * start period. It should be 0 or at least 1000000 (1 ms).
                     * 0 means inherit.
                     */
                    StartInterval: Schema.optional(Schema.number),
                })
            ),

            /**
             * A list of hostname/IP mappings to add to the container's `hosts`
             * file. The format of extra hosts is specified in the
             * [hosts(5)](http://man7.org/linux/man-pages/man5/hosts.5.html) man
             * page:
             *
             *     IP_address canonical_hostname [aliases...]
             */
            Hosts: Schema.optional(Schema.array(Schema.string)),

            /**
             * Specification for DNS related configurations in resolver
             * configuration file (`resolv.conf`).
             */
            DNSConfig: Schema.optional(
                Schema.struct({
                    /** The IP addresses of the name servers. */
                    Nameservers: Schema.optional(Schema.array(Schema.string)),

                    /** A search list for host-name lookup. */
                    Search: Schema.optional(Schema.array(Schema.string)),

                    /**
                     * A list of internal resolver variables to be modified
                     * (e.g., `debug`, `ndots:3`, etc.).
                     */
                    Options: Schema.optional(Schema.array(Schema.string)),
                })
            ),

            /**
             * Secrets contains references to zero or more secrets that will be
             * exposed to the service.
             */
            Secrets: Schema.optional(
                Schema.array(
                    Schema.struct({
                        /**
                         * File represents a specific target that is backed by a
                         * file.
                         */
                        File: Schema.optional(
                            Schema.struct({
                                /**
                                 * Name represents the final filename in the
                                 * filesystem.
                                 */
                                Name: Schema.optional(Schema.string),

                                /** UID represents the file UID. */
                                UID: Schema.optional(Schema.string),

                                /** GID represents the file GID. */
                                GID: Schema.optional(Schema.string),

                                /** Mode represents the FileMode of the file. */
                                Mode: Schema.optional(Schema.number),
                            })
                        ),

                        /**
                         * SecretID represents the ID of the specific secret
                         * that we're referencing.
                         */
                        SecretID: Schema.optional(Schema.string),

                        /**
                         * SecretName is the name of the secret that this
                         * references, but this is just provided for
                         * lookup/display purposes. The secret in the reference
                         * will be identified by its ID.
                         */
                        SecretName: Schema.optional(Schema.string),
                    })
                )
            ),

            /**
             * Configs contains references to zero or more configs that will be
             * exposed to the service.
             */
            Configs: Schema.optional(
                Schema.array(
                    Schema.struct({
                        /**
                         * File represents a specific target that is backed by a
                         * file.<p><br /><p>> **Note**: `Configs.File` and
                         * `Configs.Runtime` are mutually> Exclusive
                         */
                        File: Schema.optional(
                            Schema.struct({
                                /**
                                 * Name represents the final filename in the
                                 * filesystem.
                                 */
                                Name: Schema.optional(Schema.string),

                                /** UID represents the file UID. */
                                UID: Schema.optional(Schema.string),

                                /** GID represents the file GID. */
                                GID: Schema.optional(Schema.string),

                                /** Mode represents the FileMode of the file. */
                                Mode: Schema.optional(Schema.number),
                            })
                        ),

                        /**
                         * Runtime represents a target that is not mounted into
                         * the container but is used by the task<p><br /><p>>
                         * **Note**: `Configs.File` and `Configs.Runtime` are
                         * mutually> Exclusive
                         */
                        Runtime: Schema.optional(Schema.struct({})),

                        /**
                         * ConfigID represents the ID of the specific config
                         * that we're referencing.
                         */
                        ConfigID: Schema.optional(Schema.string),

                        /**
                         * ConfigName is the name of the config that this
                         * references, but this is just provided for
                         * lookup/display purposes. The config in the reference
                         * will be identified by its ID.
                         */
                        ConfigName: Schema.optional(Schema.string),
                    })
                )
            ),

            /**
             * Isolation technology of the containers running the service.
             * (Windows only)
             */
            Isolation: Schema.enums(TaskSpec_ContainerSpec_Isolation),

            /**
             * Run an init inside the container that forwards signals and reaps
             * processes. This field is omitted if empty, and the default (as
             * configured on the daemon) is used.
             */
            Init: Schema.optional(Schema.nullable(Schema.boolean)),

            /**
             * Set kernel namedspaced parameters (sysctls) in the container. The
             * Sysctls option on services accepts the same sysctls as the are
             * supported on containers. Note that while the same sysctls are
             * supported, no guarantees or checks are made about their
             * suitability for a clustered environment, and it's up to the user
             * to determine whether a given sysctl will work properly in a
             * Service.
             */
            Sysctls: Schema.optional(Schema.struct({})),

            /**
             * A list of kernel capabilities to add to the default set for the
             * container.
             */
            CapabilityAdd: Schema.optional(Schema.array(Schema.string)),

            /**
             * A list of kernel capabilities to drop from the default set for
             * the container.
             */
            CapabilityDrop: Schema.optional(Schema.array(Schema.string)),

            /**
             * A list of resource limits to set in the container. For example:
             * `{"Name": "nofile", "Soft": 1024, "Hard": 2048}`"
             */
            Ulimits: Schema.optional(
                Schema.array(
                    Schema.struct({
                        /** Name of ulimit */
                        Name: Schema.optional(Schema.string),

                        /** Soft limit */
                        Soft: Schema.optional(Schema.number),

                        /** Hard limit */
                        Hard: Schema.optional(Schema.number),
                    })
                )
            ),
        })
    ),

    /**
     * Read-only spec type for non-swarm containers attached to swarm overlay
     * networks.<p><br /></p>> **Note**: ContainerSpec, NetworkAttachmentSpec,
     * and> PluginSpec are mutually exclusive. PluginSpec is only used when the>
     * Runtime field is set to `plugin`. NetworkAttachmentSpec is used when the>
     * Runtime field is set to `attachment`.
     */
    NetworkAttachmentSpec: Schema.optional(
        Schema.struct({
            /** ID of the container represented by this task */
            ContainerID: Schema.optional(Schema.string),
        })
    ),

    /**
     * Resource requirements which apply to each individual container created as
     * part of the service.
     */
    Resources: Schema.optional(
        Schema.struct({
            /** Define resources limits. */
            Limits: Schema.optional(
                Schema.struct({
                    NanoCPUs: Schema.optional(Schema.number),
                    MemoryBytes: Schema.optional(Schema.number),

                    /**
                     * Limits the maximum number of PIDs in the container. Set
                     * `0` for unlimited.
                     */
                    Pids: Schema.optional(Schema.number),
                })
            ),

            /** Define resources reservation. */
            Reservations: Schema.optional(
                Schema.struct({
                    NanoCPUs: Schema.optional(Schema.number),
                    MemoryBytes: Schema.optional(Schema.number),

                    /**
                     * User-defined resources can be either Integer resources
                     * (e.g, `SSD=3`) or String resources (e.g, `GPU=UUID1`).
                     */
                    GenericResources: Schema.optional(
                        Schema.array(
                            Schema.struct({
                                NamedResourceSpec: Schema.optional(
                                    Schema.struct({
                                        Kind: Schema.optional(Schema.string),
                                        Value: Schema.optional(Schema.string),
                                    })
                                ),
                                DiscreteResourceSpec: Schema.optional(
                                    Schema.struct({
                                        Kind: Schema.optional(Schema.string),
                                        Value: Schema.optional(Schema.number),
                                    })
                                ),
                            })
                        )
                    ),
                })
            ),
        })
    ),

    /**
     * Specification for the restart policy which applies to containers created
     * as part of this service.
     */
    RestartPolicy: Schema.optional(
        Schema.struct({
            /** Condition for restart. */
            Condition: Schema.enums(TaskSpec_RestartPolicy_Condition),

            /** Delay between restart attempts. */
            Delay: Schema.optional(Schema.number),

            /**
             * Maximum attempts to restart a given container before giving up
             * (default value is 0, which is ignored).
             */
            MaxAttempts: Schema.optional(Schema.number),

            /**
             * Windows is the time window used to evaluate the restart policy
             * (default value is 0, which is unbounded).
             */
            Window: Schema.optional(Schema.number),
        })
    ),
    Placement: Schema.optional(
        Schema.struct({
            /**
             * An array of constraint expressions to limit the set of nodes
             * where a task can be scheduled. Constraint expressions can either
             * use a _match_ (`==`) or _exclude_ (`!=`) rule. Multiple
             * constraints find nodes that satisfy every expression (AND match).
             * Constraints can match node or Docker Engine labels as follows:
             *
             * Node attribute | matches | example
             * ---------------------|--------------------------------|-----------------------------------------------
             * `node.id` | Node ID | `node.id==2ivku8v2gvtg4` `node.hostname` |
             * Node hostname | `node.hostname!=node-2` `node.role` | Node role
             * (`manager`/`worker`) | `node.role==manager` `node.platform.os` |
             * Node operating system | `node.platform.os==windows`
             * `node.platform.arch` | Node architecture |
             * `node.platform.arch==x86_64` `node.labels` | User-defined node
             * labels | `node.labels.security==high` `engine.labels` | Docker
             * Engine's labels | `engine.labels.operatingsystem==ubuntu-14.04`
             *
             * `engine.labels` apply to Docker Engine labels like operating
             * system, drivers, etc. Swarm administrators add `node.labels` for
             * operational purposes by using the [`node update
             * endpoint`](#operation/NodeUpdate).
             */
            Constraints: Schema.optional(Schema.array(Schema.string)),

            /**
             * Preferences provide a way to make the scheduler aware of factors
             * such as topology. They are provided in order from highest to
             * lowest precedence.
             */
            Preferences: Schema.optional(
                Schema.array(
                    Schema.struct({
                        Spread: Schema.optional(
                            Schema.struct({
                                /** Label descriptor, such as `engine.labels.az`. */
                                SpreadDescriptor: Schema.optional(Schema.string),
                            })
                        ),
                    })
                )
            ),

            /**
             * Maximum number of replicas for per node (default value is 0,
             * which is unlimited)
             */
            MaxReplicas: Schema.optional(Schema.number),

            /**
             * Platforms stores all the platforms that the service's image can
             * run on. This field is used in the platform filter for scheduling.
             * If empty, then the platform filter is off, meaning there are no
             * scheduling restrictions.
             */
            Platforms: Schema.optional(
                Schema.array(
                    Schema.struct({
                        /**
                         * Architecture represents the hardware architecture
                         * (for example, `x86_64`).
                         */
                        Architecture: Schema.optional(Schema.string),

                        /**
                         * OS represents the Operating System (for example,
                         * `linux` or `windows`).
                         */
                        OS: Schema.optional(Schema.string),
                    })
                )
            ),
        })
    ),

    /**
     * A counter that triggers an update even if no relevant parameters have
     * been changed.
     */
    ForceUpdate: Schema.optional(Schema.number),

    /** Runtime is the type of runtime specified for the task executor. */
    Runtime: Schema.optional(Schema.string),

    /** Specifies which networks the service should attach to. */
    Networks: Schema.optional(
        Schema.array(
            Schema.struct({
                /**
                 * The target network for attachment. Must be a network name or
                 * ID.
                 */
                Target: Schema.optional(Schema.string),

                /** Discoverable alternate names for the service on this network. */
                Aliases: Schema.optional(Schema.array(Schema.string)),

                /** Driver attachment options for the network target. */
                DriverOpts: Schema.optional(Schema.struct({})),
            })
        )
    ),

    /**
     * Specifies the log driver to use for tasks created from this spec. If not
     * present, the default one for the swarm will be used, finally falling back
     * to the engine default if not specified.
     */
    LogDriver: Schema.optional(
        Schema.struct({ Name: Schema.optional(Schema.string), Options: Schema.optional(Schema.struct({})) })
    ),
}) {}

export class Task extends Schema.Class<Task>()({
    /** The ID of the task. */
    ID: Schema.optional(Schema.string),

    /**
     * The version number of the object such as node, service, etc. This is
     * needed to avoid conflicting writes. The client must send the version
     * number along with the modified specification when updating these
     * objects.
     *
     * This approach ensures safe concurrency and determinism in that the change
     * on the object may not be applied if the version number has changed from
     * the last read. In other words, if two update requests specify the same
     * base version, only one of the requests can succeed. As a result, two
     * separate update requests that happen at the same time will not
     * unintentionally overwrite each other.
     */
    Version: Schema.optional(Schema.struct({ Index: Schema.optional(Schema.number) })),
    CreatedAt: Schema.optional(Schema.string),
    UpdatedAt: Schema.optional(Schema.string),

    /** Name of the task. */
    Name: Schema.optional(Schema.string),

    /** User-defined key/value metadata. */
    Labels: Schema.optional(Schema.struct({})),

    /** User modifiable task configuration. */
    Spec: Schema.optional(
        Schema.struct({
            /**
             * Plugin spec for the service. _(Experimental release only.)_<p><br
             * /></p>> **Note**: ContainerSpec, NetworkAttachmentSpec, and>
             * PluginSpec are mutually exclusive. PluginSpec is only used when>
             * The Runtime field is set to `plugin`. NetworkAttachmentSpec is>
             * Used when the Runtime field is set to `attachment`.
             */
            PluginSpec: Schema.optional(
                Schema.struct({
                    /** The name or 'alias' to use for the plugin. */
                    Name: Schema.optional(Schema.string),

                    /** The plugin image reference to use. */
                    Remote: Schema.optional(Schema.string),

                    /** Disable the plugin once scheduled. */
                    Disabled: Schema.optional(Schema.boolean),
                    PluginPrivilege: Schema.optional(
                        Schema.array(
                            Schema.struct({
                                Name: Schema.optional(Schema.string),
                                Description: Schema.optional(Schema.string),
                                Value: Schema.optional(Schema.array(Schema.string)),
                            })
                        )
                    ),
                })
            ),

            /**
             * Container spec for the service.<p><br /></p>> **Note**:
             * ContainerSpec, NetworkAttachmentSpec, and> PluginSpec are
             * mutually exclusive. PluginSpec is only used when> The Runtime
             * field is set to `plugin`. NetworkAttachmentSpec is> Used when the
             * Runtime field is set to `attachment`.
             */
            ContainerSpec: Schema.optional(
                Schema.struct({
                    /** The image name to use for the container */
                    Image: Schema.optional(Schema.string),

                    /** User-defined key/value data. */
                    Labels: Schema.optional(Schema.struct({})),

                    /** The command to be run in the image. */
                    Command: Schema.optional(Schema.array(Schema.string)),

                    /** Arguments to the command. */
                    Args: Schema.optional(Schema.array(Schema.string)),

                    /**
                     * The hostname to use for the container, as a valid [RFC
                     * 1123](https://tools.ietf.org/html/rfc1123) hostname.
                     */
                    Hostname: Schema.optional(Schema.string),

                    /** A list of environment variables in the form `VAR=value`. */
                    Env: Schema.optional(Schema.array(Schema.string)),

                    /** The working directory for commands to run in. */
                    Dir: Schema.optional(Schema.string),

                    /** The user inside the container. */
                    User: Schema.optional(Schema.string),

                    /**
                     * A list of additional groups that the container process
                     * will run as.
                     */
                    Groups: Schema.optional(Schema.array(Schema.string)),

                    /** Security options for the container */
                    Privileges: Schema.optional(
                        Schema.struct({
                            /**
                             * CredentialSpec for managed service account
                             * (Windows only)
                             */
                            CredentialSpec: Schema.optional(
                                Schema.struct({
                                    /**
                                     * Load credential spec from a Swarm Config
                                     * with the given ID. The specified config
                                     * must also be present in the Configs field
                                     * with the Runtime property set.<p><br
                                     * /></p>> **Note**: `CredentialSpec.File`,
                                     * `CredentialSpec.Registry`,> And
                                     * `CredentialSpec.Config` are mutually>
                                     * Exclusive.
                                     */
                                    Config: Schema.optional(Schema.string),

                                    /**
                                     * Load credential spec from this file. The
                                     * file is read by the daemon, and must be
                                     * present in the `CredentialSpecs`
                                     * subdirectory in the docker data
                                     * directory, which defaults to
                                     * `C:\ProgramData\Docker\` on Windows.
                                     *
                                     * For example, specifying `spec.json` loads
                                     * `C:\ProgramData\Docker\CredentialSpecs\spec.json`.<p><br
                                     * /></p>> **Note**: `CredentialSpec.File`,
                                     * `CredentialSpec.Registry`,> And
                                     * `CredentialSpec.Config` are mutually>
                                     * Exclusive.
                                     */
                                    File: Schema.optional(Schema.string),

                                    /**
                                     * Load credential spec from this value in
                                     * the Windows registry. The specified
                                     * registry value must be located in:
                                     *
                                     * `HKLM\SOFTWARE\Microsoft\Windows
                                     * NT\CurrentVersion\Virtualization\Containers\CredentialSpecs`<p><br
                                     * /></p>> **Note**: `CredentialSpec.File`,
                                     * `CredentialSpec.Registry`,> And
                                     * `CredentialSpec.Config` are mutually>
                                     * Exclusive.
                                     */
                                    Registry: Schema.optional(Schema.string),
                                })
                            ),

                            /** SELinux labels of the container */
                            SELinuxContext: Schema.optional(
                                Schema.struct({
                                    /** Disable SELinux */
                                    Disable: Schema.optional(Schema.boolean),

                                    /** SELinux user label */
                                    User: Schema.optional(Schema.string),

                                    /** SELinux role label */
                                    Role: Schema.optional(Schema.string),

                                    /** SELinux type label */
                                    Type: Schema.optional(Schema.string),

                                    /** SELinux level label */
                                    Level: Schema.optional(Schema.string),
                                })
                            ),

                            /** Options for configuring seccomp on the container */
                            Seccomp: Schema.optional(
                                Schema.struct({
                                    Mode: Schema.enums(Task_Spec_ContainerSpec_Privileges_Seccomp_Mode),

                                    /**
                                     * The custom seccomp profile as a json
                                     * object
                                     */
                                    Profile: Schema.optional(Schema.string),
                                })
                            ),

                            /** Options for configuring AppArmor on the container */
                            AppArmor: Schema.optional(
                                Schema.struct({ Mode: Schema.enums(Task_Spec_ContainerSpec_Privileges_AppArmor_Mode) })
                            ),

                            /**
                             * Configuration of the no_new_privs bit in the
                             * container
                             */
                            NoNewPrivileges: Schema.optional(Schema.boolean),
                        })
                    ),

                    /** Whether a pseudo-TTY should be allocated. */
                    TTY: Schema.optional(Schema.boolean),

                    /** Open `stdin` */
                    OpenStdin: Schema.optional(Schema.boolean),

                    /** Mount the container's root filesystem as read only. */
                    ReadOnly: Schema.optional(Schema.boolean),

                    /**
                     * Specification for mounts to be added to containers
                     * created as part of the service.
                     */
                    Mounts: Schema.optional(
                        Schema.array(
                            Schema.struct({
                                /** Container path. */
                                Target: Schema.optional(Schema.string),

                                /**
                                 * Mount source (e.g. a volume name, a host
                                 * path).
                                 */
                                Source: Schema.optional(Schema.string),

                                /**
                                 * The mount type. Available types:
                                 *
                                 * - `bind` Mounts a file or directory from the
                                 *   host into the container. Must exist prior
                                 *   to creating the container.
                                 * - `volume` Creates a volume with the given name
                                 *   and options (or uses a pre-existing volume
                                 *   with the same name and options). These are
                                 *   **not** removed when the container is
                                 *   removed.
                                 * - `tmpfs` Create a tmpfs with the given
                                 *   options. The mount source cannot be
                                 *   specified for tmpfs.
                                 * - `npipe` Mounts a named pipe from the host
                                 *   into the container. Must exist prior to
                                 *   creating the container.
                                 * - `cluster` a Swarm cluster volume
                                 */
                                Type: Schema.enums(Task_Spec_ContainerSpec_Mounts_Mounts_Type),

                                /** Whether the mount should be read-only. */
                                ReadOnly: Schema.optional(Schema.boolean),

                                /**
                                 * The consistency requirement for the mount:
                                 * `default`, `consistent`, `cached`, or
                                 * `delegated`.
                                 */
                                Consistency: Schema.optional(Schema.string),

                                /** Optional configuration for the `bind` type. */
                                BindOptions: Schema.optional(
                                    Schema.struct({
                                        /**
                                         * A propagation mode with the value
                                         * `[r]private`, `[r]shared`, or
                                         * `[r]slave`.
                                         */
                                        Propagation: Schema.enums(
                                            Task_Spec_ContainerSpec_Mounts_Mounts_BindOptions_Propagation
                                        ),

                                        /** Disable recursive bind mount. */
                                        NonRecursive: Schema.optional(Schema.boolean),

                                        /** Create mount point on host if missing */
                                        CreateMountpoint: Schema.optional(Schema.boolean),

                                        /**
                                         * Make the mount non-recursively
                                         * read-only, but still leave the mount
                                         * recursive (unless NonRecursive is set
                                         * to true in conjunction).
                                         */
                                        ReadOnlyNonRecursive: Schema.optional(Schema.boolean),

                                        /**
                                         * Raise an error if the mount cannot be
                                         * made recursively read-only.
                                         */
                                        ReadOnlyForceRecursive: Schema.optional(Schema.boolean),
                                    })
                                ),

                                /** Optional configuration for the `volume` type. */
                                VolumeOptions: Schema.optional(
                                    Schema.struct({
                                        /**
                                         * Populate volume with data from the
                                         * target.
                                         */
                                        NoCopy: Schema.optional(Schema.boolean),

                                        /** User-defined key/value metadata. */
                                        Labels: Schema.optional(Schema.struct({})),

                                        /** Map of driver specific options */
                                        DriverConfig: Schema.optional(
                                            Schema.struct({
                                                /**
                                                 * Name of the driver to use to
                                                 * create the volume.
                                                 */
                                                Name: Schema.optional(Schema.string),

                                                /**
                                                 * Key/value map of driver
                                                 * specific options.
                                                 */
                                                Options: Schema.optional(Schema.struct({})),
                                            })
                                        ),
                                    })
                                ),

                                /** Optional configuration for the `tmpfs` type. */
                                TmpfsOptions: Schema.optional(
                                    Schema.struct({
                                        /**
                                         * The size for the tmpfs mount in
                                         * bytes.
                                         */
                                        SizeBytes: Schema.optional(Schema.number),

                                        /**
                                         * The permission mode for the tmpfs
                                         * mount in an integer.
                                         */
                                        Mode: Schema.optional(Schema.number),
                                    })
                                ),
                            })
                        )
                    ),

                    /** Signal to stop the container. */
                    StopSignal: Schema.optional(Schema.string),

                    /**
                     * Amount of time to wait for the container to terminate
                     * before forcefully killing it.
                     */
                    StopGracePeriod: Schema.optional(Schema.number),

                    /** A test to perform to check that the container is healthy. */
                    HealthCheck: Schema.optional(
                        Schema.struct({
                            /**
                             * The test to perform. Possible values are:
                             *
                             * - `[]` inherit healthcheck from image or parent
                             *   image
                             * - `["NONE"]` disable healthcheck
                             * - `["CMD", args...]` exec arguments directly
                             * - `["CMD-SHELL", command]` run command with
                             *   system's default shell
                             */
                            Test: Schema.optional(Schema.array(Schema.string)),

                            /**
                             * The time to wait between checks in nanoseconds.
                             * It should be 0 or at least 1000000 (1 ms). 0
                             * means inherit.
                             */
                            Interval: Schema.optional(Schema.number),

                            /**
                             * The time to wait before considering the check to
                             * have hung. It should be 0 or at least 1000000 (1
                             * ms). 0 means inherit.
                             */
                            Timeout: Schema.optional(Schema.number),

                            /**
                             * The number of consecutive failures needed to
                             * consider a container as unhealthy. 0 means
                             * inherit.
                             */
                            Retries: Schema.optional(Schema.number),

                            /**
                             * Start period for the container to initialize
                             * before starting health-retries countdown in
                             * nanoseconds. It should be 0 or at least 1000000
                             * (1 ms). 0 means inherit.
                             */
                            StartPeriod: Schema.optional(Schema.number),

                            /**
                             * The time to wait between checks in nanoseconds
                             * during the start period. It should be 0 or at
                             * least 1000000 (1 ms). 0 means inherit.
                             */
                            StartInterval: Schema.optional(Schema.number),
                        })
                    ),

                    /**
                     * A list of hostname/IP mappings to add to the container's
                     * `hosts` file. The format of extra hosts is specified in
                     * the
                     * [hosts(5)](http://man7.org/linux/man-pages/man5/hosts.5.html)
                     * man page:
                     *
                     *     IP_address canonical_hostname [aliases...]
                     */
                    Hosts: Schema.optional(Schema.array(Schema.string)),

                    /**
                     * Specification for DNS related configurations in resolver
                     * configuration file (`resolv.conf`).
                     */
                    DNSConfig: Schema.optional(
                        Schema.struct({
                            /** The IP addresses of the name servers. */
                            Nameservers: Schema.optional(Schema.array(Schema.string)),

                            /** A search list for host-name lookup. */
                            Search: Schema.optional(Schema.array(Schema.string)),

                            /**
                             * A list of internal resolver variables to be
                             * modified (e.g., `debug`, `ndots:3`, etc.).
                             */
                            Options: Schema.optional(Schema.array(Schema.string)),
                        })
                    ),

                    /**
                     * Secrets contains references to zero or more secrets that
                     * will be exposed to the service.
                     */
                    Secrets: Schema.optional(
                        Schema.array(
                            Schema.struct({
                                /**
                                 * File represents a specific target that is
                                 * backed by a file.
                                 */
                                File: Schema.optional(
                                    Schema.struct({
                                        /**
                                         * Name represents the final filename in
                                         * the filesystem.
                                         */
                                        Name: Schema.optional(Schema.string),

                                        /** UID represents the file UID. */
                                        UID: Schema.optional(Schema.string),

                                        /** GID represents the file GID. */
                                        GID: Schema.optional(Schema.string),

                                        /**
                                         * Mode represents the FileMode of the
                                         * file.
                                         */
                                        Mode: Schema.optional(Schema.number),
                                    })
                                ),

                                /**
                                 * SecretID represents the ID of the specific
                                 * secret that we're referencing.
                                 */
                                SecretID: Schema.optional(Schema.string),

                                /**
                                 * SecretName is the name of the secret that
                                 * this references, but this is just provided
                                 * for lookup/display purposes. The secret in
                                 * the reference will be identified by its ID.
                                 */
                                SecretName: Schema.optional(Schema.string),
                            })
                        )
                    ),

                    /**
                     * Configs contains references to zero or more configs that
                     * will be exposed to the service.
                     */
                    Configs: Schema.optional(
                        Schema.array(
                            Schema.struct({
                                /**
                                 * File represents a specific target that is
                                 * backed by a file.<p><br /><p>> **Note**:
                                 * `Configs.File` and `Configs.Runtime` are
                                 * mutually> Exclusive
                                 */
                                File: Schema.optional(
                                    Schema.struct({
                                        /**
                                         * Name represents the final filename in
                                         * the filesystem.
                                         */
                                        Name: Schema.optional(Schema.string),

                                        /** UID represents the file UID. */
                                        UID: Schema.optional(Schema.string),

                                        /** GID represents the file GID. */
                                        GID: Schema.optional(Schema.string),

                                        /**
                                         * Mode represents the FileMode of the
                                         * file.
                                         */
                                        Mode: Schema.optional(Schema.number),
                                    })
                                ),

                                /**
                                 * Runtime represents a target that is not
                                 * mounted into the container but is used by the
                                 * task<p><br /><p>> **Note**: `Configs.File`
                                 * and `Configs.Runtime` are mutually>
                                 * Exclusive
                                 */
                                Runtime: Schema.optional(Schema.struct({})),

                                /**
                                 * ConfigID represents the ID of the specific
                                 * config that we're referencing.
                                 */
                                ConfigID: Schema.optional(Schema.string),

                                /**
                                 * ConfigName is the name of the config that
                                 * this references, but this is just provided
                                 * for lookup/display purposes. The config in
                                 * the reference will be identified by its ID.
                                 */
                                ConfigName: Schema.optional(Schema.string),
                            })
                        )
                    ),

                    /**
                     * Isolation technology of the containers running the
                     * service. (Windows only)
                     */
                    Isolation: Schema.enums(Task_Spec_ContainerSpec_Isolation),

                    /**
                     * Run an init inside the container that forwards signals
                     * and reaps processes. This field is omitted if empty, and
                     * the default (as configured on the daemon) is used.
                     */
                    Init: Schema.optional(Schema.nullable(Schema.boolean)),

                    /**
                     * Set kernel namedspaced parameters (sysctls) in the
                     * container. The Sysctls option on services accepts the
                     * same sysctls as the are supported on containers. Note
                     * that while the same sysctls are supported, no guarantees
                     * or checks are made about their suitability for a
                     * clustered environment, and it's up to the user to
                     * determine whether a given sysctl will work properly in a
                     * Service.
                     */
                    Sysctls: Schema.optional(Schema.struct({})),

                    /**
                     * A list of kernel capabilities to add to the default set
                     * for the container.
                     */
                    CapabilityAdd: Schema.optional(Schema.array(Schema.string)),

                    /**
                     * A list of kernel capabilities to drop from the default
                     * set for the container.
                     */
                    CapabilityDrop: Schema.optional(Schema.array(Schema.string)),

                    /**
                     * A list of resource limits to set in the container. For
                     * example: `{"Name": "nofile", "Soft": 1024, "Hard":
                     * 2048}`"
                     */
                    Ulimits: Schema.optional(
                        Schema.array(
                            Schema.struct({
                                /** Name of ulimit */
                                Name: Schema.optional(Schema.string),

                                /** Soft limit */
                                Soft: Schema.optional(Schema.number),

                                /** Hard limit */
                                Hard: Schema.optional(Schema.number),
                            })
                        )
                    ),
                })
            ),

            /**
             * Read-only spec type for non-swarm containers attached to swarm
             * overlay networks.<p><br /></p>> **Note**: ContainerSpec,
             * NetworkAttachmentSpec, and> PluginSpec are mutually exclusive.
             * PluginSpec is only used when> The Runtime field is set to
             * `plugin`. NetworkAttachmentSpec is> Used when the Runtime field
             * is set to `attachment`.
             */
            NetworkAttachmentSpec: Schema.optional(
                Schema.struct({
                    /** ID of the container represented by this task */
                    ContainerID: Schema.optional(Schema.string),
                })
            ),

            /**
             * Resource requirements which apply to each individual container
             * created as part of the service.
             */
            Resources: Schema.optional(
                Schema.struct({
                    /** Define resources limits. */
                    Limits: Schema.optional(
                        Schema.struct({
                            NanoCPUs: Schema.optional(Schema.number),
                            MemoryBytes: Schema.optional(Schema.number),

                            /**
                             * Limits the maximum number of PIDs in the
                             * container. Set `0` for unlimited.
                             */
                            Pids: Schema.optional(Schema.number),
                        })
                    ),

                    /** Define resources reservation. */
                    Reservations: Schema.optional(
                        Schema.struct({
                            NanoCPUs: Schema.optional(Schema.number),
                            MemoryBytes: Schema.optional(Schema.number),

                            /**
                             * User-defined resources can be either Integer
                             * resources (e.g, `SSD=3`) or String resources
                             * (e.g, `GPU=UUID1`).
                             */
                            GenericResources: Schema.optional(
                                Schema.array(
                                    Schema.struct({
                                        NamedResourceSpec: Schema.optional(
                                            Schema.struct({
                                                Kind: Schema.optional(Schema.string),
                                                Value: Schema.optional(Schema.string),
                                            })
                                        ),
                                        DiscreteResourceSpec: Schema.optional(
                                            Schema.struct({
                                                Kind: Schema.optional(Schema.string),
                                                Value: Schema.optional(Schema.number),
                                            })
                                        ),
                                    })
                                )
                            ),
                        })
                    ),
                })
            ),

            /**
             * Specification for the restart policy which applies to containers
             * created as part of this service.
             */
            RestartPolicy: Schema.optional(
                Schema.struct({
                    /** Condition for restart. */
                    Condition: Schema.enums(Task_Spec_RestartPolicy_Condition),

                    /** Delay between restart attempts. */
                    Delay: Schema.optional(Schema.number),

                    /**
                     * Maximum attempts to restart a given container before
                     * giving up (default value is 0, which is ignored).
                     */
                    MaxAttempts: Schema.optional(Schema.number),

                    /**
                     * Windows is the time window used to evaluate the restart
                     * policy (default value is 0, which is unbounded).
                     */
                    Window: Schema.optional(Schema.number),
                })
            ),
            Placement: Schema.optional(
                Schema.struct({
                    /**
                     * An array of constraint expressions to limit the set of
                     * nodes where a task can be scheduled. Constraint
                     * expressions can either use a _match_ (`==`) or _exclude_
                     * (`!=`) rule. Multiple constraints find nodes that satisfy
                     * every expression (AND match). Constraints can match node
                     * or Docker Engine labels as follows:
                     *
                     * Node attribute | matches | example
                     * ---------------------|--------------------------------|-----------------------------------------------
                     * `node.id` | Node ID | `node.id==2ivku8v2gvtg4`
                     * `node.hostname` | Node hostname | `node.hostname!=node-2`
                     * `node.role` | Node role (`manager`/`worker`) |
                     * `node.role==manager` `node.platform.os` | Node operating
                     * system | `node.platform.os==windows`
                     * `node.platform.arch`
                     *
                     * | Node architecture | `node.platform.arch==x86_64`
                     *
                     * `node.labels` | User-defined node labels |
                     * `node.labels.security==high` `engine.labels` | Docker
                     * Engine's labels |
                     * `engine.labels.operatingsystem==ubuntu-14.04`
                     *
                     * `engine.labels` apply to Docker Engine labels like
                     * operating system, drivers, etc. Swarm administrators add
                     * `node.labels` for operational purposes by using the
                     * [`node update endpoint`](#operation/NodeUpdate).
                     */
                    Constraints: Schema.optional(Schema.array(Schema.string)),

                    /**
                     * Preferences provide a way to make the scheduler aware of
                     * factors such as topology. They are provided in order from
                     * highest to lowest precedence.
                     */
                    Preferences: Schema.optional(
                        Schema.array(
                            Schema.struct({
                                Spread: Schema.optional(
                                    Schema.struct({
                                        /**
                                         * Label descriptor, such as
                                         * `engine.labels.az`.
                                         */
                                        SpreadDescriptor: Schema.optional(Schema.string),
                                    })
                                ),
                            })
                        )
                    ),

                    /**
                     * Maximum number of replicas for per node (default value is
                     * 0, which is unlimited)
                     */
                    MaxReplicas: Schema.optional(Schema.number),

                    /**
                     * Platforms stores all the platforms that the service's
                     * image can run on. This field is used in the platform
                     * filter for scheduling. If empty, then the platform filter
                     * is off, meaning there are no scheduling restrictions.
                     */
                    Platforms: Schema.optional(
                        Schema.array(
                            Schema.struct({
                                /**
                                 * Architecture represents the hardware
                                 * architecture (for example, `x86_64`).
                                 */
                                Architecture: Schema.optional(Schema.string),

                                /**
                                 * OS represents the Operating System (for
                                 * example, `linux` or `windows`).
                                 */
                                OS: Schema.optional(Schema.string),
                            })
                        )
                    ),
                })
            ),

            /**
             * A counter that triggers an update even if no relevant parameters
             * have been changed.
             */
            ForceUpdate: Schema.optional(Schema.number),

            /** Runtime is the type of runtime specified for the task executor. */
            Runtime: Schema.optional(Schema.string),

            /** Specifies which networks the service should attach to. */
            Networks: Schema.optional(
                Schema.array(
                    Schema.struct({
                        /**
                         * The target network for attachment. Must be a network
                         * name or ID.
                         */
                        Target: Schema.optional(Schema.string),

                        /**
                         * Discoverable alternate names for the service on this
                         * network.
                         */
                        Aliases: Schema.optional(Schema.array(Schema.string)),

                        /** Driver attachment options for the network target. */
                        DriverOpts: Schema.optional(Schema.struct({})),
                    })
                )
            ),

            /**
             * Specifies the log driver to use for tasks created from this spec.
             * If not present, the default one for the swarm will be used,
             * finally falling back to the engine default if not specified.
             */
            LogDriver: Schema.optional(
                Schema.struct({ Name: Schema.optional(Schema.string), Options: Schema.optional(Schema.struct({})) })
            ),
        })
    ),

    /** The ID of the service this task is part of. */
    ServiceID: Schema.optional(Schema.string),
    Slot: Schema.optional(Schema.number),

    /** The ID of the node that this task is on. */
    NodeID: Schema.optional(Schema.string),

    /**
     * User-defined resources can be either Integer resources (e.g, `SSD=3`) or
     * String resources (e.g, `GPU=UUID1`).
     */
    AssignedGenericResources: Schema.optional(
        Schema.array(
            Schema.struct({
                NamedResourceSpec: Schema.optional(
                    Schema.struct({ Kind: Schema.optional(Schema.string), Value: Schema.optional(Schema.string) })
                ),
                DiscreteResourceSpec: Schema.optional(
                    Schema.struct({ Kind: Schema.optional(Schema.string), Value: Schema.optional(Schema.number) })
                ),
            })
        )
    ),
    Status: Schema.optional(
        Schema.struct({
            Timestamp: Schema.optional(Schema.string),
            State: Schema.enums(Task_Status_State),
            Message: Schema.optional(Schema.string),
            Err: Schema.optional(Schema.string),
            ContainerStatus: Schema.optional(
                Schema.struct({
                    ContainerID: Schema.optional(Schema.string),
                    PID: Schema.optional(Schema.number),
                    ExitCode: Schema.optional(Schema.number),
                })
            ),
        })
    ),
    DesiredState: Schema.enums(Task_DesiredState),

    /**
     * If the Service this Task belongs to is a job-mode service, contains the
     * JobIteration of the Service this Task was created for. Absent if the Task
     * was created for a Replicated or Global Service.
     */
    JobIteration: Schema.optional(Schema.struct({ Index: Schema.optional(Schema.number) })),
}) {}

export class ServiceSpec extends Schema.Class<ServiceSpec>()({
    /** Name of the service. */
    Name: Schema.optional(Schema.string),

    /** User-defined key/value metadata. */
    Labels: Schema.optional(Schema.struct({})),

    /** User modifiable task configuration. */
    TaskTemplate: Schema.optional(
        Schema.struct({
            /**
             * Plugin spec for the service. _(Experimental release only.)_<p><br
             * /></p>> **Note**: ContainerSpec, NetworkAttachmentSpec, and>
             * PluginSpec are mutually exclusive. PluginSpec is only used when>
             * The Runtime field is set to `plugin`. NetworkAttachmentSpec is>
             * Used when the Runtime field is set to `attachment`.
             */
            PluginSpec: Schema.optional(
                Schema.struct({
                    /** The name or 'alias' to use for the plugin. */
                    Name: Schema.optional(Schema.string),

                    /** The plugin image reference to use. */
                    Remote: Schema.optional(Schema.string),

                    /** Disable the plugin once scheduled. */
                    Disabled: Schema.optional(Schema.boolean),
                    PluginPrivilege: Schema.optional(
                        Schema.array(
                            Schema.struct({
                                Name: Schema.optional(Schema.string),
                                Description: Schema.optional(Schema.string),
                                Value: Schema.optional(Schema.array(Schema.string)),
                            })
                        )
                    ),
                })
            ),

            /**
             * Container spec for the service.<p><br /></p>> **Note**:
             * ContainerSpec, NetworkAttachmentSpec, and> PluginSpec are
             * mutually exclusive. PluginSpec is only used when> The Runtime
             * field is set to `plugin`. NetworkAttachmentSpec is> Used when the
             * Runtime field is set to `attachment`.
             */
            ContainerSpec: Schema.optional(
                Schema.struct({
                    /** The image name to use for the container */
                    Image: Schema.optional(Schema.string),

                    /** User-defined key/value data. */
                    Labels: Schema.optional(Schema.struct({})),

                    /** The command to be run in the image. */
                    Command: Schema.optional(Schema.array(Schema.string)),

                    /** Arguments to the command. */
                    Args: Schema.optional(Schema.array(Schema.string)),

                    /**
                     * The hostname to use for the container, as a valid [RFC
                     * 1123](https://tools.ietf.org/html/rfc1123) hostname.
                     */
                    Hostname: Schema.optional(Schema.string),

                    /** A list of environment variables in the form `VAR=value`. */
                    Env: Schema.optional(Schema.array(Schema.string)),

                    /** The working directory for commands to run in. */
                    Dir: Schema.optional(Schema.string),

                    /** The user inside the container. */
                    User: Schema.optional(Schema.string),

                    /**
                     * A list of additional groups that the container process
                     * will run as.
                     */
                    Groups: Schema.optional(Schema.array(Schema.string)),

                    /** Security options for the container */
                    Privileges: Schema.optional(
                        Schema.struct({
                            /**
                             * CredentialSpec for managed service account
                             * (Windows only)
                             */
                            CredentialSpec: Schema.optional(
                                Schema.struct({
                                    /**
                                     * Load credential spec from a Swarm Config
                                     * with the given ID. The specified config
                                     * must also be present in the Configs field
                                     * with the Runtime property set.<p><br
                                     * /></p>> **Note**: `CredentialSpec.File`,
                                     * `CredentialSpec.Registry`,> And
                                     * `CredentialSpec.Config` are mutually>
                                     * Exclusive.
                                     */
                                    Config: Schema.optional(Schema.string),

                                    /**
                                     * Load credential spec from this file. The
                                     * file is read by the daemon, and must be
                                     * present in the `CredentialSpecs`
                                     * subdirectory in the docker data
                                     * directory, which defaults to
                                     * `C:\ProgramData\Docker\` on Windows.
                                     *
                                     * For example, specifying `spec.json` loads
                                     * `C:\ProgramData\Docker\CredentialSpecs\spec.json`.<p><br
                                     * /></p>> **Note**: `CredentialSpec.File`,
                                     * `CredentialSpec.Registry`,> And
                                     * `CredentialSpec.Config` are mutually>
                                     * Exclusive.
                                     */
                                    File: Schema.optional(Schema.string),

                                    /**
                                     * Load credential spec from this value in
                                     * the Windows registry. The specified
                                     * registry value must be located in:
                                     *
                                     * `HKLM\SOFTWARE\Microsoft\Windows
                                     * NT\CurrentVersion\Virtualization\Containers\CredentialSpecs`<p><br
                                     * /></p>> **Note**: `CredentialSpec.File`,
                                     * `CredentialSpec.Registry`,> And
                                     * `CredentialSpec.Config` are mutually>
                                     * Exclusive.
                                     */
                                    Registry: Schema.optional(Schema.string),
                                })
                            ),

                            /** SELinux labels of the container */
                            SELinuxContext: Schema.optional(
                                Schema.struct({
                                    /** Disable SELinux */
                                    Disable: Schema.optional(Schema.boolean),

                                    /** SELinux user label */
                                    User: Schema.optional(Schema.string),

                                    /** SELinux role label */
                                    Role: Schema.optional(Schema.string),

                                    /** SELinux type label */
                                    Type: Schema.optional(Schema.string),

                                    /** SELinux level label */
                                    Level: Schema.optional(Schema.string),
                                })
                            ),

                            /** Options for configuring seccomp on the container */
                            Seccomp: Schema.optional(
                                Schema.struct({
                                    Mode: Schema.enums(ServiceSpec_TaskTemplate_ContainerSpec_Privileges_Seccomp_Mode),

                                    /**
                                     * The custom seccomp profile as a json
                                     * object
                                     */
                                    Profile: Schema.optional(Schema.string),
                                })
                            ),

                            /** Options for configuring AppArmor on the container */
                            AppArmor: Schema.optional(
                                Schema.struct({
                                    Mode: Schema.enums(ServiceSpec_TaskTemplate_ContainerSpec_Privileges_AppArmor_Mode),
                                })
                            ),

                            /**
                             * Configuration of the no_new_privs bit in the
                             * container
                             */
                            NoNewPrivileges: Schema.optional(Schema.boolean),
                        })
                    ),

                    /** Whether a pseudo-TTY should be allocated. */
                    TTY: Schema.optional(Schema.boolean),

                    /** Open `stdin` */
                    OpenStdin: Schema.optional(Schema.boolean),

                    /** Mount the container's root filesystem as read only. */
                    ReadOnly: Schema.optional(Schema.boolean),

                    /**
                     * Specification for mounts to be added to containers
                     * created as part of the service.
                     */
                    Mounts: Schema.optional(
                        Schema.array(
                            Schema.struct({
                                /** Container path. */
                                Target: Schema.optional(Schema.string),

                                /**
                                 * Mount source (e.g. a volume name, a host
                                 * path).
                                 */
                                Source: Schema.optional(Schema.string),

                                /**
                                 * The mount type. Available types:
                                 *
                                 * - `bind` Mounts a file or directory from the
                                 *   host into the container. Must exist prior
                                 *   to creating the container.
                                 * - `volume` Creates a volume with the given name
                                 *   and options (or uses a pre-existing volume
                                 *   with the same name and options). These are
                                 *   **not** removed when the container is
                                 *   removed.
                                 * - `tmpfs` Create a tmpfs with the given
                                 *   options. The mount source cannot be
                                 *   specified for tmpfs.
                                 * - `npipe` Mounts a named pipe from the host
                                 *   into the container. Must exist prior to
                                 *   creating the container.
                                 * - `cluster` a Swarm cluster volume
                                 */
                                Type: Schema.enums(ServiceSpec_TaskTemplate_ContainerSpec_Mounts_Mounts_Type),

                                /** Whether the mount should be read-only. */
                                ReadOnly: Schema.optional(Schema.boolean),

                                /**
                                 * The consistency requirement for the mount:
                                 * `default`, `consistent`, `cached`, or
                                 * `delegated`.
                                 */
                                Consistency: Schema.optional(Schema.string),

                                /** Optional configuration for the `bind` type. */
                                BindOptions: Schema.optional(
                                    Schema.struct({
                                        /**
                                         * A propagation mode with the value
                                         * `[r]private`, `[r]shared`, or
                                         * `[r]slave`.
                                         */
                                        Propagation: Schema.enums(
                                            ServiceSpec_TaskTemplate_ContainerSpec_Mounts_Mounts_BindOptions_Propagation
                                        ),

                                        /** Disable recursive bind mount. */
                                        NonRecursive: Schema.optional(Schema.boolean),

                                        /** Create mount point on host if missing */
                                        CreateMountpoint: Schema.optional(Schema.boolean),

                                        /**
                                         * Make the mount non-recursively
                                         * read-only, but still leave the mount
                                         * recursive (unless NonRecursive is set
                                         * to true in conjunction).
                                         */
                                        ReadOnlyNonRecursive: Schema.optional(Schema.boolean),

                                        /**
                                         * Raise an error if the mount cannot be
                                         * made recursively read-only.
                                         */
                                        ReadOnlyForceRecursive: Schema.optional(Schema.boolean),
                                    })
                                ),

                                /** Optional configuration for the `volume` type. */
                                VolumeOptions: Schema.optional(
                                    Schema.struct({
                                        /**
                                         * Populate volume with data from the
                                         * target.
                                         */
                                        NoCopy: Schema.optional(Schema.boolean),

                                        /** User-defined key/value metadata. */
                                        Labels: Schema.optional(Schema.struct({})),

                                        /** Map of driver specific options */
                                        DriverConfig: Schema.optional(
                                            Schema.struct({
                                                /**
                                                 * Name of the driver to use to
                                                 * create the volume.
                                                 */
                                                Name: Schema.optional(Schema.string),

                                                /**
                                                 * Key/value map of driver
                                                 * specific options.
                                                 */
                                                Options: Schema.optional(Schema.struct({})),
                                            })
                                        ),
                                    })
                                ),

                                /** Optional configuration for the `tmpfs` type. */
                                TmpfsOptions: Schema.optional(
                                    Schema.struct({
                                        /**
                                         * The size for the tmpfs mount in
                                         * bytes.
                                         */
                                        SizeBytes: Schema.optional(Schema.number),

                                        /**
                                         * The permission mode for the tmpfs
                                         * mount in an integer.
                                         */
                                        Mode: Schema.optional(Schema.number),
                                    })
                                ),
                            })
                        )
                    ),

                    /** Signal to stop the container. */
                    StopSignal: Schema.optional(Schema.string),

                    /**
                     * Amount of time to wait for the container to terminate
                     * before forcefully killing it.
                     */
                    StopGracePeriod: Schema.optional(Schema.number),

                    /** A test to perform to check that the container is healthy. */
                    HealthCheck: Schema.optional(
                        Schema.struct({
                            /**
                             * The test to perform. Possible values are:
                             *
                             * - `[]` inherit healthcheck from image or parent
                             *   image
                             * - `["NONE"]` disable healthcheck
                             * - `["CMD", args...]` exec arguments directly
                             * - `["CMD-SHELL", command]` run command with
                             *   system's default shell
                             */
                            Test: Schema.optional(Schema.array(Schema.string)),

                            /**
                             * The time to wait between checks in nanoseconds.
                             * It should be 0 or at least 1000000 (1 ms). 0
                             * means inherit.
                             */
                            Interval: Schema.optional(Schema.number),

                            /**
                             * The time to wait before considering the check to
                             * have hung. It should be 0 or at least 1000000 (1
                             * ms). 0 means inherit.
                             */
                            Timeout: Schema.optional(Schema.number),

                            /**
                             * The number of consecutive failures needed to
                             * consider a container as unhealthy. 0 means
                             * inherit.
                             */
                            Retries: Schema.optional(Schema.number),

                            /**
                             * Start period for the container to initialize
                             * before starting health-retries countdown in
                             * nanoseconds. It should be 0 or at least 1000000
                             * (1 ms). 0 means inherit.
                             */
                            StartPeriod: Schema.optional(Schema.number),

                            /**
                             * The time to wait between checks in nanoseconds
                             * during the start period. It should be 0 or at
                             * least 1000000 (1 ms). 0 means inherit.
                             */
                            StartInterval: Schema.optional(Schema.number),
                        })
                    ),

                    /**
                     * A list of hostname/IP mappings to add to the container's
                     * `hosts` file. The format of extra hosts is specified in
                     * the
                     * [hosts(5)](http://man7.org/linux/man-pages/man5/hosts.5.html)
                     * man page:
                     *
                     *     IP_address canonical_hostname [aliases...]
                     */
                    Hosts: Schema.optional(Schema.array(Schema.string)),

                    /**
                     * Specification for DNS related configurations in resolver
                     * configuration file (`resolv.conf`).
                     */
                    DNSConfig: Schema.optional(
                        Schema.struct({
                            /** The IP addresses of the name servers. */
                            Nameservers: Schema.optional(Schema.array(Schema.string)),

                            /** A search list for host-name lookup. */
                            Search: Schema.optional(Schema.array(Schema.string)),

                            /**
                             * A list of internal resolver variables to be
                             * modified (e.g., `debug`, `ndots:3`, etc.).
                             */
                            Options: Schema.optional(Schema.array(Schema.string)),
                        })
                    ),

                    /**
                     * Secrets contains references to zero or more secrets that
                     * will be exposed to the service.
                     */
                    Secrets: Schema.optional(
                        Schema.array(
                            Schema.struct({
                                /**
                                 * File represents a specific target that is
                                 * backed by a file.
                                 */
                                File: Schema.optional(
                                    Schema.struct({
                                        /**
                                         * Name represents the final filename in
                                         * the filesystem.
                                         */
                                        Name: Schema.optional(Schema.string),

                                        /** UID represents the file UID. */
                                        UID: Schema.optional(Schema.string),

                                        /** GID represents the file GID. */
                                        GID: Schema.optional(Schema.string),

                                        /**
                                         * Mode represents the FileMode of the
                                         * file.
                                         */
                                        Mode: Schema.optional(Schema.number),
                                    })
                                ),

                                /**
                                 * SecretID represents the ID of the specific
                                 * secret that we're referencing.
                                 */
                                SecretID: Schema.optional(Schema.string),

                                /**
                                 * SecretName is the name of the secret that
                                 * this references, but this is just provided
                                 * for lookup/display purposes. The secret in
                                 * the reference will be identified by its ID.
                                 */
                                SecretName: Schema.optional(Schema.string),
                            })
                        )
                    ),

                    /**
                     * Configs contains references to zero or more configs that
                     * will be exposed to the service.
                     */
                    Configs: Schema.optional(
                        Schema.array(
                            Schema.struct({
                                /**
                                 * File represents a specific target that is
                                 * backed by a file.<p><br /><p>> **Note**:
                                 * `Configs.File` and `Configs.Runtime` are
                                 * mutually> Exclusive
                                 */
                                File: Schema.optional(
                                    Schema.struct({
                                        /**
                                         * Name represents the final filename in
                                         * the filesystem.
                                         */
                                        Name: Schema.optional(Schema.string),

                                        /** UID represents the file UID. */
                                        UID: Schema.optional(Schema.string),

                                        /** GID represents the file GID. */
                                        GID: Schema.optional(Schema.string),

                                        /**
                                         * Mode represents the FileMode of the
                                         * file.
                                         */
                                        Mode: Schema.optional(Schema.number),
                                    })
                                ),

                                /**
                                 * Runtime represents a target that is not
                                 * mounted into the container but is used by the
                                 * task<p><br /><p>> **Note**: `Configs.File`
                                 * and `Configs.Runtime` are mutually>
                                 * Exclusive
                                 */
                                Runtime: Schema.optional(Schema.struct({})),

                                /**
                                 * ConfigID represents the ID of the specific
                                 * config that we're referencing.
                                 */
                                ConfigID: Schema.optional(Schema.string),

                                /**
                                 * ConfigName is the name of the config that
                                 * this references, but this is just provided
                                 * for lookup/display purposes. The config in
                                 * the reference will be identified by its ID.
                                 */
                                ConfigName: Schema.optional(Schema.string),
                            })
                        )
                    ),

                    /**
                     * Isolation technology of the containers running the
                     * service. (Windows only)
                     */
                    Isolation: Schema.enums(ServiceSpec_TaskTemplate_ContainerSpec_Isolation),

                    /**
                     * Run an init inside the container that forwards signals
                     * and reaps processes. This field is omitted if empty, and
                     * the default (as configured on the daemon) is used.
                     */
                    Init: Schema.optional(Schema.nullable(Schema.boolean)),

                    /**
                     * Set kernel namedspaced parameters (sysctls) in the
                     * container. The Sysctls option on services accepts the
                     * same sysctls as the are supported on containers. Note
                     * that while the same sysctls are supported, no guarantees
                     * or checks are made about their suitability for a
                     * clustered environment, and it's up to the user to
                     * determine whether a given sysctl will work properly in a
                     * Service.
                     */
                    Sysctls: Schema.optional(Schema.struct({})),

                    /**
                     * A list of kernel capabilities to add to the default set
                     * for the container.
                     */
                    CapabilityAdd: Schema.optional(Schema.array(Schema.string)),

                    /**
                     * A list of kernel capabilities to drop from the default
                     * set for the container.
                     */
                    CapabilityDrop: Schema.optional(Schema.array(Schema.string)),

                    /**
                     * A list of resource limits to set in the container. For
                     * example: `{"Name": "nofile", "Soft": 1024, "Hard":
                     * 2048}`"
                     */
                    Ulimits: Schema.optional(
                        Schema.array(
                            Schema.struct({
                                /** Name of ulimit */
                                Name: Schema.optional(Schema.string),

                                /** Soft limit */
                                Soft: Schema.optional(Schema.number),

                                /** Hard limit */
                                Hard: Schema.optional(Schema.number),
                            })
                        )
                    ),
                })
            ),

            /**
             * Read-only spec type for non-swarm containers attached to swarm
             * overlay networks.<p><br /></p>> **Note**: ContainerSpec,
             * NetworkAttachmentSpec, and> PluginSpec are mutually exclusive.
             * PluginSpec is only used when> The Runtime field is set to
             * `plugin`. NetworkAttachmentSpec is> Used when the Runtime field
             * is set to `attachment`.
             */
            NetworkAttachmentSpec: Schema.optional(
                Schema.struct({
                    /** ID of the container represented by this task */
                    ContainerID: Schema.optional(Schema.string),
                })
            ),

            /**
             * Resource requirements which apply to each individual container
             * created as part of the service.
             */
            Resources: Schema.optional(
                Schema.struct({
                    /** Define resources limits. */
                    Limits: Schema.optional(
                        Schema.struct({
                            NanoCPUs: Schema.optional(Schema.number),
                            MemoryBytes: Schema.optional(Schema.number),

                            /**
                             * Limits the maximum number of PIDs in the
                             * container. Set `0` for unlimited.
                             */
                            Pids: Schema.optional(Schema.number),
                        })
                    ),

                    /** Define resources reservation. */
                    Reservations: Schema.optional(
                        Schema.struct({
                            NanoCPUs: Schema.optional(Schema.number),
                            MemoryBytes: Schema.optional(Schema.number),

                            /**
                             * User-defined resources can be either Integer
                             * resources (e.g, `SSD=3`) or String resources
                             * (e.g, `GPU=UUID1`).
                             */
                            GenericResources: Schema.optional(
                                Schema.array(
                                    Schema.struct({
                                        NamedResourceSpec: Schema.optional(
                                            Schema.struct({
                                                Kind: Schema.optional(Schema.string),
                                                Value: Schema.optional(Schema.string),
                                            })
                                        ),
                                        DiscreteResourceSpec: Schema.optional(
                                            Schema.struct({
                                                Kind: Schema.optional(Schema.string),
                                                Value: Schema.optional(Schema.number),
                                            })
                                        ),
                                    })
                                )
                            ),
                        })
                    ),
                })
            ),

            /**
             * Specification for the restart policy which applies to containers
             * created as part of this service.
             */
            RestartPolicy: Schema.optional(
                Schema.struct({
                    /** Condition for restart. */
                    Condition: Schema.enums(ServiceSpec_TaskTemplate_RestartPolicy_Condition),

                    /** Delay between restart attempts. */
                    Delay: Schema.optional(Schema.number),

                    /**
                     * Maximum attempts to restart a given container before
                     * giving up (default value is 0, which is ignored).
                     */
                    MaxAttempts: Schema.optional(Schema.number),

                    /**
                     * Windows is the time window used to evaluate the restart
                     * policy (default value is 0, which is unbounded).
                     */
                    Window: Schema.optional(Schema.number),
                })
            ),
            Placement: Schema.optional(
                Schema.struct({
                    /**
                     * An array of constraint expressions to limit the set of
                     * nodes where a task can be scheduled. Constraint
                     * expressions can either use a _match_ (`==`) or _exclude_
                     * (`!=`) rule. Multiple constraints find nodes that satisfy
                     * every expression (AND match). Constraints can match node
                     * or Docker Engine labels as follows:
                     *
                     * Node attribute | matches | example
                     * ---------------------|--------------------------------|-----------------------------------------------
                     * `node.id` | Node ID | `node.id==2ivku8v2gvtg4`
                     * `node.hostname` | Node hostname | `node.hostname!=node-2`
                     * `node.role` | Node role (`manager`/`worker`) |
                     * `node.role==manager` `node.platform.os` | Node operating
                     * system | `node.platform.os==windows`
                     * `node.platform.arch`
                     *
                     * | Node architecture | `node.platform.arch==x86_64`
                     *
                     * `node.labels` | User-defined node labels |
                     * `node.labels.security==high` `engine.labels` | Docker
                     * Engine's labels |
                     * `engine.labels.operatingsystem==ubuntu-14.04`
                     *
                     * `engine.labels` apply to Docker Engine labels like
                     * operating system, drivers, etc. Swarm administrators add
                     * `node.labels` for operational purposes by using the
                     * [`node update endpoint`](#operation/NodeUpdate).
                     */
                    Constraints: Schema.optional(Schema.array(Schema.string)),

                    /**
                     * Preferences provide a way to make the scheduler aware of
                     * factors such as topology. They are provided in order from
                     * highest to lowest precedence.
                     */
                    Preferences: Schema.optional(
                        Schema.array(
                            Schema.struct({
                                Spread: Schema.optional(
                                    Schema.struct({
                                        /**
                                         * Label descriptor, such as
                                         * `engine.labels.az`.
                                         */
                                        SpreadDescriptor: Schema.optional(Schema.string),
                                    })
                                ),
                            })
                        )
                    ),

                    /**
                     * Maximum number of replicas for per node (default value is
                     * 0, which is unlimited)
                     */
                    MaxReplicas: Schema.optional(Schema.number),

                    /**
                     * Platforms stores all the platforms that the service's
                     * image can run on. This field is used in the platform
                     * filter for scheduling. If empty, then the platform filter
                     * is off, meaning there are no scheduling restrictions.
                     */
                    Platforms: Schema.optional(
                        Schema.array(
                            Schema.struct({
                                /**
                                 * Architecture represents the hardware
                                 * architecture (for example, `x86_64`).
                                 */
                                Architecture: Schema.optional(Schema.string),

                                /**
                                 * OS represents the Operating System (for
                                 * example, `linux` or `windows`).
                                 */
                                OS: Schema.optional(Schema.string),
                            })
                        )
                    ),
                })
            ),

            /**
             * A counter that triggers an update even if no relevant parameters
             * have been changed.
             */
            ForceUpdate: Schema.optional(Schema.number),

            /** Runtime is the type of runtime specified for the task executor. */
            Runtime: Schema.optional(Schema.string),

            /** Specifies which networks the service should attach to. */
            Networks: Schema.optional(
                Schema.array(
                    Schema.struct({
                        /**
                         * The target network for attachment. Must be a network
                         * name or ID.
                         */
                        Target: Schema.optional(Schema.string),

                        /**
                         * Discoverable alternate names for the service on this
                         * network.
                         */
                        Aliases: Schema.optional(Schema.array(Schema.string)),

                        /** Driver attachment options for the network target. */
                        DriverOpts: Schema.optional(Schema.struct({})),
                    })
                )
            ),

            /**
             * Specifies the log driver to use for tasks created from this spec.
             * If not present, the default one for the swarm will be used,
             * finally falling back to the engine default if not specified.
             */
            LogDriver: Schema.optional(
                Schema.struct({ Name: Schema.optional(Schema.string), Options: Schema.optional(Schema.struct({})) })
            ),
        })
    ),

    /** Scheduling mode for the service. */
    Mode: Schema.optional(
        Schema.struct({
            Replicated: Schema.optional(Schema.struct({ Replicas: Schema.optional(Schema.number) })),
            Global: Schema.optional(Schema.struct({})),

            /**
             * The mode used for services with a finite number of tasks that run
             * to a completed state.
             */
            ReplicatedJob: Schema.optional(
                Schema.struct({
                    /** The maximum number of replicas to run simultaneously. */
                    MaxConcurrent: Schema.optional(Schema.number).withDefault(() => 1),

                    /**
                     * The total number of replicas desired to reach the
                     * Completed state. If unset, will default to the value of
                     * `MaxConcurrent`
                     */
                    TotalCompletions: Schema.optional(Schema.number),
                })
            ),

            /**
             * The mode used for services which run a task to the completed
             * state on each valid node.
             */
            GlobalJob: Schema.optional(Schema.struct({})),
        })
    ),

    /** Specification for the update strategy of the service. */
    UpdateConfig: Schema.optional(
        Schema.struct({
            /**
             * Maximum number of tasks to be updated in one iteration (0 means
             * unlimited parallelism).
             */
            Parallelism: Schema.optional(Schema.number),

            /** Amount of time between updates, in nanoseconds. */
            Delay: Schema.optional(Schema.number),

            /**
             * Action to take if an updated task fails to run, or stops running
             * during the update.
             */
            FailureAction: Schema.enums(ServiceSpec_UpdateConfig_FailureAction),

            /**
             * Amount of time to monitor each updated task for failures, in
             * nanoseconds.
             */
            Monitor: Schema.optional(Schema.number),

            /**
             * The fraction of tasks that may fail during an update before the
             * failure action is invoked, specified as a floating point number
             * between 0 and 1.
             */
            MaxFailureRatio: Schema.optional(Schema.number),

            /**
             * The order of operations when rolling out an updated task. Either
             * the old task is shut down before the new task is started, or the
             * new task is started before the old task is shut down.
             */
            Order: Schema.enums(ServiceSpec_UpdateConfig_Order),
        })
    ),

    /** Specification for the rollback strategy of the service. */
    RollbackConfig: Schema.optional(
        Schema.struct({
            /**
             * Maximum number of tasks to be rolled back in one iteration (0
             * means unlimited parallelism).
             */
            Parallelism: Schema.optional(Schema.number),

            /** Amount of time between rollback iterations, in nanoseconds. */
            Delay: Schema.optional(Schema.number),

            /**
             * Action to take if an rolled back task fails to run, or stops
             * running during the rollback.
             */
            FailureAction: Schema.enums(ServiceSpec_RollbackConfig_FailureAction),

            /**
             * Amount of time to monitor each rolled back task for failures, in
             * nanoseconds.
             */
            Monitor: Schema.optional(Schema.number),

            /**
             * The fraction of tasks that may fail during a rollback before the
             * failure action is invoked, specified as a floating point number
             * between 0 and 1.
             */
            MaxFailureRatio: Schema.optional(Schema.number),

            /**
             * The order of operations when rolling back a task. Either the old
             * task is shut down before the new task is started, or the new task
             * is started before the old task is shut down.
             */
            Order: Schema.enums(ServiceSpec_RollbackConfig_Order),
        })
    ),

    /**
     * Specifies which networks the service should attach to.
     *
     * Deprecated: This field is deprecated since v1.44. The Networks field in
     * TaskSpec should be used instead.
     */
    Networks: Schema.optional(
        Schema.array(
            Schema.struct({
                /**
                 * The target network for attachment. Must be a network name or
                 * ID.
                 */
                Target: Schema.optional(Schema.string),

                /** Discoverable alternate names for the service on this network. */
                Aliases: Schema.optional(Schema.array(Schema.string)),

                /** Driver attachment options for the network target. */
                DriverOpts: Schema.optional(Schema.struct({})),
            })
        )
    ),

    /** Properties that can be configured to access and load balance a service. */
    EndpointSpec: Schema.optional(
        Schema.struct({
            /**
             * The mode of resolution to use for internal load balancing between
             * tasks.
             */
            Mode: Schema.optional(Schema.enums(ServiceSpec_EndpointSpec_Mode)).withDefault(
                () => ServiceSpec_EndpointSpec_Mode.VIP
            ),

            /**
             * List of exposed ports that this service is accessible on from the
             * outside. Ports can only be provided if `vip` resolution mode is
             * used.
             */
            Ports: Schema.optional(
                Schema.array(
                    Schema.struct({
                        Name: Schema.optional(Schema.string),
                        Protocol: Schema.enums(ServiceSpec_EndpointSpec_Ports_Ports_Protocol),

                        /** The port inside the container. */
                        TargetPort: Schema.optional(Schema.number),

                        /** The port on the swarm hosts. */
                        PublishedPort: Schema.optional(Schema.number),

                        /**
                         * The mode in which port is published.<p><br /></p>
                         *
                         * - "ingress" makes the target port accessible on every
                         *   node, regardless of whether there is a task for the
                         *   service running on that node or not.
                         * - "host" bypasses the routing mesh and publish the port
                         *   directly on the swarm node where that service is
                         *   running.
                         */
                        PublishMode: Schema.optional(
                            Schema.enums(ServiceSpec_EndpointSpec_Ports_Ports_PublishMode)
                        ).withDefault(() => ServiceSpec_EndpointSpec_Ports_Ports_PublishMode.INGRESS),
                    })
                )
            ),
        })
    ),
}) {}

export class EndpointPortConfig extends Schema.Class<EndpointPortConfig>()({
    Name: Schema.optional(Schema.string),
    Protocol: Schema.enums(EndpointPortConfig_Protocol),

    /** The port inside the container. */
    TargetPort: Schema.optional(Schema.number),

    /** The port on the swarm hosts. */
    PublishedPort: Schema.optional(Schema.number),

    /**
     * The mode in which port is published.<p><br /></p>
     *
     * - "ingress" makes the target port accessible on every node, regardless of
     *   whether there is a task for the service running on that node or not.
     * - "host" bypasses the routing mesh and publish the port directly on the
     *   swarm node where that service is running.
     */
    PublishMode: Schema.optional(Schema.enums(EndpointPortConfig_PublishMode)).withDefault(
        () => EndpointPortConfig_PublishMode.INGRESS
    ),
}) {}

export class EndpointSpec extends Schema.Class<EndpointSpec>()({
    /** The mode of resolution to use for internal load balancing between tasks. */
    Mode: Schema.optional(Schema.enums(EndpointSpec_Mode)).withDefault(() => EndpointSpec_Mode.VIP),

    /**
     * List of exposed ports that this service is accessible on from the
     * outside. Ports can only be provided if `vip` resolution mode is used.
     */
    Ports: Schema.optional(
        Schema.array(
            Schema.struct({
                Name: Schema.optional(Schema.string),
                Protocol: Schema.enums(EndpointSpec_Ports_Ports_Protocol),

                /** The port inside the container. */
                TargetPort: Schema.optional(Schema.number),

                /** The port on the swarm hosts. */
                PublishedPort: Schema.optional(Schema.number),

                /**
                 * The mode in which port is published.<p><br /></p>
                 *
                 * - "ingress" makes the target port accessible on every node,
                 *   regardless of whether there is a task for the service
                 *   running on that node or not.
                 * - "host" bypasses the routing mesh and publish the port
                 *   directly on the swarm node where that service is running.
                 */
                PublishMode: Schema.optional(Schema.enums(EndpointSpec_Ports_Ports_PublishMode)).withDefault(
                    () => EndpointSpec_Ports_Ports_PublishMode.INGRESS
                ),
            })
        )
    ),
}) {}

export class Service extends Schema.Class<Service>()({
    ID: Schema.optional(Schema.string),

    /**
     * The version number of the object such as node, service, etc. This is
     * needed to avoid conflicting writes. The client must send the version
     * number along with the modified specification when updating these
     * objects.
     *
     * This approach ensures safe concurrency and determinism in that the change
     * on the object may not be applied if the version number has changed from
     * the last read. In other words, if two update requests specify the same
     * base version, only one of the requests can succeed. As a result, two
     * separate update requests that happen at the same time will not
     * unintentionally overwrite each other.
     */
    Version: Schema.optional(Schema.struct({ Index: Schema.optional(Schema.number) })),
    CreatedAt: Schema.optional(Schema.string),
    UpdatedAt: Schema.optional(Schema.string),

    /** User modifiable configuration for a service. */
    Spec: Schema.optional(
        Schema.struct({
            /** Name of the service. */
            Name: Schema.optional(Schema.string),

            /** User-defined key/value metadata. */
            Labels: Schema.optional(Schema.struct({})),

            /** User modifiable task configuration. */
            TaskTemplate: Schema.optional(
                Schema.struct({
                    /**
                     * Plugin spec for the service. _(Experimental release
                     * only.)_<p><br /></p>> **Note**: ContainerSpec,
                     * NetworkAttachmentSpec, and> PluginSpec are mutually
                     * exclusive. PluginSpec is only> Used when the Runtime
                     * field is set to `plugin`.> NetworkAttachmentSpec is used
                     * when the Runtime field is> Set to `attachment`.
                     */
                    PluginSpec: Schema.optional(
                        Schema.struct({
                            /** The name or 'alias' to use for the plugin. */
                            Name: Schema.optional(Schema.string),

                            /** The plugin image reference to use. */
                            Remote: Schema.optional(Schema.string),

                            /** Disable the plugin once scheduled. */
                            Disabled: Schema.optional(Schema.boolean),
                            PluginPrivilege: Schema.optional(
                                Schema.array(
                                    Schema.struct({
                                        Name: Schema.optional(Schema.string),
                                        Description: Schema.optional(Schema.string),
                                        Value: Schema.optional(Schema.array(Schema.string)),
                                    })
                                )
                            ),
                        })
                    ),

                    /**
                     * Container spec for the service.<p><br /></p>> **Note**:
                     * ContainerSpec, NetworkAttachmentSpec, and> PluginSpec are
                     * mutually exclusive. PluginSpec is only> Used when the
                     * Runtime field is set to `plugin`.> NetworkAttachmentSpec
                     * is used when the Runtime field is> Set to `attachment`.
                     */
                    ContainerSpec: Schema.optional(
                        Schema.struct({
                            /** The image name to use for the container */
                            Image: Schema.optional(Schema.string),

                            /** User-defined key/value data. */
                            Labels: Schema.optional(Schema.struct({})),

                            /** The command to be run in the image. */
                            Command: Schema.optional(Schema.array(Schema.string)),

                            /** Arguments to the command. */
                            Args: Schema.optional(Schema.array(Schema.string)),

                            /**
                             * The hostname to use for the container, as a valid
                             * [RFC 1123](https://tools.ietf.org/html/rfc1123)
                             * hostname.
                             */
                            Hostname: Schema.optional(Schema.string),

                            /**
                             * A list of environment variables in the form
                             * `VAR=value`.
                             */
                            Env: Schema.optional(Schema.array(Schema.string)),

                            /** The working directory for commands to run in. */
                            Dir: Schema.optional(Schema.string),

                            /** The user inside the container. */
                            User: Schema.optional(Schema.string),

                            /**
                             * A list of additional groups that the container
                             * process will run as.
                             */
                            Groups: Schema.optional(Schema.array(Schema.string)),

                            /** Security options for the container */
                            Privileges: Schema.optional(
                                Schema.struct({
                                    /**
                                     * CredentialSpec for managed service
                                     * account (Windows only)
                                     */
                                    CredentialSpec: Schema.optional(
                                        Schema.struct({
                                            /**
                                             * Load credential spec from a Swarm
                                             * Config with the given ID. The
                                             * specified config must also be
                                             * present in the Configs field with
                                             * the Runtime property set.<p><br
                                             * /></p>> **Note**:
                                             * `CredentialSpec.File`,
                                             * `CredentialSpec.Registry`,> And
                                             * `CredentialSpec.Config` are>
                                             * Mutually exclusive.
                                             */
                                            Config: Schema.optional(Schema.string),

                                            /**
                                             * Load credential spec from this
                                             * file. The file is read by the
                                             * daemon, and must be present in
                                             * the `CredentialSpecs`
                                             * subdirectory in the docker data
                                             * directory, which defaults to
                                             * `C:\ProgramData\Docker\` on
                                             * Windows.
                                             *
                                             * For example, specifying
                                             * `spec.json` loads
                                             * `C:\ProgramData\Docker\CredentialSpecs\spec.json`.<p><br
                                             * /></p>> **Note**:
                                             * `CredentialSpec.File`,
                                             * `CredentialSpec.Registry`,> And
                                             * `CredentialSpec.Config` are>
                                             * Mutually exclusive.
                                             */
                                            File: Schema.optional(Schema.string),

                                            /**
                                             * Load credential spec from this
                                             * value in the Windows registry.
                                             * The specified registry value must
                                             * be located in:
                                             *
                                             * `HKLM\SOFTWARE\Microsoft\Windows
                                             * NT\CurrentVersion\Virtualization\Containers\CredentialSpecs`<p><br
                                             * /></p>> **Note**:
                                             * `CredentialSpec.File`,
                                             * `CredentialSpec.Registry`,> And
                                             * `CredentialSpec.Config` are>
                                             * Mutually exclusive.
                                             */
                                            Registry: Schema.optional(Schema.string),
                                        })
                                    ),

                                    /** SELinux labels of the container */
                                    SELinuxContext: Schema.optional(
                                        Schema.struct({
                                            /** Disable SELinux */
                                            Disable: Schema.optional(Schema.boolean),

                                            /** SELinux user label */
                                            User: Schema.optional(Schema.string),

                                            /** SELinux role label */
                                            Role: Schema.optional(Schema.string),

                                            /** SELinux type label */
                                            Type: Schema.optional(Schema.string),

                                            /** SELinux level label */
                                            Level: Schema.optional(Schema.string),
                                        })
                                    ),

                                    /**
                                     * Options for configuring seccomp on the
                                     * container
                                     */
                                    Seccomp: Schema.optional(
                                        Schema.struct({
                                            Mode: Schema.enums(
                                                Service_Spec_TaskTemplate_ContainerSpec_Privileges_Seccomp_Mode
                                            ),

                                            /**
                                             * The custom seccomp profile as a
                                             * json object
                                             */
                                            Profile: Schema.optional(Schema.string),
                                        })
                                    ),

                                    /**
                                     * Options for configuring AppArmor on the
                                     * container
                                     */
                                    AppArmor: Schema.optional(
                                        Schema.struct({
                                            Mode: Schema.enums(
                                                Service_Spec_TaskTemplate_ContainerSpec_Privileges_AppArmor_Mode
                                            ),
                                        })
                                    ),

                                    /**
                                     * Configuration of the no_new_privs bit in
                                     * the container
                                     */
                                    NoNewPrivileges: Schema.optional(Schema.boolean),
                                })
                            ),

                            /** Whether a pseudo-TTY should be allocated. */
                            TTY: Schema.optional(Schema.boolean),

                            /** Open `stdin` */
                            OpenStdin: Schema.optional(Schema.boolean),

                            /**
                             * Mount the container's root filesystem as read
                             * only.
                             */
                            ReadOnly: Schema.optional(Schema.boolean),

                            /**
                             * Specification for mounts to be added to
                             * containers created as part of the service.
                             */
                            Mounts: Schema.optional(
                                Schema.array(
                                    Schema.struct({
                                        /** Container path. */
                                        Target: Schema.optional(Schema.string),

                                        /**
                                         * Mount source (e.g. a volume name, a
                                         * host path).
                                         */
                                        Source: Schema.optional(Schema.string),

                                        /**
                                         * The mount type. Available types:
                                         *
                                         * - `bind` Mounts a file or directory
                                         *   from the host into the container.
                                         *   Must exist prior to creating the
                                         *   container.
                                         * - `volume` Creates a volume with the
                                         *   given name and options (or uses a
                                         *   pre-existing volume with the same
                                         *   name and options). These are
                                         *   **not** removed when the container
                                         *   is removed.
                                         * - `tmpfs` Create a tmpfs with the given
                                         *   options. The mount source cannot be
                                         *   specified for tmpfs.
                                         * - `npipe` Mounts a named pipe from the
                                         *   host into the container. Must exist
                                         *   prior to creating the container.
                                         * - `cluster` a Swarm cluster volume
                                         */
                                        Type: Schema.enums(Service_Spec_TaskTemplate_ContainerSpec_Mounts_Mounts_Type),

                                        /**
                                         * Whether the mount should be
                                         * read-only.
                                         */
                                        ReadOnly: Schema.optional(Schema.boolean),

                                        /**
                                         * The consistency requirement for the
                                         * mount: `default`, `consistent`,
                                         * `cached`, or `delegated`.
                                         */
                                        Consistency: Schema.optional(Schema.string),

                                        /**
                                         * Optional configuration for the `bind`
                                         * type.
                                         */
                                        BindOptions: Schema.optional(
                                            Schema.struct({
                                                /**
                                                 * A propagation mode with the
                                                 * value `[r]private`,
                                                 * `[r]shared`, or `[r]slave`.
                                                 */
                                                Propagation: Schema.enums(
                                                    Service_Spec_TaskTemplate_ContainerSpec_Mounts_Mounts_BindOptions_Propagation
                                                ),

                                                /** Disable recursive bind mount. */
                                                NonRecursive: Schema.optional(Schema.boolean),

                                                /**
                                                 * Create mount point on host if
                                                 * missing
                                                 */
                                                CreateMountpoint: Schema.optional(Schema.boolean),

                                                /**
                                                 * Make the mount
                                                 * non-recursively read-only,
                                                 * but still leave the mount
                                                 * recursive (unless
                                                 * NonRecursive is set to true
                                                 * in conjunction).
                                                 */
                                                ReadOnlyNonRecursive: Schema.optional(Schema.boolean),

                                                /**
                                                 * Raise an error if the mount
                                                 * cannot be made recursively
                                                 * read-only.
                                                 */
                                                ReadOnlyForceRecursive: Schema.optional(Schema.boolean),
                                            })
                                        ),

                                        /**
                                         * Optional configuration for the
                                         * `volume` type.
                                         */
                                        VolumeOptions: Schema.optional(
                                            Schema.struct({
                                                /**
                                                 * Populate volume with data
                                                 * from the target.
                                                 */
                                                NoCopy: Schema.optional(Schema.boolean),

                                                /**
                                                 * User-defined key/value
                                                 * metadata.
                                                 */
                                                Labels: Schema.optional(Schema.struct({})),

                                                /**
                                                 * Map of driver specific
                                                 * options
                                                 */
                                                DriverConfig: Schema.optional(
                                                    Schema.struct({
                                                        /**
                                                         * Name of the driver to
                                                         * use to create the
                                                         * volume.
                                                         */
                                                        Name: Schema.optional(Schema.string),

                                                        /**
                                                         * Key/value map of
                                                         * driver specific
                                                         * options.
                                                         */
                                                        Options: Schema.optional(Schema.struct({})),
                                                    })
                                                ),
                                            })
                                        ),

                                        /**
                                         * Optional configuration for the
                                         * `tmpfs` type.
                                         */
                                        TmpfsOptions: Schema.optional(
                                            Schema.struct({
                                                /**
                                                 * The size for the tmpfs mount
                                                 * in bytes.
                                                 */
                                                SizeBytes: Schema.optional(Schema.number),

                                                /**
                                                 * The permission mode for the
                                                 * tmpfs mount in an integer.
                                                 */
                                                Mode: Schema.optional(Schema.number),
                                            })
                                        ),
                                    })
                                )
                            ),

                            /** Signal to stop the container. */
                            StopSignal: Schema.optional(Schema.string),

                            /**
                             * Amount of time to wait for the container to
                             * terminate before forcefully killing it.
                             */
                            StopGracePeriod: Schema.optional(Schema.number),

                            /**
                             * A test to perform to check that the container is
                             * healthy.
                             */
                            HealthCheck: Schema.optional(
                                Schema.struct({
                                    /**
                                     * The test to perform. Possible values are:
                                     *
                                     * - `[]` inherit healthcheck from image or
                                     *   parent image
                                     * - `["NONE"]` disable healthcheck
                                     * - `["CMD", args...]` exec arguments
                                     *   directly
                                     * - `["CMD-SHELL", command]` run command with
                                     *   system's default shell
                                     */
                                    Test: Schema.optional(Schema.array(Schema.string)),

                                    /**
                                     * The time to wait between checks in
                                     * nanoseconds. It should be 0 or at least
                                     * 1000000 (1 ms). 0 means inherit.
                                     */
                                    Interval: Schema.optional(Schema.number),

                                    /**
                                     * The time to wait before considering the
                                     * check to have hung. It should be 0 or at
                                     * least 1000000 (1 ms). 0 means inherit.
                                     */
                                    Timeout: Schema.optional(Schema.number),

                                    /**
                                     * The number of consecutive failures needed
                                     * to consider a container as unhealthy. 0
                                     * means inherit.
                                     */
                                    Retries: Schema.optional(Schema.number),

                                    /**
                                     * Start period for the container to
                                     * initialize before starting health-retries
                                     * countdown in nanoseconds. It should be 0
                                     * or at least 1000000 (1 ms). 0 means
                                     * inherit.
                                     */
                                    StartPeriod: Schema.optional(Schema.number),

                                    /**
                                     * The time to wait between checks in
                                     * nanoseconds during the start period. It
                                     * should be 0 or at least 1000000 (1 ms). 0
                                     * means inherit.
                                     */
                                    StartInterval: Schema.optional(Schema.number),
                                })
                            ),

                            /**
                             * A list of hostname/IP mappings to add to the
                             * container's `hosts` file. The format of extra
                             * hosts is specified in the
                             * [hosts(5)](http://man7.org/linux/man-pages/man5/hosts.5.html)
                             * man page:
                             *
                             *     IP_address canonical_hostname [aliases...]
                             */
                            Hosts: Schema.optional(Schema.array(Schema.string)),

                            /**
                             * Specification for DNS related configurations in
                             * resolver configuration file (`resolv.conf`).
                             */
                            DNSConfig: Schema.optional(
                                Schema.struct({
                                    /** The IP addresses of the name servers. */
                                    Nameservers: Schema.optional(Schema.array(Schema.string)),

                                    /** A search list for host-name lookup. */
                                    Search: Schema.optional(Schema.array(Schema.string)),

                                    /**
                                     * A list of internal resolver variables to
                                     * be modified (e.g., `debug`, `ndots:3`,
                                     * etc.).
                                     */
                                    Options: Schema.optional(Schema.array(Schema.string)),
                                })
                            ),

                            /**
                             * Secrets contains references to zero or more
                             * secrets that will be exposed to the service.
                             */
                            Secrets: Schema.optional(
                                Schema.array(
                                    Schema.struct({
                                        /**
                                         * File represents a specific target
                                         * that is backed by a file.
                                         */
                                        File: Schema.optional(
                                            Schema.struct({
                                                /**
                                                 * Name represents the final
                                                 * filename in the filesystem.
                                                 */
                                                Name: Schema.optional(Schema.string),

                                                /** UID represents the file UID. */
                                                UID: Schema.optional(Schema.string),

                                                /** GID represents the file GID. */
                                                GID: Schema.optional(Schema.string),

                                                /**
                                                 * Mode represents the FileMode
                                                 * of the file.
                                                 */
                                                Mode: Schema.optional(Schema.number),
                                            })
                                        ),

                                        /**
                                         * SecretID represents the ID of the
                                         * specific secret that we're
                                         * referencing.
                                         */
                                        SecretID: Schema.optional(Schema.string),

                                        /**
                                         * SecretName is the name of the secret
                                         * that this references, but this is
                                         * just provided for lookup/display
                                         * purposes. The secret in the reference
                                         * will be identified by its ID.
                                         */
                                        SecretName: Schema.optional(Schema.string),
                                    })
                                )
                            ),

                            /**
                             * Configs contains references to zero or more
                             * configs that will be exposed to the service.
                             */
                            Configs: Schema.optional(
                                Schema.array(
                                    Schema.struct({
                                        /**
                                         * File represents a specific target
                                         * that is backed by a file.<p><br
                                         * /><p>> **Note**: `Configs.File` and
                                         * `Configs.Runtime` are mutually>
                                         * Exclusive
                                         */
                                        File: Schema.optional(
                                            Schema.struct({
                                                /**
                                                 * Name represents the final
                                                 * filename in the filesystem.
                                                 */
                                                Name: Schema.optional(Schema.string),

                                                /** UID represents the file UID. */
                                                UID: Schema.optional(Schema.string),

                                                /** GID represents the file GID. */
                                                GID: Schema.optional(Schema.string),

                                                /**
                                                 * Mode represents the FileMode
                                                 * of the file.
                                                 */
                                                Mode: Schema.optional(Schema.number),
                                            })
                                        ),

                                        /**
                                         * Runtime represents a target that is
                                         * not mounted into the container but is
                                         * used by the task<p><br /><p>>
                                         * **Note**: `Configs.File` and
                                         * `Configs.Runtime` are mutually>
                                         * Exclusive
                                         */
                                        Runtime: Schema.optional(Schema.struct({})),

                                        /**
                                         * ConfigID represents the ID of the
                                         * specific config that we're
                                         * referencing.
                                         */
                                        ConfigID: Schema.optional(Schema.string),

                                        /**
                                         * ConfigName is the name of the config
                                         * that this references, but this is
                                         * just provided for lookup/display
                                         * purposes. The config in the reference
                                         * will be identified by its ID.
                                         */
                                        ConfigName: Schema.optional(Schema.string),
                                    })
                                )
                            ),

                            /**
                             * Isolation technology of the containers running
                             * the service. (Windows only)
                             */
                            Isolation: Schema.enums(Service_Spec_TaskTemplate_ContainerSpec_Isolation),

                            /**
                             * Run an init inside the container that forwards
                             * signals and reaps processes. This field is
                             * omitted if empty, and the default (as configured
                             * on the daemon) is used.
                             */
                            Init: Schema.optional(Schema.nullable(Schema.boolean)),

                            /**
                             * Set kernel namedspaced parameters (sysctls) in
                             * the container. The Sysctls option on services
                             * accepts the same sysctls as the are supported on
                             * containers. Note that while the same sysctls are
                             * supported, no guarantees or checks are made about
                             * their suitability for a clustered environment,
                             * and it's up to the user to determine whether a
                             * given sysctl will work properly in a Service.
                             */
                            Sysctls: Schema.optional(Schema.struct({})),

                            /**
                             * A list of kernel capabilities to add to the
                             * default set for the container.
                             */
                            CapabilityAdd: Schema.optional(Schema.array(Schema.string)),

                            /**
                             * A list of kernel capabilities to drop from the
                             * default set for the container.
                             */
                            CapabilityDrop: Schema.optional(Schema.array(Schema.string)),

                            /**
                             * A list of resource limits to set in the
                             * container. For example: `{"Name": "nofile",
                             * "Soft": 1024, "Hard": 2048}`"
                             */
                            Ulimits: Schema.optional(
                                Schema.array(
                                    Schema.struct({
                                        /** Name of ulimit */
                                        Name: Schema.optional(Schema.string),

                                        /** Soft limit */
                                        Soft: Schema.optional(Schema.number),

                                        /** Hard limit */
                                        Hard: Schema.optional(Schema.number),
                                    })
                                )
                            ),
                        })
                    ),

                    /**
                     * Read-only spec type for non-swarm containers attached to
                     * swarm overlay networks.<p><br /></p>> **Note**:
                     * ContainerSpec, NetworkAttachmentSpec, and> PluginSpec are
                     * mutually exclusive. PluginSpec is only> Used when the
                     * Runtime field is set to `plugin`.> NetworkAttachmentSpec
                     * is used when the Runtime field is> Set to `attachment`.
                     */
                    NetworkAttachmentSpec: Schema.optional(
                        Schema.struct({
                            /** ID of the container represented by this task */
                            ContainerID: Schema.optional(Schema.string),
                        })
                    ),

                    /**
                     * Resource requirements which apply to each individual
                     * container created as part of the service.
                     */
                    Resources: Schema.optional(
                        Schema.struct({
                            /** Define resources limits. */
                            Limits: Schema.optional(
                                Schema.struct({
                                    NanoCPUs: Schema.optional(Schema.number),
                                    MemoryBytes: Schema.optional(Schema.number),

                                    /**
                                     * Limits the maximum number of PIDs in the
                                     * container. Set `0` for unlimited.
                                     */
                                    Pids: Schema.optional(Schema.number),
                                })
                            ),

                            /** Define resources reservation. */
                            Reservations: Schema.optional(
                                Schema.struct({
                                    NanoCPUs: Schema.optional(Schema.number),
                                    MemoryBytes: Schema.optional(Schema.number),

                                    /**
                                     * User-defined resources can be either
                                     * Integer resources (e.g, `SSD=3`) or
                                     * String resources (e.g, `GPU=UUID1`).
                                     */
                                    GenericResources: Schema.optional(
                                        Schema.array(
                                            Schema.struct({
                                                NamedResourceSpec: Schema.optional(
                                                    Schema.struct({
                                                        Kind: Schema.optional(Schema.string),
                                                        Value: Schema.optional(Schema.string),
                                                    })
                                                ),
                                                DiscreteResourceSpec: Schema.optional(
                                                    Schema.struct({
                                                        Kind: Schema.optional(Schema.string),
                                                        Value: Schema.optional(Schema.number),
                                                    })
                                                ),
                                            })
                                        )
                                    ),
                                })
                            ),
                        })
                    ),

                    /**
                     * Specification for the restart policy which applies to
                     * containers created as part of this service.
                     */
                    RestartPolicy: Schema.optional(
                        Schema.struct({
                            /** Condition for restart. */
                            Condition: Schema.enums(Service_Spec_TaskTemplate_RestartPolicy_Condition),

                            /** Delay between restart attempts. */
                            Delay: Schema.optional(Schema.number),

                            /**
                             * Maximum attempts to restart a given container
                             * before giving up (default value is 0, which is
                             * ignored).
                             */
                            MaxAttempts: Schema.optional(Schema.number),

                            /**
                             * Windows is the time window used to evaluate the
                             * restart policy (default value is 0, which is
                             * unbounded).
                             */
                            Window: Schema.optional(Schema.number),
                        })
                    ),
                    Placement: Schema.optional(
                        Schema.struct({
                            /**
                             * An array of constraint expressions to limit the
                             * set of nodes where a task can be scheduled.
                             * Constraint expressions can either use a _match_
                             * (`==`) or _exclude_ (`!=`) rule. Multiple
                             * constraints find nodes that satisfy every
                             * expression (AND match). Constraints can match
                             * node or Docker Engine labels as follows:
                             *
                             * Node attribute | matches | example
                             * ---------------------|--------------------------------|-----------------------------------------------
                             * `node.id` | Node ID | `node.id==2ivku8v2gvtg4`
                             * `node.hostname` | Node hostname |
                             * `node.hostname!=node-2` `node.role` | Node role
                             * (`manager`/`worker`) | `node.role==manager`
                             * `node.platform.os` | Node operating system |
                             * `node.platform.os==windows` `node.platform.arch`
                             *
                             * | Node architecture |
                             *
                             * `node.platform.arch==x86_64` `node.labels` |
                             * User-defined node labels |
                             * `node.labels.security==high` `engine.labels` |
                             * Docker Engine's labels |
                             * `engine.labels.operatingsystem==ubuntu-14.04`
                             *
                             * `engine.labels` apply to Docker Engine labels
                             * like operating system, drivers, etc. Swarm
                             * administrators add `node.labels` for operational
                             * purposes by using the [`node update
                             * endpoint`](#operation/NodeUpdate).
                             */
                            Constraints: Schema.optional(Schema.array(Schema.string)),

                            /**
                             * Preferences provide a way to make the scheduler
                             * aware of factors such as topology. They are
                             * provided in order from highest to lowest
                             * precedence.
                             */
                            Preferences: Schema.optional(
                                Schema.array(
                                    Schema.struct({
                                        Spread: Schema.optional(
                                            Schema.struct({
                                                /**
                                                 * Label descriptor, such as
                                                 * `engine.labels.az`.
                                                 */
                                                SpreadDescriptor: Schema.optional(Schema.string),
                                            })
                                        ),
                                    })
                                )
                            ),

                            /**
                             * Maximum number of replicas for per node (default
                             * value is 0, which is unlimited)
                             */
                            MaxReplicas: Schema.optional(Schema.number),

                            /**
                             * Platforms stores all the platforms that the
                             * service's image can run on. This field is used in
                             * the platform filter for scheduling. If empty,
                             * then the platform filter is off, meaning there
                             * are no scheduling restrictions.
                             */
                            Platforms: Schema.optional(
                                Schema.array(
                                    Schema.struct({
                                        /**
                                         * Architecture represents the hardware
                                         * architecture (for example,
                                         * `x86_64`).
                                         */
                                        Architecture: Schema.optional(Schema.string),

                                        /**
                                         * OS represents the Operating System
                                         * (for example, `linux` or `windows`).
                                         */
                                        OS: Schema.optional(Schema.string),
                                    })
                                )
                            ),
                        })
                    ),

                    /**
                     * A counter that triggers an update even if no relevant
                     * parameters have been changed.
                     */
                    ForceUpdate: Schema.optional(Schema.number),

                    /**
                     * Runtime is the type of runtime specified for the task
                     * executor.
                     */
                    Runtime: Schema.optional(Schema.string),

                    /** Specifies which networks the service should attach to. */
                    Networks: Schema.optional(
                        Schema.array(
                            Schema.struct({
                                /**
                                 * The target network for attachment. Must be a
                                 * network name or ID.
                                 */
                                Target: Schema.optional(Schema.string),

                                /**
                                 * Discoverable alternate names for the service
                                 * on this network.
                                 */
                                Aliases: Schema.optional(Schema.array(Schema.string)),

                                /**
                                 * Driver attachment options for the network
                                 * target.
                                 */
                                DriverOpts: Schema.optional(Schema.struct({})),
                            })
                        )
                    ),

                    /**
                     * Specifies the log driver to use for tasks created from
                     * this spec. If not present, the default one for the swarm
                     * will be used, finally falling back to the engine default
                     * if not specified.
                     */
                    LogDriver: Schema.optional(
                        Schema.struct({
                            Name: Schema.optional(Schema.string),
                            Options: Schema.optional(Schema.struct({})),
                        })
                    ),
                })
            ),

            /** Scheduling mode for the service. */
            Mode: Schema.optional(
                Schema.struct({
                    Replicated: Schema.optional(Schema.struct({ Replicas: Schema.optional(Schema.number) })),
                    Global: Schema.optional(Schema.struct({})),

                    /**
                     * The mode used for services with a finite number of tasks
                     * that run to a completed state.
                     */
                    ReplicatedJob: Schema.optional(
                        Schema.struct({
                            /**
                             * The maximum number of replicas to run
                             * simultaneously.
                             */
                            MaxConcurrent: Schema.optional(Schema.number).withDefault(() => 1),

                            /**
                             * The total number of replicas desired to reach the
                             * Completed state. If unset, will default to the
                             * value of `MaxConcurrent`
                             */
                            TotalCompletions: Schema.optional(Schema.number),
                        })
                    ),

                    /**
                     * The mode used for services which run a task to the
                     * completed state on each valid node.
                     */
                    GlobalJob: Schema.optional(Schema.struct({})),
                })
            ),

            /** Specification for the update strategy of the service. */
            UpdateConfig: Schema.optional(
                Schema.struct({
                    /**
                     * Maximum number of tasks to be updated in one iteration (0
                     * means unlimited parallelism).
                     */
                    Parallelism: Schema.optional(Schema.number),

                    /** Amount of time between updates, in nanoseconds. */
                    Delay: Schema.optional(Schema.number),

                    /**
                     * Action to take if an updated task fails to run, or stops
                     * running during the update.
                     */
                    FailureAction: Schema.enums(Service_Spec_UpdateConfig_FailureAction),

                    /**
                     * Amount of time to monitor each updated task for failures,
                     * in nanoseconds.
                     */
                    Monitor: Schema.optional(Schema.number),

                    /**
                     * The fraction of tasks that may fail during an update
                     * before the failure action is invoked, specified as a
                     * floating point number between 0 and 1.
                     */
                    MaxFailureRatio: Schema.optional(Schema.number),

                    /**
                     * The order of operations when rolling out an updated task.
                     * Either the old task is shut down before the new task is
                     * started, or the new task is started before the old task
                     * is shut down.
                     */
                    Order: Schema.enums(Service_Spec_UpdateConfig_Order),
                })
            ),

            /** Specification for the rollback strategy of the service. */
            RollbackConfig: Schema.optional(
                Schema.struct({
                    /**
                     * Maximum number of tasks to be rolled back in one
                     * iteration (0 means unlimited parallelism).
                     */
                    Parallelism: Schema.optional(Schema.number),

                    /**
                     * Amount of time between rollback iterations, in
                     * nanoseconds.
                     */
                    Delay: Schema.optional(Schema.number),

                    /**
                     * Action to take if an rolled back task fails to run, or
                     * stops running during the rollback.
                     */
                    FailureAction: Schema.enums(Service_Spec_RollbackConfig_FailureAction),

                    /**
                     * Amount of time to monitor each rolled back task for
                     * failures, in nanoseconds.
                     */
                    Monitor: Schema.optional(Schema.number),

                    /**
                     * The fraction of tasks that may fail during a rollback
                     * before the failure action is invoked, specified as a
                     * floating point number between 0 and 1.
                     */
                    MaxFailureRatio: Schema.optional(Schema.number),

                    /**
                     * The order of operations when rolling back a task. Either
                     * the old task is shut down before the new task is started,
                     * or the new task is started before the old task is shut
                     * down.
                     */
                    Order: Schema.enums(Service_Spec_RollbackConfig_Order),
                })
            ),

            /**
             * Specifies which networks the service should attach to.
             *
             * Deprecated: This field is deprecated since v1.44. The Networks
             * field in TaskSpec should be used instead.
             */
            Networks: Schema.optional(
                Schema.array(
                    Schema.struct({
                        /**
                         * The target network for attachment. Must be a network
                         * name or ID.
                         */
                        Target: Schema.optional(Schema.string),

                        /**
                         * Discoverable alternate names for the service on this
                         * network.
                         */
                        Aliases: Schema.optional(Schema.array(Schema.string)),

                        /** Driver attachment options for the network target. */
                        DriverOpts: Schema.optional(Schema.struct({})),
                    })
                )
            ),

            /**
             * Properties that can be configured to access and load balance a
             * service.
             */
            EndpointSpec: Schema.optional(
                Schema.struct({
                    /**
                     * The mode of resolution to use for internal load balancing
                     * between tasks.
                     */
                    Mode: Schema.optional(Schema.enums(Service_Spec_EndpointSpec_Mode)).withDefault(
                        () => Service_Spec_EndpointSpec_Mode.VIP
                    ),

                    /**
                     * List of exposed ports that this service is accessible on
                     * from the outside. Ports can only be provided if `vip`
                     * resolution mode is used.
                     */
                    Ports: Schema.optional(
                        Schema.array(
                            Schema.struct({
                                Name: Schema.optional(Schema.string),
                                Protocol: Schema.enums(Service_Spec_EndpointSpec_Ports_Ports_Protocol),

                                /** The port inside the container. */
                                TargetPort: Schema.optional(Schema.number),

                                /** The port on the swarm hosts. */
                                PublishedPort: Schema.optional(Schema.number),

                                /**
                                 * The mode in which port is published.<p><br
                                 * /></p>
                                 *
                                 * - "ingress" makes the target port accessible on
                                 *   every node, regardless of whether there is
                                 *   a task for the service running on that node
                                 *   or not.
                                 * - "host" bypasses the routing mesh and publish
                                 *   the port directly on the swarm node where
                                 *   that service is running.
                                 */
                                PublishMode: Schema.optional(
                                    Schema.enums(Service_Spec_EndpointSpec_Ports_Ports_PublishMode)
                                ).withDefault(() => Service_Spec_EndpointSpec_Ports_Ports_PublishMode.INGRESS),
                            })
                        )
                    ),
                })
            ),
        })
    ),
    Endpoint: Schema.optional(
        Schema.struct({
            /**
             * Properties that can be configured to access and load balance a
             * service.
             */
            Spec: Schema.optional(
                Schema.struct({
                    /**
                     * The mode of resolution to use for internal load balancing
                     * between tasks.
                     */
                    Mode: Schema.optional(Schema.enums(Service_Endpoint_Spec_Mode)).withDefault(
                        () => Service_Endpoint_Spec_Mode.VIP
                    ),

                    /**
                     * List of exposed ports that this service is accessible on
                     * from the outside. Ports can only be provided if `vip`
                     * resolution mode is used.
                     */
                    Ports: Schema.optional(
                        Schema.array(
                            Schema.struct({
                                Name: Schema.optional(Schema.string),
                                Protocol: Schema.enums(Service_Endpoint_Spec_Ports_Ports_Protocol),

                                /** The port inside the container. */
                                TargetPort: Schema.optional(Schema.number),

                                /** The port on the swarm hosts. */
                                PublishedPort: Schema.optional(Schema.number),

                                /**
                                 * The mode in which port is published.<p><br
                                 * /></p>
                                 *
                                 * - "ingress" makes the target port accessible on
                                 *   every node, regardless of whether there is
                                 *   a task for the service running on that node
                                 *   or not.
                                 * - "host" bypasses the routing mesh and publish
                                 *   the port directly on the swarm node where
                                 *   that service is running.
                                 */
                                PublishMode: Schema.optional(
                                    Schema.enums(Service_Endpoint_Spec_Ports_Ports_PublishMode)
                                ).withDefault(() => Service_Endpoint_Spec_Ports_Ports_PublishMode.INGRESS),
                            })
                        )
                    ),
                })
            ),
            Ports: Schema.optional(
                Schema.array(
                    Schema.struct({
                        Name: Schema.optional(Schema.string),
                        Protocol: Schema.enums(Service_Endpoint_Ports_Ports_Protocol),

                        /** The port inside the container. */
                        TargetPort: Schema.optional(Schema.number),

                        /** The port on the swarm hosts. */
                        PublishedPort: Schema.optional(Schema.number),

                        /**
                         * The mode in which port is published.<p><br /></p>
                         *
                         * - "ingress" makes the target port accessible on every
                         *   node, regardless of whether there is a task for the
                         *   service running on that node or not.
                         * - "host" bypasses the routing mesh and publish the port
                         *   directly on the swarm node where that service is
                         *   running.
                         */
                        PublishMode: Schema.optional(
                            Schema.enums(Service_Endpoint_Ports_Ports_PublishMode)
                        ).withDefault(() => Service_Endpoint_Ports_Ports_PublishMode.INGRESS),
                    })
                )
            ),
            VirtualIPs: Schema.optional(
                Schema.array(
                    Schema.struct({ NetworkID: Schema.optional(Schema.string), Addr: Schema.optional(Schema.string) })
                )
            ),
        })
    ),

    /** The status of a service update. */
    UpdateStatus: Schema.optional(
        Schema.struct({
            State: Schema.enums(Service_UpdateStatus_State),
            StartedAt: Schema.optional(Schema.string),
            CompletedAt: Schema.optional(Schema.string),
            Message: Schema.optional(Schema.string),
        })
    ),

    /**
     * The status of the service's tasks. Provided only when requested as part
     * of a ServiceList operation.
     */
    ServiceStatus: Schema.optional(
        Schema.struct({
            /**
             * The number of tasks for the service currently in the Running
             * state.
             */
            RunningTasks: Schema.optional(Schema.number),

            /**
             * The number of tasks for the service desired to be running. For
             * replicated services, this is the replica count from the service
             * spec. For global services, this is computed by taking count of
             * all tasks for the service with a Desired State other than
             * Shutdown.
             */
            DesiredTasks: Schema.optional(Schema.number),

            /**
             * The number of tasks for a job that are in the Completed state.
             * This field must be cross-referenced with the service type, as the
             * value of 0 may mean the service is not in a job mode, or it may
             * mean the job-mode service has no tasks yet Completed.
             */
            CompletedTasks: Schema.optional(Schema.number),
        })
    ),

    /**
     * The status of the service when it is in one of ReplicatedJob or GlobalJob
     * modes. Absent on Replicated and Global mode services. The JobIteration is
     * an ObjectVersion, but unlike the Service's version, does not need to be
     * sent with an update request.
     */
    JobStatus: Schema.optional(
        Schema.struct({
            /**
             * JobIteration is a value increased each time a Job is executed,
             * successfully or otherwise. "Executed", in this case, means the
             * job as a whole has been started, not that an individual Task has
             * been launched. A job is "Executed" when its ServiceSpec is
             * updated. JobIteration can be used to disambiguate Tasks belonging
             * to different executions of a job. Though JobIteration will
             * increase with each subsequent execution, it may not necessarily
             * increase by 1, and so JobIteration should not be used to
             */
            JobIteration: Schema.optional(Schema.struct({ Index: Schema.optional(Schema.number) })),

            /**
             * The last time, as observed by the server, that this job was
             * started.
             */
            LastExecution: Schema.optional(Schema.string),
        })
    ),
}) {}

export class ImageDeleteResponseItem extends Schema.Class<ImageDeleteResponseItem>()({
    /** The image ID of an image that was untagged */
    Untagged: Schema.optional(Schema.string),

    /** The image ID of an image that was deleted */
    Deleted: Schema.optional(Schema.string),
}) {}

export class ServiceCreateResponse extends Schema.Class<ServiceCreateResponse>()({
    /** The ID of the created service. */
    ID: Schema.optional(Schema.string),

    /**
     * Optional warning message.
     *
     * FIXME(thaJeztah): this should have "omitempty" in the generated type.
     */
    Warnings: Schema.optional(Schema.nullable(Schema.array(Schema.string))),
}) {}

export class ServiceUpdateResponse extends Schema.Class<ServiceUpdateResponse>()({
    /** Optional warning messages */
    Warnings: Schema.optional(Schema.array(Schema.string)),
}) {}

export class ContainerSummary extends Schema.Class<ContainerSummary>()({
    /** The ID of this container */
    Id: Schema.optional(Schema.string),

    /** The names that this container has been given */
    Names: Schema.optional(Schema.array(Schema.string)),

    /** The name of the image used when creating this container */
    Image: Schema.optional(Schema.string),

    /** The ID of the image that this container was created from */
    ImageID: Schema.optional(Schema.string),

    /** Command to run when starting the container */
    Command: Schema.optional(Schema.string),

    /** When the container was created */
    Created: Schema.optional(Schema.number),

    /** The ports exposed by this container */
    Ports: Schema.optional(
        Schema.array(
            Schema.struct({
                /** Host IP address that the container's port is mapped to */
                IP: Schema.optional(Schema.string),

                /** Port on the container */
                PrivatePort: Schema.number,

                /** Port exposed on the host */
                PublicPort: Schema.optional(Schema.number),
                Type: Schema.enums(ContainerSummary_Ports_Ports_Type),
            })
        )
    ),

    /** The size of files that have been created or changed by this container */
    SizeRw: Schema.optional(Schema.number),

    /** The total size of all the files in this container */
    SizeRootFs: Schema.optional(Schema.number),

    /** User-defined key/value metadata. */
    Labels: Schema.optional(Schema.struct({})),

    /** The state of this container (e.g. `Exited`) */
    State: Schema.optional(Schema.string),

    /** Additional human-readable status of this container (e.g. `Exit 0`) */
    Status: Schema.optional(Schema.string),
    HostConfig: Schema.optional(Schema.struct({ NetworkMode: Schema.optional(Schema.string) })),

    /** A summary of the container's network settings */
    NetworkSettings: Schema.optional(Schema.struct({ Networks: Schema.optional(Schema.struct({})) })),
    Mounts: Schema.optional(
        Schema.array(
            Schema.struct({
                /**
                 * The mount type:
                 *
                 * - `bind` a mount of a file or directory from the host into the
                 *   container.
                 * - `volume` a docker volume with the given `Name`.
                 * - `tmpfs` a `tmpfs`.
                 * - `npipe` a named pipe from the host into the container.
                 * - `cluster` a Swarm cluster volume
                 */
                Type: Schema.enums(ContainerSummary_Mounts_Mounts_Type),

                /**
                 * Name is the name reference to the underlying data defined by
                 * `Source` e.g., the volume name.
                 */
                Name: Schema.optional(Schema.string),

                /**
                 * Source location of the mount.
                 *
                 * For volumes, this contains the storage location of the volume
                 * (within `/var/lib/docker/volumes/`). For bind-mounts, and
                 * `npipe`, this contains the source (host) part of the
                 * bind-mount. For `tmpfs` mount points, this field is empty.
                 */
                Source: Schema.optional(Schema.string),

                /**
                 * Destination is the path relative to the container root (`/`)
                 * where the `Source` is mounted inside the container.
                 */
                Destination: Schema.optional(Schema.string),

                /**
                 * Driver is the volume driver used to create the volume (if it
                 * is a volume).
                 */
                Driver: Schema.optional(Schema.string),

                /**
                 * Mode is a comma separated list of options supplied by the
                 * user when creating the bind/volume mount.
                 *
                 * The default is platform-specific (`"z"` on Linux, empty on
                 * Windows).
                 */
                Mode: Schema.optional(Schema.string),

                /** Whether the mount is mounted writable (read-write). */
                RW: Schema.optional(Schema.boolean),

                /**
                 * Propagation describes how mounts are propagated from the host
                 * into the mount point, and vice-versa. Refer to the [Linux
                 * kernel
                 * documentation](https://www.kernel.org/doc/Documentation/filesystems/sharedsubtree.txt)
                 * for details. This field is not used on Windows.
                 */
                Propagation: Schema.optional(Schema.string),
            })
        )
    ),
}) {}

export class Driver extends Schema.Class<Driver>()({
    /** Name of the driver. */
    Name: Schema.string,

    /** Key/value map of driver-specific options. */
    Options: Schema.optional(Schema.struct({})),
}) {}

export class SecretSpec extends Schema.Class<SecretSpec>()({
    /** User-defined name of the secret. */
    Name: Schema.optional(Schema.string),

    /** User-defined key/value metadata. */
    Labels: Schema.optional(Schema.struct({})),

    /**
     * Base64-url-safe-encoded ([RFC
     * 4648](https://tools.ietf.org/html/rfc4648#section-5)) data to store as
     * secret.
     *
     * This field is only used to _create_ a secret, and is not returned by
     * other endpoints.
     */
    Data: Schema.optional(Schema.string),

    /**
     * Name of the secrets driver used to fetch the secret's value from an
     * external secret store.
     */
    Driver: Schema.optional(
        Schema.struct({
            /** Name of the driver. */
            Name: Schema.string,

            /** Key/value map of driver-specific options. */
            Options: Schema.optional(Schema.struct({})),
        })
    ),

    /**
     * Templating driver, if applicable
     *
     * Templating controls whether and how to evaluate the config payload as a
     * template. If no driver is set, no templating is used.
     */
    Templating: Schema.optional(
        Schema.struct({
            /** Name of the driver. */
            Name: Schema.string,

            /** Key/value map of driver-specific options. */
            Options: Schema.optional(Schema.struct({})),
        })
    ),
}) {}

export class Secret extends Schema.Class<Secret>()({
    ID: Schema.optional(Schema.string),

    /**
     * The version number of the object such as node, service, etc. This is
     * needed to avoid conflicting writes. The client must send the version
     * number along with the modified specification when updating these
     * objects.
     *
     * This approach ensures safe concurrency and determinism in that the change
     * on the object may not be applied if the version number has changed from
     * the last read. In other words, if two update requests specify the same
     * base version, only one of the requests can succeed. As a result, two
     * separate update requests that happen at the same time will not
     * unintentionally overwrite each other.
     */
    Version: Schema.optional(Schema.struct({ Index: Schema.optional(Schema.number) })),
    CreatedAt: Schema.optional(Schema.string),
    UpdatedAt: Schema.optional(Schema.string),
    Spec: Schema.optional(
        Schema.struct({
            /** User-defined name of the secret. */
            Name: Schema.optional(Schema.string),

            /** User-defined key/value metadata. */
            Labels: Schema.optional(Schema.struct({})),

            /**
             * Base64-url-safe-encoded ([RFC
             * 4648](https://tools.ietf.org/html/rfc4648#section-5)) data to
             * store as secret.
             *
             * This field is only used to _create_ a secret, and is not returned
             * by other endpoints.
             */
            Data: Schema.optional(Schema.string),

            /**
             * Name of the secrets driver used to fetch the secret's value from
             * an external secret store.
             */
            Driver: Schema.optional(
                Schema.struct({
                    /** Name of the driver. */
                    Name: Schema.string,

                    /** Key/value map of driver-specific options. */
                    Options: Schema.optional(Schema.struct({})),
                })
            ),

            /**
             * Templating driver, if applicable
             *
             * Templating controls whether and how to evaluate the config
             * payload as a template. If no driver is set, no templating is
             * used.
             */
            Templating: Schema.optional(
                Schema.struct({
                    /** Name of the driver. */
                    Name: Schema.string,

                    /** Key/value map of driver-specific options. */
                    Options: Schema.optional(Schema.struct({})),
                })
            ),
        })
    ),
}) {}

export class ConfigSpec extends Schema.Class<ConfigSpec>()({
    /** User-defined name of the config. */
    Name: Schema.optional(Schema.string),

    /** User-defined key/value metadata. */
    Labels: Schema.optional(Schema.struct({})),

    /**
     * Base64-url-safe-encoded ([RFC
     * 4648](https://tools.ietf.org/html/rfc4648#section-5)) config data.
     */
    Data: Schema.optional(Schema.string),

    /**
     * Templating driver, if applicable
     *
     * Templating controls whether and how to evaluate the config payload as a
     * template. If no driver is set, no templating is used.
     */
    Templating: Schema.optional(
        Schema.struct({
            /** Name of the driver. */
            Name: Schema.string,

            /** Key/value map of driver-specific options. */
            Options: Schema.optional(Schema.struct({})),
        })
    ),
}) {}

export class Config extends Schema.Class<Config>()({
    ID: Schema.optional(Schema.string),

    /**
     * The version number of the object such as node, service, etc. This is
     * needed to avoid conflicting writes. The client must send the version
     * number along with the modified specification when updating these
     * objects.
     *
     * This approach ensures safe concurrency and determinism in that the change
     * on the object may not be applied if the version number has changed from
     * the last read. In other words, if two update requests specify the same
     * base version, only one of the requests can succeed. As a result, two
     * separate update requests that happen at the same time will not
     * unintentionally overwrite each other.
     */
    Version: Schema.optional(Schema.struct({ Index: Schema.optional(Schema.number) })),
    CreatedAt: Schema.optional(Schema.string),
    UpdatedAt: Schema.optional(Schema.string),
    Spec: Schema.optional(
        Schema.struct({
            /** User-defined name of the config. */
            Name: Schema.optional(Schema.string),

            /** User-defined key/value metadata. */
            Labels: Schema.optional(Schema.struct({})),

            /**
             * Base64-url-safe-encoded ([RFC
             * 4648](https://tools.ietf.org/html/rfc4648#section-5)) config
             * data.
             */
            Data: Schema.optional(Schema.string),

            /**
             * Templating driver, if applicable
             *
             * Templating controls whether and how to evaluate the config
             * payload as a template. If no driver is set, no templating is
             * used.
             */
            Templating: Schema.optional(
                Schema.struct({
                    /** Name of the driver. */
                    Name: Schema.string,

                    /** Key/value map of driver-specific options. */
                    Options: Schema.optional(Schema.struct({})),
                })
            ),
        })
    ),
}) {}

export class ContainerState extends Schema.Class<ContainerState>()({
    /**
     * String representation of the container state. Can be one of "created",
     * "running", "paused", "restarting", "removing", "exited", or "dead".
     */
    Status: Schema.enums(ContainerState_Status),

    /**
     * Whether this container is running.
     *
     * Note that a running container can be _paused_. The `Running` and `Paused`
     * booleans are not mutually exclusive:
     *
     * When pausing a container (on Linux), the freezer cgroup is used to
     * suspend all processes in the container. Freezing the process requires the
     * process to be running. As a result, paused containers are both `Running`
     * _and_ `Paused`.
     *
     * Use the `Status` field instead to determine if a container's state is
     * "running".
     */
    Running: Schema.optional(Schema.boolean),

    /** Whether this container is paused. */
    Paused: Schema.optional(Schema.boolean),

    /** Whether this container is restarting. */
    Restarting: Schema.optional(Schema.boolean),

    /**
     * Whether a process within this container has been killed because it ran
     * out of memory since the container was last started.
     */
    OOMKilled: Schema.optional(Schema.boolean),
    Dead: Schema.optional(Schema.boolean),

    /** The process ID of this container */
    Pid: Schema.optional(Schema.number),

    /** The last exit code of this container */
    ExitCode: Schema.optional(Schema.number),
    Error: Schema.optional(Schema.string),

    /** The time when this container was last started. */
    StartedAt: Schema.optional(Schema.string),

    /** The time when this container last exited. */
    FinishedAt: Schema.optional(Schema.string),

    /** Health stores information about the container's healthcheck results. */
    Health: Schema.optional(
        Schema.nullable(
            Schema.struct({
                /**
                 * Status is one of `none`, `starting`, `healthy` or `unhealthy`
                 *
                 * - "none" Indicates there is no healthcheck
                 * - "starting" Starting indicates that the container is not yet
                 *   ready
                 * - "healthy" Healthy indicates that the container is running
                 *   correctly
                 * - "unhealthy" Unhealthy indicates that the container has a
                 *   problem
                 */
                Status: Schema.enums(ContainerState_Health_Status),

                /** FailingStreak is the number of consecutive failures */
                FailingStreak: Schema.optional(Schema.number),

                /** Log contains the last few results (oldest first) */
                Log: Schema.optional(
                    Schema.array(
                        Schema.nullable(
                            Schema.struct({
                                /**
                                 * Date and time at which this check started in
                                 * [RFC
                                 * 3339](https://www.ietf.org/rfc/rfc3339.txt)
                                 * format with nano-seconds.
                                 */
                                Start: Schema.optional(Schema.string),

                                /**
                                 * Date and time at which this check ended in
                                 * [RFC
                                 * 3339](https://www.ietf.org/rfc/rfc3339.txt)
                                 * format with nano-seconds.
                                 */
                                End: Schema.optional(Schema.string),

                                /**
                                 * ExitCode meanings:
                                 *
                                 * - `0` healthy
                                 * - `1` unhealthy
                                 * - `2` reserved (considered unhealthy)
                                 * - Other values: error running probe
                                 */
                                ExitCode: Schema.optional(Schema.number),

                                /** Output from last check */
                                Output: Schema.optional(Schema.string),
                            })
                        )
                    )
                ),
            })
        )
    ),
}) {}

export class ContainerCreateResponse extends Schema.Class<ContainerCreateResponse>()({
    /** The ID of the created container */
    Id: Schema.string,

    /** Warnings encountered when creating the container */
    Warnings: Schema.optional(Schema.array(Schema.string)),
}) {}

export class ContainerWaitResponse extends Schema.Class<ContainerWaitResponse>()({
    /** Exit code of the container */
    StatusCode: Schema.number,

    /** Container waiting error, if any */
    Error: Schema.optional(
        Schema.struct({
            /** Details of an error */
            Message: Schema.optional(Schema.string),
        })
    ),
}) {}

export class ContainerWaitExitError extends Schema.Class<ContainerWaitExitError>()({
    /** Details of an error */
    Message: Schema.optional(Schema.string),
}) {}

export class SystemVersion extends Schema.Class<SystemVersion>()({
    Platform: Schema.optional(Schema.struct({ Name: Schema.string })),

    /** Information about system components */
    Components: Schema.optional(
        Schema.array(
            Schema.struct({
                /** Name of the component */
                Name: Schema.string,

                /** Version of the component */
                Version: Schema.string,

                /**
                 * Key/value pairs of strings with additional information about
                 * the component. These values are intended for informational
                 * purposes only, and their content is not defined, and not part
                 * of the API specification.
                 *
                 * These messages can be printed by the client as information to
                 * the user.
                 */
                Details: Schema.optional(Schema.nullable(Schema.struct({}))),
            })
        )
    ),

    /** The version of the daemon */
    Version: Schema.optional(Schema.string),

    /** The default (and highest) API version that is supported by the daemon */
    ApiVersion: Schema.optional(Schema.string),

    /** The minimum API version that is supported by the daemon */
    MinAPIVersion: Schema.optional(Schema.string),

    /** The Git commit of the source code that was used to build the daemon */
    GitCommit: Schema.optional(Schema.string),

    /**
     * The version Go used to compile the daemon, and the version of the Go
     * runtime in use.
     */
    GoVersion: Schema.optional(Schema.string),

    /** The operating system that the daemon is running on ("linux" or "windows") */
    Os: Schema.optional(Schema.string),

    /** The architecture that the daemon is running on */
    Arch: Schema.optional(Schema.string),

    /**
     * The kernel version (`uname -r`) that the daemon is running on.
     *
     * This field is omitted when empty.
     */
    KernelVersion: Schema.optional(Schema.string),

    /**
     * Indicates if the daemon is started with experimental features enabled.
     *
     * This field is omitted when empty / false.
     */
    Experimental: Schema.optional(Schema.boolean),

    /** The date and time that the daemon was compiled. */
    BuildTime: Schema.optional(Schema.string),
}) {}

export class SystemInfo extends Schema.Class<SystemInfo>()({
    /**
     * Unique identifier of the daemon.<p><br /></p>> **Note**: The format of
     * the ID itself is not part of the API,> And should not be considered
     * stable.
     */
    ID: Schema.optional(Schema.string),

    /** Total number of containers on the host. */
    Containers: Schema.optional(Schema.number),

    /** Number of containers with status `"running"`. */
    ContainersRunning: Schema.optional(Schema.number),

    /** Number of containers with status `"paused"`. */
    ContainersPaused: Schema.optional(Schema.number),

    /** Number of containers with status `"stopped"`. */
    ContainersStopped: Schema.optional(Schema.number),

    /**
     * Total number of images on the host.
     *
     * Both _tagged_ and _untagged_ (dangling) images are counted.
     */
    Images: Schema.optional(Schema.number),

    /** Name of the storage driver in use. */
    Driver: Schema.optional(Schema.string),

    /**
     * Information specific to the storage driver, provided as "label" / "value"
     * pairs.
     *
     * This information is provided by the storage driver, and formatted in a
     * way consistent with the output of `docker info` on the command
     * line.<p><br /></p>> **Note**: The information returned in this field,
     * including> The formatting of values and labels, should not be considered
     * stable, and> May change without notice.
     */
    DriverStatus: Schema.optional(Schema.array(Schema.array(Schema.string))),

    /**
     * Root directory of persistent Docker state.
     *
     * Defaults to `/var/lib/docker` on Linux, and `C:\ProgramData\docker` on
     * Windows.
     */
    DockerRootDir: Schema.optional(Schema.string),

    /**
     * Available plugins per type.<p><br /></p>> **Note**: Only unmanaged (V1)
     * plugins are included in this> List. V1 plugins are "lazily" loaded, and
     * are not returned in this list> If there is no resource using the plugin.
     */
    Plugins: Schema.optional(
        Schema.struct({
            /** Names of available volume-drivers, and network-driver plugins. */
            Volume: Schema.optional(Schema.array(Schema.string)),

            /** Names of available network-drivers, and network-driver plugins. */
            Network: Schema.optional(Schema.array(Schema.string)),

            /** Names of available authorization plugins. */
            Authorization: Schema.optional(Schema.array(Schema.string)),

            /** Names of available logging-drivers, and logging-driver plugins. */
            Log: Schema.optional(Schema.array(Schema.string)),
        })
    ),

    /** Indicates if the host has memory limit support enabled. */
    MemoryLimit: Schema.optional(Schema.boolean),

    /** Indicates if the host has memory swap limit support enabled. */
    SwapLimit: Schema.optional(Schema.boolean),

    /**
     * Indicates if the host has kernel memory TCP limit support enabled. This
     * field is omitted if not supported.
     *
     * Kernel memory TCP limits are not supported when using cgroups v2, which
     * does not support the corresponding `memory.kmem.tcp.limit_in_bytes`
     * cgroup.
     */
    KernelMemoryTCP: Schema.optional(Schema.boolean),

    /**
     * Indicates if CPU CFS(Completely Fair Scheduler) period is supported by
     * the host.
     */
    CpuCfsPeriod: Schema.optional(Schema.boolean),

    /**
     * Indicates if CPU CFS(Completely Fair Scheduler) quota is supported by the
     * host.
     */
    CpuCfsQuota: Schema.optional(Schema.boolean),

    /** Indicates if CPU Shares limiting is supported by the host. */
    CPUShares: Schema.optional(Schema.boolean),

    /**
     * Indicates if CPUsets (cpuset.cpus, cpuset.mems) are supported by the
     * host.
     *
     * See
     * [cpuset(7)](https://www.kernel.org/doc/Documentation/cgroup-v1/cpusets.txt)
     */
    CPUSet: Schema.optional(Schema.boolean),

    /** Indicates if the host kernel has PID limit support enabled. */
    PidsLimit: Schema.optional(Schema.boolean),

    /** Indicates if OOM killer disable is supported on the host. */
    OomKillDisable: Schema.optional(Schema.boolean),

    /** Indicates IPv4 forwarding is enabled. */
    IPv4Forwarding: Schema.optional(Schema.boolean),

    /** Indicates if `bridge-nf-call-iptables` is available on the host. */
    BridgeNfIptables: Schema.optional(Schema.boolean),

    /** Indicates if `bridge-nf-call-ip6tables` is available on the host. */
    BridgeNfIp6tables: Schema.optional(Schema.boolean),

    /**
     * Indicates if the daemon is running in debug-mode / with debug-level
     * logging enabled.
     */
    Debug: Schema.optional(Schema.boolean),

    /**
     * The total number of file Descriptors in use by the daemon process.
     *
     * This information is only returned if debug-mode is enabled.
     */
    NFd: Schema.optional(Schema.number),

    /**
     * The number of goroutines that currently exist.
     *
     * This information is only returned if debug-mode is enabled.
     */
    NGoroutines: Schema.optional(Schema.number),

    /**
     * Current system-time in [RFC 3339](https://www.ietf.org/rfc/rfc3339.txt)
     * format with nano-seconds.
     */
    SystemTime: Schema.optional(Schema.string),

    /** The logging driver to use as a default for new containers. */
    LoggingDriver: Schema.optional(Schema.string),

    /** The driver to use for managing cgroups. */
    CgroupDriver: Schema.optional(Schema.enums(SystemInfo_CgroupDriver)).withDefault(
        () => SystemInfo_CgroupDriver.CGROUPFS
    ),

    /** The version of the cgroup. */
    CgroupVersion: Schema.optional(Schema.enums(SystemInfo_CgroupVersion)).withDefault(
        () => SystemInfo_CgroupVersion.ONE
    ),

    /** Number of event listeners subscribed. */
    NEventsListener: Schema.optional(Schema.number),

    /**
     * Kernel version of the host.
     *
     * On Linux, this information obtained from `uname`. On Windows this
     * information is queried from the
     * <kbd>HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows
     * NT\CurrentVersion</kbd> registry value, for example _"10.0 14393
     * (14393.1198.amd64fre.rs1_release_sec.170427-1353)"_.
     */
    KernelVersion: Schema.optional(Schema.string),

    /**
     * Name of the host's operating system, for example: "Ubuntu 16.04.2 LTS" or
     * "Windows Server 2016 Datacenter"
     */
    OperatingSystem: Schema.optional(Schema.string),

    /**
     * Version of the host's operating system<p><br /></p>> **Note**: The
     * information returned in this field, including> Its very existence, and
     * the formatting of values, should not be> Considered stable, and may
     * change without notice.
     */
    OSVersion: Schema.optional(Schema.string),

    /**
     * Generic type of the operating system of the host, as returned by the Go
     * runtime (`GOOS`).
     *
     * Currently returned values are "linux" and "windows". A full list of
     * possible values can be found in the [Go
     * documentation](https://go.dev/doc/install/source#environment).
     */
    OSType: Schema.optional(Schema.string),

    /**
     * Hardware architecture of the host, as returned by the Go runtime
     * (`GOARCH`).
     *
     * A full list of possible values can be found in the [Go
     * documentation](https://go.dev/doc/install/source#environment).
     */
    Architecture: Schema.optional(Schema.string),

    /**
     * The number of logical CPUs usable by the daemon.
     *
     * The number of available CPUs is checked by querying the operating system
     * when the daemon starts. Changes to operating system CPU allocation after
     * the daemon is started are not reflected.
     */
    NCPU: Schema.optional(Schema.number),

    /** Total amount of physical memory available on the host, in bytes. */
    MemTotal: Schema.optional(Schema.number),

    /**
     * Address / URL of the index server that is used for image search, and as a
     * default for user authentication for Docker Hub and Docker Cloud.
     */
    IndexServerAddress: Schema.optional(Schema.string).withDefault(() => "https://index.docker.io/v1/"),

    /** RegistryServiceConfig stores daemon registry services configuration. */
    RegistryConfig: Schema.optional(
        Schema.nullable(
            Schema.struct({
                /**
                 * List of IP ranges to which nondistributable artifacts can be
                 * pushed, using the CIDR syntax [RFC
                 * 4632](https://tools.ietf.org/html/4632).
                 *
                 * Some images (for example, Windows base images) contain
                 * artifacts whose distribution is restricted by license. When
                 * these images are pushed to a registry, restricted artifacts
                 * are not included.
                 *
                 * This configuration override this behavior, and enables the
                 * daemon to push nondistributable artifacts to all registries
                 * whose resolved IP address is within the subnet described by
                 * the CIDR syntax.
                 *
                 * This option is useful when pushing images containing
                 * nondistributable artifacts to a registry on an air-gapped
                 * network so hosts on that network can pull the images without
                 * connecting to another server.> **Warning**: Nondistributable
                 * artifacts typically have> Restrictions on how and where they
                 * can be distributed and> Shared. Only use this feature to push
                 * artifacts to private> Registries and ensure that you are in
                 * compliance with any> Terms that cover redistributing
                 * nondistributable artifacts.
                 */
                AllowNondistributableArtifactsCIDRs: Schema.optional(Schema.array(Schema.string)),

                /**
                 * List of registry hostnames to which nondistributable
                 * artifacts can be pushed, using the format
                 * `<hostname>[:<port>]` or `<IP address>[:<port>]`.
                 *
                 * Some images (for example, Windows base images) contain
                 * artifacts whose distribution is restricted by license. When
                 * these images are pushed to a registry, restricted artifacts
                 * are not included.
                 *
                 * This configuration override this behavior for the specified
                 * registries.
                 *
                 * This option is useful when pushing images containing
                 * nondistributable artifacts to a registry on an air-gapped
                 * network so hosts on that network can pull the images without
                 * connecting to another server.> **Warning**: Nondistributable
                 * artifacts typically have> Restrictions on how and where they
                 * can be distributed and> Shared. Only use this feature to push
                 * artifacts to private> Registries and ensure that you are in
                 * compliance with any> Terms that cover redistributing
                 * nondistributable artifacts.
                 */
                AllowNondistributableArtifactsHostnames: Schema.optional(Schema.array(Schema.string)),

                /**
                 * List of IP ranges of insecure registries, using the CIDR
                 * syntax ([RFC 4632](https://tools.ietf.org/html/4632)).
                 * Insecure registries accept un-encrypted (HTTP) and/or
                 * untrusted (HTTPS with certificates from unknown CAs)
                 * communication.
                 *
                 * By default, local registries (`127.0.0.0/8`) are configured
                 * as insecure. All other registries are secure. Communicating
                 * with an insecure registry is not possible if the daemon
                 * assumes that registry is secure.
                 *
                 * This configuration override this behavior, insecure
                 * communication with registries whose resolved IP address is
                 * within the subnet described by the CIDR syntax.
                 *
                 * Registries can also be marked insecure by hostname. Those
                 * registries are listed under `IndexConfigs` and have their
                 * `Secure` field set to `false`.> **Warning**: Using this
                 * option can be useful when running a> Local registry, but
                 * introduces security vulnerabilities. This> Option should
                 * therefore ONLY be used for testing purposes.> For increased
                 * security, users should add their CA to their> System's list
                 * of trusted CAs instead of enabling this option.
                 */
                InsecureRegistryCIDRs: Schema.optional(Schema.array(Schema.string)),
                IndexConfigs: Schema.optional(Schema.struct({})),

                /**
                 * List of registry URLs that act as a mirror for the official
                 * (`docker.io`) registry.
                 */
                Mirrors: Schema.optional(Schema.array(Schema.string)),
            })
        )
    ),

    /**
     * User-defined resources can be either Integer resources (e.g, `SSD=3`) or
     * String resources (e.g, `GPU=UUID1`).
     */
    GenericResources: Schema.optional(
        Schema.array(
            Schema.struct({
                NamedResourceSpec: Schema.optional(
                    Schema.struct({ Kind: Schema.optional(Schema.string), Value: Schema.optional(Schema.string) })
                ),
                DiscreteResourceSpec: Schema.optional(
                    Schema.struct({ Kind: Schema.optional(Schema.string), Value: Schema.optional(Schema.number) })
                ),
            })
        )
    ),

    /**
     * HTTP-proxy configured for the daemon. This value is obtained from the
     * [`HTTP_PROXY`](https://www.gnu.org/software/wget/manual/html_node/Proxies.html)
     * environment variable. Credentials ([user info
     * component](https://tools.ietf.org/html/rfc3986#section-3.2.1)) in the
     * proxy URL are masked in the API response.
     *
     * Containers do not automatically inherit this configuration.
     */
    HttpProxy: Schema.optional(Schema.string),

    /**
     * HTTPS-proxy configured for the daemon. This value is obtained from the
     * [`HTTPS_PROXY`](https://www.gnu.org/software/wget/manual/html_node/Proxies.html)
     * environment variable. Credentials ([user info
     * component](https://tools.ietf.org/html/rfc3986#section-3.2.1)) in the
     * proxy URL are masked in the API response.
     *
     * Containers do not automatically inherit this configuration.
     */
    HttpsProxy: Schema.optional(Schema.string),

    /**
     * Comma-separated list of domain extensions for which no proxy should be
     * used. This value is obtained from the
     * [`NO_PROXY`](https://www.gnu.org/software/wget/manual/html_node/Proxies.html)
     * environment variable.
     *
     * Containers do not automatically inherit this configuration.
     */
    NoProxy: Schema.optional(Schema.string),

    /** Hostname of the host. */
    Name: Schema.optional(Schema.string),

    /**
     * User-defined labels (key/value metadata) as set on the daemon.<p><br
     * /></p>> **Note**: When part of a Swarm, nodes can both have _daemon_>
     * Labels, set through the daemon configuration, and _node_ labels, set
     * from> A manager node in the Swarm. Node labels are not included in this
     * field.> Node labels can be retrieved using the `/nodes/(id)` endpoint on
     * a> Manager node in the Swarm.
     */
    Labels: Schema.optional(Schema.array(Schema.string)),

    /** Indicates if experimental features are enabled on the daemon. */
    ExperimentalBuild: Schema.optional(Schema.boolean),

    /** Version string of the daemon. */
    ServerVersion: Schema.optional(Schema.string),

    /**
     * List of [OCI compliant](https://github.com/opencontainers/runtime-spec)
     * runtimes configured on the daemon. Keys hold the "name" used to reference
     * the runtime.
     *
     * The Docker daemon relies on an OCI compliant runtime (invoked via the
     * `containerd` daemon) as its interface to the Linux kernel namespaces,
     * cgroups, and SELinux.
     *
     * The default runtime is `runc`, and automatically configured. Additional
     * runtimes can be configured by the user and will be listed here.
     */
    Runtimes: Schema.optional(Schema.struct({})).withDefault(() => ({ runc: { path: "runc" } })),

    /**
     * Name of the default OCI runtime that is used when starting containers.
     *
     * The default can be overridden per-container at create time.
     */
    DefaultRuntime: Schema.optional(Schema.string).withDefault(() => "runc"),

    /** Represents generic information about swarm. */
    Swarm: Schema.optional(
        Schema.struct({
            /** Unique identifier of for this node in the swarm. */
            NodeID: Schema.optional(Schema.string),

            /**
             * IP address at which this node can be reached by other nodes in
             * the swarm.
             */
            NodeAddr: Schema.optional(Schema.string),

            /** Current local status of this node. */
            LocalNodeState: Schema.enums(SystemInfo_Swarm_LocalNodeState),
            ControlAvailable: Schema.optional(Schema.boolean),
            Error: Schema.optional(Schema.string),

            /** List of ID's and addresses of other managers in the swarm. */
            RemoteManagers: Schema.optional(
                Schema.nullable(
                    Schema.array(
                        Schema.struct({
                            /** Unique identifier of for this node in the swarm. */
                            NodeID: Schema.optional(Schema.string),

                            /**
                             * IP address and ports at which this node can be
                             * reached.
                             */
                            Addr: Schema.optional(Schema.string),
                        })
                    )
                )
            ),

            /** Total number of nodes in the swarm. */
            Nodes: Schema.optional(Schema.nullable(Schema.number)),

            /** Total number of managers in the swarm. */
            Managers: Schema.optional(Schema.nullable(Schema.number)),

            /**
             * ClusterInfo represents information about the swarm as is returned
             * by the "/info" endpoint. Join-tokens are not included.
             */
            Cluster: Schema.optional(
                Schema.nullable(
                    Schema.struct({
                        /** The ID of the swarm. */
                        ID: Schema.optional(Schema.string),

                        /**
                         * The version number of the object such as node,
                         * service, etc. This is needed to avoid conflicting
                         * writes. The client must send the version number along
                         * with the modified specification when updating these
                         * objects.
                         *
                         * This approach ensures safe concurrency and
                         * determinism in that the change on the object may not
                         * be applied if the version number has changed from the
                         * last read. In other words, if two update requests
                         * specify the same base version, only one of the
                         * requests can succeed. As a result, two separate
                         * update requests that happen at the same time will not
                         * unintentionally overwrite each other.
                         */
                        Version: Schema.optional(Schema.struct({ Index: Schema.optional(Schema.number) })),

                        /**
                         * Date and time at which the swarm was initialised in
                         * [RFC 3339](https://www.ietf.org/rfc/rfc3339.txt)
                         * format with nano-seconds.
                         */
                        CreatedAt: Schema.optional(Schema.string),

                        /**
                         * Date and time at which the swarm was last updated in
                         * [RFC 3339](https://www.ietf.org/rfc/rfc3339.txt)
                         * format with nano-seconds.
                         */
                        UpdatedAt: Schema.optional(Schema.string),

                        /** User modifiable swarm configuration. */
                        Spec: Schema.optional(
                            Schema.struct({
                                /** Name of the swarm. */
                                Name: Schema.optional(Schema.string),

                                /** User-defined key/value metadata. */
                                Labels: Schema.optional(Schema.struct({})),

                                /** Orchestration configuration. */
                                Orchestration: Schema.optional(
                                    Schema.nullable(
                                        Schema.struct({
                                            /**
                                             * The number of historic tasks to
                                             * keep per instance or node. If
                                             * negative, never remove completed
                                             * or failed tasks.
                                             */
                                            TaskHistoryRetentionLimit: Schema.optional(Schema.number),
                                        })
                                    )
                                ),

                                /** Raft configuration. */
                                Raft: Schema.optional(
                                    Schema.struct({
                                        /**
                                         * The number of log entries between
                                         * snapshots.
                                         */
                                        SnapshotInterval: Schema.optional(Schema.number),

                                        /**
                                         * The number of snapshots to keep
                                         * beyond the current snapshot.
                                         */
                                        KeepOldSnapshots: Schema.optional(Schema.number),

                                        /**
                                         * The number of log entries to keep
                                         * around to sync up slow followers
                                         * after a snapshot is created.
                                         */
                                        LogEntriesForSlowFollowers: Schema.optional(Schema.number),

                                        /**
                                         * The number of ticks that a follower
                                         * will wait for a message from the
                                         * leader before becoming a candidate
                                         * and starting an election.
                                         * `ElectionTick` must be greater than
                                         * `HeartbeatTick`.
                                         *
                                         * A tick currently defaults to one
                                         * second, so these translate directly
                                         * to seconds currently, but this is NOT
                                         * guaranteed.
                                         */
                                        ElectionTick: Schema.optional(Schema.number),

                                        /**
                                         * The number of ticks between
                                         * heartbeats. Every HeartbeatTick
                                         * ticks, the leader will send a
                                         * heartbeat to the followers.
                                         *
                                         * A tick currently defaults to one
                                         * second, so these translate directly
                                         * to seconds currently, but this is NOT
                                         * guaranteed.
                                         */
                                        HeartbeatTick: Schema.optional(Schema.number),
                                    })
                                ),

                                /** Dispatcher configuration. */
                                Dispatcher: Schema.optional(
                                    Schema.nullable(
                                        Schema.struct({
                                            /**
                                             * The delay for an agent to send a
                                             * heartbeat to the dispatcher.
                                             */
                                            HeartbeatPeriod: Schema.optional(Schema.number),
                                        })
                                    )
                                ),

                                /** CA configuration. */
                                CAConfig: Schema.optional(
                                    Schema.nullable(
                                        Schema.struct({
                                            /**
                                             * The duration node certificates
                                             * are issued for.
                                             */
                                            NodeCertExpiry: Schema.optional(Schema.number),

                                            /**
                                             * Configuration for forwarding
                                             * signing requests to an external
                                             * certificate authority.
                                             */
                                            ExternalCAs: Schema.optional(
                                                Schema.array(
                                                    Schema.struct({
                                                        /**
                                                         * Protocol for
                                                         * communication with
                                                         * the external CA
                                                         * (currently only
                                                         * `cfssl` is
                                                         * supported).
                                                         */
                                                        Protocol: Schema.optional(
                                                            Schema.enums(
                                                                SystemInfo_Swarm_Cluster_Spec_CAConfig_ExternalCAs_ExternalCAs_Protocol
                                                            )
                                                        ).withDefault(
                                                            () =>
                                                                SystemInfo_Swarm_Cluster_Spec_CAConfig_ExternalCAs_ExternalCAs_Protocol.CFSSL
                                                        ),

                                                        /**
                                                         * URL where certificate
                                                         * signing requests
                                                         * should be sent.
                                                         */
                                                        URL: Schema.optional(Schema.string),

                                                        /**
                                                         * An object with
                                                         * key/value pairs that
                                                         * are interpreted as
                                                         * protocol-specific
                                                         * options for the
                                                         * external CA driver.
                                                         */
                                                        Options: Schema.optional(Schema.struct({})),

                                                        /**
                                                         * The root CA
                                                         * certificate (in PEM
                                                         * format) this external
                                                         * CA uses to issue TLS
                                                         * certificates (assumed
                                                         * to be to the current
                                                         * swarm root CA
                                                         * certificate if not
                                                         * provided).
                                                         */
                                                        CACert: Schema.optional(Schema.string),
                                                    })
                                                )
                                            ),

                                            /**
                                             * The desired signing CA
                                             * certificate for all swarm node
                                             * TLS leaf certificates, in PEM
                                             * format.
                                             */
                                            SigningCACert: Schema.optional(Schema.string),

                                            /**
                                             * The desired signing CA key for
                                             * all swarm node TLS leaf
                                             * certificates, in PEM format.
                                             */
                                            SigningCAKey: Schema.optional(Schema.string),

                                            /**
                                             * An integer whose purpose is to
                                             * force swarm to generate a new
                                             * signing CA certificate and key,
                                             * if none have been specified in
                                             * `SigningCACert` and
                                             * `SigningCAKey`
                                             */
                                            ForceRotate: Schema.optional(Schema.number),
                                        })
                                    )
                                ),

                                /** Parameters related to encryption-at-rest. */
                                EncryptionConfig: Schema.optional(
                                    Schema.struct({
                                        /**
                                         * If set, generate a key and use it to
                                         * lock data stored on the managers.
                                         */
                                        AutoLockManagers: Schema.optional(Schema.boolean),
                                    })
                                ),

                                /** Defaults for creating tasks in this cluster. */
                                TaskDefaults: Schema.optional(
                                    Schema.struct({
                                        /**
                                         * The log driver to use for tasks
                                         * created in the orchestrator if
                                         * unspecified by a service.
                                         *
                                         * Updating this value only affects new
                                         * tasks. Existing tasks continue to use
                                         * their previously configured log
                                         * driver until recreated.
                                         */
                                        LogDriver: Schema.optional(
                                            Schema.struct({
                                                /**
                                                 * The log driver to use as a
                                                 * default for new tasks.
                                                 */
                                                Name: Schema.optional(Schema.string),

                                                /**
                                                 * Driver-specific options for
                                                 * the selectd log driver,
                                                 * specified as key/value
                                                 * pairs.
                                                 */
                                                Options: Schema.optional(Schema.struct({})),
                                            })
                                        ),
                                    })
                                ),
                            })
                        ),

                        /**
                         * Information about the issuer of leaf TLS certificates
                         * and the trusted root CA certificate.
                         */
                        TLSInfo: Schema.optional(
                            Schema.struct({
                                /**
                                 * The root CA certificate(s) that are used to
                                 * validate leaf TLS certificates.
                                 */
                                TrustRoot: Schema.optional(Schema.string),

                                /**
                                 * The base64-url-safe-encoded raw subject bytes
                                 * of the issuer.
                                 */
                                CertIssuerSubject: Schema.optional(Schema.string),

                                /**
                                 * The base64-url-safe-encoded raw public key
                                 * bytes of the issuer.
                                 */
                                CertIssuerPublicKey: Schema.optional(Schema.string),
                            })
                        ),

                        /**
                         * Whether there is currently a root CA rotation in
                         * progress for the swarm
                         */
                        RootRotationInProgress: Schema.optional(Schema.boolean),

                        /**
                         * DataPathPort specifies the data path port number for
                         * data traffic. Acceptable port range is 1024 to 49151.
                         * If no port is set or is set to 0, the default port
                         * (4789) is used.
                         */
                        DataPathPort: Schema.optional(Schema.number).withDefault(() => 4789),

                        /**
                         * Default Address Pool specifies default subnet pools
                         * for global scope networks.
                         */
                        DefaultAddrPool: Schema.optional(Schema.array(Schema.string)),

                        /**
                         * SubnetSize specifies the subnet size of the networks
                         * created from the default subnet pool.
                         */
                        SubnetSize: Schema.optional(Schema.number).withDefault(() => 24),
                    })
                )
            ),
        })
    ),

    /**
     * Indicates if live restore is enabled.
     *
     * If enabled, containers are kept running when the daemon is shutdown or
     * upon daemon start if running containers are detected.
     */
    LiveRestoreEnabled: Schema.optional(Schema.boolean),

    /**
     * Represents the isolation technology to use as a default for containers.
     * The supported values are platform-specific.
     *
     * If no isolation value is specified on daemon start, on Windows client,
     * the default is `hyperv`, and on Windows server, the default is
     * `process`.
     *
     * This option is currently not used on other platforms.
     */
    Isolation: Schema.optional(Schema.enums(SystemInfo_Isolation)).withDefault(() => SystemInfo_Isolation.DEFAULT),

    /**
     * Name and, optional, path of the `docker-init` binary.
     *
     * If the path is omitted, the daemon searches the host's `$PATH` for the
     * binary and uses the first result.
     */
    InitBinary: Schema.optional(Schema.string),

    /**
     * Commit holds the Git-commit (SHA1) that a binary was built from, as
     * reported in the version-string of external tools, such as `containerd`,
     * or `runC`.
     */
    ContainerdCommit: Schema.optional(
        Schema.struct({
            /** Actual commit ID of external tool. */
            ID: Schema.optional(Schema.string),

            /**
             * Commit ID of external tool expected by dockerd as set at build
             * time.
             */
            Expected: Schema.optional(Schema.string),
        })
    ),

    /**
     * Commit holds the Git-commit (SHA1) that a binary was built from, as
     * reported in the version-string of external tools, such as `containerd`,
     * or `runC`.
     */
    RuncCommit: Schema.optional(
        Schema.struct({
            /** Actual commit ID of external tool. */
            ID: Schema.optional(Schema.string),

            /**
             * Commit ID of external tool expected by dockerd as set at build
             * time.
             */
            Expected: Schema.optional(Schema.string),
        })
    ),

    /**
     * Commit holds the Git-commit (SHA1) that a binary was built from, as
     * reported in the version-string of external tools, such as `containerd`,
     * or `runC`.
     */
    InitCommit: Schema.optional(
        Schema.struct({
            /** Actual commit ID of external tool. */
            ID: Schema.optional(Schema.string),

            /**
             * Commit ID of external tool expected by dockerd as set at build
             * time.
             */
            Expected: Schema.optional(Schema.string),
        })
    ),

    /**
     * List of security features that are enabled on the daemon, such as
     * apparmor, seccomp, SELinux, user-namespaces (userns), rootless and
     * no-new-privileges.
     *
     * Additional configuration options for each security feature may be
     * present, and are included as a comma-separated list of key/value pairs.
     */
    SecurityOptions: Schema.optional(Schema.array(Schema.string)),

    /**
     * Reports a summary of the product license on the daemon.
     *
     * If a commercial license has been applied to the daemon, information such
     * as number of nodes, and expiration are included.
     */
    ProductLicense: Schema.optional(Schema.string),

    /**
     * List of custom default address pools for local networks, which can be
     * specified in the daemon.json file or dockerd option.
     *
     * Example: a Base "10.10.0.0/16" with Size 24 will define the set of 256
     * 10.10.[0-255].0/24 address pools.
     */
    DefaultAddressPools: Schema.optional(
        Schema.array(
            Schema.struct({
                /** The network address in CIDR format */
                Base: Schema.optional(Schema.string),

                /** The network pool size */
                Size: Schema.optional(Schema.number),
            })
        )
    ),

    /**
     * List of warnings / informational messages about missing features, or
     * issues related to the daemon configuration.
     *
     * These messages can be printed by the client as information to the user.
     */
    Warnings: Schema.optional(Schema.array(Schema.string)),

    /**
     * List of directories where (Container Device Interface) CDI specifications
     * are located.
     *
     * These specifications define vendor-specific modifications to an OCI
     * runtime specification for a container being created.
     *
     * An empty list indicates that CDI device injection is disabled.
     *
     * Note that since using CDI device injection requires the daemon to have
     * experimental enabled. For non-experimental daemons an empty list will
     * always be returned.
     */
    CDISpecDirs: Schema.optional(Schema.array(Schema.string)),
}) {}

export class PluginsInfo extends Schema.Class<PluginsInfo>()({
    /** Names of available volume-drivers, and network-driver plugins. */
    Volume: Schema.optional(Schema.array(Schema.string)),

    /** Names of available network-drivers, and network-driver plugins. */
    Network: Schema.optional(Schema.array(Schema.string)),

    /** Names of available authorization plugins. */
    Authorization: Schema.optional(Schema.array(Schema.string)),

    /** Names of available logging-drivers, and logging-driver plugins. */
    Log: Schema.optional(Schema.array(Schema.string)),
}) {}

export class RegistryServiceConfig extends Schema.Class<RegistryServiceConfig>()({
    /**
     * List of IP ranges to which nondistributable artifacts can be pushed,
     * using the CIDR syntax [RFC 4632](https://tools.ietf.org/html/4632).
     *
     * Some images (for example, Windows base images) contain artifacts whose
     * distribution is restricted by license. When these images are pushed to a
     * registry, restricted artifacts are not included.
     *
     * This configuration override this behavior, and enables the daemon to push
     * nondistributable artifacts to all registries whose resolved IP address is
     * within the subnet described by the CIDR syntax.
     *
     * This option is useful when pushing images containing nondistributable
     * artifacts to a registry on an air-gapped network so hosts on that network
     * can pull the images without connecting to another server.> **Warning**:
     * Nondistributable artifacts typically have> Restrictions on how and where
     * they can be distributed and shared. Only> Use this feature to push
     * artifacts to private registries and ensure that> You are in compliance
     * with any terms that cover redistributing> Nondistributable artifacts.
     */
    AllowNondistributableArtifactsCIDRs: Schema.optional(Schema.array(Schema.string)),

    /**
     * List of registry hostnames to which nondistributable artifacts can be
     * pushed, using the format `<hostname>[:<port>]` or `<IP
     * address>[:<port>]`.
     *
     * Some images (for example, Windows base images) contain artifacts whose
     * distribution is restricted by license. When these images are pushed to a
     * registry, restricted artifacts are not included.
     *
     * This configuration override this behavior for the specified registries.
     *
     * This option is useful when pushing images containing nondistributable
     * artifacts to a registry on an air-gapped network so hosts on that network
     * can pull the images without connecting to another server.> **Warning**:
     * Nondistributable artifacts typically have> Restrictions on how and where
     * they can be distributed and shared. Only> Use this feature to push
     * artifacts to private registries and ensure that> You are in compliance
     * with any terms that cover redistributing> Nondistributable artifacts.
     */
    AllowNondistributableArtifactsHostnames: Schema.optional(Schema.array(Schema.string)),

    /**
     * List of IP ranges of insecure registries, using the CIDR syntax ([RFC
     * 4632](https://tools.ietf.org/html/4632)). Insecure registries accept
     * un-encrypted (HTTP) and/or untrusted (HTTPS with certificates from
     * unknown CAs) communication.
     *
     * By default, local registries (`127.0.0.0/8`) are configured as insecure.
     * All other registries are secure. Communicating with an insecure registry
     * is not possible if the daemon assumes that registry is secure.
     *
     * This configuration override this behavior, insecure communication with
     * registries whose resolved IP address is within the subnet described by
     * the CIDR syntax.
     *
     * Registries can also be marked insecure by hostname. Those registries are
     * listed under `IndexConfigs` and have their `Secure` field set to
     * `false`.> **Warning**: Using this option can be useful when running a>
     * Local registry, but introduces security vulnerabilities. This option>
     * Should therefore ONLY be used for testing purposes. For increased>
     * Security, users should add their CA to their system's list of trusted
     * CAs> Instead of enabling this option.
     */
    InsecureRegistryCIDRs: Schema.optional(Schema.array(Schema.string)),
    IndexConfigs: Schema.optional(Schema.struct({})),

    /**
     * List of registry URLs that act as a mirror for the official (`docker.io`)
     * registry.
     */
    Mirrors: Schema.optional(Schema.array(Schema.string)),
}) {}

export class IndexInfo extends Schema.Class<IndexInfo>()({
    /** Name of the registry, such as "docker.io". */
    Name: Schema.optional(Schema.string),

    /** List of mirrors, expressed as URIs. */
    Mirrors: Schema.optional(Schema.array(Schema.string)),

    /**
     * Indicates if the registry is part of the list of insecure registries.
     *
     * If `false`, the registry is insecure. Insecure registries accept
     * un-encrypted (HTTP) and/or untrusted (HTTPS with certificates from
     * unknown CAs) communication.> **Warning**: Insecure registries can be
     * useful when running a> Local registry. However, because its use creates
     * security vulnerabilities> It should ONLY be enabled for testing purposes.
     * For increased security,> Users should add their CA to their system's list
     * of trusted CAs instead> Of enabling this option.
     */
    Secure: Schema.optional(Schema.boolean),

    /**
     * Indicates whether this is an official registry (i.e., Docker Hub /
     * docker.io)
     */
    Official: Schema.optional(Schema.boolean),
}) {}

export class Runtime extends Schema.Class<Runtime>()({
    /**
     * Name and, optional, path, of the OCI executable binary.
     *
     * If the path is omitted, the daemon searches the host's `$PATH` for the
     * binary and uses the first result.
     */
    path: Schema.optional(Schema.string),

    /** List of command-line arguments to pass to the runtime when invoked. */
    runtimeArgs: Schema.optional(Schema.nullable(Schema.array(Schema.string))),

    /**
     * Information specific to the runtime.
     *
     * While this API specification does not define data provided by runtimes,
     * the following well-known properties may be provided by runtimes:
     *
     * `org.opencontainers.runtime-spec.features`: features structure as defined
     * in the [OCI Runtime
     * Specification](https://github.com/opencontainers/runtime-spec/blob/main/features.md),
     * in a JSON string representation.<p><br /></p>> **Note**: The information
     * returned in this field, including> The formatting of values and labels,
     * should not be considered stable, and> May change without notice.
     */
    status: Schema.optional(Schema.nullable(Schema.struct({}))),
}) {}

export class Commit extends Schema.Class<Commit>()({
    /** Actual commit ID of external tool. */
    ID: Schema.optional(Schema.string),

    /** Commit ID of external tool expected by dockerd as set at build time. */
    Expected: Schema.optional(Schema.string),
}) {}

export class SwarmInfo extends Schema.Class<SwarmInfo>()({
    /** Unique identifier of for this node in the swarm. */
    NodeID: Schema.optional(Schema.string),

    /** IP address at which this node can be reached by other nodes in the swarm. */
    NodeAddr: Schema.optional(Schema.string),

    /** Current local status of this node. */
    LocalNodeState: Schema.enums(SwarmInfo_LocalNodeState),
    ControlAvailable: Schema.optional(Schema.boolean),
    Error: Schema.optional(Schema.string),

    /** List of ID's and addresses of other managers in the swarm. */
    RemoteManagers: Schema.optional(
        Schema.nullable(
            Schema.array(
                Schema.struct({
                    /** Unique identifier of for this node in the swarm. */
                    NodeID: Schema.optional(Schema.string),

                    /** IP address and ports at which this node can be reached. */
                    Addr: Schema.optional(Schema.string),
                })
            )
        )
    ),

    /** Total number of nodes in the swarm. */
    Nodes: Schema.optional(Schema.nullable(Schema.number)),

    /** Total number of managers in the swarm. */
    Managers: Schema.optional(Schema.nullable(Schema.number)),

    /**
     * ClusterInfo represents information about the swarm as is returned by the
     * "/info" endpoint. Join-tokens are not included.
     */
    Cluster: Schema.optional(
        Schema.nullable(
            Schema.struct({
                /** The ID of the swarm. */
                ID: Schema.optional(Schema.string),

                /**
                 * The version number of the object such as node, service, etc.
                 * This is needed to avoid conflicting writes. The client must
                 * send the version number along with the modified specification
                 * when updating these objects.
                 *
                 * This approach ensures safe concurrency and determinism in
                 * that the change on the object may not be applied if the
                 * version number has changed from the last read. In other
                 * words, if two update requests specify the same base version,
                 * only one of the requests can succeed. As a result, two
                 * separate update requests that happen at the same time will
                 * not unintentionally overwrite each other.
                 */
                Version: Schema.optional(Schema.struct({ Index: Schema.optional(Schema.number) })),

                /**
                 * Date and time at which the swarm was initialised in [RFC
                 * 3339](https://www.ietf.org/rfc/rfc3339.txt) format with
                 * nano-seconds.
                 */
                CreatedAt: Schema.optional(Schema.string),

                /**
                 * Date and time at which the swarm was last updated in [RFC
                 * 3339](https://www.ietf.org/rfc/rfc3339.txt) format with
                 * nano-seconds.
                 */
                UpdatedAt: Schema.optional(Schema.string),

                /** User modifiable swarm configuration. */
                Spec: Schema.optional(
                    Schema.struct({
                        /** Name of the swarm. */
                        Name: Schema.optional(Schema.string),

                        /** User-defined key/value metadata. */
                        Labels: Schema.optional(Schema.struct({})),

                        /** Orchestration configuration. */
                        Orchestration: Schema.optional(
                            Schema.nullable(
                                Schema.struct({
                                    /**
                                     * The number of historic tasks to keep per
                                     * instance or node. If negative, never
                                     * remove completed or failed tasks.
                                     */
                                    TaskHistoryRetentionLimit: Schema.optional(Schema.number),
                                })
                            )
                        ),

                        /** Raft configuration. */
                        Raft: Schema.optional(
                            Schema.struct({
                                /** The number of log entries between snapshots. */
                                SnapshotInterval: Schema.optional(Schema.number),

                                /**
                                 * The number of snapshots to keep beyond the
                                 * current snapshot.
                                 */
                                KeepOldSnapshots: Schema.optional(Schema.number),

                                /**
                                 * The number of log entries to keep around to
                                 * sync up slow followers after a snapshot is
                                 * created.
                                 */
                                LogEntriesForSlowFollowers: Schema.optional(Schema.number),

                                /**
                                 * The number of ticks that a follower will wait
                                 * for a message from the leader before becoming
                                 * a candidate and starting an election.
                                 * `ElectionTick` must be greater than
                                 * `HeartbeatTick`.
                                 *
                                 * A tick currently defaults to one second, so
                                 * these translate directly to seconds
                                 * currently, but this is NOT guaranteed.
                                 */
                                ElectionTick: Schema.optional(Schema.number),

                                /**
                                 * The number of ticks between heartbeats. Every
                                 * HeartbeatTick ticks, the leader will send a
                                 * heartbeat to the followers.
                                 *
                                 * A tick currently defaults to one second, so
                                 * these translate directly to seconds
                                 * currently, but this is NOT guaranteed.
                                 */
                                HeartbeatTick: Schema.optional(Schema.number),
                            })
                        ),

                        /** Dispatcher configuration. */
                        Dispatcher: Schema.optional(
                            Schema.nullable(
                                Schema.struct({
                                    /**
                                     * The delay for an agent to send a
                                     * heartbeat to the dispatcher.
                                     */
                                    HeartbeatPeriod: Schema.optional(Schema.number),
                                })
                            )
                        ),

                        /** CA configuration. */
                        CAConfig: Schema.optional(
                            Schema.nullable(
                                Schema.struct({
                                    /**
                                     * The duration node certificates are issued
                                     * for.
                                     */
                                    NodeCertExpiry: Schema.optional(Schema.number),

                                    /**
                                     * Configuration for forwarding signing
                                     * requests to an external certificate
                                     * authority.
                                     */
                                    ExternalCAs: Schema.optional(
                                        Schema.array(
                                            Schema.struct({
                                                /**
                                                 * Protocol for communication
                                                 * with the external CA
                                                 * (currently only `cfssl` is
                                                 * supported).
                                                 */
                                                Protocol: Schema.optional(
                                                    Schema.enums(
                                                        SwarmInfo_Cluster_Spec_CAConfig_ExternalCAs_ExternalCAs_Protocol
                                                    )
                                                ).withDefault(
                                                    () =>
                                                        SwarmInfo_Cluster_Spec_CAConfig_ExternalCAs_ExternalCAs_Protocol.CFSSL
                                                ),

                                                /**
                                                 * URL where certificate signing
                                                 * requests should be sent.
                                                 */
                                                URL: Schema.optional(Schema.string),

                                                /**
                                                 * An object with key/value
                                                 * pairs that are interpreted as
                                                 * protocol-specific options for
                                                 * the external CA driver.
                                                 */
                                                Options: Schema.optional(Schema.struct({})),

                                                /**
                                                 * The root CA certificate (in
                                                 * PEM format) this external CA
                                                 * uses to issue TLS
                                                 * certificates (assumed to be
                                                 * to the current swarm root CA
                                                 * certificate if not
                                                 * provided).
                                                 */
                                                CACert: Schema.optional(Schema.string),
                                            })
                                        )
                                    ),

                                    /**
                                     * The desired signing CA certificate for
                                     * all swarm node TLS leaf certificates, in
                                     * PEM format.
                                     */
                                    SigningCACert: Schema.optional(Schema.string),

                                    /**
                                     * The desired signing CA key for all swarm
                                     * node TLS leaf certificates, in PEM
                                     * format.
                                     */
                                    SigningCAKey: Schema.optional(Schema.string),

                                    /**
                                     * An integer whose purpose is to force
                                     * swarm to generate a new signing CA
                                     * certificate and key, if none have been
                                     * specified in `SigningCACert` and
                                     * `SigningCAKey`
                                     */
                                    ForceRotate: Schema.optional(Schema.number),
                                })
                            )
                        ),

                        /** Parameters related to encryption-at-rest. */
                        EncryptionConfig: Schema.optional(
                            Schema.struct({
                                /**
                                 * If set, generate a key and use it to lock
                                 * data stored on the managers.
                                 */
                                AutoLockManagers: Schema.optional(Schema.boolean),
                            })
                        ),

                        /** Defaults for creating tasks in this cluster. */
                        TaskDefaults: Schema.optional(
                            Schema.struct({
                                /**
                                 * The log driver to use for tasks created in
                                 * the orchestrator if unspecified by a
                                 * service.
                                 *
                                 * Updating this value only affects new tasks.
                                 * Existing tasks continue to use their
                                 * previously configured log driver until
                                 * recreated.
                                 */
                                LogDriver: Schema.optional(
                                    Schema.struct({
                                        /**
                                         * The log driver to use as a default
                                         * for new tasks.
                                         */
                                        Name: Schema.optional(Schema.string),

                                        /**
                                         * Driver-specific options for the
                                         * selectd log driver, specified as
                                         * key/value pairs.
                                         */
                                        Options: Schema.optional(Schema.struct({})),
                                    })
                                ),
                            })
                        ),
                    })
                ),

                /**
                 * Information about the issuer of leaf TLS certificates and the
                 * trusted root CA certificate.
                 */
                TLSInfo: Schema.optional(
                    Schema.struct({
                        /**
                         * The root CA certificate(s) that are used to validate
                         * leaf TLS certificates.
                         */
                        TrustRoot: Schema.optional(Schema.string),

                        /**
                         * The base64-url-safe-encoded raw subject bytes of the
                         * issuer.
                         */
                        CertIssuerSubject: Schema.optional(Schema.string),

                        /**
                         * The base64-url-safe-encoded raw public key bytes of
                         * the issuer.
                         */
                        CertIssuerPublicKey: Schema.optional(Schema.string),
                    })
                ),

                /**
                 * Whether there is currently a root CA rotation in progress for
                 * the swarm
                 */
                RootRotationInProgress: Schema.optional(Schema.boolean),

                /**
                 * DataPathPort specifies the data path port number for data
                 * traffic. Acceptable port range is 1024 to 49151. If no port
                 * is set or is set to 0, the default port (4789) is used.
                 */
                DataPathPort: Schema.optional(Schema.number).withDefault(() => 4789),

                /**
                 * Default Address Pool specifies default subnet pools for
                 * global scope networks.
                 */
                DefaultAddrPool: Schema.optional(Schema.array(Schema.string)),

                /**
                 * SubnetSize specifies the subnet size of the networks created
                 * from the default subnet pool.
                 */
                SubnetSize: Schema.optional(Schema.number).withDefault(() => 24),
            })
        )
    ),
}) {}

export class PeerNode extends Schema.Class<PeerNode>()({
    /** Unique identifier of for this node in the swarm. */
    NodeID: Schema.optional(Schema.string),

    /** IP address and ports at which this node can be reached. */
    Addr: Schema.optional(Schema.string),
}) {}

export class NetworkAttachmentConfig extends Schema.Class<NetworkAttachmentConfig>()({
    /** The target network for attachment. Must be a network name or ID. */
    Target: Schema.optional(Schema.string),

    /** Discoverable alternate names for the service on this network. */
    Aliases: Schema.optional(Schema.array(Schema.string)),

    /** Driver attachment options for the network target. */
    DriverOpts: Schema.optional(Schema.struct({})),
}) {}

export class EventActor extends Schema.Class<EventActor>()({
    /** The ID of the object emitting the event */
    ID: Schema.optional(Schema.string),

    /** Various key/value attributes of the object, depending on its type. */
    Attributes: Schema.optional(Schema.struct({})),
}) {}

export class EventMessage extends Schema.Class<EventMessage>()({
    /** The type of object emitting the event */
    Type: Schema.enums(EventMessage_Type),

    /** The type of event */
    Action: Schema.optional(Schema.string),

    /**
     * Actor describes something that generates events, like a container,
     * network, or a volume.
     */
    Actor: Schema.optional(
        Schema.struct({
            /** The ID of the object emitting the event */
            ID: Schema.optional(Schema.string),

            /**
             * Various key/value attributes of the object, depending on its
             * type.
             */
            Attributes: Schema.optional(Schema.struct({})),
        })
    ),

    /**
     * Scope of the event. Engine events are `local` scope. Cluster (Swarm)
     * events are `swarm` scope.
     */
    scope: Schema.enums(EventMessage_scope),

    /** Timestamp of event */
    time: Schema.optional(Schema.number),

    /** Timestamp of event, with nanosecond accuracy */
    timeNano: Schema.optional(Schema.number),
}) {}

export class OCIDescriptor extends Schema.Class<OCIDescriptor>()({
    /** The media type of the object this schema refers to. */
    mediaType: Schema.optional(Schema.string),

    /** The digest of the targeted content. */
    digest: Schema.optional(Schema.string),

    /** The size in bytes of the blob. */
    size: Schema.optional(Schema.number),
}) {}

export class OCIPlatform extends Schema.Class<OCIPlatform>()({
    /** The CPU architecture, for example `amd64` or `ppc64`. */
    architecture: Schema.optional(Schema.string),

    /** The operating system, for example `linux` or `windows`. */
    os: Schema.optional(Schema.string),

    /**
     * Optional field specifying the operating system version, for example on
     * Windows `10.0.19041.1165`.
     */
    "os.version": Schema.optional(Schema.string),

    /**
     * Optional field specifying an array of strings, each listing a required OS
     * feature (for example on Windows `win32k`).
     */
    "os.features": Schema.optional(Schema.array(Schema.string)),

    /**
     * Optional field specifying a variant of the CPU, for example `v7` to
     * specify ARMv7 when architecture is `arm`.
     */
    variant: Schema.optional(Schema.string),
}) {}

export class DistributionInspect extends Schema.Class<DistributionInspect>()({
    /**
     * A descriptor struct containing digest, media type, and size, as defined
     * in the [OCI Content Descriptors
     * Specification](https://github.com/opencontainers/image-spec/blob/v1.0.1/descriptor.md).
     */
    Descriptor: Schema.struct({
        /** The media type of the object this schema refers to. */
        mediaType: Schema.optional(Schema.string),

        /** The digest of the targeted content. */
        digest: Schema.optional(Schema.string),

        /** The size in bytes of the blob. */
        size: Schema.optional(Schema.number),
    }),

    /** An array containing all platforms supported by the image. */
    Platforms: Schema.optional(
        Schema.array(
            Schema.struct({
                /** The CPU architecture, for example `amd64` or `ppc64`. */
                architecture: Schema.optional(Schema.string),

                /** The operating system, for example `linux` or `windows`. */
                os: Schema.optional(Schema.string),

                /**
                 * Optional field specifying the operating system version, for
                 * example on Windows `10.0.19041.1165`.
                 */
                "os.version": Schema.optional(Schema.string),

                /**
                 * Optional field specifying an array of strings, each listing a
                 * required OS feature (for example on Windows `win32k`).
                 */
                "os.features": Schema.optional(Schema.array(Schema.string)),

                /**
                 * Optional field specifying a variant of the CPU, for example
                 * `v7` to specify ARMv7 when architecture is `arm`.
                 */
                variant: Schema.optional(Schema.string),
            })
        )
    ),
}) {}

export class ClusterVolume extends Schema.Class<ClusterVolume>()({
    /**
     * The Swarm ID of this volume. Because cluster volumes are Swarm objects,
     * they have an ID, unlike non-cluster volumes. This ID can be used to refer
     * to the Volume instead of the name.
     */
    ID: Schema.optional(Schema.string),

    /**
     * The version number of the object such as node, service, etc. This is
     * needed to avoid conflicting writes. The client must send the version
     * number along with the modified specification when updating these
     * objects.
     *
     * This approach ensures safe concurrency and determinism in that the change
     * on the object may not be applied if the version number has changed from
     * the last read. In other words, if two update requests specify the same
     * base version, only one of the requests can succeed. As a result, two
     * separate update requests that happen at the same time will not
     * unintentionally overwrite each other.
     */
    Version: Schema.optional(Schema.struct({ Index: Schema.optional(Schema.number) })),
    CreatedAt: Schema.optional(Schema.string),
    UpdatedAt: Schema.optional(Schema.string),

    /** Cluster-specific options used to create the volume. */
    Spec: Schema.optional(
        Schema.struct({
            /**
             * Group defines the volume group of this volume. Volumes belonging
             * to the same group can be referred to by group name when creating
             * Services. Referring to a volume by group instructs Swarm to treat
             * volumes in that group interchangeably for the purpose of
             * scheduling. Volumes with an empty string for a group technically
             * all belong to the same, emptystring group.
             */
            Group: Schema.optional(Schema.string),

            /** Defines how the volume is used by tasks. */
            AccessMode: Schema.optional(
                Schema.struct({
                    /**
                     * The set of nodes this volume can be used on at one time.
                     *
                     * - `single` The volume may only be scheduled to one node at
                     *   a time.
                     * - `multi` the volume may be scheduled to any supported
                     *   number of nodes at a time.
                     */
                    Scope: Schema.optional(Schema.enums(ClusterVolume_Spec_AccessMode_Scope)).withDefault(
                        () => ClusterVolume_Spec_AccessMode_Scope.SINGLE
                    ),

                    /**
                     * The number and way that different tasks can use this
                     * volume at one time.
                     *
                     * - `none` The volume may only be used by one task at a time.
                     * - `readonly` The volume may be used by any number of tasks,
                     *   but they all must mount the volume as readonly
                     * - `onewriter` The volume may be used by any number of
                     *   tasks, but only one may mount it as read/write.
                     * - `all` The volume may have any number of readers and
                     *   writers.
                     */
                    Sharing: Schema.optional(Schema.enums(ClusterVolume_Spec_AccessMode_Sharing)).withDefault(
                        () => ClusterVolume_Spec_AccessMode_Sharing.NONE
                    ),

                    /**
                     * Options for using this volume as a Mount-type volume.
                     *
                     *     Either MountVolume or BlockVolume, but not both, must be
                     *     present.
                     *
                     * Properties: FsType: type: "string" description: |
                     * Specifies the filesystem type for the mount volume.
                     * Optional. MountFlags: type: "array" description: | Flags
                     * to pass when mounting the volume. Optional. items: type:
                     * "string" BlockVolume: type: "object" description: |
                     * Options for using this volume as a Block-type volume.
                     * Intentionally empty.
                     */
                    MountVolume: Schema.optional(Schema.struct({})),

                    /**
                     * Swarm Secrets that are passed to the CSI storage plugin
                     * when operating on this volume.
                     */
                    Secrets: Schema.optional(
                        Schema.array(
                            Schema.struct({
                                /**
                                 * Key is the name of the key of the key-value
                                 * pair passed to the plugin.
                                 */
                                Key: Schema.optional(Schema.string),

                                /**
                                 * Secret is the swarm Secret object from which
                                 * to read data. This can be a Secret name or
                                 * ID. The Secret data is retrieved by swarm and
                                 * used as the value of the key-value pair
                                 * passed to the plugin.
                                 */
                                Secret: Schema.optional(Schema.string),
                            })
                        )
                    ),

                    /**
                     * Requirements for the accessible topology of the volume.
                     * These fields are optional. For an in-depth description of
                     * what these fields mean, see the CSI specification.
                     */
                    AccessibilityRequirements: Schema.optional(
                        Schema.struct({
                            /**
                             * A list of required topologies, at least one of
                             * which the volume must be accessible from.
                             */
                            Requisite: Schema.optional(Schema.array(Schema.struct({}))),

                            /**
                             * A list of topologies that the volume should
                             * attempt to be provisioned in.
                             */
                            Preferred: Schema.optional(Schema.array(Schema.struct({}))),
                        })
                    ),

                    /**
                     * The desired capacity that the volume should be created
                     * with. If empty, the plugin will decide the capacity.
                     */
                    CapacityRange: Schema.optional(
                        Schema.struct({
                            /**
                             * The volume must be at least this big. The value
                             * of 0 indicates an unspecified minimum
                             */
                            RequiredBytes: Schema.optional(Schema.number),

                            /**
                             * The volume must not be bigger than this. The
                             * value of 0 indicates an unspecified maximum.
                             */
                            LimitBytes: Schema.optional(Schema.number),
                        })
                    ),

                    /**
                     * The availability of the volume for use in tasks.
                     *
                     * - `active` The volume is fully available for scheduling on
                     *   the cluster
                     * - `pause` No new workloads should use the volume, but
                     *   existing workloads are not stopped.
                     * - `drain` All workloads using this volume should be stopped
                     *   and rescheduled, and no new ones should be started.
                     */
                    Availability: Schema.optional(Schema.enums(ClusterVolume_Spec_AccessMode_Availability)).withDefault(
                        () => ClusterVolume_Spec_AccessMode_Availability.ACTIVE
                    ),
                })
            ),
        })
    ),

    /** Information about the global status of the volume. */
    Info: Schema.optional(
        Schema.struct({
            /**
             * The capacity of the volume in bytes. A value of 0 indicates that
             * the capacity is unknown.
             */
            CapacityBytes: Schema.optional(Schema.number),

            /**
             * A map of strings to strings returned from the storage plugin when
             * the volume is created.
             */
            VolumeContext: Schema.optional(Schema.struct({})),

            /**
             * The ID of the volume as returned by the CSI storage plugin. This
             * is distinct from the volume's ID as provided by Docker. This ID
             * is never used by the user when communicating with Docker to refer
             * to this volume. If the ID is blank, then the Volume has not been
             * successfully created in the plugin yet.
             */
            VolumeID: Schema.optional(Schema.string),

            /** The topology this volume is actually accessible from. */
            AccessibleTopology: Schema.optional(Schema.array(Schema.struct({}))),
        })
    ),

    /**
     * The status of the volume as it pertains to its publishing and use on
     * specific nodes
     */
    PublishStatus: Schema.optional(
        Schema.array(
            Schema.struct({
                /** The ID of the Swarm node the volume is published on. */
                NodeID: Schema.optional(Schema.string),

                /**
                 * The published state of the volume. `pending-publish` The
                 * volume should be published to this node, but the call to the
                 * controller plugin to do so has not yet been successfully
                 * completed. `published` The volume is published successfully
                 * to the node. `pending-node-unpublish` The volume should be
                 * unpublished from the node, and the manager is awaiting
                 * confirmation from the worker that it has done so.
                 * `pending-controller-unpublish` The volume is successfully
                 * unpublished from the node, but has not yet been successfully
                 * unpublished on the controller.
                 */
                State: Schema.enums(ClusterVolume_PublishStatus_PublishStatus_State),

                /**
                 * A map of strings to strings returned by the CSI controller
                 * plugin when a volume is published.
                 */
                PublishContext: Schema.optional(Schema.struct({})),
            })
        )
    ),
}) {}

export class ClusterVolumeSpec extends Schema.Class<ClusterVolumeSpec>()({
    /**
     * Group defines the volume group of this volume. Volumes belonging to the
     * same group can be referred to by group name when creating Services.
     * Referring to a volume by group instructs Swarm to treat volumes in that
     * group interchangeably for the purpose of scheduling. Volumes with an
     * empty string for a group technically all belong to the same, emptystring
     * group.
     */
    Group: Schema.optional(Schema.string),

    /** Defines how the volume is used by tasks. */
    AccessMode: Schema.optional(
        Schema.struct({
            /**
             * The set of nodes this volume can be used on at one time.
             *
             * - `single` The volume may only be scheduled to one node at a time.
             * - `multi` the volume may be scheduled to any supported number of
             *   nodes at a time.
             */
            Scope: Schema.optional(Schema.enums(ClusterVolumeSpec_AccessMode_Scope)).withDefault(
                () => ClusterVolumeSpec_AccessMode_Scope.SINGLE
            ),

            /**
             * The number and way that different tasks can use this volume at
             * one time.
             *
             * - `none` The volume may only be used by one task at a time.
             * - `readonly` The volume may be used by any number of tasks, but
             *   they all must mount the volume as readonly
             * - `onewriter` The volume may be used by any number of tasks, but
             *   only one may mount it as read/write.
             * - `all` The volume may have any number of readers and writers.
             */
            Sharing: Schema.optional(Schema.enums(ClusterVolumeSpec_AccessMode_Sharing)).withDefault(
                () => ClusterVolumeSpec_AccessMode_Sharing.NONE
            ),

            /**
             * Options for using this volume as a Mount-type volume.
             *
             *     Either MountVolume or BlockVolume, but not both, must be
             *     present.
             *
             * Properties: FsType: type: "string" description: | Specifies the
             * filesystem type for the mount volume. Optional. MountFlags: type:
             * "array" description: | Flags to pass when mounting the volume.
             * Optional. items: type: "string" BlockVolume: type: "object"
             * description: | Options for using this volume as a Block-type
             * volume. Intentionally empty.
             */
            MountVolume: Schema.optional(Schema.struct({})),

            /**
             * Swarm Secrets that are passed to the CSI storage plugin when
             * operating on this volume.
             */
            Secrets: Schema.optional(
                Schema.array(
                    Schema.struct({
                        /**
                         * Key is the name of the key of the key-value pair
                         * passed to the plugin.
                         */
                        Key: Schema.optional(Schema.string),

                        /**
                         * Secret is the swarm Secret object from which to read
                         * data. This can be a Secret name or ID. The Secret
                         * data is retrieved by swarm and used as the value of
                         * the key-value pair passed to the plugin.
                         */
                        Secret: Schema.optional(Schema.string),
                    })
                )
            ),

            /**
             * Requirements for the accessible topology of the volume. These
             * fields are optional. For an in-depth description of what these
             * fields mean, see the CSI specification.
             */
            AccessibilityRequirements: Schema.optional(
                Schema.struct({
                    /**
                     * A list of required topologies, at least one of which the
                     * volume must be accessible from.
                     */
                    Requisite: Schema.optional(Schema.array(Schema.struct({}))),

                    /**
                     * A list of topologies that the volume should attempt to be
                     * provisioned in.
                     */
                    Preferred: Schema.optional(Schema.array(Schema.struct({}))),
                })
            ),

            /**
             * The desired capacity that the volume should be created with. If
             * empty, the plugin will decide the capacity.
             */
            CapacityRange: Schema.optional(
                Schema.struct({
                    /**
                     * The volume must be at least this big. The value of 0
                     * indicates an unspecified minimum
                     */
                    RequiredBytes: Schema.optional(Schema.number),

                    /**
                     * The volume must not be bigger than this. The value of 0
                     * indicates an unspecified maximum.
                     */
                    LimitBytes: Schema.optional(Schema.number),
                })
            ),

            /**
             * The availability of the volume for use in tasks.
             *
             * - `active` The volume is fully available for scheduling on the
             *   cluster
             * - `pause` No new workloads should use the volume, but existing
             *   workloads are not stopped.
             * - `drain` All workloads using this volume should be stopped and
             *   rescheduled, and no new ones should be started.
             */
            Availability: Schema.optional(Schema.enums(ClusterVolumeSpec_AccessMode_Availability)).withDefault(
                () => ClusterVolumeSpec_AccessMode_Availability.ACTIVE
            ),
        })
    ),
}) {}

export class Topology extends Schema.Class<Topology>()({}) {}
