import * as Schema from "effect/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as ContainerLogConfig from "./ContainerLogConfig.generated.js";
import * as ContainerResources from "./ContainerResources.generated.js";
import * as ContainerRestartPolicy from "./ContainerRestartPolicy.generated.js";
import * as MountMount from "./MountMount.generated.js";

export class ContainerHostConfig extends Schema.Class<ContainerHostConfig>("ContainerHostConfig")(
    {
        Binds: Schema.NullOr(Schema.Array(Schema.String)),
        ContainerIDFile: Schema.String,
        LogConfig: Schema.NullOr(ContainerLogConfig.ContainerLogConfig),
        NetworkMode: Schema.String,
        PortBindings: Schema.NullOr(MobySchemas.PortMap),
        RestartPolicy: Schema.NullOr(ContainerRestartPolicy.ContainerRestartPolicy),
        AutoRemove: Schema.Boolean,
        VolumeDriver: Schema.String,
        VolumesFrom: Schema.NullOr(Schema.Array(Schema.String)),
        ConsoleSize: Schema.Array(MobySchemas.UInt64).pipe(Schema.itemsCount(2)),
        Annotations: Schema.optionalWith(Schema.Record({ key: Schema.String, value: Schema.String }), {
            nullable: true,
        }),
        CapAdd: Schema.NullOr(Schema.Array(Schema.String)),
        CapDrop: Schema.NullOr(Schema.Array(Schema.String)),
        CgroupnsMode: Schema.Literal("", "private", "host"),
        Dns: Schema.NullOr(Schema.Array(Schema.String)),
        DnsOptions: Schema.NullOr(Schema.Array(Schema.String)),
        DnsSearch: Schema.NullOr(Schema.Array(Schema.String)),
        ExtraHosts: Schema.NullOr(Schema.Array(Schema.String)),
        GroupAdd: Schema.NullOr(Schema.Array(Schema.String)),
        IpcMode: Schema.Literal("none", "host", "container", "private", "shareable"),
        Cgroup: Schema.String,
        Links: Schema.NullOr(Schema.Array(Schema.String)),
        OomScoreAdj: MobySchemas.Int64,
        PidMode: Schema.String,
        Privileged: Schema.Boolean,
        PublishAllPorts: Schema.Boolean,
        ReadonlyRootfs: Schema.Boolean,
        SecurityOpt: Schema.NullOr(Schema.Array(Schema.String)),
        StorageOpt: Schema.optionalWith(Schema.Record({ key: Schema.String, value: Schema.String }), {
            nullable: true,
        }),
        Tmpfs: Schema.optionalWith(Schema.Record({ key: Schema.String, value: Schema.String }), { nullable: true }),
        UTSMode: Schema.String,
        UsernsMode: Schema.String,
        ShmSize: MobySchemas.Int64,
        Sysctls: Schema.optionalWith(Schema.Record({ key: Schema.String, value: Schema.String }), { nullable: true }),
        Runtime: Schema.optional(Schema.String),
        Isolation: Schema.Literal("", "default", "process", "hyperv"),
        ...ContainerResources.ContainerResources.fields,
        Mounts: Schema.optionalWith(Schema.Array(Schema.NullOr(MountMount.MountMount)), { nullable: true }),
        MaskedPaths: Schema.NullOr(Schema.Array(Schema.String)),
        ReadonlyPaths: Schema.NullOr(Schema.Array(Schema.String)),
        Init: Schema.optionalWith(Schema.Boolean, { nullable: true }),
    },
    {
        identifier: "ContainerHostConfig",
        title: "container.HostConfig",
        documentation:
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/container#HostConfig",
    }
) {}
