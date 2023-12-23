import * as Schema from "@effect/schema/Schema";

export enum Port_Type {
    "TCP" = "tcp",
    "UDP" = "udp",
    "SCTP" = "sctp",
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

export enum MountPoint_Type {
    "BIND" = "bind",
    "VOLUME" = "volume",
    "TMPFS" = "tmpfs",
    "NPIPE" = "npipe",
    "CLUSTER" = "cluster",
}

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
    Type: Schema.optional(Schema.enums(MountPoint_Type)),

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
    DeviceIDs: Schema.optional(Schema.nullable(Schema.array(Schema.string))),

    /** A list of capabilities; an OR list of AND lists of capabilities. */
    Capabilities: Schema.optional(Schema.nullable(Schema.array(Schema.nullable(Schema.array(Schema.string))))),

    /**
     * Driver-specific options, specified as a key/value pairs. These options
     * are passed directly to the driver.
     */
    Options: Schema.optional(Schema.nullable(Schema.record(Schema.string, Schema.string))),
}) {}

export class ThrottleDevice extends Schema.Class<ThrottleDevice>()({
    /** Device path */
    Path: Schema.optional(Schema.string),

    /** Rate */
    Rate: Schema.optional(Schema.number),
}) {}

export enum Mount_Type {
    "BIND" = "bind",
    "VOLUME" = "volume",
    "TMPFS" = "tmpfs",
    "NPIPE" = "npipe",
    "CLUSTER" = "cluster",
}

export enum Mount_BindOptions_Propagation {
    "PRIVATE" = "private",
    "RPRIVATE" = "rprivate",
    "SHARED" = "shared",
    "RSHARED" = "rshared",
    "SLAVE" = "slave",
    "RSLAVE" = "rslave",
}

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
    Type: Schema.optional(Schema.enums(Mount_Type)),

    /** Whether the mount should be read-only. */
    ReadOnly: Schema.optional(Schema.boolean),

    /**
     * The consistency requirement for the mount: `default`, `consistent`,
     * `cached`, or `delegated`.
     */
    Consistency: Schema.optional(Schema.string),

    /** Optional configuration for the `bind` type. */
    BindOptions: Schema.optional(
        Schema.nullable(
            Schema.struct({
                /**
                 * A propagation mode with the value `[r]private`, `[r]shared`,
                 * or `[r]slave`.
                 */
                Propagation: Schema.optional(Schema.enums(Mount_BindOptions_Propagation)),

                /** Disable recursive bind mount. */
                NonRecursive: Schema.optional(Schema.boolean),

                /** Create mount point on host if missing */
                CreateMountpoint: Schema.optional(Schema.boolean),
            })
        )
    ),

    /** Optional configuration for the `volume` type. */
    VolumeOptions: Schema.optional(
        Schema.nullable(
            Schema.struct({
                /** Populate volume with data from the target. */
                NoCopy: Schema.optional(Schema.boolean),

                /** User-defined key/value metadata. */
                Labels: Schema.optional(Schema.nullable(Schema.record(Schema.string, Schema.string))),

                /** Map of driver specific options */
                DriverConfig: Schema.optional(
                    Schema.nullable(
                        Schema.struct({
                            /** Name of the driver to use to create the volume. */
                            Name: Schema.optional(Schema.string),

                            /** Key/value map of driver specific options. */
                            Options: Schema.optional(Schema.nullable(Schema.record(Schema.string, Schema.string))),
                        })
                    )
                ),
            })
        )
    ),

    /** Optional configuration for the `tmpfs` type. */
    TmpfsOptions: Schema.optional(
        Schema.nullable(
            Schema.struct({
                /** The size for the tmpfs mount in bytes. */
                SizeBytes: Schema.optional(Schema.number),

                /** The permission mode for the tmpfs mount in an integer. */
                Mode: Schema.optional(Schema.number),
            })
        )
    ),
}) {}

export enum RestartPolicy_Name {
    "NONE" = "",
    "NO" = "no",
    "ALWAYS" = "always",
    "UNLESS-STOPPED" = "unless-stopped",
    "ON-FAILURE" = "on-failure",
}

