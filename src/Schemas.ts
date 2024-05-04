/* eslint-disable max-lines */

import * as Schema from "@effect/schema/Schema";

// A field can either be required or not required.
const RequiredField = <A, I, R>(schema: Schema.Schema<A, I, R>): Schema.Schema<A, I, R> => schema;
const NonRequiredField = <A, I, R>(
    schema: Schema.Schema<A, I, R>,
    options?: { default: () => A }
): Schema.PropertySignature<":", A, never, "?:", I, R> => Schema.optional(schema, { exact: true, ...options });

// A field can either be marked "x-nullable: true"
const NullableRequiredField = <A, I, R>(schema: Schema.Schema<A, I, R>): Schema.Schema<A | null, I | null, R> =>
    RequiredField(Schema.NullOr(schema));
const NullableNonRequiredField = <A, I, R>(
    schema: Schema.Schema<A, I, R>,
    options?: { default: () => A }
): Schema.PropertySignature<":", A | null, never, "?:", I | null, R> =>
    NonRequiredField(Schema.NullOr(schema), options);

// Or, it might be marked "x-nullable: false"
const NonNullableRequiredField = RequiredField;
const NonNullableNonRequiredField = NonRequiredField;

// Or, it might not be marked with x-nullable at all
const NullabilityOmittedRequiredField = NonNullableRequiredField;
const NullabilityOmittedNonRequiredField = NonNullableNonRequiredField;

/** An open port on a container. */
export class Port extends Schema.Class<Port>("Port")({
    Type: NullabilityOmittedRequiredField(
        Schema.Union(Schema.Literal("tcp"), Schema.Literal("udp"), Schema.Literal("sctp"))
    ),

    /** Port on the container. */
    PrivatePort: NullabilityOmittedRequiredField(Schema.Int.pipe(Schema.between(0, 2 ** 16))),

    /** Host IP address that the container's port is mapped to. */
    IP: NullabilityOmittedNonRequiredField(Schema.String),

    /** Port exposed on the host. */
    PublicPort: NullabilityOmittedNonRequiredField(Schema.Int.pipe(Schema.between(0, 2 ** 16))),
}) {}

/**
 * MountPoint represents a mount point configuration inside the container. This
 * is used for reporting the mountpoints in use by a container.
 */
export class MountPoint extends Schema.Class<MountPoint>("MountPoint")({
    /**
     * The mount type:
     *
     * - `bind` a mount of a file or directory from the host into the container.
     * - `volume` a docker volume with the given `Name`.
     * - `tmpfs` a `tmpfs`.
     * - `npipe` a named pipe from the host into the container.
     * - `cluster` a Swarm cluster volume
     */
    Type: NullabilityOmittedNonRequiredField(
        Schema.Union(
            Schema.Literal("bind"),
            Schema.Literal("volume"),
            Schema.Literal("tmpfs"),
            Schema.Literal("npipe"),
            Schema.Literal("cluster")
        )
    ),

    /**
     * Name is the name reference to the underlying data defined by `Source`
     * e.g., the volume name.
     */
    Name: NullabilityOmittedNonRequiredField(Schema.String),

    /**
     * Source location of the mount.
     *
     * For volumes, this contains the storage location of the volume (within
     * `/var/lib/docker/volumes/`). For bind-mounts, and `npipe`, this contains
     * the source (host) part of the bind-mount. For `tmpfs` mount points, this
     * field is empty.
     */
    Source: NullabilityOmittedNonRequiredField(Schema.String),

    /**
     * Destination is the path relative to the container root (`/`) where the
     * `Source` is mounted inside the container.
     */
    Destination: NullabilityOmittedNonRequiredField(Schema.String),

    /**
     * Driver is the volume driver used to create the volume (if it is a
     * volume).
     */
    Driver: NullabilityOmittedNonRequiredField(Schema.String),

    /**
     * Mode is a comma separated list of options supplied by the user when
     * creating the bind/volume mount.
     *
     * The default is platform-specific (`"z"` on Linux, empty on Windows).
     */
    Mode: NullabilityOmittedNonRequiredField(Schema.String),

    /** Whether the mount is mounted writable (read-write). */
    RW: NullabilityOmittedNonRequiredField(Schema.Boolean),

    /**
     * Propagation describes how mounts are propagated from the host into the
     * mount point, and vice-versa. Refer to the [Linux kernel
     * documentation](https://www.kernel.org/doc/Documentation/filesystems/sharedsubtree.txt)
     * for details. This field is not used on Windows.
     */
    Propagation: NullabilityOmittedNonRequiredField(Schema.String),
}) {}

/** A device mapping between the host and container. */
export class DeviceMapping extends Schema.Class<DeviceMapping>("DeviceMapping")({
    PathOnHost: NullabilityOmittedNonRequiredField(Schema.String),
    PathInContainer: NullabilityOmittedNonRequiredField(Schema.String),
    CgroupPermissions: NullabilityOmittedNonRequiredField(Schema.String),
}) {}

/** A request for devices to be sent to device drivers. */
export class DeviceRequest extends Schema.Class<DeviceRequest>("DeviceRequest")({
    Driver: NullabilityOmittedNonRequiredField(Schema.String),
    Count: NullabilityOmittedNonRequiredField(Schema.Int),
    DeviceIDs: NullabilityOmittedNonRequiredField(Schema.Array(Schema.String)),

    /** A list of capabilities; an OR list of AND lists of capabilities. */
    Capabilities: NullabilityOmittedNonRequiredField(Schema.Array(Schema.Array(Schema.String))),

    /**
     * Driver-specific options, specified as a key/value pairs. These options
     * are passed directly to the driver.
     */
    Options: NullabilityOmittedNonRequiredField(Schema.Record(Schema.String, Schema.String)),
}) {}

export class ThrottleDevice extends Schema.Class<ThrottleDevice>("ThrottleDevice")({
    /** Device path */
    Path: NullabilityOmittedNonRequiredField(Schema.String),

    /** Rate */
    Rate: NullabilityOmittedNonRequiredField(Schema.Int.pipe(Schema.greaterThanOrEqualTo(0))),
}) {}

export class Mount extends Schema.Class<Mount>("Mount")({
    /** Container path. */
    Target: NullabilityOmittedNonRequiredField(Schema.String),

    /** Mount source (e.g. a volume name, a host path). */
    Source: NullabilityOmittedNonRequiredField(Schema.String),

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
    Type: NullabilityOmittedNonRequiredField(
        Schema.Union(
            Schema.Literal("bind"),
            Schema.Literal("volume"),
            Schema.Literal("tmpfs"),
            Schema.Literal("npipe"),
            Schema.Literal("cluster")
        )
    ),

    /** Whether the mount should be read-only. */
    ReadOnly: NullabilityOmittedNonRequiredField(Schema.Boolean),

    /**
     * The consistency requirement for the mount: `default`, `consistent`,
     * `cached`, or `delegated`.
     *
     * TODO: Can this be extracted to a union of literals?
     */
    Consistency: NullabilityOmittedNonRequiredField(Schema.String),

    /** Optional configuration for the `bind` type. */
    BindOptions: NullabilityOmittedNonRequiredField(
        Schema.Struct({
            /**
             * A propagation mode with the value `[r]private`, `[r]shared`, or
             * `[r]slave`.
             */
            Propagation: NullabilityOmittedNonRequiredField(
                Schema.Union(
                    Schema.Literal("private"),
                    Schema.Literal("rprivate"),
                    Schema.Literal("shared"),
                    Schema.Literal("rshared"),
                    Schema.Literal("slave"),
                    Schema.Literal("rslave")
                )
            ),

            /** Disable recursive bind mount. */
            NonRecursive: NullabilityOmittedNonRequiredField(Schema.Boolean, { default: () => false }),

            /** Create mount point on host if missing */
            CreateMountpoint: NullabilityOmittedNonRequiredField(Schema.Boolean, { default: () => false }),

            /**
             * Make the mount non-recursively read-only, but still leave the
             * mount recursive (unless NonRecursive is set to `true` in
             * conjunction).
             *
             * Added in v1.44, before that version all read-only mounts were
             * non-recursive by default. To match the previous behavior this
             * will default to `true` for clients on versions prior to v1.44.
             */
            ReadOnlyNonRecursive: NullabilityOmittedNonRequiredField(Schema.Boolean, { default: () => false }),

            /** Raise an error if the mount cannot be made recursively read-only. */
            ReadOnlyForceRecursive: NullabilityOmittedNonRequiredField(Schema.Boolean, { default: () => false }),
        })
    ),

    /** Optional configuration for the `volume` type. */
    VolumeOptions: NullabilityOmittedNonRequiredField(
        Schema.Struct({
            /** Populate volume with data from the target. */
            NoCopy: NullabilityOmittedNonRequiredField(Schema.Boolean, { default: () => false }),

            /** User-defined key/value metadata. */
            Labels: NullabilityOmittedNonRequiredField(Schema.Record(Schema.String, Schema.String)),

            /** Map of driver specific options */
            DriverConfig: NullabilityOmittedNonRequiredField(
                Schema.Struct({
                    /** Name of the driver to use to create the volume. */
                    Name: NullabilityOmittedNonRequiredField(Schema.String),

                    /** Key/value map of driver specific options. */
                    Options: NullabilityOmittedNonRequiredField(Schema.Record(Schema.String, Schema.String)),
                })
            ),

            /**
             * Source path inside the volume. Must be relative without any back
             * traversals.
             */
            Subpath: NullabilityOmittedNonRequiredField(Schema.String),
        })
    ),

    /** Optional configuration for the `tmpfs` type. */
    TmpfsOptions: NullabilityOmittedNonRequiredField(
        Schema.Struct({
            /** The size for the tmpfs mount in bytes. */
            SizeBytes: NullabilityOmittedNonRequiredField(Schema.Int),

            /** The permission mode for the tmpfs mount in an integer. */
            Mode: NullabilityOmittedNonRequiredField(Schema.Int),
        })
    ),
}) {}

/**
 * The behavior to apply when the container exits. The default is not to
 * restart. An ever increasing delay (double the previous delay, starting at
 * 100ms) is added before each restart to prevent flooding the server.
 */
export class RestartPolicy extends Schema.Class<RestartPolicy>("RestartPolicy")({
    /**
     * - Empty string means not to restart
     * - `no` Do not automatically restart
     * - `always` Always restart
     * - `unless-stopped` Restart always except when the user has manually stopped
     *   the container
     * - `on-failure` Restart only when the container exit code is non-zero
     */
    Name: NullabilityOmittedNonRequiredField(
        Schema.Union(
            Schema.Literal(""),
            Schema.Literal("no"),
            Schema.Literal("always"),
            Schema.Literal("never"),
            Schema.Literal("on-failure")
        )
    ),

    /** If `on-failure` is used, the number of times to retry before giving up. */
    MaximumRetryCount: NullabilityOmittedNonRequiredField(Schema.Int),
}) {}

/** An object describing a limit on resources which can be requested by a task. */
export class Limit extends Schema.Class<Limit>("Limit")({
    NanoCPUs: NullabilityOmittedNonRequiredField(Schema.Int),
    MemoryBytes: NullabilityOmittedNonRequiredField(Schema.Int),

    /**
     * Limits the maximum number of PIDs in the container. Set `0` for
     * unlimited.
     */
    Pids: NullabilityOmittedNonRequiredField(Schema.Int, { default: () => 0 }),
}) {}

/**
 * User-defined resources can be either Integer resources (e.g, `SSD=3`) or
 * string resources (e.g, `GPU=UUID1`).
 *
 * TODO: What should the top level be wrapped in?
 */
export const GenericResources = NullabilityOmittedRequiredField(
    Schema.Array(
        Schema.Struct({
            NamedResourceSpec: NullabilityOmittedNonRequiredField(
                Schema.Struct({
                    Kind: NullabilityOmittedNonRequiredField(Schema.String),
                    Value: NullabilityOmittedNonRequiredField(Schema.String),
                })
            ),
            DiscreteResourceSpec: NullabilityOmittedNonRequiredField(
                Schema.Struct({
                    Kind: NullabilityOmittedNonRequiredField(Schema.String),
                    Value: NullabilityOmittedNonRequiredField(Schema.Int),
                })
            ),
        })
    )
);

/** A test to perform to check that the container is healthy. */
export class HealthConfig extends Schema.Class<HealthConfig>("HealthConfig")({
    /**
     * The test to perform. Possible values are:
     *
     * - `[]` inherit healthcheck from image or parent image
     * - `["NONE"]` disable healthcheck
     * - `["CMD", args...]` exec arguments directly
     * - `["CMD-SHELL", command]` run command with system's default shell
     */
    Test: NullabilityOmittedNonRequiredField(Schema.Array(Schema.String)),

    /**
     * The time to wait between checks in nanoseconds. It should be 0 or at
     * least 1000000 (1 ms). 0 means inherit.
     */
    Interval: NullabilityOmittedNonRequiredField(Schema.Int),

    /**
     * The time to wait before considering the check to have hung. It should be
     * 0 or at least 1000000 (1 ms). 0 means inherit.
     */
    Timeout: NullabilityOmittedNonRequiredField(Schema.Int),

    /**
     * The number of consecutive failures needed to consider a container as
     * unhealthy. 0 means inherit.
     */
    Retries: NullabilityOmittedNonRequiredField(Schema.Int),

    /**
     * Start period for the container to initialize before starting
     * health-retries countdown in nanoseconds. It should be 0 or at least
     * 1000000 (1 ms). 0 means inherit.
     */
    StartPeriod: NullabilityOmittedNonRequiredField(Schema.Int),

    /**
     * The time to wait between checks in nanoseconds during the start period.
     * It should be 0 or at least 1000000 (1 ms). 0 means inherit.
     */
    StartInterval: NullabilityOmittedNonRequiredField(Schema.Int),
}) {}

/**
 * HealthcheckResult stores information about a single run of a healthcheck
 * probe. TODO: marked as x-nullable at the top level, what does that mean for
 * consumers?
 */
export class HealthcheckResult extends Schema.Class<HealthcheckResult>("HealthcheckResult")({
    /**
     * Date and time at which this check started in [RFC
     * 3339](https://www.ietf.org/rfc/rfc3339.txt) format with nano-seconds.
     */
    Start: NullabilityOmittedNonRequiredField(Schema.String),

    /**
     * Date and time at which this check ended in [RFC
     * 3339](https://www.ietf.org/rfc/rfc3339.txt) format with nano-seconds.
     */
    End: NullabilityOmittedNonRequiredField(Schema.String),

    /**
     * ExitCode meanings:
     *
     * - `0` healthy
     * - `1` unhealthy
     * - `2` reserved (considered unhealthy)
     * - Other values: error running probe
     */
    ExitCode: NullabilityOmittedNonRequiredField(Schema.Int),

    /** Output from last check */
    Output: NullabilityOmittedNonRequiredField(Schema.String),
}) {}

/** Address represents an IPv4 or IPv6 IP address. */
export class Address extends Schema.Class<Address>("Address")({
    /** IP address. */
    Addr: NullabilityOmittedNonRequiredField(Schema.String),

    /** Mask length of the IP address. */
    PrefixLen: NullabilityOmittedNonRequiredField(Schema.Int),
}) {}

/** PortBinding represents a binding between a host IP address and a host port. */
export class PortBinding extends Schema.Class<PortBinding>("PortBinding")({
    /** Host IP address that the container's port is mapped to. */
    HostIp: NullabilityOmittedNonRequiredField(Schema.String),

    /** Host port number that the container's port is mapped to. */
    HostPort: NullabilityOmittedNonRequiredField(Schema.String),
}) {}

/**
 * Information about the storage driver used to store the container's and
 * image's filesystem.
 */
export class GraphDriverData extends Schema.Class<GraphDriverData>("GraphDriverData")({
    /** Name of the storage driver. */
    Name: NonNullableRequiredField(Schema.String),

    /**
     * Low-level storage metadata, provided as key/value pairs.
     *
     * This information is driver-specific, and depends on the storage-driver in
     * use, and should be used for informational purposes only.
     */
    Data: NonNullableRequiredField(Schema.Record(Schema.String, Schema.String)),
}) {}

export class ImageSummary extends Schema.Class<ImageSummary>("ImageSummary")({
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
    Id: NonNullableRequiredField(Schema.String),

    /**
     * ID of the parent image.
     *
     * Depending on how the image was created, this field may be empty and is
     * only set for images that were built/created locally. This field is empty
     * if the image was pulled from an image registry.
     */
    ParentId: NonNullableRequiredField(Schema.String),

    /**
     * List of image names/tags in the local image cache that reference this
     * image.
     *
     * Multiple image tags can refer to the same image, and this list may be
     * empty if no tags reference the image, in which case the image is
     * "untagged", in which case it can still be referenced by its ID.
     */
    RepoTags: NonNullableRequiredField(Schema.Array(Schema.String)),

    /**
     * List of content-addressable digests of locally available image manifests
     * that the image is referenced from. Multiple manifests can refer to the
     * same image.
     *
     * These digests are usually only available if the image was either pulled
     * from a registry, or if the image was pushed to a registry, which is when
     * the manifest is generated and its digest calculated.
     */
    RepoDigests: NonNullableRequiredField(Schema.Array(Schema.String)),

    /**
     * Date and time at which the image was created as a Unix timestamp (number
     * of seconds since EPOCH).
     */
    Created: NonNullableRequiredField(Schema.Int),

    /** Total size of the image including all layers it is composed of. */
    Size: NonNullableRequiredField(Schema.Int),

    /**
     * Total size of image layers that are shared between this image and other
     * images.
     *
     * This size is not calculated by default. `-1` indicates that the value has
     * not been set / calculated.
     */
    SharedSize: NonNullableRequiredField(Schema.Int),

    /**
     * Total size of the image including all layers it is composed of.
     * Deprecated: this field is omitted in API v1.44, but kept for backward
     * compatibility. Use Size instead.
     */
    VirtualSize: NullabilityOmittedNonRequiredField(Schema.Int),

    /** User-defined key/value metadata. */
    Labels: NonNullableRequiredField(Schema.Record(Schema.String, Schema.String)),

    /**
     * Number of containers using this image. Includes both stopped and running
     * containers.
     *
     * This size is not calculated by default, and depends on which API endpoint
     * is used. `-1` indicates that the value has not been set / calculated.
     */
    Containers: NonNullableRequiredField(Schema.Int),
}) {}

export class AuthConfig extends Schema.Class<AuthConfig>("AuthConfig")({
    username: NullabilityOmittedNonRequiredField(Schema.String),
    password: NullabilityOmittedNonRequiredField(Schema.String),
    email: NullabilityOmittedNonRequiredField(Schema.String),
    serveraddress: NullabilityOmittedNonRequiredField(Schema.String),
}) {}

export class ProcessConfig extends Schema.Class<ProcessConfig>("ProcessConfig")({
    privileged: NullabilityOmittedNonRequiredField(Schema.Boolean),
    user: NullabilityOmittedNonRequiredField(Schema.String),
    tty: NullabilityOmittedNonRequiredField(Schema.Boolean),
    entrypoint: NullabilityOmittedNonRequiredField(Schema.String),
    arguments: NullabilityOmittedNonRequiredField(Schema.Array(Schema.String)),
}) {}

export class IPAMConfig extends Schema.Class<IPAMConfig>("IPAMConfig")({
    Subnet: NullabilityOmittedNonRequiredField(Schema.String),
    IPRange: NullabilityOmittedNonRequiredField(Schema.String),
    Gateway: NullabilityOmittedNonRequiredField(Schema.String),
    AuxiliaryAddresses: NullabilityOmittedNonRequiredField(Schema.Record(Schema.String, Schema.String)),
}) {}

