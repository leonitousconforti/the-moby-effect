import * as Schema from "effect/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as FirewallInfo from "./FirewallInfo.generated.js";
import * as RegistryServiceConfig from "./RegistryServiceConfig.generated.js";
import * as SwarmGenericResource from "./SwarmGenericResource.generated.js";
import * as SwarmInfo from "./SwarmInfo.generated.js";
import * as SystemCommit from "./SystemCommit.generated.js";
import * as SystemContainerdInfo from "./SystemContainerdInfo.generated.js";
import * as SystemNetworkAddressPool from "./SystemNetworkAddressPool.generated.js";
import * as SystemPluginsInfo from "./SystemPluginsInfo.generated.js";
import * as SystemRuntimeWithStatus from "./SystemRuntimeWithStatus.generated.js";

export class SystemInfoResponse extends Schema.Class<SystemInfoResponse>("SystemInfoResponse")(
    {
        ID: Schema.String,
        Containers: MobySchemas.Int64,
        ContainersRunning: MobySchemas.Int64,
        ContainersPaused: MobySchemas.Int64,
        ContainersStopped: MobySchemas.Int64,
        Images: MobySchemas.Int64,
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
        BridgeNfIptables: Schema.Boolean,
        BridgeNfIp6tables: Schema.Boolean,
        Debug: Schema.Boolean,
        NFd: MobySchemas.Int64,
        OomKillDisable: Schema.Boolean,
        NGoroutines: MobySchemas.Int64,
        SystemTime: Schema.String,
        LoggingDriver: Schema.String,
        CgroupDriver: Schema.String,
        CgroupVersion: Schema.optional(Schema.String),
        NEventsListener: MobySchemas.Int64,
        KernelVersion: Schema.String,
        OperatingSystem: Schema.String,
        OSVersion: Schema.String,
        OSType: Schema.String,
        Architecture: Schema.String,
        IndexServerAddress: Schema.String,
        RegistryConfig: Schema.NullOr(RegistryServiceConfig.RegistryServiceConfig),
        NCPU: MobySchemas.Int64,
        MemTotal: MobySchemas.Int64,
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
        Isolation: Schema.String,
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
        FirewallBackend: Schema.optionalWith(FirewallInfo.FirewallInfo, { nullable: true }),
        CDISpecDirs: Schema.NullOr(Schema.Array(Schema.String)),
        Containerd: Schema.optionalWith(SystemContainerdInfo.SystemContainerdInfo, { nullable: true }),
        Warnings: Schema.NullOr(Schema.Array(Schema.String)),
    },
    {
        identifier: "SystemInfoResponse",
        title: "system.Info",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/system/info.go#L9-L85",
    }
) {}
