import { Schema as S } from "@effect/schema";
import { pipe } from "effect";

import { Commit } from "./Commit.js";
import { GenericResources } from "./GenericResources.js";
import { PluginsInfo } from "./PluginsInfo.js";
import { RegistryServiceConfig } from "./RegistryServiceConfig.js";
import { Runtime } from "./Runtime.js";
import { SwarmInfo } from "./SwarmInfo.js";

export const SystemInfo = S.Struct({
    /**
     * Unique identifier of the daemon. <p><br /></p>> **Note**: The format of
     * the ID itself is not part of the API, and should not be considered>
     * Stable.
     */
    ID: S.optional(S.String),
    /** Total number of containers on the host. */
    Containers: S.optional(pipe(S.Number, S.int())),
    /** Number of containers with status `"running"`. */
    ContainersRunning: S.optional(pipe(S.Number, S.int())),
    /** Number of containers with status `"paused"`. */
    ContainersPaused: S.optional(pipe(S.Number, S.int())),
    /** Number of containers with status `"stopped"`. */
    ContainersStopped: S.optional(pipe(S.Number, S.int())),
    /**
     * Total number of images on the host.
     *
     * Both _tagged_ and _untagged_ (dangling) images are counted.
     */
    Images: S.optional(pipe(S.Number, S.int())),
    /** Name of the storage driver in use. */
    Driver: S.optional(S.String),
    /**
     * Information specific to the storage driver, provided as "label" / "value"
     * pairs.
     *
     * This information is provided by the storage driver, and formatted in a
     * way consistent with the output of `docker info` on the command
     * line.<p><br /></p>> **Note**: The information returned in this field,
     * including the formatting of values and> Labels, should not be considered
     * stable, and may change without notice.
     */
    DriverStatus: S.optional(S.Array(S.Array(S.String))),
    /**
     * Root directory of persistent Docker state.
     *
     * Defaults to `/var/lib/docker` on Linux, and `C:\ProgramData\docker` on
     * Windows.
     */
    DockerRootDir: S.optional(S.String),
    Plugins: S.optional(PluginsInfo),
    /** Indicates if the host has memory limit support enabled. */
    MemoryLimit: S.optional(S.Boolean),
    /** Indicates if the host has memory swap limit support enabled. */
    SwapLimit: S.optional(S.Boolean),
    /**
     * Indicates if the host has kernel memory TCP limit support enabled. This
     * field is omitted if not supported.
     *
     * Kernel memory TCP limits are not supported when using cgroups v2, which
     * does not support the corresponding `memory.kmem.tcp.limit_in_bytes`
     * cgroup.
     */
    KernelMemoryTCP: S.optional(S.Boolean),
    /**
     * Indicates if CPU CFS(Completely Fair Scheduler) period is supported by
     * the host.
     */
    CpuCfsPeriod: S.optional(S.Boolean),
    /**
     * Indicates if CPU CFS(Completely Fair Scheduler) quota is supported by the
     * host.
     */
    CpuCfsQuota: S.optional(S.Boolean),
    /** Indicates if CPU Shares limiting is supported by the host. */
    CPUShares: S.optional(S.Boolean),
    /**
     * Indicates if CPUsets (cpuset.cpus, cpuset.mems) are supported by the
     * host.
     *
     * See
     * [cpuset(7)](https://www.kernel.org/doc/Documentation/cgroup-v1/cpusets.txt)
     */
    CPUSet: S.optional(S.Boolean),
    /** Indicates if the host kernel has PID limit support enabled. */
    PidsLimit: S.optional(S.Boolean),
    /** Indicates if OOM killer disable is supported on the host. */
    OomKillDisable: S.optional(S.Boolean),
    /** Indicates IPv4 forwarding is enabled. */
    IPv4Forwarding: S.optional(S.Boolean),
    /** Indicates if `bridge-nf-call-iptables` is available on the host. */
    BridgeNfIptables: S.optional(S.Boolean),
    /** Indicates if `bridge-nf-call-ip6tables` is available on the host. */
    BridgeNfIp6tables: S.optional(S.Boolean),
    /**
     * Indicates if the daemon is running in debug-mode / with debug-level
     * logging enabled.
     */
    Debug: S.optional(S.Boolean),
    /**
     * The total number of file Descriptors in use by the daemon process.
     *
     * This information is only returned if debug-mode is enabled.
     */
    NFd: S.optional(pipe(S.Number, S.int())),
    /**
     * The number of goroutines that currently exist.
     *
     * This information is only returned if debug-mode is enabled.
     */
    NGoroutines: S.optional(pipe(S.Number, S.int())),
    /**
     * Current system-time in [RFC 3339](https://www.ietf.org/rfc/rfc3339.txt)
     * format with nano-seconds.
     */
    SystemTime: S.optional(S.String),
    /** The logging driver to use as a default for new containers. */
    LoggingDriver: S.optional(S.String),
    /** The driver to use for managing cgroups. */
    CgroupDriver: S.optional(S.Literal("cgroupfs", "systemd", "none"), {
        default: () => "cgroupfs",
    }),
    /** The version of the cgroup. */
    CgroupVersion: S.optional(S.Literal("1", "2"), {
        default: () => "1",
    }),
    /** Number of event listeners subscribed. */
    NEventsListener: S.optional(pipe(S.Number, S.int())),
    /**
     * Kernel version of the host.
     *
     * On Linux, this information obtained from `uname`. On Windows this
     * information is queried from the
     * <kbd>HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows
     * NT\CurrentVersion</kbd> registry value, for example _"10.0 14393
     * (14393.1198.amd64fre.rs1_release_sec.170427-1353)"_.
     */
    KernelVersion: S.optional(S.String),
    /**
     * Name of the host's operating system, for example: "Ubuntu 16.04.2 LTS" or
     * "Windows Server 2016 Datacenter"
     */
    OperatingSystem: S.optional(S.String),
    /**
     * Version of the host's operating system <p><br /></p>> **Note**: The
     * information returned in this field, including its very existence, and
     * the> Formatting of values, should not be considered stable, and may
     * change> Without notice.
     */
    OSVersion: S.optional(S.String),
    /**
     * Generic type of the operating system of the host, as returned by the Go
     * runtime (`GOOS`).
     *
     * Currently returned values are "linux" and "windows". A full list of
     * possible values can be found in the [Go
     * documentation](https://go.dev/doc/install/source#environment).
     */
    OSType: S.optional(S.String),
    /**
     * Hardware architecture of the host, as returned by the Go runtime
     * (`GOARCH`).
     *
     * A full list of possible values can be found in the [Go
     * documentation](https://go.dev/doc/install/source#environment).
     */
    Architecture: S.optional(S.String),
    /**
     * The number of logical CPUs usable by the daemon.
     *
     * The number of available CPUs is checked by querying the operating system
     * when the daemon starts. Changes to operating system CPU allocation after
     * the daemon is started are not reflected.
     */
    NCPU: S.optional(pipe(S.Number, S.int())),
    /** Total amount of physical memory available on the host, in bytes. */
    MemTotal: S.optional(pipe(S.Number, S.int())),
    /**
     * Address / URL of the index server that is used for image search, and as a
     * default for user authentication for Docker Hub and Docker Cloud.
     */
    IndexServerAddress: S.optional(S.String, {
        default: () => "https://index.docker.io/v1/",
    }),
    RegistryConfig: S.optional(RegistryServiceConfig),
    GenericResources: S.optional(GenericResources),
    /**
     * HTTP-proxy configured for the daemon. This value is obtained from the
     * [`HTTP_PROXY`](https://www.gnu.org/software/wget/manual/html_node/Proxies.html)
     * environment variable. Credentials ([user info
     * component](https://tools.ietf.org/html/rfc3986#section-3.2.1)) in the
     * proxy URL are masked in the API response.
     *
     * Containers do not automatically inherit this configuration.
     */
    HttpProxy: S.optional(S.String),
    /**
     * HTTPS-proxy configured for the daemon. This value is obtained from the
     * [`HTTPS_PROXY`](https://www.gnu.org/software/wget/manual/html_node/Proxies.html)
     * environment variable. Credentials ([user info
     * component](https://tools.ietf.org/html/rfc3986#section-3.2.1)) in the
     * proxy URL are masked in the API response.
     *
     * Containers do not automatically inherit this configuration.
     */
    HttpsProxy: S.optional(S.String),
    /**
     * Comma-separated list of domain extensions for which no proxy should be
     * used. This value is obtained from the
     * [`NO_PROXY`](https://www.gnu.org/software/wget/manual/html_node/Proxies.html)
     * environment variable.
     *
     * Containers do not automatically inherit this configuration.
     */
    NoProxy: S.optional(S.String),
    /** Hostname of the host. */
    Name: S.optional(S.String),
    /**
     * User-defined labels (key/value metadata) as set on the daemon. <p><br
     * /></p>> **Note**: When part of a Swarm, nodes can both have _daemon_
     * labels, set through the daemon> Configuration, and _node_ labels, set
     * from a manager node in the Swarm.> Node labels are not included in this
     * field. Node labels can be retrieved> Using the `/nodes/(id)` endpoint on
     * a manager node in the Swarm.
     */
    Labels: S.optional(S.Array(S.String)),
    /** Indicates if experimental features are enabled on the daemon. */
    ExperimentalBuild: S.optional(S.Boolean),
    /** Version string of the daemon. */
    ServerVersion: S.optional(S.String),
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
    Runtimes: S.optional(S.Record(S.String, Runtime)),
    /**
     * Name of the default OCI runtime that is used when starting containers.
     *
     * The default can be overridden per-container at create time.
     */
    DefaultRuntime: S.optional(S.String, {
        default: () => "runc",
    }),
    Swarm: S.optional(SwarmInfo),
    /**
     * Indicates if live restore is enabled.
     *
     * If enabled, containers are kept running when the daemon is shutdown or
     * upon daemon start if running containers are detected.
     */
    LiveRestoreEnabled: S.optional(S.Boolean, {
        default: () => false,
    }),
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
    Isolation: S.optional(S.Literal("default", "hyperv", "process"), {
        default: () => "default",
    }),
    /**
     * Name and, optional, path of the `docker-init` binary.
     *
     * If the path is omitted, the daemon searches the host's `$PATH` for the
     * binary and uses the first result.
     */
    InitBinary: S.optional(S.String),
    ContainerdCommit: S.optional(Commit),
    RuncCommit: S.optional(Commit),
    InitCommit: S.optional(Commit),
    /**
     * List of security features that are enabled on the daemon, such as
     * apparmor, seccomp, SELinux, user-namespaces (userns), rootless and
     * no-new-privileges.
     *
     * Additional configuration options for each security feature may be
     * present, and are included as a comma-separated list of key/value pairs.
     */
    SecurityOptions: S.optional(S.Array(S.String)),
    /**
     * Reports a summary of the product license on the daemon.
     *
     * If a commercial license has been applied to the daemon, information such
     * as number of nodes, and expiration are included.
     */
    ProductLicense: S.optional(S.String),
    /**
     * List of custom default address pools for local networks, which can be
     * specified in the daemon.json file or dockerd option.
     *
     * Example: a Base "10.10.0.0/16" with Size 24 will define the set of 256
     * 10.10.[0-255].0/24 address pools.
     */
    DefaultAddressPools: S.optional(
        S.Array(
            S.Struct({
                /** The network address in CIDR format */
                Base: S.optional(S.String),
                /** The network pool size */
                Size: S.optional(pipe(S.Number, S.int())),
            })
        )
    ),
    /**
     * List of warnings / informational messages about missing features, or
     * issues related to the daemon configuration.
     *
     * These messages can be printed by the client as information to the user.
     */
    Warnings: S.optional(S.Array(S.String)),
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
    CDISpecDirs: S.optional(S.Array(S.String)),
});

export type SystemInfo = S.Schema.Type<typeof SystemInfo>;
export const SystemInfoEncoded = S.encodedSchema(SystemInfo);
export type SystemInfoEncoded = S.Schema.Encoded<typeof SystemInfo>;