export class NetworkContainer extends Schema.Class<NetworkContainer>("NetworkContainer")({
    Name: NullabilityOmittedNonRequiredField(Schema.String),
    EndpointID: NullabilityOmittedNonRequiredField(Schema.String),
    MacAddress: NullabilityOmittedNonRequiredField(Schema.String),
    IPv4Address: NullabilityOmittedNonRequiredField(Schema.String),
    IPv6Address: NullabilityOmittedNonRequiredField(Schema.String),
}) {}

/** BuildCache contains information about a build cache record. */
export class BuildCache extends Schema.Class<BuildCache>("BuildCache")({
    /** Unique ID of the build cache record. */
    ID: NullabilityOmittedNonRequiredField(Schema.String),

    /**
     * ID of the parent build cache record.> **Deprecated**: This field is
     * deprecated, and omitted if empty.
     */
    Parent: NullableNonRequiredField(Schema.String),

    /** List of parent build cache record IDs. */
    Parents: NullableNonRequiredField(Schema.Array(Schema.String)),

    /** Cache record type. */
    Type: NullabilityOmittedNonRequiredField(
        Schema.Union(
            Schema.Literal("internal"),
            Schema.Literal("frontend"),
            Schema.Literal("source.local"),
            Schema.Literal("source.git.checkout"),
            Schema.Literal("exec.cachemount"),
            Schema.Literal("regular")
        )
    ),

    /** Description of the build-step that produced the build cache. */
    Description: NullabilityOmittedNonRequiredField(Schema.String),

    /** Indicates if the build cache is in use. */
    InUse: NullabilityOmittedNonRequiredField(Schema.Boolean),

    /** Indicates if the build cache is shared. */
    Shared: NullabilityOmittedNonRequiredField(Schema.Boolean),

    /** Amount of disk space used by the build cache (in bytes). */
    Size: NullabilityOmittedNonRequiredField(Schema.Int),

    /**
     * Date and time at which the build cache was created in [RFC
     * 3339](https://www.ietf.org/rfc/rfc3339.txt) format with nano-seconds.
     */
    CreatedAt: NullabilityOmittedNonRequiredField(Schema.String),

    /**
     * Date and time at which the build cache was last used in [RFC
     * 3339](https://www.ietf.org/rfc/rfc3339.txt) format with nano-seconds.
     */
    LastUsedAt: NullableNonRequiredField(Schema.String),
    UsageCount: NullabilityOmittedNonRequiredField(Schema.Int),
}) {}

/** Image ID or Digest */
export class ImageID extends Schema.Class<ImageID>("ImageID")({
    ID: NullabilityOmittedNonRequiredField(Schema.String),
}) {}

export class ErrorDetail extends Schema.Class<ErrorDetail>("ErrorDetail")({
    code: NullabilityOmittedNonRequiredField(Schema.Int),
    message: NullabilityOmittedNonRequiredField(Schema.String),
}) {}

export class ProgressDetail extends Schema.Class<ProgressDetail>("ProgressDetail")({
    current: NullabilityOmittedNonRequiredField(Schema.Int),
    total: NullabilityOmittedNonRequiredField(Schema.Int),
}) {}

export class ErrorResponse extends Schema.Class<ErrorResponse>("ErrorResponse")({
    message: NonNullableRequiredField(Schema.String),
}) {}

export class IdResponse extends Schema.Class<IdResponse>("IdResponse")({
    /** The id of the newly created object. */
    Id: NonNullableRequiredField(Schema.String),
}) {}

export class IDResponse extends Schema.Class<IDResponse>("IDResponse")({
    /** The id of the newly created object. */
    ID: NonNullableRequiredField(Schema.String),
}) {}

// TODO: This also has x-nullable at the top level, what does that mean for consumers
export class EndpointIPAMConfig extends Schema.Class<EndpointIPAMConfig>("EndpointIPAMConfig")({
    IPv4Address: NullabilityOmittedNonRequiredField(Schema.String),
    IPv6Address: NullabilityOmittedNonRequiredField(Schema.String),
    LinkLocalIPs: NullabilityOmittedNonRequiredField(Schema.Array(Schema.String)),
}) {}

export class PluginMount extends Schema.Class<PluginMount>("PluginMount")({
    Name: NonNullableRequiredField(Schema.String),
    Description: NonNullableRequiredField(Schema.String),
    Settable: NullabilityOmittedRequiredField(Schema.Array(Schema.String)),
    Source: NullabilityOmittedRequiredField(Schema.String),
    Destination: NonNullableRequiredField(Schema.String),
    Type: NonNullableRequiredField(Schema.String),
    Options: NullabilityOmittedRequiredField(Schema.Array(Schema.String)),
}) {}

export class PluginDevice extends Schema.Class<PluginDevice>("PluginDevice")({
    Name: NonNullableRequiredField(Schema.String),
    Description: NonNullableRequiredField(Schema.String),
    Settable: NullabilityOmittedRequiredField(Schema.Array(Schema.String)),
    Path: NullabilityOmittedRequiredField(Schema.String),
}) {}

export class PluginEnvironment extends Schema.Class<PluginEnvironment>("PluginEnvironment")({
    Name: NonNullableRequiredField(Schema.String),
    Description: NonNullableRequiredField(Schema.String),
    Settable: NullabilityOmittedRequiredField(Schema.Array(Schema.String)),
    Value: NullabilityOmittedRequiredField(Schema.String),
}) {}

export class PluginInterfaceType extends Schema.Class<PluginInterfaceType>("PluginInterfaceType")({
    Prefix: NonNullableRequiredField(Schema.String),
    Capability: NonNullableRequiredField(Schema.String),
    Version: NonNullableRequiredField(Schema.String),
}) {}

export class PluginPrivilege extends Schema.Class<PluginPrivilege>("PluginPrivilege")({
    Name: NullabilityOmittedNonRequiredField(Schema.String),
    Description: NullabilityOmittedNonRequiredField(Schema.String),
    Value: NullabilityOmittedNonRequiredField(Schema.Array(Schema.String)),
}) {}

export class NodeSpec extends Schema.Class<NodeSpec>("NodeSpec")({
    /** Name for the node. */
    Name: NullabilityOmittedNonRequiredField(Schema.String),

    /** User-defined key/value metadata. */
    Labels: NullabilityOmittedNonRequiredField(Schema.Record(Schema.String, Schema.String)),

    /** Role of the node. */
    Role: NullabilityOmittedNonRequiredField(Schema.Union(Schema.Literal("worker"), Schema.Literal("manager"))),

    /** Availability of the node. */
    Availability: NullabilityOmittedNonRequiredField(
        Schema.Union(Schema.Literal("active"), Schema.Literal("pause"), Schema.Literal("drain"))
    ),
}) {}

export class Platform extends Schema.Class<Platform>("Platform")({
    /**
     * Architecture represents the hardware architecture (for example,
     * `x86_64`).
     */
    Architecture: NullabilityOmittedNonRequiredField(Schema.String),

    /** OS represents the Operating System (for example, `linux` or `windows`). */
    OS: NullabilityOmittedNonRequiredField(Schema.String),
}) {}

export class EngineDescription extends Schema.Class<EngineDescription>("EngineDescription")({
    EngineVersion: NullabilityOmittedNonRequiredField(Schema.String),
    Labels: NullabilityOmittedNonRequiredField(Schema.Record(Schema.String, Schema.String)),
    Plugins: NullabilityOmittedNonRequiredField(
        Schema.Array(
            Schema.Struct({
                Type: NullabilityOmittedNonRequiredField(Schema.String),
                Name: NullabilityOmittedNonRequiredField(Schema.String),
            })
        )
    ),
}) {}

/**
 * Information about the issuer of leaf TLS certificates and the trusted root CA
 * certificate
 */
export class TLSInfo extends Schema.Class<TLSInfo>("TLSInfo")({
    /**
     * The root CA certificate(s) that are used to validate leaf TLS
     * certificates.
     */
    TrustRoot: NullabilityOmittedNonRequiredField(Schema.String),

    /** The base64-url-safe-encoded raw subject bytes of the issuer. */
    CertIssuerSubject: NullabilityOmittedNonRequiredField(Schema.String),

    /** The base64-url-safe-encoded raw public key bytes of the issuer. */
    CertIssuerPublicKey: NullabilityOmittedNonRequiredField(Schema.String),
}) {}

export class SwarmSpec extends Schema.Class<SwarmSpec>("SwarmSpec")({
    /** Name of the swarm. */
    Name: NullabilityOmittedNonRequiredField(Schema.String),

    /** User-defined key/value metadata. */
    Labels: NullabilityOmittedNonRequiredField(Schema.Record(Schema.String, Schema.String)),

    /** Orchestration configuration. */
    Orchestration: NullableNonRequiredField(
        Schema.Struct({
            /**
             * The number of historic tasks to keep per instance or node. If
             * negative, never remove completed or failed tasks.
             */
            TaskHistoryRetentionLimit: NullabilityOmittedNonRequiredField(Schema.Int),
        })
    ),

    /** Raft configuration. */
    Raft: NullabilityOmittedNonRequiredField(
        Schema.Struct({
            /** The number of log entries between snapshots. */
            SnapshotInterval: NullabilityOmittedNonRequiredField(Schema.Int),

            /** The number of snapshots to keep beyond the current snapshot. */
            KeepOldSnapshots: NullabilityOmittedNonRequiredField(Schema.Int),

            /**
             * The number of log entries to keep around to sync up slow
             * followers after a snapshot is created.
             */
            LogEntriesForSlowFollowers: NullabilityOmittedNonRequiredField(Schema.Int),

            /**
             * The number of ticks that a follower will wait for a message from
             * the leader before becoming a candidate and starting an election.
             * `ElectionTick` must be greater than `HeartbeatTick`.
             *
             * A tick currently defaults to one second, so these translate
             * directly to seconds currently, but this is NOT guaranteed.
             */
            ElectionTick: NullabilityOmittedNonRequiredField(Schema.Int),

            /**
             * The number of ticks between heartbeats. Every HeartbeatTick
             * ticks, the leader will send a heartbeat to the followers.
             *
             * A tick currently defaults to one second, so these translate
             * directly to seconds currently, but this is NOT guaranteed.
             */
            HeartbeatTick: NullabilityOmittedNonRequiredField(Schema.Int),
        })
    ),

    /** Dispatcher configuration. */
    Dispatcher: NullableNonRequiredField(
        Schema.Struct({
            /** The delay for an agent to send a heartbeat to the dispatcher. */
            HeartbeatPeriod: NullabilityOmittedNonRequiredField(Schema.Int),
        })
    ),

    /** CA configuration. */
    CAConfig: NullableNonRequiredField(
        Schema.Struct({
            /** The duration node certificates are issued for. */
            NodeCertExpiry: NullabilityOmittedNonRequiredField(Schema.Int),

            /**
             * Configuration for forwarding signing requests to an external
             * certificate authority.
             */
            ExternalCAs: NullabilityOmittedNonRequiredField(
                Schema.Array(
                    Schema.Struct({
                        /**
                         * Protocol for communication with the external CA
                         * (currently only `cfssl` is supported).
                         */
                        Protocol: NullabilityOmittedNonRequiredField(Schema.Literal("cfssl"), {
                            default: () => "cfssl" as const,
                        }),

                        /**
                         * URL where certificate signing requests should be
                         * sent.
                         */
                        URL: NullabilityOmittedNonRequiredField(Schema.String),

                        /**
                         * An object with key/value pairs that are interpreted
                         * as protocol-specific options for the external CA
                         * driver.
                         */
                        Options: NullabilityOmittedNonRequiredField(Schema.Record(Schema.String, Schema.String)),

                        /**
                         * The root CA certificate (in PEM format) this external
                         * CA uses to issue TLS certificates (assumed to be to
                         * the current swarm root CA certificate if not
                         * provided).
                         */
                        CACert: NullabilityOmittedNonRequiredField(Schema.String),
                    })
                )
            ),

            /**
             * The desired signing CA certificate for all swarm node TLS leaf
             * certificates, in PEM format.
             */
            SigningCACert: NullabilityOmittedNonRequiredField(Schema.String),

            /**
             * The desired signing CA key for all swarm node TLS leaf
             * certificates, in PEM format.
             */
            SigningCAKey: NullabilityOmittedNonRequiredField(Schema.String),

            /**
             * An integer whose purpose is to force swarm to generate a new
             * signing CA certificate and key, if none have been specified in
             * `SigningCACert` and `SigningCAKey`
             */
            ForceRotate: NullabilityOmittedNonRequiredField(Schema.Int),
        })
    ),

    /** Parameters related to encryption-at-rest. */
    EncryptionConfig: NullabilityOmittedNonRequiredField(
        Schema.Struct({
            /**
             * If set, generate a key and use it to lock data stored on the
             * managers.
             */
            AutoLockManagers: NullabilityOmittedNonRequiredField(Schema.Boolean),
        })
    ),

    /** Defaults for creating tasks in this cluster. */
    TaskDefaults: NullabilityOmittedNonRequiredField(
        Schema.Struct({
            /**
             * The log driver to use for tasks created in the orchestrator if
             * unspecified by a service.
             *
             * Updating this value only affects new tasks. Existing tasks
             * continue to use their previously configured log driver until
             * recreated.
             */
            LogDriver: NullabilityOmittedNonRequiredField(
                Schema.Struct({
                    /** The log driver to use as a default for new tasks. */
                    Name: NullabilityOmittedNonRequiredField(Schema.String),

                    /**
                     * Driver-specific options for the selected log driver,
                     * specified as key/value pairs.
                     */
                    Options: NullabilityOmittedNonRequiredField(Schema.Record(Schema.String, Schema.String)),
                })
            ),
        })
    ),
}) {}

/** JoinTokens contains the tokens workers and managers need to join the swarm. */
export class JoinTokens extends Schema.Class<JoinTokens>("JoinTokens")({
    /** The token workers can use to join the swarm. */
    Worker: NullabilityOmittedNonRequiredField(Schema.String),

    /** The token managers can use to join the swarm. */
    Manager: NullabilityOmittedNonRequiredField(Schema.String),
}) {}

export class EndpointPortConfig extends Schema.Class<EndpointPortConfig>("EndpointPortConfig")({
    Name: NullabilityOmittedNonRequiredField(Schema.String),
    Protocol: NullabilityOmittedNonRequiredField(
        Schema.Union(Schema.Literal("tcp"), Schema.Literal("udp"), Schema.Literal("sctp"))
    ),

    /** The port inside the container. */
    TargetPort: NullabilityOmittedNonRequiredField(Schema.Int),

    /** The port on the swarm hosts. */
    PublishedPort: NullabilityOmittedNonRequiredField(Schema.Int),

    /**
     * The mode in which port is published.<p><br /></p>
     *
     * - "ingress" makes the target port accessible on every node, regardless of
     *   whether there is a task for the service running on that node or not.
     * - "host" bypasses the routing mesh and publish the port directly on the
     *   swarm node where that service is running.
     */
    PublishMode: NullabilityOmittedNonRequiredField(Schema.Union(Schema.Literal("ingress"), Schema.Literal("host")), {
        default: () => "ingress" as const,
    }),
}) {}

export class DeleteResponse extends Schema.Class<DeleteResponse>("ImageDeleteResponseItem")({
    /** The image ID of an image that was untagged */
    Untagged: NullabilityOmittedNonRequiredField(Schema.String),

    /** The image ID of an image that was deleted */
    Deleted: NullabilityOmittedNonRequiredField(Schema.String),
}) {}

export class ServiceCreateResponse extends Schema.Class<ServiceCreateResponse>("ServiceCreateResponse")({
    ID: NonNullableNonRequiredField(Schema.String),

    /** Optional warning messages */
    Warnings: NullableNonRequiredField(Schema.Array(Schema.String)),
}) {}

export class ServiceUpdateResponse extends Schema.Class<ServiceUpdateResponse>("ServiceUpdateResponse")({
    /** Optional warning messages */
    Warnings: NullabilityOmittedNonRequiredField(Schema.Array(Schema.String)),
}) {}

export class Driver extends Schema.Class<Driver>("Driver")({
    /** Name of the driver. */
    Name: NonNullableRequiredField(Schema.String),

    /** Key/value map of driver-specific options. */
    Options: NonNullableNonRequiredField(Schema.Record(Schema.String, Schema.String)),
}) {}

export class ContainerCreateResponse extends Schema.Class<ContainerCreateResponse>("ContainerCreateResponse")({
    /** The ID of the created container */
    Id: NonNullableRequiredField(Schema.String),

    /** Warnings encountered when creating the container */
    Warnings: NonNullableRequiredField(Schema.Array(Schema.String)),
}) {}

export class ContainerWaitExitError extends Schema.Class<ContainerWaitExitError>("ContainerWaitExitError")({
    /** Details of an error */
    Message: NullabilityOmittedNonRequiredField(Schema.String),
}) {}

export class SystemVersion extends Schema.Class<SystemVersion>("SystemVersion")({
    Platform: NullabilityOmittedNonRequiredField(
        Schema.Struct({ Name: NullabilityOmittedRequiredField(Schema.String) })
    ),

    /** Information about system components */
    Components: NullabilityOmittedNonRequiredField(
        Schema.Array(
            Schema.Struct({
                /** Name of the component */
                Name: NullabilityOmittedRequiredField(Schema.String),

                /** Version of the component */
                Version: NonNullableRequiredField(Schema.String),

                /**
                 * Key/value pairs of strings with additional information about
                 * the component. These values are intended for informational
                 * purposes only, and their content is not defined, and not part
                 * of the API specification.
                 *
                 * These messages can be printed by the client as information to
                 * the user.
                 */
                Details: NullableNonRequiredField(Schema.Record(Schema.String, Schema.String)),
            })
        )
    ),

    /** The version of the daemon */
    Version: NullabilityOmittedNonRequiredField(Schema.String),

    /** The default (and highest) API version that is supported by the daemon */
    ApiVersion: NullabilityOmittedNonRequiredField(Schema.String),

    /** The minimum API version that is supported by the daemon */
    MinAPIVersion: NullabilityOmittedNonRequiredField(Schema.String),

    /** The Git commit of the source code that was used to build the daemon */
    GitCommit: NullabilityOmittedNonRequiredField(Schema.String),

    /**
     * The version Go used to compile the daemon, and the version of the Go
     * runtime in use.
     */
    GoVersion: NullabilityOmittedNonRequiredField(Schema.String),

    /** The operating system that the daemon is running on ("linux" or "windows") */
    Os: NullabilityOmittedNonRequiredField(Schema.String),

    /** The architecture that the daemon is running on */
    Arch: NullabilityOmittedNonRequiredField(Schema.String),

    /**
     * The kernel version (`uname -r`) that the daemon is running on.
     *
     * This field is omitted when empty.
     */
    KernelVersion: NullabilityOmittedNonRequiredField(Schema.String),

    /**
     * Indicates if the daemon is started with experimental features enabled.
     *
     * This field is omitted when empty / false.
     */
    Experimental: NullabilityOmittedNonRequiredField(Schema.Boolean),

    /** The date and time that the daemon was compiled. */
    BuildTime: NullabilityOmittedNonRequiredField(Schema.String),
}) {}

export class PluginsInfo extends Schema.Class<PluginsInfo>("PluginsInfo")({
    /** Names of available volume-drivers, and network-driver plugins. */
    Volume: NullabilityOmittedNonRequiredField(Schema.Array(Schema.String)),

    /** Names of available network-drivers, and network-driver plugins. */
    Network: NullabilityOmittedNonRequiredField(Schema.Array(Schema.String)),

    /** Names of available authorization plugins. */
    Authorization: NullabilityOmittedNonRequiredField(Schema.Array(Schema.String)),

    /** Names of available logging-drivers, and logging-driver plugins. */
    Log: NullabilityOmittedNonRequiredField(Schema.Array(Schema.String)),
}) {}

