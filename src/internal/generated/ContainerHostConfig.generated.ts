import * as Schema from "effect/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as ContainerLogConfig from "./ContainerLogConfig.generated.js";
import * as ContainerResources from "./ContainerResources.generated.js";
import * as ContainerRestartPolicy from "./ContainerRestartPolicy.generated.js";
import * as MountMount from "./MountMount.generated.js";

export class ContainerHostConfig extends Schema.Class<ContainerHostConfig>("ContainerHostConfig")(
    {
        Binds: Schema.NullOr(Schema.Array(Schema.String))
            .pipe(Schema.propertySignature)
            .pipe(Schema.withConstructorDefault(() => null)),
        ContainerIDFile: Schema.String.pipe(Schema.propertySignature).pipe(Schema.withConstructorDefault(() => "")),
        LogConfig: Schema.NullOr(ContainerLogConfig.ContainerLogConfig)
            .pipe(Schema.propertySignature)
            .pipe(
                Schema.withConstructorDefault(
                    () => new ContainerLogConfig.ContainerLogConfig({ Type: "json-file", Config: null })
                )
            ),
        NetworkMode: Schema.String.pipe(Schema.propertySignature).pipe(Schema.withConstructorDefault(() => "default")),
        PortBindings: Schema.NullOr(MobySchemas.PortMap)
            .pipe(Schema.propertySignature)
            .pipe(Schema.withConstructorDefault(() => null)),
        RestartPolicy: Schema.NullOr(ContainerRestartPolicy.ContainerRestartPolicy)
            .pipe(Schema.propertySignature)
            .pipe(
                Schema.withConstructorDefault(
                    () =>
                        new ContainerRestartPolicy.ContainerRestartPolicy({
                            Name: "no",
                            MaximumRetryCount: MobySchemas.Int64Schemas.Int64Brand(0),
                        })
                )
            ),
        AutoRemove: Schema.Boolean.pipe(Schema.propertySignature).pipe(Schema.withConstructorDefault(() => false)),
        VolumeDriver: Schema.String.pipe(Schema.propertySignature).pipe(Schema.withConstructorDefault(() => "")),
        VolumesFrom: Schema.NullOr(Schema.Array(Schema.String))
            .pipe(Schema.propertySignature)
            .pipe(Schema.withConstructorDefault(() => null)),
        ConsoleSize: Schema.Array(MobySchemas.UInt64)
            .pipe(Schema.itemsCount(2))
            .pipe(Schema.propertySignature)
            .pipe(
                Schema.withConstructorDefault(() => [
                    MobySchemas.UInt64Schemas.UInt64Brand(0),
                    MobySchemas.UInt64Schemas.UInt64Brand(0),
                ])
            ),
        Annotations: Schema.optionalWith(Schema.Record({ key: Schema.String, value: Schema.String }), {
            nullable: true,
        }),
        CapAdd: Schema.NullOr(Schema.Array(Schema.String))
            .pipe(Schema.propertySignature)
            .pipe(Schema.withConstructorDefault(() => null)),
        CapDrop: Schema.NullOr(Schema.Array(Schema.String))
            .pipe(Schema.propertySignature)
            .pipe(Schema.withConstructorDefault(() => null)),
        CgroupnsMode: Schema.Literal("", "private", "host")
            .pipe(Schema.propertySignature)
            .pipe(Schema.withConstructorDefault(() => "")),
        Dns: Schema.NullOr(Schema.Array(Schema.String))
            .pipe(Schema.propertySignature)
            .pipe(Schema.withConstructorDefault(() => [])),
        DnsOptions: Schema.NullOr(Schema.Array(Schema.String))
            .pipe(Schema.propertySignature)
            .pipe(Schema.withConstructorDefault(() => [])),
        DnsSearch: Schema.NullOr(Schema.Array(Schema.String))
            .pipe(Schema.propertySignature)
            .pipe(Schema.withConstructorDefault(() => [])),
        ExtraHosts: Schema.NullOr(Schema.Array(Schema.String))
            .pipe(Schema.propertySignature)
            .pipe(Schema.withConstructorDefault(() => null)),
        GroupAdd: Schema.NullOr(Schema.Array(Schema.String))
            .pipe(Schema.propertySignature)
            .pipe(Schema.withConstructorDefault(() => null)),
        IpcMode: Schema.Literal("", "none", "host", "container", "private", "shareable")
            .pipe(Schema.propertySignature)
            .pipe(Schema.withConstructorDefault(() => "")),
        Cgroup: Schema.String.pipe(Schema.propertySignature).pipe(Schema.withConstructorDefault(() => "")),
        Links: Schema.NullOr(Schema.Array(Schema.String))
            .pipe(Schema.propertySignature)
            .pipe(Schema.withConstructorDefault(() => null)),
        OomScoreAdj: MobySchemas.Int64.pipe(Schema.propertySignature).pipe(
            Schema.withConstructorDefault(() => MobySchemas.Int64Schemas.Int64Brand(0))
        ),
        PidMode: Schema.String.pipe(Schema.propertySignature).pipe(Schema.withConstructorDefault(() => "")),
        Privileged: Schema.Boolean.pipe(Schema.propertySignature).pipe(Schema.withConstructorDefault(() => false)),
        PublishAllPorts: Schema.Boolean.pipe(Schema.propertySignature).pipe(Schema.withConstructorDefault(() => false)),
        ReadonlyRootfs: Schema.Boolean.pipe(Schema.propertySignature).pipe(Schema.withConstructorDefault(() => false)),
        SecurityOpt: Schema.NullOr(Schema.Array(Schema.String))
            .pipe(Schema.propertySignature)
            .pipe(Schema.withConstructorDefault(() => null)),
        StorageOpt: Schema.optionalWith(Schema.Record({ key: Schema.String, value: Schema.String }), {
            nullable: true,
        }),
        Tmpfs: Schema.optionalWith(Schema.Record({ key: Schema.String, value: Schema.String }), { nullable: true }),
        UTSMode: Schema.String.pipe(Schema.propertySignature).pipe(Schema.withConstructorDefault(() => "")),
        UsernsMode: Schema.String.pipe(Schema.propertySignature).pipe(Schema.withConstructorDefault(() => "")),
        ShmSize: MobySchemas.Int64.pipe(Schema.propertySignature).pipe(
            Schema.withConstructorDefault(() => MobySchemas.Int64Schemas.Int64Brand(0))
        ),
        Sysctls: Schema.optionalWith(Schema.Record({ key: Schema.String, value: Schema.String }), { nullable: true }),
        Runtime: Schema.optional(Schema.String),
        Isolation: Schema.Literal("", "default", "process", "hyperv")
            .pipe(Schema.propertySignature)
            .pipe(Schema.withConstructorDefault(() => "")),
        ...ContainerResources.ContainerResources.fields,
        Mounts: Schema.optionalWith(Schema.Array(Schema.NullOr(MountMount.MountMount)), { nullable: true }),
        MaskedPaths: Schema.NullOr(Schema.Array(Schema.String))
            .pipe(Schema.propertySignature)
            .pipe(Schema.withConstructorDefault(() => null)),
        ReadonlyPaths: Schema.NullOr(Schema.Array(Schema.String))
            .pipe(Schema.propertySignature)
            .pipe(Schema.withConstructorDefault(() => null)),
        Init: Schema.optionalWith(Schema.Boolean, { nullable: true }),
    },
    {
        identifier: "ContainerHostConfig",
        title: "container.HostConfig",
        documentation:
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/container#HostConfig",
    }
) {}
