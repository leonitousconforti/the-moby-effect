import * as EffectSchemas from "effect-schemas";
import * as Schema from "effect/Schema";
import * as RegistryServiceConfig from "./RegistryServiceConfig.generated.js";
import * as SwarmGenericResource from "./SwarmGenericResource.generated.js";
import * as SwarmInfo from "./SwarmInfo.generated.js";
import * as SystemCommit from "./SystemCommit.generated.js";
import * as SystemContainerdInfo from "./SystemContainerdInfo.generated.js";
import * as SystemDeviceInfo from "./SystemDeviceInfo.generated.js";
import * as SystemFirewallInfo from "./SystemFirewallInfo.generated.js";
import * as SystemNetworkAddressPool from "./SystemNetworkAddressPool.generated.js";
import * as SystemPluginsInfo from "./SystemPluginsInfo.generated.js";
import * as SystemRuntimeWithStatus from "./SystemRuntimeWithStatus.generated.js";

export class SystemInfo extends Schema.Class<SystemInfo>("SystemInfo")(
    {
        ID: Schema.String,
        Containers: EffectSchemas.Number.I64,
        ContainersRunning: EffectSchemas.Number.I64,
        ContainersPaused: EffectSchemas.Number.I64,
        ContainersStopped: EffectSchemas.Number.I64,
        Images: EffectSchemas.Number.I64,
        Driver: Schema.String,
        DriverStatus: Schema.NullOr(Schema.Array(Schema.Array(Schema.String).pipe(Schema.itemsCount(2)))),
        SystemStatus: Schema.optionalWith(Schema.Array(Schema.Array(Schema.String).pipe(Schema.itemsCount(2))), {
            nullable: true,
        }),
        Plugins: Schema.NullOr(SystemPluginsInfo.SystemPluginsInfo),
        MemoryLimit: Schema.Boolean,
        SwapLimit: Schema.Boolean,
        KernelMemory: Schema.optional(Schema.Boolean),
        KernelMemoryTCP: Schema.optional(Schema.Boolean),
        CpuCfsPeriod: Schema.Boolean,
        CpuCfsQuota: Schema.Boolean,
        CPUShares: Schema.Boolean,
        CPUSet: Schema.Boolean,
        PidsLimit: Schema.Boolean,
        IPv4Forwarding: Schema.Boolean,
        Debug: Schema.Boolean,
        NFd: EffectSchemas.Number.I64,
        OomKillDisable: Schema.Boolean,
        NGoroutines: EffectSchemas.Number.I64,
        SystemTime: Schema.String,
        LoggingDriver: Schema.String,
        CgroupDriver: Schema.String,
        CgroupVersion: Schema.optional(Schema.String),
        NEventsListener: EffectSchemas.Number.I64,
        KernelVersion: Schema.String,
        OperatingSystem: Schema.String,
        OSVersion: Schema.String,
        OSType: Schema.String,
        Architecture: Schema.String,
        IndexServerAddress: Schema.String,
        RegistryConfig: Schema.NullOr(RegistryServiceConfig.RegistryServiceConfig),
        NCPU: EffectSchemas.Number.I64,
        MemTotal: EffectSchemas.Number.I64,
        GenericResources: Schema.NullOr(Schema.Array(Schema.NullOr(SwarmGenericResource.SwarmGenericResource))),
        DockerRootDir: Schema.String,
        HttpProxy: Schema.String,
        HttpsProxy: Schema.String,
        NoProxy: Schema.String,
        Name: Schema.String,
        Labels: Schema.NullOr(Schema.Array(Schema.String)),
        ExperimentalBuild: Schema.Boolean,
        ServerVersion: Schema.String,
        Runtimes: Schema.NullOr(
            Schema.Record({ key: Schema.String, value: Schema.NullOr(SystemRuntimeWithStatus.SystemRuntimeWithStatus) })
        ),
        DefaultRuntime: Schema.String,
        Swarm: Schema.NullOr(SwarmInfo.SwarmInfo),
        LiveRestoreEnabled: Schema.Boolean,
        Isolation: Schema.Literal("", "default", "process", "hyperv"),
        InitBinary: Schema.String,
        ContainerdCommit: Schema.NullOr(SystemCommit.SystemCommit),
        RuncCommit: Schema.NullOr(SystemCommit.SystemCommit),
        InitCommit: Schema.NullOr(SystemCommit.SystemCommit),
        SecurityOptions: Schema.NullOr(Schema.Array(Schema.String)),
        ProductLicense: Schema.optional(Schema.String),
        DefaultAddressPools: Schema.optionalWith(
            Schema.Array(Schema.NullOr(SystemNetworkAddressPool.SystemNetworkAddressPool)),
            { nullable: true }
        ),
        FirewallBackend: Schema.optionalWith(SystemFirewallInfo.SystemFirewallInfo, { nullable: true }),
        CDISpecDirs: Schema.NullOr(Schema.Array(Schema.String)),
        DiscoveredDevices: Schema.optionalWith(Schema.Array(Schema.NullOr(SystemDeviceInfo.SystemDeviceInfo)), {
            nullable: true,
        }),
        Containerd: Schema.optionalWith(SystemContainerdInfo.SystemContainerdInfo, { nullable: true }),
        Warnings: Schema.NullOr(Schema.Array(Schema.String)),
    },
    {
        identifier: "SystemInfo",
        title: "system.Info",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/system#Info",
    }
) {}