export class RestartPolicy extends Schema.Class<RestartPolicy>()({
    /**
     * - Empty string means not to restart
     * - `no` Do not automatically restart
     * - `always` Always restart
     * - `unless-stopped` Restart always except when the user has manually stopped
     *   the container
     * - `on-failure` Restart only when the container exit code is non-zero
     */
    Name: Schema.optional(Schema.enums(RestartPolicy_Name)),

    /** If `on-failure` is used, the number of times to retry before giving up. */
    MaximumRetryCount: Schema.optional(Schema.number),
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

export const GenericResources = Schema.array(
    Schema.nullable(
        Schema.struct({
            NamedResourceSpec: Schema.optional(
                Schema.nullable(
                    Schema.struct({ Kind: Schema.optional(Schema.string), Value: Schema.optional(Schema.string) })
                )
            ),
            DiscreteResourceSpec: Schema.optional(
                Schema.nullable(
                    Schema.struct({ Kind: Schema.optional(Schema.string), Value: Schema.optional(Schema.number) })
                )
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
    Test: Schema.optional(Schema.nullable(Schema.array(Schema.string))),

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

export class Address extends Schema.Class<Address>()({
    /** IP address. */
    Addr: Schema.optional(Schema.string),

    /** Mask length of the IP address. */
    PrefixLen: Schema.optional(Schema.number),
}) {}

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
    Data: Schema.nullable(Schema.record(Schema.string, Schema.string)),
}) {}

export enum ChangeType {
    "ZERO" = "0",
    "ONE" = "1",
    "TWO" = "2",
}

Schema.optional(Schema.enums(ChangeType));

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
    RepoTags: Schema.nullable(Schema.array(Schema.string)),

    /**
     * List of content-addressable digests of locally available image manifests
     * that the image is referenced from. Multiple manifests can refer to the
     * same image.
     *
     * These digests are usually only available if the image was either pulled
     * from a registry, or if the image was pushed to a registry, which is when
     * the manifest is generated and its digest calculated.
     */
    RepoDigests: Schema.nullable(Schema.array(Schema.string)),

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
     * In versions of Docker before v1.10, this field was calculated from the
     * image itself and all of its parent images. Images are now stored
     * self-contained, and no longer use a parent-chain, making this field an
     * equivalent of the Size field.
     *
     * Deprecated: this field is kept for backward compatibility, and will be
     * removed in API v1.44.
     */
    VirtualSize: Schema.optional(Schema.number),

    /** User-defined key/value metadata. */
    Labels: Schema.nullable(Schema.record(Schema.string, Schema.string)),

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
    arguments: Schema.optional(Schema.nullable(Schema.array(Schema.string))),
}) {}

export class IPAMConfig extends Schema.Class<IPAMConfig>()({
    Subnet: Schema.optional(Schema.string),
    IPRange: Schema.optional(Schema.string),
    Gateway: Schema.optional(Schema.string),
    AuxiliaryAddresses: Schema.optional(Schema.nullable(Schema.record(Schema.string, Schema.string))),
}) {}

export class NetworkContainer extends Schema.Class<NetworkContainer>()({
    Name: Schema.optional(Schema.string),
    EndpointID: Schema.optional(Schema.string),
    MacAddress: Schema.optional(Schema.string),
    IPv4Address: Schema.optional(Schema.string),
    IPv6Address: Schema.optional(Schema.string),
}) {}

export enum BuildCache_Type {
    "INTERNAL" = "internal",
    "FRONTEND" = "frontend",
    "SOURCE.LOCAL" = "source.local",
    "SOURCE.GIT.CHECKOUT" = "source.git.checkout",
    "EXEC.CACHEMOUNT" = "exec.cachemount",
    "REGULAR" = "regular",
}

export class BuildCache extends Schema.Class<BuildCache>()({
    /** Unique ID of the build cache record. */
    ID: Schema.optional(Schema.string),

    /**
     * ID of the parent build cache record.> **Deprecated**: This field is
     * deprecated, and omitted if empty.
     */
    Parent: Schema.optional(Schema.string),

    /** List of parent build cache record IDs. */
    Parents: Schema.optional(Schema.nullable(Schema.array(Schema.string))),

    /** Cache record type. */
    Type: Schema.optional(Schema.enums(BuildCache_Type)),

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
    LastUsedAt: Schema.optional(Schema.string),
    UsageCount: Schema.optional(Schema.number),
}) {}

export class ImageID extends Schema.Class<ImageID>()({ ID: Schema.optional(Schema.string) }) {}

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

export class IDResponse extends Schema.Class<IDResponse>()({
    /** The id of the newly created object. */
    ID: Schema.string,
}) {}

export class EndpointIPAMConfig extends Schema.Class<EndpointIPAMConfig>()({
    IPv4Address: Schema.optional(Schema.string),
    IPv6Address: Schema.optional(Schema.string),
    LinkLocalIPs: Schema.optional(Schema.nullable(Schema.array(Schema.string))),
}) {}

export class PluginMount extends Schema.Class<PluginMount>()({
    Name: Schema.string,
    Description: Schema.string,
    Settable: Schema.nullable(Schema.array(Schema.string)),
    Source: Schema.string,
    Destination: Schema.string,
    Type: Schema.string,
    Options: Schema.nullable(Schema.array(Schema.string)),
}) {}

export class PluginDevice extends Schema.Class<PluginDevice>()({
    Name: Schema.string,
    Description: Schema.string,
    Settable: Schema.nullable(Schema.array(Schema.string)),
    Path: Schema.string,
}) {}

export class PluginEnv extends Schema.Class<PluginEnv>()({
    Name: Schema.string,
    Description: Schema.string,
    Settable: Schema.nullable(Schema.array(Schema.string)),
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
    Value: Schema.optional(Schema.nullable(Schema.array(Schema.string))),
}) {}

export class ObjectVersion extends Schema.Class<ObjectVersion>()({ Index: Schema.optional(Schema.number) }) {}

export enum NodeSpec_Role {
    "WORKER" = "worker",
    "MANAGER" = "manager",
}

export enum NodeSpec_Availability {
    "ACTIVE" = "active",
    "PAUSE" = "pause",
    "DRAIN" = "drain",
}

export class NodeSpec extends Schema.Class<NodeSpec>()({
    /** Name for the node. */
    Name: Schema.optional(Schema.string),

    /** User-defined key/value metadata. */
    Labels: Schema.optional(Schema.nullable(Schema.record(Schema.string, Schema.string))),

    /** Role of the node. */
    Role: Schema.optional(Schema.enums(NodeSpec_Role)),

    /** Availability of the node. */
    Availability: Schema.optional(Schema.enums(NodeSpec_Availability)),
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
    Labels: Schema.optional(Schema.nullable(Schema.record(Schema.string, Schema.string))),
    Plugins: Schema.optional(
        Schema.nullable(
            Schema.array(
                Schema.nullable(
                    Schema.struct({ Type: Schema.optional(Schema.string), Name: Schema.optional(Schema.string) })
                )
            )
        )
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

export enum NodeState {
    "UNKNOWN" = "unknown",
    "DOWN" = "down",
    "READY" = "ready",
    "DISCONNECTED" = "disconnected",
}

Schema.optional(Schema.enums(NodeState));

export enum Reachability {
    "UNKNOWN" = "unknown",
    "UNREACHABLE" = "unreachable",
    "REACHABLE" = "reachable",
}

Schema.optional(Schema.enums(Reachability));

export enum SwarmSpec_CAConfig_ExternalCAs_ExternalCAs_Protocol {
    "CFSSL" = "cfssl",
}

export class SwarmSpec extends Schema.Class<SwarmSpec>()({
    /** Name of the swarm. */
    Name: Schema.optional(Schema.string),

    /** User-defined key/value metadata. */
    Labels: Schema.optional(Schema.nullable(Schema.record(Schema.string, Schema.string))),

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
        Schema.nullable(
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
                 * The number of ticks that a follower will wait for a message
                 * from the leader before becoming a candidate and starting an
                 * election. `ElectionTick` must be greater than
                 * `HeartbeatTick`.
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
        )
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
                    Schema.nullable(
                        Schema.array(
                            Schema.nullable(
                                Schema.struct({
                                    /**
                                     * Protocol for communication with the
                                     * external CA (currently only `cfssl` is
                                     * supported).
                                     */
                                    Protocol: Schema.optional(
                                        Schema.enums(SwarmSpec_CAConfig_ExternalCAs_ExternalCAs_Protocol)
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
                                    Options: Schema.optional(
                                        Schema.nullable(Schema.record(Schema.string, Schema.string))
                                    ),

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
                        )
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
        Schema.nullable(
            Schema.struct({
                /**
                 * If set, generate a key and use it to lock data stored on the
                 * managers.
                 */
                AutoLockManagers: Schema.optional(Schema.boolean),
            })
        )
    ),

    /** Defaults for creating tasks in this cluster. */
    TaskDefaults: Schema.optional(
        Schema.nullable(
            Schema.struct({
                /**
                 * The log driver to use for tasks created in the orchestrator
                 * if unspecified by a service.
                 *
                 * Updating this value only affects new tasks. Existing tasks
                 * continue to use their previously configured log driver until
                 * recreated.
                 */
                LogDriver: Schema.optional(
                    Schema.nullable(
                        Schema.struct({
                            /** The log driver to use as a default for new tasks. */
                            Name: Schema.optional(Schema.string),

                            /**
                             * Driver-specific options for the selectd log
                             * driver, specified as key/value pairs.
                             */
                            Options: Schema.optional(Schema.nullable(Schema.record(Schema.string, Schema.string))),
                        })
                    )
                ),
            })
        )
    ),
}) {}

export class JoinTokens extends Schema.Class<JoinTokens>()({
    /** The token workers can use to join the swarm. */
    Worker: Schema.optional(Schema.string),

    /** The token managers can use to join the swarm. */
    Manager: Schema.optional(Schema.string),
}) {}

export enum TaskState {
    "NEW" = "new",
    "ALLOCATED" = "allocated",
    "PENDING" = "pending",
    "ASSIGNED" = "assigned",
    "ACCEPTED" = "accepted",
    "PREPARING" = "preparing",
    "READY" = "ready",
    "STARTING" = "starting",
    "RUNNING" = "running",
    "COMPLETE" = "complete",
    "SHUTDOWN" = "shutdown",
    "FAILED" = "failed",
    "REJECTED" = "rejected",
    "REMOVE" = "remove",
    "ORPHANED" = "orphaned",
}

Schema.optional(Schema.enums(TaskState));

export enum EndpointPortConfig_Protocol {
    "TCP" = "tcp",
    "UDP" = "udp",
    "SCTP" = "sctp",
}

export enum EndpointPortConfig_PublishMode {
    "INGRESS" = "ingress",
    "HOST" = "host",
}

export class EndpointPortConfig extends Schema.Class<EndpointPortConfig>()({
    Name: Schema.optional(Schema.string),
    Protocol: Schema.optional(Schema.enums(EndpointPortConfig_Protocol)),

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
    PublishMode: Schema.optional(Schema.enums(EndpointPortConfig_PublishMode)),
}) {}

export class ImageDeleteResponseItem extends Schema.Class<ImageDeleteResponseItem>()({
    /** The image ID of an image that was untagged */
    Untagged: Schema.optional(Schema.string),

    /** The image ID of an image that was deleted */
    Deleted: Schema.optional(Schema.string),
}) {}

export class ServiceUpdateResponse extends Schema.Class<ServiceUpdateResponse>()({
    /** Optional warning messages */
    Warnings: Schema.optional(Schema.nullable(Schema.array(Schema.string))),
}) {}

export class Driver extends Schema.Class<Driver>()({
    /** Name of the driver. */
    Name: Schema.string,

    /** Key/value map of driver-specific options. */
    Options: Schema.optional(Schema.nullable(Schema.record(Schema.string, Schema.string))),
}) {}

export class ContainerCreateResponse extends Schema.Class<ContainerCreateResponse>()({
    /** The ID of the created container */
    Id: Schema.string,

    /** Warnings encountered when creating the container */
    Warnings: Schema.nullable(Schema.array(Schema.string)),
}) {}

export class ContainerWaitExitError extends Schema.Class<ContainerWaitExitError>()({
    /** Details of an error */
    Message: Schema.optional(Schema.string),
}) {}

export class SystemVersion extends Schema.Class<SystemVersion>()({
    Platform: Schema.optional(Schema.nullable(Schema.struct({ Name: Schema.string }))),

    /** Information about system components */
    Components: Schema.optional(
        Schema.nullable(
            Schema.array(
                Schema.nullable(
                    Schema.struct({
                        /** Name of the component */
                        Name: Schema.string,

                        /** Version of the component */
                        Version: Schema.string,

                        /**
                         * Key/value pairs of strings with additional
                         * information about the component. These values are
                         * intended for informational purposes only, and their
                         * content is not defined, and not part of the API
                         * specification.
                         *
                         * These messages can be printed by the client as
                         * information to the user.
                         */
                        Details: Schema.optional(Schema.nullable(Schema.struct({}))),
                    })
                )
            )
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

export class PluginsInfo extends Schema.Class<PluginsInfo>()({
    /** Names of available volume-drivers, and network-driver plugins. */
    Volume: Schema.optional(Schema.nullable(Schema.array(Schema.string))),

    /** Names of available network-drivers, and network-driver plugins. */
    Network: Schema.optional(Schema.nullable(Schema.array(Schema.string))),

    /** Names of available authorization plugins. */
    Authorization: Schema.optional(Schema.nullable(Schema.array(Schema.string))),

    /** Names of available logging-drivers, and logging-driver plugins. */
    Log: Schema.optional(Schema.nullable(Schema.array(Schema.string))),
}) {}

export class IndexInfo extends Schema.Class<IndexInfo>()({
    /** Name of the registry, such as "docker.io". */
    Name: Schema.optional(Schema.string),

    /** List of mirrors, expressed as URIs. */
    Mirrors: Schema.optional(Schema.nullable(Schema.array(Schema.string))),

    /**
     * Indicates if the registry is part of the list of insecure registries.
     *
     * If `false`, the registry is insecure. Insecure registries accept
     * un-encrypted (HTTP) and/or untrusted (HTTPS with certificates from
     * unknown CAs) communication.> **Warning**: Insecure registries can be
     * useful when running a local> Registry. However, because its use creates
     * security vulnerabilities it> Should ONLY be enabled for testing purposes.
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
}) {}

export class Commit extends Schema.Class<Commit>()({
    /** Actual commit ID of external tool. */
    ID: Schema.optional(Schema.string),

    /** Commit ID of external tool expected by dockerd as set at build time. */
    Expected: Schema.optional(Schema.string),
}) {}

export enum LocalNodeState {
    "NONE" = "",
    "INACTIVE" = "inactive",
    "PENDING" = "pending",
    "ACTIVE" = "active",
    "ERROR" = "error",
    "LOCKED" = "locked",
}

Schema.optional(Schema.enums(LocalNodeState));

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
    Aliases: Schema.optional(Schema.nullable(Schema.array(Schema.string))),

    /** Driver attachment options for the network target. */
    DriverOpts: Schema.optional(Schema.nullable(Schema.record(Schema.string, Schema.string))),
}) {}

export class EventActor extends Schema.Class<EventActor>()({
    /** The ID of the object emitting the event */
    ID: Schema.optional(Schema.string),

    /** Various key/value attributes of the object, depending on its type. */
    Attributes: Schema.optional(Schema.nullable(Schema.record(Schema.string, Schema.string))),
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
    "os.features": Schema.optional(Schema.nullable(Schema.array(Schema.string))),

    /**
     * Optional field specifying a variant of the CPU, for example `v7` to
     * specify ARMv7 when architecture is `arm`.
     */
    variant: Schema.optional(Schema.string),
}) {}

export const Topology = Schema.record(Schema.string, Schema.string);

export class ContainerTopResponse extends Schema.Class<ContainerTopResponse>()({
    /** The ps column titles */
    Titles: Schema.optional(Schema.nullable(Schema.array(Schema.string))),

    /**
     * Each process running in the container, where each is process is an array
     * of values corresponding to the titles.
     */
    Processes: Schema.optional(Schema.nullable(Schema.array(Schema.nullable(Schema.array(Schema.string))))),
}) {}

export class ContainerUpdateResponse extends Schema.Class<ContainerUpdateResponse>()({
    Warnings: Schema.optional(Schema.nullable(Schema.array(Schema.string))),
}) {}

export class ContainerPruneResponse extends Schema.Class<ContainerPruneResponse>()({
    /** Container IDs that were deleted */
    ContainersDeleted: Schema.optional(Schema.nullable(Schema.array(Schema.string))),

    /** Disk space reclaimed in bytes */
    SpaceReclaimed: Schema.optional(Schema.number),
}) {}

export class BuildPruneResponse extends Schema.Class<BuildPruneResponse>()({
    CachesDeleted: Schema.optional(Schema.nullable(Schema.array(Schema.string))),

    /** Disk space reclaimed in bytes */
    SpaceReclaimed: Schema.optional(Schema.number),
}) {}

export const HistoryResponseItem = Schema.array(
    Schema.nullable(
        Schema.struct({
            Id: Schema.string,
            Created: Schema.number,
            CreatedBy: Schema.string,
            Tags: Schema.nullable(Schema.array(Schema.string)),
            Size: Schema.number,
            Comment: Schema.string,
        })
    )
);

export const ImageSearchResponseItem = Schema.array(
    Schema.nullable(
        Schema.struct({
            description: Schema.optional(Schema.string),
            is_official: Schema.optional(Schema.boolean),
            is_automated: Schema.optional(Schema.boolean),
            name: Schema.optional(Schema.string),
            star_count: Schema.optional(Schema.number),
        })
    )
);

export class SystemAuthResponse extends Schema.Class<SystemAuthResponse>()({
    /** The status of the authentication */
    Status: Schema.string,

    /** An opaque token used to authenticate a user after a successful login */
    IdentityToken: Schema.optional(Schema.string),
}) {}

export class ExecConfig extends Schema.Class<ExecConfig>()({
    /** Attach to `stdin` of the exec command. */
    AttachStdin: Schema.optional(Schema.boolean),

    /** Attach to `stdout` of the exec command. */
    AttachStdout: Schema.optional(Schema.boolean),

    /** Attach to `stderr` of the exec command. */
    AttachStderr: Schema.optional(Schema.boolean),

    /** Initial console size, as an `[height, width]` array. */
    ConsoleSize: Schema.optional(Schema.nullable(Schema.array(Schema.number))),

    /**
     * Override the key sequence for detaching a container. Format is a single
     * character `[a-Z]` or `ctrl-<value>` where `<value>` is one of: `a-z`,
     * `@`, `^`, `[`, `,` or `_`.
     */
    DetachKeys: Schema.optional(Schema.string),

    /** Allocate a pseudo-TTY. */
    Tty: Schema.optional(Schema.boolean),

    /** A list of environment variables in the form `["VAR=value", ...]`. */
    Env: Schema.optional(Schema.nullable(Schema.array(Schema.string))),

    /** Command to run, as a string or array of strings. */
    Cmd: Schema.optional(Schema.nullable(Schema.array(Schema.string))),

    /** Runs the exec process with extended privileges. */
    Privileged: Schema.optional(Schema.boolean),

    /**
     * The user, and optionally, group to run the exec process inside the
     * container. Format is one of: `user`, `user:group`, `uid`, or `uid:gid`.
     */
    User: Schema.optional(Schema.string),

    /** The working directory for the exec process inside the container. */
    WorkingDir: Schema.optional(Schema.string),
}) {}

export class ExecStartConfig extends Schema.Class<ExecStartConfig>()({
    /** Detach from the command. */
    Detach: Schema.optional(Schema.boolean),

    /** Allocate a pseudo-TTY. */
    Tty: Schema.optional(Schema.boolean),

    /** Initial console size, as an `[height, width]` array. */
    ConsoleSize: Schema.optional(Schema.nullable(Schema.array(Schema.number))),
}) {}

export class VolumePruneResponse extends Schema.Class<VolumePruneResponse>()({
    /** Volumes that were deleted */
    VolumesDeleted: Schema.optional(Schema.nullable(Schema.array(Schema.string))),

    /** Disk space reclaimed in bytes */
    SpaceReclaimed: Schema.optional(Schema.number),
}) {}

export class NetworkCreateResponse extends Schema.Class<NetworkCreateResponse>()({
    /** The ID of the created network. */
    Id: Schema.optional(Schema.string),
    Warning: Schema.optional(Schema.string),
}) {}

export class NetworkDisconnectRequest extends Schema.Class<NetworkDisconnectRequest>()({
    /** The ID or name of the container to disconnect from the network. */
    Container: Schema.optional(Schema.string),

    /** Force the container to disconnect from the network. */
    Force: Schema.optional(Schema.boolean),
}) {}

export class NetworkPruneResponse extends Schema.Class<NetworkPruneResponse>()({
    /** Networks that were deleted */
    NetworksDeleted: Schema.optional(Schema.nullable(Schema.array(Schema.string))),
}) {}

export class SwarmJoinRequest extends Schema.Class<SwarmJoinRequest>()({
    /**
     * Listen address used for inter-manager communication if the node gets
     * promoted to manager, as well as determining the networking interface used
     * for the VXLAN Tunnel Endpoint (VTEP).
     */
    ListenAddr: Schema.optional(Schema.string),

    /**
     * Externally reachable address advertised to other nodes. This can either
     * be an address/port combination in the form `192.168.1.1:4567`, or an
     * interface followed by a port number, like `eth0:4567`. If the port number
     * is omitted, the port number from the listen address is used. If
     * `AdvertiseAddr` is not specified, it will be automatically detected when
     * possible.
     */
    AdvertiseAddr: Schema.optional(Schema.string),

    /**
     * Address or interface to use for data path traffic (format:
     * `<ip|interface>`), for example, `192.168.1.1`, or an interface, like
     * `eth0`. If `DataPathAddr` is unspecified, the same address as
     * `AdvertiseAddr` is used.
     *
     * The `DataPathAddr` specifies the address that global scope network
     * drivers will publish towards other nodes in order to reach the containers
     * running on this node. Using this parameter it is possible to separate the
     * container data traffic from the management traffic of the cluster.
     */
    DataPathAddr: Schema.optional(Schema.string),

    /** Addresses of manager nodes already participating in the swarm. */
    RemoteAddrs: Schema.optional(Schema.nullable(Schema.array(Schema.string))),

    /** Secret token for joining this swarm. */
    JoinToken: Schema.optional(Schema.string),
}) {}

export class UnlockKeyResponse extends Schema.Class<UnlockKeyResponse>()({
    /** The swarm's unlock key. */
    UnlockKey: Schema.optional(Schema.string),
}) {}

export class SwarmUnlockRequest extends Schema.Class<SwarmUnlockRequest>()({
    /** The swarm's unlock key. */
    UnlockKey: Schema.optional(Schema.string),
}) {}

export class ServiceCreateResponse extends Schema.Class<ServiceCreateResponse>()({
    /** The ID of the created service. */
    ID: Schema.optional(Schema.string),

    /** Optional warning message */
    Warning: Schema.optional(Schema.string),
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
        Schema.nullable(
            Schema.array(
                Schema.nullable(
                    Schema.struct({ Path: Schema.optional(Schema.string), Weight: Schema.optional(Schema.number) })
                )
            )
        )
    ),

    /**
     * Limit read rate (bytes per second) from a device, in the form:
     *
     *     [{ Path: "device_path", Rate: rate }];
     */
    BlkioDeviceReadBps: Schema.optional(Schema.nullable(Schema.array(Schema.nullable(ThrottleDevice)))),

    /**
     * Limit write rate (bytes per second) to a device, in the form:
     *
     *     [{ Path: "device_path", Rate: rate }];
     */
    BlkioDeviceWriteBps: Schema.optional(Schema.nullable(Schema.array(Schema.nullable(ThrottleDevice)))),

    /**
     * Limit read rate (IO per second) from a device, in the form:
     *
     *     [{ Path: "device_path", Rate: rate }];
     */
    BlkioDeviceReadIOps: Schema.optional(Schema.nullable(Schema.array(Schema.nullable(ThrottleDevice)))),

    /**
     * Limit write rate (IO per second) to a device, in the form:
     *
     *     [{ Path: "device_path", Rate: rate }];
     */
    BlkioDeviceWriteIOps: Schema.optional(Schema.nullable(Schema.array(Schema.nullable(ThrottleDevice)))),

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
    Devices: Schema.optional(Schema.nullable(Schema.array(Schema.nullable(DeviceMapping)))),

    /** A list of cgroup rules to apply to the container */
    DeviceCgroupRules: Schema.optional(Schema.nullable(Schema.array(Schema.string))),

    /** A list of requests for devices to be sent to device drivers. */
    DeviceRequests: Schema.optional(Schema.nullable(Schema.array(Schema.nullable(DeviceRequest)))),

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
    Init: Schema.optional(Schema.boolean),

    /**
     * Tune a container's PIDs limit. Set `0` or `-1` for unlimited, or `null`
     * to not change.
     */
    PidsLimit: Schema.optional(Schema.number),

    /**
     * A list of resource limits to set in the container. For example:
     *
     *     { "Name": "nofile", "Soft": 1024, "Hard": 2048 }
     */
    Ulimits: Schema.optional(
        Schema.nullable(
            Schema.array(
                Schema.nullable(
                    Schema.struct({
                        /** Name of ulimit */
                        Name: Schema.optional(Schema.string),

                        /** Soft limit */
                        Soft: Schema.optional(Schema.number),

                        /** Hard limit */
                        Hard: Schema.optional(Schema.number),
                    })
                )
            )
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

export class ResourceObject extends Schema.Class<ResourceObject>()({
    NanoCPUs: Schema.optional(Schema.number),
    MemoryBytes: Schema.optional(Schema.number),
    GenericResources: Schema.optional(Schema.nullable(GenericResources)),
}) {}

export enum Health_Status {
    "NONE" = "none",
    "STARTING" = "starting",
    "HEALTHY" = "healthy",
    "UNHEALTHY" = "unhealthy",
}

export class Health extends Schema.Class<Health>()({
    /**
     * Status is one of `none`, `starting`, `healthy` or `unhealthy`
     *
     * - "none" Indicates there is no healthcheck
     * - "starting" Starting indicates that the container is not yet ready
     * - "healthy" Healthy indicates that the container is running correctly
     * - "unhealthy" Unhealthy indicates that the container has a problem
     */
    Status: Schema.optional(Schema.enums(Health_Status)),

    /** FailingStreak is the number of consecutive failures */
    FailingStreak: Schema.optional(Schema.number),

    /** Log contains the last few results (oldest first) */
    Log: Schema.optional(Schema.nullable(Schema.array(Schema.nullable(HealthcheckResult)))),
}) {}

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
    AttachStdout: Schema.optional(Schema.boolean),

    /** Whether to attach to `stderr`. */
    AttachStderr: Schema.optional(Schema.boolean),

    /**
     * An object mapping ports to an empty object in the form:
     *
     * `{"<port>/<tcp|udp|sctp>": {}}`
     */
    ExposedPorts: Schema.optional(Schema.nullable(Schema.record(Schema.string, Schema.nullable(Schema.struct({}))))),

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
    Env: Schema.optional(Schema.nullable(Schema.array(Schema.string))),

    /** Command to run specified as a string or an array of strings. */
    Cmd: Schema.optional(Schema.nullable(Schema.array(Schema.string))),
    Healthcheck: Schema.optional(Schema.nullable(HealthConfig)),

    /** Command is already escaped (Windows only) */
    ArgsEscaped: Schema.optional(Schema.boolean),

    /**
     * The name (or reference) of the image to use when creating the container,
     * or which was used when the container was created.
     */
    Image: Schema.optional(Schema.string),

    /**
     * An object mapping mount point paths inside the container to empty
     * objects.
     */
    Volumes: Schema.optional(Schema.nullable(Schema.record(Schema.string, Schema.nullable(Schema.struct({}))))),

    /** The working directory for commands to run in. */
    WorkingDir: Schema.optional(Schema.string),

    /**
     * The entry point for the container as a string or an array of strings.
     *
     * If the array consists of exactly one empty string (`[""]`) then the entry
     * point is reset to system default (i.e., the entry point used by docker
     * when there is no `ENTRYPOINT` instruction in the `Dockerfile`).
     */
    Entrypoint: Schema.optional(Schema.nullable(Schema.array(Schema.string))),

    /** Disable networking for the container. */
    NetworkDisabled: Schema.optional(Schema.boolean),

    /** MAC address of the container. */
    MacAddress: Schema.optional(Schema.string),

    /** `ONBUILD` metadata that were defined in the image's `Dockerfile`. */
    OnBuild: Schema.optional(Schema.nullable(Schema.array(Schema.string))),

    /** User-defined key/value metadata. */
    Labels: Schema.optional(Schema.nullable(Schema.record(Schema.string, Schema.string))),

    /** Signal to stop a container as a string or unsigned integer. */
    StopSignal: Schema.optional(Schema.string),

    /** Timeout to stop a container in seconds. */
    StopTimeout: Schema.optional(Schema.number),

    /** Shell for when `RUN`, `CMD`, and `ENTRYPOINT` uses a shell. */
    Shell: Schema.optional(Schema.nullable(Schema.array(Schema.string))),
}) {}

export const PortMap = Schema.record(Schema.string, Schema.nullable(Schema.array(Schema.nullable(PortBinding))));

export class FilesystemChange extends Schema.Class<FilesystemChange>()({
    /** Path to file or directory that has changed. */
    Path: Schema.string,
    Kind: Schema.nullable(Schema.enums(ChangeType)),
}) {}

export class IPAM extends Schema.Class<IPAM>()({
    /** Name of the IPAM driver to use. */
    Driver: Schema.optional(Schema.string),

    /**
     * List of IPAM configuration options, specified as a map:
     *
     *     {"Subnet": <CIDR>, "IPRange": <CIDR>, "Gateway": <IP address>, "AuxAddress": <device_name:IP address>}
     */
    Config: Schema.optional(Schema.nullable(Schema.array(Schema.nullable(IPAMConfig)))),

    /** Driver-specific options, specified as a map. */
    Options: Schema.optional(Schema.nullable(Schema.record(Schema.string, Schema.string))),
}) {}

export class BuildInfo extends Schema.Class<BuildInfo>()({
    id: Schema.optional(Schema.string),
    stream: Schema.optional(Schema.string),
    error: Schema.optional(Schema.string),
    errorDetail: Schema.optional(Schema.nullable(ErrorDetail)),
    status: Schema.optional(Schema.string),
    progress: Schema.optional(Schema.string),
    progressDetail: Schema.optional(Schema.nullable(ProgressDetail)),
    aux: Schema.optional(Schema.nullable(ImageID)),
}) {}

export class CreateImageInfo extends Schema.Class<CreateImageInfo>()({
    id: Schema.optional(Schema.string),
    error: Schema.optional(Schema.string),
    errorDetail: Schema.optional(Schema.nullable(ErrorDetail)),
    status: Schema.optional(Schema.string),
    progress: Schema.optional(Schema.string),
    progressDetail: Schema.optional(Schema.nullable(ProgressDetail)),
}) {}

export class PushImageInfo extends Schema.Class<PushImageInfo>()({
    error: Schema.optional(Schema.string),
    status: Schema.optional(Schema.string),
    progress: Schema.optional(Schema.string),
    progressDetail: Schema.optional(Schema.nullable(ProgressDetail)),
}) {}

export class EndpointSettings extends Schema.Class<EndpointSettings>()({
    IPAMConfig: Schema.optional(Schema.nullable(EndpointIPAMConfig)),
    Links: Schema.optional(Schema.nullable(Schema.array(Schema.string))),
    Aliases: Schema.optional(Schema.nullable(Schema.array(Schema.string))),

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

    /** MAC address for the endpoint on this network. */
    MacAddress: Schema.optional(Schema.string),

    /**
     * DriverOpts is a mapping of driver options and values. These options are
     * passed directly to the driver and are driver specific.
     */
    DriverOpts: Schema.optional(Schema.nullable(Schema.record(Schema.string, Schema.string))),
}) {}

export enum Plugin_Config_Interface_ProtocolScheme {
    "NONE" = "",
    "MOBY.PLUGINS.HTTP/V1" = "moby.plugins.http/v1",
}

export class Plugin extends Schema.Class<Plugin>()({
    Id: Schema.optional(Schema.string),
    Name: Schema.string,

    /**
     * True if the plugin is running. False if the plugin is not running, only
     * installed.
     */
    Enabled: Schema.boolean,

    /** Settings that can be modified by users. */
    Settings: Schema.nullable(
        Schema.struct({
            Mounts: Schema.nullable(Schema.array(Schema.nullable(PluginMount))),
            Env: Schema.nullable(Schema.array(Schema.string)),
            Args: Schema.nullable(Schema.array(Schema.string)),
            Devices: Schema.nullable(Schema.array(Schema.nullable(PluginDevice))),
        })
    ),

    /** Plugin remote reference used to push/pull the plugin */
    PluginReference: Schema.optional(Schema.string),

    /** The config of a plugin. */
    Config: Schema.nullable(
        Schema.struct({
            /** Docker Version used to create the plugin */
            DockerVersion: Schema.optional(Schema.string),
            Description: Schema.string,
            Documentation: Schema.string,

            /** The interface between Docker and the plugin */
            Interface: Schema.nullable(
                Schema.struct({
                    Types: Schema.nullable(Schema.array(Schema.nullable(PluginInterfaceType))),
                    Socket: Schema.string,

                    /** Protocol to use for clients connecting to the plugin. */
                    ProtocolScheme: Schema.optional(Schema.enums(Plugin_Config_Interface_ProtocolScheme)),
                })
            ),
            Entrypoint: Schema.nullable(Schema.array(Schema.string)),
            WorkDir: Schema.string,
            User: Schema.optional(
                Schema.nullable(
                    Schema.struct({ UID: Schema.optional(Schema.number), GID: Schema.optional(Schema.number) })
                )
            ),
            Network: Schema.nullable(Schema.struct({ Type: Schema.string })),
            Linux: Schema.nullable(
                Schema.struct({
                    Capabilities: Schema.nullable(Schema.array(Schema.string)),
                    AllowAllDevices: Schema.boolean,
                    Devices: Schema.nullable(Schema.array(Schema.nullable(PluginDevice))),
                })
            ),
            PropagatedMount: Schema.string,
            IpcHost: Schema.boolean,
            PidHost: Schema.boolean,
            Mounts: Schema.nullable(Schema.array(Schema.nullable(PluginMount))),
            Env: Schema.nullable(Schema.array(Schema.nullable(PluginEnv))),
            Args: Schema.nullable(
                Schema.struct({
                    Name: Schema.string,
                    Description: Schema.string,
                    Settable: Schema.nullable(Schema.array(Schema.string)),
                    Value: Schema.nullable(Schema.array(Schema.string)),
                })
            ),
            rootfs: Schema.optional(
                Schema.nullable(
                    Schema.struct({
                        type: Schema.optional(Schema.string),
                        diff_ids: Schema.optional(Schema.nullable(Schema.array(Schema.string))),
                    })
                )
            ),
        })
    ),
}) {}

export class NodeStatus extends Schema.Class<NodeStatus>()({
    State: Schema.optional(Schema.nullable(Schema.enums(NodeState))),
    Message: Schema.optional(Schema.string),

    /** IP address of the node. */
    Addr: Schema.optional(Schema.string),
}) {}

export class ManagerStatus extends Schema.Class<ManagerStatus>()({
    Leader: Schema.optional(Schema.boolean),
    Reachability: Schema.optional(Schema.nullable(Schema.enums(Reachability))),

    /** The IP address and port at which the manager is reachable. */
    Addr: Schema.optional(Schema.string),
}) {}

export class ClusterInfo extends Schema.Class<ClusterInfo>()({
    /** The ID of the swarm. */
    ID: Schema.optional(Schema.string),
    Version: Schema.optional(Schema.nullable(ObjectVersion)),

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
    Spec: Schema.optional(Schema.nullable(SwarmSpec)),
    TLSInfo: Schema.optional(Schema.nullable(TLSInfo)),

    /** Whether there is currently a root CA rotation in progress for the swarm */
    RootRotationInProgress: Schema.optional(Schema.boolean),

    /**
     * DataPathPort specifies the data path port number for data traffic.
     * Acceptable port range is 1024 to 49151. If no port is set or is set to 0,
     * the default port (4789) is used.
     */
    DataPathPort: Schema.optional(Schema.number),

    /**
     * Default Address Pool specifies default subnet pools for global scope
     * networks.
     */
    DefaultAddrPool: Schema.optional(Schema.nullable(Schema.array(Schema.string))),

    /**
     * SubnetSize specifies the subnet size of the networks created from the
     * default subnet pool.
     */
    SubnetSize: Schema.optional(Schema.number),
}) {}

export enum EndpointSpec_Mode {
    "VIP" = "vip",
    "DNSRR" = "dnsrr",
}

export class EndpointSpec extends Schema.Class<EndpointSpec>()({
    /** The mode of resolution to use for internal load balancing between tasks. */
    Mode: Schema.optional(Schema.enums(EndpointSpec_Mode)),

    /**
     * List of exposed ports that this service is accessible on from the
     * outside. Ports can only be provided if `vip` resolution mode is used.
     */
    Ports: Schema.optional(Schema.nullable(Schema.array(Schema.nullable(EndpointPortConfig)))),
}) {}

export class SecretSpec extends Schema.Class<SecretSpec>()({
    /** User-defined name of the secret. */
    Name: Schema.optional(Schema.string),

    /** User-defined key/value metadata. */
    Labels: Schema.optional(Schema.nullable(Schema.record(Schema.string, Schema.string))),

    /**
     * Base64-url-safe-encoded ([RFC
     * 4648](https://tools.ietf.org/html/rfc4648#section-5)) data to store as
     * secret.
     *
     * This field is only used to _create_ a secret, and is not returned by
     * other endpoints.
     */
    Data: Schema.optional(Schema.string),
    Driver: Schema.optional(Schema.nullable(Driver)),
    Templating: Schema.optional(Schema.nullable(Driver)),
}) {}

export class ConfigSpec extends Schema.Class<ConfigSpec>()({
    /** User-defined name of the config. */
    Name: Schema.optional(Schema.string),

    /** User-defined key/value metadata. */
    Labels: Schema.optional(Schema.nullable(Schema.record(Schema.string, Schema.string))),

    /**
     * Base64-url-safe-encoded ([RFC
     * 4648](https://tools.ietf.org/html/rfc4648#section-5)) config data.
     */
    Data: Schema.optional(Schema.string),
    Templating: Schema.optional(Schema.nullable(Driver)),
}) {}

export class ContainerWaitResponse extends Schema.Class<ContainerWaitResponse>()({
    /** Exit code of the container */
    StatusCode: Schema.number,
    Error: Schema.optional(Schema.nullable(ContainerWaitExitError)),
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
     * Nondistributable artifacts typically have restrictions> On how and where
     * they can be distributed and shared. Only use this> Feature to push
     * artifacts to private registries and ensure that you are> In compliance
     * with any terms that cover redistributing nondistributable> Artifacts.
     */
    AllowNondistributableArtifactsCIDRs: Schema.optional(Schema.nullable(Schema.array(Schema.string))),

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
     * Nondistributable artifacts typically have restrictions> On how and where
     * they can be distributed and shared. Only use this> Feature to push
     * artifacts to private registries and ensure that you are> In compliance
     * with any terms that cover redistributing nondistributable> Artifacts.
     */
    AllowNondistributableArtifactsHostnames: Schema.optional(Schema.nullable(Schema.array(Schema.string))),

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
     * `false`.> **Warning**: Using this option can be useful when running a
     * local> Registry, but introduces security vulnerabilities. This option
     * should> Therefore ONLY be used for testing purposes. For increased
     * security,> Users should add their CA to their system's list of trusted
     * CAs instead> Of enabling this option.
     */
    InsecureRegistryCIDRs: Schema.optional(Schema.nullable(Schema.array(Schema.string))),
    IndexConfigs: Schema.optional(Schema.nullable(Schema.record(Schema.string, Schema.nullable(IndexInfo)))),

    /**
     * List of registry URLs that act as a mirror for the official (`docker.io`)
     * registry.
     */
    Mirrors: Schema.optional(Schema.nullable(Schema.array(Schema.string))),
}) {}

export enum EventMessage_Type {
    "BUILDER" = "builder",
    "CONFIG" = "config",
    "CONTAINER" = "container",
    "DAEMON" = "daemon",
    "IMAGE" = "image",
    "NETWORK" = "network",
    "NODE" = "node",
    "PLUGIN" = "plugin",
    "SECRET" = "secret",
    "SERVICE" = "service",
    "VOLUME" = "volume",
}

export enum EventMessage_scope {
    "LOCAL" = "local",
    "SWARM" = "swarm",
}

export class EventMessage extends Schema.Class<EventMessage>()({
    /** The type of object emitting the event */
    Type: Schema.optional(Schema.enums(EventMessage_Type)),

    /** The type of event */
    Action: Schema.optional(Schema.string),
    Actor: Schema.optional(Schema.nullable(EventActor)),

    /**
     * Scope of the event. Engine events are `local` scope. Cluster (Swarm)
     * events are `swarm` scope.
     */
    scope: Schema.optional(Schema.enums(EventMessage_scope)),

    /** Timestamp of event */
    time: Schema.optional(Schema.number),

    /** Timestamp of event, with nanosecond accuracy */
    timeNano: Schema.optional(Schema.number),
}) {}

export class DistributionInspect extends Schema.Class<DistributionInspect>()({
    Descriptor: Schema.nullable(OCIDescriptor),

    /** An array containing all platforms supported by the image. */
    Platforms: Schema.nullable(Schema.array(Schema.nullable(OCIPlatform))),
}) {}

export enum ClusterVolumeSpec_AccessMode_Scope {
    "SINGLE" = "single",
    "MULTI" = "multi",
}

export enum ClusterVolumeSpec_AccessMode_Sharing {
    "NONE" = "none",
    "READONLY" = "readonly",
    "ONEWRITER" = "onewriter",
    "ALL" = "all",
}

export enum ClusterVolumeSpec_AccessMode_Availability {
    "ACTIVE" = "active",
    "PAUSE" = "pause",
    "DRAIN" = "drain",
}

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
        Schema.nullable(
            Schema.struct({
                /**
                 * The set of nodes this volume can be used on at one time.
                 *
                 * - `single` The volume may only be scheduled to one node at a
                 *   time.
                 * - `multi` the volume may be scheduled to any supported number
                 *   of nodes at a time.
                 */
                Scope: Schema.optional(Schema.enums(ClusterVolumeSpec_AccessMode_Scope)),

                /**
                 * The number and way that different tasks can use this volume
                 * at one time.
                 *
                 * - `none` The volume may only be used by one task at a time.
                 * - `readonly` The volume may be used by any number of tasks, but
                 *   they all must mount the volume as readonly
                 * - `onewriter` The volume may be used by any number of tasks,
                 *   but only one may mount it as read/write.
                 * - `all` The volume may have any number of readers and writers.
                 */
                Sharing: Schema.optional(Schema.enums(ClusterVolumeSpec_AccessMode_Sharing)),

                /**
                 * Options for using this volume as a Mount-type volume.
                 *
                 *     Either MountVolume or BlockVolume, but not both, must be
                 *     present.
                 *
                 * Properties: FsType: type: "string" description: | Specifies
                 * the filesystem type for the mount volume. Optional.
                 * MountFlags: type: "array" description: | Flags to pass when
                 * mounting the volume. Optional. items: type: "string"
                 * BlockVolume: type: "object" description: | Options for using
                 * this volume as a Block-type volume. Intentionally empty.
                 */
                MountVolume: Schema.optional(Schema.nullable(Schema.struct({}))),

                /**
                 * Swarm Secrets that are passed to the CSI storage plugin when
                 * operating on this volume.
                 */
                Secrets: Schema.optional(
                    Schema.nullable(
                        Schema.array(
                            Schema.nullable(
                                Schema.struct({
                                    /**
                                     * Key is the name of the key of the
                                     * key-value pair passed to the plugin.
                                     */
                                    Key: Schema.optional(Schema.string),

                                    /**
                                     * Secret is the swarm Secret object from
                                     * which to read data. This can be a Secret
                                     * name or ID. The Secret data is retrieved
                                     * by swarm and used as the value of the
                                     * key-value pair passed to the plugin.
                                     */
                                    Secret: Schema.optional(Schema.string),
                                })
                            )
                        )
                    )
                ),

                /**
                 * Requirements for the accessible topology of the volume. These
                 * fields are optional. For an in-depth description of what
                 * these fields mean, see the CSI specification.
                 */
                AccessibilityRequirements: Schema.optional(
                    Schema.nullable(
                        Schema.struct({
                            /**
                             * A list of required topologies, at least one of
                             * which the volume must be accessible from.
                             */
                            Requisite: Schema.optional(Schema.nullable(Schema.array(Schema.nullable(Topology)))),

                            /**
                             * A list of topologies that the volume should
                             * attempt to be provisioned in.
                             */
                            Preferred: Schema.optional(Schema.nullable(Schema.array(Schema.nullable(Topology)))),
                        })
                    )
                ),

                /**
                 * The desired capacity that the volume should be created with.
                 * If empty, the plugin will decide the capacity.
                 */
                CapacityRange: Schema.optional(
                    Schema.nullable(
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
                    )
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
                Availability: Schema.optional(Schema.enums(ClusterVolumeSpec_AccessMode_Availability)),
            })
        )
    ),
}) {}

export class ImagePruneResponse extends Schema.Class<ImagePruneResponse>()({
    /** Images that were deleted */
    ImagesDeleted: Schema.optional(Schema.nullable(Schema.array(Schema.nullable(ImageDeleteResponseItem)))),

    /** Disk space reclaimed in bytes */
    SpaceReclaimed: Schema.optional(Schema.number),
}) {}

export class ExecInspectResponse extends Schema.Class<ExecInspectResponse>()({
    CanRemove: Schema.optional(Schema.boolean),
    DetachKeys: Schema.optional(Schema.string),
    ID: Schema.optional(Schema.string),
    Running: Schema.optional(Schema.boolean),
    ExitCode: Schema.optional(Schema.number),
    ProcessConfig: Schema.optional(Schema.nullable(ProcessConfig)),
    OpenStdin: Schema.optional(Schema.boolean),
    OpenStderr: Schema.optional(Schema.boolean),
    OpenStdout: Schema.optional(Schema.boolean),
    ContainerID: Schema.optional(Schema.string),

    /** The system process ID for the exec process. */
    Pid: Schema.optional(Schema.number),
}) {}

export class SwarmInitRequest extends Schema.Class<SwarmInitRequest>()({
    /**
     * Listen address used for inter-manager communication, as well as
     * determining the networking interface used for the VXLAN Tunnel Endpoint
     * (VTEP). This can either be an address/port combination in the form
     * `192.168.1.1:4567`, or an interface followed by a port number, like
     * `eth0:4567`. If the port number is omitted, the default swarm listening
     * port is used.
     */
    ListenAddr: Schema.optional(Schema.string),

    /**
     * Externally reachable address advertised to other nodes. This can either
     * be an address/port combination in the form `192.168.1.1:4567`, or an
     * interface followed by a port number, like `eth0:4567`. If the port number
     * is omitted, the port number from the listen address is used. If
     * `AdvertiseAddr` is not specified, it will be automatically detected when
     * possible.
     */
    AdvertiseAddr: Schema.optional(Schema.string),

    /**
     * Address or interface to use for data path traffic (format:
     * `<ip|interface>`), for example, `192.168.1.1`, or an interface, like
     * `eth0`. If `DataPathAddr` is unspecified, the same address as
     * `AdvertiseAddr` is used.
     *
     * The `DataPathAddr` specifies the address that global scope network
     * drivers will publish towards other nodes in order to reach the containers
     * running on this node. Using this parameter it is possible to separate the
     * container data traffic from the management traffic of the cluster.
     */
    DataPathAddr: Schema.optional(Schema.string),

    /**
     * DataPathPort specifies the data path port number for data traffic.
     * Acceptable port range is 1024 to 49151. if no port is set or is set to 0,
     * default port 4789 will be used.
     */
    DataPathPort: Schema.optional(Schema.number),

    /**
     * Default Address Pool specifies default subnet pools for global scope
     * networks.
     */
    DefaultAddrPool: Schema.optional(Schema.nullable(Schema.array(Schema.string))),

    /** Force creation of a new swarm. */
    ForceNewCluster: Schema.optional(Schema.boolean),

    /**
     * SubnetSize specifies the subnet size of the networks created from the
     * default subnet pool.
     */
    SubnetSize: Schema.optional(Schema.number),
    Spec: Schema.optional(Schema.nullable(SwarmSpec)),
}) {}

export enum HostConfig_1_LogConfig_Type {
    "JSON-FILE" = "json-file",
    "SYSLOG" = "syslog",
    "JOURNALD" = "journald",
    "GELF" = "gelf",
    "FLUENTD" = "fluentd",
    "AWSLOGS" = "awslogs",
    "SPLUNK" = "splunk",
    "ETWLOGS" = "etwlogs",
    "NONE" = "none",
}

export enum HostConfig_1_CgroupnsMode {
    "PRIVATE" = "private",
    "HOST" = "host",
}

export enum HostConfig_1_Isolation {
    "UNKNOWN" = "",
    "DEFAULT" = "default",
    "PROCESS" = "process",
    "HYPERV" = "hyperv",
}

export class HostConfig_0 extends Resources.extend<HostConfig_0>()({}) {}

export class HostConfig_1 extends Schema.Class<HostConfig_1>()({
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
    Binds: Schema.optional(Schema.nullable(Schema.array(Schema.string))),

    /** Path to a file where the container ID is written */
    ContainerIDFile: Schema.optional(Schema.string),

    /** The logging configuration for this container */
    LogConfig: Schema.optional(
        Schema.nullable(
            Schema.struct({
                Type: Schema.optional(Schema.enums(HostConfig_1_LogConfig_Type)),
                Config: Schema.optional(Schema.nullable(Schema.record(Schema.string, Schema.string))),
            })
        )
    ),

    /**
     * Network mode to use for this container. Supported standard values are:
     * `bridge`, `host`, `none`, and `container:<name|id>`. Any other value is
     * taken as a custom network's name to which this container should connect
     * to.
     */
    NetworkMode: Schema.optional(Schema.string),
    PortBindings: Schema.optional(Schema.nullable(PortMap)),
    RestartPolicy: Schema.optional(Schema.nullable(RestartPolicy)),

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
    VolumesFrom: Schema.optional(Schema.nullable(Schema.array(Schema.string))),

    /** Specification for mounts to be added to the container. */
    Mounts: Schema.optional(Schema.nullable(Schema.array(Schema.nullable(Mount)))),

    /** Initial console size, as an `[height, width]` array. */
    ConsoleSize: Schema.optional(Schema.nullable(Schema.array(Schema.number))),

    /**
     * Arbitrary non-identifying metadata attached to container and provided to
     * the runtime when the container is started.
     */
    Annotations: Schema.optional(Schema.nullable(Schema.record(Schema.string, Schema.string))),

    /**
     * A list of kernel capabilities to add to the container. Conflicts with
     * option 'Capabilities'.
     */
    CapAdd: Schema.optional(Schema.nullable(Schema.array(Schema.string))),

    /**
     * A list of kernel capabilities to drop from the container. Conflicts with
     * option 'Capabilities'.
     */
    CapDrop: Schema.optional(Schema.nullable(Schema.array(Schema.string))),

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
    CgroupnsMode: Schema.optional(Schema.enums(HostConfig_1_CgroupnsMode)),

    /** A list of DNS servers for the container to use. */
    Dns: Schema.optional(Schema.nullable(Schema.array(Schema.string))),

    /** A list of DNS options. */
    DnsOptions: Schema.optional(Schema.nullable(Schema.array(Schema.string))),

    /** A list of DNS search domains. */
    DnsSearch: Schema.optional(Schema.nullable(Schema.array(Schema.string))),

    /**
     * A list of hostnames/IP mappings to add to the container's `/etc/hosts`
     * file. Specified in the form `["hostname:IP"]`.
     */
    ExtraHosts: Schema.optional(Schema.nullable(Schema.array(Schema.string))),

    /** A list of additional groups that the container process will run as. */
    GroupAdd: Schema.optional(Schema.nullable(Schema.array(Schema.string))),

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
    Links: Schema.optional(Schema.nullable(Schema.array(Schema.string))),

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
    SecurityOpt: Schema.optional(Schema.nullable(Schema.array(Schema.string))),

    /**
     * Storage driver options for this container, in the form `{"size":
     * "120G"}`.
     */
    StorageOpt: Schema.optional(Schema.nullable(Schema.record(Schema.string, Schema.string))),

    /**
     * A map of container directories which should be replaced by tmpfs mounts,
     * and their corresponding mount options. For example:
     *
     *     { "/run": "rw,noexec,nosuid,size=65536k" }
     */
    Tmpfs: Schema.optional(Schema.nullable(Schema.record(Schema.string, Schema.string))),

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
    Sysctls: Schema.optional(Schema.nullable(Schema.record(Schema.string, Schema.string))),

    /** Runtime to use with this container. */
    Runtime: Schema.optional(Schema.string),

    /** Isolation technology of the container. (Windows only) */
    Isolation: Schema.optional(Schema.enums(HostConfig_1_Isolation)),

    /**
     * The list of paths to be masked inside the container (this overrides the
     * default set of paths).
     */
    MaskedPaths: Schema.optional(Schema.nullable(Schema.array(Schema.string))),

    /**
     * The list of paths to be set as read-only inside the container (this
     * overrides the default set of paths).
     */
    ReadonlyPaths: Schema.optional(Schema.nullable(Schema.array(Schema.string))),
}) {}

export class HostConfig extends HostConfig_1.extend<HostConfig>()({}) {}

export class NetworkingConfig extends Schema.Class<NetworkingConfig>()({
    /** A mapping of network name to endpoint configuration for that network. */
    EndpointsConfig: Schema.optional(Schema.nullable(Schema.record(Schema.string, Schema.nullable(EndpointSettings)))),
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
    Ports: Schema.optional(Schema.nullable(PortMap)),

    /** SandboxKey identifies the sandbox */
    SandboxKey: Schema.optional(Schema.string),
    SecondaryIPAddresses: Schema.optional(Schema.nullable(Schema.array(Schema.nullable(Address)))),
    SecondaryIPv6Addresses: Schema.optional(Schema.nullable(Schema.array(Schema.nullable(Address)))),

    /**
     * EndpointID uniquely represents a service endpoint in a Sandbox.<p><br
     * /></p>> **Deprecated**: This field is only propagated when attached to
     * the> Default "bridge" network. Use the information from the "bridge"
     * network> Inside the `Networks` map instead, which contains the same
     * information.> This field was deprecated in Docker 1.9 and is scheduled to
     * be removed in> Docker 17.12.0
     */
    EndpointID: Schema.optional(Schema.string),

    /**
     * Gateway address for the default "bridge" network.<p><br /></p>>
     * **Deprecated**: This field is only propagated when attached to the>
     * Default "bridge" network. Use the information from the "bridge" network>
     * Inside the `Networks` map instead, which contains the same information.>
     * This field was deprecated in Docker 1.9 and is scheduled to be removed
     * in> Docker 17.12.0
     */
    Gateway: Schema.optional(Schema.string),

    /**
     * Global IPv6 address for the default "bridge" network.<p><br /></p>>
     * **Deprecated**: This field is only propagated when attached to the>
     * Default "bridge" network. Use the information from the "bridge" network>
     * Inside the `Networks` map instead, which contains the same information.>
     * This field was deprecated in Docker 1.9 and is scheduled to be removed
     * in> Docker 17.12.0
     */
    GlobalIPv6Address: Schema.optional(Schema.string),

    /**
     * Mask length of the global IPv6 address.<p><br /></p>> **Deprecated**:
     * This field is only propagated when attached to the> Default "bridge"
     * network. Use the information from the "bridge" network> Inside the
     * `Networks` map instead, which contains the same information.> This field
     * was deprecated in Docker 1.9 and is scheduled to be removed in> Docker
     * 17.12.0
     */
    GlobalIPv6PrefixLen: Schema.optional(Schema.number),

    /**
     * IPv4 address for the default "bridge" network.<p><br /></p>>
     * **Deprecated**: This field is only propagated when attached to the>
     * Default "bridge" network. Use the information from the "bridge" network>
     * Inside the `Networks` map instead, which contains the same information.>
     * This field was deprecated in Docker 1.9 and is scheduled to be removed
     * in> Docker 17.12.0
     */
    IPAddress: Schema.optional(Schema.string),

    /**
     * Mask length of the IPv4 address.<p><br /></p>> **Deprecated**: This field
     * is only propagated when attached to the> Default "bridge" network. Use
     * the information from the "bridge" network> Inside the `Networks` map
     * instead, which contains the same information.> This field was deprecated
     * in Docker 1.9 and is scheduled to be removed in> Docker 17.12.0
     */
    IPPrefixLen: Schema.optional(Schema.number),

    /**
     * IPv6 gateway address for this network.<p><br /></p>> **Deprecated**: This
     * field is only propagated when attached to the> Default "bridge" network.
     * Use the information from the "bridge" network> Inside the `Networks` map
     * instead, which contains the same information.> This field was deprecated
     * in Docker 1.9 and is scheduled to be removed in> Docker 17.12.0
     */
    IPv6Gateway: Schema.optional(Schema.string),

    /**
     * MAC address for the container on the default "bridge" network.<p><br
     * /></p>> **Deprecated**: This field is only propagated when attached to
     * the> Default "bridge" network. Use the information from the "bridge"
     * network> Inside the `Networks` map instead, which contains the same
     * information.> This field was deprecated in Docker 1.9 and is scheduled to
     * be removed in> Docker 17.12.0
     */
    MacAddress: Schema.optional(Schema.string),

    /** Information about all networks that the container is connected to. */
    Networks: Schema.optional(Schema.nullable(Schema.record(Schema.string, Schema.nullable(EndpointSettings)))),
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
    RepoTags: Schema.optional(Schema.nullable(Schema.array(Schema.string))),

    /**
     * List of content-addressable digests of locally available image manifests
     * that the image is referenced from. Multiple manifests can refer to the
     * same image.
     *
     * These digests are usually only available if the image was either pulled
     * from a registry, or if the image was pushed to a registry, which is when
     * the manifest is generated and its digest calculated.
     */
    RepoDigests: Schema.optional(Schema.nullable(Schema.array(Schema.string))),

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
     */
    Container: Schema.optional(Schema.string),
    ContainerConfig: Schema.optional(Schema.nullable(ContainerConfig)),

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
    Config: Schema.optional(Schema.nullable(ContainerConfig)),

    /** Hardware CPU architecture that the image runs on. */
    Architecture: Schema.optional(Schema.string),

    /** CPU architecture variant (presently ARM-only). */
    Variant: Schema.optional(Schema.string),

    /** Operating System the image is built to run on. */
    Os: Schema.optional(Schema.string),

    /**
     * Operating System version the image is built to run on (especially for
     * Windows).
     */
    OsVersion: Schema.optional(Schema.string),

    /** Total size of the image including all layers it is composed of. */
    Size: Schema.optional(Schema.number),

    /**
     * Total size of the image including all layers it is composed of.
     *
     * In versions of Docker before v1.10, this field was calculated from the
     * image itself and all of its parent images. Images are now stored
     * self-contained, and no longer use a parent-chain, making this field an
     * equivalent of the Size field.> **Deprecated**: this field is kept for
     * backward compatibility, but> Will be removed in API v1.44.
     */
    VirtualSize: Schema.optional(Schema.number),
    GraphDriver: Schema.optional(Schema.nullable(GraphDriverData)),

    /** Information about the image's RootFS, including the layer IDs. */
    RootFS: Schema.optional(
        Schema.nullable(
            Schema.struct({
                Type: Schema.string,
                Layers: Schema.optional(Schema.nullable(Schema.array(Schema.string))),
            })
        )
    ),

    /**
     * Additional metadata of the image in the local cache. This information is
     * local to the daemon, and not part of the image itself.
     */
    Metadata: Schema.optional(
        Schema.nullable(
            Schema.struct({
                /**
                 * Date and time at which the image was last tagged in [RFC
                 * 3339](https://www.ietf.org/rfc/rfc3339.txt) format with
                 * nano-seconds.
                 *
                 * This information is only available if the image was tagged
                 * locally, and omitted otherwise.
                 */
                LastTagTime: Schema.optional(Schema.string),
            })
        )
    ),
}) {}

export class VolumeCreateOptions extends Schema.Class<VolumeCreateOptions>()({
    /** The new volume's name. If not specified, Docker generates a name. */
    Name: Schema.optional(Schema.string),

    /** Name of the volume driver to use. */
    Driver: Schema.optional(Schema.string),

    /**
     * A mapping of driver options and values. These options are passed directly
     * to the driver and are driver specific.
     */
    DriverOpts: Schema.optional(Schema.nullable(Schema.record(Schema.string, Schema.string))),

    /** User-defined key/value metadata. */
    Labels: Schema.optional(Schema.nullable(Schema.record(Schema.string, Schema.string))),
    ClusterVolumeSpec: Schema.optional(Schema.nullable(ClusterVolumeSpec)),
}) {}

export class Network extends Schema.Class<Network>()({
    Name: Schema.optional(Schema.string),
    Id: Schema.optional(Schema.string),
    Created: Schema.optional(Schema.string),
    Scope: Schema.optional(Schema.string),
    Driver: Schema.optional(Schema.string),
    EnableIPv6: Schema.optional(Schema.boolean),
    IPAM: Schema.optional(Schema.nullable(IPAM)),
    Internal: Schema.optional(Schema.boolean),
    Attachable: Schema.optional(Schema.boolean),
    Ingress: Schema.optional(Schema.boolean),
    Containers: Schema.optional(Schema.nullable(Schema.record(Schema.string, Schema.nullable(NetworkContainer)))),
    Options: Schema.optional(Schema.nullable(Schema.record(Schema.string, Schema.string))),
    Labels: Schema.optional(Schema.nullable(Schema.record(Schema.string, Schema.string))),
}) {}

export class NodeDescription extends Schema.Class<NodeDescription>()({
    Hostname: Schema.optional(Schema.string),
    Platform: Schema.optional(Schema.nullable(Platform)),
    Resources: Schema.optional(Schema.nullable(ResourceObject)),
    Engine: Schema.optional(Schema.nullable(EngineDescription)),
    TLSInfo: Schema.optional(Schema.nullable(TLSInfo)),
}) {}

export class Swarm_0 extends ClusterInfo.extend<Swarm_0>()({}) {}

export class Swarm_1 extends Schema.Class<Swarm_1>()({ JoinTokens: Schema.optional(Schema.nullable(JoinTokens)) }) {}

export class Swarm extends Swarm_1.extend<Swarm>()({}) {}

export enum TaskSpec_ContainerSpec_Isolation {
    "UNKNOWN" = "",
    "DEFAULT" = "default",
    "PROCESS" = "process",
    "HYPERV" = "hyperv",
}

export enum TaskSpec_RestartPolicy_Condition {
    "NONE" = "none",
    "ON-FAILURE" = "on-failure",
    "ANY" = "any",
}

export class TaskSpec extends Schema.Class<TaskSpec>()({
    /**
     * Plugin spec for the service. _(Experimental release only.)_<p><br /></p>>
     * **Note**: ContainerSpec, NetworkAttachmentSpec, and PluginSpec are>
     * Mutually exclusive. PluginSpec is only used when the Runtime field is
     * set> To `plugin`. NetworkAttachmentSpec is used when the Runtime field is
     * set> To `attachment`.
     */
    PluginSpec: Schema.optional(
        Schema.nullable(
            Schema.struct({
                /** The name or 'alias' to use for the plugin. */
                Name: Schema.optional(Schema.string),

                /** The plugin image reference to use. */
                Remote: Schema.optional(Schema.string),

                /** Disable the plugin once scheduled. */
                Disabled: Schema.optional(Schema.boolean),
                PluginPrivilege: Schema.optional(Schema.nullable(Schema.array(Schema.nullable(PluginPrivilege)))),
            })
        )
    ),

    /**
     * Container spec for the service.<p><br /></p>> **Note**: ContainerSpec,
     * NetworkAttachmentSpec, and PluginSpec are> Mutually exclusive. PluginSpec
     * is only used when the Runtime field is set> To `plugin`.
     * NetworkAttachmentSpec is used when the Runtime field is set> To
     * `attachment`.
     */
    ContainerSpec: Schema.optional(
        Schema.nullable(
            Schema.struct({
                /** The image name to use for the container */
                Image: Schema.optional(Schema.string),

                /** User-defined key/value data. */
                Labels: Schema.optional(Schema.nullable(Schema.record(Schema.string, Schema.string))),

                /** The command to be run in the image. */
                Command: Schema.optional(Schema.nullable(Schema.array(Schema.string))),

                /** Arguments to the command. */
                Args: Schema.optional(Schema.nullable(Schema.array(Schema.string))),

                /**
                 * The hostname to use for the container, as a valid [RFC
                 * 1123](https://tools.ietf.org/html/rfc1123) hostname.
                 */
                Hostname: Schema.optional(Schema.string),

                /** A list of environment variables in the form `VAR=value`. */
                Env: Schema.optional(Schema.nullable(Schema.array(Schema.string))),

                /** The working directory for commands to run in. */
                Dir: Schema.optional(Schema.string),

                /** The user inside the container. */
                User: Schema.optional(Schema.string),

                /**
                 * A list of additional groups that the container process will
                 * run as.
                 */
                Groups: Schema.optional(Schema.nullable(Schema.array(Schema.string))),

                /** Security options for the container */
                Privileges: Schema.optional(
                    Schema.nullable(
                        Schema.struct({
                            /**
                             * CredentialSpec for managed service account
                             * (Windows only)
                             */
                            CredentialSpec: Schema.optional(
                                Schema.nullable(
                                    Schema.struct({
                                        /**
                                         * Load credential spec from a Swarm
                                         * Config with the given ID. The
                                         * specified config must also be present
                                         * in the Configs field with the Runtime
                                         * property set.<p><br /></p>> **Note**:
                                         * `CredentialSpec.File`,
                                         * `CredentialSpec.Registry`, and>
                                         * `CredentialSpec.Config` are mutually>
                                         * Exclusive.
                                         */
                                        Config: Schema.optional(Schema.string),

                                        /**
                                         * Load credential spec from this file.
                                         * The file is read by the daemon, and
                                         * must be present in the
                                         * `CredentialSpecs` subdirectory in the
                                         * docker data directory, which defaults
                                         * to `C:\ProgramData\Docker\` on
                                         * Windows.
                                         *
                                         * For example, specifying `spec.json`
                                         * loads
                                         * `C:\ProgramData\Docker\CredentialSpecs\spec.json`.<p><br
                                         * /></p>> **Note**:
                                         * `CredentialSpec.File`,
                                         * `CredentialSpec.Registry`, and>
                                         * `CredentialSpec.Config` are mutually>
                                         * Exclusive.
                                         */
                                        File: Schema.optional(Schema.string),

                                        /**
                                         * Load credential spec from this value
                                         * in the Windows registry. The
                                         * specified registry value must be
                                         * located in:
                                         *
                                         * `HKLM\SOFTWARE\Microsoft\Windows
                                         * NT\CurrentVersion\Virtualization\Containers\CredentialSpecs`<p><br
                                         * /></p>> **Note**:
                                         * `CredentialSpec.File`,
                                         * `CredentialSpec.Registry`, and>
                                         * `CredentialSpec.Config` are mutually>
                                         * Exclusive.
                                         */
                                        Registry: Schema.optional(Schema.string),
                                    })
                                )
                            ),

                            /** SELinux labels of the container */
                            SELinuxContext: Schema.optional(
                                Schema.nullable(
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
                                )
                            ),
                        })
                    )
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
                Mounts: Schema.optional(Schema.nullable(Schema.array(Schema.nullable(Mount)))),

                /** Signal to stop the container. */
                StopSignal: Schema.optional(Schema.string),

                /**
                 * Amount of time to wait for the container to terminate before
                 * forcefully killing it.
                 */
                StopGracePeriod: Schema.optional(Schema.number),
                HealthCheck: Schema.optional(Schema.nullable(HealthConfig)),

                /**
                 * A list of hostname/IP mappings to add to the container's
                 * `hosts` file. The format of extra hosts is specified in the
                 * [hosts(5)](http://man7.org/linux/man-pages/man5/hosts.5.html)
                 * man page:
                 *
                 *     IP_address canonical_hostname [aliases...]
                 */
                Hosts: Schema.optional(Schema.nullable(Schema.array(Schema.string))),

                /**
                 * Specification for DNS related configurations in resolver
                 * configuration file (`resolv.conf`).
                 */
                DNSConfig: Schema.optional(
                    Schema.nullable(
                        Schema.struct({
                            /** The IP addresses of the name servers. */
                            Nameservers: Schema.optional(Schema.nullable(Schema.array(Schema.string))),

                            /** A search list for host-name lookup. */
                            Search: Schema.optional(Schema.nullable(Schema.array(Schema.string))),

                            /**
                             * A list of internal resolver variables to be
                             * modified (e.g., `debug`, `ndots:3`, etc.).
                             */
                            Options: Schema.optional(Schema.nullable(Schema.array(Schema.string))),
                        })
                    )
                ),

                /**
                 * Secrets contains references to zero or more secrets that will
                 * be exposed to the service.
                 */
                Secrets: Schema.optional(
                    Schema.nullable(
                        Schema.array(
                            Schema.nullable(
                                Schema.struct({
                                    /**
                                     * File represents a specific target that is
                                     * backed by a file.
                                     */
                                    File: Schema.optional(
                                        Schema.nullable(
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
                                        )
                                    ),

                                    /**
                                     * SecretID represents the ID of the
                                     * specific secret that we're referencing.
                                     */
                                    SecretID: Schema.optional(Schema.string),

                                    /**
                                     * SecretName is the name of the secret that
                                     * this references, but this is just
                                     * provided for lookup/display purposes. The
                                     * secret in the reference will be
                                     * identified by its ID.
                                     */
                                    SecretName: Schema.optional(Schema.string),
                                })
                            )
                        )
                    )
                ),

                /**
                 * Configs contains references to zero or more configs that will
                 * be exposed to the service.
                 */
                Configs: Schema.optional(
                    Schema.nullable(
                        Schema.array(
                            Schema.nullable(
                                Schema.struct({
                                    /**
                                     * File represents a specific target that is
                                     * backed by a file.<p><br /><p>> **Note**:
                                     * `Configs.File` and `Configs.Runtime` are
                                     * mutually exclusive
                                     */
                                    File: Schema.optional(
                                        Schema.nullable(
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
                                        )
                                    ),

                                    /**
                                     * Runtime represents a target that is not
                                     * mounted into the container but is used by
                                     * the task<p><br /><p>> **Note**:
                                     * `Configs.File` and `Configs.Runtime` are
                                     * mutually exclusive
                                     */
                                    Runtime: Schema.optional(Schema.nullable(Schema.struct({}))),

                                    /**
                                     * ConfigID represents the ID of the
                                     * specific config that we're referencing.
                                     */
                                    ConfigID: Schema.optional(Schema.string),

                                    /**
                                     * ConfigName is the name of the config that
                                     * this references, but this is just
                                     * provided for lookup/display purposes. The
                                     * config in the reference will be
                                     * identified by its ID.
                                     */
                                    ConfigName: Schema.optional(Schema.string),
                                })
                            )
                        )
                    )
                ),

                /**
                 * Isolation technology of the containers running the service.
                 * (Windows only)
                 */
                Isolation: Schema.optional(Schema.enums(TaskSpec_ContainerSpec_Isolation)),

                /**
                 * Run an init inside the container that forwards signals and
                 * reaps processes. This field is omitted if empty, and the
                 * default (as configured on the daemon) is used.
                 */
                Init: Schema.optional(Schema.boolean),

                /**
                 * Set kernel namedspaced parameters (sysctls) in the container.
                 * The Sysctls option on services accepts the same sysctls as
                 * the are supported on containers. Note that while the same
                 * sysctls are supported, no guarantees or checks are made about
                 * their suitability for a clustered environment, and it's up to
                 * the user to determine whether a given sysctl will work
                 * properly in a Service.
                 */
                Sysctls: Schema.optional(Schema.nullable(Schema.record(Schema.string, Schema.string))),

                /**
                 * A list of kernel capabilities to add to the default set for
                 * the container.
                 */
                CapabilityAdd: Schema.optional(Schema.nullable(Schema.array(Schema.string))),

                /**
                 * A list of kernel capabilities to drop from the default set
                 * for the container.
                 */
                CapabilityDrop: Schema.optional(Schema.nullable(Schema.array(Schema.string))),

                /**
                 * A list of resource limits to set in the container. For
                 * example: `{"Name": "nofile", "Soft": 1024, "Hard": 2048}`"
                 */
                Ulimits: Schema.optional(
                    Schema.nullable(
                        Schema.array(
                            Schema.nullable(
                                Schema.struct({
                                    /** Name of ulimit */
                                    Name: Schema.optional(Schema.string),

                                    /** Soft limit */
                                    Soft: Schema.optional(Schema.number),

                                    /** Hard limit */
                                    Hard: Schema.optional(Schema.number),
                                })
                            )
                        )
                    )
                ),
            })
        )
    ),

    /**
     * Read-only spec type for non-swarm containers attached to swarm overlay
     * networks.<p><br /></p>> **Note**: ContainerSpec, NetworkAttachmentSpec,
     * and PluginSpec are> Mutually exclusive. PluginSpec is only used when the
     * Runtime field is set> To `plugin`. NetworkAttachmentSpec is used when the
     * Runtime field is set> To `attachment`.
     */
    NetworkAttachmentSpec: Schema.optional(
        Schema.nullable(
            Schema.struct({
                /** ID of the container represented by this task */
                ContainerID: Schema.optional(Schema.string),
            })
        )
    ),

    /**
     * Resource requirements which apply to each individual container created as
     * part of the service.
     */
    Resources: Schema.optional(
        Schema.nullable(
            Schema.struct({
                Limits: Schema.optional(Schema.nullable(Limit)),
                Reservations: Schema.optional(Schema.nullable(ResourceObject)),
            })
        )
    ),

    /**
     * Specification for the restart policy which applies to containers created
     * as part of this service.
     */
    RestartPolicy: Schema.optional(
        Schema.nullable(
            Schema.struct({
                /** Condition for restart. */
                Condition: Schema.optional(Schema.enums(TaskSpec_RestartPolicy_Condition)),

                /** Delay between restart attempts. */
                Delay: Schema.optional(Schema.number),

                /**
                 * Maximum attempts to restart a given container before giving
                 * up (default value is 0, which is ignored).
                 */
                MaxAttempts: Schema.optional(Schema.number),

                /**
                 * Windows is the time window used to evaluate the restart
                 * policy (default value is 0, which is unbounded).
                 */
                Window: Schema.optional(Schema.number),
            })
        )
    ),
    Placement: Schema.optional(
        Schema.nullable(
            Schema.struct({
                /**
                 * An array of constraint expressions to limit the set of nodes
                 * where a task can be scheduled. Constraint expressions can
                 * either use a _match_ (`==`) or _exclude_ (`!=`) rule.
                 * Multiple constraints find nodes that satisfy every expression
                 * (AND match). Constraints can match node or Docker Engine
                 * labels as follows:
                 *
                 * Node attribute | matches | example
                 * ---------------------|--------------------------------|-----------------------------------------------
                 * `node.id` | Node ID | `node.id==2ivku8v2gvtg4`
                 * `node.hostname` | Node hostname | `node.hostname!=node-2`
                 * `node.role` | Node role (`manager`/`worker`) |
                 * `node.role==manager` `node.platform.os` | Node operating
                 * system | `node.platform.os==windows` `node.platform.arch` |
                 * Node architecture | `node.platform.arch==x86_64`
                 * `node.labels` | User-defined node labels |
                 * `node.labels.security==high` `engine.labels` | Docker
                 * Engine's labels |
                 * `engine.labels.operatingsystem==ubuntu-14.04`
                 *
                 * `engine.labels` apply to Docker Engine labels like operating
                 * system, drivers, etc. Swarm administrators add `node.labels`
                 * for operational purposes by using the [`node update
                 * endpoint`](#operation/NodeUpdate).
                 */
                Constraints: Schema.optional(Schema.nullable(Schema.array(Schema.string))),

                /**
                 * Preferences provide a way to make the scheduler aware of
                 * factors such as topology. They are provided in order from
                 * highest to lowest precedence.
                 */
                Preferences: Schema.optional(
                    Schema.nullable(
                        Schema.array(
                            Schema.nullable(
                                Schema.struct({
                                    Spread: Schema.optional(
                                        Schema.nullable(
                                            Schema.struct({
                                                /**
                                                 * Label descriptor, such as
                                                 * `engine.labels.az`.
                                                 */
                                                SpreadDescriptor: Schema.optional(Schema.string),
                                            })
                                        )
                                    ),
                                })
                            )
                        )
                    )
                ),

                /**
                 * Maximum number of replicas for per node (default value is 0,
                 * which is unlimited)
                 */
                MaxReplicas: Schema.optional(Schema.number),

                /**
                 * Platforms stores all the platforms that the service's image
                 * can run on. This field is used in the platform filter for
                 * scheduling. If empty, then the platform filter is off,
                 * meaning there are no scheduling restrictions.
                 */
                Platforms: Schema.optional(Schema.nullable(Schema.array(Schema.nullable(Platform)))),
            })
        )
    ),

    /**
     * A counter that triggers an update even if no relevant parameters have
     * been changed.
     */
    ForceUpdate: Schema.optional(Schema.number),

    /** Runtime is the type of runtime specified for the task executor. */
    Runtime: Schema.optional(Schema.string),

    /** Specifies which networks the service should attach to. */
    Networks: Schema.optional(Schema.nullable(Schema.array(Schema.nullable(NetworkAttachmentConfig)))),

    /**
     * Specifies the log driver to use for tasks created from this spec. If not
     * present, the default one for the swarm will be used, finally falling back
     * to the engine default if not specified.
     */
    LogDriver: Schema.optional(
        Schema.nullable(
            Schema.struct({
                Name: Schema.optional(Schema.string),
                Options: Schema.optional(Schema.nullable(Schema.record(Schema.string, Schema.string))),
            })
        )
    ),
}) {}

export class ContainerSummary extends Schema.Class<ContainerSummary>()({
    /** The ID of this container */
    Id: Schema.optional(Schema.string),

    /** The names that this container has been given */
    Names: Schema.optional(Schema.nullable(Schema.array(Schema.string))),

    /** The name of the image used when creating this container */
    Image: Schema.optional(Schema.string),

    /** The ID of the image that this container was created from */
    ImageID: Schema.optional(Schema.string),

    /** Command to run when starting the container */
    Command: Schema.optional(Schema.string),

    /** When the container was created */
    Created: Schema.optional(Schema.number),

    /** The ports exposed by this container */
    Ports: Schema.optional(Schema.nullable(Schema.array(Schema.nullable(Port)))),

    /** The size of files that have been created or changed by this container */
    SizeRw: Schema.optional(Schema.number),

    /** The total size of all the files in this container */
    SizeRootFs: Schema.optional(Schema.number),

    /** User-defined key/value metadata. */
    Labels: Schema.optional(Schema.nullable(Schema.record(Schema.string, Schema.string))),

    /** The state of this container (e.g. `Exited`) */
    State: Schema.optional(Schema.string),

    /** Additional human-readable status of this container (e.g. `Exit 0`) */
    Status: Schema.optional(Schema.string),
    HostConfig: Schema.optional(Schema.nullable(Schema.struct({ NetworkMode: Schema.optional(Schema.string) }))),

    /** A summary of the container's network settings */
    NetworkSettings: Schema.optional(
        Schema.nullable(
            Schema.struct({
                Networks: Schema.optional(
                    Schema.nullable(Schema.record(Schema.string, Schema.nullable(EndpointSettings)))
                ),
            })
        )
    ),
    Mounts: Schema.optional(Schema.nullable(Schema.array(Schema.nullable(MountPoint)))),
}) {}

export class Secret extends Schema.Class<Secret>()({
    ID: Schema.optional(Schema.string),
    Version: Schema.optional(Schema.nullable(ObjectVersion)),
    CreatedAt: Schema.optional(Schema.string),
    UpdatedAt: Schema.optional(Schema.string),
    Spec: Schema.optional(Schema.nullable(SecretSpec)),
}) {}

export class Config extends Schema.Class<Config>()({
    ID: Schema.optional(Schema.string),
    Version: Schema.optional(Schema.nullable(ObjectVersion)),
    CreatedAt: Schema.optional(Schema.string),
    UpdatedAt: Schema.optional(Schema.string),
    Spec: Schema.optional(Schema.nullable(ConfigSpec)),
}) {}

export enum ContainerState_Status {
    "CREATED" = "created",
    "RUNNING" = "running",
    "PAUSED" = "paused",
    "RESTARTING" = "restarting",
    "REMOVING" = "removing",
    "EXITED" = "exited",
    "DEAD" = "dead",
}

export class ContainerState extends Schema.Class<ContainerState>()({
    /**
     * String representation of the container state. Can be one of "created",
     * "running", "paused", "restarting", "removing", "exited", or "dead".
     */
    Status: Schema.optional(Schema.enums(ContainerState_Status)),

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
    Health: Schema.optional(Schema.nullable(Health)),
}) {}

export class SwarmInfo extends Schema.Class<SwarmInfo>()({
    /** Unique identifier of for this node in the swarm. */
    NodeID: Schema.optional(Schema.string),

    /** IP address at which this node can be reached by other nodes in the swarm. */
    NodeAddr: Schema.optional(Schema.string),
    LocalNodeState: Schema.optional(Schema.nullable(Schema.enums(LocalNodeState))),
    ControlAvailable: Schema.optional(Schema.boolean),
    Error: Schema.optional(Schema.string),

    /** List of ID's and addresses of other managers in the swarm. */
    RemoteManagers: Schema.optional(Schema.nullable(Schema.array(Schema.nullable(PeerNode)))),

    /** Total number of nodes in the swarm. */
    Nodes: Schema.optional(Schema.number),

    /** Total number of managers in the swarm. */
    Managers: Schema.optional(Schema.number),
    Cluster: Schema.optional(Schema.nullable(ClusterInfo)),
}) {}

export enum ClusterVolume_PublishStatus_PublishStatus_State {
    "PENDING-PUBLISH" = "pending-publish",
    "PUBLISHED" = "published",
    "PENDING-NODE-UNPUBLISH" = "pending-node-unpublish",
    "PENDING-CONTROLLER-UNPUBLISH" = "pending-controller-unpublish",
}

export class ClusterVolume extends Schema.Class<ClusterVolume>()({
    /**
     * The Swarm ID of this volume. Because cluster volumes are Swarm objects,
     * they have an ID, unlike non-cluster volumes. This ID can be used to refer
     * to the Volume instead of the name.
     */
    ID: Schema.optional(Schema.string),
    Version: Schema.optional(Schema.nullable(ObjectVersion)),
    CreatedAt: Schema.optional(Schema.string),
    UpdatedAt: Schema.optional(Schema.string),
    Spec: Schema.optional(Schema.nullable(ClusterVolumeSpec)),

    /** Information about the global status of the volume. */
    Info: Schema.optional(
        Schema.nullable(
            Schema.struct({
                /**
                 * The capacity of the volume in bytes. A value of 0 indicates
                 * that the capacity is unknown.
                 */
                CapacityBytes: Schema.optional(Schema.number),

                /**
                 * A map of strings to strings returned from the storage plugin
                 * when the volume is created.
                 */
                VolumeContext: Schema.optional(Schema.nullable(Schema.record(Schema.string, Schema.string))),

                /**
                 * The ID of the volume as returned by the CSI storage plugin.
                 * This is distinct from the volume's ID as provided by Docker.
                 * This ID is never used by the user when communicating with
                 * Docker to refer to this volume. If the ID is blank, then the
                 * Volume has not been successfully created in the plugin yet.
                 */
                VolumeID: Schema.optional(Schema.string),

                /** The topology this volume is actually accessible from. */
                AccessibleTopology: Schema.optional(Schema.nullable(Schema.array(Schema.nullable(Topology)))),
            })
        )
    ),

    /**
     * The status of the volume as it pertains to its publishing and use on
     * specific nodes
     */
    PublishStatus: Schema.optional(
        Schema.nullable(
            Schema.array(
                Schema.nullable(
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
                        State: Schema.optional(Schema.enums(ClusterVolume_PublishStatus_PublishStatus_State)),

                        /**
                         * A map of strings to strings returned by the CSI
                         * controller plugin when a volume is published.
                         */
                        PublishContext: Schema.optional(Schema.nullable(Schema.record(Schema.string, Schema.string))),
                    })
                )
            )
        )
    ),
}) {}

export class NetworkCreateRequest extends Schema.Class<NetworkCreateRequest>()({
    /** The network's name. */
    Name: Schema.string,

    /**
     * Check for networks with duplicate names. Since Network is primarily keyed
     * based on a random ID and not on the name, and network name is strictly a
     * user-friendly alias to the network which is uniquely identified using ID,
     * there is no guaranteed way to check for duplicates. CheckDuplicate is
     * there to provide a best effort checking of any networks which has the
     * same name but it is not guaranteed to catch all name collisions.
     */
    CheckDuplicate: Schema.optional(Schema.boolean),

    /** Name of the network driver plugin to use. */
    Driver: Schema.optional(Schema.string),

    /** Restrict external access to the network. */
    Internal: Schema.optional(Schema.boolean),

    /**
     * Globally scoped network is manually attachable by regular containers from
     * workers in swarm mode.
     */
    Attachable: Schema.optional(Schema.boolean),

    /**
     * Ingress network is the network which provides the routing-mesh in swarm
     * mode.
     */
    Ingress: Schema.optional(Schema.boolean),
    IPAM: Schema.optional(Schema.nullable(IPAM)),

    /** Enable IPv6 on the network. */
    EnableIPv6: Schema.optional(Schema.boolean),

    /** Network specific options to be used by the drivers. */
    Options: Schema.optional(Schema.nullable(Schema.record(Schema.string, Schema.string))),

    /** User-defined key/value metadata. */
    Labels: Schema.optional(Schema.nullable(Schema.record(Schema.string, Schema.string))),
}) {}

export class NetworkConnectRequest extends Schema.Class<NetworkConnectRequest>()({
    /** The ID or name of the container to connect to the network. */
    Container: Schema.optional(Schema.string),
    EndpointConfig: Schema.optional(Schema.nullable(EndpointSettings)),
}) {}

export enum Volume_Scope {
    "LOCAL" = "local",
    "GLOBAL" = "global",
}

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
    Status: Schema.optional(Schema.nullable(Schema.record(Schema.string, Schema.nullable(Schema.struct({}))))),

    /** User-defined key/value metadata. */
    Labels: Schema.nullable(Schema.record(Schema.string, Schema.string)),

    /**
     * The level at which the volume exists. Either `global` for cluster-wide,
     * or `local` for machine level.
     */
    Scope: Schema.optional(Schema.enums(Volume_Scope)),
    ClusterVolume: Schema.optional(Schema.nullable(ClusterVolume)),

    /** The driver specific options used when creating the volume. */
    Options: Schema.nullable(Schema.record(Schema.string, Schema.string)),

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
                Size: Schema.optional(Schema.number),

                /**
                 * The number of containers referencing this volume. This field
                 * is set to `-1` if the reference-count is not available.
                 */
                RefCount: Schema.optional(Schema.number),
            })
        )
    ),
}) {}

export class Node extends Schema.Class<Node>()({
    ID: Schema.optional(Schema.string),
    Version: Schema.optional(Schema.nullable(ObjectVersion)),

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
    Spec: Schema.optional(Schema.nullable(NodeSpec)),
    Description: Schema.optional(Schema.nullable(NodeDescription)),
    Status: Schema.optional(Schema.nullable(NodeStatus)),
    ManagerStatus: Schema.optional(Schema.nullable(ManagerStatus)),
}) {}

export class Task extends Schema.Class<Task>()({
    /** The ID of the task. */
    ID: Schema.optional(Schema.string),
    Version: Schema.optional(Schema.nullable(ObjectVersion)),
    CreatedAt: Schema.optional(Schema.string),
    UpdatedAt: Schema.optional(Schema.string),

    /** Name of the task. */
    Name: Schema.optional(Schema.string),

    /** User-defined key/value metadata. */
    Labels: Schema.optional(Schema.nullable(Schema.record(Schema.string, Schema.string))),
    Spec: Schema.optional(Schema.nullable(TaskSpec)),

    /** The ID of the service this task is part of. */
    ServiceID: Schema.optional(Schema.string),
    Slot: Schema.optional(Schema.number),

    /** The ID of the node that this task is on. */
    NodeID: Schema.optional(Schema.string),
    AssignedGenericResources: Schema.optional(Schema.nullable(GenericResources)),
    Status: Schema.optional(
        Schema.nullable(
            Schema.struct({
                Timestamp: Schema.optional(Schema.string),
                State: Schema.optional(Schema.nullable(Schema.enums(TaskState))),
                Message: Schema.optional(Schema.string),
                Err: Schema.optional(Schema.string),
                ContainerStatus: Schema.optional(
                    Schema.nullable(
                        Schema.struct({
                            ContainerID: Schema.optional(Schema.string),
                            PID: Schema.optional(Schema.number),
                            ExitCode: Schema.optional(Schema.number),
                        })
                    )
                ),
            })
        )
    ),
    DesiredState: Schema.optional(Schema.nullable(Schema.enums(TaskState))),
    JobIteration: Schema.optional(Schema.nullable(ObjectVersion)),
}) {}

export enum ServiceSpec_UpdateConfig_FailureAction {
    "CONTINUE" = "continue",
    "PAUSE" = "pause",
    "ROLLBACK" = "rollback",
}

export enum ServiceSpec_UpdateConfig_Order {
    "STOP-FIRST" = "stop-first",
    "START-FIRST" = "start-first",
}

export enum ServiceSpec_RollbackConfig_FailureAction {
    "CONTINUE" = "continue",
    "PAUSE" = "pause",
}

export enum ServiceSpec_RollbackConfig_Order {
    "STOP-FIRST" = "stop-first",
    "START-FIRST" = "start-first",
}

export class ServiceSpec extends Schema.Class<ServiceSpec>()({
    /** Name of the service. */
    Name: Schema.optional(Schema.string),

    /** User-defined key/value metadata. */
    Labels: Schema.optional(Schema.nullable(Schema.record(Schema.string, Schema.string))),
    TaskTemplate: Schema.optional(Schema.nullable(TaskSpec)),

    /** Scheduling mode for the service. */
    Mode: Schema.optional(
        Schema.nullable(
            Schema.struct({
                Replicated: Schema.optional(
                    Schema.nullable(Schema.struct({ Replicas: Schema.optional(Schema.number) }))
                ),
                Global: Schema.optional(Schema.nullable(Schema.struct({}))),

                /**
                 * The mode used for services with a finite number of tasks that
                 * run to a completed state.
                 */
                ReplicatedJob: Schema.optional(
                    Schema.nullable(
                        Schema.struct({
                            /**
                             * The maximum number of replicas to run
                             * simultaneously.
                             */
                            MaxConcurrent: Schema.optional(Schema.number),

                            /**
                             * The total number of replicas desired to reach the
                             * Completed state. If unset, will default to the
                             * value of `MaxConcurrent`
                             */
                            TotalCompletions: Schema.optional(Schema.number),
                        })
                    )
                ),

                /**
                 * The mode used for services which run a task to the completed
                 * state on each valid node.
                 */
                GlobalJob: Schema.optional(Schema.nullable(Schema.struct({}))),
            })
        )
    ),

    /** Specification for the update strategy of the service. */
    UpdateConfig: Schema.optional(
        Schema.nullable(
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
                FailureAction: Schema.optional(Schema.enums(ServiceSpec_UpdateConfig_FailureAction)),

                /**
                 * Amount of time to monitor each updated task for failures, in
                 * nanoseconds.
                 */
                Monitor: Schema.optional(Schema.number),

                /**
                 * The fraction of tasks that may fail during an update before
                 * the failure action is invoked, specified as a floating point
                 * number between 0 and 1.
                 */
                MaxFailureRatio: Schema.optional(Schema.number),

                /**
                 * The order of operations when rolling out an updated task.
                 * Either the old task is shut down before the new task is
                 * started, or the new task is started before the old task is
                 * shut down.
                 */
                Order: Schema.optional(Schema.enums(ServiceSpec_UpdateConfig_Order)),
            })
        )
    ),

    /** Specification for the rollback strategy of the service. */
    RollbackConfig: Schema.optional(
        Schema.nullable(
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
                FailureAction: Schema.optional(Schema.enums(ServiceSpec_RollbackConfig_FailureAction)),

                /**
                 * Amount of time to monitor each rolled back task for failures,
                 * in nanoseconds.
                 */
                Monitor: Schema.optional(Schema.number),

                /**
                 * The fraction of tasks that may fail during a rollback before
                 * the failure action is invoked, specified as a floating point
                 * number between 0 and 1.
                 */
                MaxFailureRatio: Schema.optional(Schema.number),

                /**
                 * The order of operations when rolling back a task. Either the
                 * old task is shut down before the new task is started, or the
                 * new task is started before the old task is shut down.
                 */
                Order: Schema.optional(Schema.enums(ServiceSpec_RollbackConfig_Order)),
            })
        )
    ),

    /** Specifies which networks the service should attach to. */
    Networks: Schema.optional(Schema.nullable(Schema.array(Schema.nullable(NetworkAttachmentConfig)))),
    EndpointSpec: Schema.optional(Schema.nullable(EndpointSpec)),
}) {}