// FIXME: has top level nullability: true
export class IndexInfo extends Schema.Class<IndexInfo>("IndexInfo")({
    /** Name of the registry, such as "docker.io". */
    Name: NullabilityOmittedNonRequiredField(Schema.String),

    /** List of mirrors, expressed as URIs. */
    Mirrors: NullabilityOmittedNonRequiredField(Schema.Array(Schema.String)),

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
    Secure: NullabilityOmittedNonRequiredField(Schema.Boolean),

    /**
     * Indicates whether this is an official registry (i.e., Docker Hub /
     * docker.io)
     */
    Official: NullabilityOmittedNonRequiredField(Schema.Boolean),
}) {}

export class Runtime extends Schema.Class<Runtime>("Runtime")({
    status: NullableNonRequiredField(Schema.Record(Schema.String, Schema.String)),

    /**
     * Name and, optional, path, of the OCI executable binary.
     *
     * If the path is omitted, the daemon searches the host's `$PATH` for the
     * binary and uses the first result.
     */
    path: NullabilityOmittedNonRequiredField(Schema.String),

    /** List of command-line arguments to pass to the runtime when invoked. */
    runtimeArgs: NullableNonRequiredField(Schema.Array(Schema.String)),
}) {}

export class Commit extends Schema.Class<Commit>("Commit")({
    /** Actual commit ID of external tool. */
    ID: NullabilityOmittedNonRequiredField(Schema.String),

    /** Commit ID of external tool expected by dockerd as set at build time. */
    Expected: NullabilityOmittedNonRequiredField(Schema.String),
}) {}

export class PeerNode extends Schema.Class<PeerNode>("PeerNode")({
    /** Unique identifier of for this node in the swarm. */
    NodeID: NullabilityOmittedNonRequiredField(Schema.String),

    /** IP address and ports at which this node can be reached. */
    Addr: NullabilityOmittedNonRequiredField(Schema.String),
}) {}

export class NetworkAttachmentConfig extends Schema.Class<NetworkAttachmentConfig>("NetworkAttachmentConfig")({
    /** The target network for attachment. Must be a network name or ID. */
    Target: NullabilityOmittedNonRequiredField(Schema.String),

    /** Discoverable alternate names for the service on this network. */
    Aliases: NullabilityOmittedNonRequiredField(Schema.Array(Schema.String)),

    /** Driver attachment options for the network target. */
    DriverOpts: NullabilityOmittedNonRequiredField(Schema.Record(Schema.String, Schema.String)),
}) {}

export class EventActor extends Schema.Class<EventActor>("EventActor")({
    /** The ID of the object emitting the event */
    ID: NullabilityOmittedNonRequiredField(Schema.String),

    /** Various key/value attributes of the object, depending on its type. */
    Attributes: NullabilityOmittedNonRequiredField(Schema.Record(Schema.String, Schema.String)),
}) {}

export class OCIDescriptor extends Schema.Class<OCIDescriptor>("OCIDescriptor")({
    /** The media type of the object this schema refers to. */
    mediaType: NullabilityOmittedNonRequiredField(Schema.String),

    /** The digest of the targeted content. */
    digest: NullabilityOmittedNonRequiredField(Schema.String),

    /** The size in bytes of the blob. */
    size: NullabilityOmittedNonRequiredField(Schema.Int),
}) {}

export class OCIPlatform extends Schema.Class<OCIPlatform>("OCIPlatform")({
    /** The CPU architecture, for example `amd64` or `ppc64`. */
    architecture: NullabilityOmittedNonRequiredField(Schema.String),

    /** The operating system, for example `linux` or `windows`. */
    os: NullabilityOmittedNonRequiredField(Schema.String),

    /**
     * Optional field specifying the operating system version, for example on
     * Windows `10.0.19041.1165`.
     */
    "os.version": NullabilityOmittedNonRequiredField(Schema.String),

    /**
     * Optional field specifying an array of strings, each listing a required OS
     * feature (for example on Windows `win32k`).
     */
    "os.features": NullabilityOmittedNonRequiredField(Schema.Array(Schema.String)),

    /**
     * Optional field specifying a variant of the CPU, for example `v7` to
     * specify ARMv7 when architecture is `arm`.
     */
    variant: NullabilityOmittedNonRequiredField(Schema.String),
}) {}

