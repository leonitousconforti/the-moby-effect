import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";

import * as PortSchemas from "../schemas/port.ts";
import * as ContainerLogConfig from "./ContainerLogConfig.generated.ts";
import * as ContainerResources from "./ContainerResources.generated.ts";
import * as ContainerRestartPolicy from "./ContainerRestartPolicy.generated.ts";
import * as MountMount from "./MountMount.generated.ts";

export class ContainerHostConfig extends Schema.Class<ContainerHostConfig>("ContainerHostConfig")(
    {
        Binds: Schema.NullOr(Schema.Array(Schema.String)).pipe(Schema.withConstructorDefault(Effect.succeed(null))),
        ContainerIDFile: Schema.String.pipe(Schema.withConstructorDefault(Effect.succeed(""))),
        LogConfig: Schema.NullOr(ContainerLogConfig.ContainerLogConfig).pipe(
            Schema.withConstructorDefault(
                Effect.succeed(new ContainerLogConfig.ContainerLogConfig({ Type: "json-file", Config: null }))
            )
        ),
        NetworkMode: Schema.String.pipe(Schema.withConstructorDefault(Effect.succeed("default"))),
        PortBindings: Schema.NullOr(PortSchemas.PortMap).pipe(Schema.withConstructorDefault(Effect.succeed(null))),
        RestartPolicy: Schema.NullOr(ContainerRestartPolicy.ContainerRestartPolicy).pipe(
            Schema.withConstructorDefault(
                Effect.succeed(new ContainerRestartPolicy.ContainerRestartPolicy({ Name: "no", MaximumRetryCount: 0n }))
            )
        ),
        AutoRemove: Schema.Boolean.pipe(Schema.withConstructorDefault(Effect.succeed(false))),
        VolumeDriver: Schema.String.pipe(Schema.withConstructorDefault(Effect.succeed(""))),
        VolumesFrom: Schema.NullOr(Schema.Array(Schema.String)).pipe(
            Schema.withConstructorDefault(Effect.succeed(null))
        ),
        ConsoleSize: Schema.Array(
            Schema.BigIntFromString.check(Schema.isBetweenBigInt({ minimum: 0n, maximum: 2n ** 64n - 1n }))
        )
            .check(Schema.isLengthBetween(2, 2))
            .pipe(Schema.withConstructorDefault(Effect.succeed([0n, 0n]))),
        Annotations: Schema.optional(Schema.NullOr(Schema.Record(Schema.String, Schema.String))),
        CapAdd: Schema.NullOr(Schema.Array(Schema.String)).pipe(Schema.withConstructorDefault(Effect.succeed(null))),
        CapDrop: Schema.NullOr(Schema.Array(Schema.String)).pipe(Schema.withConstructorDefault(Effect.succeed(null))),
        CgroupnsMode: Schema.Literals(["", "private", "host"]).pipe(Schema.withConstructorDefault(Effect.succeed(""))),
        Dns: Schema.NullOr(Schema.Array(Schema.String)).pipe(Schema.withConstructorDefault(Effect.succeed([]))),
        DnsOptions: Schema.NullOr(Schema.Array(Schema.String)).pipe(Schema.withConstructorDefault(Effect.succeed([]))),
        DnsSearch: Schema.NullOr(Schema.Array(Schema.String)).pipe(Schema.withConstructorDefault(Effect.succeed([]))),
        ExtraHosts: Schema.NullOr(Schema.Array(Schema.String)).pipe(
            Schema.withConstructorDefault(Effect.succeed(null))
        ),
        GroupAdd: Schema.NullOr(Schema.Array(Schema.String)).pipe(Schema.withConstructorDefault(Effect.succeed(null))),
        IpcMode: Schema.String.pipe(Schema.withConstructorDefault(Effect.succeed(""))),
        Cgroup: Schema.String.pipe(Schema.withConstructorDefault(Effect.succeed(""))),
        Links: Schema.NullOr(Schema.Array(Schema.String)).pipe(Schema.withConstructorDefault(Effect.succeed(null))),
        OomScoreAdj: Schema.BigIntFromString.check(
            Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n })
        ).pipe(Schema.withConstructorDefault(Effect.succeed(0n))),
        PidMode: Schema.String.pipe(Schema.withConstructorDefault(Effect.succeed(""))),
        Privileged: Schema.Boolean.pipe(Schema.withConstructorDefault(Effect.succeed(false))),
        PublishAllPorts: Schema.Boolean.pipe(Schema.withConstructorDefault(Effect.succeed(false))),
        ReadonlyRootfs: Schema.Boolean.pipe(Schema.withConstructorDefault(Effect.succeed(false))),
        SecurityOpt: Schema.NullOr(Schema.Array(Schema.String)).pipe(
            Schema.withConstructorDefault(Effect.succeed(null))
        ),
        StorageOpt: Schema.optional(Schema.NullOr(Schema.Record(Schema.String, Schema.String))),
        Tmpfs: Schema.optional(Schema.NullOr(Schema.Record(Schema.String, Schema.String))),
        UTSMode: Schema.String.pipe(Schema.withConstructorDefault(Effect.succeed(""))),
        UsernsMode: Schema.String.pipe(Schema.withConstructorDefault(Effect.succeed(""))),
        ShmSize: Schema.BigIntFromString.check(
            Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n })
        ).pipe(Schema.withConstructorDefault(Effect.succeed(0n))),
        Sysctls: Schema.optional(Schema.NullOr(Schema.Record(Schema.String, Schema.String))),
        Runtime: Schema.optional(Schema.String),
        Isolation: Schema.Literals(["", "default", "process", "hyperv"]).pipe(
            Schema.withConstructorDefault(Effect.succeed(""))
        ),
        ...ContainerResources.ContainerResources.fields,
        Mounts: Schema.optional(Schema.NullOr(Schema.Array(Schema.NullOr(MountMount.MountMount)))),
        MaskedPaths: Schema.NullOr(Schema.Array(Schema.String)).pipe(
            Schema.withConstructorDefault(Effect.succeed(null))
        ),
        ReadonlyPaths: Schema.NullOr(Schema.Array(Schema.String)).pipe(
            Schema.withConstructorDefault(Effect.succeed(null))
        ),
        Init: Schema.optional(Schema.NullOr(Schema.Boolean)),
    },
    {
        identifier: "ContainerHostConfig",
        title: "container.HostConfig",
        documentation:
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/container#HostConfig",
    }
) {}
