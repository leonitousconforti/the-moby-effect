import * as Schema from "effect/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as ContainerLogConfig from "./ContainerLogConfig.generated.js";
import * as ContainerResources from "./ContainerResources.generated.js";
import * as ContainerRestartPolicy from "./ContainerRestartPolicy.generated.js";
import * as Mount from "./Mount.generated.js";

export class ContainerHostConfig extends Schema.Class<ContainerHostConfig>("ContainerHostConfig")(
    {
        // Applicable to all platforms
        /** List of volume bindings for this container */
        Binds: Schema.NullOr(Schema.Array(Schema.String)),

        /** File (path) where the containerId is written */
        ContainerIDFile: Schema.String,

        /** Configuration of the logs for this container */
        LogConfig: Schema.NullOr(ContainerLogConfig.ContainerLogConfig),

        /** Network mode to use for the container */
        NetworkMode: Schema.Literal("default", "none", "host", "bridge", "nat"),

        /** Port mapping between the exposed port (container) and the host */
        PortBindings: Schema.NullOr(MobySchemas.PortSchemas.PortMap),

        /** Restart policy to be used for the container */
        RestartPolicy: Schema.NullOr(ContainerRestartPolicy.ContainerRestartPolicy),

        /** Automatically remove container when it exits */
        AutoRemove: Schema.Boolean,

        /** Name of the volume driver used to mount volumes */
        VolumeDriver: Schema.String,

        /** List of volumes to take from other container */
        VolumesFrom: Schema.NullOr(Schema.Array(Schema.String)),

        /** Initial console size (height,width) */
        ConsoleSize: Schema.Array(MobySchemas.UInt64).pipe(Schema.itemsCount(2)),

        /**
         * Arbitrary non-identifying metadata attached to container and provided
         * to the runtime
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
        CapAdd: Schema.NullOr(Schema.Array(Schema.String)),

        /** List of kernel capabilities to remove from the container */
        CapDrop: Schema.NullOr(Schema.Array(Schema.String)),

        /** Cgroup namespace mode to use for the container */
        CgroupnsMode: Schema.Literal("", "private", "host"),

        /** List of DNS servers for the container to use */
        Dns: Schema.NullOr(Schema.Array(Schema.String)),

        /** List of DNS search domains */
        DnsOptions: Schema.NullOr(Schema.Array(Schema.String)),

        /** List of DNS search domains */
        DnsSearch: Schema.NullOr(Schema.Array(Schema.String)),

        /** List of extra hosts */
        ExtraHosts: Schema.NullOr(Schema.Array(Schema.String)),

        /** List of additional groups that the container process will run as */
        GroupAdd: Schema.NullOr(Schema.Array(Schema.String)),

        /** IPC namespace to use for the container */
        IpcMode: Schema.Literal("none", "host", "container", "private", "shareable"),

        /** Cgroup to use for the container */
        Cgroup: Schema.String,

        /** List of links (in the name:alias form) */
        Links: Schema.NullOr(Schema.Array(Schema.String)),

        /** Container preference for OOM-killing */
        OomScoreAdj: MobySchemas.Int64,

        /** PID namespace to use for the container */
        PidMode: Schema.String,

        /** Is the container in privileged mode */
        Privileged: Schema.Boolean,

        /** Should docker publish all exposed port for the container */
        PublishAllPorts: Schema.Boolean,

        /** Is the container root filesystem in read-only */
        ReadonlyRootfs: Schema.Boolean,

        /**
         * List of string values to customize labels for MLS systems, such as
         * SELinux.
         */
        SecurityOpt: Schema.NullOr(Schema.Array(Schema.String)),

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
        UTSMode: Schema.String,

        /** The user namespace to use for the container */
        UsernsMode: Schema.String,

        /** Total shm memory usage */
        ShmSize: MobySchemas.Int64,

        /** List of Namespaced sysctls used for the container */
        Sysctls: Schema.optionalWith(
            Schema.Record({
                key: Schema.String,
                value: Schema.String,
            }),
            { nullable: true }
        ),

        /** Runtime to use with this container */
        Runtime: Schema.optional(Schema.String),

        // Applicable to Windows
        /** Isolation technology of the container (e.g. default, hyperv) */
        Isolation: Schema.Literal("default", "process", "hyperv", ""),

        // Contains container's resources (cgroups, ulimits)
        ...ContainerResources.ContainerResources.fields,

        /** Mounts specs used by the container */
        Mounts: Schema.optionalWith(Schema.Array(Schema.NullOr(Mount.Mount)), { nullable: true }),

        /**
         * MaskedPaths is the list of paths to be masked inside the container
         * (this overrides the default set of paths)
         */
        MaskedPaths: Schema.NullOr(Schema.Array(Schema.String)),

        /**
         * ReadonlyPaths is the list of paths to be set as read-only inside the
         * container (this overrides the default set of paths)
         */
        ReadonlyPaths: Schema.NullOr(Schema.Array(Schema.String)),

        /**
         * Run a custom init inside the container, if null, use the daemon's
         * configured settings
         */
        Init: Schema.optionalWith(Schema.Boolean, { nullable: true }),
    },
    {
        identifier: "ContainerHostConfig",
        title: "container.HostConfig",
        documentation:
            "https://github.com/moby/moby/blob/a21b1a2d12e2c01542cb191eb526d7bfad0641e3/api/types/container/hostconfig.go#L420-L480",
    }
) {}