export enum SystemInfo_CgroupDriver {
    "CGROUPFS" = "cgroupfs",
    "SYSTEMD" = "systemd",
    "NONE" = "none",
}

export enum SystemInfo_CgroupVersion {
    "ONE" = "1",
    "TWO" = "2",
}

export enum SystemInfo_Isolation {
    "UNKNOWN" = "",
    "DEFAULT" = "default",
    "HYPERV" = "hyperv",
    "PROCESS" = "process",
}

export class SystemInfo extends Schema.Class<SystemInfo>()({
    /**
     * Unique identifier of the daemon.<p><br /></p>> **Note**: The format of
     * the ID itself is not part of the API, and> Should not be considered
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
     * including the> Formatting of values and labels, should not be considered
     * stable, and may> Change without notice.
     */
    DriverStatus: Schema.optional(Schema.nullable(Schema.array(Schema.nullable(Schema.array(Schema.string))))),

    /**
     * Root directory of persistent Docker state.
     *
     * Defaults to `/var/lib/docker` on Linux, and `C:\ProgramData\docker` on
     * Windows.
     */
    DockerRootDir: Schema.optional(Schema.string),
    Plugins: Schema.optional(Schema.nullable(PluginsInfo)),

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
    CgroupDriver: Schema.optional(Schema.enums(SystemInfo_CgroupDriver)),

    /** The version of the cgroup. */
    CgroupVersion: Schema.optional(Schema.enums(SystemInfo_CgroupVersion)),

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
     * information returned in this field, including its very> Existence, and
     * the formatting of values, should not be considered stable,> And may
     * change without notice.
     */
    OSVersion: Schema.optional(Schema.string),

    /**
     * Generic type of the operating system of the host, as returned by the Go
     * runtime (`GOOS`).
     *
     * Currently returned values are "linux" and "windows". A full list of
     * possible values can be found in the [Go
     * documentation](https://golang.org/doc/install/source#environment).
     */
    OSType: Schema.optional(Schema.string),

    /**
     * Hardware architecture of the host, as returned by the Go runtime
     * (`GOARCH`).
     *
     * A full list of possible values can be found in the [Go
     * documentation](https://golang.org/doc/install/source#environment).
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
    IndexServerAddress: Schema.optional(Schema.string),
    RegistryConfig: Schema.optional(Schema.nullable(RegistryServiceConfig)),
    GenericResources: Schema.optional(Schema.nullable(GenericResources)),

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
     * /></p>> **Note**: When part of a Swarm, nodes can both have _daemon_
     * labels,> Set through the daemon configuration, and _node_ labels, set
     * from a> Manager node in the Swarm. Node labels are not included in this
     * field.> Node labels can be retrieved using the `/nodes/(id)` endpoint on
     * a> Manager node in the Swarm.
     */
    Labels: Schema.optional(Schema.nullable(Schema.array(Schema.string))),

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
    Runtimes: Schema.optional(Schema.nullable(Schema.record(Schema.string, Schema.nullable(Runtime)))),

    /**
     * Name of the default OCI runtime that is used when starting containers.
     *
     * The default can be overridden per-container at create time.
     */
    DefaultRuntime: Schema.optional(Schema.string),
    Swarm: Schema.optional(Schema.nullable(SwarmInfo)),

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
    Isolation: Schema.optional(Schema.enums(SystemInfo_Isolation)),

    /**
     * Name and, optional, path of the `docker-init` binary.
     *
     * If the path is omitted, the daemon searches the host's `$PATH` for the
     * binary and uses the first result.
     */
    InitBinary: Schema.optional(Schema.string),
    ContainerdCommit: Schema.optional(Schema.nullable(Commit)),
    RuncCommit: Schema.optional(Schema.nullable(Commit)),
    InitCommit: Schema.optional(Schema.nullable(Commit)),

    /**
     * List of security features that are enabled on the daemon, such as
     * apparmor, seccomp, SELinux, user-namespaces (userns), rootless and
     * no-new-privileges.
     *
     * Additional configuration options for each security feature may be
     * present, and are included as a comma-separated list of key/value pairs.
     */
    SecurityOptions: Schema.optional(Schema.nullable(Schema.array(Schema.string))),

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
        Schema.nullable(
            Schema.array(
                Schema.nullable(
                    Schema.struct({
                        /** The network address in CIDR format */
                        Base: Schema.optional(Schema.string),

                        /** The network pool size */
                        Size: Schema.optional(Schema.number),
                    })
                )
            )
        )
    ),

    /**
     * List of warnings / informational messages about missing features, or
     * issues related to the daemon configuration.
     *
     * These messages can be printed by the client as information to the user.
     */
    Warnings: Schema.optional(Schema.nullable(Schema.array(Schema.string))),
}) {}

