import * as Schema from "effect/Schema";
import * as RegistryServiceConfig from "./RegistryServiceConfig.generated.ts";
import * as SwarmGenericResource from "./SwarmGenericResource.generated.ts";
import * as SwarmInfo from "./SwarmInfo.generated.ts";
import * as SystemCommit from "./SystemCommit.generated.ts";
import * as SystemContainerdInfo from "./SystemContainerdInfo.generated.ts";
import * as SystemDeviceInfo from "./SystemDeviceInfo.generated.ts";
import * as SystemFirewallInfo from "./SystemFirewallInfo.generated.ts";
import * as SystemNetworkAddressPool from "./SystemNetworkAddressPool.generated.ts";
import * as SystemPluginsInfo from "./SystemPluginsInfo.generated.ts";
import * as SystemRuntimeWithStatus from "./SystemRuntimeWithStatus.generated.ts";

export class SystemInfo extends Schema.Class<SystemInfo>("SystemInfo")(
    {
        ID: Schema.String,
        Containers: Schema.BigIntFromString.check(Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n })),
        ContainersRunning: Schema.BigIntFromString.check(Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n })),
        ContainersPaused: Schema.BigIntFromString.check(Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n })),
        ContainersStopped: Schema.BigIntFromString.check(Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n })),
        Images: Schema.BigIntFromString.check(Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n })),
        Driver: Schema.String,
        DriverStatus: Schema.NullOr(Schema.Array(Schema.Array(Schema.String).pipe(Schema.check(Schema.isLengthBetween(2, 2))))),
        SystemStatus: Schema.optional(Schema.NullOr(Schema.Array(Schema.Array(Schema.String).pipe(Schema.check(Schema.isLengthBetween(2, 2)))))),
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
        NFd: Schema.BigIntFromString.check(Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n })),
        OomKillDisable: Schema.Boolean,
        NGoroutines: Schema.BigIntFromString.check(Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n })),
        SystemTime: Schema.String,
        LoggingDriver: Schema.String,
        CgroupDriver: Schema.String,
        CgroupVersion: Schema.optional(Schema.String),
        NEventsListener: Schema.BigIntFromString.check(Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n })),
        KernelVersion: Schema.String,
        OperatingSystem: Schema.String,
        OSVersion: Schema.String,
        OSType: Schema.String,
        Architecture: Schema.String,
        IndexServerAddress: Schema.String,
        RegistryConfig: Schema.NullOr(RegistryServiceConfig.RegistryServiceConfig),
        NCPU: Schema.BigIntFromString.check(Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n })),
        MemTotal: Schema.BigIntFromString.check(Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n })),
        GenericResources: Schema.NullOr(Schema.Array(Schema.NullOr(SwarmGenericResource.SwarmGenericResource))),
        DockerRootDir: Schema.String,
        HttpProxy: Schema.String,
        HttpsProxy: Schema.String,
        NoProxy: Schema.String,
        Name: Schema.String,
        Labels: Schema.NullOr(Schema.Array(Schema.String)),
        ExperimentalBuild: Schema.Boolean,
        ServerVersion: Schema.String,
        Runtimes: Schema.NullOr(Schema.Record(Schema.String, Schema.NullOr(SystemRuntimeWithStatus.SystemRuntimeWithStatus))),
        DefaultRuntime: Schema.String,
        Swarm: Schema.NullOr(SwarmInfo.SwarmInfo),
        LiveRestoreEnabled: Schema.Boolean,
        Isolation: Schema.Literals(["", "default", "process", "hyperv"]),
        InitBinary: Schema.String,
        ContainerdCommit: Schema.NullOr(SystemCommit.SystemCommit),
        RuncCommit: Schema.NullOr(SystemCommit.SystemCommit),
        InitCommit: Schema.NullOr(SystemCommit.SystemCommit),
        SecurityOptions: Schema.NullOr(Schema.Array(Schema.String)),
        ProductLicense: Schema.optional(Schema.String),
        DefaultAddressPools: Schema.optional(Schema.NullOr(Schema.Array(Schema.NullOr(SystemNetworkAddressPool.SystemNetworkAddressPool)))),
        FirewallBackend: Schema.optional(Schema.NullOr(SystemFirewallInfo.SystemFirewallInfo)),
        CDISpecDirs: Schema.NullOr(Schema.Array(Schema.String)),
        DiscoveredDevices: Schema.optional(Schema.NullOr(Schema.Array(Schema.NullOr(SystemDeviceInfo.SystemDeviceInfo)))),
        Containerd: Schema.optional(Schema.NullOr(SystemContainerdInfo.SystemContainerdInfo)),
        Warnings: Schema.NullOr(Schema.Array(Schema.String)),
    },
    {
        identifier: "SystemInfo",
        title: "system.Info",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/system#Info",
    }
) {}