export class Resources extends Schema.Class<Resources>("Resources")({
    /**
     * An integer value representing this container's relative CPU weight versus
     * other containers.
     */
    CpuShares: NullabilityOmittedNonRequiredField(Schema.Number),

    /** Memory limit in bytes. */
    Memory: NullabilityOmittedNonRequiredField(Schema.Int, { default: () => 0 }),

    /**
     * Path to `cgroups` under which the container's `cgroup` is created. If the
     * path is not absolute, the path is considered to be relative to the
     * `cgroups` path of the init process. Cgroups are created if they do not
     * already exist.
     */
    CgroupParent: NullabilityOmittedNonRequiredField(Schema.String),

    /** Block IO weight (relative weight). */
    BlkioWeight: NullabilityOmittedNonRequiredField(Schema.Int.pipe(Schema.between(0, 1000))),

    /**
     * Block IO weight (relative device weight) in the form:
     *
     *     [{ Path: "device_path", Weight: weight }];
     */
    BlkioWeightDevice: NullabilityOmittedNonRequiredField(
        Schema.Array(
            Schema.Struct({
                Path: NullabilityOmittedNonRequiredField(Schema.String),
                Weight: NullabilityOmittedNonRequiredField(Schema.Int.pipe(Schema.greaterThanOrEqualTo(0))),
            })
        )
    ),

    /**
     * Limit read rate (bytes per second) from a device, in the form:
     *
     *     [{ Path: "device_path", Rate: rate }];
     */
    BlkioDeviceReadBps: NullabilityOmittedNonRequiredField(Schema.Array(ThrottleDevice)),

    /**
     * Limit write rate (bytes per second) to a device, in the form:
     *
     *     [{ Path: "device_path", Rate: rate }];
     */
    BlkioDeviceWriteBps: NullabilityOmittedNonRequiredField(Schema.Array(ThrottleDevice)),

    /**
     * Limit read rate (IO per second) from a device, in the form:
     *
     *     [{ Path: "device_path", Rate: rate }];
     */
    BlkioDeviceReadIOps: NullabilityOmittedNonRequiredField(Schema.Array(ThrottleDevice)),

    /**
     * Limit write rate (IO per second) to a device, in the form:
     *
     *     [{ Path: "device_path", Rate: rate }];
     */
    BlkioDeviceWriteIOps: NullabilityOmittedNonRequiredField(Schema.Array(ThrottleDevice)),

    /** The length of a CPU period in microseconds. */
    CpuPeriod: NullabilityOmittedNonRequiredField(Schema.Int),

    /** Microseconds of CPU time that the container can get in a CPU period. */
    CpuQuota: NullabilityOmittedNonRequiredField(Schema.Int),

    /**
     * The length of a CPU real-time period in microseconds. Set to 0 to
     * allocate no time allocated to real-time tasks.
     */
    CpuRealtimePeriod: NullabilityOmittedNonRequiredField(Schema.Int),

    /**
     * The length of a CPU real-time runtime in microseconds. Set to 0 to
     * allocate no time allocated to real-time tasks.
     */
    CpuRealtimeRuntime: NullabilityOmittedNonRequiredField(Schema.Int),

    /** CPUs in which to allow execution (e.g., `0-3`, `0,1`). */
    CpusetCpus: NullabilityOmittedNonRequiredField(Schema.String),

    /**
     * Memory nodes (MEMs) in which to allow execution (0-3, 0,1). Only
     * effective on NUMA systems.
     */
    CpusetMems: NullabilityOmittedNonRequiredField(Schema.String),

    /** A list of devices to add to the container. */
    Devices: NullabilityOmittedNonRequiredField(Schema.Array(DeviceMapping)),

    /** A list of cgroup rules to apply to the container */
    DeviceCgroupRules: NullabilityOmittedNonRequiredField(Schema.Array(Schema.String)),

    /** A list of requests for devices to be sent to device drivers. */
    DeviceRequests: NullabilityOmittedNonRequiredField(Schema.Array(DeviceRequest)),

    /**
     * Hard limit for kernel TCP buffer memory (in bytes). Depending on the OCI
     * runtime in use, this option may be ignored. It is no longer supported by
     * the default (runc) runtime.
     *
     * This field is omitted when empty.
     */
    KernelMemoryTCP: NullabilityOmittedNonRequiredField(Schema.Int),

    /** Memory soft limit in bytes. */
    MemoryReservation: NullabilityOmittedNonRequiredField(Schema.Int),

    /** Total memory limit (memory + swap). Set as `-1` to enable unlimited swap. */
    MemorySwap: NullabilityOmittedNonRequiredField(Schema.Int),

    /**
     * Tune a container's memory swappiness behavior. Accepts an integer between
     * 0 and 100.
     */
    MemorySwappiness: NullabilityOmittedNonRequiredField(Schema.Int.pipe(Schema.between(0, 100))),

    /** CPU quota in units of 10<sup>-9</sup> CPUs. */
    NanoCpus: NullabilityOmittedNonRequiredField(Schema.Int),

    /** Disable OOM Killer for the container. */
    OomKillDisable: NullabilityOmittedNonRequiredField(Schema.Boolean),

    /**
     * Run an init inside the container that forwards signals and reaps
     * processes. This field is omitted if empty, and the default (as configured
     * on the daemon) is used.
     */
    Init: NullableNonRequiredField(Schema.Boolean),

    /**
     * Tune a container's PIDs limit. Set `0` or `-1` for unlimited, or `null`
     * to not change.
     */
    PidsLimit: NullableNonRequiredField(Schema.Int),

    /**
     * A list of resource limits to set in the container. For example:
     *
     *     { "Name": "nofile", "Soft": 1024, "Hard": 2048 }
     */
    Ulimits: NullabilityOmittedNonRequiredField(
        Schema.Array(
            Schema.Struct({
                /** Name of ulimit */
                Name: NullabilityOmittedNonRequiredField(Schema.String),

                /** Soft limit */
                Soft: NullabilityOmittedNonRequiredField(Schema.Number),

                /** Hard limit */
                Hard: NullabilityOmittedNonRequiredField(Schema.Number),
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
    CpuCount: NullabilityOmittedNonRequiredField(Schema.Int),

    /**
     * The usable percentage of the available CPUs (Windows only).
     *
     * On Windows Server containers, the processor resource controls are
     * mutually exclusive. The order of precedence is `CPUCount` first, then
     * `CPUShares`, and `CPUPercent` last.
     */
    CpuPercent: NullabilityOmittedNonRequiredField(Schema.Int),

    /** Maximum IOps for the container system drive (Windows only) */
    IOMaximumIOps: NullabilityOmittedNonRequiredField(Schema.Int),

    /**
     * Maximum IO in bytes per second for the container system drive (Windows
     * only).
     */
    IOMaximumBandwidth: NullabilityOmittedNonRequiredField(Schema.Int),
}) {}

// FIXME: This has top level nullability: true
export class RegistryServiceConfig extends Schema.Class<RegistryServiceConfig>("RegistryServiceConfig")({
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
    AllowNondistributableArtifactsCIDRs: NullabilityOmittedNonRequiredField(Schema.Array(Schema.String)),

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
    AllowNondistributableArtifactsHostnames: NullabilityOmittedNonRequiredField(Schema.Array(Schema.String)),

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
    InsecureRegistryCIDRs: NullabilityOmittedNonRequiredField(Schema.Array(Schema.String)),
    IndexConfigs: NullabilityOmittedNonRequiredField(Schema.Record(Schema.String, IndexInfo)),

    /**
     * List of registry URLs that act as a mirror for the official (`docker.io`)
     * registry.
     */
    Mirrors: NullabilityOmittedNonRequiredField(Schema.Array(Schema.String)),
}) {}

export class ContainerConfig extends Schema.Class<ContainerConfig>("ContainerConfig")({
    /** The hostname to use for the container, as a valid RFC 1123 hostname. */
    Hostname: NullabilityOmittedNonRequiredField(Schema.String),

    /** The domain name to use for the container. */
    Domainname: NullabilityOmittedNonRequiredField(Schema.String),

    /** The user that commands are run as inside the container. */
    User: NullabilityOmittedNonRequiredField(Schema.String),

    /** Whether to attach to `stdin`. */
    AttachStdin: NullabilityOmittedNonRequiredField(Schema.Boolean, { default: () => false }),

    /** Whether to attach to `stdout`. */
    AttachStdout: NullabilityOmittedNonRequiredField(Schema.Boolean, { default: () => true }),

    /** Whether to attach to `stderr`. */
    AttachStderr: NullabilityOmittedNonRequiredField(Schema.Boolean, { default: () => true }),

    /**
     * An object mapping ports to an empty object in the form:
     *
     * `{"<port>/<tcp|udp|sctp>": {}}`
     */
    ExposedPorts: NullableNonRequiredField(Schema.Record(Schema.String, Schema.Struct({}))),

    /** Attach standard streams to a TTY, including `stdin` if it is not closed. */
    Tty: NullabilityOmittedNonRequiredField(Schema.Boolean, { default: () => false }),

    /** Open `stdin` */
    OpenStdin: NullabilityOmittedNonRequiredField(Schema.Boolean, { default: () => false }),

    /** Close `stdin` after one attached client disconnects */
    StdinOnce: NullabilityOmittedNonRequiredField(Schema.Boolean, { default: () => false }),

    /**
     * A list of environment variables to set inside the container in the form
     * `["VAR=value", ...]`. A variable without `=` is removed from the
     * environment, rather than to have an empty value.
     */
    Env: NullabilityOmittedNonRequiredField(Schema.Array(Schema.String)),

    /** Command to run specified as a string or an array of strings. */
    Cmd: NullabilityOmittedNonRequiredField(Schema.Array(Schema.String)),
    Healthcheck: NullabilityOmittedNonRequiredField(HealthConfig),

    /** Command is already escaped (Windows only) */
    ArgsEscaped: NullableNonRequiredField(Schema.Boolean, { default: () => false }),

    /**
     * The name (or reference) of the image to use when creating the container,
     * or which was used when the container was created.
     */
    Image: NullabilityOmittedNonRequiredField(Schema.String),

    /**
     * An object mapping mount point paths inside the container to empty
     * objects.
     */
    Volumes: NullabilityOmittedNonRequiredField(Schema.Record(Schema.String, Schema.Struct({}))),

    /** The working directory for commands to run in. */
    WorkingDir: NullabilityOmittedNonRequiredField(Schema.String),

    /**
     * The entry point for the container as a string or an array of strings.
     *
     * If the array consists of exactly one empty string (`[""]`) then the entry
     * point is reset to system default (i.e., the entry point used by docker
     * when there is no `ENTRYPOINT` instruction in the `Dockerfile`).
     */
    Entrypoint: NullabilityOmittedNonRequiredField(Schema.Array(Schema.String)),

    /** Disable networking for the container. */
    NetworkDisabled: NullableNonRequiredField(Schema.Boolean),

    /** MAC address of the container. */
    MacAddress: NullableNonRequiredField(Schema.String),

    /** `ONBUILD` metadata that were defined in the image's `Dockerfile`. */
    OnBuild: NullableNonRequiredField(Schema.Array(Schema.String)),

    /** User-defined key/value metadata. */
    Labels: NullabilityOmittedNonRequiredField(Schema.Record(Schema.String, Schema.String)),

    /** Signal to stop a container as a string or unsigned integer. */
    StopSignal: NullableNonRequiredField(Schema.String),

    /** Timeout to stop a container in seconds. */
    StopTimeout: NullableNonRequiredField(Schema.Number),

    /** Shell for when `RUN`, `CMD`, and `ENTRYPOINT` uses a shell. */
    Shell: NullableNonRequiredField(Schema.Array(Schema.String)),
}) {}

export class ResourceObject extends Schema.Class<ResourceObject>("ResourceObject")({
    NanoCPUs: NullableNonRequiredField(Schema.Int),
    MemoryBytes: NullableNonRequiredField(Schema.Int),
    GenericResources: NullableNonRequiredField(GenericResources),
}) {}

export class TaskSpec extends Schema.Class<TaskSpec>("TaskSpec")({
    /**
     * Plugin spec for the service. _(Experimental release only.)_<p><br /></p>>
     * **Note**: ContainerSpec, NetworkAttachmentSpec, and PluginSpec are>
     * Mutually exclusive. PluginSpec is only used when the Runtime field is
     * set> To `plugin`. NetworkAttachmentSpec is used when the Runtime field is
     * set> To `attachment`.
     */
    PluginSpec: NullabilityOmittedNonRequiredField(
        Schema.Struct({
            /** The name or 'alias' to use for the plugin. */
            Name: NullabilityOmittedNonRequiredField(Schema.String),

            /** The plugin image reference to use. */
            Remote: NullabilityOmittedNonRequiredField(Schema.String),

            /** Disable the plugin once scheduled. */
            Disabled: NullabilityOmittedNonRequiredField(Schema.Boolean),
            PluginPrivilege: NullabilityOmittedNonRequiredField(Schema.Array(PluginPrivilege)),
        })
    ),

    /**
     * Container spec for the service.<p><br /></p>> **Note**: ContainerSpec,
     * NetworkAttachmentSpec, and PluginSpec are> Mutually exclusive. PluginSpec
     * is only used when the Runtime field is set> To `plugin`.
     * NetworkAttachmentSpec is used when the Runtime field is set> To
     * `attachment`.
     */
    ContainerSpec: NullabilityOmittedNonRequiredField(
        Schema.Struct({
            /** The image name to use for the container */
            Image: NullabilityOmittedNonRequiredField(Schema.String),

            /** User-defined key/value data. */
            Labels: NullabilityOmittedNonRequiredField(Schema.Record(Schema.String, Schema.String)),

            /** The command to be run in the image. */
            Command: NullabilityOmittedNonRequiredField(Schema.Array(Schema.String)),

            /** Arguments to the command. */
            Args: NullabilityOmittedNonRequiredField(Schema.Array(Schema.String)),

            /**
             * The hostname to use for the container, as a valid [RFC
             * 1123](https://tools.ietf.org/html/rfc1123) hostname.
             */
            Hostname: NullabilityOmittedNonRequiredField(Schema.String),

            /** A list of environment variables in the form `VAR=value`. */
            Env: NullabilityOmittedNonRequiredField(Schema.Array(Schema.String)),

            /** The working directory for commands to run in. */
            Dir: NullabilityOmittedNonRequiredField(Schema.String),

            /** The user inside the container. */
            User: NullabilityOmittedNonRequiredField(Schema.String),

            /**
             * A list of additional groups that the container process will run
             * as.
             */
            Groups: NullabilityOmittedNonRequiredField(Schema.Array(Schema.String)),

            /** Security options for the container */
            Privileges: NullabilityOmittedNonRequiredField(
                Schema.Struct({
                    /** CredentialSpec for managed service account (Windows only) */
                    CredentialSpec: NullabilityOmittedNonRequiredField(
                        Schema.Struct({
                            /**
                             * Load credential spec from a Swarm Config with the
                             * given ID. The specified config must also be
                             * present in the Configs field with the Runtime
                             * property set.<p><br /></p>> **Note**:
                             * `CredentialSpec.File`, `CredentialSpec.Registry`,
                             * and> `CredentialSpec.Config` are mutually>
                             * Exclusive.
                             */
                            Config: NullabilityOmittedNonRequiredField(Schema.String),

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
                             * `CredentialSpec.Registry`, and>
                             * `CredentialSpec.Config` are mutually> Exclusive.
                             */
                            File: NullabilityOmittedNonRequiredField(Schema.String),

                            /**
                             * Load credential spec from this value in the
                             * Windows registry. The specified registry value
                             * must be located in:
                             *
                             * `HKLM\SOFTWARE\Microsoft\Windows
                             * NT\CurrentVersion\Virtualization\Containers\CredentialSpecs`<p><br
                             * /></p>> **Note**: `CredentialSpec.File`,
                             * `CredentialSpec.Registry`, and>
                             * `CredentialSpec.Config` are mutually> Exclusive.
                             */
                            Registry: NullabilityOmittedNonRequiredField(Schema.String),
                        })
                    ),

                    /** SELinux labels of the container */
                    SELinuxContext: NullabilityOmittedNonRequiredField(
                        Schema.Struct({
                            /** Disable SELinux */
                            Disable: NullabilityOmittedNonRequiredField(Schema.Boolean),

                            /** SELinux user label */
                            User: NullabilityOmittedNonRequiredField(Schema.String),

                            /** SELinux role label */
                            Role: NullabilityOmittedNonRequiredField(Schema.String),

                            /** SELinux type label */
                            Type: NullabilityOmittedNonRequiredField(Schema.String),

                            /** SELinux level label */
                            Level: NullabilityOmittedNonRequiredField(Schema.String),
                        })
                    ),

                    /** Security options for the container */
                    Seccomp: NullabilityOmittedNonRequiredField(
                        Schema.Struct({
                            Mode: NullabilityOmittedNonRequiredField(Schema.String),
                            Profile: NullabilityOmittedNonRequiredField(Schema.String),
                        })
                    ),

                    /** Options for configuring AppArmor on the container */
                    Apparmor: NullabilityOmittedNonRequiredField(
                        Schema.Struct({
                            /** AppArmor profile name */
                            Mode: NullabilityOmittedNonRequiredField(
                                Schema.Union(Schema.Literal("default"), Schema.Literal("disabled"))
                            ),
                        })
                    ),

                    /** Configuration of the no_new_privs bit in the container */
                    NoNewPrivileges: NullabilityOmittedNonRequiredField(Schema.Boolean),
                })
            ),

            /** Whether a pseudo-TTY should be allocated. */
            TTY: NullabilityOmittedNonRequiredField(Schema.Boolean),

            /** Open `stdin` */
            OpenStdin: NullabilityOmittedNonRequiredField(Schema.Boolean),

            /** Mount the container's root filesystem as read only. */
            ReadOnly: NullabilityOmittedNonRequiredField(Schema.Boolean),

            /**
             * Specification for mounts to be added to containers created as
             * part of the service.
             */
            Mounts: NullabilityOmittedNonRequiredField(Schema.Array(Mount)),

            /** Signal to stop the container. */
            StopSignal: NullabilityOmittedNonRequiredField(Schema.String),

            /**
             * Amount of time to wait for the container to terminate before
             * forcefully killing it.
             */
            StopGracePeriod: NullabilityOmittedNonRequiredField(Schema.Int),
            HealthCheck: NullabilityOmittedNonRequiredField(HealthConfig),

            /**
             * A list of hostname/IP mappings to add to the container's `hosts`
             * file. The format of extra hosts is specified in the
             * [hosts(5)](http://man7.org/linux/man-pages/man5/hosts.5.html) man
             * page:
             *
             *     IP_address canonical_hostname [aliases...]
             */
            Hosts: NullabilityOmittedNonRequiredField(Schema.Array(Schema.String)),

            /**
             * Specification for DNS related configurations in resolver
             * configuration file (`resolv.conf`).
             */
            DNSConfig: NullabilityOmittedNonRequiredField(
                Schema.Struct({
                    /** The IP addresses of the name servers. */
                    Nameservers: NullabilityOmittedNonRequiredField(Schema.Array(Schema.String)),

                    /** A search list for host-name lookup. */
                    Search: NullabilityOmittedNonRequiredField(Schema.Array(Schema.String)),

                    /**
                     * A list of internal resolver variables to be modified
                     * (e.g., `debug`, `ndots:3`, etc.).
                     */
                    Options: NullabilityOmittedNonRequiredField(Schema.Array(Schema.String)),
                })
            ),

            /**
             * Secrets contains references to zero or more secrets that will be
             * exposed to the service.
             */
            Secrets: NullabilityOmittedNonRequiredField(
                Schema.Array(
                    Schema.Struct({
                        /**
                         * File represents a specific target that is backed by a
                         * file.
                         */
                        File: NullabilityOmittedNonRequiredField(
                            Schema.Struct({
                                /**
                                 * Name represents the final filename in the
                                 * filesystem.
                                 */
                                Name: NullabilityOmittedNonRequiredField(Schema.String),

                                /** UID represents the file UID. */
                                UID: NullabilityOmittedNonRequiredField(Schema.String),

                                /** GID represents the file GID. */
                                GID: NullabilityOmittedNonRequiredField(Schema.String),

                                /** Mode represents the FileMode of the file. */
                                Mode: NullabilityOmittedNonRequiredField(Schema.Number),
                            })
                        ),

                        /**
                         * SecretID represents the ID of the specific secret
                         * that we're referencing.
                         */
                        SecretID: NullabilityOmittedNonRequiredField(Schema.String),

                        /**
                         * SecretName is the name of the secret that this
                         * references, but this is just provided for
                         * lookup/display purposes. The secret in the reference
                         * will be identified by its ID.
                         */
                        SecretName: NullabilityOmittedNonRequiredField(Schema.String),
                    })
                )
            ),

            /**
             * Configs contains references to zero or more configs that will be
             * exposed to the service.
             */
            Configs: NullabilityOmittedNonRequiredField(
                Schema.Array(
                    Schema.Struct({
                        /**
                         * File represents a specific target that is backed by a
                         * file.<p><br /><p>> **Note**: `Configs.File` and
                         * `Configs.Runtime` are mutually exclusive
                         */
                        File: NullabilityOmittedNonRequiredField(
                            Schema.Struct({
                                /**
                                 * Name represents the final filename in the
                                 * filesystem.
                                 */
                                Name: NullabilityOmittedNonRequiredField(Schema.String),

                                /** UID represents the file UID. */
                                UID: NullabilityOmittedNonRequiredField(Schema.String),

                                /** GID represents the file GID. */
                                GID: NullabilityOmittedNonRequiredField(Schema.String),

                                /** Mode represents the FileMode of the file. */
                                Mode: NullabilityOmittedNonRequiredField(Schema.Number),
                            })
                        ),

                        /**
                         * Runtime represents a target that is not mounted into
                         * the container but is used by the task<p><br /><p>>
                         * **Note**: `Configs.File` and `Configs.Runtime` are
                         * mutually exclusive
                         */
                        Runtime: NullabilityOmittedNonRequiredField(Schema.Struct({})),

                        /**
                         * ConfigID represents the ID of the specific config
                         * that we're referencing.
                         */
                        ConfigID: NullabilityOmittedNonRequiredField(Schema.String),

                        /**
                         * ConfigName is the name of the config that this
                         * references, but this is just provided for
                         * lookup/display purposes. The config in the reference
                         * will be identified by its ID.
                         */
                        ConfigName: NullabilityOmittedNonRequiredField(Schema.String),
                    })
                )
            ),

            /**
             * Isolation technology of the containers running the service.
             * (Windows only)
             */
            Isolation: NullabilityOmittedNonRequiredField(
                Schema.Union(Schema.Literal("default"), Schema.Literal("process"), Schema.Literal("hyperv"))
            ),

            /**
             * Run an init inside the container that forwards signals and reaps
             * processes. This field is omitted if empty, and the default (as
             * configured on the daemon) is used.
             */
            Init: NullableNonRequiredField(Schema.Boolean),

            /**
             * Set kernel namedspaced parameters (sysctls) in the container. The
             * Sysctls option on services accepts the same sysctls as the are
             * supported on containers. Note that while the same sysctls are
             * supported, no guarantees or checks are made about their
             * suitability for a clustered environment, and it's up to the user
             * to determine whether a given sysctl will work properly in a
             * Service.
             */
            Sysctls: NullabilityOmittedNonRequiredField(Schema.Record(Schema.String, Schema.String)),

            /**
             * A list of kernel capabilities to add to the default set for the
             * container.
             */
            CapabilityAdd: NullabilityOmittedNonRequiredField(Schema.Array(Schema.String)),

            /**
             * A list of kernel capabilities to drop from the default set for
             * the container.
             */
            CapabilityDrop: NullabilityOmittedNonRequiredField(Schema.Array(Schema.String)),

            /**
             * A list of resource limits to set in the container. For example:
             * `{"Name": "nofile", "Soft": 1024, "Hard": 2048}`"
             */
            Ulimits: NullabilityOmittedNonRequiredField(
                Schema.Array(
                    Schema.Struct({
                        /** Name of ulimit */
                        Name: NullabilityOmittedNonRequiredField(Schema.String),

                        /** Soft limit */
                        Soft: NullabilityOmittedNonRequiredField(Schema.Number),

                        /** Hard limit */
                        Hard: NullabilityOmittedNonRequiredField(Schema.Number),
                    })
                )
            ),
        })
    ),

    /**
     * Read-only spec type for non-swarm containers attached to swarm overlay
     * networks.<p><br /></p>> **Note**: ContainerSpec, NetworkAttachmentSpec,
     * and PluginSpec are> Mutually exclusive. PluginSpec is only used when the
     * Runtime field is set> To `plugin`. NetworkAttachmentSpec is used when the
     * Runtime field is set> To `attachment`.
     */
    NetworkAttachmentSpec: NullabilityOmittedNonRequiredField(
        Schema.Struct({
            /** ID of the container represented by this task */
            ContainerID: NullabilityOmittedNonRequiredField(Schema.String),
        })
    ),

    /**
     * Resource requirements which apply to each individual container created as
     * part of the service.
     */
    Resources: NullabilityOmittedNonRequiredField(
        Schema.Struct({
            Limits: NullabilityOmittedNonRequiredField(Limit),
            Reservations: NullabilityOmittedNonRequiredField(ResourceObject),
        })
    ),

    /**
     * Specification for the restart policy which applies to containers created
     * as part of this service.
     */
    RestartPolicy: NullabilityOmittedNonRequiredField(
        Schema.Struct({
            /** Condition for restart. */
            Condition: NullabilityOmittedNonRequiredField(
                Schema.Union(Schema.Literal("none"), Schema.Literal("on-failure"), Schema.Literal("any"))
            ),

            /** Delay between restart attempts. */
            Delay: NullabilityOmittedNonRequiredField(Schema.Number),

            /**
             * Maximum attempts to restart a given container before giving up
             * (default value is 0, which is ignored).
             */
            MaxAttempts: NullabilityOmittedNonRequiredField(Schema.Number, { default: () => 0 }),

            /**
             * Windows is the time window used to evaluate the restart policy
             * (default value is 0, which is unbounded).
             */
            Window: NullabilityOmittedNonRequiredField(Schema.Number, { default: () => 0 }),
        })
    ),

    Placement: NullabilityOmittedNonRequiredField(
        Schema.Struct({
            /**
             * An array of constraint expressions to limit the set of nodes
             * where a task can be scheduled. Constraint expressions can either
             * use a _match_ (`==`) or _exclude_ (`!=`) rule. Multiple
             * constraints find nodes that satisfy every expression (AND match).
             * Constraints can match node or Docker Engine labels as follows:
             *
             * Node attribute | matches | example
             * ---------------------|--------------------------------|-----------------------------------------------
             * `node.id` | Node ID | `node.hostname` | Node hostname |
             * `node.hostname!=node-2` `node.role` | Node role
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
            Constraints: NullabilityOmittedNonRequiredField(Schema.Array(Schema.String)),

            /**
             * Preferences provide a way to make the scheduler aware of factors
             * such as topology. They are provided in order from highest to
             * lowest precedence.
             */
            Preferences: NullabilityOmittedNonRequiredField(
                Schema.Array(
                    Schema.Struct({
                        Spread: NullabilityOmittedNonRequiredField(
                            Schema.Struct({
                                /** Label descriptor, such as `engine.labels.az`. */
                                SpreadDescriptor: NullabilityOmittedNonRequiredField(Schema.String),
                            })
                        ),
                    })
                )
            ),

            /**
             * Maximum number of replicas for per node (default value is 0,
             * which is unlimited)
             */
            MaxReplicas: NullabilityOmittedNonRequiredField(Schema.Int, { default: () => 0 }),

            /**
             * Platforms stores all the platforms that the service's image can
             * run on. This field is used in the platform filter for scheduling.
             * If empty, then the platform filter is off, meaning there are no
             * scheduling restrictions.
             */
            Platforms: NullabilityOmittedNonRequiredField(Schema.Array(Platform)),
        })
    ),

    /**
     * A counter that triggers an update even if no relevant parameters have
     * been changed.
     */
    ForceUpdate: NullabilityOmittedNonRequiredField(Schema.Number),

    /** Runtime is the type of runtime specified for the task executor. */
    Runtime: NullabilityOmittedNonRequiredField(Schema.String),

    /** Specifies which networks the service should attach to. */
    Networks: NullabilityOmittedNonRequiredField(Schema.Array(NetworkAttachmentConfig)),

    /**
     * Specifies the log driver to use for tasks created from this spec. If not
     * present, the default one for the swarm will be used, finally falling back
     * to the engine default if not specified.
     */
    LogDriver: NullabilityOmittedNonRequiredField(
        Schema.Struct({
            Name: NullabilityOmittedNonRequiredField(Schema.String),
            Options: NullabilityOmittedNonRequiredField(Schema.Record(Schema.String, Schema.String)),
        })
    ),
}) {}

// FIXME: has top level nullability: true
export class ClusterInfo extends Schema.Class<ClusterInfo>("ClusterInfo")({
    /** The ID of the swarm. */
    ID: NullabilityOmittedNonRequiredField(Schema.String),
    Version: NullabilityOmittedNonRequiredField(
        Schema.Struct({
            Index: NullabilityOmittedNonRequiredField(Schema.Number),
        })
    ),

    /**
     * Date and time at which the swarm was initialized in [RFC
     * 3339](https://www.ietf.org/rfc/rfc3339.txt) format with nano-seconds.
     */
    CreatedAt: NullabilityOmittedNonRequiredField(Schema.String),

    /**
     * Date and time at which the swarm was last updated in [RFC
     * 3339](https://www.ietf.org/rfc/rfc3339.txt) format with nano-seconds.
     */
    UpdatedAt: NullabilityOmittedNonRequiredField(Schema.String),
    Spec: NullabilityOmittedNonRequiredField(SwarmSpec),
    TLSInfo: NullabilityOmittedNonRequiredField(TLSInfo),

    /** Whether there is currently a root CA rotation in progress for the swarm */
    RootRotationInProgress: NullabilityOmittedNonRequiredField(Schema.Boolean),

    /**
     * DataPathPort specifies the data path port number for data traffic.
     * Acceptable port range is 1024 to 49151. If no port is set or is set to 0,
     * the default port (4789) is used.
     */
    DataPathPort: NullabilityOmittedNonRequiredField(Schema.Number, { default: () => 4789 }),

    /**
     * Default Address Pool specifies default subnet pools for global scope
     * networks.
     */
    DefaultAddrPool: NullabilityOmittedNonRequiredField(Schema.Array(Schema.String)),

    /**
     * SubnetSize specifies the subnet size of the networks created from the
     * default subnet pool.
     */
    SubnetSize: NullabilityOmittedNonRequiredField(Schema.Int.pipe(Schema.lessThanOrEqualTo(29)), {
        default: () => 24,
    }),
}) {}

export class SwarmInfo extends Schema.Class<SwarmInfo>("SwarmInfo")({
    /** Unique identifier of for this node in the swarm. */
    NodeID: NullabilityOmittedNonRequiredField(Schema.String, { default: () => "" as const }),

    /** IP address at which this node can be reached by other nodes in the swarm. */
    NodeAddr: NullabilityOmittedNonRequiredField(Schema.String, { default: () => "" as const }),
    ControlAvailable: NullabilityOmittedNonRequiredField(Schema.Boolean, { default: () => false }),
    Error: NullabilityOmittedNonRequiredField(Schema.String, { default: () => "" as const }),

    LocalNodeState: NullabilityOmittedNonRequiredField(
        Schema.Union(
            Schema.Literal(""),
            Schema.Literal("inactive"),
            Schema.Literal("pending"),
            Schema.Literal("active"),
            Schema.Literal("error"),
            Schema.Literal("locked")
        ),
        { default: () => "" as const }
    ),

    /** List of ID's and addresses of other managers in the swarm. */
    RemoteManagers: NullableNonRequiredField(Schema.Array(PeerNode)),

    /** Total number of nodes in the swarm. */
    Nodes: NullableNonRequiredField(Schema.Number),

    /** Total number of managers in the swarm. */
    Managers: NullableNonRequiredField(Schema.Number),
    Cluster: NullabilityOmittedNonRequiredField(ClusterInfo),
}) {}

export class SystemInfo extends Schema.Class<SystemInfo>("SystemInfo")({
    /**
     * Unique identifier of the daemon.<p><br /></p>> **Note**: The format of
     * the ID itself is not part of the API, and> Should not be considered
     * stable.
     */
    ID: NullabilityOmittedNonRequiredField(Schema.String),

    /** Total number of containers on the host. */
    Containers: NullabilityOmittedNonRequiredField(Schema.Number),

    /** Number of containers with status "running" */
    ContainersRunning: NullabilityOmittedNonRequiredField(Schema.Number),

    /** Number of containers with status "paused" */
    ContainersPaused: NullabilityOmittedNonRequiredField(Schema.Number),

    /** Number of containers with status "stopped" */
    ContainersStopped: NullabilityOmittedNonRequiredField(Schema.Number),

    /**
     * Total number of images on the host.
     *
     * Both _tagged_ and _untagged_ (dangling) images are counted.
     */
    Images: NullabilityOmittedNonRequiredField(Schema.Number),

    /** Name of the storage driver in use. */
    Driver: NullabilityOmittedNonRequiredField(Schema.String),

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
    DriverStatus: NullabilityOmittedNonRequiredField(Schema.Array(Schema.Array(Schema.String))),

    /**
     * Root directory of persistent Docker state.
     *
     * Defaults to `/var/lib/docker` on Linux, and `C:\ProgramData\docker` on
     * Windows.
     */
    DockerRootDir: NullabilityOmittedNonRequiredField(Schema.String),
    Plugins: NullabilityOmittedNonRequiredField(PluginsInfo),

    /** Indicates if the host has memory limit support enabled. */
    MemoryLimit: NullabilityOmittedNonRequiredField(Schema.Boolean),

    /** Indicates if the host has memory swap limit support enabled. */
    SwapLimit: NullabilityOmittedNonRequiredField(Schema.Boolean),

    /**
     * Indicates if the host has kernel memory TCP limit support enabled. This
     * field is omitted if not supported.
     *
     * Kernel memory TCP limits are not supported when using cgroups v2, which
     * does not support the corresponding `memory.kmem.tcp.limit_in_bytes`
     * cgroup.
     */
    KernelMemoryTCP: NullabilityOmittedNonRequiredField(Schema.Boolean),

    /**
     * Indicates if CPU CFS(Completely Fair Scheduler) period is supported by
     * the host.
     */
    CpuCfsPeriod: NullabilityOmittedNonRequiredField(Schema.Boolean),

    /**
     * Indicates if CPU CFS(Completely Fair Scheduler) quota is supported by the
     * host.
     */
    CpuCfsQuota: NullabilityOmittedNonRequiredField(Schema.Boolean),

    /** Indicates if CPU Shares limiting is supported by the host. */
    CPUShares: NullabilityOmittedNonRequiredField(Schema.Boolean),

    /**
     * Indicates if CPUsets (cpuset.cpus, cpuset.mems) are supported by the
     * host.
     *
     * See
     * [cpuset(7)](https://www.kernel.org/doc/Documentation/cgroup-v1/cpusets.txt)
     */
    CPUSet: NullabilityOmittedNonRequiredField(Schema.Boolean),

    /** Indicates if the host kernel has PID limit support enabled. */
    PidsLimit: NullabilityOmittedNonRequiredField(Schema.Boolean),

    /** Indicates if OOM killer disable is supported on the host. */
    OomKillDisable: NullabilityOmittedNonRequiredField(Schema.Boolean),

    /** Indicates IPv4 forwarding is enabled. */
    IPv4Forwarding: NullabilityOmittedNonRequiredField(Schema.Boolean),

    /** Indicates if `bridge-nf-call-iptables` is available on the host. */
    BridgeNfIptables: NullabilityOmittedNonRequiredField(Schema.Boolean),

    /** Indicates if `bridge-nf-call-ip6tables` is available on the host. */
    BridgeNfIp6tables: NullabilityOmittedNonRequiredField(Schema.Boolean),

    /**
     * Indicates if the daemon is running in debug-mode / with debug-level
     * logging enabled.
     */
    Debug: NullabilityOmittedNonRequiredField(Schema.Boolean),

    /**
     * The total number of file Descriptors in use by the daemon process.
     *
     * This information is only returned if debug-mode is enabled.
     */
    NFd: NullabilityOmittedNonRequiredField(Schema.Number),

    /**
     * The number of goroutines that currently exist.
     *
     * This information is only returned if debug-mode is enabled.
     */
    NGoroutines: NullabilityOmittedNonRequiredField(Schema.Number),

    /**
     * Current system-time in [RFC 3339](https://www.ietf.org/rfc/rfc3339.txt)
     * format with nano-seconds.
     */
    SystemTime: NullabilityOmittedNonRequiredField(Schema.String),

    /** The logging driver to use as a default for new containers. */
    LoggingDriver: NullabilityOmittedNonRequiredField(Schema.String),

    /** The driver to use for managing cgroups. */
    CgroupDriver: NullabilityOmittedNonRequiredField(
        Schema.Union(Schema.Literal("cgroupfs"), Schema.Literal("systemd"), Schema.Literal("none")),
        { default: () => "cgroupfs" as const }
    ),

    /** The version of the cgroup. */
    CgroupVersion: NullabilityOmittedNonRequiredField(Schema.Union(Schema.Literal("1"), Schema.Literal("2")), {
        default: () => "1" as const,
    }),

    /** Number of event listeners subscribed. */
    NEventsListener: NullabilityOmittedNonRequiredField(Schema.Number),

    /**
     * Kernel version of the host.
     *
     * On Linux, this information obtained from `uname`. On Windows this
     * information is queried from the
     * <kbd>HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows
     * NT\CurrentVersion</kbd> registry value, for example _"10.0 14393
     * (14393.1198.amd64fre.rs1_release_sec.170427-1353)"_.
     */
    KernelVersion: NullabilityOmittedNonRequiredField(Schema.String),

    /**
     * Name of the host's operating system, for example: "Ubuntu 16.04.2 LTS" or
     * "Windows Server 2016 Datacenter"
     */
    OperatingSystem: NullabilityOmittedNonRequiredField(Schema.String),

    /**
     * Version of the host's operating system<p><br /></p>> **Note**: The
     * information returned in this field, including its very> Existence, and
     * the formatting of values, should not be considered stable,> And may
     * change without notice.
     */
    OSVersion: NullabilityOmittedNonRequiredField(Schema.String),

    /**
     * Generic type of the operating system of the host, as returned by the Go
     * runtime (`GOOS`).
     *
     * Currently returned values are "linux" and "windows". A full list of
     * possible values can be found in the [Go
     * documentation](https://golang.org/doc/install/source#environment).
     */
    OSType: NullabilityOmittedNonRequiredField(Schema.String),

    /**
     * Hardware architecture of the host, as returned by the Go runtime
     * (`GOARCH`).
     *
     * A full list of possible values can be found in the [Go
     * documentation](https://golang.org/doc/install/source#environment).
     */
    Architecture: NullabilityOmittedNonRequiredField(Schema.String),

    /**
     * The number of logical CPUs usable by the daemon.
     *
     * The number of available CPUs is checked by querying the operating system
     * when the daemon starts. Changes to operating system CPU allocation after
     * the daemon is started are not reflected.
     */
    NCPU: NullabilityOmittedNonRequiredField(Schema.Number),

    /** Total amount of physical memory available on the host, in bytes. */
    MemTotal: NullabilityOmittedNonRequiredField(Schema.Number),

    /**
     * Address / URL of the index server that is used for image search, and as a
     * default for user authentication for Docker Hub and Docker Cloud.
     */
    IndexServerAddress: NullabilityOmittedNonRequiredField(Schema.String),
    RegistryConfig: NullabilityOmittedNonRequiredField(RegistryServiceConfig),
    GenericResources: NullabilityOmittedNonRequiredField(GenericResources),

    /**
     * HTTP-proxy configured for the daemon. This value is obtained from the
     * [`HTTP_PROXY`](https://www.gnu.org/software/wget/manual/html_node/Proxies.html)
     * environment variable. Credentials ([user info
     * component](https://tools.ietf.org/html/rfc3986#section-3.2.1)) in the
     * proxy URL are masked in the API response.
     *
     * Containers do not automatically inherit this configuration.
     */
    HttpProxy: NullabilityOmittedNonRequiredField(Schema.String),

    /**
     * HTTPS-proxy configured for the daemon. This value is obtained from the
     * [`HTTPS_PROXY`](https://www.gnu.org/software/wget/manual/html_node/Proxies.html)
     * environment variable. Credentials ([user info
     * component](https://tools.ietf.org/html/rfc3986#section-3.2.1)) in the
     * proxy URL are masked in the API response.
     *
     * Containers do not automatically inherit this configuration.
     */
    HttpsProxy: NullabilityOmittedNonRequiredField(Schema.String),

    /**
     * Comma-separated list of domain extensions for which no proxy should be
     * used. This value is obtained from the
     * [`NO_PROXY`](https://www.gnu.org/software/wget/manual/html_node/Proxies.html)
     * environment variable.
     *
     * Containers do not automatically inherit this configuration.
     */
    NoProxy: NullabilityOmittedNonRequiredField(Schema.String),

    /** Hostname of the host. */
    Name: NullabilityOmittedNonRequiredField(Schema.String),

    /**
     * User-defined labels (key/value metadata) as set on the daemon.<p><br
     * /></p>> **Note**: When part of a Swarm, nodes can both have _daemon_
     * labels,> Set through the daemon configuration, and _node_ labels, set
     * from a> Manager node in the Swarm. Node labels are not included in this
     * field.> Node labels can be retrieved using the `/nodes/(id)` endpoint on
     * a> Manager node in the Swarm.
     */
    Labels: NullabilityOmittedNonRequiredField(Schema.Array(Schema.String)),

    /** Indicates if experimental features are enabled on the daemon. */
    ExperimentalBuild: NullabilityOmittedNonRequiredField(Schema.Boolean),

    /** Version string of the daemon. */
    ServerVersion: NullabilityOmittedNonRequiredField(Schema.String),

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
    Runtimes: NullabilityOmittedNonRequiredField(Schema.Record(Schema.String, Runtime)),

    /**
     * Name of the default OCI runtime that is used when starting containers.
     *
     * The default can be overridden per-container at create time.
     */
    DefaultRuntime: NullabilityOmittedNonRequiredField(Schema.String, { default: () => "runc" }),
    Swarm: NullabilityOmittedNonRequiredField(SwarmInfo),

    /**
     * Indicates if live restore is enabled.
     *
     * If enabled, containers are kept running when the daemon is shutdown or
     * upon daemon start if running containers are detected.
     */
    LiveRestoreEnabled: NullabilityOmittedNonRequiredField(Schema.Boolean, { default: () => false }),

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
    Isolation: NullabilityOmittedNonRequiredField(
        Schema.Union(Schema.Literal("default"), Schema.Literal("hyperv"), Schema.Literal("process")),
        { default: () => "default" as const }
    ),

    /**
     * Name and, optional, path of the `docker-init` binary.
     *
     * If the path is omitted, the daemon searches the host's `$PATH` for the
     * binary and uses the first result.
     */
    InitBinary: NullabilityOmittedNonRequiredField(Schema.String),
    ContainerdCommit: NullabilityOmittedNonRequiredField(Commit),
    RuncCommit: NullabilityOmittedNonRequiredField(Commit),
    InitCommit: NullabilityOmittedNonRequiredField(Commit),

    /**
     * List of security features that are enabled on the daemon, such as
     * apparmor, seccomp, SELinux, user-namespaces (userns), rootless and
     * no-new-privileges.
     *
     * Additional configuration options for each security feature may be
     * present, and are included as a comma-separated list of key/value pairs.
     */
    SecurityOptions: NullabilityOmittedNonRequiredField(Schema.Array(Schema.String)),

    /**
     * Reports a summary of the product license on the daemon.
     *
     * If a commercial license has been applied to the daemon, information such
     * as number of nodes, and expiration are included.
     */
    ProductLicense: NullabilityOmittedNonRequiredField(Schema.String),

    /**
     * List of custom default address pools for local networks, which can be
     * specified in the daemon.json file or dockerd option.
     *
     * Example: a Base "10.10.0.0/16" with Size 24 will define the set of 256
     * 10.10.[0-255].0/24 address pools.
     */
    DefaultAddressPools: NullabilityOmittedNonRequiredField(
        Schema.Array(
            Schema.Struct({
                /** The network address in CIDR format */
                Base: NullabilityOmittedNonRequiredField(Schema.String),

                /** The network pool size */
                Size: NullabilityOmittedNonRequiredField(Schema.Number),
            })
        )
    ),

    /**
     * List of warnings / informational messages about missing features, or
     * issues related to the daemon configuration.
     *
     * These messages can be printed by the client as information to the user.
     */
    Warnings: NullabilityOmittedNonRequiredField(Schema.Array(Schema.String)),

    /**
     * List of directories where (Container Device Interface) CDI specifications
     * are located. These specifications define vendor-specific modifications to
     * an OCI runtime specification for a container being created. An empty list
     * indicates that CDI device injection is disabled. Note that since using
     * CDI device injection requires the daemon to have experimental enabled.
     * For non-experimental daemons an empty list will always be returned.
     */
    CDISpecDirs: NullabilityOmittedNonRequiredField(Schema.Array(Schema.String)),
}) {}

export class ClusterVolumeSpec extends Schema.Class<ClusterVolumeSpec>("ClusterVolumeSpec")({
    /**
     * Group defines the volume group of this volume. Volumes belonging to the
     * same group can be referred to by group name when creating Services.
     * Referring to a volume by group instructs Swarm to treat volumes in that
     * group interchangeably for the purpose of scheduling. Volumes with an
     * empty string for a group technically all belong to the same, empty string
     * group.
     */
    Group: NullabilityOmittedNonRequiredField(Schema.String),

    /** Defines how the volume is used by tasks. */
    AccessMode: NullabilityOmittedNonRequiredField(
        Schema.Struct({
            /**
             * The set of nodes this volume can be used on at one time.
             *
             * - `single` The volume may only be scheduled to one node at a time.
             * - `multi` the volume may be scheduled to any supported number of
             *   nodes at a time.
             */
            Scope: NonNullableNonRequiredField(Schema.Union(Schema.Literal("single"), Schema.Literal("multi")), {
                default: () => "single" as const,
            }),

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
            Sharing: NonNullableNonRequiredField(
                Schema.Union(
                    Schema.Literal("none"),
                    Schema.Literal("readonly"),
                    Schema.Literal("onewriter"),
                    Schema.Literal("all")
                ),
                { default: () => "none" as const }
            ),

            /** Options for using this volume as a Mount-type volume. */
            MountVolume: NullabilityOmittedNonRequiredField(Schema.Struct({})),

            /**
             * Swarm Secrets that are passed to the CSI storage plugin when
             * operating on this volume.
             */
            Secrets: NullabilityOmittedNonRequiredField(
                Schema.Array(
                    Schema.Struct({
                        /**
                         * Key is the name of the key of the key-value pair
                         * passed to the plugin.
                         */
                        Key: NullabilityOmittedNonRequiredField(Schema.String),

                        /**
                         * Secret is the swarm Secret object from which to read
                         * data. This can be a Secret name or ID. The Secret
                         * data is retrieved by swarm and used as the value of
                         * the key-value pair passed to the plugin.
                         */
                        Secret: NullabilityOmittedNonRequiredField(Schema.String),
                    })
                )
            ),

            /**
             * Requirements for the accessible topology of the volume. These
             * fields are optional. For an in-depth description of what these
             * fields mean, see the CSI specification.
             */
            AccessibilityRequirements: NullabilityOmittedNonRequiredField(
                Schema.Struct({
                    /**
                     * A list of required topologies, at least one of which the
                     * volume must be accessible from.
                     */
                    Requisite: NullabilityOmittedNonRequiredField(
                        Schema.Array(Schema.Record(Schema.String, Schema.String))
                    ),

                    /**
                     * A list of topologies that the volume should attempt to be
                     * provisioned in.
                     */
                    Preferred: NullabilityOmittedNonRequiredField(
                        Schema.Array(Schema.Record(Schema.String, Schema.String))
                    ),
                })
            ),

            /**
             * The desired capacity that the volume should be created with. If
             * empty, the plugin will decide the capacity.
             */
            CapacityRange: NullabilityOmittedNonRequiredField(
                Schema.Struct({
                    /**
                     * The volume must be at least this big. The value of 0
                     * indicates an unspecified minimum
                     */
                    RequiredBytes: NullabilityOmittedNonRequiredField(Schema.Number),

                    /**
                     * The volume must not be bigger than this. The value of 0
                     * indicates an unspecified maximum.
                     */
                    LimitBytes: NullabilityOmittedNonRequiredField(Schema.Number),
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
            Availability: NonNullableNonRequiredField(
                Schema.Union(Schema.Literal("active"), Schema.Literal("pause"), Schema.Literal("drain"))
            ),
        })
    ),
}) {}

export class ClusterVolume extends Schema.Class<ClusterVolume>("ClusterVolume")({
    /**
     * The Swarm ID of this volume. Because cluster volumes are Swarm objects,
     * they have an ID, unlike non-cluster volumes. This ID can be used to refer
     * to the Volume instead of the name.
     */
    ID: NullabilityOmittedNonRequiredField(Schema.String),
    Version: NullabilityOmittedNonRequiredField(
        Schema.Struct({
            /** The version number of the object. */
            Index: NullabilityOmittedNonRequiredField(Schema.Number),
        })
    ),
    CreatedAt: NullabilityOmittedNonRequiredField(Schema.String),
    UpdatedAt: NullabilityOmittedNonRequiredField(Schema.String),
    Spec: NullabilityOmittedNonRequiredField(ClusterVolumeSpec),

    /** Information about the global status of the volume. */
    Info: NullabilityOmittedNonRequiredField(
        Schema.Struct({
            /**
             * The capacity of the volume in bytes. A value of 0 indicates that
             * the capacity is unknown.
             */
            CapacityBytes: NullabilityOmittedNonRequiredField(Schema.Number),

            /**
             * A map of strings to strings returned from the storage plugin when
             * the volume is created.
             */
            VolumeContext: NullabilityOmittedNonRequiredField(Schema.Record(Schema.String, Schema.String)),

            /**
             * The ID of the volume as returned by the CSI storage plugin. This
             * is distinct from the volume's ID as provided by Docker. This ID
             * is never used by the user when communicating with Docker to refer
             * to this volume. If the ID is blank, then the Volume has not been
             * successfully created in the plugin yet.
             */
            VolumeID: NullabilityOmittedNonRequiredField(Schema.String),

            /** The topology this volume is actually accessible from. */
            AccessibleTopology: NullabilityOmittedNonRequiredField(
                Schema.Array(Schema.Record(Schema.String, Schema.String))
            ),
        })
    ),

    /**
     * The status of the volume as it pertains to its publishing and use on
     * specific nodes
     */
    PublishStatus: NullabilityOmittedNonRequiredField(
        Schema.Array(
            Schema.Struct({
                /** The ID of the Swarm node the volume is published on. */
                NodeID: NullabilityOmittedNonRequiredField(Schema.String),

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
                State: NullabilityOmittedNonRequiredField(
                    Schema.Union(
                        Schema.Literal("pending-publish"),
                        Schema.Literal("published"),
                        Schema.Literal("pending-node-unpublish"),
                        Schema.Literal("pending-controller-unpublish")
                    )
                ),

                /**
                 * A map of strings to strings returned by the CSI controller
                 * plugin when a volume is published.
                 */
                PublishContext: NullabilityOmittedNonRequiredField(Schema.Record(Schema.String, Schema.String)),
            })
        )
    ),
}) {}

export class Volume extends Schema.Class<Volume>("Volume")({
    /** Name of the volume. */
    Name: NonNullableRequiredField(Schema.String),

    /** Name of the volume driver used by the volume. */
    Driver: NonNullableRequiredField(Schema.String),

    /** Mount path of the volume on the host. */
    Mountpoint: NonNullableRequiredField(Schema.String),

    /** Date/Time the volume was created. */
    CreatedAt: NullabilityOmittedNonRequiredField(Schema.String),

    /**
     * Low-level details about the volume, provided by the volume driver.
     * Details are returned as a map with key/value pairs:
     * `{"key":"value","key2":"value2"}`.
     *
     * The `Status` field is optional, and is omitted if the volume driver does
     * not support this feature.
     */
    Status: NullabilityOmittedNonRequiredField(Schema.Record(Schema.String, Schema.Struct({}))),

    /** User-defined key/value metadata. */
    Labels: NonNullableRequiredField(Schema.Record(Schema.String, Schema.String)),

    /**
     * The level at which the volume exists. Either `global` for cluster-wide,
     * or `local` for machine level.
     */
    Scope: NonNullableRequiredField(Schema.Union(Schema.Literal("local"), Schema.Literal("global"))),
    ClusterVolume: NullabilityOmittedNonRequiredField(ClusterVolume),

    /** The driver specific options used when creating the volume. */
    Options: NonNullableRequiredField(Schema.Record(Schema.String, Schema.String)),

    /**
     * Usage details about the volume. This information is used by the `GET
     * /system/df` endpoint, and omitted in other endpoints.
     */
    UsageData: NullableNonRequiredField(
        Schema.Struct({
            /**
             * Amount of disk space used by the volume (in bytes). This
             * information is only available for volumes created with the
             * `"local"` volume driver. For volumes created with other volume
             * drivers, this field is set to `-1` ("not available")
             */
            Size: NonNullableRequiredField(Schema.Number),

            /**
             * The number of containers referencing this volume. This field is
             * set to `-1` if the reference-count is not available.
             */
            RefCount: NonNullableRequiredField(Schema.Number),
        })
    ),
}) {}

export class NodeDescription extends Schema.Class<NodeDescription>("NodeDescription")({
    Hostname: NullabilityOmittedNonRequiredField(Schema.String),
    Platform: NullabilityOmittedNonRequiredField(Platform),
    Resources: NullabilityOmittedNonRequiredField(ResourceObject),
    Engine: NullabilityOmittedNonRequiredField(EngineDescription),
    TLSInfo: NullabilityOmittedNonRequiredField(TLSInfo),
}) {}

export class NodeStatus extends Schema.Class<NodeStatus>("NodeStatus")({
    State: NullabilityOmittedNonRequiredField(
        Schema.Union(
            Schema.Literal("unknown"),
            Schema.Literal("down"),
            Schema.Literal("ready"),
            Schema.Literal("disconnected")
        )
    ),
    Message: NullabilityOmittedNonRequiredField(Schema.String),

    /** IP address of the node. */
    Addr: NullabilityOmittedNonRequiredField(Schema.String),
}) {}

// FIXME: has top level nullability: true
export class ManagerStatus extends Schema.Class<ManagerStatus>("ManagerStatus")({
    Leader: NullabilityOmittedNonRequiredField(Schema.Boolean, { default: () => false }),
    Reachability: NullabilityOmittedNonRequiredField(
        Schema.Union(Schema.Literal("unknown"), Schema.Literal("reachable"), Schema.Literal("unreachable"))
    ),

    /** The IP address and port at which the manager is reachable. */
    Addr: NullabilityOmittedNonRequiredField(Schema.String),
}) {}

export class Node extends Schema.Class<Node>("Node")({
    ID: NullabilityOmittedNonRequiredField(Schema.String),
    Version: NullabilityOmittedNonRequiredField(
        Schema.Struct({ Index: NullabilityOmittedNonRequiredField(Schema.Number) })
    ),

    /**
     * Date and time at which the node was added to the swarm in [RFC
     * 3339](https://www.ietf.org/rfc/rfc3339.txt) format with nano-seconds.
     */
    CreatedAt: NullabilityOmittedNonRequiredField(Schema.String),

    /**
     * Date and time at which the node was last updated in [RFC
     * 3339](https://www.ietf.org/rfc/rfc3339.txt) format with nano-seconds.
     */
    UpdatedAt: NullabilityOmittedNonRequiredField(Schema.String),
    Spec: NullabilityOmittedNonRequiredField(NodeSpec),
    Description: NullabilityOmittedNonRequiredField(NodeDescription),
    Status: NullabilityOmittedNonRequiredField(NodeStatus),
    ManagerStatus: NullabilityOmittedNonRequiredField(ManagerStatus),
}) {}

export class ContainerStatus extends Schema.Class<ContainerStatus>("ContainerStatus")({
    ID: NullabilityOmittedNonRequiredField(Schema.String),
    PID: NullabilityOmittedNonRequiredField(Schema.Number),
    ExitCode: NullabilityOmittedNonRequiredField(Schema.Number),
}) {}

export class PortStatus extends Schema.Class<PortStatus>("PortStatus")({
    Ports: NullabilityOmittedNonRequiredField(Schema.Array(EndpointPortConfig)),
}) {}

export class TaskStatus extends Schema.Class<TaskStatus>("TaskStatus")({
    Timestamp: NullabilityOmittedNonRequiredField(Schema.String),
    State: NullabilityOmittedNonRequiredField(
        Schema.Union(
            Schema.Literal("new"),
            Schema.Literal("allocated"),
            Schema.Literal("pending"),
            Schema.Literal("assigned"),
            Schema.Literal("accepted"),
            Schema.Literal("preparing"),
            Schema.Literal("ready"),
            Schema.Literal("starting"),
            Schema.Literal("running"),
            Schema.Literal("complete"),
            Schema.Literal("shutdown"),
            Schema.Literal("failed"),
            Schema.Literal("rejected"),
            Schema.Literal("orphaned"),
            Schema.Literal("remove")
        )
    ),
    Message: NullabilityOmittedNonRequiredField(Schema.String),
    Err: NullabilityOmittedNonRequiredField(Schema.String),
    ContainerStatus: NullabilityOmittedNonRequiredField(ContainerStatus),
    PortStatus: NullabilityOmittedNonRequiredField(PortStatus),
}) {}

export class Task extends Schema.Class<Task>("Task")({
    /** The ID of the task. */
    ID: NullabilityOmittedNonRequiredField(Schema.String),
    Version: NullabilityOmittedNonRequiredField(
        Schema.Struct({ Index: NullabilityOmittedNonRequiredField(Schema.Number) })
    ),
    CreatedAt: NullabilityOmittedNonRequiredField(Schema.String),
    UpdatedAt: NullabilityOmittedNonRequiredField(Schema.String),

    /** Name of the task. */
    Name: NullabilityOmittedNonRequiredField(Schema.String),

    /** User-defined key/value metadata. */
    Labels: NullabilityOmittedNonRequiredField(Schema.Record(Schema.String, Schema.String)),
    Spec: NullabilityOmittedNonRequiredField(TaskSpec),

    /** The ID of the service this task is part of. */
    ServiceID: NullabilityOmittedNonRequiredField(Schema.String),
    Slot: NullabilityOmittedNonRequiredField(Schema.Number),

    /** The ID of the node that this task is on. */
    NodeID: NullabilityOmittedNonRequiredField(Schema.String),
    AssignedGenericResources: NullabilityOmittedNonRequiredField(GenericResources),
    Status: NullabilityOmittedNonRequiredField(TaskStatus),
    DesiredState: NullabilityOmittedNonRequiredField(
        Schema.Union(
            Schema.Literal("new"),
            Schema.Literal("allocated"),
            Schema.Literal("pending"),
            Schema.Literal("assigned"),
            Schema.Literal("accepted"),
            Schema.Literal("preparing"),
            Schema.Literal("ready"),
            Schema.Literal("starting"),
            Schema.Literal("running"),
            Schema.Literal("complete"),
            Schema.Literal("shutdown"),
            Schema.Literal("failed"),
            Schema.Literal("rejected"),
            Schema.Literal("orphaned"),
            Schema.Literal("remove")
        )
    ),
    JobIteration: NullabilityOmittedNonRequiredField(
        Schema.Struct({ Index: NullabilityOmittedNonRequiredField(Schema.Number) })
    ),
}) {}

export class EndpointSpec extends Schema.Class<EndpointSpec>("EndpointSpec")({
    /** The mode of resolution to use for internal load balancing between tasks. */
    Mode: NullabilityOmittedNonRequiredField(Schema.Union(Schema.Literal("vip"), Schema.Literal("dnsrr")), {
        default: () => "vip" as const,
    }),

    /**
     * List of exposed ports that this service is accessible on from the
     * outside. Ports can only be provided if `vip` resolution mode is used.
     */
    Ports: NullabilityOmittedNonRequiredField(Schema.Array(EndpointPortConfig)),
}) {}

export class ServiceSpec extends Schema.Class<ServiceSpec>("ServiceSpec")({
    /** Name of the service. */
    Name: NullabilityOmittedNonRequiredField(Schema.String),

    /** User-defined key/value metadata. */
    Labels: NullabilityOmittedNonRequiredField(Schema.Record(Schema.String, Schema.String)),
    TaskTemplate: NullabilityOmittedNonRequiredField(TaskSpec),

    /** Scheduling mode for the service. */
    Mode: NullabilityOmittedNonRequiredField(
        Schema.Struct({
            Replicated: NullabilityOmittedNonRequiredField(
                Schema.Struct({ Replicas: NullabilityOmittedNonRequiredField(Schema.Number) })
            ),
            Global: NullabilityOmittedNonRequiredField(Schema.Object),

            /**
             * The mode used for services with a finite number of tasks that run
             * to a completed state.
             */
            ReplicatedJob: NullabilityOmittedNonRequiredField(
                Schema.Struct({
                    /** The maximum number of replicas to run simultaneously. */
                    MaxConcurrent: NullabilityOmittedNonRequiredField(Schema.Number, { default: () => 1 }),

                    /**
                     * The total number of replicas desired to reach the
                     * Completed state. If unset, will default to the value of
                     * `MaxConcurrent`
                     */
                    TotalCompletions: NullabilityOmittedNonRequiredField(Schema.Number),
                })
            ),

            /**
             * The mode used for services which run a task to the completed
             * state on each valid node.
             */
            GlobalJob: NullabilityOmittedNonRequiredField(Schema.Object),
        })
    ),

    /** Specification for the update strategy of the service. */
    UpdateConfig: NullabilityOmittedNonRequiredField(
        Schema.Struct({
            /**
             * Maximum number of tasks to be updated in one iteration (0 means
             * unlimited parallelism).
             */
            Parallelism: NullabilityOmittedNonRequiredField(Schema.Number),

            /** Amount of time between updates, in nanoseconds. */
            Delay: NullabilityOmittedNonRequiredField(Schema.Number),

            /**
             * Action to take if an updated task fails to run, or stops running
             * during the update.
             */
            FailureAction: NullabilityOmittedNonRequiredField(
                Schema.Union(Schema.Literal("pause"), Schema.Literal("continue"), Schema.Literal("rollback"))
            ),

            /**
             * Amount of time to monitor each updated task for failures, in
             * nanoseconds.
             */
            Monitor: NullabilityOmittedNonRequiredField(Schema.Number),

            /**
             * The fraction of tasks that may fail during an update before the
             * failure action is invoked, specified as a floating point number
             * between 0 and 1.
             */
            MaxFailureRatio: NullabilityOmittedNonRequiredField(Schema.Number, { default: () => 0 }),

            /**
             * The order of operations when rolling out an updated task. Either
             * the old task is shut down before the new task is started, or the
             * new task is started before the old task is shut down.
             */
            Order: NullabilityOmittedNonRequiredField(
                Schema.Union(Schema.Literal("stop-first"), Schema.Literal("start-first"))
            ),
        })
    ),

    /** Specification for the rollback strategy of the service. */
    RollbackConfig: NullabilityOmittedNonRequiredField(
        Schema.Struct({
            /**
             * Maximum number of tasks to be rolled back in one iteration (0
             * means unlimited parallelism).
             */
            Parallelism: NullabilityOmittedNonRequiredField(Schema.Number),

            /** Amount of time between rollback iterations, in nanoseconds. */
            Delay: NullabilityOmittedNonRequiredField(Schema.Number),

            /**
             * Action to take if an rolled back task fails to run, or stops
             * running during the rollback.
             */
            FailureAction: NullabilityOmittedNonRequiredField(
                Schema.Union(Schema.Literal("pause"), Schema.Literal("continue"))
            ),

            /**
             * Amount of time to monitor each rolled back task for failures, in
             * nanoseconds.
             */
            Monitor: NullabilityOmittedNonRequiredField(Schema.Number),

            /**
             * The fraction of tasks that may fail during a rollback before the
             * failure action is invoked, specified as a floating point number
             * between 0 and 1.
             */
            MaxFailureRatio: NullabilityOmittedNonRequiredField(Schema.Number, { default: () => 0 }),

            /**
             * The order of operations when rolling back a task. Either the old
             * task is shut down before the new task is started, or the new task
             * is started before the old task is shut down.
             */
            Order: NullabilityOmittedNonRequiredField(
                Schema.Union(Schema.Literal("stop-first"), Schema.Literal("start-first"))
            ),
        })
    ),

    /** Specifies which networks the service should attach to. */
    Networks: NullabilityOmittedNonRequiredField(Schema.Array(NetworkAttachmentConfig)),
    EndpointSpec: NullabilityOmittedNonRequiredField(EndpointSpec),
}) {}

// FIXME: has top level nullability: true
export class Health extends Schema.Class<Health>("Health")({
    /**
     * Status is one of `none`, `starting`, `healthy` or `unhealthy`
     *
     * - "none" Indicates there is no healthcheck
     * - "starting" Starting indicates that the container is not yet ready
     * - "healthy" Healthy indicates that the container is running correctly
     * - "unhealthy" Unhealthy indicates that the container has a problem
     */
    Status: NullabilityOmittedNonRequiredField(
        Schema.Union(
            Schema.Literal("none"),
            Schema.Literal("starting"),
            Schema.Literal("healthy"),
            Schema.Literal("unhealthy")
        )
    ),

    /** FailingStreak is the number of consecutive failures */
    FailingStreak: NullabilityOmittedNonRequiredField(Schema.Number),

    /** Log contains the last few results (oldest first) */
    Log: NullabilityOmittedNonRequiredField(Schema.Array(HealthcheckResult)),
}) {}

// FIXME: has top level nullability: true
export class ContainerState extends Schema.Class<ContainerState>("ContainerState")({
    /**
     * String representation of the container state. Can be one of "created",
     * "running", "paused", "restarting", "removing", "exited", or "dead".
     */
    Status: NullabilityOmittedNonRequiredField(
        Schema.Union(
            Schema.Literal("created"),
            Schema.Literal("running"),
            Schema.Literal("paused"),
            Schema.Literal("restarting"),
            Schema.Literal("removing"),
            Schema.Literal("exited"),
            Schema.Literal("dead")
        )
    ),

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
    Running: NullabilityOmittedNonRequiredField(Schema.Boolean),

    /** Whether this container is paused. */
    Paused: NullabilityOmittedNonRequiredField(Schema.Boolean),

    /** Whether this container is restarting. */
    Restarting: NullabilityOmittedNonRequiredField(Schema.Boolean),

    /**
     * Whether a process within this container has been killed because it ran
     * out of memory since the container was last started.
     */
    OOMKilled: NullabilityOmittedNonRequiredField(Schema.Boolean),
    Dead: NullabilityOmittedNonRequiredField(Schema.Boolean),

    /** The process ID of this container */
    Pid: NullabilityOmittedNonRequiredField(Schema.Number),

    /** The last exit code of this container */
    ExitCode: NullabilityOmittedNonRequiredField(Schema.Number),
    Error: NullabilityOmittedNonRequiredField(Schema.String),

    /** The time when this container was last started. */
    StartedAt: NullabilityOmittedNonRequiredField(Schema.String),

    /** The time when this container last exited. */
    FinishedAt: NullabilityOmittedNonRequiredField(Schema.String),
    Health: NullabilityOmittedNonRequiredField(Health),
}) {}

export class EndpointSettings extends Schema.Class<EndpointSettings>("EndpointSettings")({
    IPAMConfig: NullabilityOmittedNonRequiredField(EndpointIPAMConfig),
    Links: NullabilityOmittedNonRequiredField(Schema.Array(Schema.String)),
    MacAddress: NullabilityOmittedNonRequiredField(Schema.String),
    Aliases: NullabilityOmittedNonRequiredField(Schema.Array(Schema.String)),

    /** Unique ID of the network. */
    NetworkID: NullabilityOmittedNonRequiredField(Schema.String),

    /** Unique ID for the service endpoint in a Sandbox. */
    EndpointID: NullabilityOmittedNonRequiredField(Schema.String),

    /** Gateway address for this network. */
    Gateway: NullabilityOmittedNonRequiredField(Schema.String),

    /** IPv4 address. */
    IPAddress: NullabilityOmittedNonRequiredField(Schema.String),

    /** Mask length of the IPv4 address. */
    IPPrefixLen: NullabilityOmittedNonRequiredField(Schema.Number),

    /** IPv6 gateway address. */
    IPv6Gateway: NullabilityOmittedNonRequiredField(Schema.String),

    /** Global IPv6 address. */
    GlobalIPv6Address: NullabilityOmittedNonRequiredField(Schema.String),

    /** Mask length of the global IPv6 address. */
    GlobalIPv6PrefixLen: NullabilityOmittedNonRequiredField(Schema.Number),

    /**
     * DriverOpts is a mapping of driver options and values. These options are
     * passed directly to the driver and are driver specific.
     */
    DriverOpts: NullableNonRequiredField(Schema.Record(Schema.String, Schema.String)),

    /**
     * List of all DNS names an endpoint has on a specific network. This list is
     * based on the container name, network aliases, container short ID, and
     * hostname. These DNS names are non-fully qualified but can contain several
     * dots. You can get fully qualified DNS names by appending
     * `.<network-name>`. For instance, if container name is `my.ctr` and the
     * network is named `testnet`, `DNSNames` will contain `my.ctr` and the FQDN
     * will be `my.ctr.testnet`.
     */
    DNSNames: NullableNonRequiredField(Schema.Array(Schema.String)),
}) {}

export class NetworkSettings extends Schema.Class<NetworkSettings>("NetworkSettings")({
    /** Name of the network's bridge (for example, `docker0`). */
    Bridge: NullabilityOmittedNonRequiredField(Schema.String),

    /** SandboxID uniquely represents a container's network stack. */
    SandboxID: NullabilityOmittedNonRequiredField(Schema.String),

    /** Indicates if hairpin NAT should be enabled on the virtual interface. */
    HairpinMode: NullabilityOmittedNonRequiredField(Schema.Boolean),

    /** IPv6 unicast address using the link-local prefix. */
    LinkLocalIPv6Address: NullabilityOmittedNonRequiredField(Schema.String),

    /** Prefix length of the IPv6 unicast address. */
    LinkLocalIPv6PrefixLen: NullabilityOmittedNonRequiredField(Schema.Number),
    Ports: NullabilityOmittedNonRequiredField(Schema.Record(Schema.String, Schema.Array(PortBinding))),

    /** SandboxKey identifies the sandbox */
    SandboxKey: NullabilityOmittedNonRequiredField(Schema.String),
    SecondaryIPAddresses: NullableNonRequiredField(Schema.Array(Address)),
    SecondaryIPv6Addresses: NullableNonRequiredField(Schema.Array(Address)),

    /**
     * EndpointID uniquely represents a service endpoint in a Sandbox.<p><br
     * /></p>> **Deprecated**: This field is only propagated when attached to
     * the> Default "bridge" network. Use the information from the "bridge"
     * network> Inside the `Networks` map instead, which contains the same
     * information.> This field was deprecated in Docker 1.9 and is scheduled to
     * be removed in> Docker 17.12.0
     */
    EndpointID: NullabilityOmittedNonRequiredField(Schema.String),

    /**
     * Gateway address for the default "bridge" network.<p><br /></p>>
     * **Deprecated**: This field is only propagated when attached to the>
     * Default "bridge" network. Use the information from the "bridge" network>
     * Inside the `Networks` map instead, which contains the same information.>
     * This field was deprecated in Docker 1.9 and is scheduled to be removed
     * in> Docker 17.12.0
     */
    Gateway: NullabilityOmittedNonRequiredField(Schema.String),

    /**
     * Global IPv6 address for the default "bridge" network.<p><br /></p>>
     * **Deprecated**: This field is only propagated when attached to the>
     * Default "bridge" network. Use the information from the "bridge" network>
     * Inside the `Networks` map instead, which contains the same information.>
     * This field was deprecated in Docker 1.9 and is scheduled to be removed
     * in> Docker 17.12.0
     */
    GlobalIPv6Address: NullabilityOmittedNonRequiredField(Schema.String),

    /**
     * Mask length of the global IPv6 address.<p><br /></p>> **Deprecated**:
     * This field is only propagated when attached to the> Default "bridge"
     * network. Use the information from the "bridge" network> Inside the
     * `Networks` map instead, which contains the same information.> This field
     * was deprecated in Docker 1.9 and is scheduled to be removed in> Docker
     * 17.12.0
     */
    GlobalIPv6PrefixLen: NullabilityOmittedNonRequiredField(Schema.Number),

    /**
     * IPv4 address for the default "bridge" network.<p><br /></p>>
     * **Deprecated**: This field is only propagated when attached to the>
     * Default "bridge" network. Use the information from the "bridge" network>
     * Inside the `Networks` map instead, which contains the same information.>
     * This field was deprecated in Docker 1.9 and is scheduled to be removed
     * in> Docker 17.12.0
     */
    IPAddress: NullabilityOmittedNonRequiredField(Schema.String),

    /**
     * Mask length of the IPv4 address.<p><br /></p>> **Deprecated**: This field
     * is only propagated when attached to the> Default "bridge" network. Use
     * the information from the "bridge" network> Inside the `Networks` map
     * instead, which contains the same information.> This field was deprecated
     * in Docker 1.9 and is scheduled to be removed in> Docker 17.12.0
     */
    IPPrefixLen: NullabilityOmittedNonRequiredField(Schema.Number),

    /**
     * IPv6 gateway address for this network.<p><br /></p>> **Deprecated**: This
     * field is only propagated when attached to the> Default "bridge" network.
     * Use the information from the "bridge" network> Inside the `Networks` map
     * instead, which contains the same information.> This field was deprecated
     * in Docker 1.9 and is scheduled to be removed in> Docker 17.12.0
     */
    IPv6Gateway: NullabilityOmittedNonRequiredField(Schema.String),

    /**
     * MAC address for the container on the default "bridge" network.<p><br
     * /></p>> **Deprecated**: This field is only propagated when attached to
     * the> Default "bridge" network. Use the information from the "bridge"
     * network> Inside the `Networks` map instead, which contains the same
     * information.> This field was deprecated in Docker 1.9 and is scheduled to
     * be removed in> Docker 17.12.0
     */
    MacAddress: NullabilityOmittedNonRequiredField(Schema.String),

    /** Information about all networks that the container is connected to. */
    Networks: NullabilityOmittedNonRequiredField(Schema.Record(Schema.String, EndpointSettings)),
}) {}

export class Plugin extends Schema.Class<Plugin>("Plugin")({
    Id: NullabilityOmittedNonRequiredField(Schema.String),
    Name: NonNullableRequiredField(Schema.String),

    /**
     * True if the plugin is running. False if the plugin is not running, only
     * installed.
     */
    Enabled: NonNullableRequiredField(Schema.Boolean),

    /** Settings that can be modified by users. */
    Settings: NonNullableRequiredField(
        Schema.Struct({
            Mounts: NullabilityOmittedNonRequiredField(Schema.Array(PluginMount)),
            Env: NullabilityOmittedNonRequiredField(Schema.Array(Schema.String)),
            Args: NullabilityOmittedNonRequiredField(Schema.Array(Schema.String)),
            Devices: NullabilityOmittedNonRequiredField(Schema.Array(PluginDevice)),
        })
    ),

    /** Plugin remote reference used to push/pull the plugin */
    PluginReference: NonNullableNonRequiredField(Schema.String),

    /** The config of a plugin. */
    Config: NonNullableNonRequiredField(
        Schema.Struct({
            /** Docker Version used to create the plugin */
            DockerVersion: Schema.optional(Schema.String),
            Description: Schema.String,
            Documentation: Schema.String,

            /** The interface between Docker and the plugin */
            Interface: Schema.NullOr(
                Schema.Struct({
                    Types: Schema.NullOr(Schema.Array(Schema.NullOr(PluginInterfaceType))),
                    Socket: Schema.String,

                    /** Protocol to use for clients connecting to the plugin. */
                    ProtocolScheme: Schema.optional(Schema.Enums(Plugin_Config_Interface_ProtocolScheme)),
                })
            ),
            Entrypoint: Schema.NullOr(Schema.Array(Schema.String)),
            WorkDir: Schema.String,
            User: Schema.optional(
                Schema.NullOr(
                    Schema.Struct({ UID: Schema.optional(Schema.Number), GID: Schema.optional(Schema.Number) })
                )
            ),
            Network: Schema.NullOr(Schema.Struct({ Type: Schema.String })),
            Linux: Schema.NullOr(
                Schema.Struct({
                    Capabilities: Schema.NullOr(Schema.Array(Schema.String)),
                    AllowAllDevices: Schema.Boolean,
                    Devices: Schema.NullOr(Schema.Array(Schema.NullOr(PluginDevice))),
                })
            ),
            PropagatedMount: Schema.String,
            IpcHost: Schema.Boolean,
            PidHost: Schema.Boolean,
            Mounts: Schema.NullOr(Schema.Array(Schema.NullOr(PluginMount))),
            Env: Schema.NullOr(Schema.Array(Schema.NullOr(PluginEnvironment))),
            Args: Schema.NullOr(
                Schema.Struct({
                    Name: Schema.String,
                    Description: Schema.String,
                    Settable: Schema.NullOr(Schema.Array(Schema.String)),
                    Value: Schema.NullOr(Schema.Array(Schema.String)),
                })
            ),
            rootfs: Schema.optional(
                Schema.NullOr(
                    Schema.Struct({
                        type: Schema.optional(Schema.String),
                        diff_ids: Schema.optional(Schema.NullOr(Schema.Array(Schema.String))),
                    })
                )
            ),
        })
    ),
}) {}

export class ContainerInspectResponse extends Schema.Class<ContainerInspectResponse>("ContainerInspectResponse")({
    /** The ID of the container */
    Id: Schema.optional(Schema.String),

    /** The time the container was created */
    Created: Schema.optional(Schema.String),

    /** The path to the command being run */
    Path: Schema.optional(Schema.String),

    /** The arguments to the command being run */
    Args: Schema.optional(Schema.NullOr(Schema.Array(Schema.String))),
    State: Schema.optional(Schema.NullOr(ContainerState)),

    /** The container's image ID */
    Image: Schema.optional(Schema.String),
    ResolvConfPath: Schema.optional(Schema.String),
    HostnamePath: Schema.optional(Schema.String),
    HostsPath: Schema.optional(Schema.String),
    LogPath: Schema.optional(Schema.String),
    Name: Schema.optional(Schema.String),
    RestartCount: Schema.optional(Schema.Number),
    Driver: Schema.optional(Schema.String),
    Platform: Schema.optional(Schema.String),
    MountLabel: Schema.optional(Schema.String),
    ProcessLabel: Schema.optional(Schema.String),
    AppArmorProfile: Schema.optional(Schema.String),

    /** IDs of exec instances that are running in the container. */
    ExecIDs: Schema.optional(Schema.NullOr(Schema.Array(Schema.String))),
    HostConfig: Schema.optional(Schema.NullOr(HostConfig)),
    GraphDriver: Schema.optional(Schema.NullOr(GraphDriverData)),

    /** The size of files that have been created or changed by this container. */
    SizeRw: Schema.optional(Schema.Number),

    /** The total size of all the files in this container. */
    SizeRootFs: Schema.optional(Schema.Number),
    Mounts: Schema.optional(Schema.NullOr(Schema.Array(Schema.NullOr(MountPoint)))),
    Config: Schema.optional(Schema.NullOr(ContainerConfig)),
    NetworkSettings: Schema.optional(Schema.NullOr(NetworkSettings)),
}) {}

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

export class ContainerTopResponse extends Schema.Class<ContainerTopResponse>()({
    /** The ps column titles */
    Titles: Schema.optional(Schema.NullOr(Schema.Array(Schema.String))),

    /**
     * Each process running in the container, where each is process is an array
     * of values corresponding to the titles.
     */
    Processes: Schema.optional(Schema.NullOr(Schema.Array(Schema.NullOr(Schema.Array(Schema.String))))),
}) {}

export class ContainerUpdateResponse extends Schema.Class<ContainerUpdateResponse>()({
    Warnings: Schema.optional(Schema.NullOr(Schema.Array(Schema.String))),
}) {}

export class ContainerPruneResponse extends Schema.Class<ContainerPruneResponse>()({
    /** Container IDs that were deleted */
    ContainersDeleted: Schema.optional(Schema.NullOr(Schema.Array(Schema.String))),

    /** Disk space reclaimed in bytes */
    SpaceReclaimed: Schema.optional(Schema.Number),
}) {}

export class BuildPruneResponse extends Schema.Class<BuildPruneResponse>()({
    CachesDeleted: Schema.optional(Schema.NullOr(Schema.Array(Schema.String))),

    /** Disk space reclaimed in bytes */
    SpaceReclaimed: Schema.optional(Schema.Number),
}) {}

export const HistoryResponseItem = Schema.Array(
    Schema.NullOr(
        Schema.Struct({
            Id: Schema.String,
            Created: Schema.Number,
            CreatedBy: Schema.String,
            Tags: Schema.NullOr(Schema.Array(Schema.String)),
            Size: Schema.Number,
            Comment: Schema.String,
        })
    )
);

export const ImageSearchResponseItem = Schema.Array(
    Schema.NullOr(
        Schema.Struct({
            description: Schema.optional(Schema.String),
            is_official: Schema.optional(Schema.Boolean),
            is_automated: Schema.optional(Schema.Boolean),
            name: Schema.optional(Schema.String),
            star_count: Schema.optional(Schema.Number),
        })
    )
);

export class SystemAuthResponse extends Schema.Class<SystemAuthResponse>()({
    /** The status of the authentication */
    Status: Schema.String,

    /** An opaque token used to authenticate a user after a successful login */
    IdentityToken: Schema.optional(Schema.String),
}) {}

export class ExecConfig extends Schema.Class<ExecConfig>()({
    /** Attach to `stdin` of the exec command. */
    AttachStdin: Schema.optional(Schema.Boolean),

    /** Attach to `stdout` of the exec command. */
    AttachStdout: Schema.optional(Schema.Boolean),

    /** Attach to `stderr` of the exec command. */
    AttachStderr: Schema.optional(Schema.Boolean),

    /** Initial console size, as an `[height, width]` array. */
    ConsoleSize: Schema.optional(Schema.NullOr(Schema.Array(Schema.Number))),

    /**
     * Override the key sequence for detaching a container. Format is a single
     * character `[a-Z]` or `ctrl-<value>` where `<value>` is one of: `a-z`,
     * `@`, `^`, `[`, `,` or `_`.
     */
    DetachKeys: Schema.optional(Schema.String),

    /** Allocate a pseudo-TTY. */
    Tty: Schema.optional(Schema.Boolean),

    /** A list of environment variables in the form `["VAR=value", ...]`. */
    Env: Schema.optional(Schema.NullOr(Schema.Array(Schema.String))),

    /** Command to run, as a string or array of strings. */
    Cmd: Schema.optional(Schema.NullOr(Schema.Array(Schema.String))),

    /** Runs the exec process with extended privileges. */
    Privileged: Schema.optional(Schema.Boolean),

    /**
     * The user, and optionally, group to run the exec process inside the
     * container. Format is one of: `user`, `user:group`, `uid`, or `uid:gid`.
     */
    User: Schema.optional(Schema.String),

    /** The working directory for the exec process inside the container. */
    WorkingDir: Schema.optional(Schema.String),
}) {}

export class ExecStartConfig extends Schema.Class<ExecStartConfig>()({
    /** Allocate a pseudo-TTY. */
    Tty: Schema.optional(Schema.Boolean),

    /** Initial console size, as an `[height, width]` array. */
    ConsoleSize: Schema.optional(Schema.NullOr(Schema.Array(Schema.Number))),
}) {}

export class VolumePruneResponse extends Schema.Class<VolumePruneResponse>()({
    /** Volumes that were deleted */
    VolumesDeleted: Schema.optional(Schema.NullOr(Schema.Array(Schema.String))),

    /** Disk space reclaimed in bytes */
    SpaceReclaimed: Schema.optional(Schema.Number),
}) {}

export class NetworkCreateResponse extends Schema.Class<NetworkCreateResponse>()({
    /** The ID of the created network. */
    Id: Schema.optional(Schema.String),
    Warning: Schema.optional(Schema.String),
}) {}

export class NetworkDisconnectRequest extends Schema.Class<NetworkDisconnectRequest>()({
    /** The ID or name of the container to disconnect from the network. */
    Container: Schema.optional(Schema.String),

    /** Force the container to disconnect from the network. */
    Force: Schema.optional(Schema.Boolean),
}) {}

export class NetworkPruneResponse extends Schema.Class<NetworkPruneResponse>()({
    /** Networks that were deleted */
    NetworksDeleted: Schema.optional(Schema.NullOr(Schema.Array(Schema.String))),
}) {}

export class SwarmJoinRequest extends Schema.Class<SwarmJoinRequest>()({
    /**
     * Listen address used for inter-manager communication if the node gets
     * promoted to manager, as well as determining the networking interface used
     * for the VXLAN Tunnel Endpoint (VTEP).
     */
    ListenAddr: Schema.optional(Schema.String),

    /**
     * Externally reachable address advertised to other nodes. This can either
     * be an address/port combination in the form `192.168.1.1:4567`, or an
     * interface followed by a port number, like `eth0:4567`. If the port number
     * is omitted, the port number from the listen address is used. If
     * `AdvertiseAddr` is not specified, it will be automatically detected when
     * possible.
     */
    AdvertiseAddr: Schema.optional(Schema.String),

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
    DataPathAddr: Schema.optional(Schema.String),

    /** Addresses of manager nodes already participating in the swarm. */
    RemoteAddrs: Schema.optional(Schema.NullOr(Schema.Array(Schema.String))),

    /** Secret token for joining this swarm. */
    JoinToken: Schema.optional(Schema.String),
}) {}

export class UnlockKeyResponse extends Schema.Class<UnlockKeyResponse>()({
    /** The swarm's unlock key. */
    UnlockKey: Schema.optional(Schema.String),
}) {}

export class SwarmUnlockRequest extends Schema.Class<SwarmUnlockRequest>()({
    /** The swarm's unlock key. */
    UnlockKey: Schema.optional(Schema.String),
}) {}

export class FilesystemChange extends Schema.Class<FilesystemChange>()({
    /** Path to file or directory that has changed. */
    Path: Schema.String,
    Kind: Schema.NullOr(Schema.Enums(ChangeType)),
}) {}

export class IPAM extends Schema.Class<IPAM>()({
    /** Name of the IPAM driver to use. */
    Driver: Schema.optional(Schema.String),

    /**
     * List of IPAM configuration options, specified as a map:
     *
     *     {"Subnet": <CIDR>, "IPRange": <CIDR>, "Gateway": <IP address>, "AuxAddress": <device_name:IP address>}
     */
    Config: Schema.optional(Schema.NullOr(Schema.Array(Schema.NullOr(IPAMConfig)))),

    /** Driver-specific options, specified as a map. */
    Options: Schema.optional(Schema.NullOr(Schema.Record(Schema.String, Schema.String))),
}) {}

export class BuildInfo extends Schema.Class<BuildInfo>()({
    id: Schema.optional(Schema.String),
    stream: Schema.optional(Schema.String),
    error: Schema.optional(Schema.String),
    errorDetail: Schema.optional(Schema.NullOr(ErrorDetail)),
    status: Schema.optional(Schema.String),
    progress: Schema.optional(Schema.String),
    progressDetail: Schema.optional(Schema.NullOr(ProgressDetail)),
    aux: Schema.optional(Schema.NullOr(ImageID)),
}) {}

export class CreateImageInfo extends Schema.Class<CreateImageInfo>()({
    id: Schema.optional(Schema.String),
    error: Schema.optional(Schema.String),
    errorDetail: Schema.optional(Schema.NullOr(ErrorDetail)),
    status: Schema.optional(Schema.String),
    progress: Schema.optional(Schema.String),
    progressDetail: Schema.optional(Schema.NullOr(ProgressDetail)),
}) {}

export class PushImageInfo extends Schema.Class<PushImageInfo>()({
    error: Schema.optional(Schema.String),
    status: Schema.optional(Schema.String),
    progress: Schema.optional(Schema.String),
    progressDetail: Schema.optional(Schema.NullOr(ProgressDetail)),
}) {}

export class SecretSpec extends Schema.Class<SecretSpec>()({
    /** User-defined name of the secret. */
    Name: Schema.optional(Schema.String),

    /** User-defined key/value metadata. */
    Labels: Schema.optional(Schema.NullOr(Schema.Record(Schema.String, Schema.String))),

    /**
     * Base64-url-safe-encoded ([RFC
     * 4648](https://tools.ietf.org/html/rfc4648#section-5)) data to store as
     * secret.
     *
     * This field is only used to _create_ a secret, and is not returned by
     * other endpoints.
     */
    Data: Schema.optional(Schema.String),
    Driver: Schema.optional(Schema.NullOr(Driver)),
    Templating: Schema.optional(Schema.NullOr(Driver)),
}) {}

export class ConfigSpec extends Schema.Class<ConfigSpec>()({
    /** User-defined name of the config. */
    Name: Schema.optional(Schema.String),

    /** User-defined key/value metadata. */
    Labels: Schema.optional(Schema.NullOr(Schema.Record(Schema.String, Schema.String))),

    /**
     * Base64-url-safe-encoded ([RFC
     * 4648](https://tools.ietf.org/html/rfc4648#section-5)) config data.
     */
    Data: Schema.optional(Schema.String),
    Templating: Schema.optional(Schema.NullOr(Driver)),
}) {}

export class ContainerWaitResponse extends Schema.Class<ContainerWaitResponse>()({
    /** Exit code of the container */
    StatusCode: Schema.Number,
    Error: Schema.optional(Schema.NullOr(ContainerWaitExitError)),
}) {}

export class EventMessage extends Schema.Class<EventMessage>()({
    /** The type of object emitting the event */
    Type: Schema.optional(Schema.Enums(EventMessage_Type)),

    /** The type of event */
    Action: Schema.optional(Schema.String),
    Actor: Schema.optional(Schema.NullOr(EventActor)),

    /**
     * Scope of the event. Engine events are `local` scope. Cluster (Swarm)
     * events are `swarm` scope.
     */
    scope: Schema.optional(Schema.Enums(EventMessage_scope)),

    /** Timestamp of event */
    time: Schema.optional(Schema.Number),

    /** Timestamp of event, with nanosecond accuracy */
    timeNano: Schema.optional(Schema.Number),
}) {}

export class DistributionInspect extends Schema.Class<DistributionInspect>()({
    Descriptor: Schema.NullOr(OCIDescriptor),

    /** An array containing all platforms supported by the image. */
    Platforms: Schema.NullOr(Schema.Array(Schema.NullOr(OCIPlatform))),
}) {}

export class ImagePruneResponse extends Schema.Class<ImagePruneResponse>()({
    /** Images that were deleted */
    ImagesDeleted: Schema.optional(Schema.NullOr(Schema.Array(Schema.NullOr(ImageDeleteResponseItem)))),

    /** Disk space reclaimed in bytes */
    SpaceReclaimed: Schema.optional(Schema.Number),
}) {}

export class ExecInspectResponse extends Schema.Class<ExecInspectResponse>()({
    CanRemove: Schema.optional(Schema.Boolean),
    DetachKeys: Schema.optional(Schema.String),
    ID: Schema.optional(Schema.String),
    Running: Schema.optional(Schema.Boolean),
    ExitCode: Schema.optional(Schema.Number),
    ProcessConfig: Schema.optional(Schema.NullOr(ProcessConfig)),
    OpenStdin: Schema.optional(Schema.Boolean),
    OpenStderr: Schema.optional(Schema.Boolean),
    OpenStdout: Schema.optional(Schema.Boolean),
    ContainerID: Schema.optional(Schema.String),

    /** The system process ID for the exec process. */
    Pid: Schema.optional(Schema.Number),
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
    ListenAddr: Schema.optional(Schema.String),

    /**
     * Externally reachable address advertised to other nodes. This can either
     * be an address/port combination in the form `192.168.1.1:4567`, or an
     * interface followed by a port number, like `eth0:4567`. If the port number
     * is omitted, the port number from the listen address is used. If
     * `AdvertiseAddr` is not specified, it will be automatically detected when
     * possible.
     */
    AdvertiseAddr: Schema.optional(Schema.String),

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
    DataPathAddr: Schema.optional(Schema.String),

    /**
     * DataPathPort specifies the data path port number for data traffic.
     * Acceptable port range is 1024 to 49151. if no port is set or is set to 0,
     * default port 4789 will be used.
     */
    DataPathPort: Schema.optional(Schema.Number),

    /**
     * Default Address Pool specifies default subnet pools for global scope
     * networks.
     */
    DefaultAddrPool: Schema.optional(Schema.NullOr(Schema.Array(Schema.String))),

    /** Force creation of a new swarm. */
    ForceNewCluster: Schema.optional(Schema.Boolean),

    /**
     * SubnetSize specifies the subnet size of the networks created from the
     * default subnet pool.
     */
    SubnetSize: Schema.optional(Schema.Number),
    Spec: Schema.optional(Schema.NullOr(SwarmSpec)),
}) {}

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
    Binds: Schema.optional(Schema.NullOr(Schema.Array(Schema.String))),

    /** Path to a file where the container ID is written */
    ContainerIDFile: Schema.optional(Schema.String),

    /** The logging configuration for this container */
    LogConfig: Schema.optional(
        Schema.NullOr(
            Schema.Struct({
                Type: Schema.optional(Schema.Enums(HostConfig_1_LogConfig_Type)),
                Config: Schema.optional(Schema.NullOr(Schema.Record(Schema.String, Schema.String))),
            })
        )
    ),

    /**
     * Network mode to use for this container. Supported standard values are:
     * `bridge`, `host`, `none`, and `container:<name|id>`. Any other value is
     * taken as a custom network's name to which this container should connect
     * to.
     */
    NetworkMode: Schema.optional(Schema.String),
    PortBindings: Schema.optional(Schema.NullOr(PortMap)),
    RestartPolicy: Schema.optional(Schema.NullOr(RestartPolicy)),

    /**
     * Automatically remove the container when the container's process exits.
     * This has no effect if `RestartPolicy` is set.
     */
    AutoRemove: Schema.optional(Schema.Boolean),

    /** Driver that this container uses to mount volumes. */
    VolumeDriver: Schema.optional(Schema.String),

    /**
     * A list of volumes to inherit from another container, specified in the
     * form `<container name>[:<ro|rw>]`.
     */
    VolumesFrom: Schema.optional(Schema.NullOr(Schema.Array(Schema.String))),

    /** Specification for mounts to be added to the container. */
    Mounts: Schema.optional(Schema.NullOr(Schema.Array(Schema.NullOr(Mount)))),

    /** Initial console size, as an `[height, width]` array. */
    ConsoleSize: Schema.optional(Schema.NullOr(Schema.Array(Schema.Number))),

    /**
     * Arbitrary non-identifying metadata attached to container and provided to
     * the runtime when the container is started.
     */
    Annotations: Schema.optional(Schema.NullOr(Schema.Record(Schema.String, Schema.String))),

    /**
     * A list of kernel capabilities to add to the container. Conflicts with
     * option 'Capabilities'.
     */
    CapAdd: Schema.optional(Schema.NullOr(Schema.Array(Schema.String))),

    /**
     * A list of kernel capabilities to drop from the container. Conflicts with
     * option 'Capabilities'.
     */
    CapDrop: Schema.optional(Schema.NullOr(Schema.Array(Schema.String))),

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
    CgroupnsMode: Schema.optional(Schema.Enums(HostConfig_1_CgroupnsMode)),

    /** A list of DNS servers for the container to use. */
    Dns: Schema.optional(Schema.NullOr(Schema.Array(Schema.String))),

    /** A list of DNS options. */
    DnsOptions: Schema.optional(Schema.NullOr(Schema.Array(Schema.String))),

    /** A list of DNS search domains. */
    DnsSearch: Schema.optional(Schema.NullOr(Schema.Array(Schema.String))),

    /**
     * A list of hostnames/IP mappings to add to the container's `/etc/hosts`
     * file. Specified in the form `["hostname:IP"]`.
     */
    ExtraHosts: Schema.optional(Schema.NullOr(Schema.Array(Schema.String))),

    /** A list of additional groups that the container process will run as. */
    GroupAdd: Schema.optional(Schema.NullOr(Schema.Array(Schema.String))),

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
    IpcMode: Schema.optional(Schema.String),

    /** Cgroup to use for the container. */
    Cgroup: Schema.optional(Schema.String),

    /** A list of links for the container in the form `container_name:alias`. */
    Links: Schema.optional(Schema.NullOr(Schema.Array(Schema.String))),

    /**
     * An integer value containing the score given to the container in order to
     * tune OOM killer preferences.
     */
    OomScoreAdj: Schema.optional(Schema.Number),

    /**
     * Set the PID (Process) Namespace mode for the container. It can be either:
     *
     * - `"container:<name|id>"`: joins another container's PID namespace
     * - `"host"`: use the host's PID namespace inside the container
     */
    PidMode: Schema.optional(Schema.String),

    /** Gives the container full access to the host. */
    Privileged: Schema.optional(Schema.Boolean),

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
    PublishAllPorts: Schema.optional(Schema.Boolean),

    /** Mount the container's root filesystem as read only. */
    ReadonlyRootfs: Schema.optional(Schema.Boolean),

    /**
     * A list of string values to customize labels for MLS systems, such as
     * SELinux.
     */
    SecurityOpt: Schema.optional(Schema.NullOr(Schema.Array(Schema.String))),

    /**
     * Storage driver options for this container, in the form `{"size":
     * "120G"}`.
     */
    StorageOpt: Schema.optional(Schema.NullOr(Schema.Record(Schema.String, Schema.String))),

    /**
     * A map of container directories which should be replaced by tmpfs mounts,
     * and their corresponding mount options. For example:
     *
     *     { "/run": "rw,noexec,nosuid,size=65536k" }
     */
    Tmpfs: Schema.optional(Schema.NullOr(Schema.Record(Schema.String, Schema.String))),

    /** UTS namespace to use for the container. */
    UTSMode: Schema.optional(Schema.String),

    /**
     * Sets the usernamespace mode for the container when usernamespace
     * remapping option is enabled.
     */
    UsernsMode: Schema.optional(Schema.String),

    /** Size of `/dev/shm` in bytes. If omitted, the system uses 64MB. */
    ShmSize: Schema.optional(Schema.Number),

    /**
     * A list of kernel parameters (sysctls) to set in the container. For
     * example:
     *
     *     { "net.ipv4.ip_forward": "1" }
     */
    Sysctls: Schema.optional(Schema.NullOr(Schema.Record(Schema.String, Schema.String))),

    /** Runtime to use with this container. */
    Runtime: Schema.optional(Schema.String),

    /** Isolation technology of the container. (Windows only) */
    Isolation: Schema.optional(Schema.Enums(HostConfig_1_Isolation)),

    /**
     * The list of paths to be masked inside the container (this overrides the
     * default set of paths).
     */
    MaskedPaths: Schema.optional(Schema.NullOr(Schema.Array(Schema.String))),

    /**
     * The list of paths to be set as read-only inside the container (this
     * overrides the default set of paths).
     */
    ReadonlyPaths: Schema.optional(Schema.NullOr(Schema.Array(Schema.String))),
}) {}

export class HostConfig extends HostConfig_1.extend<HostConfig>()({}) {}

export class NetworkingConfig extends Schema.Class<NetworkingConfig>()({
    /** A mapping of network name to endpoint configuration for that network. */
    EndpointsConfig: Schema.optional(Schema.NullOr(Schema.Record(Schema.String, Schema.NullOr(EndpointSettings)))),
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
    Id: Schema.optional(Schema.String),

    /**
     * List of image names/tags in the local image cache that reference this
     * image.
     *
     * Multiple image tags can refer to the same image, and this list may be
     * empty if no tags reference the image, in which case the image is
     * "untagged", in which case it can still be referenced by its ID.
     */
    RepoTags: Schema.optional(Schema.NullOr(Schema.Array(Schema.String))),

    /**
     * List of content-addressable digests of locally available image manifests
     * that the image is referenced from. Multiple manifests can refer to the
     * same image.
     *
     * These digests are usually only available if the image was either pulled
     * from a registry, or if the image was pushed to a registry, which is when
     * the manifest is generated and its digest calculated.
     */
    RepoDigests: Schema.optional(Schema.NullOr(Schema.Array(Schema.String))),

    /**
     * ID of the parent image.
     *
     * Depending on how the image was created, this field may be empty and is
     * only set for images that were built/created locally. This field is empty
     * if the image was pulled from an image registry.
     */
    Parent: Schema.optional(Schema.String),

    /** Optional message that was set when committing or importing the image. */
    Comment: Schema.optional(Schema.String),

    /**
     * Date and time at which the image was created, formatted in [RFC
     * 3339](https://www.ietf.org/rfc/rfc3339.txt) format with nano-seconds.
     */
    Created: Schema.optional(Schema.String),

    /**
     * The ID of the container that was used to create the image.
     *
     * Depending on how the image was created, this field may be empty.
     */
    Container: Schema.optional(Schema.String),
    ContainerConfig: Schema.optional(Schema.NullOr(ContainerConfig)),

    /**
     * The version of Docker that was used to build the image.
     *
     * Depending on how the image was created, this field may be empty.
     */
    DockerVersion: Schema.optional(Schema.String),

    /**
     * Name of the author that was specified when committing the image, or as
     * specified through MAINTAINER (deprecated) in the Dockerfile.
     */
    Author: Schema.optional(Schema.String),
    Config: Schema.optional(Schema.NullOr(ContainerConfig)),

    /** Hardware CPU architecture that the image runs on. */
    Architecture: Schema.optional(Schema.String),

    /** CPU architecture variant (presently ARM-only). */
    Variant: Schema.optional(Schema.String),

    /** Operating System the image is built to run on. */
    Os: Schema.optional(Schema.String),

    /**
     * Operating System version the image is built to run on (especially for
     * Windows).
     */
    OsVersion: Schema.optional(Schema.String),

    /** Total size of the image including all layers it is composed of. */
    Size: Schema.optional(Schema.Number),

    /**
     * Total size of the image including all layers it is composed of.
     *
     * In versions of Docker before v1.10, this field was calculated from the
     * image itself and all of its parent images. Images are now stored
     * self-contained, and no longer use a parent-chain, making this field an
     * equivalent of the Size field.> **Deprecated**: this field is kept for
     * backward compatibility, but> Will be removed in API v1.44.
     */
    VirtualSize: Schema.optional(Schema.Number),
    GraphDriver: Schema.optional(Schema.NullOr(GraphDriverData)),

    /** Information about the image's RootFS, including the layer IDs. */
    RootFS: Schema.optional(
        Schema.NullOr(
            Schema.Struct({
                Type: Schema.String,
                Layers: Schema.optional(Schema.NullOr(Schema.Array(Schema.String))),
            })
        )
    ),

    /**
     * Additional metadata of the image in the local cache. This information is
     * local to the daemon, and not part of the image itself.
     */
    Metadata: Schema.optional(
        Schema.NullOr(
            Schema.Struct({
                /**
                 * Date and time at which the image was last tagged in [RFC
                 * 3339](https://www.ietf.org/rfc/rfc3339.txt) format with
                 * nano-seconds.
                 *
                 * This information is only available if the image was tagged
                 * locally, and omitted otherwise.
                 */
                LastTagTime: Schema.optional(Schema.String),
            })
        )
    ),
}) {}

export class VolumeCreateOptions extends Schema.Class<VolumeCreateOptions>()({
    /** The new volume's name. If not specified, Docker generates a name. */
    Name: Schema.optional(Schema.String),

    /** Name of the volume driver to use. */
    Driver: Schema.optional(Schema.String),

    /**
     * A mapping of driver options and values. These options are passed directly
     * to the driver and are driver specific.
     */
    DriverOpts: Schema.optional(Schema.NullOr(Schema.Record(Schema.String, Schema.String))),

    /** User-defined key/value metadata. */
    Labels: Schema.optional(Schema.NullOr(Schema.Record(Schema.String, Schema.String))),
    ClusterVolumeSpec: Schema.optional(Schema.NullOr(ClusterVolumeSpec)),
}) {}

export class Network extends Schema.Class<Network>()({
    Name: Schema.optional(Schema.String),
    Id: Schema.optional(Schema.String),
    Created: Schema.optional(Schema.String),
    Scope: Schema.optional(Schema.String),
    Driver: Schema.optional(Schema.String),
    EnableIPv6: Schema.optional(Schema.Boolean),
    IPAM: Schema.optional(Schema.NullOr(IPAM)),
    Internal: Schema.optional(Schema.Boolean),
    Attachable: Schema.optional(Schema.Boolean),
    Ingress: Schema.optional(Schema.Boolean),
    Containers: Schema.optional(Schema.NullOr(Schema.Record(Schema.String, Schema.NullOr(NetworkContainer)))),
    Options: Schema.optional(Schema.NullOr(Schema.Record(Schema.String, Schema.String))),
    Labels: Schema.optional(Schema.NullOr(Schema.Record(Schema.String, Schema.String))),
}) {}

export class Swarm_0 extends ClusterInfo.extend<Swarm_0>()({}) {}

export class Swarm_1 extends Schema.Class<Swarm_1>()({ JoinTokens: Schema.optional(Schema.NullOr(JoinTokens)) }) {}

export class Swarm extends Swarm_1.extend<Swarm>()({}) {}

export class ContainerSummary extends Schema.Class<ContainerSummary>()({
    /** The ID of this container */
    Id: Schema.optional(Schema.String),

    /** The names that this container has been given */
    Names: Schema.optional(Schema.NullOr(Schema.Array(Schema.String))),

    /** The name of the image used when creating this container */
    Image: Schema.optional(Schema.String),

    /** The ID of the image that this container was created from */
    ImageID: Schema.optional(Schema.String),

    /** Command to run when starting the container */
    Command: Schema.optional(Schema.String),

    /** When the container was created */
    Created: Schema.optional(Schema.Number),

    /** The ports exposed by this container */
    Ports: Schema.optional(Schema.NullOr(Schema.Array(Schema.NullOr(Port)))),

    /** The size of files that have been created or changed by this container */
    SizeRw: Schema.optional(Schema.Number),

    /** The total size of all the files in this container */
    SizeRootFs: Schema.optional(Schema.Number),

    /** User-defined key/value metadata. */
    Labels: Schema.optional(Schema.NullOr(Schema.Record(Schema.String, Schema.String))),

    /** The state of this container (e.g. `Exited`) */
    State: Schema.optional(Schema.String),

    /** Additional human-readable status of this container (e.g. `Exit 0`) */
    Status: Schema.optional(Schema.String),
    HostConfig: Schema.optional(Schema.NullOr(Schema.Struct({ NetworkMode: Schema.optional(Schema.String) }))),

    /** A summary of the container's network settings */
    NetworkSettings: Schema.optional(
        Schema.NullOr(
            Schema.Struct({
                Networks: Schema.optional(Schema.NullOr(Schema.Record(Schema.String, Schema.NullOr(EndpointSettings)))),
            })
        )
    ),
    Mounts: Schema.optional(Schema.NullOr(Schema.Array(Schema.NullOr(MountPoint)))),
}) {}

export class Secret extends Schema.Class<Secret>()({
    ID: Schema.optional(Schema.String),
    Version: Schema.optional(Schema.NullOr(ObjectVersion)),
    CreatedAt: Schema.optional(Schema.String),
    UpdatedAt: Schema.optional(Schema.String),
    Spec: Schema.optional(Schema.NullOr(SecretSpec)),
}) {}

export class Config extends Schema.Class<Config>()({
    ID: Schema.optional(Schema.String),
    Version: Schema.optional(Schema.NullOr(ObjectVersion)),
    CreatedAt: Schema.optional(Schema.String),
    UpdatedAt: Schema.optional(Schema.String),
    Spec: Schema.optional(Schema.NullOr(ConfigSpec)),
}) {}

export class NetworkCreateRequest extends Schema.Class<NetworkCreateRequest>()({
    /** The network's name. */
    Name: Schema.String,

    /**
     * Check for networks with duplicate names. Since Network is primarily keyed
     * based on a random ID and not on the name, and network name is strictly a
     * user-friendly alias to the network which is uniquely identified using ID,
     * there is no guaranteed way to check for duplicates. CheckDuplicate is
     * there to provide a best effort checking of any networks which has the
     * same name but it is not guaranteed to catch all name collisions.
     */
    CheckDuplicate: Schema.optional(Schema.Boolean),

    /** Name of the network driver plugin to use. */
    Driver: Schema.optional(Schema.String),

    /** Restrict external access to the network. */
    Internal: Schema.optional(Schema.Boolean),

    /**
     * Globally scoped network is manually attachable by regular containers from
     * workers in swarm mode.
     */
    Attachable: Schema.optional(Schema.Boolean),

    /**
     * Ingress network is the network which provides the routing-mesh in swarm
     * mode.
     */
    Ingress: Schema.optional(Schema.Boolean),
    IPAM: Schema.optional(Schema.NullOr(IPAM)),

    /** Enable IPv6 on the network. */
    EnableIPv6: Schema.optional(Schema.Boolean),

    /** Network specific options to be used by the drivers. */
    Options: Schema.optional(Schema.NullOr(Schema.Record(Schema.String, Schema.String))),

    /** User-defined key/value metadata. */
    Labels: Schema.optional(Schema.NullOr(Schema.Record(Schema.String, Schema.String))),
}) {}

export class NetworkConnectRequest extends Schema.Class<NetworkConnectRequest>()({
    /** The ID or name of the container to connect to the network. */
    Container: Schema.optional(Schema.String),
    EndpointConfig: Schema.optional(Schema.NullOr(EndpointSettings)),
}) {}

export class VolumeListResponse extends Schema.Class<VolumeListResponse>()({
    /** List of volumes */
    Volumes: Schema.optional(Schema.NullOr(Schema.Array(Schema.NullOr(Volume)))),

    /** Warnings that occurred when fetching the list of volumes. */
    Warnings: Schema.optional(Schema.NullOr(Schema.Array(Schema.String))),
}) {}

export class Service extends Schema.Class<Service>()({
    ID: Schema.optional(Schema.String),
    Version: Schema.optional(Schema.NullOr(ObjectVersion)),
    CreatedAt: Schema.optional(Schema.String),
    UpdatedAt: Schema.optional(Schema.String),
    Spec: Schema.optional(Schema.NullOr(ServiceSpec)),
    Endpoint: Schema.optional(
        Schema.NullOr(
            Schema.Struct({
                Spec: Schema.optional(Schema.NullOr(EndpointSpec)),
                Ports: Schema.optional(Schema.NullOr(Schema.Array(Schema.NullOr(EndpointPortConfig)))),
                VirtualIPs: Schema.optional(
                    Schema.NullOr(
                        Schema.Array(
                            Schema.NullOr(
                                Schema.Struct({
                                    NetworkID: Schema.optional(Schema.String),
                                    Addr: Schema.optional(Schema.String),
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
        Schema.NullOr(
            Schema.Struct({
                State: Schema.optional(Schema.Enums(Service_UpdateStatus_State)),
                StartedAt: Schema.optional(Schema.String),
                CompletedAt: Schema.optional(Schema.String),
                Message: Schema.optional(Schema.String),
            })
        )
    ),

    /**
     * The status of the service's tasks. Provided only when requested as part
     * of a ServiceList operation.
     */
    ServiceStatus: Schema.optional(
        Schema.NullOr(
            Schema.Struct({
                /**
                 * The number of tasks for the service currently in the Running
                 * state.
                 */
                RunningTasks: Schema.optional(Schema.Number),

                /**
                 * The number of tasks for the service desired to be running.
                 * For replicated services, this is the replica count from the
                 * service spec. For global services, this is computed by taking
                 * count of all tasks for the service with a Desired State other
                 * than Shutdown.
                 */
                DesiredTasks: Schema.optional(Schema.Number),

                /**
                 * The number of tasks for a job that are in the Completed
                 * state. This field must be cross-referenced with the service
                 * type, as the value of 0 may mean the service is not in a job
                 * mode, or it may mean the job-mode service has no tasks yet
                 * Completed.
                 */
                CompletedTasks: Schema.optional(Schema.Number),
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
        Schema.NullOr(
            Schema.Struct({
                JobIteration: Schema.optional(Schema.NullOr(ObjectVersion)),

                /**
                 * The last time, as observed by the server, that this job was
                 * started.
                 */
                LastExecution: Schema.optional(Schema.String),
            })
        )
    ),
}) {}

export class SystemDataUsageResponse extends Schema.Class<SystemDataUsageResponse>()({
    LayersSize: Schema.optional(Schema.Number),
    Images: Schema.optional(Schema.NullOr(Schema.Array(Schema.NullOr(ImageSummary)))),
    Containers: Schema.optional(Schema.NullOr(Schema.Array(Schema.NullOr(ContainerSummary)))),
    Volumes: Schema.optional(Schema.NullOr(Schema.Array(Schema.NullOr(Volume)))),
    BuildCache: Schema.optional(Schema.NullOr(Schema.Array(Schema.NullOr(BuildCache)))),
}) {}

export class ContainerUpdateSpec extends Resources.extend<ContainerUpdateSpec>()({
    RestartPolicy: Schema.optional(RestartPolicy),
}) {}

export class ContainerCreateSpec extends ContainerConfig.extend<ContainerCreateSpec>()({
    HostConfig: Schema.optional(HostConfig),
    NetworkingConfig: Schema.optional(NetworkingConfig),
}) {}