export class ContainerInspectResponse extends Schema.Class<ContainerInspectResponse>()({
    /** The ID of the container */
    Id: Schema.optional(Schema.string),

    /** The time the container was created */
    Created: Schema.optional(Schema.string),

    /** The path to the command being run */
    Path: Schema.optional(Schema.string),

    /** The arguments to the command being run */
    Args: Schema.optional(Schema.nullable(Schema.array(Schema.string))),
    State: Schema.optional(Schema.nullable(ContainerState)),

    /** The container's image ID */
    Image: Schema.optional(Schema.string),
    ResolvConfPath: Schema.optional(Schema.string),
    HostnamePath: Schema.optional(Schema.string),
    HostsPath: Schema.optional(Schema.string),
    LogPath: Schema.optional(Schema.string),
    Name: Schema.optional(Schema.string),
    RestartCount: Schema.optional(Schema.number),
    Driver: Schema.optional(Schema.string),
    Platform: Schema.optional(Schema.string),
    MountLabel: Schema.optional(Schema.string),
    ProcessLabel: Schema.optional(Schema.string),
    AppArmorProfile: Schema.optional(Schema.string),

    /** IDs of exec instances that are running in the container. */
    ExecIDs: Schema.optional(Schema.nullable(Schema.array(Schema.string))),
    HostConfig: Schema.optional(Schema.nullable(HostConfig)),
    GraphDriver: Schema.optional(Schema.nullable(GraphDriverData)),

    /** The size of files that have been created or changed by this container. */
    SizeRw: Schema.optional(Schema.number),

    /** The total size of all the files in this container. */
    SizeRootFs: Schema.optional(Schema.number),
    Mounts: Schema.optional(Schema.nullable(Schema.array(Schema.nullable(MountPoint)))),
    Config: Schema.optional(Schema.nullable(ContainerConfig)),
    NetworkSettings: Schema.optional(Schema.nullable(NetworkSettings)),
}) {}

export class VolumeListResponse extends Schema.Class<VolumeListResponse>()({
    /** List of volumes */
    Volumes: Schema.optional(Schema.nullable(Schema.array(Schema.nullable(Volume)))),

    /** Warnings that occurred when fetching the list of volumes. */
    Warnings: Schema.optional(Schema.nullable(Schema.array(Schema.string))),
}) {}

export enum Service_UpdateStatus_State {
    "UPDATING" = "updating",
    "PAUSED" = "paused",
    "COMPLETED" = "completed",
}

export class Service extends Schema.Class<Service>()({
    ID: Schema.optional(Schema.string),
    Version: Schema.optional(Schema.nullable(ObjectVersion)),
    CreatedAt: Schema.optional(Schema.string),
    UpdatedAt: Schema.optional(Schema.string),
    Spec: Schema.optional(Schema.nullable(ServiceSpec)),
    Endpoint: Schema.optional(
        Schema.nullable(
            Schema.struct({
                Spec: Schema.optional(Schema.nullable(EndpointSpec)),
                Ports: Schema.optional(Schema.nullable(Schema.array(Schema.nullable(EndpointPortConfig)))),
                VirtualIPs: Schema.optional(
                    Schema.nullable(
                        Schema.array(
                            Schema.nullable(
                                Schema.struct({
                                    NetworkID: Schema.optional(Schema.string),
                                    Addr: Schema.optional(Schema.string),
                                })
                            )
                        )
                    )
                ),
            })
        )
    ),

    /** The status of a service update. */
    UpdateStatus: Schema.optional(
        Schema.nullable(
            Schema.struct({
                State: Schema.optional(Schema.enums(Service_UpdateStatus_State)),
                StartedAt: Schema.optional(Schema.string),
                CompletedAt: Schema.optional(Schema.string),
                Message: Schema.optional(Schema.string),
            })
        )
    ),

    /**
     * The status of the service's tasks. Provided only when requested as part
     * of a ServiceList operation.
     */
    ServiceStatus: Schema.optional(
        Schema.nullable(
            Schema.struct({
                /**
                 * The number of tasks for the service currently in the Running
                 * state.
                 */
                RunningTasks: Schema.optional(Schema.number),

                /**
                 * The number of tasks for the service desired to be running.
                 * For replicated services, this is the replica count from the
                 * service spec. For global services, this is computed by taking
                 * count of all tasks for the service with a Desired State other
                 * than Shutdown.
                 */
                DesiredTasks: Schema.optional(Schema.number),

                /**
                 * The number of tasks for a job that are in the Completed
                 * state. This field must be cross-referenced with the service
                 * type, as the value of 0 may mean the service is not in a job
                 * mode, or it may mean the job-mode service has no tasks yet
                 * Completed.
                 */
                CompletedTasks: Schema.optional(Schema.number),
            })
        )
    ),

    /**
     * The status of the service when it is in one of ReplicatedJob or GlobalJob
     * modes. Absent on Replicated and Global mode services. The JobIteration is
     * an ObjectVersion, but unlike the Service's version, does not need to be
     * sent with an update request.
     */
    JobStatus: Schema.optional(
        Schema.nullable(
            Schema.struct({
                JobIteration: Schema.optional(Schema.nullable(ObjectVersion)),

                /**
                 * The last time, as observed by the server, that this job was
                 * started.
                 */
                LastExecution: Schema.optional(Schema.string),
            })
        )
    ),
}) {}

export class SystemDataUsageResponse extends Schema.Class<SystemDataUsageResponse>()({
    LayersSize: Schema.optional(Schema.number),
    Images: Schema.optional(Schema.nullable(Schema.array(Schema.nullable(ImageSummary)))),
    Containers: Schema.optional(Schema.nullable(Schema.array(Schema.nullable(ContainerSummary)))),
    Volumes: Schema.optional(Schema.nullable(Schema.array(Schema.nullable(Volume)))),
    BuildCache: Schema.optional(Schema.nullable(Schema.array(Schema.nullable(BuildCache)))),
}) {}

export class ContainerUpdateSpec extends Resources.extend<ContainerUpdateSpec>()({
    RestartPolicy: Schema.optional(RestartPolicy),
}) {}

export class ContainerCreateSpec extends ContainerConfig.extend<ContainerCreateSpec>()({
    HostConfig: Schema.optional(HostConfig),
    NetworkingConfig: Schema.optional(NetworkingConfig),
}) {}
